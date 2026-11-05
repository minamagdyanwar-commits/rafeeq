#!/usr/bin/env node
/* يتحقق من كل مرجع في content/study/*.json مقابل نص الكتاب المقدس داخل البرنامج (اسم السفر، الإصحاح، الآيات)، ومن أن مراجع كل عمود في السفر المنتظر منه
   (مثلًا عمود «متى» داخل متى) عبر حقل book اختياري في القسم. وبـ --show يطبع نصوص حدث: node tools/qa/study-refs.mjs --show gospels:transfiguration
   يخرج برمز ≠ 0 عند وجود مرجع غير صالح. */
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
const ci = bible.map(b => b.n);
const text = ref => {
  const m = String(ref).replace(/[٠-٩]/g, c => AR[c]).match(/^(.*?)\s*(\d+)\s*:\s*(\d+)\s*(?:[-–]\s*(\d+))?$/);
  if (!m) return null; const bi = ci.indexOf(m[1].trim()); if (bi < 0) return null;
  const book = bible[bi], ch = +m[2]; if (!book.c[ch - 1]) return null;
  const off = book.vn ? book.vn[ch - 1] - 1 : 0, v1 = +m[3], v2 = m[4] ? +m[4] : v1;
  if (v1 - off < 1 || v2 - off > book.c[ch - 1].length) return null;
  return book.c[ch - 1].slice(v1 - off - 1, v2 - off).join(' ');
};
const dir = join(root, 'content/study');
const bad = [], show = process.argv.indexOf('--show'), want = show > 0 ? process.argv[show + 1] : '';
let n = 0, events = 0;
for (const id of JSON.parse(readFileSync(join(dir, '_order.json'), 'utf8'))) {
  const j = JSON.parse(readFileSync(join(dir, id + '.json'), 'utf8'));
  const check = (who, refs, bookOf) => { for (const r of [].concat(refs)) { n++; const t = text(r); if (t == null) bad.push(`${who}: مرجع غير صالح «${r}»`); else if (bookOf && !String(r).startsWith(bookOf + ' ')) bad.push(`${who}: ${r} خارج ${bookOf}`); if (want === `${id}:${who.split('/')[1]}` && t) console.log(`[${r}] ${t}\n`); } };
  if (j.kind === 'parallel') for (const e of j.events) { events++; for (const c of e.cols) check(`${id}/${e.id}`, c.r, ({ mt: 'متى', mk: 'مرقس', lk: 'لوقا', jn: 'يوحنا' })[c.k] && id === 'gospels' ? ({ mt: 'متى', mk: 'مرقس', lk: 'لوقا', jn: 'يوحنا' })[c.k] : null); }
  else if (j.kind === 'collection') for (const c of j.collections) { events++; for (const it of c.items) check(`${id}/${c.id}`, it.r); }
}
console.log(`مراجع الدراسة: ${n} في ${events} حدثًا/مجموعة  أخطاء: ${bad.length}`);
if (bad.length) { console.error(bad.join('\n')); process.exit(1); }
