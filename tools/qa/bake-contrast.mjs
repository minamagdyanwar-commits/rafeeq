// يخبز تصحيحات التباين التي يجريها المُصلح وقت التشغيل (app39) داخل src/app49.css كقواعد ثابتة لكل تصميم/وضع.
//   RF_TOOLS=... node tools/qa/bake-contrast.mjs [designs]   ثم: node tools/build.mjs
// بعد الخَبز يجب أن يُظهر tools/qa/fixlog.mjs صفر تصحيحات وقت التشغيل.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { serve } from './serve.mjs'; import { crawl } from './crawl.mjs';
const PW = process.env.PW || '/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium } = await import(PW);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PORT = +process.env.PORT || 8777; const srv = process.env.BASE ? null : await serve(PORT); const BASE = process.env.BASE || `http://localhost:${PORT}`;
const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' });
const DES = (process.argv[2] || 'bearer,church,classic,cross,crown,glory,holy,lamp,qalaya,royal,shroud').split(',');
const RAW = process.env.RAW || '/tmp/bake-raw'; fs.mkdirSync(RAW, { recursive: true });
const rules = {}; // theme → path → Set(colors)
const only = process.argv.includes('--cached');
for (const d of DES) for (const m of ['dark', 'light']) {
  const rawf = path.join(RAW, `${d}-${m}.json`);
  let theme, log;
  if (only && fs.existsSync(rawf)) ({ theme, log } = JSON.parse(fs.readFileSync(rawf, 'utf8')));
  else {
    const p = await b.newPage({ viewport: { width: 390, height: 844 } });
    await p.addInitScript(([d, m]) => { localStorage.setItem('rafeeq_v76_design', d); localStorage.setItem('khalwa_settings_v80', JSON.stringify({ themeMode: m })); localStorage.setItem('rafeeq_lines_hint_v2', '1'); window.__talkFast = 1; }, [d, m]);
    await p.route(/app49\.[0-9a-f]+\.css/, r => r.fulfill({ body: '', contentType: 'text/css' })); // نقيس بدون الخَبز السابق
    await p.goto(BASE + '/index.html'); await p.waitForTimeout(1600);
    await crawl(p, async () => { await p.waitForTimeout(250); });
    ({ theme, log } = await p.evaluate(() => ({ theme: document.documentElement.getAttribute('data-rf-theme'), log: window.__rfFixLog || {} })));
    fs.writeFileSync(rawf, JSON.stringify({ theme, log }));
    await p.close();
  }
  rules[theme] = rules[theme] || {};
  for (const [pth, cols] of Object.entries(log)) { (rules[theme][pth] = rules[theme][pth] || new Set()); Object.keys(cols).forEach(c => rules[theme][pth].add(c)); }
  console.log(`${d}/${m} (${theme}): ${Object.keys(log).length} مسارًا`);
}
let css = '/* مُولَّد بواسطة tools/qa/bake-contrast.mjs — لا تعدّله يدويًا. تصحيحات تباين ثابتة كانت تجريها app39 وقت التشغيل. */\n', n = 0, amb = 0;
for (const theme of Object.keys(rules).sort()) {
  const lines = [];
  for (const [pth, cols] of Object.entries(rules[theme]).sort()) {
    const rgb = [...cols].map(c => c.match(/\d+/g).map(Number));
    const far = rgb.some(a => rgb.some(b2 => Math.hypot(a[0] - b2[0], a[1] - b2[1], a[2] - b2[2]) > 60));
    if (far) { amb++; console.log('غامض', theme, pth, [...cols].join(' ')); continue; } // ألوان متباعدة = يبقى للمُصلح
    const avg = [0, 1, 2].map(i => Math.round(rgb.reduce((t, c) => t + c[i], 0) / rgb.length));
    lines.push(`html[data-rf-theme="${theme}"] ${pth}{color:rgb(${avg.join(',')})!important}`); n++;
  }
  if (lines.length) css += `/* ${theme} */\n` + lines.join('\n') + '\n';
}
fs.writeFileSync(path.join(root, 'src/app49.css'), css);
console.log(`خُبزت ${n} قاعدة، وتُركت ${amb} غامضة للمُصلح`);
await b.close(); if (srv) srv.close();
