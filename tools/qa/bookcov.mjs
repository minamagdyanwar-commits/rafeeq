// تغطية «رحلات الأسفار الكاملة»: كل يوم مقطع متصل من السفر، والأيام معًا تغطي السفر كله بالترتيب بلا نقص ولا تكرار، ويُعرض نصه كاملًا.
// node tools/qa/bookcov.mjs
const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium }=await import(PW);
import {serve} from './serve.mjs';
const PORT=+process.env.PORT||8777;const srv=process.env.BASE?null:await serve(PORT);const BASE=process.env.BASE||`http://localhost:${PORT}`;
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.addInitScript(()=>{localStorage.setItem('rafeeq_onboarded','1')});
await p.goto(BASE+'/index.html');await p.waitForTimeout(1500);
const res=await p.evaluate(async()=>{const F=__F;await F.bible.load();const n=F.bible;const out=[];
 for(const id of Object.keys(window.__progData)){const j=window.__progData[id];if(!j.fullText)continue;const bi=n.data.findIndex(x=>x.n===j.bookName);const e={id,title:j.title,problems:[]};
  if(bi<0){e.problems.push('اسم السفر غير موجود: '+j.bookName);out.push(e);continue}
  let ci=1,vi=1;/* المؤشر المتوقع التالي */
  j.days.forEach((d,i)=>{let r=null;try{r=n.parseRef(d[1])}catch(x){}
   if(!r||r.bi!==bi){e.problems.push('يوم '+(i+1)+': مرجع غير صالح '+d[1]);return}
   const len=n.data[bi].c[r.ch-1].length,a=r.v1||1,z=r.v2||(r.v1?r.v1:len);
   if(r.ch!==ci||a!==vi)e.problems.push('يوم '+(i+1)+': يبدأ '+r.ch+':'+a+' والمتوقع '+ci+':'+vi);
   if(z<a||z>len)e.problems.push('يوم '+(i+1)+': نهاية خارج الإصحاح '+d[1]);
   if(z===len){ci=r.ch+1;vi=1}else{ci=r.ch;vi=z+1}});
  const last=n.data[bi].c.length;if(!(ci===last+1&&vi===1))e.problems.push('لم يُغطَّ السفر كله: توقف عند '+ci+':'+vi+' من '+last+' إصحاحات');
  e.days=j.days.length;out.push(e)}
 /* رحلات الكتب المنقولة: صفحات الأيام متصلة بلا فجوة ولا تكرار، وتغطي المنقول من الكتاب كله، وكل صفحة موجودة فعلًا */
 for(const id of Object.keys(window.__progData)){const j=window.__progData[id];if(!j.bookId)continue;const bk=(window.__bookText||{})[j.bookId];const e={id,title:j.title,problems:[],days:j.days.length};
  if(!bk){e.problems.push('الكتاب غير موجود '+j.bookId);out.push(e);continue}
  const [a,z]=bk.transcribed||[0,0];let next=a;
  j.days.forEach((d,i)=>{const B=d[8];if(!B){e.problems.push('يوم '+(i+1)+': بلا نص كتاب');return}
   if(B.from!==next)e.problems.push('يوم '+(i+1)+': يبدأ ص'+B.from+' والمتوقع ص'+next);
   for(let p=B.from;p<=B.to;p++){const pg=bk.pages[String(p)];if(!pg||!pg.length)e.problems.push('يوم '+(i+1)+': صفحة '+p+' بلا نص')}
   next=B.to+1});
  if(next!==z+1)e.problems.push('لا تغطي المنقول كله: انتهت عند ص'+(next-1)+' والمنقول حتى ص'+z);
  Object.keys(bk.pages).forEach(k=>{if(+k<a||+k>z)e.problems.push('صفحة خارج المنقول: '+k)});
  out.push(e)}
 return out});
let bad=0;res.forEach(r=>{console.log(r.problems.length?'✗':'✓',r.id,r.title,r.days+' يوم');r.problems.forEach(x=>{bad++;console.log('   ',x)})});
if(!res.length){bad++;console.log('✗ لا رحلات أسفار كاملة')}
if(errs.length){bad++;console.log('✗ errs',errs[0])}
await b.close();srv&&srv.close&&srv.close();console.log(bad?`FAIL ${bad}`:'PASS');process.exit(bad?1:0);
