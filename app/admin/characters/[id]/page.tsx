'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  ShieldCheck,
  Eye,
  Plus,
  X,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Tag,
  Users,
  Briefcase,
  Compass,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { Character, CharacterFieldEvidence, HakiType } from '@/types/character';
import CharacterAvatar from '@/components/game/CharacterAvatar';

const SUGGESTED_AFFILIATIONS = [
  'Straw Hat Pirates',
  'Marines',
  'Revolutionary Army',
  'Cross Guild',
  'Red Hair Pirates',
  'Blackbeard Pirates',
  'Whitebeard Pirates',
  'Beasts Pirates',
  'Big Mom Pirates',
  'Heart Pirates',
  'Kid Pirates',
  'Roger Pirates',
  'Seven Warlords of the Sea',
  'CP0',
  'CP9',
  'Baroque Works',
  'Sun Pirates',
  'Kozuki Clan',
  'Kuja Pirates',
  'Donquixote Pirates',
];

const SUGGESTED_OCCUPATIONS = [
  'Captain',
  'Swordsman',
  'Combatant',
  'Navigator',
  'Sniper',
  'Cook',
  'Doctor',
  'Archaeologist',
  'Shipwright',
  'Musician',
  'Helmsman',
  'Fleet Admiral',
  'Admiral',
  'Vice Admiral',
  'Rear Admiral',
  'Captain (Marine)',
  'Marine',
  'Shogun',
  'Samurai',
  'Ninja',
  'Scientist',
  'King',
  'Queen',
  'Princess',
  'Emperor',
  'Assassin',
  'Thief',
  'Bounty Hunter',
];

const SUGGESTED_ORIGINS = [
  'East Blue',
  'West Blue',
  'North Blue',
  'South Blue',
  'Grand Line',
  'Red Line',
  'Fish-Man Island',
  'Sky Island',
  'Wano Country',
  'Zou',
  'Elbaf',
  'Unknown',
];

const SUGGESTED_ARCS = [
  'Romance Dawn',
  'Orange Town',
  'Syrup Village',
  'Baratie',
  'Arlong Park',
  'Loguetown',
  'Reverse Mountain',
  'Whiskey Peak',
  'Little Garden',
  'Drum Island',
  'Alabasta',
  'Jaya',
  'Skypiea',
  'Long Ring Long Land',
  'Water 7',
  'Enies Lobby',
  'Post-Enies Lobby',
  'Thriller Bark',
  'Sabaody Archipelago',
  'Amazon Lily',
  'Impel Down',
  'Marineford',
  'Post-War',
  'Return to Sabaody',
  'Fish-Man Island',
  'Punk Hazard',
  'Dressrosa',
  'Zou',
  'Whole Cake Island',
  'Levely',
  'Wano Country',
  'Egghead',
  'Elbaf',
];

