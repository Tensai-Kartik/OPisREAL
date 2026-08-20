/**
 * One Piece Debut Helper
 * Comprehensive timeline mapping of all One Piece Manga Chapters, Canon Story Arcs,
 * and Anime Filler Arcs in chronological anime broadcast & manga publication order.
 */

export interface ArcInfo {
  name: string;
  aliases: string[];
  order: number; // Chronological order index (1..N)
  startChapter?: number;
  endChapter?: number;
  startEpisode: number;
  endEpisode: number;
  isFiller?: boolean;
}

export const ONE_PIECE_ARCS: ArcInfo[] = [
  // --- East Blue Saga ---
  { name: 'Romance Dawn', order: 1, aliases: ['romance dawn', 'east blue', 'luffy intro', 'zoro intro', 'alvida'], startChapter: 1, endChapter: 7, startEpisode: 1, endEpisode: 3 },
  { name: 'Orange Town', order: 2, aliases: ['orange town', 'buggy', 'chouchou', 'boodle', 'mohnji', 'cabaji'], startChapter: 8, endChapter: 21, startEpisode: 4, endEpisode: 8 },
  { name: 'Syrup Village', order: 3, aliases: ['syrup village', 'kuro', 'usopp intro', 'kaya', 'jango', 'black cat'], startChapter: 22, endChapter: 41, startEpisode: 9, endEpisode: 18 },
  { name: 'Baratie', order: 4, aliases: ['baratie', 'don krieg', 'krieg', 'sanji intro', 'mihawk intro', 'gin', 'zeff'], startChapter: 42, endChapter: 68, startEpisode: 19, endEpisode: 30 },
  { name: 'Arlong Park', order: 5, aliases: ['arlong park', 'arlong', 'nami arc', 'cocoyasi', 'hachi', 'kuroobi', 'chew', 'bellemere'], startChapter: 69, endChapter: 95, startEpisode: 31, endEpisode: 44 },
  { name: "Buggy's Crew Adventure", order: 6, aliases: ["buggy's crew", 'buggy crew adventure'], startChapter: 35, endChapter: 75, startEpisode: 45, endEpisode: 47 },
  { name: 'Loguetown', order: 7, aliases: ['loguetown', 'lougetown', 'smoker intro', 'tashigi intro', 'dragon debut', 'ipponmatsu'], startChapter: 96, endChapter: 100, startEpisode: 48, endEpisode: 53 },
  { name: 'Warship Island', order: 8, aliases: ['warship island', 'gunkan island', 'apis', 'ryuji', 'millennium dragon', 'eric'], startEpisode: 54, endEpisode: 61, isFiller: true },

  // --- Arabasta Saga ---
  { name: 'Reverse Mountain', order: 9, aliases: ['reverse mountain', 'twin cape', 'twin capes', 'laboon', 'crocus'], startChapter: 101, endChapter: 105, startEpisode: 62, endEpisode: 63 },
  { name: 'Whiskey Peak', order: 10, aliases: ['whiskey peak', 'whisky peak', 'vivi intro', 'miss wednesday', 'mr 9', 'mr 8', 'igaram'], startChapter: 106, endChapter: 114, startEpisode: 64, endEpisode: 67 },
  { name: 'Coby and Helmeppo Diary', order: 11, aliases: ['coby and helmeppo', 'coby helmeppo diary', 'diary of coby'], startChapter: 83, endChapter: 119, startEpisode: 68, endEpisode: 69 },
  { name: 'Little Garden', order: 12, aliases: ['little garden', 'dorry', 'brogy', 'mr 3', 'miss goldenweek', 'mr 5'], startChapter: 115, endChapter: 129, startEpisode: 70, endEpisode: 77 },
  { name: 'Drum Island', order: 13, aliases: ['drum island', 'chopper intro', 'kureha', 'hiluluk', 'wapol', 'dalton', 'chess', 'kuromarimo'], startChapter: 130, endChapter: 154, startEpisode: 78, endEpisode: 91 },
  { name: 'Arabasta', order: 14, aliases: ['arabasta', 'alabasta', 'crocodile', 'mr 2', 'bon clay', 'robin join', 'mr 1', 'miss doublefinger', 'pell', 'chaka', 'cobra', 'koza', 'ace debut'], startChapter: 155, endChapter: 217, startEpisode: 92, endEpisode: 130 },
  { name: 'Post-Arabasta', order: 15, aliases: ['post-arabasta', 'post arabasta', 'dreams arc'], startEpisode: 131, endEpisode: 135, isFiller: true },
  { name: 'Goat Island', order: 16, aliases: ['goat island', 'zenny'], startEpisode: 136, endEpisode: 138, isFiller: true },
  { name: 'Ruluka Island', order: 17, aliases: ['ruluka island', 'rainbow mist', 'pasqua', 'wetton'], startEpisode: 139, endEpisode: 143, isFiller: true },

  // --- Sky Island Saga ---
  { name: 'Jaya', order: 18, aliases: ['jaya', 'mock town', 'bellamy', 'blackbeard intro', 'teach intro', 'mont blanc cricket', 'noland', 'sarkies', 'whitebeard debut', 'shanks meeting'], startChapter: 218, endChapter: 236, startEpisode: 144, endEpisode: 152 },
  { name: 'Skypiea', order: 19, aliases: ['skypiea', 'sky island', 'upper yard', 'enel', 'eneru', 'gan fall', 'wyper', 'shandora', 'conis', 'pagaya', 'gedatsu', 'ohm', 'shura', 'satori', 'kamakiri', 'braham', 'laki'], startChapter: 237, endChapter: 302, startEpisode: 153, endEpisode: 195 },
  { name: 'G-8 (Navarone)', order: 20, aliases: ['g-8', 'g8', 'navarone', 'jonathan', 'condoriano', 'con d. oriano', 'jessica', 'marcus'], startEpisode: 196, endEpisode: 206, isFiller: true },

  // --- Water 7 / Enies Lobby Saga ---
  { name: 'Long Ring Long Land', order: 21, aliases: ['long ring long land', 'davy back fight', 'foxy', 'porche', 'hamburgh', 'aokiji intro', 'kuzan intro', 'tonjit'], startChapter: 303, endChapter: 321, startEpisode: 207, endEpisode: 219 },
  { name: "Ocean's Dream", order: 22, aliases: ["ocean's dream", 'oceans dream', 'memory loss'], startEpisode: 220, endEpisode: 224, isFiller: true },
  { name: "Foxy's Return", order: 23, aliases: ["foxy's return", 'foxy return'], startEpisode: 225, endEpisode: 226, isFiller: true },
  { name: 'Water 7', order: 24, aliases: ['water 7', 'water seven', 'galley-la', 'franky intro', 'cp9 intro', 'lucci intro', 'kaku intro', 'kalifa', 'iceburg', 'paulie', 'peepley lulu', 'tilestone', 'kokoro', 'chimney', 'tom', 'franky family'], startChapter: 322, endChapter: 374, startEpisode: 227, endEpisode: 263 },
  { name: 'Enies Lobby', order: 25, aliases: ['enies lobby', 'judicial island', 'buster call', 'gear second', 'gear 2', 'gear 3', 'sogeking', 'spandam', 'jabra', 'blueno', 'kumadori', 'fukuro', 'fukurou', 'nero', 'wanze', 't-bone'], startChapter: 375, endChapter: 430, startEpisode: 264, endEpisode: 312 },
  { name: 'Post-Enies Lobby', order: 26, aliases: ['post-enies lobby', 'post enies lobby', 'garp intro', 'thousand sunny', 'dragon reveal', 'koby reunion', 'helmeppo reunion'], startChapter: 431, endChapter: 441, startEpisode: 313, endEpisode: 325 },
  { name: 'Ice Hunter', order: 27, aliases: ['ice hunter', 'lovely land', 'accino', 'don accino', 'phoenix pirates', 'vigolo'], startEpisode: 326, endEpisode: 335, isFiller: true },

  // --- Thriller Bark Saga ---
  { name: 'Thriller Bark', order: 28, aliases: ['thriller bark', 'moria', 'gecko moria', 'brook intro', 'ryuma', 'perona', 'hogback', 'absalom', 'kuma sabaody', 'nightmare luffy', 'lola', 'cindry', 'oars', 'oz'], startChapter: 442, endChapter: 489, startEpisode: 337, endEpisode: 381 },
  { name: 'Spa Island', order: 29, aliases: ['spa island', 'doran', 'sayo', 'rina'], startEpisode: 382, endEpisode: 384, isFiller: true },

  // --- Summit War Saga ---
  { name: 'Sabaody Archipelago', order: 30, aliases: ['sabaody archipelago', 'sabaody', 'supernovas', 'worst generation', 'rayleigh intro', 'kizaru intro', 'celestial dragons', 'charlos', 'rosward', 'shalria', 'sentomaru', 'pacifista', 'law intro', 'kidd intro', 'bege intro', 'bonney intro', 'killer intro', 'hawkins intro', 'drake intro', 'apoo intro', 'urouge intro', 'shakky'], startChapter: 490, endChapter: 513, startEpisode: 385, endEpisode: 405 },
  { name: 'Amazon Lily', order: 31, aliases: ['amazon lily', 'boa hancock', 'kuja', 'gorgon sisters', 'marigold', 'sandersonia', 'marguerite', 'sweet pea', 'aphelandra', 'gloriosa', 'elder nyon'], startChapter: 514, endChapter: 524, startEpisode: 408, endEpisode: 417 },
  { name: "Straw Hat's Separation", order: 32, aliases: ["straw hat's separation", 'separation serial', 'heracles', 'haredas'], startEpisode: 418, endEpisode: 421 },
  { name: 'Impel Down', order: 33, aliases: ['impel down', 'magellan', 'hannyabal', 'shiryu intro', 'ivankov intro', 'inazuma', 'level 6', 'saldeath', 'sadi', 'minotauros', 'sphinx', 'saladin'], startChapter: 525, endChapter: 548, startEpisode: 422, endEpisode: 452 },
  { name: 'Little East Blue', order: 34, aliases: ['little east blue', 'strong world tie-in', 'amigo pirates', 'shiki intro', 'largo', 'cortez', 'yoko'], startEpisode: 426, endEpisode: 429, isFiller: true },
  { name: 'Marineford', order: 35, aliases: ['marineford', 'summit war', 'paramount war', 'whitebeard war', 'ace death', 'whitebeard death', 'marine headquarters', 'akainu', 'aokiji', 'kizaru', 'sengoku', 'marco', 'jozu', 'vista', 'squard', 'little oars jr', 'croix', 'dadan'], startChapter: 549, endChapter: 580, startEpisode: 459, endEpisode: 489 },
  { name: 'Post-War', order: 36, aliases: ['post-war', 'post war', 'asl flashback', 'sabo flashback', 'gray terminal', '3d2y', 'rusukaina', 'curly dadan', 'stelly', 'bluejam', 'porchemy', 'makino'], startChapter: 581, endChapter: 597, startEpisode: 490, endEpisode: 516 },

  // --- Fish-Man Island Saga ---
  { name: 'Return to Sabaody', order: 37, aliases: ['return to sabaody', '2 years later', 'timeskip reunion', 'fake straw hats', 'demalo black', 'manjaro', 'drip', 'chocolat', 'cocoa'], startChapter: 598, endChapter: 602, startEpisode: 517, endEpisode: 522 },
  { name: 'Fish-Man Island', order: 38, aliases: ['fish-man island', 'fishman island', 'ryugu kingdom', 'hody jones', 'shirahoshi', 'neptune', 'otohime', 'fisher tiger', 'vander decken', 'fukaboshi', 'ryuboshi', 'manboshi', 'fukaboshi', 'shyarly', 'madam shyarly', 'zeo', 'daruma', 'dosun', 'hyouzou', 'ikaros', 'surume', 'tamago', 'pekoms', 'caribou', 'coribou'], startChapter: 603, endChapter: 653, startEpisode: 523, endEpisode: 574 },
  { name: "Z's Ambition", order: 39, aliases: ["z's ambition", 'zs ambition', 'shuzo', 'lily envers', 'film z tie-in', 'panz fry'], startEpisode: 575, endEpisode: 578, isFiller: true },

  // --- Dressrosa Saga ---
  { name: 'Punk Hazard', order: 40, aliases: ['punk hazard', 'caesar clown', 'caesar', 'kinemon intro', 'kin\'emon', 'momonosuke intro', 'monet', 'vergo', 'smiley', 'shinokuni', 'cool brothers', 'rock', 'scotch', 'brownbeard'], startChapter: 654, endChapter: 699, startEpisode: 579, endEpisode: 625 },
  { name: 'Caesar Retrieval', order: 41, aliases: ['caesar retrieval', 'breed', 'peto peto'], startEpisode: 626, endEpisode: 628, isFiller: true },
  { name: 'Dressrosa', order: 42, aliases: ['dressrosa', 'doflamingo', 'donquixote', 'fujitora intro', 'issho', 'sabo return', 'corazon', 'rosinante', 'law flashback', 'gear 4', 'grand fleet', 'senor pink', 'bartolomeo', 'cavendish', 'rebecca', 'kyros', 'riku', 'scarlett', 'trebol', 'diamante', 'pica', 'gladius', 'sugar', 'lao g', 'dellinger', 'machvise', 'baby 5', 'buffalo', 'jora', 'sai', 'boo', 'chinjao', 'don chinjao', 'ideo', 'hajrudin', 'leo', 'mansherry', 'tontatta', 'orlumbus', 'suleiman', 'jeet', 'abdullah', 'dagama', 'elizabello', 'blue gilly', 'tank lepant'], startChapter: 700, endChapter: 801, startEpisode: 629, endEpisode: 746 },
  { name: 'Silver Mine', order: 43, aliases: ['silver mine', 'bill', 'desire', 'film gold tie-in', 'peseta', 'abalon'], startEpisode: 747, endEpisode: 750, isFiller: true },

  // --- Four Emperors Saga ---
  { name: 'Zou', order: 44, aliases: ['zou', 'minks', 'mink tribe', 'nekomamushi', 'inurarashi', 'inuarashi', 'jack intro', 'raizo reveal', 'road poneglyph', 'sanji abduction', 'phantom island', 'wanda', 'carrot intro', 'pedro intro', 'bb', 'roddy', 'bariete', 'sheepshead', 'ginrummy', 'miyata', 'tristan'], startChapter: 802, endChapter: 824, startEpisode: 751, endEpisode: 776 },
  { name: 'Marine Rookie', order: 45, aliases: ['marine rookie', 'grount', 'all-hunt grount', 'bonam', 'zappa', 'prodi'], startEpisode: 780, endEpisode: 782, isFiller: true },
  { name: 'Whole Cake Island', order: 46, aliases: ['whole cake island', 'whole cake', 'wci', 'totto land', 'big mom', 'katakuri', 'cracker', 'smoothie', 'germa 66', 'judge', 'reiju', 'ichiji', 'niji', 'yonji', 'pudding', 'charlotte family', 'perospero', 'oven', 'daifuku', 'brulee', 'brûlée', 'mont-d\'or', 'opera', 'amande', 'galette', 'flampe', 'snack', 'tamago', 'pekoms', 'streusen', 'zeus', 'prometheus', 'napoleon', 'pound', 'chiffon', 'king baum', 'morgans', 'stussy intro', 'du feld', 'giberson', 'umit', 'vinsmoke'], startChapter: 825, endChapter: 902, startEpisode: 783, endEpisode: 877 },
  { name: 'Levely', order: 47, aliases: ['levely', 'reverie', 'mary geoise', 'im-sama', 'im reveal', 'gorosei reverie', 'charlos reverie', 'kuma enslaved', 'karasu', 'morley', 'lindbergh', 'belo betty', 'nefertari cobra reverie', 'wapol reverie', 'rebecca reverie', 'sai reverie', 'shirahoshi reverie'], startChapter: 903, endChapter: 908, startEpisode: 878, endEpisode: 889 },
  { name: 'Wano Country', order: 48, aliases: ['wano country', 'wano', 'onigashima', 'onigashima raid', 'kaido', 'orochi', 'oden', 'kozuki oden', 'yamato', 'gear 5', 'gear fifth', 'king', 'queen', 'jack wano', 'tobi roppo', 'page one', 'ulti', 'who\'s-who', 'whos who', 'black maria', 'sasaki', 'scabbards', 'hyogoro', 'ryuo', 'cidre guild', 'uta tie-in', 'tama', 'otama', 'tsuru', 'kiku', 'okiku', 'ashura doji', 'denjiro', 'kawamatsu', 'raizo wano', 'kinemon wano', 'kanjuro', 'shinobu', 'sukiyaki', 'toki', 'hiyori', 'komurasaki', 'yasuie', 'toko', 'fukurokuju', 'hotei', 'onimaru', 'ushimaru', 'aramaki debut', 'ryokugyu debut', 'green bull debut'], startChapter: 909, endChapter: 1057, startEpisode: 890, endEpisode: 1085 },

  // --- Final Saga ---
  { name: 'Egghead', order: 49, aliases: ['egghead', 'future island', 'vegapunk', 'dr vegapunk', 'shaka', 'lilith', 'edison', 'pythagoras', 'atlas', 'york', 'stussy clone', 'lucci awakened', 'kaku awakened', 'seraphim', 's-snake', 's-hawk', 's-bear', 's-shark', 'kuma backstory', 'saturn', 'saint jaygarcia saturn', 'five elders summon', 'buster call egghead', 'marcus mars', 'topman warcury', 'ethanbaron v. nusjuro', 'shepherd ju peter', 'clover flashback', 'ginny'], startChapter: 1058, endChapter: 1125, startEpisode: 1086, endEpisode: 1122 },
  { name: 'Elbaf', order: 50, aliases: ['elbaf', 'giant warrior pirates', 'loki', 'prince loki', 'sun god elbaf', 'saul elbaf', 'jarul', 'jorul', 'road', 'goldberg', 'gerd'], startChapter: 1126, endChapter: 1200, startEpisode: 1123, endEpisode: 1200 },
];

