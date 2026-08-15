export type VerificationStatus = 'verified' | 'consensus' | 'sourced' | 'conflict' | 'missing';

export type GenderType = 'Male' | 'Female' | 'Unknown' | 'Other' | string;

export type RaceType = 
  | 'Human' 
  | 'Fish-Man' 
  | 'Merfolk' 
  | 'Mink' 
  | 'Giant' 
  | 'Lunarian' 
  | 'Cyborg' 
  | 'Ancient Giant' 
  | 'Sky Island' 
  | 'Unknown' 
  | 'Other'
  | string;

export type StatusType = 'Alive' | 'Dead' | 'Unknown' | 'Other' | string;

export type DevilFruitType = 
  | 'Paramecia' 
  | 'Zoan' 
  | 'Ancient Zoan' 
  | 'Mythical Zoan' 
  | 'Logia' 
  | 'None' 
  | 'Unknown' 
  | 'Other'
  | string;

export type HakiType = 'Observation' | 'Armament' | 'Conqueror' | 'Other';

export interface CharacterAlias {
  id?: string;
  character_id?: string;
  alias: string;
  alias_type?: 'alias' | 'epithet' | 'nickname' | 'title' | 'romanized' | string;
}

export interface CharacterHaki {
  id?: string;
  character_id?: string;
  haki_type: HakiType;
  custom_haki?: string | null;
}

export interface CharacterFieldEvidence {
  id?: string;
  character_id: string;
  field_name: string;
  source_id: string;
  raw_value: string | null;
  normalized_value: string | null;
  confidence: number;
  created_at?: string;
}

export interface Character {
  id: string;
  name: string;
  slug: string;
  japanese_name?: string | null;
  alias?: string | null;
  romanized_name?: string | null;
  gender: GenderType;
  race: RaceType;
  status: StatusType;
  age?: number | null;
  height?: number | null; // in cm
  bounty?: number | null; // bigint numeric
  birthday?: string | null;
  blood_type?: string | null;
  origin: string;
  first_appearance?: string | null;
  first_arc?: string | null;
  devil_fruit_name?: string | null;
  devil_fruit_type: DevilFruitType;
  devil_fruit_model?: string | null;
  description?: string | null;
  image_url?: string | null;
  image_source_url?: string | null;
  image_source_name?: string | null;
  image_attribution?: string | null;
  is_canon: boolean;
  is_active: boolean;
  verification_status: VerificationStatus;
  created_at?: string;
  updated_at?: string;
  // Related loaded fields
  aliases?: CharacterAlias[];
  affiliations?: string[];
  occupations?: string[];
  haki?: CharacterHaki[];
}
