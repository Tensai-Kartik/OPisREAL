export interface DataSource {
  id: string;
  name: string;
  type: 'api' | 'graphql' | 'csv' | 'json' | 'dataset' | 'manual';
  base_url?: string | null;
  description?: string | null;
  license?: string | null;
  license_url?: string | null;
  enabled: boolean;
  priority: number;
  last_imported_at?: string | null;
  last_successful_import_at?: string | null;
  last_error?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface RawCharacterRecord {
  source_id: string;
  source_character_id?: string;
  name: string;
  japanese_name?: string;
  romanized_name?: string;
  aliases?: string[];
  gender?: string;
  race?: string;
  status?: string;
  age?: number | string;
  height?: number | string;
  bounty?: number | string;
  birthday?: string;
  blood_type?: string;
  origin?: string;
  first_appearance?: string;
  first_arc?: string;
  devil_fruit_name?: string;
  devil_fruit_type?: string;
  devil_fruit_model?: string;
  occupations?: string[];
  affiliations?: string[];
  haki_types?: string[];
  description?: string;
  image_url?: string;
  raw_payload?: Record<string, unknown>;
}
