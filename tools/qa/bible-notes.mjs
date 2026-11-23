// وصايا ووعود الإصحاحات: صحة المراجع (آيات موجودة، نص غير فارغ) + العرض/الإعدادات/التباين — كل التصميمات × الوضعين × العروض.
// node tools/qa/bible-notes.mjs [تصاميم] [dark|light] [--shots]  (--shots يحفظ لقطات في tools/qa/reports/bn)
import {mkdirSync} from 'node:fs';
const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium }=await import(PW);
import {serve} from './serve.mjs';
const PORT=+process.env.PORT||8777,BASE=process.env.BASE||`http://localhost:${PORT}`;
const srv=process.env.BASE?null:await serve(PORT);
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium'});
const ALL=['bearer','church','classic','cross','crown','glory','holy','lamp','qalaya','royal','shroud'];
const arg=process.argv.slice(2).filter(x=>!x.startsWith('--'));
const DES=arg[0]&&!['dark','light'].includes(arg[0])?arg[0].split(','):ALL;
const MODES=arg.includes('dark')?['dark']:arg.includes('light')?['light']:['dark','light'];
const SHOTS=process.argv.includes('--shots');if(SHOTS)mkdirSync('tools/qa/reports/bn',{recursive:true});
let fail=0;const say=(ok,m)=>{if(!ok)fail++;if(!ok||process.env.V)console.log((ok?'ok   ':'FAIL ')+m)};
async function open(d,m,w){
  const p=await b.newPage({viewport:{width:w,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,90)));
  await p.addInitScript(([d,m])=>{if(sessionStorage.__i)return;sessionStorage.__i='1';localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}));localStorage.setItem('rafeeq_onboarded','1')},[d,m]);
  await p.goto(BASE+'/index.html');await p.waitForTimeout(1500);return {p,errs};
}
/* 1) صحة المراجع */
{const {p}=await open('classic','light',390);
 await p.evaluate(()=>__F.openBible(49,1,1));await p.waitForTimeout(1800);
 const r=await p.evaluate(()=>{const N=__bibleNotes,B=__F.bible,bad=[];let n=0;
  for(const bi of Object.keys(N))for(const ch of Object.keys(N[bi]))for(const k of ['c','p'])for(const it of N[bi][ch][k]||[]){n++;
   const cnt=(B.data[bi].c[ch-1]||[]).length;
   if(!cnt)bad.push(`${bi}:${ch} إصحاح غير موجود`);else if(it.v[1]>cnt)bad.push(`${bi}:${ch}:${it.v} يتجاوز ${cnt}`);
   else{const t=B.verses(+bi,+ch,it.v[0],it.v[1]).join(' ').trim();if(t.length<8)bad.push(`${bi}:${ch}:${it.v} نص قصير`);}}
  return {n,bad}});
 say(!r.bad.length,`مراجع (${r.n}) ${r.bad.join(' | ')}`);await p.close()}
