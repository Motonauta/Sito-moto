const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  await p.setContent('<body style="margin:0;background:#f3f7fb"><div id="c"></div></body>');
  const files = fs.readdirSync('frames').filter(f => f.endsWith('.svg')).sort();
  fs.mkdirSync('png', { recursive: true });
  for (const f of files) {
    const svg = fs.readFileSync('frames/' + f, 'utf8');
    await p.evaluate(s => { document.getElementById('c').innerHTML = s; }, svg);
    await p.screenshot({ path: 'png/' + f.replace('.svg', '.png'), clip: { x: 0, y: 0, width: 1280, height: 720 } });
  }
  await b.close();
  console.log('renderizzati', files.length);
})();
