#!/usr/bin/env node
/* يحوّل content/journeys/*.json إلى src/data-journeys.js (يُستدعى تلقائيًا من tools/build.mjs).
   - الترتيب من content/journeys/_order.json (يحدد ترتيب الظهور داخل كل تصنيف).
   - لكل رحلة: id,title,short,icon,sub,cat,labels[3],stages,days[{title,ref,s1,s2,s3,question,task}], و(اختياري) sync/season/stageAt،
     و src (المصدر) و review {status: draft|needs-review|reviewed, note}.
   - التحقق: ٧ حقول لكل يوم، المراجع غير فارغة، ووجود المراحل. الفشل يوقف البناء. */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'content/journeys');
const order = JSON.parse(readFileSync(join(dir, '_order.json'), 'utf8'));
const errs = [], out = {}, stat = { reviewed: 0, 'needs-review': 0, draft: 0 };
for (const id of order) {
  const f = join(dir, id + '.json');
  if (!existsSync(f)) { errs.push(`${id}: ملف مفقود`); continue; }
  const j = JSON.parse(readFileSync(f, 'utf8'));
  if (j.id !== id) errs.push(`${id}: id غير مطابق لاسم الملف`);
  for (const k of ['title', 'short', 'icon', 'sub', 'cat', 'labels', 'stages', 'days']) if (j[k] == null) errs.push(`${id}: حقل ناقص ${k}`);
  if (!Array.isArray(j.labels) || j.labels.length !== 3) errs.push(`${id}: labels لازم ٣`);
  if (!j.stages || j.stages.length !== 4) errs.push(`${id}: stages لازم ٤`);
  if (j.stageAt && j.stageAt.length !== j.days.length) errs.push(`${id}: stageAt لا يطابق عدد الأيام`);
  j.days.forEach((d, i) => {
    if (!d.title) errs.push(`${id} يوم ${i + 1}: بدون عنوان`);
    if (d.ref == null) errs.push(`${id} يوم ${i + 1}: بدون ref`);
    if (!d.question || !d.task) errs.push(`${id} يوم ${i + 1}: سؤال/مهمة ناقصة`);
  });
  const st = (j.review && j.review.status) || 'draft'; stat[st] = (stat[st] || 0) + 1;
  const o = { id: j.id, title: j.title, short: j.short, icon: j.icon, sub: j.sub, cat: j.cat, labels: j.labels, stages: j.stages };
  for (const k of Object.keys(j)) if (!(k in o) && !['days', 'review'].includes(k)) o[k] = j[k];
  o.days = j.days.map(d => { const a = [d.title, d.ref, d.s1 || '', d.s2 || '', d.s3 || '', d.question, d.task]; if (d.quote) a.push({ q: d.quote.text, p: d.quote.page, c: d.quote.chapter || '', f: d.quote.file || '', b: d.quote.book || null }); return a; });
  { // ترتيب الاقتباسات: صفحات الكتاب الواحد تصاعدية (الرحلة تتبع ترتيب الكتاب)
    const last = {};
    const seenFile = {}; j.days.forEach((d, i) => { if (!d.quote) return; const bk = (d.quote.book && d.quote.book.title) || (j.book && j.book.title) || ''; const fk = bk + '|' + (d.quote.file || ''); if (d.quote.file && !seenFile[fk] && last[bk] != null) { seenFile[fk] = 1; last[bk] = null; } seenFile[fk] = 1; if (last[bk] != null && d.quote.page < last[bk]) errs.push(`${id} يوم ${i + 1}: الصفحة ${d.quote.page} أقدم من السابقة ${last[bk]} (ترتيب الكتاب)`); last[bk] = d.quote.page; });
  }
  if (j.book || j.days.some(d => d.quote)) { if (j.book && !j.book.title) errs.push(`${id}: book.title ناقص`); j.days.forEach((d, i) => { if (!d.quote || !d.quote.text || !d.quote.page) errs.push(`${id} يوم ${i + 1}: رحلة كتاب بلا اقتباس/صفحة`); }); }
  out[id] = o;
}
if (errs.length) { console.error('أخطاء المحتوى:\n' + errs.join('\n')); process.exit(1); }
const body = `/* مُولَّد من content/journeys/*.json بواسطة tools/content-build.mjs — لا تعدّل هذا الملف يدويًا. */
(function () {
  "use strict";
  var D = ${JSON.stringify(out)};
  var P = (window.__progData = window.__progData || {});
  Object.keys(D).forEach(function (k) { P[k] = D[k]; });
})();
`;
mkdirSync(join(root, 'src'), { recursive: true });
const target = join(root, 'src/data-journeys.js');
if (!existsSync(target) || readFileSync(target, 'utf8') !== body) writeFileSync(target, body);
console.log(`المحتوى: ${order.length} رحلة · مراجَع ${stat.reviewed} · يحتاج مراجعة ${stat['needs-review']} · مسوّدة ${stat.draft}`);

