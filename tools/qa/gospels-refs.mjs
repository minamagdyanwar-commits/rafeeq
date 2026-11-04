#!/usr/bin/env node
/* يتحقق من كل مرجع في content/gospels/parallels.json مقابل نص الكتاب المقدس داخل البرنامج، ومن أن كل مرجع داخل إنجيله (متى/مرقس/لوقا/يوحنا)،
   وأن كل حدث يضم إنجيلين على الأقل. وبـ --show يطبع نصوص آيات حدث (node tools/qa/gospels-refs.mjs --show lk:gethsemane).
   الاستخدام: node tools/qa/gospels-refs.mjs — يخرج برمز ≠ 0 عند وجود مرجع غير صالح. */
import { readFileSync, readdirSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const f = readdirSync(root).find(x => /^data-bibleData\.[0-9a-f]{10}\.js$/.test(x));
globalThis.window = {};
new Function('window', readFileSync(join(root, f), 'utf8'))(globalThis.window);
const bible = JSON.parse(gunzipSync(Buffer.from(window.__RF_DATA.bibleData, 'base64')).toString()).books;
const AR = { '٠': 0, '١': 1, '٢': 2, '٣': 3, '٤': 4, '٥': 5, '٦': 6, '٧': 7, '٨': 8, '٩': 9 };
const ci = bible.map(b => b.n), NAME = { mt: 'متى', mk: 'مرقس', lk: 'لوقا', jn: 'يوحنا' };
const D = JSON.parse(readFileSync(join(root, 'content/gospels/parallels.json'), 'utf8'));
const bad = [], seen = new Set(); let n = 0;
const text = (ref) => {
  const m = String(ref).replace(/[٠-٩]/g, c => AR[c]).match(/^(.*?)\s*(\d+)\s*:\s*(\d+)\s*(?:[-–]\s*(\d+))?$/);
  if (!m) return null; const bi = ci.indexOf(m[1].trim()); if (bi < 0) return null;
  const book = bible[bi], ch = +m[2]; if (!book.c[ch - 1]) return null;
  const off = book.vn ? book.vn[ch - 1] - 1 : 0, v1 = +m[3], v2 = m[4] ? +m[4] : v1;
  if (v1 - off < 1 || v2 - off > book.c[ch - 1].length) return null;
  return book.c[ch - 1].slice(v1 - off - 1, v2 - off).join(' ');
};
const show = process.argv.indexOf('--show');
for (const e of D.events) {
  if (seen.has(e.id)) bad.push(`${e.id}: id مكرر`); seen.add(e.id);
  if (!D.cats.some(c => c[0] === e.cat)) bad.push(`${e.id}: تصنيف غير معروف ${e.cat}`);
  const gs = Object.keys(e.refs); if (gs.length < 2) bad.push(`${e.id}: أقل من إنجيلين`);
  for (const g of gs) for (const r of e.refs[g]) {
    n++;
    if (!String(r).startsWith(NAME[g] + ' ')) bad.push(`${e.id}: ${r} ليس في ${NAME[g]}`);
    if (text(r) == null) bad.push(`${e.id}: مرجع غير صالح «${r}»`);
  }
  if (show > 0 && process.argv[show + 1] === e.id) for (const g of gs) for (const r of e.refs[g]) console.log(`[${r}] ${text(r)}\n`);
}
console.log(`مراجع الأناجيل: ${n} في ${D.events.length} حدثًا  أخطاء: ${bad.length}`);
if (bad.length) { console.error(bad.join('\n')); process.exit(1); }
