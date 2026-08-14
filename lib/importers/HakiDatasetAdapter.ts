export interface HakiRecord {
  characterSlug: string;
  observation: boolean;
  armament: boolean;
  conqueror: boolean;
}

export function getHakiDataset(): HakiRecord[] {
  return [
    { characterSlug: 'monkey-d-luffy', observation: true, armament: true, conqueror: true },
    { characterSlug: 'roronoa-zoro', observation: true, armament: true, conqueror: true },
    { characterSlug: 'vinsmoke-sanji', observation: true, armament: true, conqueror: false },
    { characterSlug: 'usopp', observation: true, armament: false, conqueror: false },
    { characterSlug: 'jinbe', observation: true, armament: true, conqueror: false },
    { characterSlug: 'shanks', observation: true, armament: true, conqueror: true },
    { characterSlug: 'dracule-mihawk', observation: true, armament: true, conqueror: false },
    { characterSlug: 'sir-crocodile', observation: true, armament: true, conqueror: false },
    { characterSlug: 'donquixote-doflamingo', observation: true, armament: true, conqueror: true },
    { characterSlug: 'charlotte-katakuri', observation: true, armament: true, conqueror: true },
    { characterSlug: 'kaidou', observation: true, armament: true, conqueror: true },
    { characterSlug: 'charlotte-linlin', observation: true, armament: true, conqueror: true },
    { characterSlug: 'yamato', observation: true, armament: true, conqueror: true },
    { characterSlug: 'edward-newgate', observation: true, armament: true, conqueror: true },
    { characterSlug: 'gol-d-roger', observation: true, armament: true, conqueror: true },
    { characterSlug: 'silvers-rayleigh', observation: true, armament: true, conqueror: true },
    { characterSlug: 'monkey-d-garp', observation: true, armament: true, conqueror: true },
    { characterSlug: 'monkey-d-dragon', observation: true, armament: true, conqueror: true },
    { characterSlug: 'portgas-d-ace', observation: true, armament: true, conqueror: true },
    { characterSlug: 'sabo', observation: true, armament: true, conqueror: false },
    { characterSlug: 'sakazuki', observation: true, armament: true, conqueror: false },
    { characterSlug: 'borsalino', observation: true, armament: true, conqueror: false },
    { characterSlug: 'kuzan', observation: true, armament: true, conqueror: false },
    { characterSlug: 'issho', observation: true, armament: true, conqueror: false },
    { characterSlug: 'eustass-kid', observation: true, armament: true, conqueror: true },
    { characterSlug: 'trafalgar-d-water-law', observation: true, armament: true, conqueror: false },
    { characterSlug: 'marshall-d-teach', observation: true, armament: true, conqueror: false },
  ];
}
