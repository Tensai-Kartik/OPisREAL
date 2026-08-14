import { Character } from './character';

export type MatchStatus = 'correct' | 'partial' | 'incorrect' | 'higher' | 'lower' | 'earlier' | 'later' | 'unknown';

export interface AttributeMatch {
  status: MatchStatus;
  value: string | number | string[] | null;
  displayValue: string;
}

export interface GuessComparison {
  character: Character;
  gender: AttributeMatch;
  race: AttributeMatch;
  status: AttributeMatch;
  devilFruit: AttributeMatch;
  devilFruitType: AttributeMatch;
  haki: AttributeMatch;
  affiliation: AttributeMatch;
  occupation: AttributeMatch;
  bounty: AttributeMatch;
  age: AttributeMatch;
  height: AttributeMatch;
  origin: AttributeMatch;
  firstAppearance: AttributeMatch;
  isCorrect: boolean;
}

export interface ClueItem {
  level: number;
  unlockedAt: number;
  label: string;
  text: string;
  isUnlocked: boolean;
}

export interface StartGameResponse {
  gameId: string;
  sessionToken: string;
  totalActiveCharacters: number;
}

export interface SubmitGuessRequest {
  gameId: string;
  sessionToken: string;
  guessCharacterId: string;
}

export interface SubmitGuessResponse {
  gameId: string;
  guessCount: number;
  comparison: GuessComparison;
  isCorrect: boolean;
  targetCharacterCard?: Character | null; // revealed only on victory
  unlockedClues: ClueItem[];
}