/**
 * Finds matching ArcInfo by arc name or alias string.
 */
export function findArcByName(arcName?: string | null): ArcInfo | undefined {
  if (!arcName) return undefined;
  let clean = arcName.trim().toLowerCase();
  clean = clean.replace(/\s*(?:arc|saga)\s*$/i, '').trim();
  if (!clean) return undefined;

  // Pass 1: Exact matches against arc name or aliases
  const exact = ONE_PIECE_ARCS.find((a) => {
    const aName = a.name.toLowerCase().replace(/\s*(?:arc|saga)\s*$/i, '').trim();
    if (aName === clean) return true;
    return a.aliases.some((alias) => {
      const aliasClean = alias.toLowerCase().replace(/\s*(?:arc|saga)\s*$/i, '').trim();
      return aliasClean === clean;
    });
  });
  if (exact) return exact;

  // Pass 2: Clean input contains full arc name or full alias as a phrase
  const fuzzy = ONE_PIECE_ARCS.find((a) => {
    const aName = a.name.toLowerCase().replace(/\s*(?:arc|saga)\s*$/i, '').trim();
    if (clean.includes(aName)) return true;
    return a.aliases.some((alias) => {
      const aliasClean = alias.toLowerCase().replace(/\s*(?:arc|saga)\s*$/i, '').trim();
      return clean.includes(aliasClean);
    });
  });

  return fuzzy;
}

