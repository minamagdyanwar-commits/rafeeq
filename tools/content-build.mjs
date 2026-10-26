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
    list.push({ id: j.id, kind: j.kind, title: j.title, sub: j.sub || '', src: j.src, review: j.review || null, lines: j.lines });
  }
  if (herrs.length) { console.error('أخطاء الألحان:\n' + herrs.join('\n')); process.exit(1); }
  const hb = `/* مُولَّد من content/hymns/*.json بواسطة tools/content-build.mjs — لا تعدّل هذا الملف يدويًا. */\n(function () {\n  "use strict";\n  window.__hymns = ${JSON.stringify(list)};\n})();\n`;
  const ht = join(root, 'src/data-hymns.js');
  if (!existsSync(ht) || readFileSync(ht, 'utf8') !== hb) writeFileSync(ht, hb);
  console.log(`الألحان: ${list.length}`);
}
