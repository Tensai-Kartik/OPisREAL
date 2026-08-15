import { createSlug } from '../normalization/normalizer';

export interface MatchCandidate {
  id: string;
  name: string;
  slug: string;
  japanese_name?: string | null;
  alias?: string | null;
  romanized_name?: string | null;
  aliases?: string[];
}

export interface MatchResult {
  confidence: number;
  matchedId?: string;
  reason: string;
}

export function matchCharacter(
  inputName: string,
  inputRomanized?: string | null,
  inputAliases: string[] = [],
  candidates: MatchCandidate[] = []
): MatchResult {
  const inputSlug = createSlug(inputName);

  for (const candidate of candidates) {
    // 100% - Exact slug match
    if (candidate.slug === inputSlug) {
      return { confidence: 1.0, matchedId: candidate.id, reason: 'Exact slug match' };
    }

    // 95% - Exact name or alias match
    if (candidate.name.toLowerCase() === inputName.toLowerCase()) {
      return { confidence: 0.95, matchedId: candidate.id, reason: 'Exact name match' };
    }
    if (
      (inputRomanized && candidate.alias && candidate.alias.toLowerCase() === inputRomanized.toLowerCase()) ||
      (inputRomanized && candidate.romanized_name && candidate.romanized_name.toLowerCase() === inputRomanized.toLowerCase())
    ) {
      return { confidence: 0.95, matchedId: candidate.id, reason: 'Exact alias match' };
    }

    // 90% - Alias / epithet match
    if (candidate.aliases) {
      for (const alias of candidate.aliases) {
        if (alias.toLowerCase() === inputName.toLowerCase()) {
          return { confidence: 0.9, matchedId: candidate.id, reason: 'Alias match' };
        }
      }
    }
  }

  return { confidence: 0.0, reason: 'No match found' };
}
