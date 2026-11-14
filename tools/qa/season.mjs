// فحص «رحلة الموسم» و«يوم الكنيسة»: حساب الفصح، بطاقات الرئيسية (الجديدة والقديمة)، الصفحة، مزامنة يوم الرحلة. node tools/qa/season.mjs [designs] [mode]
const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium }=await import(PW);
import {serve} from './serve.mjs';
const PORT=+process.env.PORT||8777;const srv=process.env.BASE?null:await serve(PORT);const BASE=process.env.BASE||`http://localhost:${PORT}`;
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium'});
const DES=['bearer','church','classic','cross','crown','glory','holy','lamp','qalaya','royal','shroud'];const MODES=process.argv[3]?[process.argv[3]]:['dark','light'];
const des=process.argv[2]?process.argv[2].split(','):DES;let bad=0;const fail=m=>{bad++;console.log('  ✗',m)};
/* القيامة (الكنيسة القبطية): تواريخ معروفة */
const EASTER={2024:'2024-05-05',2025:'2025-04-20',2026:'2026-04-12',2027:'2027-05-02',2028:'2028-04-16',2029:'2029-04-08',2030:'2030-04-28'};
const CASES=[['lent','2026-03-10T10:00:00',/الصوم الكبير/,'lent40',16],['adv','2026-12-05T10:00:00',/صوم الميلاد/,null,12],['pasc','2026-05-01T10:00:00',/الخمسون/,'pasc',null]];
for(const d of des)for(const mode of MODES){
  console.log(d,mode);
  for(const [lab,date,re,jid,day] of CASES){
    const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));
    await p.clock.install({time:new Date(date)});
    await p.addInitScript(([d,m])=>{if(sessionStorage.__i)return;sessionStorage.__i='1';localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}));localStorage.setItem('rafeeq_onboarded','1')},[d,mode]);
    await p.goto(BASE+'/index.html');await p.waitForTimeout(2000);
    const cards=await p.evaluate(()=>[...document.querySelectorAll('.pg-home.cd,.pg-home.sx,.cdc')].map(e=>e.innerText.replace(/\s+/g,' ')));
    if(!cards.some(t=>/يوم الكنيسة/.test(t)))fail(lab+' home: no church-day card');
    if(!cards.some(t=>/رحلة الموسم/.test(t)))fail(lab+' home: no season card '+JSON.stringify(cards));
    await p.evaluate(()=>__churchDay.open());await p.waitForTimeout(500);
    const t=await p.evaluate(()=>document.getElementById('churchDay').innerText);
    if(!re.test(t))fail(lab+' page season text');for(const w of ['قراءات اليوم','تذكار اليوم','تأمل اليوم','رحلة الموسم'])if(t.indexOf(w)<0)fail(lab+' page missing '+w);
    if(jid){const sj=await p.evaluate(()=>__prog.season());const j=sj.find(x=>x.id===jid);if(!j)fail(lab+' season journey '+jid+' '+JSON.stringify(sj.map(x=>x.id)));else if(day&&j.day!==day)fail(lab+' synced day '+j.day+' != '+day);
      await p.evaluate(id=>{document.querySelector('[data-cdsx="'+id+'"]').click()},jid);await p.waitForTimeout(900);
      if(!await p.$('#progDay.on, #progPage.on'))fail(lab+' season journey did not open');}
    if(errs.length)fail(lab+' errs '+errs[0]);await ctx.close();
  }
}
/* الفصح */
{const p=await b.newPage();await p.goto(BASE+'/index.html');await p.waitForTimeout(1200);
 const r=await p.evaluate(()=>{const o={};for(let y=2024;y<=2030;y++){const e=__copCal.easter(y);o[y]=e.getFullYear()+'-'+String(e.getMonth()+1).padStart(2,'0')+'-'+String(e.getDate()).padStart(2,'0')}return o});
 for(const y in EASTER)if(r[y]!==EASTER[y])fail('easter '+y+' '+r[y]+' != '+EASTER[y]);await p.close()}
await b.close();srv&&srv.close&&srv.close();console.log(bad?`FAIL ${bad}`:'PASS');process.exit(bad?1:0);
