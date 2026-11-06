#!/usr/bin/env node
/* يُكمل نصوص القراءات اليومية والآحاد (قطمارس) المبتورة في src/app5.js من نص الكتاب المقدس داخل البرنامج (فان دايك).
   الخوارزمية: لكل نص إنجيل/بولس/كاثوليكون/إبركسيس يقلّ عدد كلماته عن ٨٠٪ من آيات مرجعه، يُحاذَى نصُّه كلمةً كلمة (Needleman-Wunsch على الجذور بلا تشكيل) مع آيات المرجع؛
   فالآية التي وُجدت في النص المطبوع (≥٦٠٪ من كلماتها) تبقى بتشكيلها وصياغتها كما هي، وأي آية ناقصة تُؤخذ من الكتاب المقدس (بلا تشكيل) بترتيبها. ويبقى ختام الأقواس «(نعمة الله…)».
   الاستخدام: node tools/readings-complete.mjs [--write] [--show شهر/يوم/مفتاح]   — بدون --write تقرير فقط. */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const f = readdirSync(root).find(x => /^data-bibleData\.[0-9a-f]{10}\.js$/.test(x));
globalThis.window = {};
new Function('window', readFileSync(join(root, f), 'utf8'))(globalThis.window);
const bible = JSON.parse(gunzipSync(Buffer.from(window.__RF_DATA.bibleData, 'base64')).toString()).books;
const AR = { '٠': 0, '١': 1, '٢': 2, '٣': 3, '٤': 4, '٥': 5, '٦': 6, '٧': 7, '٨': 8, '٩': 9 };
const norm = s => s.replace(/[ً-ْٰـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[^ء-ي]/g, '');
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
function parseRef(ref) {
  let r = ref.replace(/[٠-٩]/g, c => AR[c]).replace(/[–—]/g, '-').replace(/،/g, ',');
  if (/,/.test(r) && /^(.*?)\s*\d+\s*:\s*\d+\s*-\s*\d+\s*,\s*\d+\s*:\s*\d+\s*-\s*\d+\s*$/.test(r)) {
    const m = r.match(/^(.*?)\s*(\d+)\s*:\s*(\d+)\s*-\s*(\d+)\s*,\s*(\d+)\s*:\s*(\d+)\s*-\s*(\d+)\s*$/);
    return [{ b: m[1], c: +m[2], v1: +m[3], v2: +m[4] }, { b: m[1], c: +m[5], v1: +m[6], v2: +m[7] }];
  }
  let m = r.match(/^(.*?)\s*(\d+)\s*:\s*(\d+)\s*-\s*(\d+)\s*:\s*(\d+)\s*$/); if (m) return [{ b: m[1], c: +m[2], v1: +m[3], v2: 999 }, { b: m[1], c: +m[4], v1: 1, v2: +m[5] }];
  m = r.match(/^(.*?)\s*(\d+)\s*:\s*(\d+)\s*-\s*(\d+)\s*$/); if (m) return [{ b: m[1], c: +m[2], v1: +m[3], v2: +m[4] }];
  m = r.match(/^(.*?)\s*(\d+)\s*:\s*(\d+)\s*$/); if (m) return [{ b: m[1], c: +m[2], v1: +m[3], v2: +m[3] }];
  return null;
}
function verses(ref) {
  const p = parseRef(ref); if (!p) return null; const out = [];
  if (p.length === 2 && p[1].c <= p[0].c && p[1].v1 !== undefined && p[0].v2 === 999) return null;
  for (const s of p) {
    const bi = findBook(s.b); if (bi < 0) return null; const bk = bible[bi], off = bk.vn ? bk.vn[s.c - 1] - 1 : 0, ch = bk.c[s.c - 1]; if (!ch) return null;
    if (s.v1 - off < 1 || s.v1 - off > ch.length) return null;
    const v2 = Math.min(s.v2, ch.length + off); if (v2 < s.v1) return null;
    for (let v = s.v1; v <= v2; v++) out.push({ k: bi + ':' + s.c + ':' + v, c: s.c, v, t: ch[v - off - 1] });
  }
  return out;
}
const stem = k => k.replace(/^(و|ف)(?=.{3})/, '').replace(/^(بال|كال|وال|فال|لل|ال|ب|ل|ك)(?=.{3})/, '');
/* محاذاة: tw = كلمات النص المطبوع (بتشكيلها)، vw = كلمات آيات الكتاب (بعلامة رقم الآية) */
function align(tk, vk) {
  const n = tk.length, m = vk.length, W = m + 1, S = new Int16Array((n + 1) * W), P = new Uint8Array((n + 1) * W);
  for (let i = 1; i <= n; i++) { S[i * W] = 0; P[i * W] = 1; }
  for (let j = 1; j <= m; j++) { S[j] = -1 * j; P[j] = 2; }
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
    const a = tk[i - 1], b = vk[j - 1], sc = a === b ? 3 : (stem(a) === stem(b) && a.length > 2 ? 1 : -2);
    let best = S[(i - 1) * W + j - 1] + sc, p = 0;
    const up = S[(i - 1) * W + j] - 1, lf = S[i * W + j - 1] - 1;
    if (up > best) { best = up; p = 1; } if (lf > best) { best = lf; p = 2; }
    S[i * W + j] = best; P[i * W + j] = p;
  }
  let bi = 0, bj = m; // نهاية حرّة على جانب النص
  let bestS = -1e9; for (let i = 0; i <= n; i++) if (S[i * W + m] > bestS) { bestS = S[i * W + m]; bi = i; }
  const map = new Array(m).fill(-1); let i = bi, j = m;
  while (i > 0 && j > 0) { const p = P[i * W + j]; if (p === 0) { const a = tk[i - 1], b = vk[j - 1]; if (a === b || (stem(a) === stem(b) && a.length > 2)) map[j - 1] = i - 1; i--; j--; } else if (p === 1) i--; else j--; }
  return map;
}
/* يرجع لكل آية: {a,b} حدود كلماتها في النص المطبوع (أو null) وعدد كلماتها المحاذاة */
function place(text, vs) {
  const closing = (text.match(/\([^)]*\)\s*$/) || [''])[0];
  const body = closing ? text.slice(0, text.length - closing.length) : text;
  const tw = body.split(/\s+/).map(x => x.replace(/\.{2,}|…/g, '')).filter(Boolean), tk = tw.map(norm);
  const vw = [], vi = [];
  vs.forEach((v, k) => v.t.split(/\s+/).filter(Boolean).forEach(w => { vw.push(norm(w)); vi.push(k); }));
  const map = align(tk, vw);
  const info = vs.map((v, k) => {
    const idx = []; vi.forEach((x, j) => { if (x === k) idx.push(j); });
    const hit = idx.filter(j => map[j] >= 0), cnt = idx.length;
    if (!hit.length) return { cnt, hit: 0 };
    const A = Math.min(...hit.map(j => map[j])), B = Math.max(...hit.map(j => map[j]));
    return { cnt, hit: hit.length, a: A, b: B, len: B - A + 1, first: Math.min(...hit) - idx[0], last: idx[idx.length - 1] - Math.max(...hit) };
  });
  const total = info.reduce((a, x) => a + x.cnt, 0), hits = info.reduce((a, x) => a + x.hit, 0);
  return { tw, closing, info, vw, vi, quality: total ? hits / total : 0, absent: info.filter(x => x.hit === 0).length };
}