/**
 * Converts a Manga Chapter number to estimated Anime Episode number.
 */
export function chapterToEpisode(chapterNum: number): { episode: number; arcName?: string; arcOrder?: number } {
  const arc = ONE_PIECE_ARCS.find(
    (a) => a.startChapter && a.endChapter && chapterNum >= a.startChapter && chapterNum <= a.endChapter
  );

  if (arc && arc.startChapter && arc.endChapter) {
    const rangeCh = Math.max(1, arc.endChapter - arc.startChapter);
    const rangeEp = Math.max(1, arc.endEpisode - arc.startEpisode);
    const ratio = Math.min(1, Math.max(0, (chapterNum - arc.startChapter) / rangeCh));
    const episode = Math.round(arc.startEpisode + ratio * rangeEp);
    return { episode, arcName: arc.name, arcOrder: arc.order };
  }

  // Fallback for future high chapters
  if (chapterNum > 1125) {
    const diff = chapterNum - 1125;
    return { episode: 1123 + diff, arcName: 'Elbaf', arcOrder: 50 };
  }

  return { episode: Math.max(1, Math.round(chapterNum * 0.95)), arcOrder: 25 };
}

export interface DebutDisplayInfo {
  arcName: string;
  episodeNumber: number | null;
  episodeText: string | null;
  chronologicalRank: number; // Numerical index representing chronological placement
}

