import { Character } from '@/types/character';
import { AttributeMatch, GuessComparison } from '@/types/game';

function compareNumeric(guessVal?: number | null, targetVal?: number | null, unit: string = ''): AttributeMatch {
  if (guessVal === null || guessVal === undefined) {
    return { status: 'unknown', value: null, displayValue: 'Unknown' };
  }

  const display = `${guessVal.toLocaleString()} ${unit}`.trim();

  if (targetVal === null || targetVal === undefined) {
    return { status: 'unknown', value: guessVal, displayValue: display };
  }

  if (guessVal === targetVal) {
    return { status: 'correct', value: guessVal, displayValue: display };
  }
  if (targetVal > guessVal) {
    return { status: 'higher', value: guessVal, displayValue: display };
  }
  return { status: 'lower', value: guessVal, displayValue: display };
}

function compareBounty(guessBounty?: number | null, targetBounty?: number | null): AttributeMatch {
  const isGuessNone = guessBounty === 0;
  const isGuessUnknown = guessBounty === null || guessBounty === undefined;
  const guessDisplay = isGuessNone
    ? 'None'
    : isGuessUnknown
      ? 'Unknown'
      : `${guessBounty.toLocaleString()} Berries`;

  const isTargetNone = targetBounty === 0;
  const isTargetUnknown = targetBounty === null || targetBounty === undefined;

  // If guess bounty is Unknown
  if (isGuessUnknown) {
    if (isTargetUnknown) {
      return { status: 'correct', value: null, displayValue: 'Unknown' };
    }
    return { status: 'unknown', value: null, displayValue: 'Unknown' };
  }

  // If guess bounty is None (0)
  if (isGuessNone) {
    if (isTargetNone) {
      return { status: 'correct', value: 0, displayValue: 'None' };
    }
    if (isTargetUnknown) {
      return { status: 'unknown', value: 0, displayValue: 'None' };
    }
    return { status: 'higher', value: 0, displayValue: 'None' };
  }

  // Guess has numeric bounty (> 0)
  if (isTargetUnknown) {
    return { status: 'unknown', value: guessBounty, displayValue: guessDisplay };
  }
  if (isTargetNone) {
    return { status: 'lower', value: guessBounty, displayValue: guessDisplay };
  }

  // Both have numeric bounties > 0
  if (guessBounty === targetBounty) {
    return { status: 'correct', value: guessBounty, displayValue: guessDisplay };
  }
  if (targetBounty! > guessBounty!) {
    return { status: 'higher', value: guessBounty, displayValue: guessDisplay };
  }
  return { status: 'lower', value: guessBounty, displayValue: guessDisplay };
}

function compareSet(guessSet: string[] = [], targetSet: string[] = []): AttributeMatch {
  const gClean = guessSet.map((s) => s.trim().toLowerCase()).filter(Boolean);
  const tClean = targetSet.map((s) => s.trim().toLowerCase()).filter(Boolean);

  if (gClean.length === 0 && tClean.length === 0) {
    return { status: 'correct', value: [], displayValue: 'None' };
  }
  if (gClean.length === 0 || tClean.length === 0) {
    return { status: 'incorrect', value: guessSet, displayValue: guessSet.join(', ') || 'None' };
  }

  const gSet = new Set(gClean);
  const tSet = new Set(tClean);

  const isExact = gSet.size === tSet.size && [...gSet].every((item) => tSet.has(item));
  if (isExact) {
    return { status: 'correct', value: guessSet, displayValue: guessSet.join(', ') };
  }

  const hasOverlap = [...gSet].some((item) => tSet.has(item));
  if (hasOverlap) {
    return { status: 'partial', value: guessSet, displayValue: guessSet.join(', ') };
  }

  return { status: 'incorrect', value: guessSet, displayValue: guessSet.join(', ') };
}

