#!/usr/bin/env node
/* يتحقق من كل مرجع كتابي في content/atlas/*.json مقابل نص الكتاب المقدس داخل البرنامج (اسم السفر، الإصحاح، الآيات).
   الاستخدام: node tools/qa/atlas-refs.mjs — يخرج برمز ≠ 0 عند وجود مرجع غير صالح. */
import { readFileSync, readdirSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const f = readdirSync(root).find(x => /^data-bibleData\.[0-9a-f]{10}\.js$/.test(x));
globalThis.window = {};
new Function('window', readFileSync(join(root, f), 'utf8'))(globalThis.window);
const bible = JSON.parse(gunzipSync(Buffer.from(window.__RF_DATA.bibleData, "base64")).toString()).books;
const AR = { '٠': 0, '١': 1, '٢': 2, '٣': 3, '٤': 4, '٥': 5, '٦': 6, '٧': 7, '٨': 8, '٩': 9 };
const ci = bible.map(b => b.n);
const bad = [], refs = [];
const rd = n => JSON.parse(readFileSync(join(root, 'content/atlas', n + '.json'), 'utf8'));
rd('people').people.forEach(p => p.r.forEach(r => refs.push([p.id, r])));
rd('places').places.forEach(p => p.r.forEach(r => refs.push([p.id, r])));
rd('lines').lines.forEach(l => l.r.forEach(r => refs.push([l.id, r])));
rd('lines').tribes.r.forEach(r => refs.push(['tribes', r]));
rd('maps').maps.forEach(m => m.refs.forEach(r => refs.push([m.id, r])));
for (const [who, ref] of refs) {
  const m = String(ref).replace(/[٠-٩]/g, c => AR[c]).match(/^(.*?)\s*(\d+)\s*(?::\s*(\d+)\s*(?:[-–]\s*(\d+))?)?$/);
  if (!m) { bad.push(`${who}: صيغة ${ref}`); continue; }
  const bi = ci.indexOf(m[1].trim());
  if (bi < 0) { bad.push(`${who}: سفر غير معروف «${m[1]}»`); continue; }
  const ch = +m[2], book = bible[bi];
  if (!book.c[ch - 1]) { bad.push(`${who}: ${ref} — الإصحاح غير موجود`); continue; }
  const n = book.c[ch - 1].length, v1 = m[3] ? +m[3] : 0, v2 = m[4] ? +m[4] : v1;
  const off = book.vn ? book.vn[ch - 1] - 1 : 0;
  if (v1 && (v1 - off < 1 || v2 - off > n)) bad.push(`${who}: ${ref} — الآية خارج الإصحاح (${n} آية)`);
}
console.log(`مراجع الأطلس: ${refs.length}  أخطاء: ${bad.length}`);
if (bad.length) { console.error(bad.join('\n')); process.exit(1); }
