async function testFandom() {
  const charName = 'Koby';
  const url = `https://onepiece.fandom.com/api.php?action=parse&page=${encodeURIComponent(charName)}&prop=wikitext&format=json`;
  
  console.log(`Fetching: ${url}`);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'OnePieceApp/1.0 (contact@example.com)' }
    });
    const data = await res.json();
    if (data.parse && data.parse.wikitext) {
      const wikitext = data.parse.wikitext['*'];
      console.log('Got wikitext of length:', wikitext.length);
      console.log('Sample wikitext (first 1000 chars):');
      console.log(wikitext.substring(0, 1000));
    } else {
      console.log('No parse found:', data);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
  process.exit(0);
}

testFandom();
