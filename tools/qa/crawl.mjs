// يزور كل الشاشات الرئيسية في صفحة playwright مفتوحة (للأدوات: fixlog وbake-contrast)
import { makeSettle } from './settle.mjs';
export async function crawl(p, step = async () => {}) {
  const { settle } = makeSettle(p);
  const nav = async g => { await p.evaluate(g => { const e = document.querySelector('#uNav [data-go="' + g + '"]'); e && e.click(); }, g); await settle(1100); await step(g); };
  const more = async sel => { await p.evaluate(() => document.querySelector('#uNavMore').click()); await settle(450); await p.evaluate(s => { const e = document.querySelector(s); e && e.click(); }, sel); await settle(1200); await step(sel); };
  await p.evaluate(async () => { try { const F = __F; await F.bible.load(); const st = F.dkey(F.addDays(F.parseKey(F.dkey()), -10)); const pr = F.prefs(); pr.plan = { scope: 'gospels', days: 30, start: st, name: 'خطة الأناجيل', from: 0 }; F.savePrefs(pr); } catch (e) {} }); await settle(400);
  await step('home');
  await nav('pray');
  await p.evaluate(() => window.__rafeeq.act('hour', { dataset: { key: 'bakr' } })); await settle(1300); await step('hour');
  for (const t of ['tabJourneys', 'tabMeditation', 'tabGuided']) { await p.evaluate(i => { const e = document.getElementById(i); e && e.click(); }, t); await settle(700); await step(t); }
  for (const g of ['read', 'msg', 'exam', 'fat']) await nav(g);
  for (const m of ['syn', 'cal', 'favs', 'talk']) await more(`[data-ma="${m}"]`);
  await p.evaluate(() => __F.openBible(21, 23, 1)); await settle(1800); await step('bible');
  for (const t of ['plan', 'dash', 'memo', 'track', 'khalwa', 'notes']) { await p.evaluate(t => __F.setTrkTab(t), t); await settle(800); await step('trk-' + t); }
  await p.evaluate(() => { __F.setTrkTab('plan'); }); await settle(700); await p.evaluate(() => { const x = document.querySelector('[data-tback]'); x && x.click(); }); await settle(600); await step('plan-backfill-sheet'); await p.evaluate(() => __F.closeSheet());
  await p.evaluate(() => { __F.setTrkTab('track'); }); await settle(700); await p.evaluate(() => { const x = document.querySelector('[data-v70="backfill"]'); x && x.click(); }); await settle(700); await step('bf-grid'); await p.evaluate(() => __F.closeSheet());
  await p.evaluate(() => document.querySelector('#uNavMore').click()); await settle(450); await step('more-sheet'); await p.evaluate(() => __F.closeSheet());
  await p.evaluate(() => __prog.hub('all')); await settle(600); await step('prog-hub');
  await p.evaluate(() => { __prog.close(); __prog.open('joseph'); }); await settle(600); await step('prog-path');
  await p.evaluate(() => document.querySelector('.nd.now').click()); await settle(800); await step('prog-day');
  await p.evaluate(() => { try { __prog.close(); } catch (e) {} });
  await p.evaluate(() => __hymLib.open()); await settle(500); await step('hymlib');
  await p.evaluate(() => { __hymnsUI.open('emsek_ya_rab'); }); await settle(500); await step('hymn-ref');
  await p.evaluate(() => { try { __hymnsUI.close(); __hymLib.close(); } catch (e) {} });
  await p.evaluate(() => __churchDay.open()); await settle(700); await step('churchday'); await p.evaluate(() => { try { __churchDay.close(); } catch (e) {} });
  await p.evaluate(() => __F.openBible(0, 22, 1)); await settle(1800); await p.evaluate(() => { const e = document.getElementById('chCtx'); e && e.scrollIntoView({ block: 'center' }); }); await settle(300); await step('bible-ctx');
}
