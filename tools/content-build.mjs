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
  o.days = j.days.map(d => [d.title, d.ref, d.s1 || '', d.s2 || '', d.s3 || '', d.question, d.task]);
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
