/**
 * One Piece Debut Helper
 * Maps manga chapters and story arcs to canon anime debut episodes.
 * Formats debut information for display in the Deduction Game comparison boxes.
 */

export interface ArcInfo {
  name: string;
  aliases: string[];
  startChapter: number;
  endChapter: number;
  startEpisode: number;
  endEpisode: number;
}

export const ONE_PIECE_ARCS: ArcInfo[] = [
  { name: 'Romance Dawn', aliases: ['romance dawn', 'east blue'], startChapter: 1, endChapter: 7, startEpisode: 1, endEpisode: 3 },
  { name: 'Orange Town', aliases: ['orange town', 'buggy'], startChapter: 8, endChapter: 21, startEpisode: 4, endEpisode: 8 },
  { name: 'Syrup Village', aliases: ['syrup village', 'kuro'], startChapter: 22, endChapter: 41, startEpisode: 9, endEpisode: 18 },
  { name: 'Baratie', aliases: ['baratie', 'krieg', 'sanji intro'], startChapter: 42, endChapter: 68, startEpisode: 19, endEpisode: 30 },
  { name: 'Arlong Park', aliases: ['arlong park', 'arlong'], startChapter: 69, endChapter: 95, startEpisode: 31, endEpisode: 44 },
  { name: 'Loguetown', aliases: ['loguetown', 'lougetown'], startChapter: 96, endChapter: 100, startEpisode: 48, endEpisode: 53 },
  { name: 'Reverse Mountain', aliases: ['reverse mountain', 'twin cape', 'laboon'], startChapter: 101, endChapter: 105, startEpisode: 62, endEpisode: 63 },
  { name: 'Whiskey Peak', aliases: ['whiskey peak', 'whisky peak'], startChapter: 106, endChapter: 114, startEpisode: 64, endEpisode: 67 },
  { name: 'Little Garden', aliases: ['little garden'], startChapter: 115, endChapter: 129, startEpisode: 70, endEpisode: 77 },
  { name: 'Drum Island', aliases: ['drum island', 'chopper'], startChapter: 130, endChapter: 154, startEpisode: 78, endEpisode: 91 },
  { name: 'Arabasta', aliases: ['arabasta', 'alabasta'], startChapter: 155, endChapter: 217, startEpisode: 92, endEpisode: 130 },
  { name: 'Jaya', aliases: ['jaya', 'mock town'], startChapter: 218, endChapter: 236, startEpisode: 144, endEpisode: 152 },
  { name: 'Skypiea', aliases: ['skypiea', 'sky island', 'upper yard'], startChapter: 237, endChapter: 302, startEpisode: 153, endEpisode: 195 },
  { name: 'Long Ring Long Land', aliases: ['long ring long land', 'davy back fight', 'foxy'], startChapter: 303, endChapter: 321, startEpisode: 207, endEpisode: 219 },
  { name: 'Water 7', aliases: ['water 7', 'water seven', 'galley-la'], startChapter: 322, endChapter: 374, startEpisode: 229, endEpisode: 263 },
  { name: 'Enies Lobby', aliases: ['enies lobby', 'cp9'], startChapter: 375, endChapter: 430, startEpisode: 264, endEpisode: 312 },
  { name: 'Post-Enies Lobby', aliases: ['post-enies lobby', 'post enies lobby'], startChapter: 431, endChapter: 441, startEpisode: 313, endEpisode: 325 },
  { name: 'Thriller Bark', aliases: ['thriller bark', 'moria'], startChapter: 442, endChapter: 489, startEpisode: 337, endEpisode: 381 },
  { name: 'Sabaody Archipelago', aliases: ['sabaody archipelago', 'sabaody', 'supernova'], startChapter: 490, endChapter: 513, startEpisode: 385, endEpisode: 405 },
  { name: 'Amazon Lily', aliases: ['amazon lily', 'kuja'], startChapter: 514, endChapter: 524, startEpisode: 408, endEpisode: 417 },
  { name: 'Impel Down', aliases: ['impel down'], startChapter: 525, endChapter: 548, startEpisode: 422, endEpisode: 452 },
  { name: 'Marineford', aliases: ['marineford', 'summit war', 'paramount war'], startChapter: 549, endChapter: 580, startEpisode: 459, endEpisode: 489 },
  { name: 'Post-War', aliases: ['post-war', 'post war', 'asl flashback'], startChapter: 581, endChapter: 597, startEpisode: 490, endEpisode: 516 },
  { name: 'Return to Sabaody', aliases: ['return to sabaody', 'reunion'], startChapter: 598, endChapter: 602, startEpisode: 517, endEpisode: 522 },
  { name: 'Fish-Man Island', aliases: ['fish-man island', 'fishman island', 'ryugu kingdom'], startChapter: 603, endChapter: 653, startEpisode: 523, endEpisode: 574 },
  { name: 'Punk Hazard', aliases: ['punk hazard', 'caesar'], startChapter: 654, endChapter: 699, startEpisode: 579, endEpisode: 625 },
  { name: 'Dressrosa', aliases: ['dressrosa', 'doflamingo'], startChapter: 700, endChapter: 801, startEpisode: 629, endEpisode: 746 },
  { name: 'Zou', aliases: ['zou', 'minks'], startChapter: 802, endChapter: 824, startEpisode: 751, endEpisode: 776 },
  { name: 'Whole Cake Island', aliases: ['whole cake island', 'whole cake', 'wci', 'totto land'], startChapter: 825, endChapter: 902, startEpisode: 783, endEpisode: 877 },
  { name: 'Levely', aliases: ['levely', 'reverie'], startChapter: 903, endChapter: 908, startEpisode: 878, endEpisode: 889 },
  { name: 'Wano Country', aliases: ['wano country', 'wano', 'onigashima'], startChapter: 909, endChapter: 1057, startEpisode: 890, endEpisode: 1085 },
  { name: 'Egghead', aliases: ['egghead', 'future island'], startChapter: 1058, endChapter: 1125, startEpisode: 1086, endEpisode: 1122 },
  { name: 'Elbaf', aliases: ['elbaf'], startChapter: 1126, endChapter: 1200, startEpisode: 1123, endEpisode: 1200 },
];

