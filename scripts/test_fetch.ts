async function testJikan() {
  const res = await fetch('https://api.jikan.moe/v4/anime/21/characters');
  const json = await res.json();
  console.log(`Jikan OP characters count: ${json.data?.length}`);
  if (json.data?.length > 0) {
    console.log('Jikan sample:', json.data[0]);
  }
}

testJikan().catch(console.log);
