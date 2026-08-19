import { compareCharacters } from '../lib/game/comparisonEngine';
import { Character } from '../types/character';

function testDebutComparison() {
  const charLuffy: Character = {
    id: 'luffy-id',
    name: 'Monkey D. Luffy',
    slug: 'monkey-d-luffy',
    gender: 'Male',
    race: 'Human',
    status: 'Alive',
    devil_fruit_name: 'Hito Hito no Mi, Model: Nika',
    devil_fruit_type: 'Mythical Zoan',
    origin: 'East Blue',
    first_arc: 'Romance Dawn',
    first_appearance: 'Chapter 1',
    bounty: 3000000000,
    age: 19,
    height: 174,
    is_canon: true,
    is_active: true,
    verification_status: 'verified',
    affiliations: ['Straw Hat Pirates'],
    occupations: ['Captain'],
    haki: [{ haki_type: 'Conqueror\'s' }, { haki_type: 'Armament' }, { haki_type: 'Observation' }],
  };

  const charZoro: Character = {
    id: 'zoro-id',
    name: 'Roronoa Zoro',
    slug: 'roronoa-zoro',
    gender: 'Male',
    race: 'Human',
    status: 'Alive',
    devil_fruit_name: null,
    devil_fruit_type: 'None',
    origin: 'East Blue',
    first_arc: 'Romance Dawn',
    first_appearance: 'Chapter 3',
    bounty: 1111000000,
    age: 21,
    height: 181,
    is_canon: true,
    is_active: true,
    verification_status: 'verified',
    affiliations: ['Straw Hat Pirates'],
    occupations: ['Swordsman'],
    haki: [{ haki_type: 'Conqueror\'s' }, { haki_type: 'Armament' }, { haki_type: 'Observation' }],
  };

  const charKaido: Character = {
    id: 'kaido-id',
    name: 'Kaido',
    slug: 'kaido',
    gender: 'Male',
    race: 'Oni',
    status: 'Unknown',
    devil_fruit_name: 'Uo Uo no Mi, Model: Seiryu',
    devil_fruit_type: 'Mythical Zoan',
    origin: 'Grand Line',
    first_arc: 'Dressrosa',
    first_appearance: 'Chapter 795',
    bounty: 4611100000,
    age: 59,
    height: 710,
    is_canon: true,
    is_active: true,
    verification_status: 'verified',
    affiliations: ['Beasts Pirates', 'Rocks Pirates'],
    occupations: ['Governor-General'],
    haki: [{ haki_type: 'Conqueror\'s' }, { haki_type: 'Armament' }, { haki_type: 'Observation' }],
  };

  // Test 1: Same debut arc (Romance Dawn for Luffy and Zoro)
  const compSameArc = compareCharacters(charZoro, charLuffy);
  console.log('Test 1 (Zoro guess vs Luffy target - Same Arc):', compSameArc.firstAppearance);
  if (compSameArc.firstAppearance.status !== 'correct') {
    throw new Error(`Expected 'correct', got '${compSameArc.firstAppearance.status}'`);
  }

  // Test 2: Different debut arc (Kaido Dressrosa vs Luffy Romance Dawn)
  const compDiffArc = compareCharacters(charKaido, charLuffy);
  console.log('Test 2 (Kaido guess vs Luffy target - Different Arc):', compDiffArc.firstAppearance);
  if (compDiffArc.firstAppearance.status !== 'incorrect') {
    throw new Error(`Expected 'incorrect', got '${compDiffArc.firstAppearance.status}'`);
  }

  console.log('SUCCESS: All Debut Arc tests passed! Same arc turns green (correct), different turns red (incorrect).');
}

testDebutComparison();
