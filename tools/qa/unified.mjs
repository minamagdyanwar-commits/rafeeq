// اختبار النماذج الموحّدة: النشاط (RF.act)، المفضّلات (RF.favs)، البحث (RF.search)، المحتوى.
const PW = process.env.PW || '/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium } = await import(PW);
import { serve } from './serve.mjs';
const PORT = +process.env.PORT || 8777, BASE = process.env.BASE || `http://localhost:${PORT}`;
const srv = process.env.BASE ? null : await serve(PORT);
const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' });
let fail = 0; const ok = (c, m) => { if (!c) fail++; console.log((c ? 'ok   ' : 'FAIL ') + m); };
for (const d of ['church', 'shroud']) {
  const p = await b.newPage({ viewport: { width: 390, height: 844 } }); const errs = [];
  p.on('pageerror', e => errs.push(e.message.slice(0, 100)));
  await p.addInitScript(d => { localStorage.setItem('rafeeq_v76_design', d); localStorage.setItem('rafeeq_lines_hint_v2', '1'); }, d);
  await p.goto(BASE + '/index.html'); await p.waitForTimeout(2200);
  // 1) النشاط: تسجيل صلاة يحدّث الدرجة والخطة ويطلق الحدث مرة
  const r1 = await p.evaluate(async () => {
    let ev = 0; RF.act.on(() => ev++);
    const k = __F.realKey(), s0 = __F.dayScore(k), p0 = __F.dayPlan().done;
    RF.act.set(k, 'hour:bakr', true); RF.act.set(k, 'read', true);
    await new Promise(r => setTimeout(r, 400));
    const o = { s0, s1: __F.dayScore(k), p0, p1: __F.dayPlan().done, ev, list: RF.act.list(k).join(','), hd: __F.hourDone(k, 'bakr'), rd: __F.readDone(k) };
    RF.act.set(k, 'hour:bakr', false); RF.act.set(k, 'read', false); await new Promise(r => setTimeout(r, 200));
    o.back = __F.dayScore(k); return o;
  });
  ok(r1.s1 === r1.s0 + 2 && r1.p1 === r1.p0 + 2 && r1.hd && r1.rd && r1.ev >= 1 && r1.back === r1.s0, `${d} activity: ${JSON.stringify(r1)}`);
  // 2) اتساق العدّاد: يومي = الهيدر = dayPlan
  const r2 = await p.evaluate(() => { const P = __F.dayPlan(); const y = document.querySelector('#v297Yomi .y-prog'); return { P: P.done + ' / ' + P.total, y: y && y.textContent.replace(/\s+/g, ' ').trim() }; });
  ok(!r2.y || r2.y.replace(/[٠-٩]/g, c => '٠١٢٣٤٥٦٧٨٩'.indexOf(c)) === r2.P, `${d} yomi count matches dayPlan ${JSON.stringify(r2)}`);
  // 3) المفضلات: كل المصادر مسجّلة (٩) وصفحة المفضلات تعرضها
  const r3 = await p.evaluate(async () => {
    localStorage.setItem('rafeeq_talk_favs_v1', JSON.stringify([{ ts: 1700000000000, t: 'سؤال', say: 'جواب' }]));
    const ids = RF.favs.sources().map(s => s.id); await new Promise(r => setTimeout(r, 50));
    document.querySelector('#uNavMore').click(); await new Promise(r => setTimeout(r, 400));
    document.querySelector('[data-ma="favs"]').click(); await new Promise(r => setTimeout(r, 900));
    return { ids: ids.join(','), txt: (document.querySelector('#page-favs') || {}).innerText || '', count: RF.favs.count() };
  });
  ok(r3.ids.split(',').length >= 10 && /ردود صوت الله/.test(r3.txt) && r3.count >= 1, `${d} favs registry ${r3.ids} count=${r3.count}`);
  // 4) البحث الموحّد: الرحلات والمفضلات والكتاب
  const r4 = await p.evaluate(async () => {
    document.querySelector('#uSearchBtn').click(); await new Promise(r => setTimeout(r, 200));
    const inp = document.querySelector('#uSearchIn'); const out = {};
    for (const q of ['الغضب', 'يوحنا 3:16', 'سؤال']) {
      inp.value = q; inp.dispatchEvent(new Event('input', { bubbles: true })); await new Promise(r => setTimeout(r, 1800));
      out[q] = [...document.querySelectorAll('#uSearchRes .so-sec')].map(e => e.textContent).join('|');
    }
    return out;
  });
  ok(/الرحلات/.test(r4['الغضب']) && /الكتاب المقدس/.test(r4['يوحنا 3:16']) && /مفضّلاتي/.test(r4['سؤال']), `${d} search ${JSON.stringify(r4)}`);
  ok(!errs.length, `${d} no page errors ${errs.join('|')}`);
  await p.close();
}
await b.close(); if (srv) srv.close(); process.exit(fail ? 1 : 0);