const lum=c=>{const f=x=>{x/=255;return x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])};
const cr=(a,c)=>{const x=lum(a),y=lum(c);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
for(const d of DES)for(const m of MODES)for(const w of [390,360,768]){
  const {p,errs}=await open(d,m,w);const tag=`${d}/${m}/${w}`;
  await p.evaluate(()=>__F.openBible(49,6,1));await p.waitForTimeout(1600);
  const r=await p.evaluate(()=>{const g=s=>document.querySelector(s);const cd=g('#bnCard'),t=g('#bibleText');
   const prev=cd&&cd.previousElementSibling;const nextBg=cd&&cd.nextElementSibling;
   const marks=['4','33'].map(v=>{const e=g(`p.bv[data-v="${v}"]`);return e&&e.className});
   /* تباين: لون النص مقابل خلفية مركّبة */
   function bgOf(el){const layers=[];for(let e=el;e;e=e.parentElement){const c=getComputedStyle(e).backgroundColor;const mm=c.match(/[\d.]+/g);if(mm&&(mm[3]===undefined||+mm[3]>0))layers.push(mm.map(Number));if(mm&&(mm[3]===undefined||+mm[3]===1))break}
    let base=[255,255,255];if(!layers.length||(layers[layers.length-1].length===4&&layers[layers.length-1][3]<1)){const cs=getComputedStyle(document.body).backgroundColor.match(/[\d.]+/g);if(cs)base=cs.slice(0,3).map(Number)}
    layers.reverse().forEach(l=>{const a=l.length===4?l[3]:1;base=[0,1,2].map(i=>base[i]*(1-a)+l[i]*a)});return base}
   const fg=el=>getComputedStyle(el).color.match(/[\d.]+/g).slice(0,3).map(Number);
   const out=[];['.bn-it-c .bn-k','.bn-it-p .bn-k','.bn-it-c .bn-line b','.bn-it-p .bn-line b','.bn-it-c .bn-q','.bn-it-p .bn-line'].forEach(s=>{const e=cd&&cd.querySelector(s);if(e)out.push([s,fg(e),bgOf(e)])});
   const pe=g('p.bv.bn-c'),pp=g('p.bv.bn-p');
   const tags=[pe&&getComputedStyle(pe,'::after').color,pp&&getComputedStyle(pp,'::before').color];
   const tagBg=[pe&&bgOf(pe),pp&&bgOf(pp)];
   const ov=document.documentElement.scrollWidth>innerWidth+1;
   return {has:!!cd,order:!!(cd&&t&&(prev===t||prev.id==='chCtx')),marks,out,tags,tagBg,ov,
    heading:cd&&cd.querySelector('h3').textContent,nc:cd?cd.querySelectorAll('.bn-it-c').length:0,np:cd?cd.querySelectorAll('.bn-it-p').length:0,
    bgb:!!g('.bg-card')}});
  say(r.has&&r.order,`${tag} البطاقة موجودة وفي مكانها`);
  say(r.nc===4&&r.np===3,`${tag} عدد البنود ${r.nc}/${r.np}`);
  say(/bn-p/.test(r.marks[0]||'')&&/bn-p/.test(r.marks[1]||''),`${tag} تعليم الآيات ${r.marks}`);
  say(!r.ov,`${tag} لا تمرير أفقي`);
  r.out.forEach(([s,f,bg])=>{const c=cr(f,bg);say(c>=4.5,`${tag} تباين ${s} = ${c.toFixed(2)}`)});
  if(r.tags[0]){const tc=r.tags[0].match(/[\d.]+/g).slice(0,3).map(Number);say(cr(tc,r.tagBg[0])>=4.5,`${tag} تباين شارة «وصية» ${cr(tc,r.tagBg[0]).toFixed(2)}`)}
  if(r.tags[1]){const tc=r.tags[1].match(/[\d.]+/g).slice(0,3).map(Number);say(cr(tc,r.tagBg[1])>=4.5,`${tag} تباين شارة «وعد» ${cr(tc,r.tagBg[1]).toFixed(2)}`)}
  if(SHOTS&&w===390){await p.evaluate(()=>document.querySelector('p.bv[data-v="33"]').scrollIntoView({block:'center'}));await p.screenshot({path:`tools/qa/reports/bn/${d}-${m}-text.png`});await p.evaluate(()=>document.getElementById('bnCard').scrollIntoView({block:'start'}));await p.screenshot({path:`tools/qa/reports/bn/${d}-${m}-card.png`})}
  if(w===390){
   /* نقر الإحالة يفتح الآية */
   await p.evaluate(()=>document.querySelector('#bnCard [data-bngo="49:6:33"]').click());await p.waitForTimeout(900);
   const cur=await p.evaluate(()=>{const c=__F.bible.cur();return c.b+':'+c.c});say(cur==='49:6',`${tag} نقر الإحالة`);
   /* الإعدادات */
   const st=await p.evaluate(()=>{const R=document.documentElement,q=s=>document.querySelector(s),vis=e=>e&&getComputedStyle(e).display!=='none';
    const res={};const set=(id)=>document.getElementById(id).click();
    set('bnTgC');res.noC={card:vis(q('#bnCard')),cSec:vis(q('#bnCard .bn-sec-c')),pSec:vis(q('#bnCard .bn-sec-p')),tag:getComputedStyle(q('p.bv.bn-c')||q('p.bv'),'::after').content,saved:localStorage.getItem('rafeeq_bn_v1')};
    set('bnTgC');set('bnTgP');res.noP={pSec:vis(q('#bnCard .bn-sec-p')),cSec:vis(q('#bnCard .bn-sec-c'))};
    set('bnTgC');res.none={card:vis(q('#bnCard'))};set('bnTgC');set('bnTgP');
    set('bnMCard');res.card={card:vis(q('#bnCard')),ul:getComputedStyle(q('p.bv[data-v="4"]')).textDecorationLine};
    set('bnMText');res.text={card:vis(q('#bnCard')),ul:getComputedStyle(q('p.bv[data-v="4"]')).textDecorationLine};
    set('bnMBoth');res.both={card:vis(q('#bnCard')),ul:getComputedStyle(q('p.bv[data-v="4"]')).textDecorationLine};return res});
   say(st.noC.card&&!st.noC.cSec&&st.noC.pSec&&st.noC.saved&&JSON.parse(st.noC.saved).c===0,`${tag} إخفاء الوصايا ${JSON.stringify(st.noC)}`);
   say(!st.noP.pSec&&st.noP.cSec,`${tag} إخفاء الوعود`);say(!st.none.card,`${tag} إخفاء الاثنين يخفي البطاقة`);
   say(st.card.card&&st.card.ul==='none',`${tag} الحاشية فقط ${JSON.stringify(st.card)}`);say(!st.text.card&&/underline/.test(st.text.ul),`${tag} النص فقط ${JSON.stringify(st.text)}`);say(st.both.card&&/underline/.test(st.both.ul),`${tag} الاثنان`);
   /* إصحاح بلا بيانات: لا بطاقة ولا تعليم */
   await p.evaluate(()=>__F.openBible(49,2,1));await p.waitForTimeout(1300);
   const e2=await p.evaluate(()=>({card:!!document.getElementById('bnCard'),marks:document.querySelectorAll('p.bv.bn-c,p.bv.bn-p').length}));say(!e2.card&&!e2.marks,`${tag} إصحاح بلا بيانات نظيف ${JSON.stringify(e2)}`);
   await p.evaluate(()=>__F.openBible(49,6,1));await p.waitForTimeout(1300);
   const n1=await p.evaluate(()=>document.querySelectorAll('#bnCard').length);say(n1===1,`${tag} بطاقة واحدة بعد العودة (${n1})`);
  }
  say(!errs.length,`${tag} أخطاء ${errs.join('|')}`);await p.close();
}
await b.close();if(srv)srv.close();console.log(fail?`FAIL ${fail}`:'PASS');process.exit(fail?1:0);