/**
 * Parses any debut string or (first_appearance, first_arc) pair into Arc name,
 * Episode info, and timeline order ranking.
 */
export function parseDebutDisplay(
  displayValue?: string | null,
  firstArc?: string | null
): DebutDisplayInfo {
  const raw = (displayValue || '').trim();
  const explicitArc = (firstArc || '').trim();

  if (!raw && !explicitArc) {
    return { arcName: 'Unknown', episodeNumber: null, episodeText: null, chronologicalRank: 9999 };
  }

  let arcName = explicitArc || '';
  let episodeNumber: number | null = null;
  let chronologicalRank = 9999;

  // 1. Check if raw contains explicit episode pattern e.g. "Chapter 801 / Episode 756", "Episode 45", "Ep. 10"
  const combinedText = `${raw} ${explicitArc}`.trim();
  const epMatch = combinedText.match(/(?:ep\.?|episode)\s*(\d+)/i);
  if (epMatch) {
    episodeNumber = parseInt(epMatch[1], 10);
  }

  // 2. Check if raw or explicitArc contains a Chapter number e.g. "Chapter 929", "Ch. 1"
  const rawChMatch = combinedText.match(/(?:chapter|ch\.?)\s*(\d+)/i);
  if (rawChMatch) {
    const chNum = parseInt(rawChMatch[1], 10);
    const converted = chapterToEpisode(chNum);
    if (!arcName || arcName === 'Unknown') {
      arcName = converted.arcName || `Chapter ${chNum}`;
    }
    if (episodeNumber === null) {
      episodeNumber = converted.episode;
    }
    chronologicalRank = episodeNumber !== null ? episodeNumber : (converted.arcOrder || 9999);
  }

  // 3. Check if raw has parenthetical format: e.g. "Chapter 1 (Romance Dawn)" or "Romance Dawn (Ep. 1)"
  const parenMatch = raw.match(/^(.*?)\s*\((.*?)\)$/);
  if (parenMatch) {
    const part1 = parenMatch[1].trim();
    const part2 = parenMatch[2].trim();

    const arcInPart1 = findArcByName(part1);
    const arcInPart2 = findArcByName(part2);

    if (arcInPart1) {
      arcName = arcInPart1.name;
      if (chronologicalRank === 9999) chronologicalRank = arcInPart1.startEpisode;
      if (episodeNumber === null) episodeNumber = arcInPart1.startEpisode;
    } else if (arcInPart2) {
      arcName = arcInPart2.name;
      if (chronologicalRank === 9999) chronologicalRank = arcInPart2.startEpisode;
      if (episodeNumber === null) episodeNumber = arcInPart2.startEpisode;
    }
  }

  // 4. Match known Arc by name or alias if arcName is still not normalized
  if (arcName) {
    const arcObj = findArcByName(arcName);
    if (arcObj) {
      arcName = arcObj.name;
      if (episodeNumber === null) {
        episodeNumber = arcObj.startEpisode;
      }
      if (chronologicalRank === 9999) {
        chronologicalRank = episodeNumber !== null ? episodeNumber : arcObj.startEpisode;
      }
    }
  } else {
    const directArc = findArcByName(raw);
    if (directArc) {
      arcName = directArc.name;
      if (episodeNumber === null) {
        episodeNumber = directArc.startEpisode;
      }
      if (chronologicalRank === 9999) {
        chronologicalRank = episodeNumber !== null ? episodeNumber : directArc.startEpisode;
      }
    }
  }

  // 5. If episode number is known but rank is not, find arc containing episode
  if (episodeNumber !== null && chronologicalRank === 9999) {
    const arcForEp = ONE_PIECE_ARCS.find(
      (a) => episodeNumber! >= a.startEpisode && episodeNumber! <= a.endEpisode
    );
    if (arcForEp) {
      chronologicalRank = episodeNumber;
      if (!arcName || arcName === 'Unknown') arcName = arcForEp.name;
    } else {
      chronologicalRank = episodeNumber;
    }
  }

  // 6. Clean fallback
  if (!arcName || arcName === 'Unknown Arc') {
    if (/^chapter\s*\d+/i.test(raw)) {
      arcName = raw;
    } else {
      arcName = raw || 'Unknown';
    }
  }

  // Final chronological rank is episode number if available
  const effectiveRank = episodeNumber !== null ? episodeNumber : chronologicalRank;
  const episodeText = episodeNumber !== null ? `Ep. ${episodeNumber}` : null;

  return {
    arcName,
    episodeNumber,
    episodeText,
    chronologicalRank: effectiveRank,
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
