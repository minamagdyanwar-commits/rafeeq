// مقارنة بصرية بين بناءين: node tools/qa/visual.mjs <BASE_A> <BASE_B> [designs] [modes]
// يلتقط نفس الحالات (ثابتة الوقت والعشوائية) من الاثنين ويحسب نسبة البكسلات المختلفة. يتطلب pngjs و pixelmatch (RF_TOOLS).
import { createRequire } from 'node:module';
const PW = process.env.PW || '/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium } = await import(PW);
const req = createRequire(import.meta.url);
const tp = { paths: [process.env.RF_TOOLS || '.'] };
const { PNG } = req(req.resolve('pngjs', tp));
const pmMod = await import(req.resolve('pixelmatch', tp)); const pixelmatch = pmMod.default || pmMod;
const [A, B] = [process.argv[2], process.argv[3]];
const DES = (process.argv[4] || 'bearer,church,classic,cross,crown,glory,holy,lamp,qalaya,royal,shroud').split(',');
const MODES = (process.argv[5] || 'dark,light').split(',');
const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' });
const INIT = ([d, m]) => {
  localStorage.setItem('rafeeq_v76_design', d); localStorage.setItem('khalwa_settings_v80', JSON.stringify({ themeMode: m }));
  localStorage.setItem('rafeeq_lines_hint_v2', '1'); window.__talkFast = 1;
  let s = 12345; Math.random = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const T = new Date('2026-10-25T10:00:00').getTime(), D = Date; const off = T - D.now();
  window.Date = class extends D { constructor(...a) { if (a.length) super(...a); else super(D.now() + off); } static now() { return D.now() + off; } };
  const st = document.createElement('style'); st.textContent = '*{animation:none!important;transition:none!important;caret-color:transparent!important}';
  document.addEventListener('DOMContentLoaded', () => document.head.appendChild(st));
};
const STATES = [
  ['home', async p => {}],
  ['pray', async p => { await p.evaluate(() => document.querySelector('#uNav [data-go="pray"]').click()); }],
  ['read', async p => { await p.evaluate(() => document.querySelector('#uNav [data-go="read"]').click()); }],
  ['msg', async p => { await p.evaluate(() => document.querySelector('#uNav [data-go="msg"]').click()); }],
  ['more', async p => { await p.evaluate(() => document.querySelector('#uNavMore').click()); }],
  ['bible', async p => { await p.evaluate(() => __F.openBible(21, 23, 1)); await p.waitForTimeout(1500); }],
  ['track', async p => { await p.evaluate(() => { document.querySelector('#uNavMore').click(); }); await p.waitForTimeout(400); await p.evaluate(() => document.querySelector('[data-mt]').click()); }],
  ['journeys', async p => { await p.evaluate(() => __prog.hub('all')); }],
  ['journey-day', async p => { await p.evaluate(() => { __prog.open('joseph'); }); await p.waitForTimeout(500); await p.evaluate(() => document.querySelector('.nd.now').click()); }],
];
let worst = 0, diffs = 0, total = 0;
for (const d of DES) for (const m of MODES) {
  const res = [];
  for (const base of [A, B]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    const p = await ctx.newPage(); await p.addInitScript(INIT, [d, m]);
    await p.goto(base + '/index.html'); await p.waitForTimeout(2200);
    await p.evaluate(() => { try { __F.closeSheet(); } catch (e) {} });
    const shots = {};
    for (const [n, fn] of STATES) {
      try { await p.evaluate(() => { try { __prog.close(); __F.closeSheet(); } catch (e) {} }); await fn(p); await p.waitForTimeout(900); shots[n] = await p.screenshot(); } catch (e) { shots[n] = null; }
    }
    await ctx.close(); res.push(shots);
  }
  for (const [n] of STATES) {
    total++;
    const a = res[0][n], c = res[1][n];
    if (!a || !c) { if (a !== c) { diffs++; console.log(`DIFF ${d}/${m}/${n}: one side failed`); } continue; }
    const A1 = PNG.sync.read(a), B1 = PNG.sync.read(c);
    const n2 = pixelmatch(A1.data, B1.data, null, A1.width, A1.height, { threshold: 0.1 });
    const pct = 100 * n2 / (A1.width * A1.height);
    if (pct > 0.05) { diffs++; worst = Math.max(worst, pct); console.log(`DIFF ${d}/${m}/${n}: ${pct.toFixed(2)}%`); }
  }
}
console.log(`compared ${total} states, ${diffs} differ, worst ${worst.toFixed(2)}%`);
await b.close(); process.exit(diffs ? 1 : 0);