/* ---------- الألحان والتماجيد: content/hymns/*.json → src/data-hymns.js (window.__hymns) ---------- */
{
  const hd = join(root, 'content/hymns'), herrs = [], list = [];
  for (const id of JSON.parse(readFileSync(join(hd, '_order.json'), 'utf8'))) {
    const f = join(hd, id + '.json');
    if (!existsSync(f)) { herrs.push(`${id}: ملف مفقود`); continue; }
    const j = JSON.parse(readFileSync(f, 'utf8'));
    if (j.id !== id) herrs.push(`${id}: id غير مطابق`);
    for (const k of ['kind', 'title', 'src', 'lines']) if (j[k] == null) herrs.push(`${id}: حقل ناقص ${k}`);
    if (!j.src || !j.src.name) herrs.push(`${id}: المصدر ناقص`);
    if (!Array.isArray(j.lines) || !j.lines.length || j.lines.some(l => typeof l !== 'string' || !l.trim())) herrs.push(`${id}: أسطر غير صالحة`);
    list.push({ id: j.id, kind: j.kind, title: j.title, sub: j.sub || '', src: j.src, review: j.review || null, refrain: Array.isArray(j.refrain) ? j.refrain : null, lines: j.lines });
  }
  if (herrs.length) { console.error('أخطاء الألحان:\n' + herrs.join('\n')); process.exit(1); }
  const hb = `/* مُولَّد من content/hymns/*.json بواسطة tools/content-build.mjs — لا تعدّل هذا الملف يدويًا. */\n(function () {\n  "use strict";\n  window.__hymns = ${JSON.stringify(list)};\n})();\n`;
  const ht = join(root, 'src/data-hymns.js');
  if (!existsSync(ht) || readFileSync(ht, 'utf8') !== hb) writeFileSync(ht, hb);
  console.log(`الألحان: ${list.length}`);
}

/* ---------- أطلس الكتاب: content/atlas/*.json → src/data-atlas.js (window.__atlas) ----------
   التحقق: معرّفات فريدة، روابط الأسرة والنسب والخرائط تشير لعناصر موجودة، والإحداثيات داخل مجال الخرائط. */
{
  const ad = join(root, 'content/atlas'), aerrs = [];
  const rd = f => JSON.parse(readFileSync(join(ad, f + '.json'), 'utf8'));
  const pe = rd('people'), li = rd('lines'), geo = rd('geo'), pl = rd('places'), mp = rd('maps');
  const uniq = (arr, what) => { const s = new Set(); for (const x of arr) { if (s.has(x.id)) aerrs.push(`${what}: id مكرر ${x.id}`); s.add(x.id); } return s; };
  const pids = uniq(pe.people, 'شخصيات'), plids = uniq(pl.places, 'أماكن'); uniq(mp.maps, 'خرائط');
  const gids = new Set(pe.groups.map(g => g[0]));
  for (const p of pe.people) {
    for (const k of ['n', 'g', 't', 'd', 'r']) if (!p[k] || (Array.isArray(p[k]) && !p[k].length)) aerrs.push(`${p.id}: حقل ناقص ${k}`);
    if (!gids.has(p.g)) aerrs.push(`${p.id}: مجموعة غير معروفة ${p.g}`);
    for (const f of p.fam || []) if (f[2] && !pids.has(f[2])) aerrs.push(`${p.id}: قريب غير موجود ${f[2]}`);
  }
  for (const l of li.lines) for (const it of l.items) for (const k of ['id', 'woman_id']) if (it[k] && !pids.has(it[k])) aerrs.push(`${l.id}: ${it[k]} غير موجود`);
  for (const m of li.tribes.mothers) if (m.id && !pids.has(m.id)) aerrs.push(`tribes: ${m.id} غير موجود`);
  for (const p of pl.places) {
    if (!p.n || !p.d || !p.r || !p.r.length) aerrs.push(`${p.id}: حقل ناقص`);
    if (!Array.isArray(p.ll) || p.ll.length !== 2) aerrs.push(`${p.id}: إحداثيات غير صالحة`);
  }
  for (const m of mp.maps) {
    const [x0, y0, x1, y1] = m.vb, inside = ll => ll[0] >= x0 && ll[0] <= x1 && ll[1] >= y0 && ll[1] <= y1;
    const pt = r => Array.isArray(r) ? r : (pl.places.find(p => p.id === r) || {}).ll;
    for (const g of m.legs) for (const r of g.ids) { const ll = pt(r); if (!ll) aerrs.push(`${m.id}: مكان غير موجود ${r}`); else if (!inside(ll)) aerrs.push(`${m.id}: ${r} خارج حدود الخريطة`); }
    for (const r of m.pins) { if (!plids.has(r)) aerrs.push(`${m.id}: دبوس غير موجود ${r}`); else if (!inside(pt(r))) aerrs.push(`${m.id}: دبوس ${r} خارج حدود الخريطة`); }
  }
  if (aerrs.length) { console.error('أخطاء الأطلس:\n' + aerrs.join('\n')); process.exit(1); }
  const A = { groups: pe.groups, people: pe.people, lines: li.lines, tribes: li.tribes, geo, places: pl.places, maps: mp.maps };
  const ab = `/* مُولَّد من content/atlas/*.json بواسطة tools/content-build.mjs — لا تعدّل هذا الملف يدويًا. */\n(function () {\n  "use strict";\n  window.__atlas = ${JSON.stringify(A)};\n})();\n`;
  const at = join(root, 'src/data-atlas.js');
  if (!existsSync(at) || readFileSync(at, 'utf8') !== ab) writeFileSync(at, ab);
  console.log(`الأطلس: ${pe.people.length} شخصية · ${pl.places.length} مكانًا · ${mp.maps.length} خرائط · ${li.lines.length} سلاسل نسب`);
}
