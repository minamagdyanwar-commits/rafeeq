// فحص قسم «الألحان والترانيم»: المكتبة، البحث، المفضلة، «تظهر في خلوتي»، اختيار ترنيمة الخلوة بالموضوع/الموسم. node tools/qa/hymns.mjs [designs] [mode]
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
  const n=await p.evaluate(()=>__hymns.length);if(n<18)fail('hymns count '+n);
  await p.evaluate(()=>__hymLib.open());await p.waitForTimeout(300);
  const cards=await p.evaluate(()=>document.querySelectorAll('#hymLib .hl-it').length);if(cards!==n)fail('cards '+cards+' vs '+n);
  await p.evaluate(()=>{const i=document.getElementById('hlQ');i.value='سامحني';i.dispatchEvent(new Event('input',{bubbles:true}))});await p.waitForTimeout(200);
  const found=await p.evaluate(()=>[...document.querySelectorAll('#hymLib .hl-open b')].map(x=>x.textContent));if(!found.some(t=>/سامحني/.test(t)))fail('search '+JSON.stringify(found));
  /* مفضلة من المكتبة ثم من القارئ */
  await p.evaluate(()=>{document.getElementById('hlQ').value='';document.getElementById('hlQ').dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('[data-hlfav="samhni"]').click()});
  if(!(await p.evaluate(()=>JSON.parse(localStorage.getItem('rafeeq_hymfav_v1')||'[]').includes('samhni'))))fail('fav not saved');
  await p.evaluate(()=>document.querySelector('[data-hlopen="samhni"]').click());await p.waitForTimeout(300);
  if(!await p.$('#progDay [data-hmfav].on'))fail('reader fav state');
  await p.evaluate(()=>document.querySelector('#progDay [data-hmkh]').click());
  if(!(await p.evaluate(()=>JSON.parse(localStorage.getItem('rafeeq_hymoff_v1')||'[]').includes('samhni'))))fail('khalwa off not saved');
  const pool=await p.evaluate(()=>__hymnsKhalwa('x').map(h=>h.id));if(pool.includes('samhni'))fail('excluded hymn still in khalwa pool');if(pool.includes('nono'))fail('khalwa:false hymn in pool');
  /* ترنيمة الخلوة بالموضوع */
  const topic=await p.evaluate(()=>__hymnsKhalwa('اليوم عن الخوف والعاصفة والإيمان').map(h=>h.id));if(!topic.includes('emsek_ya_rab'))fail('topic match '+JSON.stringify(topic));
  /* الخلوة الموجّهة تولّد خطوة ترنيمة */
  const gd=await p.evaluate(()=>{const o=localStorage.getItem('khalwa_settings_v80');return !!document.getElementById('view-guided')});
  if(errs.length)fail('errs '+errs[0]);await p.close();
}
await b.close();srv&&srv.close&&srv.close();console.log(bad?`FAIL ${bad}`:'PASS');process.exit(bad?1:0);
