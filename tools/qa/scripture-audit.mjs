#!/usr/bin/env node
/* يدقّق مزامير القطمارس (psalmRef/psalm) وآيات الشواهد (ref/text) في src/app5.js مقابل نص الكتاب المقدس داخل البرنامج (فان دايك).
   - المزامير: يطابق جمل كل مزمور بآيات المزمور (رقم المزمور السبعيني = العبري−١ للمزامير ١٠–١٤٦) ثم يقارن أرقام الآيات المطابقة بالمكتوبة في المرجع.
   - الشواهد: يقيس نسبة كلمات النص الموجودة في آيات المرجع (اقتباسات مختصرة بـ«…» مقبولة)، ويقترح أقرب آيات لو ضعف التطابق.
   الاستخدام: node tools/qa/scripture-audit.mjs [--psalms|--verses] [--json]   — للمراجعة فقط، لا يعدّل شيئًا. */
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
const num = s => +String(s).replace(/[٠-٩]/g, c => AR[c]);
const normS = s => s.replace(/[ً-ْٰـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[^ء-ي\s]/g, ' ').replace(/\s+/g, ' ').trim();
const strip = x => x.replace(/(^| )ال/g, '$1');
const ORD = { 1: ['اول', 'اولي'], 2: ['ثاني', 'ثانيه'], 3: ['ثالث', 'ثالثه'] };
function findBook(name) {
  const d = (name.match(/[1-3١-٣]/) || [''])[0], want = strip(normS(name.replace(/[0-9٠-٩]/g, ' '))), dn = d ? (d in AR ? AR[d] : +d) : 0;
  for (let i = 0; i < bible.length; i++) {
    const nm = strip(normS(bible[i].n)), has = Object.values(ORD).flat().some(o => nm.endsWith(' ' + o));
    if (!(nm === want || nm.startsWith(want + ' ') || want.startsWith(nm + ' '))) continue;
    if (dn && !ORD[dn].some(o => nm.endsWith(' ' + o))) continue;
    if (!dn && has) continue;
    return i;
  }
  return -1;
}
const chap = (bi, ch) => { const c = bible[bi].c[ch - 1]; return c ? (Array.isArray(c) ? c : Object.values(c)) : null; };
const stem = w => w.replace(/^(و|ف|ب|ل|ك)/, '').replace(/^ال/, '').slice(0, 4);
const bag = s => normS(s).split(' ').map(stem).filter(w => w.length > 1);
const overlap = (a, b) => { const B = new Set(b); let k = 0; for (const w of a) if (B.has(w)) k++; return a.length ? k / a.length : 0; };
const src = readFileSync(join(root, 'src/app5.js'), 'utf8');
const lineOf = i => src.slice(0, i).split('\n').length;
/* سياق الصفحة: أقرب عنوان (title) قبل الموضع */
function ctx(i) { const m = [...src.slice(Math.max(0, i - 12000), i).matchAll(/title:\s*"([^"]+)"/g)]; return m.length ? m[m.length - 1][1].slice(0, 60) : ''; }
const a = process.argv, onlyP = a.includes('--psalms'), onlyV = a.includes('--verses'), asJson = a.includes('--json');
const out = { psalms: [], verses: [] };

if (!onlyV) {
  const re = /psalmRef:\s*"([^"]+)",\s*psalm:\s*\n?\s*"([^"]+)"/g; let m;
  const psB = bible.findIndex(b => /مزامير/.test(b.n));
  while ((m = re.exec(src))) {
    const mm = /^مزمور\s*([٠-٩]+)\s*:\s*(.*)$/.exec(m[1]); if (!mm) continue;
    const lxx = num(mm[1]), heb = lxx >= 10 && lxx <= 146 ? lxx + 1 : lxx, cited = (mm[2].match(/[٠-٩]+/g) || []).map(num);
    const vs = chap(psB, heb); if (!vs) continue;
    const sents = m[2].replace(/هَلِّلُويَا\.?/g, '').split(/(?<=[.؟!])\s+/).filter(x => normS(x).split(' ').length > 2);
    const got = new Set();
    sents.forEach(s => { const sb = bag(s); let bi = -1, bs = 0.45; vs.forEach((v, i) => { const sc = overlap(sb, bag(String(v))); if (sc > bs) { bs = sc; bi = i + 1; } }); if (bi > 0) got.add(bi); });
    const g = [...got].sort((x, y) => x - y);
    const status = !g.length ? 'غير-مطابق' : cited.every(c => g.includes(c)) && g.every(x => cited.includes(x) || true) ? 'سليم' : cited.some(c => g.includes(c + 1)) ? 'إزاحة+١' : cited.some(c => g.includes(c - 1)) ? 'إزاحة−١' : 'غير-مطابق';
    out.psalms.push({ line: lineOf(m.index), ctx: ctx(m.index), ref: m[1], hebPsalm: heb, cited, textVerses: g, status });
  }
}
if (!onlyP) {
  const re = /\{\s*ref:\s*"([^"]+)",\s*text:\s*(?:\n\s*)?(["'])((?:\\.|(?!\2).)*)\2/g; let m;
  while ((m = re.exec(src))) {
    const ref = m[1].replace(/[–—]/g, '-'), t = m[3]; if (t.length < 12) continue;
    const mm = /^(.*?)\s*([٠-٩0-9]+)\s*:\s*([٠-٩0-9]+)(?:\s*-\s*([٠-٩0-9]+))?(?:\s*،\s*([٠-٩0-9]+))?\s*$/.exec(ref); if (!mm) continue;
    const bi = findBook(mm[1]); if (bi < 0) continue;
    const ch = num(mm[2]), v1 = num(mm[3]), v2 = mm[4] ? num(mm[4]) : v1, extra = mm[5] ? num(mm[5]) : 0;
    let best = null;
    for (const c of /مزامير/.test(bible[bi].n) ? [ch, ch + 1] : [ch]) {
      const vs = chap(bi, c); if (!vs) continue;
      const want = []; for (let v = v1; v <= v2; v++) want.push(v); if (extra) want.push(extra);
      const sc = overlap(bag(t), bag(want.map(v => vs[v - 1] || '').join(' ')));
      if (!best || sc > best.sc) best = { sc, ch: c };
    }
    if (!best) continue;
    const row = { line: lineOf(m.index), ctx: ctx(m.index), ref: m[1], score: +best.sc.toFixed(2), text: t.slice(0, 70) };
    if (best.sc < 0.55) {
      /* أقرب آيات في نفس الأصحاح/السفر */
      let sug = null; const nb = bag(t);
      for (let c = 1; c <= bible[bi].c.length; c++) { const vs = chap(bi, c); if (!vs) continue; for (let i = 0; i < vs.length; i++) { const sc = overlap(nb, bag(String(vs[i]))); if (sc > 0.7 && (!sug || sc > sug.sc)) sug = { sc, at: c + ':' + (i + 1) }; } }
      row.suggest = sug ? sug.at + ' (' + sug.sc.toFixed(2) + ')' : '';
      out.verses.push(row);
    }
  }
}
if (asJson) console.log(JSON.stringify(out, null, 1));
else {
  const bad = out.psalms.filter(r => r.status !== 'سليم');
  if (!onlyV) { console.log(`المزامير: ${out.psalms.length} فُحص · غير مطابق للمرجع: ${bad.length}`); bad.forEach(r => console.log(` س${r.line} [${r.ctx}] ${r.ref} (عبري ${r.hebPsalm}) | آيات النص: ${r.textVerses.join('،') || '—'} | ${r.status}`)); }
  if (!onlyP) { console.log(`الشواهد: ضعيفة التطابق مع مرجعها: ${out.verses.length}`); out.verses.forEach(r => console.log(` س${r.line} [${r.ctx}] ${r.ref} | تطابق ${r.score} | «${r.text}…»${r.suggest ? ' | أقرب: ' + r.suggest : ''}`)); }
}
