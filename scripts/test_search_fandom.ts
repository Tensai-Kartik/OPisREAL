async function testSearch(name: string) {
  const searchUrl = `https://onepiece.fandom.com/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&format=json`;
  const res = await fetch(searchUrl, { headers: { 'User-Agent': 'OnePieceApp/1.0' } });
  const data = await res.json();
  console.log(`Search for "${name}":`, data.query?.search?.slice(0, 3).map((s: any) => s.title));
  
  if (data.query?.search?.[0]?.title) {
    const pageTitle = data.query.search[0].title;
    const parseUrl = `https://onepiece.fandom.com/api.php?action=parse&page=${encodeURIComponent(pageTitle)}&prop=wikitext&redirects=1&format=json`;
    const parseRes = await fetch(parseUrl, { headers: { 'User-Agent': 'OnePieceApp/1.0' } });
    const parseData = await parseRes.json();
    const wikitext = parseData.parse?.wikitext?.['*'] || '';
    const match = wikitext.match(/\{\{(?:Char Box|Infobox Character)[\s\S]*?\n\}\}/i);
    console.log(`Infobox matched for "${pageTitle}":`, Boolean(match));
    if (!match) {
      // Find template start
      const tStart = wikitext.indexOf('{{Char Box');
      if (tStart !== -1) {
        console.log('Snippet around {{Char Box:', wikitext.substring(tStart, tStart + 300));
      }
    }
  }
}

async function run() {
  await testSearch('Rob Lucci');
  await testSearch('Benn Beckman');
  process.exit(0);
}
run();