/**
 * Finds matching ArcInfo by arc name or alias.
 */
export function findArcByName(arcName?: string | null): ArcInfo | undefined {
  if (!arcName) return undefined;
  const clean = arcName.trim().toLowerCase();
  return ONE_PIECE_ARCS.find((a) =>
    a.name.toLowerCase() === clean || a.aliases.some((alias) => clean.includes(alias))
  );
}

/**
 * Converts a Manga Chapter number to estimated Anime Episode number.
 */
export function chapterToEpisode(chapterNum: number): { episode: number; arcName?: string } {
  const arc = ONE_PIECE_ARCS.find(
    (a) => chapterNum >= a.startChapter && chapterNum <= a.endChapter
  );

  if (arc) {
    const rangeCh = Math.max(1, arc.endChapter - arc.startChapter);
    const rangeEp = Math.max(1, arc.endEpisode - arc.startEpisode);
    const ratio = Math.min(1, Math.max(0, (chapterNum - arc.startChapter) / rangeCh));
    const episode = Math.round(arc.startEpisode + ratio * rangeEp);
    return { episode, arcName: arc.name };
  }

  // Fallback for very high chapters
  if (chapterNum > 1125) {
    return { episode: 1123 + (chapterNum - 1126), arcName: 'Elbaf' };
  }

  return { episode: Math.max(1, Math.round(chapterNum * 0.95)) };
}

export interface DebutDisplayInfo {
  arcName: string;
  episodeNumber: number | null;
  episodeText: string | null;
}

/**
 * Parses any debut string or (appearance, arc) pair into Arc name and Episode info.
 * Hides chapter numbers and provides clean Arc Name + (Ep. X).
 */