export function compareCharacters(guess: Character, target: Character): GuessComparison {
  // Gender
  const genderMatch: AttributeMatch = {
    status: guess.gender === target.gender ? 'correct' : 'incorrect',
    value: guess.gender,
    displayValue: guess.gender,
  };

  // Race
  const raceMatch: AttributeMatch = {
    status: guess.race === target.race ? 'correct' : 'incorrect',
    value: guess.race,
    displayValue: guess.race,
  };

  // Status
  const statusMatch: AttributeMatch = {
    status: guess.status === target.status ? 'correct' : 'incorrect',
    value: guess.status,
    displayValue: guess.status,
  };

  // Devil Fruit
  let fruitMatchStatus: 'correct' | 'partial' | 'incorrect' | 'unknown' = 'incorrect';
  const guessFruit = guess.devil_fruit_name || 'None';
  const targetFruit = target.devil_fruit_name || 'None';

  if (guessFruit.toLowerCase() === targetFruit.toLowerCase() && guessFruit !== 'None') {
    fruitMatchStatus = 'correct';
  } else if (guess.devil_fruit_type === target.devil_fruit_type) {
    fruitMatchStatus = 'partial';
  } else if (guessFruit === 'None' && targetFruit === 'None') {
    fruitMatchStatus = 'correct';
  }

  const devilFruitMatch: AttributeMatch = {
    status: fruitMatchStatus,
    value: guessFruit,
    displayValue: guessFruit,
  };

  const devilFruitTypeMatch: AttributeMatch = {
    status: guess.devil_fruit_type === target.devil_fruit_type ? 'correct' : 'incorrect',
    value: guess.devil_fruit_type,
    displayValue: guess.devil_fruit_type,
  };

  // Haki
  const guessHakiList = (guess.haki || []).map((h) => h.haki_type);
  const targetHakiList = (target.haki || []).map((h) => h.haki_type);
  const hakiMatch = compareSet(guessHakiList, targetHakiList);

  // Affiliation
  const affiliationMatch = compareSet(guess.affiliations || [], target.affiliations || []);

  // Occupation
  const occupationMatch = compareSet(guess.occupations || [], target.occupations || []);

  // Bounty
  const bountyMatch = compareBounty(guess.bounty, target.bounty);

  // Age
  const ageMatch = compareNumeric(guess.age, target.age, 'yrs');

  // Height
  const heightMatch = compareNumeric(guess.height, target.height, 'cm');

  // Origin
  const originMatch: AttributeMatch = {
    status: guess.origin.toLowerCase() === target.origin.toLowerCase() ? 'correct' : 'incorrect',
    value: guess.origin,
    displayValue: guess.origin,
  };

  // First Appearance / Debut (Show Chapter + Arc name)
  const formatDebut = (c: Character) => {
    const app = (c.first_appearance || '').trim();
    const arc = (c.first_arc || '').trim();

    if (app && arc) {
      // Avoid duplicating if arc is already inside appearance string
      if (app.toLowerCase().includes(arc.toLowerCase())) {
        return app;
      }
      return `${app} (${arc})`;
    }
    if (arc) return arc;
    if (app) return app;
    return 'Unknown';
  };

  const guessDebut = formatDebut(guess);
  const targetDebut = formatDebut(target);

  const isExactDebut = guessDebut.toLowerCase() === targetDebut.toLowerCase() && guessDebut !== 'Unknown';
  const isSameArc =
    guess.first_arc &&
    target.first_arc &&
    guess.first_arc.toLowerCase() === target.first_arc.toLowerCase();

  let debutStatus: 'correct' | 'partial' | 'incorrect' | 'unknown' = 'incorrect';
  if (guessDebut === 'Unknown' || targetDebut === 'Unknown') {
    debutStatus = 'unknown';
  } else if (isExactDebut) {
    debutStatus = 'correct';
  } else if (isSameArc) {
    debutStatus = 'partial';
  }

  const firstAppearanceMatch: AttributeMatch = {
    status: debutStatus,
    value: guessDebut,
    displayValue: guessDebut,
  };

  const isCorrect = guess.id === target.id;

  return {
    character: guess,
    gender: genderMatch,
    race: raceMatch,
    status: statusMatch,
    devilFruit: devilFruitMatch,
    devilFruitType: devilFruitTypeMatch,
    haki: hakiMatch,
    affiliation: affiliationMatch,
    occupation: occupationMatch,
    bounty: bountyMatch,
    age: ageMatch,
    height: heightMatch,
    origin: originMatch,
    firstAppearance: firstAppearanceMatch,
    isCorrect,
  };
}
