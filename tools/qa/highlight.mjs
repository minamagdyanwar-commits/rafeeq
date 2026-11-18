// التظليل بالضغط المطوّل داخل صفحة الرحلة (ورقة الكتاب وبطاقات التأمل): node tools/qa/highlight.mjs [تصاميم] [dark|light]
// يتحقق: ظهور شريط التظليل، عدم تغيّر صفحة الكتاب (السحب الأفقي للتظليل لا يُحسب تنقّلًا)، الحفظ في «جمل لمستني» بمصدره (من كتاب «…» ص)، وبقاء التظليل بعد إعادة التحميل
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
for(const d of DES)for(const m of MODES)for(const w of [390,768]){
  if(w===768&&!['classic','shroud'].includes(d))continue;
  const ctx=await b.newContext({viewport:{width:w,height:w>500?1024:844},hasTouch:true,isMobile:w<500});
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,90)));
  await p.addInitScript(([d,m])=>{localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}))},[d,m]);
  await p.goto(BASE+'/index.html');await p.waitForTimeout(1500);
  const open=async()=>{await p.evaluate(()=>{try{__prog.close()}catch(e){};__prog.open('bk_spiritual_vigil')});await p.waitForTimeout(500);await p.evaluate(()=>{const e=document.querySelector('[data-pgd="1"]');e&&e.click()});await p.waitForTimeout(1000)};
  await open();
  const cdp=await ctx.newCDPSession(p);const T=(type,x,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y}]});
  async function hl(sel){
    await p.evaluate(s=>document.querySelector(s).scrollIntoView({block:'center'}),sel);await p.waitForTimeout(300);
    const q=await p.evaluate(s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.right-50,y:r.top+14}},sel);
    await T('touchStart',q.x,q.y);await p.waitForTimeout(600);for(let i=1;i<=7;i++){await T('touchMove',q.x-i*20,q.y);await p.waitForTimeout(40)}await T('touchEnd',0,0);await p.waitForTimeout(400);
    const bar=await p.evaluate(()=>{const e=document.querySelector('#v302Bar');return !!e&&!e.hidden});
    if(bar)await p.evaluate(()=>document.querySelector('#v302Bar [data-a=save]').click());await p.waitForTimeout(400);return bar}
  /* السحب السريع (بلا ضغط مطوّل) ما زال يغيّر الصفحة */
  {const pa=await p.evaluate(()=>document.querySelector('.bk-pos').textContent);const q=await p.evaluate(()=>{const r=document.querySelector('.bk-page.on').getBoundingClientRect();return {x:r.left+80,y:r.top+90}});
   await p.evaluate(()=>document.querySelector('.bk-page.on').scrollIntoView({block:'start'}));
   const q2=await p.evaluate(()=>{const r=document.querySelector('.bk-page.on').getBoundingClientRect();return {x:r.left+80,y:Math.max(r.top,0)+90}});
   await T('touchStart',q2.x,q2.y);for(let i=1;i<=5;i++){await T('touchMove',q2.x+i*30,q2.y);await p.waitForTimeout(15)}await T('touchEnd',0,0);await p.waitForTimeout(300);
   const pb=await p.evaluate(()=>document.querySelector('.bk-pos').textContent);say(pa!==pb,`${d}/${m}/${w} السحب السريع يغيّر الصفحة (${pa.slice(0,12)} → ${pb.slice(0,12)})`);
   await open();}
  const pos0=await p.evaluate(()=>document.querySelector('.bk-pos').textContent);
  const b1=await hl('.bk-page.on p.pd-ver:not(.pd-bold)');
  const pos1=await p.evaluate(()=>document.querySelector('.bk-pos').textContent);
  const b2=await hl('.pd-r p');
  const n=await p.evaluate(()=>(CSS.highlights.get('rf-saved-0')||{size:0}).size);
  const meta=await p.evaluate(()=>Object.values(localStorage).some(v=>v.includes('من كتاب «')&&v.includes('رحلتي')));
  await p.reload();await p.waitForTimeout(1800);await open();
  const n2=await p.evaluate(()=>(CSS.highlights.get('rf-saved-0')||{size:0}).size);
  say(b1&&b2&&pos0===pos1&&n>=2&&meta&&n2>=2&&!errs.length,`${d}/${m}/${w} شريط:${b1}/${b2} الصفحة ثابتة:${pos0===pos1} محفوظ:${n} مصدر:${meta} بعد التحميل:${n2} ${errs.join('|')}`);
  await ctx.close();
}
await b.close();if(srv)srv.close();process.exit(fail?1:0);
