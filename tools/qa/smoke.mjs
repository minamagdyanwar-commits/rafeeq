// smoke: boots every design/mode, fails on page errors, checks core APIs + journey data integrity
const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium }=await import(PW);
import {serve} from './serve.mjs';
const PORT=+process.env.PORT||8777,BASE=`http://localhost:${PORT}`;
const srv=process.env.BASE?null:await serve(PORT);
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium'});
const DES=['bearer','church','classic','cross','crown','glory','holy','lamp','qalaya','royal','shroud'];
let fail=0;const say=(ok,m)=>{if(!ok)fail++;console.log((ok?'ok   ':'FAIL ')+m)};
for(const d of DES)for(const m of ['dark','light']){
  const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,90)));
  await p.addInitScript(([d,m])=>{localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}))},[d,m]);
  await p.goto(BASE+'/index.html');await p.waitForTimeout(1800);
  const r=await p.evaluate(()=>({F:!!window.__F,prog:!!window.__prog,RF:!!window.RF,nav:!!document.querySelector('#uNav')}));
  say(!errs.length&&r.F&&r.prog&&r.nav,`${d}/${m} ${JSON.stringify(r)} ${errs.join('|')}`);await p.close();
}
const p=await b.newPage();await p.goto(BASE+'/index.html');await p.waitForTimeout(2000);
const v=await p.evaluate(async()=>{await __F.bible.load();const bad=[];let n=0;
 for(const [id,pr] of Object.entries(__progData)){pr.days.forEach((d,i)=>{n++;try{const x=__F.bible.parseRef(d[1]);const vs=x&&__F.bible.verses(x.bi,x.ch,x.v1,x.v2);if(!vs||!vs.length)bad.push(id+' '+(i+1)+' '+d[1])}catch(e){bad.push(id+' '+(i+1)+' ERR')}})}
 return {n,bad,progs:Object.keys(__progData).length}});
say(!v.bad.length,`journeys ${v.progs} programs / ${v.n} days, bad refs: ${v.bad.slice(0,5).join(', ')||'none'}`);
await b.close();if(srv)srv.close();process.exit(fail?1:0);
