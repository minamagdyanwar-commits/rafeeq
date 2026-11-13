// فحص «سياق الإصحاح» تحت نص الإصحاح. node tools/qa/chctx.mjs [designs] [mode]
const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium }=await import(PW);
import {serve} from './serve.mjs';
const PORT=+process.env.PORT||8777;const srv=process.env.BASE?null:await serve(PORT);const BASE=process.env.BASE||`http://localhost:${PORT}`;
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium'});
const DES=['bearer','church','classic','cross','crown','glory','holy','lamp','qalaya','royal','shroud'];const MODES=process.argv[3]?[process.argv[3]]:['dark','light'];
const des=process.argv[2]?process.argv[2].split(','):DES;let bad=0;const fail=m=>{bad++;console.log('  ✗',m)};
for(const d of des)for(const mode of MODES){
  console.log(d,mode);
  const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
  await p.addInitScript(([d,m])=>{if(sessionStorage.__i)return;sessionStorage.__i='1';localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}));localStorage.setItem('rafeeq_onboarded','1')},[d,mode]);
  await p.goto(BASE+'/index.html');await p.waitForTimeout(1500);
  await p.evaluate(()=>__F.openBible(0,22,1));await p.waitForTimeout(1800);
  const t=await p.evaluate(()=>{const e=document.getElementById('chCtx');return e?e.innerText:''});
  if(!/إبراهيم/.test(t))fail('people (Gen 22) '+t.slice(0,80));if(!/يحال|يُحال/.test(t.replace(/[ًٌٍَُِّْ]/g,'')))fail('xrefs line');
  /* التنقل: شخصية → الأطلس */
  await p.evaluate(()=>document.querySelector('#chCtx [data-ccp]').click());await p.waitForTimeout(900);
  if(!await p.evaluate(()=>window.__atlasUI&&__atlasUI.isOpen&&__atlasUI.isOpen()))fail('person did not open atlas');
  await p.evaluate(()=>{try{__atlasUI.close()}catch(e){}});
  /* انتقل لإصحاح آخر: البطاقة تتغيّر ولا تتكرر */
  await p.evaluate(()=>__F.openBible(39,1,1));await p.waitForTimeout(1500);
  const n=await p.evaluate(()=>document.querySelectorAll('#chCtx').length);if(n!==1)fail('cards count '+n);
  if(errs.length)fail('errs '+errs[0]);await p.close();
}
await b.close();srv&&srv.close&&srv.close();console.log(bad?`FAIL ${bad}`:'PASS');process.exit(bad?1:0);
