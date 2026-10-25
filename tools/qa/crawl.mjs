// يزور كل الشاشات الرئيسية في صفحة playwright مفتوحة (للأدوات: fixlog وbake-contrast)
export async function crawl(p, step = async () => {}) {
  const nav = async g => { await p.evaluate(g => { const e = document.querySelector('#uNav [data-go="' + g + '"]'); e && e.click(); }, g); await p.waitForTimeout(1100); await step(g); };
  const more = async sel => { await p.evaluate(() => document.querySelector('#uNavMore').click()); await p.waitForTimeout(450); await p.evaluate(s => { const e = document.querySelector(s); e && e.click(); }, sel); await p.waitForTimeout(1200); await step(sel); };
  await step('home');
  await nav('pray');
  await p.evaluate(() => window.__rafeeq.act('hour', { dataset: { key: 'bakr' } })); await p.waitForTimeout(1300); await step('hour');
  for (const t of ['tabJourneys', 'tabMeditation', 'tabGuided']) { await p.evaluate(i => { const e = document.getElementById(i); e && e.click(); }, t); await p.waitForTimeout(700); await step(t); }
  for (const g of ['read', 'msg', 'exam', 'fat']) await nav(g);
  for (const m of ['syn', 'cal', 'favs', 'talk']) await more(`[data-ma="${m}"]`);
  await p.evaluate(() => __F.openBible(21, 23, 1)); await p.waitForTimeout(1800); await step('bible');
  for (const t of ['plan', 'dash', 'memo', 'track', 'khalwa', 'notes']) { await p.evaluate(t => __F.setTrkTab(t), t); await p.waitForTimeout(800); await step('trk-' + t); }
  await p.evaluate(() => document.querySelector('#uNavMore').click()); await p.waitForTimeout(450); await step('more-sheet'); await p.evaluate(() => __F.closeSheet());
  await p.evaluate(() => __prog.hub('all')); await p.waitForTimeout(600); await step('prog-hub');
  await p.evaluate(() => { __prog.close(); __prog.open('joseph'); }); await p.waitForTimeout(600); await step('prog-path');
  await p.evaluate(() => document.querySelector('.nd.now').click()); await p.waitForTimeout(800); await step('prog-day');
}
