// آية اليوم في الرئيسية: مرجعها مرجع الآية (لا مرجع قول الأب) — كل التصميمات × الوضعين: node tools/qa/votd.mjs [تصاميم] [dark|light]
const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium }=await import(PW);
import {serve} from './serve.mjs';
const PORT=+process.env.PORT||8777,BASE=process.env.BASE||`http://localhost:${PORT}`;
const srv=process.env.BASE?null:await serve(PORT);
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium'});
const ALL=['bearer','church','classic','cross','crown','glory','holy','lamp','qalaya','royal','shroud'];
const DES=(process.argv[2]&&!['dark','light'].includes(process.argv[2])?process.argv[2].split(','):ALL);
const MODES=process.argv.includes('dark')?['dark']:process.argv.includes('light')?['light']:['dark','light'];
let fail=0;const say=(ok,m)=>{if(!ok)fail++;console.log((ok?'ok   ':'FAIL ')+m)};
for(const d of DES)for(const m of MODES){
  const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,90)));
  await p.addInitScript(([d,m])=>{localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}))},[d,m]);
  await p.goto(BASE+'/index.html');await p.waitForTimeout(2200);
  const r=await p.evaluate(()=>{const g=s=>document.querySelector(s);const vt=g('#hExtra .votd:not(.fat-day) .vt'),subs=[...document.querySelectorAll('#hExtra .votd:not(.fat-day) .u-sub')],ref=subs.length?subs[subs.length-1].textContent.trim():'';
    const hv=g('.hm-verse'),hp=hv&&hv.querySelector('p'),hs=hv&&hv.querySelector('small'),fat=g('.fat-day');const fc=fat?[...fat.querySelectorAll('.u-sub')].pop().textContent.trim():'';
    return {ref,fc,hasVerse:!!hv,hmRef:hs?hs.textContent.trim():null,hmVerse:hp?hp.textContent.trim():null,vt:vt?vt.textContent.trim():null}});
  const ok=r.hasVerse?(r.hmRef&&r.hmRef===r.ref&&(!r.fc||r.hmRef!==r.fc)&&r.hmVerse===r.vt):true;
  say(ok&&!errs.length,`${d}/${m} مرجع آية اليوم «${r.hmRef}» ${r.fc&&r.hmRef===r.fc?'(= مرجع قول الأب!)':''} ${errs.join('|')}`);
  await p.close();
}
await b.close();if(srv)srv.close();process.exit(fail?1:0);
