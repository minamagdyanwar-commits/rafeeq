#!/usr/bin/env node
/* يعيد تهشير الملفات الثابتة (app*, data-*, store*) ويحدّث index.html و sw.js.
   الاستخدام:  node tools/build.mjs [--bump | --version X.Y.Z]
   - الملف الذي تغيّر محتواه يأخذ هاش جديدًا (10 خانات) ويُحذف اسمه القديم.
   - قائمة FILES واسم الكاش VER في sw.js تُولَّد من جديد. */
import { readFileSync, writeFileSync, readdirSync, renameSync, unlinkSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const p = f => join(root, f);
const sha = b => createHash('sha1').update(b).digest('hex');
const HASHED = /^((?:app|data-|store)[A-Za-z0-9-]*)\.([0-9a-f]{10})\.(js|css)$/;
const FIXED = ['index.html', 'manifest.webmanifest', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'bg-bearer.jpg', 'bg-crown.jpg', 'bg-glory.jpg', 'bg-shroud.jpg', 'bg-holy.jpg', 'bg-lamp.jpg', 'bg-royal.jpg'];

/* ---------- 1) src/ → الملفات المهشّرة في الجذر ----------
   المصدر الحقيقي للكود هو src/<name>.js|css (مقروء). الجذر فيه الناتج فقط (مضغوط لو terser/esbuild متاحان،
   وإلا نسخة طبق الأصل). لا تعدّل الملفات المهشّرة في الجذر يدويًا: أي تعديل عليها يُكتب فوقه من src/. */
/* المحتوى (content/journeys/*.json) → src/data-journeys.js */
const cb = spawnSync(process.execPath, [join(root, 'tools/content-build.mjs')], { stdio: 'inherit' });
if (cb.status) process.exit(cb.status);
const req = createRequire(join(root, 'package.json'));
const tryReq = m => { try { return req(req.resolve(m, { paths: [root, process.env.RF_TOOLS || root] })); } catch { return null; } };
const terser = tryReq('terser'), esbuild = tryReq('esbuild');
const SRCDIR = p('src');
let compiled = 0;
if (existsSync(SRCDIR)) {
  const rootFiles = readdirSync(root);
  for (const f of readdirSync(SRCDIR)) {
    const m = /^([A-Za-z0-9-]+)\.(js|css)$/.exec(f);
    if (!m) continue;
    const src = readFileSync(join(SRCDIR, f), 'utf8');
    let out = src;
    if (m[2] === 'js' && terser) {
      const r = await terser.minify(src, { ecma: 2020, compress: true, mangle: true, format: { comments: false } });
      if (r.error) throw r.error;
      out = r.code;
    } else if (m[2] === 'css' && esbuild) {
      out = esbuild.transformSync(src, { loader: 'css', minify: true }).code;
    }
    const cur = rootFiles.find(x => new RegExp(`^${m[1]}\\.[0-9a-f]{10}\\.${m[2]}$`).test(x));
    const target = cur || `${m[1]}.0000000000.${m[2]}`;
    if (!existsSync(p(target)) || readFileSync(p(target), 'utf8') !== out) { writeFileSync(p(target), out); compiled++; }
  }
}

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
const vi = process.argv.indexOf('--version');
if (vi > 0) [a, b, c] = process.argv[vi + 1].split('.').map(Number);
else if (process.argv.includes('--bump')) c++;
const all = sha(files.filter(f => f !== 'index.html').map(f => f + sha(readFileSync(p(f)))).join('') + sha(readFileSync(p('index.html')))).slice(0, 10);
sw = sw.replace(/const VER='[^']*';/, `const VER='rafeeq-v${a}.${b}.${c}-${all}';`)
       .replace(/const FILES=\[[^\]]*\];/, `const FILES=${JSON.stringify(['./', ...files.map(f => './' + f)])};`);
writeFileSync(p('sw.js'), sw);
/* رقم الإصدار الظاهر في الإعدادات (index.html) يتبع sw.js */
html = readFileSync(p('index.html'), 'utf8').replace(/var V='v[\d.]+';/, `var V='v${a}.${b}.${c}';`);
writeFileSync(p('index.html'), html);
console.log(`v${a}.${b}.${c}  ملفات: ${files.length}  مُجمَّعة من src: ${compiled}  أُعيدت تسميتها: ${renames.size}  كاش: ${all}${terser ? '' : '  (بدون terser: نسخ مقروءة)'}`);
