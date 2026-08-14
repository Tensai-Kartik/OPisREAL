import { Character } from '@/types/character';
import { ClueItem } from '@/types/game';

export function getUnlockedClues(target: Character, guessCount: number): ClueItem[] {
  const clues: ClueItem[] = [
    {
      level: 1,
      unlockedAt: 10,
      label: 'First Appearance',
      text: target.first_appearance
        ? `First appeared in ${target.first_appearance}${target.first_arc ? ` (${target.first_arc})` : ''}.`
        : `First appeared in the ${target.first_arc || 'Grand Line'} storyline.`,
      isUnlocked: guessCount >= 10,
    },
    {
      level: 2,
      unlockedAt: 15,
      label: 'Occupation',
      text:
        target.occupations && target.occupations.length > 0
          ? `Known occupation: ${target.occupations.join(', ')}.`
          : 'Independent actor.',
      isUnlocked: guessCount >= 15,
    },
    {
      level: 3,
      unlockedAt: 20,
      label: 'Affiliation',
      text:
        target.affiliations && target.affiliations.length > 0
          ? `Associated with: ${target.affiliations.join(', ')}.`
          : 'Operates without a major crew.',
      isUnlocked: guessCount >= 20,
    },
    {
      level: 4,
      unlockedAt: 25,
      label: 'Origin',
      text: `Hails from: ${target.origin}.`,
      isUnlocked: guessCount >= 25,
    },
  ];

  return clues;
}
