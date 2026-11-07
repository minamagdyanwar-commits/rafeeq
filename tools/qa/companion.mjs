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
const US={quiet:{on:0,from:21,to:6},done:true,name:'رفيق',age:'30',stage:2,tone:'calm',preset:'with',gate:1,evening:1,lastGate:new Date().toLocaleDateString('en-CA'),lastEve:new Date().toLocaleDateString('en-CA')};
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
  if(on.attr!=='on'||!on.strip||on.lamp||on.gate)fail('on-state '+JSON.stringify(on));
  const vis=await p.evaluate(()=>{const s=document.getElementById('cpStrip'),r=s.getBoundingClientRect(),e=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return {top:r.top,strip:!!(e&&e.closest('#cpStrip'))}});
  if(vis.top>400||!vis.strip)fail('strip not visible '+JSON.stringify(vis));
  if(SH)await p.screenshot({path:`${SH}/home_${d}_${m}.png`});
  await p.click('[data-cppanel]');await p.waitForTimeout(250);if(!await p.$('#cpPanel .cp-step'))fail('panel');if(SH)await p.screenshot({path:`${SH}/panel_${d}_${m}.png`});
  await p.click('[data-cpsettings]');await p.waitForTimeout(250);if(!await p.$('#cpSet .cp-pre'))fail('settings');
  await p.click('[data-cppre="calm"]');await p.waitForTimeout(150);
  if((await p.evaluate(()=>JSON.parse(localStorage.getItem('rafeeq_companion_v1')).preset))!=='calm')fail('preset not saved');
  await p.click('[data-cplook-cloak="green"]');await p.click('[data-cplook-shape="candle"]');await p.click('[data-cpbtn-size="l"]');await p.click('[data-cpbtn-icon="lamp"]');await p.waitForTimeout(200);
  const lk=await p.evaluate(()=>{const S=JSON.parse(localStorage.getItem('rafeeq_companion_v1'));return {c:S.look.cloak,sh:S.look.lampShape,sz:S.btn.size,ic:S.btn.icon,pv:/--cpc1:#5f8a6d/.test(document.querySelector('#cpSet .cp-prev svg').getAttribute('style')||'')}});
  if(lk.c!=='green'||lk.sh!=='candle'||lk.sz!=='l'||lk.ic!=='lamp'||!lk.pv)fail('look settings '+JSON.stringify(lk));
  if(SH)await p.screenshot({path:`${SH}/set_${d}_${m}.png`});
  await p.click('.cp-btn[data-cpclose="cpSet"]');
  await p.evaluate(()=>{const b=document.querySelector('#uNav [data-go="read"]');b&&b.click()});await p.waitForTimeout(500);if(!await p.$('#cpLamp'))fail('lamp on other page');
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
  /* ٥) تخصيص الظهور + حفظ مكان التمرير + سؤال القراءة */
  for(const [lv,wantStrip,wantLamp] of [[0,false,false],[1,false,true],[2,true,false]]){
    p=await mk(d,m,{rafeeq_companion_on:'1',rafeeq_companion_v1:JSON.stringify({...US,pages:{home:lv,read:2,other:1}})});await p.goto(BASE+'/index.html');await p.waitForTimeout(1500);
    const r=await p.evaluate(()=>({s:!!document.getElementById('cpStrip'),l:!!document.getElementById('cpLamp')}));
    if(r.s!==wantStrip||r.l!==wantLamp)fail('home level '+lv+' '+JSON.stringify(r));
    if(lv===2){
      await p.evaluate(()=>__companion.openSettings());await p.waitForTimeout(250);
      await p.evaluate(()=>{document.querySelector('#cpSet .cp-sheet').scrollTop=700});await p.waitForTimeout(100);
      await p.click('#cpTgGate');await p.waitForTimeout(250);
      const sc=await p.evaluate(()=>document.querySelector('#cpSet .cp-sheet').scrollTop);
      if(sc<300)fail('settings jumped to top: '+sc);
      await p.click('.cp-btn[data-cpclose="cpSet"]');
      await p.evaluate(()=>{const b=document.querySelector('#uNav [data-go="read"]');b&&b.click()});await p.waitForTimeout(700);
      if(await p.$('#cpRead'))fail('reading question appeared before reading');
      const done=await p.evaluate(()=>{try{return !!__F.readDone(__F.dkey())}catch(e){return null}});
      if(done===false){await p.evaluate(()=>{const b=document.querySelector('#readDoneBar button');b&&b.click()});await p.waitForTimeout(900);
        if(!await p.$('#cpRead'))fail('reading question missing after marking read');else{await p.fill('#cpWordTxt','كلمة تجريبية');await p.click('[data-cpwordsave]');await p.waitForTimeout(200);
          if(!(await p.evaluate(()=>JSON.parse(localStorage.getItem('rafeeq_companion_v1')).memory.some(x=>/تجريبية/.test(x.t)))))fail('word not saved')}}
    }
    if(p.errs.length)fail('errs(custom) '+p.errs[0]);await p.close();
  }
  /* ٦) المتابعة: كلام من نشاطك الفعلي */
  p=await mk(d,m,{rafeeq_companion_on:'1',rafeeq_companion_v1:JSON.stringify({...US,pages:{home:2,read:2,other:1}})});await p.goto(BASE+'/index.html');await p.waitForTimeout(1500);
  await p.evaluate(()=>{const f=__F,base=f.parseKey(f.realKey()),K=n=>f.dkey(f.addDays(base,-n));for(let n=3;n<=10;n++)f.setHour(K(n),'bakr',true);for(let n=5;n<=9;n++)f.setDay(K(n),r=>{r.read=1})});
  const ts=await p.evaluate(()=>__companion.insights().map(c=>c.type));
  if(!ts.includes('hourGap')||!ts.includes('readGap'))fail('insights missing: '+JSON.stringify(ts));
  const txt=await p.evaluate(()=>{const S=__companion.state(),cs=__companion.insights(),c=cs.find(x=>x.type==='hourGap');return [__cpInsight.render(S,c),__cpInsight.render(S,c),__cpInsight.render(S,c)]});
  if(txt[0]===txt[1]||txt[1]===txt[2])fail('same wording repeated '+JSON.stringify(txt));
  if(txt.some(t=>/\u0644\u0627\u0632\u0645|\u0630\u0646\u0628|\u0643\u0633\u0644\u0627\u0646|\u0625\u0647\u0645\u0627\u0644|\u0645\u0642\u0635\u0651?\u0631/.test(t)))fail('blaming wording '+txt[0]);
  await p.evaluate(()=>__companion.say());await p.waitForTimeout(400);
  if(!await p.$('#cpCall'))fail('callout bubble missing');else if(SH)await p.screenshot({path:`${SH}/call_${d}_${m}.png`});
  await p.click('.cp-call-b');await p.waitForTimeout(300);
  if(!await p.$('#cpPanel .cp-obs'))fail('panel observations missing');
  if((await p.$$('#cpPanel .cp-wk')).length<3)fail('week rows missing');
  if(!await p.$('#cpPanel .cp-msg'))fail('inbox missing');
  if(SH)await p.screenshot({path:`${SH}/insight_${d}_${m}.png`});
  await p.click('.cp-btn[data-cpclose="cpPanel"]');
  await p.evaluate(()=>{__companion.state().topics.pray=0;});
  const ts2=await p.evaluate(()=>__companion.insights().map(c=>c.type));
  if(ts2.includes('hourGap'))fail('topic off ignored');
  if(p.errs.length)fail('errs(insight) '+p.errs[0]);await p.close();
  /* ٤) مفتاح الطوارئ */
  p=await mk(d,m,{rafeeq_companion_on:'1',rafeeq_companion_v1:JSON.stringify(US)});await p.goto(BASE+'/index.html?companion=off');await p.waitForTimeout(1200);
  const k=await p.evaluate(()=>({s:!!document.getElementById('cpStrip'),f:localStorage.getItem('rafeeq_companion_on')}));if(k.s||k.f!=='0')fail('kill-switch '+JSON.stringify(k));await p.close();
}
await b.close();srv&&srv.close&&srv.close();console.log(bad?`FAIL ${bad}`:'PASS');process.exit(bad?1:0);
