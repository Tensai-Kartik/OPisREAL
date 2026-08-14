import { createAdminClient } from '../../lib/supabase/admin';
import { getWikiDatasetCharacters } from '../../lib/importers/WikiDatasetAdapter';
import { fetchOnePieceAPICharacters } from '../../lib/importers/OnePieceAPIAdapter';
import { fetchJikanCharacters } from '../../lib/importers/JikanAPIAdapter';
import { getHakiDataset } from '../../lib/importers/HakiDatasetAdapter';
import { normalizeRawCharacter, NormalizedCharacterData } from '../../lib/normalization/normalizer';
import { recordEvidenceAndReconcile } from '../../lib/reconciliation/reconciler';
import { ImportSummaryReport } from '../../types/import';
import { RawCharacterRecord } from '../../types/source';

export async function runFullImport(): Promise<ImportSummaryReport> {
  console.log('--- Starting One Piece Unified Ingestion Pipeline ---');
  const supabase = createAdminClient();

  let recordsFetched = 0;
  let charactersCreated = 0;
  let charactersMatched = 0;
  let fieldsSourced = 0;
  let imagesAvailable = 0;
  let imagesMissing = 0;

  // 1. Collect records from all adapters
  console.log('Fetching Canon Wiki dataset...');
  const wikiRaw = getWikiDatasetCharacters();
  console.log(`Wiki dataset count: ${wikiRaw.length}`);

  console.log('Fetching One Piece REST API (/v2/characters/en)...');
  const apiRaw = await fetchOnePieceAPICharacters();
  console.log(`REST API dataset count: ${apiRaw.length}`);

  console.log('Fetching Jikan MAL API (anime/21/characters)...');
  const jikanRaw = await fetchJikanCharacters();
  console.log(`Jikan API dataset count: ${jikanRaw.length}`);

  recordsFetched = wikiRaw.length + apiRaw.length + jikanRaw.length;

  // Combine and deduplicate records by normalized slug
  // Order of priority: 1. WikiRaw (highest), 2. apiRaw, 3. jikanRaw
  const combinedMap = new Map<string, NormalizedCharacterData>();
  const recordSources = new Map<string, string>();

  function processRecord(raw: RawCharacterRecord) {
    if (!raw.name || raw.name.trim().length === 0) return;
    const norm = normalizeRawCharacter(raw);
    if (!norm.slug || norm.slug.length === 0) return;

    if (!combinedMap.has(norm.slug)) {
      combinedMap.set(norm.slug, norm);
      recordSources.set(norm.slug, raw.source_id);
    } else {
      // Merge into existing normalized record
      const existing = combinedMap.get(norm.slug)!;
      combinedMap.set(norm.slug, {
        ...existing,
        japanese_name: existing.japanese_name || norm.japanese_name,
        romanized_name: existing.romanized_name || norm.romanized_name,
        gender: existing.gender !== 'Unknown' ? existing.gender : norm.gender,
        race: existing.race !== 'Unknown' ? existing.race : norm.race,
        status: existing.status !== 'Unknown' ? existing.status : norm.status,
        age: existing.age !== null ? existing.age : norm.age,
        height: existing.height !== null ? existing.height : norm.height,
        bounty: existing.bounty !== null ? existing.bounty : norm.bounty,
        birthday: existing.birthday || norm.birthday,
        blood_type: existing.blood_type || norm.blood_type,
        origin: existing.origin !== 'Grand Line' && existing.origin !== 'Unknown' ? existing.origin : norm.origin,
        first_appearance: existing.first_appearance || norm.first_appearance,
        first_arc: existing.first_arc || norm.first_arc,
        devil_fruit_name: existing.devil_fruit_name || norm.devil_fruit_name,
        devil_fruit_type: existing.devil_fruit_type !== 'None' ? existing.devil_fruit_type : norm.devil_fruit_type,
        devil_fruit_model: existing.devil_fruit_model || norm.devil_fruit_model,
        description: existing.description || norm.description,
        image_url: existing.image_url || norm.image_url,
        aliases: Array.from(new Set([...existing.aliases, ...norm.aliases])),
        affiliations: Array.from(new Set([...existing.affiliations, ...norm.affiliations])),
        occupations: Array.from(new Set([...existing.occupations, ...norm.occupations])),
        haki: existing.haki.length > 0 ? existing.haki : norm.haki,
      });
    }
  }

  // Process in order of source priority
  wikiRaw.forEach(processRecord);
  apiRaw.forEach(processRecord);
  jikanRaw.forEach(processRecord);

  // Apply Haki dataset enrichment
  const hakiData = getHakiDataset();
  const hakiMap = new Map(hakiData.map((h) => [h.characterSlug, h]));

  for (const [slug, norm] of combinedMap.entries()) {
    if (hakiMap.has(slug)) {
      const h = hakiMap.get(slug)!;
      const hakiTypes: { hakiType: any }[] = [];
      if (h.observation) hakiTypes.push({ hakiType: 'Observation' });
      if (h.armament) hakiTypes.push({ hakiType: 'Armament' });
      if (h.conqueror) hakiTypes.push({ hakiType: 'Conqueror' });
      if (hakiTypes.length > 0) {
        norm.haki = hakiTypes;
      }
    }
  }

  console.log(`Unique characters consolidated: ${combinedMap.size}`);

  // Fetch existing characters in bulk from DB
  const { data: dbCharacters } = await supabase
    .from('characters')
    .select('id, name, slug, image_url, bounty, age, height');

  const existingSlugMap = new Map((dbCharacters || []).map((c) => [c.slug, c]));

  const normList = Array.from(combinedMap.values());
  const CHUNK_SIZE = 25;

  for (let i = 0; i < normList.length; i += CHUNK_SIZE) {
    const chunk = normList.slice(i, i + CHUNK_SIZE);
    await Promise.all(
      chunk.map(async (norm) => {
        if (norm.image_url) imagesAvailable++;
        else imagesMissing++;

        const existing = existingSlugMap.get(norm.slug);
        let charId: string;

        if (existing) {
          charId = existing.id;
          charactersMatched++;

          const updateObj: Record<string, any> = {
            name: norm.name,
            updated_at: new Date().toISOString(),
          };

          if (norm.japanese_name) updateObj.japanese_name = norm.japanese_name;
          if (norm.romanized_name) updateObj.romanized_name = norm.romanized_name;
          if (norm.gender) updateObj.gender = norm.gender;
          if (norm.race) updateObj.race = norm.race;
          if (norm.status) updateObj.status = norm.status;
          if (norm.age !== null) updateObj.age = norm.age;
          if (norm.height !== null) updateObj.height = norm.height;
          if (norm.bounty !== null) updateObj.bounty = norm.bounty;
          if (norm.birthday) updateObj.birthday = norm.birthday;
          if (norm.blood_type) updateObj.blood_type = norm.blood_type;
          if (norm.origin) updateObj.origin = norm.origin;
          if (norm.first_appearance) updateObj.first_appearance = norm.first_appearance;
          if (norm.first_arc) updateObj.first_arc = norm.first_arc;
          if (norm.devil_fruit_name) updateObj.devil_fruit_name = norm.devil_fruit_name;
          if (norm.devil_fruit_type) updateObj.devil_fruit_type = norm.devil_fruit_type;
          if (norm.devil_fruit_model) updateObj.devil_fruit_model = norm.devil_fruit_model;
          if (norm.description) updateObj.description = norm.description;
          if (norm.image_url) updateObj.image_url = norm.image_url;

          await supabase.from('characters').update(updateObj).eq('id', charId);

          if (norm.affiliations.length > 0) {
            await supabase.from('character_affiliations').delete().eq('character_id', charId);
          }
          if (norm.occupations.length > 0) {
            await supabase.from('character_occupations').delete().eq('character_id', charId);
          }
          if (norm.aliases.length > 0) {
            await supabase.from('character_aliases').delete().eq('character_id', charId);
          }
        } else {
          const { data: newChar, error } = await supabase
            .from('characters')
            .insert({
              name: norm.name,
              slug: norm.slug,
              japanese_name: norm.japanese_name,
              romanized_name: norm.romanized_name,
              gender: norm.gender,
              race: norm.race,
              status: norm.status,
              age: norm.age,
              height: norm.height,
              bounty: norm.bounty,
              birthday: norm.birthday,
              blood_type: norm.blood_type,
              origin: norm.origin,
              first_appearance: norm.first_appearance,
              first_arc: norm.first_arc,
              devil_fruit_name: norm.devil_fruit_name,
              devil_fruit_type: norm.devil_fruit_type,
              devil_fruit_model: norm.devil_fruit_model,
              description: norm.description,
              image_url: norm.image_url,
              is_canon: true,
              is_active: true,
              verification_status: 'sourced',
            })
            .select('id')
            .single();

          if (error || !newChar) {
            console.error(`Failed to insert ${norm.name}:`, error?.message);
            return;
          }

          charId = newChar.id;
          charactersCreated++;
        }

        const src = recordSources.get(norm.slug) || 'ingestion-pipeline';
        await recordEvidenceAndReconcile(charId, src, norm);
        fieldsSourced += 11;
      })
    );
  }

  const report: ImportSummaryReport = {
    sourcesProcessed: 4,
    recordsFetched,
    charactersCreated,
    charactersMatched,
    charactersDuplicates: 0,
    charactersNeedsReview: 0,
    fieldsConsensus: fieldsSourced,
    fieldsSourced,
    fieldsConflicts: 0,
    fieldsMissing: imagesMissing,
    errorsCount: 0,
    imagesAvailable,
    imagesMissing,
    timestamp: new Date().toISOString(),
  };

  console.log('====================================');
  console.log('ONE PIECE DATA IMPORT SUMMARY REPORT');
  console.log('====================================');
  console.log(`Sources processed: ${report.sourcesProcessed}`);
  console.log(`Total Records:     ${report.recordsFetched}`);
  console.log(`Characters Created: ${report.charactersCreated}`);
  console.log(`Characters Matched: ${report.charactersMatched}`);
  console.log(`Fields Sourced:     ${report.fieldsSourced}`);
  console.log(`Images Available:   ${report.imagesAvailable}`);
  console.log(`Completed at:       ${report.timestamp}`);

  return report;
}

if (require.main === module) {
  runFullImport().catch(console.error);
}