export function parseDebutDisplay(
  displayValue?: string | null,
  firstArc?: string | null
): DebutDisplayInfo {
  const raw = (displayValue || '').trim();
  const explicitArc = (firstArc || '').trim();

  if (!raw && !explicitArc) {
    return { arcName: 'Unknown', episodeNumber: null, episodeText: null };
  }

  let arcName = explicitArc || '';
  let episodeNumber: number | null = null;

  // 1. Check if raw contains episode pattern e.g. "Romance Dawn (Ep. 1)" or "Episode 45" or "Ep. 10"
  const epMatch = raw.match(/(?:ep\.?|episode)\s*(\d+)/i);
  if (epMatch) {
    episodeNumber = parseInt(epMatch[1], 10);
  }

  // 2. Check if raw has "(Arc Name)" pattern: e.g. "Chapter 1 (Romance Dawn)" or "Romance Dawn (Ep. 1)"
  const parenMatch = raw.match(/^(.*?)\s*\((.*?)\)$/);
  if (parenMatch) {
    const part1 = parenMatch[1].trim();
    const part2 = parenMatch[2].trim();

    // Check which part is the arc
    const arcInPart1 = findArcByName(part1);
    const arcInPart2 = findArcByName(part2);

    if (arcInPart1) {
      arcName = arcInPart1.name;
    } else if (arcInPart2) {
      arcName = arcInPart2.name;
    }

    // Check if chapter is in part1 or part2
    const chMatch = (part1 + ' ' + part2).match(/(?:chapter|ch\.?)\s*(\d+)/i);
    if (chMatch && episodeNumber === null) {
      const chNum = parseInt(chMatch[1], 10);
      const converted = chapterToEpisode(chNum);
      episodeNumber = converted.episode;
      if (!arcName && converted.arcName) {
        arcName = converted.arcName;
      }
    }
  }

  // 3. If arcName is still not found, check if raw matches any known Arc
  if (!arcName) {
    const directArc = findArcByName(raw);
    if (directArc) {
      arcName = directArc.name;
      if (episodeNumber === null) {
        episodeNumber = directArc.startEpisode;
      }
    }
  }

  // 4. If raw contains a Chapter number (e.g. "Chapter 442" or "Ch 100")
  if (!arcName || episodeNumber === null) {
    const rawChMatch = raw.match(/(?:chapter|ch\.?)\s*(\d+)/i) || raw.match(/^(\d+)$/);
    if (rawChMatch) {
      const chNum = parseInt(rawChMatch[1], 10);
      const converted = chapterToEpisode(chNum);
      if (!arcName) arcName = converted.arcName || `Chapter ${chNum}`;
      if (episodeNumber === null) episodeNumber = converted.episode;
    }
  }

  // 5. If arcName is known but episodeNumber is not, use arc start episode
  if (arcName && episodeNumber === null) {
    const arcObj = findArcByName(arcName);
    if (arcObj) {
      episodeNumber = arcObj.startEpisode;
    }
  }

  // 6. Clean fallback
  if (!arcName) {
    // If raw was "Chapter X", hide chapter and use Unknown or fallback
    if (/^chapter\s*\d+/i.test(raw)) {
      arcName = 'Unknown Arc';
    } else {
      arcName = raw || 'Unknown';
    }
  }

  const episodeText = episodeNumber !== null ? `Ep. ${episodeNumber}` : null;

  return {
    arcName,
    episodeNumber,
    episodeText,
  };
}

/**
 * Formats debut string for game engine comparison value (e.g. "Romance Dawn (Ep. 1)")
 */
export function formatDebutString(
  firstAppearance?: string | null,
  firstArc?: string | null
): string {
  const debut = parseDebutDisplay(firstAppearance, firstArc);
  if (debut.arcName === 'Unknown' || debut.arcName === 'Unknown Arc') {
    if (firstArc) return firstArc;
    if (firstAppearance) {
      // If appearance has chapter, convert to arc/ep
      const chMatch = firstAppearance.match(/(?:chapter|ch\.?)\s*(\d+)/i);
      if (chMatch) {
        const converted = chapterToEpisode(parseInt(chMatch[1], 10));
        return converted.arcName ? `${converted.arcName} (Ep. ${converted.episode})` : `Ep. ${converted.episode}`;
      }
      return firstAppearance;
    }
    return 'Unknown';
  }

  if (debut.episodeText) {
    return `${debut.arcName} (${debut.episodeText})`;
  }
  return debut.arcName;
}
