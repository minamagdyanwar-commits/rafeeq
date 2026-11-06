// فحص «الرفيق» (تجريبي): مغلق افتراضيًا = لا أثر على DOM؛ مفعّل = استقبال/عتبة/شريط/مصباح/لوحة/إعدادات تعمل؛ الإيقاف يعيد البرنامج كما كان؛ ?companion=off يطفئه.
// node tools/qa/companion.mjs [design,design] [dark|light]   (SHOTS=dir لحفظ لقطات)
const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium }=await import(PW);
import {serve} from './serve.mjs';
const PORT=+process.env.PORT||8777;const srv=process.env.BASE?null:await serve(PORT);const BASE=process.env.BASE||`http://localhost:${PORT}`;
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium'});
const DES=['bearer','church','classic','cross','crown','glory','holy','lamp','qalaya','royal','shroud'];
const des=process.argv[2]?process.argv[2].split(','):DES,modes=process.argv[3]?[process.argv[3]]:['dark','light'];
const SH=process.env.SHOTS;let bad=0;const fail=(m)=>{bad++;console.log('  ✗',m)};
async function mk(d,m,init){const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:SH?2:1});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
  await p.addInitScript(([d,m,init])=>{if(sessionStorage.getItem('__cpi'))return;sessionStorage.setItem('__cpi','1');localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}));for(const k in init)localStorage.setItem(k,init[k])},[d,m,init]);p.errs=errs;return p}
const US={done:true,name:'رفيق',age:'30',stage:2,tone:'calm',preset:'with',gate:1,evening:1,lastGate:new Date().toLocaleDateString('en-CA'),lastEve:new Date().toLocaleDateString('en-CA')};
for(const d of des)for(const m of modes){
  console.log(d,m);
  /* ١) افتراضيًا مغلق */
  let p=await mk(d,m,{});await p.goto(BASE+'/index.html');await p.waitForTimeout(1500);
  const off=await p.evaluate(()=>({l:!!document.getElementById('cpLayer'),s:!!document.getElementById('cpStrip'),a:!!document.getElementById('cpLamp'),h:document.documentElement.hasAttribute('data-companion'),lock:document.documentElement.classList.contains('cp-lock')}));
  if(off.l||off.s||off.a||off.h||off.lock)fail('off-state leaks '+JSON.stringify(off));
  if(p.errs.length)fail('errs(off) '+p.errs[0]);await p.close();
  /* ٢) مفعّل + بروفايل جاهز */
  p=await mk(d,m,{rafeeq_companion_on:'1',rafeeq_companion_v1:JSON.stringify(US)});await p.goto(BASE+'/index.html');await p.waitForTimeout(2000);
  const on=await p.evaluate(()=>({attr:document.documentElement.getAttribute('data-companion'),strip:!!document.querySelector('#page-home #cpStrip'),lamp:!!document.getElementById('cpLamp'),gate:!!document.getElementById('cpGate')}));
  if(on.attr!=='on'||!on.strip||!on.lamp||on.gate)fail('on-state '+JSON.stringify(on));
  if(SH)await p.screenshot({path:`${SH}/home_${d}_${m}.png`});
  await p.click('#cpLamp');await p.waitForTimeout(250);if(!await p.$('#cpPanel .cp-step'))fail('panel');if(SH)await p.screenshot({path:`${SH}/panel_${d}_${m}.png`});
  await p.click('[data-cpsettings]');await p.waitForTimeout(250);if(!await p.$('#cpSet .cp-pre'))fail('settings');
  await p.click('[data-cppre="calm"]');await p.waitForTimeout(150);
  if((await p.evaluate(()=>JSON.parse(localStorage.getItem('rafeeq_companion_v1')).preset))!=='calm')fail('preset not saved');
  if(SH)await p.screenshot({path:`${SH}/set_${d}_${m}.png`});
  await p.click('.cp-btn[data-cpclose="cpSet"]');
  await p.evaluate(()=>__companion.evening());await p.waitForTimeout(200);if(!await p.$('#cpEve'))fail('evening');
  await p.click('[data-cpmood]');await p.click('[data-cpevsave]');await p.waitForTimeout(150);
  if(!(await p.evaluate(()=>JSON.parse(localStorage.getItem('rafeeq_companion_v1')).log.length)))fail('evening not saved');
  await p.evaluate(()=>__companion.gate());await p.waitForTimeout(300);if(!await p.$('#cpGate'))fail('gate');if(SH)await p.screenshot({path:`${SH}/gate_${d}_${m}.png`});
  await p.click('[data-cpgate="skip"]');await p.waitForTimeout(150);
  /* إيقاف من زر الإعدادات الرئيسية = رجوع للوضع الحالي */
  await p.evaluate(()=>document.getElementById('uGear').click());await p.waitForTimeout(200);
  await p.evaluate(()=>document.getElementById('cpToggle').click());await p.waitForTimeout(200);
  const off2=await p.evaluate(()=>({l:!!document.getElementById('cpLayer'),s:!!document.getElementById('cpStrip'),a:!!document.getElementById('cpLamp'),h:document.documentElement.hasAttribute('data-companion'),f:localStorage.getItem('rafeeq_companion_on')}));
  if(off2.l||off2.s||off2.a||off2.h||off2.f!=='0')fail('toggle-off '+JSON.stringify(off2));
  if(p.errs.length)fail('errs(on) '+p.errs[0]);await p.close();
  /* ٣) استقبال أول مرة */
  p=await mk(d,m,{rafeeq_companion_on:'1'});await p.goto(BASE+'/index.html');await p.waitForTimeout(1500);
  if(!await p.$('#cpOnb'))fail('onboarding');else{if(SH)await p.screenshot({path:`${SH}/onb0_${d}_${m}.png`});
    await p.click('[data-cpob=next]');await p.waitForTimeout(150);await p.click('[data-cpob=next]');await p.waitForTimeout(150);
    for(let i=0;i<6;i++){await p.click('[data-cpans="1"]');if(i==0&&SH)await p.screenshot({path:`${SH}/onbq_${d}_${m}.png`});await p.click('[data-cpob=next]');await p.waitForTimeout(100)}
    if(SH)await p.screenshot({path:`${SH}/onbpath_${d}_${m}.png`});
    await p.click('[data-cpob=next]');await p.waitForTimeout(150);await p.click('[data-cppromise]');await p.click('[data-cpob=finish]');await p.waitForTimeout(400);
    if(await p.$('#cpOnb'))fail('onboarding not closed');if(!(await p.evaluate(()=>JSON.parse(localStorage.getItem('rafeeq_companion_v1')).done)))fail('profile not saved')}
  if(p.errs.length)fail('errs(onb) '+p.errs[0]);await p.close();
  /* ٤) مفتاح الطوارئ */
  p=await mk(d,m,{rafeeq_companion_on:'1',rafeeq_companion_v1:JSON.stringify(US)});await p.goto(BASE+'/index.html?companion=off');await p.waitForTimeout(1200);
  const k=await p.evaluate(()=>({s:!!document.getElementById('cpStrip'),f:localStorage.getItem('rafeeq_companion_on')}));if(k.s||k.f!=='0')fail('kill-switch '+JSON.stringify(k));await p.close();
}
await b.close();srv&&srv.close&&srv.close();console.log(bad?`FAIL ${bad}`:'PASS');process.exit(bad?1:0);
