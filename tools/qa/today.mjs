// «رحلاتي اليوم»: عدّاد «X من Y» في يومي، شطب «رحلتي» بإنجاز رحلة واحدة، وصفحة تفتح كل الرحلات المفتوحة — كل التصميمات × الوضعين × ٣٩٠/٣٦٠/٧٦٨
// node tools/qa/today.mjs [تصاميم] [dark|light] [--shots]
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
const SHOTS=process.argv.includes('--shots');if(SHOTS)mkdirSync('tools/qa/reports/today',{recursive:true});
let fail=0;const say=(ok,m)=>{if(!ok)fail++;if(!ok||process.env.V)console.log((ok?'ok   ':'FAIL ')+m)};
const lum=c=>{const f=x=>{x/=255;return x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])};
const cr=(a,c)=>{const x=lum(a),y=lum(c);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const OLD=Date.now()-3*864e5;
async function open(d,m,w,store){
  const p=await b.newPage({viewport:{width:w,height:w===768?1024:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,90)));
  await p.addInitScript(([d,m,st])=>{if(sessionStorage.__i)return;sessionStorage.__i='1';localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}));localStorage.setItem('rafeeq_onboarded','1');if(st)localStorage.setItem('rafeeq_prog_v1',JSON.stringify(st))},[d,m,store]);
  await p.goto(BASE+'/index.html');await p.waitForTimeout(1500);return {p,errs};
}
const three={joseph:{done:{1:OLD},notes:{}},peace:{done:{1:OLD},notes:{}},love:{done:{1:OLD},notes:{}}};
const one={joseph:{done:{1:OLD},notes:{}}};
const item=p=>p.evaluate(()=>{const it=__F.todayItems(__F.dkey()).find(x=>x.type==='prog');return it?{label:it.label,done:it.done}:null});
for(const d of DES)for(const m of MODES)for(const w of [390,360,768]){
  const tag=`${d}/${m}/${w}`;
  const {p,errs}=await open(d,m,w,three);
  let it=await item(p);say(it&&/٠ من ٣/.test(it.label)&&it.done===false,`${tag} «يومي» قبل الإنجاز ${JSON.stringify(it)}`);
  /* الفتح من «يومي» يعرض صفحة كل الرحلات المفتوحة */
  await p.evaluate(()=>__prog.openCurrent());await p.waitForTimeout(600);
  const pg=await p.evaluate(()=>{const e=document.getElementById('progPage');const cs=[...document.querySelectorAll('#progPage [data-pgtd]')];
   function bgOf(el){const L=[];for(let x=el;x;x=x.parentElement){const c=getComputedStyle(x).backgroundColor,mm=c.match(/[\d.]+/g);if(mm&&(mm[3]===undefined||+mm[3]>0)){L.push(mm.map(Number));if(mm[3]===undefined||+mm[3]===1)break}}let base=[255,255,255];if(!L.length||(L[L.length-1].length===4&&L[L.length-1][3]<1)){const s=getComputedStyle(document.body).backgroundColor.match(/[\d.]+/g);if(s)base=s.slice(0,3).map(Number)}L.reverse().forEach(l=>{const a=l.length===4?l[3]:1;base=[0,1,2].map(i=>base[i]*(1-a)+l[i]*a)});return base}
   const fg=x=>getComputedStyle(x).color.match(/[\d.]+/g).slice(0,3).map(Number);const c=[];
   cs.forEach(x=>{for(const y of [x.querySelector('b'),x.querySelector('small'),x.querySelector('em')])if(y)c.push([fg(y),bgOf(y)])});const em=e&&e.querySelector('.pg-em');if(em)c.push([fg(em),bgOf(em)]);
   return {on:!!(e&&e.classList.contains('on')),h:(e&&e.querySelector('h2')||{}).textContent||'',n:cs.length,txt:cs.map(x=>x.innerText.replace(/\s+/g,' ')),c,hs:cs.map(x=>x.getBoundingClientRect().height),ov:document.documentElement.scrollWidth>innerWidth+1}});
  say(pg.on&&/رحلاتي اليوم/.test(pg.h)&&pg.n===3,`${tag} صفحة رحلاتي اليوم (${pg.n} رحلات)`);
  say(pg.txt.every(t=>/لم تُنجز اليوم/.test(t)),`${tag} حالة كل رحلة «لم تُنجز» (${pg.txt[0]})`);
  say(pg.c.every(([f,bg])=>cr(f,bg)>=4.5),`${tag} تباين الصفحة (أدنى ${Math.min(...pg.c.map(([f,bg])=>cr(f,bg))).toFixed(2)})`);say(pg.hs.every(h=>h>=44),`${tag} الكروت ≥٤٤px`);say(!pg.ov,`${tag} بلا تمرير أفقي`);
  if(SHOTS&&w===390)await p.screenshot({path:`tools/qa/reports/today/${d}-${m}-list.png`});
  /* فتح الرحلة الثانية مباشرة وإنجاز يومها → يُشطب «رحلتي» فورًا (١ من ٣) */
  await p.click('#progPage [data-pgtd]:nth-of-type(2), #progPage [data-pgtd] >> nth=1');await p.waitForTimeout(700);
  const day=await p.evaluate(()=>({on:!!document.querySelector('#progDay.on'),ok:!!document.querySelector('#progDay .pd-ok')}));say(day.on&&day.ok,`${tag} فتح الرحلة الثانية مباشرة على يومها`);
  await p.click('#progDay .pd-ok');await p.waitForTimeout(700);
  it=await item(p);say(it&&/١ من ٣/.test(it.label)&&it.done===true,`${tag} يُشطب بإنجاز رحلة واحدة ${JSON.stringify(it)}`);
  /* الصفحة تعرض ✓ للمُنجزة و○ للباقي، ثم رحلة ثانية → ٢ من ٣ */
  await p.evaluate(()=>__prog.openCurrent());await p.waitForTimeout(500);
  const t2=await p.evaluate(()=>[...document.querySelectorAll('#progPage [data-pgtd]')].map(x=>/✓ أنجزتَ اليوم/.test(x.innerText)));say(t2.filter(Boolean).length===1,`${tag} علامة ✓ لرحلة واحدة (${t2})`);
  await p.evaluate(()=>{[...document.querySelectorAll('#progPage [data-pgtd]')].find(x=>!/✓ أنجزتَ اليوم/.test(x.innerText)).click()});await p.waitForTimeout(600);await p.click('#progDay .pd-ok');await p.waitForTimeout(600);
  it=await item(p);say(it&&/٢ من ٣/.test(it.label)&&it.done===true,`${tag} ٢ من ٣ ${JSON.stringify(it)}`);
  say(!errs.length,`${tag} أخطاء ${errs.join('|')}`);await p.close();
  if(w===390){
    /* رحلة واحدة فقط: السلوك القديم (يفتح الرحلة مباشرة) */
    const q=await open(d,m,w,one);const i1=await item(q.p);say(i1&&/^رحلتي: /.test(i1.label),`${tag} رحلة واحدة: التسمية القديمة (${i1&&i1.label})`);
    await q.p.evaluate(()=>__prog.openCurrent());await q.p.waitForTimeout(600);const o1=await q.p.evaluate(()=>!!document.querySelector('#progDay.on'));say(o1,`${tag} رحلة واحدة: تُفتح مباشرة`);
    say(!q.errs.length,`${tag} أخطاء (واحدة) ${q.errs.join('|')}`);await q.p.close();
    /* بلا رحلات: لا عنصر */
    const z=await open(d,m,w,null);const i0=await item(z.p);say(i0===null,`${tag} بلا رحلات: لا عنصر`);await z.p.close();
  }
}
await b.close();if(srv)srv.close();console.log(fail?`FAIL ${fail}`:'PASS');process.exit(fail?1:0);
