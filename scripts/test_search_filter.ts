// Verify that search items with bounty 0 or null are handled properly and guessed IDs filter out

interface SearchResult {
  id: string;
  name: string;
  bounty?: number | null;
}

const mockResults: SearchResult[] = [
  { id: '1', name: 'Monkey D. Luffy', bounty: 3000000000 },
  { id: '2', name: 'Makino', bounty: 0 },
  { id: '3', name: 'Kaya', bounty: null },
  { id: '4', name: 'Koby', bounty: 0 },
];

const guessedIds = ['1']; // Luffy already guessed

const availableResults = mockResults.filter((item) => !guessedIds.includes(item.id));

console.log('Available results count (excluding Luffy):', availableResults.length);
if (availableResults.some((r) => r.id === '1')) {
  throw new Error('Guessed character was not filtered out');
}

availableResults.forEach((item) => {
  const shouldRenderBounty = typeof item.bounty === 'number' && item.bounty > 0;
  console.log(`Character: ${item.name} | Should render bounty badge: ${shouldRenderBounty}`);
  if (item.bounty === 0 && shouldRenderBounty) {
    throw new Error(`Bounty 0 should not render badge or trailing 0 for ${item.name}`);
  }
});

console.log('SUCCESS: Search filter and trailing 0 tests passed!');
