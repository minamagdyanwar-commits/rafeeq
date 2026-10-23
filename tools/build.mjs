#!/usr/bin/env node
/* يعيد تهشير الملفات الثابتة (app*, data-*, store*) ويحدّث index.html و sw.js.
   الاستخدام:  node tools/build.mjs [--bump]   (--bump يرفع رقم الإصدار الأخير)
   - الملف الذي تغيّر محتواه يأخذ هاش جديدًا (10 خانات) ويُحذف اسمه القديم.
   - قائمة FILES واسم الكاش VER في sw.js تُولَّد من جديد. */
import { readFileSync, writeFileSync, readdirSync, renameSync, unlinkSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const p = f => join(root, f);
const sha = b => createHash('sha1').update(b).digest('hex');
const HASHED = /^((?:app|data-|store)[A-Za-z0-9-]*)\.([0-9a-f]{10})\.(js|css)$/;
const FIXED = ['index.html', 'manifest.webmanifest', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];

let html = readFileSync(p('index.html'), 'utf8');
const renames = new Map();
for (const f of readdirSync(root)) {
  const m = HASHED.exec(f);
  if (!m) continue;
  const h = sha(readFileSync(p(f))).slice(0, 10);
  const nf = `${m[1]}.${h}.${m[3]}`;
  if (nf !== f) renames.set(f, nf);
}
for (const [o, n] of renames) {
  renameSync(p(o), p(n));
  html = html.split(o).join(n);
}
writeFileSync(p('index.html'), html);

/* الملفات المستخدمة فعلًا = ما يذكره index.html + الثوابت */
const refs = new Set([...html.matchAll(/(?:src|href)="([^"#?]+)"/g)].map(m => m[1]).filter(f => existsSync(p(f)) && !f.includes('/')));
const orphans = readdirSync(root).filter(f => HASHED.test(f) && !refs.has(f));
if (orphans.length) console.warn('ملفات مهشّرة غير مذكورة في index.html:', orphans.join(', '));
const files = [...new Set([...refs, ...FIXED.filter(f => existsSync(p(f)))])].sort();

let sw = readFileSync(p('sw.js'), 'utf8');
let [, a, b, c] = /rafeeq-v(\d+)\.(\d+)\.(\d+)-/.exec(sw).map(Number);
if (process.argv.includes('--bump')) c++;
const all = sha(files.filter(f => f !== 'index.html').map(f => f + sha(readFileSync(p(f)))).join('') + sha(readFileSync(p('index.html')))).slice(0, 10);
sw = sw.replace(/const VER='[^']*';/, `const VER='rafeeq-v${a}.${b}.${c}-${all}';`)
       .replace(/const FILES=\[[^\]]*\];/, `const FILES=${JSON.stringify(['./', ...files.map(f => './' + f)])};`);
writeFileSync(p('sw.js'), sw);
console.log(`v${a}.${b}.${c}  ملفات: ${files.length}  أُعيدت تسميتها: ${renames.size}  كاش: ${all}`);