/* ---- نصوص مشكولة أخرى في البرنامج (الأجبية، التماجيد…) قد تحوي آيات كاملة بتشكيلها ---- */
const EXTRA = []; const TRI = new Map();
{
  const dir = join(root, 'src');
  for (const fn of readdirSync(dir).filter(x => /^(app\d+|data-[a-z]+)\.js$/.test(x) && x !== 'app5.js')) {
    const code = readFileSync(join(dir, fn), 'utf8');
    for (const mm of code.matchAll(/"((?:[^"\\\n]|\\.){60,})"/g)) {
      const str = mm[1]; if ((str.match(/[\u064B-\u0652]/g) || []).length < 8) continue;
      let t; try { t = JSON.parse('"' + str + '"'); } catch (e) { continue; }
      const tw = t.split(/\s+/).map(x => x.replace(/\.{2,}|…/g, '')).filter(Boolean); EXTRA.push(tw);
    }
  }
  EXTRA.forEach((tw, ti) => { const k = tw.map(norm); for (let i = 0; i + 2 < k.length; i++) { const g = k[i] + ' ' + k[i + 1] + ' ' + k[i + 2]; let l = TRI.get(g); if (!l) TRI.set(g, l = []); l.push([ti, i]); } });
}
function fromExtra(vwords) {
  const k = vwords.map(norm); if (k.length < 4) return null; const g = k[0] + ' ' + k[1] + ' ' + k[2];
  for (const [ti, i] of TRI.get(g) || []) { const tw = EXTRA[ti]; let ok = true; for (let j = 0; j < k.length; j++) { if (!tw[i + j] || norm(tw[i + j]) !== k[j]) { ok = false; break; } } if (ok) return tw.slice(i, i + k.length).join(' '); }
  return null;
}
const BANK = Object.create(null);
function bankFrom(text, vs) {
  const P = place(text, vs);
  P.info.forEach((x, k) => { if (x.hit === x.cnt && x.len >= 0.9 * x.cnt && x.len <= 1.15 * x.cnt && !BANK[vs[k].k]) BANK[vs[k].k] = P.tw.slice(x.a, x.b + 1).join(' '); });
}
function rebuild(text, vs) {
  const P = place(text, vs), out = []; let recovered = 0, banked = 0, plain = 0, extra = 0;
  vs.forEach((v, k) => {
    const x = P.info[k], vwords = v.t.split(/\s+/).filter(Boolean);
    if (x.hit >= 0.6 * x.cnt && x.len >= 0.7 * x.cnt && x.len <= 1.4 * x.cnt) {
      let t = P.tw.slice(x.a, x.b + 1).join(' ');
      /* آية بُترت في آخرها أو أولها: أكمل بكلمات الكتاب المقدس الناقصة */
      if (x.last > 0 && x.last <= 0.5 * x.cnt) t += ' ' + vwords.slice(vwords.length - x.last).join(' ');
      if (x.first > 0 && x.first <= 0.5 * x.cnt) t = vwords.slice(0, x.first).join(' ') + ' ' + t;
      out.push(t); recovered++;
    } else if (BANK[v.k]) { out.push(BANK[v.k]); banked++; }
    else { const ex = fromExtra(vwords); if (ex) { out.push(ex); extra++; } else { out.push(v.t); plain++; } }
  });
  /* عبارات المطبوع القصيرة قبل أول آية وبعد آخر آية (مثل «فقال الرب:») تبقى */
  const firstA = P.info[0] && P.info[0].hit ? P.info[0].a : -1, lastI = P.info[P.info.length - 1];
  const lead = firstA > 0 && firstA <= 8 ? P.tw.slice(0, firstA).join(' ') + ' ' : '';
  const trail = lastI && lastI.hit && P.tw.length - 1 - lastI.b > 0 && P.tw.length - 1 - lastI.b <= 8 ? ' ' + P.tw.slice(lastI.b + 1).join(' ') : '';
  return { text: lead + out.join(' ') + trail + (P.closing ? ' ' + P.closing : ''), recovered, banked, plain, extra };
}
/* تحقق من النتيجة: كل آية من المدى يجب أن تظهر في النص (≥٧٠٪ من كلماتها) */
function weakVerses(text, vs) {
  const set = new Set(); normS(text).split(' ').forEach(w => { set.add(w.replace(/[^\u0621-\u064A]/g, '')); set.add(stem(w)); });
  return vs.filter(v => { const ws = normS(v.t).split(' ').filter(w => w.length >= 3); if (!ws.length) return false; return ws.filter(w => set.has(w) || set.has(stem(w))).length / ws.length < 0.7; });
}
/* ---- مسح المصدر ---- */
const srcPath = join(root, 'src/app5.js');
let src = readFileSync(srcPath, 'utf8');
const a = process.argv, write = a.includes('--write'), show = a.indexOf('--show') > 0 ? a[a.indexOf('--show') + 1] : '';
const re = /(gospelRef|shortRef):\s*"([^"]+)",\s*(?:\n\s*)?(gospel|pericope):\s*\n?(\s*)"((?:[^"\\]|\\.)*)"/g;
let m, n = 0, changed = 0, rec = 0, bk = 0, ex = 0, pl = 0, skipped = [], bad = [], odd = [];
const nw0 = t => normS(t.replace(/\([^)]*\)/g, ' ')).split(' ').length;
const edits = [], items = [];
while ((m = re.exec(src))) {
  const [, , ref, , , raw] = m; n++;
  const text = JSON.parse('"' + raw + '"'), vs = verses(ref);
  if (!vs) { skipped.push(ref); continue; }
  items.push({ m, ref, raw, text, vs });
}
for (const { m, ref, raw, text, vs } of items) bankFrom(text, vs);
for (const { m, ref, raw, text, vs } of items) {
  const body = text.replace(/\([^)]*\)/g, ' '), bw = normS(vs.map(v => v.t).join(' ')).split(' ').length, tw = normS(body).split(' ').length;
  const P0 = place(text, vs);
  /* مبتور (أقل من ٨٠٪ من كلمات المدى)، أو فيه علامة حذف «...»، أو فيه آية غائبة تمامًا في نص مطبوع بنفس ترجمة فان دايك تقريبًا (محاذاة ≥٧٠٪) */
  if (!(tw / bw < 0.8 || (P0.absent > 0 && P0.quality >= 0.7) || /\.\.\.|…/.test(text))) continue;
  const r = rebuild(text, vs);
  const nw = normS(r.text.replace(/\([^)]*\)/g, ' ')).split(' ').length;
  if (nw0(r.text) / bw < 0.85 || nw0(r.text) / bw > 1.35) odd.push(ref + ' نسبة ' + (nw0(r.text) / bw).toFixed(2));
  const weak = weakVerses(r.text, vs); if (weak.length) bad.push(ref + ' ← ' + weak.map(v => v.c + ':' + v.v).join('،'));
  changed++; rec += r.recovered; bk += r.banked; ex += r.extra; pl += r.plain;
  edits.push({ at: m.index + m[0].lastIndexOf('"' + raw + '"'), old: '"' + raw + '"', neu: JSON.stringify(r.text), ref, before: tw, after: nw, vs: vs.length, rec: r.recovered, plain: r.plain, bank: r.banked });
}
if (a.indexOf('--dbg') > 0) { const it = items.find(x => x.ref === a[a.indexOf('--dbg') + 1]); if (it) { const P = place(it.text, it.vs); console.log('quality', P.quality.toFixed(2), 'tw', P.tw.length, 'vw', P.vw.length, JSON.stringify(P.info.slice(0, 6))); console.log(P.tw.slice(0, 12).join(' '), '|', P.vw.slice(0, 12).join(' ')); } }
if (a.includes('--books')) { const seen = {}; items.forEach(it => { const tok = it.ref.replace(/\s*[0-9٠-٩]+\s*[:-].*$/, '').trim(); const p = parseRef(it.ref); const bi = p ? findBook(p[0].b) : -1; seen[tok] = bible[bi] ? bible[bi].n : '؟'; }); Object.entries(seen).forEach(([k, v]) => console.log(k, '→', v)); }
const lowq = items.map(it => { const P = place(it.text, it.vs); return { ref: it.ref, q: P.quality, absent: P.absent, n: it.vs.length, words: normS(it.text).split(' ').length }; }).filter(x => x.q < 0.5).sort((a, b) => a.q - b.q);
if (process.argv.includes('--lowq')) { console.log('محاذاة ضعيفة (<0.5):', lowq.length); lowq.forEach(x => console.log(x.q.toFixed(2), x.ref, 'كلمات', x.words, 'آيات', x.n)); }
console.log(`فُحص ${n} نصًّا · مرجع غير مفسَّر ${skipped.length}${skipped.length ? ' (' + [...new Set(skipped)].slice(0, 12).join(' | ') + ')' : ''}`);
console.log(`يحتاج إكمالًا: ${changed} · آيات بقيت بتشكيلها المطبوع: ${rec} · آيات بتشكيلها من قراءة أخرى: ${bk} · من نصوص مشكولة أخرى في البرنامج: ${ex} · آيات أُخذت من الكتاب المقدس بلا تشكيل: ${pl}`);
console.log(`نسب غير معتادة بعد الإكمال: ${odd.length}${odd.length ? ' — ' + odd.slice(0, 10).join(' | ') : ''}`);
console.log(`بعد الإكمال: نصوص فيها آيات ضعيفة التغطية: ${bad.length}${bad.length ? '\n  ' + bad.slice(0, 15).join('\n  ') : ''}`);
if (show) { const e = edits.find(x => x.ref === show); if (e) console.log(e.ref, e.before, '→', e.after, '\n', JSON.parse(e.neu)); else console.log('لا إكمال لـ', show); }
if (write) {
  edits.sort((x, y) => y.at - x.at).forEach(e => { src = src.slice(0, e.at) + e.neu + src.slice(e.at + e.old.length); });
  writeFileSync(srcPath, src); console.log('كُتب src/app5.js');
}
