async function testAPIs() {
  console.log('Testing OnePieceAPI characters/en...');
  const resChars = await fetch('https://api.api-onepiece.com/v2/characters/en');
  if (resChars.ok) {
    const chars = await resChars.json();
    console.log(`Chars count: ${chars.length}`);
    if (chars.length > 0) {
      console.log('Sample char:', chars[0]);
    }
  }

  console.log('\nTesting OnePieceAPI arcs/en...');
  const resArcs = await fetch('https://api.api-onepiece.com/v2/arcs/en');
  if (resArcs.ok) {
    const arcs = await resArcs.json();
    console.log(`Arcs count: ${arcs.length}`);
    if (arcs.length > 0) {
      console.log('Sample arc:', arcs[0]);
    }
  }

  console.log('\nTesting OnePieceAPI fruits/en...');
  const resFruits = await fetch('https://api.api-onepiece.com/v2/fruits/en');
  if (resFruits.ok) {
    const fruits = await resFruits.json();
    console.log(`Fruits count: ${fruits.length}`);
    if (fruits.length > 0) {
      console.log('Sample fruit:', fruits[0]);
    }
  }

  process.exit(0);
}

testAPIs().catch(console.error);
