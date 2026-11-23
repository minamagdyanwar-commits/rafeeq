// فحص سلامة محتوى الكتب المنقولة (content/books/*.json): node tools/qa/content-audit.mjs [--top N] [--json ملف]
// بنيوي (يفشل الفحص): فجوات في نطاق الصفحات، صفحات فارغة، صفحة مكررة (نص مطابق)، تداخل/فجوات بين أيام الرحلة.
// مراجعة (لا يفشل): صفحات مقصوصة/باهتة، قصيرة جدًا، أقواس وعلامات اقتباس غير متوازنة، رموز غريبة من التعرّف الضوئي — مرتبة بالأسوأ لتُراجع مع الأصل أولًا.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>-1?process.argv[i+1]:d};
const TOP=+arg('--top',25),JSON_OUT=arg('--json',null);
const txt=v=>v.map(x=>typeof x==='string'?x:(x&&x.h)||'').join('\n');
const imgOnly=v=>v.length&&v.every(x=>typeof x==='string'&&/^\[\s*(صورة|زخرفة|رسم|صفحة غلاف)/.test(x));
const PAIRS=[['(',')'],['[',']'],['«','»']];
const errors=[],review=[],stats=[];
let totalPages=0;
for(const f of fs.readdirSync(path.join(root,'content/books')).filter(f=>f.endsWith('.json')&&!f.startsWith('_')).sort()){
  const b=JSON.parse(fs.readFileSync(path.join(root,'content/books',f),'utf8'));const id=b.id;
  const [a,z]=b.transcribed;const keys=Object.keys(b.pages).map(Number).sort((x,y)=>x-y);totalPages+=keys.length;
  for(let n=a;n<=z;n++)if(!(n in b.pages))errors.push(`${id}: صفحة ${n} مفقودة من نطاق الترجمة ${a}–${z}`);
  const seen=new Map();let scan=0,short=0,unb=0,odd=0;
  for(const n of keys){const v=b.pages[n],t=txt(v),clean=t.replace(/\s+/g,' ').trim();
    if(!clean){errors.push(`${id} ص${n}: صفحة فارغة`);continue}
    if(!imgOnly(v)&&clean.length>=80){const h=clean.replace(/[ً-ْـ\s]/g,'');if(seen.has(h))errors.push(`${id}: ص${n} مطابقة تمامًا لص${seen.get(h)}`);else seen.set(h,n)}
    let score=0;const why=[];
    const notes=v.filter(x=>typeof x==='string'&&/^\[\s/.test(x)&&!imgOnly([x]));
    if(notes.length){scan++;const hard=notes.some(x=>/غير مقروء|باهتة جداً|باهتة جدًا|لم تقرأ/.test(x));score+=hard?8:3;why.push(hard?'باهتة/غير مقروءة':'مقصوصة الأطراف')}
    const dots=(t.match(/(?:\.\.\.|…)\s*(?=\n|$)/g)||[]).length;if(notes.length&&dots>=3){score+=2;why.push('كلمات ناقصة (...)')}
    if(!imgOnly(v)&&clean.length<120){short++;score+=2;why.push('قصيرة ('+clean.length+' حرفًا)')}
    for(const [o,c] of PAIRS){const d=(t.split(o).length-1)-(t.split(c).length-1);if(d!==0&&!notes.length){unb++;score+=1;why.push(`قوس ${o}${c} غير متوازن`);break}}
    const latin=(t.match(/[A-Za-z]{2,}/g)||[]).length;if(latin){odd++;score+=1;why.push('حروف لاتينية')}
    if(/(.)\1{5,}/.test(t.replace(/[.\-—_]/g,''))){score+=1;why.push('تكرار حرف غريب')}
    if(score)review.push({book:id,page:n,printed:n+(b.pageOffset||0),score,why:why.join('، ')});
  }
  stats.push({id,pages:keys.length,scan,short,unb,odd});
}
// أيام الرحلات
const order=JSON.parse(fs.readFileSync(path.join(root,'content/journeys/_order.json'),'utf8'));
for(const jid of order){const j=JSON.parse(fs.readFileSync(path.join(root,'content/journeys',jid+'.json'),'utf8'));if(!j.bookId)continue;
  const b=JSON.parse(fs.readFileSync(path.join(root,'content/books',j.bookId+'.json'),'utf8'));const [a,z]=b.transcribed;let prev=a-1;
  j.days.forEach((d,i)=>{const bp=d.bookPages;if(!bp)return;if(bp.from!==prev+1)errors.push(`${jid} يوم ${i+1}: يبدأ ص${bp.from} والمتوقع ص${prev+1}`);prev=bp.to});
  if(prev!==z)errors.push(`${jid}: آخر يوم ينتهي ص${prev} والمفروض ص${z}`)}
review.sort((x,y)=>y.score-x.score||x.book.localeCompare(y.book)||x.page-y.page);
console.log(`فحص سلامة محتوى الكتب: ${stats.length} كتابًا · ${totalPages} صفحة`);
console.log('\nالكتاب            صفحات  مقصوصة/باهتة  قصيرة  أقواس  لاتيني');
stats.forEach(s=>console.log(s.id.padEnd(18)+String(s.pages).padEnd(7)+String(s.scan).padEnd(14)+String(s.short).padEnd(7)+String(s.unb).padEnd(7)+s.odd));
console.log(`\nأولى الصفحات بالمراجعة مع الأصل (${Math.min(TOP,review.length)} من ${review.length}):`);
review.slice(0,TOP).forEach(r=>console.log(`  [${r.score}] ${r.book} ملف ${r.page} (مطبوع ${r.printed}) — ${r.why}`));
if(JSON_OUT)fs.writeFileSync(JSON_OUT,JSON.stringify({stats,review,errors},null,1));
console.log(errors.length?`\nFAIL ${errors.length} خطأ بنيوي:\n  `+errors.join('\n  '):'\nok   لا أخطاء بنيوية (نطاقات، فجوات، تكرار، أيام الرحلات)');
process.exit(errors.length?1:0);
