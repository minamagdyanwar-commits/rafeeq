#!/usr/bin/env node
/* يقيس اكتمال نصوص القراءات اليومية (قطمارس الأيام في src/app5.js): لكل قراءة له shortRef (مثل «عبرانيين ١١: ١٧-٣١») يقارن عدد كلمات النص بعدد كلمات الآيات المحدَّدة في الكتاب المقدس داخل البرنامج،
   ويعدّ كل آية من المدى غير موجودة في النص. كلمات الأقواس المقصودة (ختام «نعمة الله الآب…») لا تُحتسب.
   الاستخدام: node tools/qa/readings-coverage.mjs [--min 0.85] [--ref «عبرانيين ١١: ١٧-٣١»] — يخرج برمز ≠ 0 لو وُجدت قراءة تحت الحد وبلا علامة حذف «...». */
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
const norm = s => s.replace(/[ً-ْٰـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[^ء-ي\s]/g, ' ').replace(/\s+/g, ' ').trim();
const strip = x => x.replace(/(^| )ال/g, '$1');
const ORD = { 1: ['اول', 'اولي'], 2: ['ثاني', 'ثانيه'], 3: ['ثالث', 'ثالثه'] };
function findBook(name) {
  const d = (name.match(/[1-3١-٣]/) || [''])[0], want = strip(norm(name.replace(/[0-9٠-٩]/g, ' '))), dn = d ? (d in AR ? AR[d] : +d) : 0;
  for (let i = 0; i < bible.length; i++) {
    const nm = strip(norm(bible[i].n)), has = ORD[1].concat(ORD[2], ORD[3]).some(o => nm.endsWith(' ' + strip(o)));
    if (!(nm === want || nm.startsWith(want + ' ') || want.startsWith(nm + ' '))) continue;
    if (dn && !ORD[dn].some(o => nm.endsWith(' ' + o))) continue;
    if (!dn && has && !['يوحنا'].includes(want)) { /* كتاب مرقّم بلا رقم في المرجع: تجاهل */ continue; }
    if (!dn && has) continue;
    return i;
  }
  return -1;
}
const a = process.argv, min = a.indexOf('--min') > 0 ? +a[a.indexOf('--min') + 1] : 0.85, only = a.indexOf('--ref') > 0 ? a[a.indexOf('--ref') + 1] : '';
const src = readFileSync(join(root, 'src/app5.js'), 'utf8');
const re = /shortRef:\s*"([^"]+)",\s*pericope:\s*\n?\s*"([^"]+)"/g;
let m, n = 0, skipped = 0, low = [], gaps = [];
while ((m = re.exec(src))) {
  const ref = m[1], raw = m[2];
  if (only && ref !== only) continue;
  const rr = ref.replace(/[٠-٩]/g, c => AR[c]).replace(/[–—]/g, '-');
  const x2 = rr.match(/^(.*?)\s*(\d+)\s*:\s*(\d+)\s*-\s*(\d+)\s*:\s*(\d+)\s*$/), x1 = rr.match(/^(.*?)\s*(\d+)\s*:\s*(\d+)\s*-\s*(\d+)\s*$/);
  const spans = x2 ? [[x2[1], +x2[2], +x2[3], 999], [x2[1], +x2[4], 1, +x2[5]]] : x1 ? [[x1[1], +x1[2], +x1[3], +x1[4]]] : null;
  if (!spans || (x2 && +x2[4] <= +x2[2])) { skipped++; continue; }
  const bi = findBook(spans[0][0]);
  if (bi < 0) { skipped++; continue; }
  const bk = bible[bi]; let vs = [], v1 = spans[0][2];
  for (const [, c, a1, a2] of spans) { const off = bk.vn ? bk.vn[c - 1] - 1 : 0, chv = bk.c[c - 1] || []; vs = vs.concat(chv.slice(a1 - off - 1, Math.min(a2, chv.length + off) - off)); }
  if (!vs.length) { skipped++; continue; }
  n++;
  const body = raw.replace(/\([^)]*\)/g, ' '), txt = norm(body), bw = norm(vs.join(' ')).split(' ').length, tw = txt.split(' ').length, ratio = tw / bw;
  const missing = vs.map((v, i) => [i + 1, norm(v).split(' ')]).filter(([, w]) => !txt.includes(w.slice(-3).join(' '))).map(([k]) => k);
  const ell = /\.\.\.|…/.test(raw);
  if (ratio < min && !ell) low.push([ratio, ref, tw, bw, missing]);
  if (only) console.log(`${ref}: نسبة ${ratio.toFixed(2)} · ناقص: ${missing.join('، ') || 'لا شيء'}${ell ? ' · فيه علامة حذف' : ''}`);
}
low.sort((x, y) => x[0] - y[0]);
if (!only) { console.log(`فُحص ${n} قراءة (تجاوُز ${skipped} بصيغة مركّبة) · تحت ${min} وبلا علامة حذف: ${low.length}`); low.slice(0, 30).forEach(r => console.log(`${r[0].toFixed(2)}  ${r[1]}  (نص ${r[2]} / كتاب ${r[3]})  آيات غير موجودة: ${r[4].length}`)); }
process.exit(low.length && !only ? 1 : 0);