export default function AdminCharacterEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [character, setCharacter] = useState<Character | null>(null);
  const [evidence, setEvidence] = useState<CharacterFieldEvidence[]>([]);
  const [affiliations, setAffiliations] = useState<string[]>([]);
  const [occupations, setOccupations] = useState<string[]>([]);
  const [hakiList, setHakiList] = useState<{ haki_type: HakiType; custom_haki?: string }[]>([]);
  const [aliases, setAliases] = useState<{ alias: string; alias_type: string }[]>([]);

  const [newAffiliation, setNewAffiliation] = useState('');
  const [newOccupation, setNewOccupation] = useState('');
  const [newAlias, setNewAlias] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showEvidence, setShowEvidence] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/admin/characters/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setErrorMsg(data.error);
        else {
          const char = data.character;
          // Ensure alias is synced
          if (!char.alias && char.romanized_name) {
            char.alias = char.romanized_name;
          }
          setCharacter(char);
          setEvidence(data.evidence || []);
          setAffiliations(data.affiliations || []);
          setOccupations(data.occupations || []);
          setHakiList(data.haki || []);

          // Format aliases from table or character.alias string
          const loadedAliases = data.aliases || [];
          if (loadedAliases.length === 0 && char.alias) {
            const parsed = char.alias
              .split(/,\s*/)
              .filter(Boolean)
              .map((a: string) => ({ alias: a.trim(), alias_type: 'alias' }));
            setAliases(parsed);
          } else {
            setAliases(loadedAliases);
          }
        }
      })
      .catch(() => setErrorMsg('Failed to fetch character details.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!character) return;
    if (!confirm(`Are you sure you want to permanently delete "${character.name}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/characters/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/characters');
      } else {
        alert(data.error || 'Failed to delete character');
      }
    } catch {
      alert('Network error deleting character');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = () => {
    if (!character) return;
    setIsSaving(true);
    setSaveSuccess(false);

    // Build the consolidated alias string
    const aliasString = aliases.map((a) => a.alias).filter(Boolean).join(', ');

    const verifiedPayload = {
      ...character,
      alias: aliasString || character.alias || null,
      romanized_name: aliasString || character.alias || null,
      verification_status: 'verified' as const,
      is_active: true,
      is_canon: true,
    };
    setCharacter(verifiedPayload);

    fetch(`/api/admin/characters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        character: verifiedPayload,
        affiliations,
        occupations,
        haki: hakiList,
        aliases,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        } else {
          setErrorMsg(data.error || 'Failed to save');
        }
      })
      .catch(() => setErrorMsg('Save error'))
      .finally(() => setIsSaving(false));
  };

  const toggleHaki = (type: HakiType) => {
    const exists = hakiList.some((h) => h.haki_type === type);
    if (exists) {
      setHakiList(hakiList.filter((h) => h.haki_type !== type));
    } else {
      setHakiList([...hakiList, { haki_type: type }]);
    }
  };

  // Helper functions for tags
  const addAlias = (aliasText: string) => {
    const trimmed = aliasText.trim();
    if (!trimmed) return;
    if (!aliases.some((a) => a.alias.toLowerCase() === trimmed.toLowerCase())) {
      const updated = [...aliases, { alias: trimmed, alias_type: 'alias' }];
      setAliases(updated);
      if (character) {
        setCharacter({
          ...character,
          alias: updated.map((a) => a.alias).join(', '),
        });
      }
    }
    setNewAlias('');
  };

  const removeAlias = (index: number) => {
    const updated = aliases.filter((_, idx) => idx !== index);
    setAliases(updated);
    if (character) {
      setCharacter({
        ...character,
        alias: updated.map((a) => a.alias).join(', '),
      });
    }
  };

  const addAffiliation = (aff: string) => {
    const trimmed = aff.trim();
    if (!trimmed) return;
    if (!affiliations.some((a) => a.toLowerCase() === trimmed.toLowerCase())) {
      setAffiliations([...affiliations, trimmed]);
    }
    setNewAffiliation('');
  };

  const removeAffiliation = (index: number) => {
    setAffiliations(affiliations.filter((_, idx) => idx !== index));
  };

  const addOccupation = (occ: string) => {
    const trimmed = occ.trim();
    if (!trimmed) return;
    if (!occupations.some((o) => o.toLowerCase() === trimmed.toLowerCase())) {
      setOccupations([...occupations, trimmed]);
    }
    setNewOccupation('');
  };

  const removeOccupation = (index: number) => {
    setOccupations(occupations.filter((_, idx) => idx !== index));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
        <p className="text-slate-400 text-xs">Loading character editor...</p>
      </div>
    );
  }

  if (errorMsg || !character) {
    return (
      <div className="p-6 bg-slate-900 border border-red-500/40 rounded-xl text-center max-w-md mx-auto my-12">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-slate-300 text-sm">{errorMsg || 'Character not found'}</p>
        <Link href="/admin/characters" className="mt-4 inline-block px-4 py-2 gold-button rounded-lg text-xs font-bold uppercase">
          Back to List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/95 backdrop-blur-md p-4 border border-slate-800 rounded-xl sticky top-20 z-30 shadow-xl">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/characters"
            className="p-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight flex items-center space-x-2">
              <span>{character.name}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
                {character.verification_status}
              </span>
            </h1>
            <p className="text-xs text-slate-400">Canonical Character Fact & Gameplay Fact Editor</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="px-3.5 py-2 bg-slate-950 border border-amber-600/40 text-amber-400 hover:bg-slate-800 rounded-lg text-xs font-bold uppercase flex items-center space-x-1.5 cursor-pointer transition"
          >
            <Eye className="w-4 h-4" />
            <span>{showEvidence ? 'Hide Sources' : 'Inspect Evidence'}</span>
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            className="px-3.5 py-2 bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 hover:text-white rounded-lg text-xs font-bold uppercase flex items-center space-x-1.5 transition disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            <span>Delete</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isDeleting}
            className="px-5 py-2 gold-button rounded-lg text-xs font-bold uppercase flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer shadow-md"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Verification</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-green-950/80 border border-green-500/50 rounded-xl text-green-300 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>Character canonical record & game facts saved successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Fields (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity & Image Management */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Identity & Portrait</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Canonical Name *</label>
                <input
                  type="text"
                  value={character.name || ''}
                  onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-bold focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Japanese Name</label>
                <input
                  type="text"
                  value={character.japanese_name || ''}
                  onChange={(e) => setCharacter({ ...character, japanese_name: e.target.value })}
                  placeholder="e.g. ロロノア・ゾロ"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500"
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-slate-400 font-semibold mb-1">Alias / Epithets String (Comma-Separated)</label>
                <input
                  type="text"
                  value={character.alias || character.romanized_name || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCharacter({ ...character, alias: val, romanized_name: val });
                    const split = val
                      .split(/,\s*/)
                      .filter(Boolean)
                      .map((a) => ({ alias: a.trim(), alias_type: 'alias' }));
                    setAliases(split);
                  }}
                  placeholder="e.g. Pirate Hunter, King of Hell, Zorojuro, Marimo"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-amber-300 font-semibold focus:border-amber-500"
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-slate-400 font-semibold mb-1">Image URL (Portrait / Avatar)</label>
                <div className="flex items-center space-x-3">
                  <CharacterAvatar
                    src={character.image_url}
                    name={character.name}
                    size="lg"
                    className="border border-amber-600/50 shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={character.image_url || ''}
                      onChange={(e) => setCharacter({ ...character, image_url: e.target.value })}
                      placeholder="https://cdn.myanimelist.net/images/characters/..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 text-xs"
                    />
                    <p className="text-[11px] text-slate-400">
                      💡 Direct HTTPS links from MyAnimeList, Supabase Storage, or Imgur work best.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Aliases Tag Editor */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center space-x-2">
              <Tag className="w-4 h-4 text-amber-400" />
              <span>Aliases & Epithets Manager ({aliases.length})</span>
            </h3>
            <p className="text-xs text-slate-400">
              Users can search by any of these aliases in the game search bar to guess this character.
            </p>

            <div className="flex flex-wrap gap-2 min-h-[36px] p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
              {aliases.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No individual aliases added yet.</span>
              ) : (
                aliases.map((a, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-950/60 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-bold"
                  >
                    <span>&quot;{a.alias}&quot;</span>
                    <button
                      type="button"
                      onClick={() => removeAlias(idx)}
                      className="text-amber-400/60 hover:text-red-400 ml-1 cursor-pointer"
                      title="Remove alias"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newAlias}
                onChange={(e) => setNewAlias(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAlias(newAlias);
                  }
                }}
                placeholder="Type a new alias and press Enter (e.g. 'King of Hell')..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => addAlias(newAlias)}
                disabled={!newAlias.trim()}
                className="px-4 py-2 gold-button rounded-lg text-xs font-bold uppercase flex items-center space-x-1 disabled:opacity-40 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Affiliations Manager */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center space-x-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Affiliations & Crews ({affiliations.length})</span>
            </h3>

            <div className="flex flex-wrap gap-2 min-h-[36px] p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
              {affiliations.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No affiliations specified.</span>
              ) : (
                affiliations.map((aff, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 bg-sky-950/60 border border-sky-500/40 text-sky-300 rounded-lg text-xs font-bold"
                  >
                    <span>{aff}</span>
                    <button
                      type="button"
                      onClick={() => removeAffiliation(idx)}
                      className="text-sky-400/60 hover:text-red-400 ml-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newAffiliation}
                onChange={(e) => setNewAffiliation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAffiliation(newAffiliation);
                  }
                }}
                placeholder="Type crew or group name (e.g. 'Straw Hat Pirates')..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:border-sky-500"
              />
              <button
                type="button"
                onClick={() => addAffiliation(newAffiliation)}
                disabled={!newAffiliation.trim()}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold uppercase flex items-center space-x-1 disabled:opacity-40 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Quick Suggestions */}
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">Quick Suggestions:</span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_AFFILIATIONS.slice(0, 10).map((sugg) => (
                  <button
                    key={sugg}
                    type="button"
                    onClick={() => addAffiliation(sugg)}
                    className="text-[10px] px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 transition cursor-pointer"
                  >
                    + {sugg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Occupations Manager */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Occupations & Roles ({occupations.length})</span>
            </h3>

            <div className="flex flex-wrap gap-2 min-h-[36px] p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
              {occupations.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No occupations specified.</span>
              ) : (
                occupations.map((occ, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-bold"
                  >
                    <span>{occ}</span>
                    <button
                      type="button"
                      onClick={() => removeOccupation(idx)}
                      className="text-emerald-400/60 hover:text-red-400 ml-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newOccupation}
                onChange={(e) => setNewOccupation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addOccupation(newOccupation);
                  }
                }}
                placeholder="Type role or job (e.g. 'Swordsman', 'Captain')..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => addOccupation(newOccupation)}
                disabled={!newOccupation.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase flex items-center space-x-1 disabled:opacity-40 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Quick Suggestions */}
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">Quick Suggestions:</span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_OCCUPATIONS.slice(0, 10).map((sugg) => (
                  <button
                    key={sugg}
                    type="button"
                    onClick={() => addOccupation(sugg)}
                    className="text-[10px] px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 transition cursor-pointer"
                  >
                    + {sugg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Gameplay Story & Debut Lore */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center space-x-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Origin & Story Debut Facts</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Origin *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={character.origin || ''}
                    onChange={(e) => setCharacter({ ...character, origin: e.target.value })}
                    placeholder="e.g. East Blue, Wano Country"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500"
                  />
                  <select
                    onChange={(e) => {
                      if (e.target.value) setCharacter({ ...character, origin: e.target.value });
                    }}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 text-slate-400 text-xs"
                    defaultValue=""
                  >
                    <option value="" disabled>Presets</option>
                    {SUGGESTED_ORIGINS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">First Appearance (Chapter / Ep)</label>
                <input
                  type="text"
                  value={character.first_appearance || ''}
                  onChange={(e) => setCharacter({ ...character, first_appearance: e.target.value })}
                  placeholder="e.g. Chapter 3"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">First Storyline Arc</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={character.first_arc || ''}
                    onChange={(e) => setCharacter({ ...character, first_arc: e.target.value })}
                    placeholder="e.g. Romance Dawn"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500"
                  />
                  <select
                    onChange={(e) => {
                      if (e.target.value) setCharacter({ ...character, first_arc: e.target.value });
                    }}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 text-slate-400 text-xs"
                    defaultValue=""
                  >
                    <option value="" disabled>Arc Presets</option>
                    {SUGGESTED_ARCS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Birthday</label>
                  <input
                    type="text"
                    value={character.birthday || ''}
                    onChange={(e) => setCharacter({ ...character, birthday: e.target.value })}
                    placeholder="e.g. November 11"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Blood Type</label>
                  <input
                    type="text"
                    value={character.blood_type || ''}
                    onChange={(e) => setCharacter({ ...character, blood_type: e.target.value })}
                    placeholder="e.g. X, F, S, XF"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                  />
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-slate-400 font-semibold mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={character.description || ''}
                  onChange={(e) => setCharacter({ ...character, description: e.target.value })}
                  placeholder="Canonical background notes..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Physical Attributes & Status */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Physical Attributes & Status</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Gender</label>
                <select
                  value={character.gender || 'Unknown'}
                  onChange={(e) => setCharacter({ ...character, gender: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-semibold"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unknown">Unknown</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Race</label>
                <select
                  value={character.race || 'Human'}
                  onChange={(e) => setCharacter({ ...character, race: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-semibold"
                >
                  <option value="Human">Human</option>
                  <option value="Fish-Man">Fish-Man</option>
                  <option value="Merfolk">Merfolk</option>
                  <option value="Mink">Mink</option>
                  <option value="Giant">Giant</option>
                  <option value="Lunarian">Lunarian</option>
                  <option value="Cyborg">Cyborg</option>
                  <option value="Oni">Oni</option>
                  <option value="Buccaneer">Buccaneer</option>
                  <option value="Ancient Giant">Ancient Giant</option>
                  <option value="Sky Island">Sky Island</option>
                  <option value="Animal">Animal</option>
                  <option value="Other">Other</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Status</label>
                <select
                  value={character.status || 'Alive'}
                  onChange={(e) => setCharacter({ ...character, status: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-semibold"
                >
                  <option value="Alive">Alive</option>
                  <option value="Dead">Dead</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-400 font-semibold">Bounty (Berries)</label>
                  <div className="flex items-center space-x-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setCharacter({ ...character, bounty: 0 })}
                      className={`px-1.5 py-0.5 rounded border transition cursor-pointer ${
                        character.bounty === 0
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      None (0)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCharacter({ ...character, bounty: null })}
                      className={`px-1.5 py-0.5 rounded border transition cursor-pointer ${
                        character.bounty === null || character.bounty === undefined
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      Unknown
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  placeholder="e.g. 3000000000"
                  value={character.bounty ?? ''}
                  onChange={(e) =>
                    setCharacter({
                      ...character,
                      bounty: e.target.value === '' ? null : Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-amber-300 font-bold focus:border-amber-500"
                />
                <div className="text-[10px] text-slate-500 mt-1">
                  {character.bounty === 0
                    ? 'Status: None (0 Berries)'
                    : character.bounty === null || character.bounty === undefined
                      ? 'Status: Unknown / Undisclosed'
                      : `Status: ${character.bounty.toLocaleString()} Berries`}
                </div>
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={character.age ?? ''}
                  onChange={(e) => setCharacter({ ...character, age: e.target.value ? Number(e.target.value) : null })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={character.height ?? ''}
                  onChange={(e) => setCharacter({ ...character, height: e.target.value ? Number(e.target.value) : null })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Devil Fruit & Haki Multi-select */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              Powers: Devil Fruit & Haki
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Devil Fruit Name</label>
                <input
                  type="text"
                  value={character.devil_fruit_name || ''}
                  onChange={(e) => setCharacter({ ...character, devil_fruit_name: e.target.value })}
                  placeholder="e.g. Hito Hito no Mi, Model: Nika"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Devil Fruit Type</label>
                <select
                  value={character.devil_fruit_type || 'None'}
                  onChange={(e) => setCharacter({ ...character, devil_fruit_type: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                >
                  <option value="Paramecia">Paramecia</option>
                  <option value="Special Paramecia">Special Paramecia</option>
                  <option value="Zoan">Zoan</option>
                  <option value="Ancient Zoan">Ancient Zoan</option>
                  <option value="Mythical Zoan">Mythical Zoan</option>
                  <option value="Artificial Zoan">Artificial Zoan</option>
                  <option value="Logia">Logia</option>
                  <option value="None">None (No Fruit)</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
            </div>

            {/* Haki Multi-Select Checklist */}
            <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
              <label className="block text-slate-400 font-semibold mb-2">Verified Haki Types (Multi-Select)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['Observation', 'Armament', 'Conqueror', 'Other'] as HakiType[]).map((ht) => {
                  const isChecked = hakiList.some((h) => h.haki_type === ht);
                  return (
                    <button
                      key={ht}
                      type="button"
                      onClick={() => toggleHaki(ht)}
                      className={`p-3 rounded-lg border text-left flex items-center justify-between font-bold transition cursor-pointer ${
                        isChecked
                          ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <span>{ht}</span>
                      <input type="checkbox" checked={isChecked} readOnly className="accent-amber-500" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Image Preview & Evidence Inspector */}
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center shadow-lg sticky top-36">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
              Portrait Preview
            </h3>
            <div className="w-40 h-40 mx-auto rounded-xl overflow-hidden border-2 border-amber-600/40 bg-slate-950 mb-3 shadow-lg flex items-center justify-center">
              <img
                src={character.image_url || 'https://via.placeholder.com/150?text=OP'}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="font-extrabold text-slate-100 text-sm">{character.name}</div>
            {character.japanese_name && (
              <div className="text-xs text-amber-400 font-semibold">{character.japanese_name}</div>
            )}
            <div className="text-[11px] text-slate-400 mt-2">
              Source: <span className="text-slate-200">{character.image_source_name || 'Wiki Dataset'}</span>
            </div>

            {/* Quick action buttons in sidebar */}
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={handleSave}
                disabled={isSaving || isDeleting}
                className="w-full py-2.5 gold-button rounded-lg text-xs font-bold uppercase flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer shadow-md"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Fact Sheet</span>
              </button>
            </div>
          </div>

          {/* Evidence Inspector Box */}
          {showEvidence && (
            <div className="p-5 bg-slate-900 border border-amber-600/50 rounded-xl space-y-3 shadow-xl">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Source Evidence Inspector</span>
              </h3>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 text-xs">
                {evidence.length === 0 ? (
                  <p className="text-slate-500 italic">No external source evidence logged yet.</p>
                ) : (
                  evidence.map((ev) => (
                    <div key={ev.id} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex justify-between font-bold text-slate-200">
                        <span className="capitalize">{ev.field_name}</span>
                        <span className="text-amber-400">{ev.source_id}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Value: <span className="text-slate-100">{ev.normalized_value}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
