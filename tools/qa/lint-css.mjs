// حارس طبقات الـCSS: لا يسمح بزيادة !important عن الميزانية، ويمنع الأنماط التي سببت أعطالًا سابقة.
//   node tools/qa/lint-css.mjs           → فحص
//   node tools/qa/lint-css.mjs --update  → تحديث الميزانية بعد تنظيف (لا ترفعها إلا بقرار)
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const BF=path.join(path.dirname(fileURLToPath(import.meta.url)),'css-budget.json');
const strip=s=>s.replace(/data:[^)'"]{200,}/g,'data:').replace(/\/\*[\s\S]*?\*\//g,'');
const files=fs.readdirSync(root).filter(f=>/^app\d+\.[0-9a-f]{10}\.css$/.test(f));
const cur={},errs=[];
for(const f of files){
  const css=strip(fs.readFileSync(path.join(root,f),'utf8')),name=f.replace(/\.[0-9a-f]{10}\.css$/,'');
  cur[name]=(css.match(/!important/g)||[]).length;
  // html[data-nh] العارية تطابق التصاميم القديمة (data-nh="") أيضًا: يجب :not([data-nh=""])
  const bare=css.match(/html\[data-nh\](?!:not|\[)[^{,]*[{,]/g)||[];
  bare.forEach(b=>{if(!/data-nh=/.test(b))errs.push(`${name}: محدِّد html[data-nh] بدون استثناء الفارغ: ${b.slice(0,70)}`)});
  // أسماء فئات عامة مشتركة بين وحدات: لازم تتحدّد بنطاق معرّف (#id)
  (css.match(/(^|})\s*\.(nd|lb|sg)\s*[{.:,\s]/g)||[]).forEach(b=>errs.push(`${name}: فئة عامة بدون نطاق: ${b.trim().slice(0,40)}`));
}
if(process.argv[2]==='--update'){fs.writeFileSync(BF,JSON.stringify(cur,null,1)+'\n');console.log('budget updated');process.exit(0)}
const budget=fs.existsSync(BF)?JSON.parse(fs.readFileSync(BF,'utf8')):{};
for(const [k,v] of Object.entries(cur)){const b=budget[k];if(b!=null&&v>b)errs.push(`${k}: !important ${v} > الميزانية ${b}`);if(b==null&&v>0)errs.push(`${k}: ملف جديد بدون ميزانية (${v} !important) — شغّل --update بعد المراجعة`)}
const tot=Object.values(cur).reduce((a,b)=>a+b,0);
console.log(`ملفات CSS: ${files.length} · إجمالي !important: ${tot}`);
errs.forEach(e=>console.log('FAIL '+e));
process.exit(errs.length?1:0);
