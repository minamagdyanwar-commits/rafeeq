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
  /* نافذة «الجملة اللي وقفتني»: ورقة سفلية ثابتة بنص مقروء، وتختفي تمامًا بعد الإغلاق (لا تبقى أسفل أي صفحة) */
  {await p.evaluate(()=>document.querySelector('.bk-page.on').scrollIntoView({block:'start'}));await p.waitForTimeout(300);
   const q=await p.evaluate(()=>{const e=document.querySelector('.bk-page.on p.pd-ver:not(.pd-bold)');const r=e.getBoundingClientRect();return {x:r.right-50,y:r.top+14}});
   await T('touchStart',q.x,q.y);await p.waitForTimeout(600);for(let i=1;i<=6;i++){await T('touchMove',q.x-i*20,q.y);await p.waitForTimeout(40)}await T('touchEnd',0,0);await p.waitForTimeout(400);
   await p.evaluate(()=>document.querySelector('#v302Bar [data-a=note]').click());await p.waitForTimeout(700);
   const sh=await p.evaluate(()=>{const s=document.getElementById('v299Sheet'),bx=s&&s.querySelector('.v299-box');if(!bx)return null;const cs=getComputedStyle(s),bc=getComputedStyle(bx),r=bx.getBoundingClientRect();const pc=c=>(c.match(/[\d.]+/g)||[0,0,0]).map(Number);
     const lum=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])};const rt=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
     const h=getComputedStyle(s.querySelector('.v299-h')).color,q=getComputedStyle(s.querySelector('.v299-q')).color,sub=getComputedStyle(s.querySelector('.v299-s')).color;
     return {pos:cs.position,hidden:s.hidden,bottom:Math.round(r.bottom),vh:innerHeight,ratioText:rt(pc(bc.color),pc(bc.backgroundColor)),ratioH:rt(pc(h),pc(bc.backgroundColor)),ratioS:rt(pc(sub),pc(bc.backgroundColor))}});
   const okSheet=!!sh&&sh.pos==='fixed'&&!sh.hidden&&Math.abs(sh.bottom-sh.vh)<3&&sh.ratioText>=4.5&&sh.ratioH>=4.5&&sh.ratioS>=4.5;
   await p.evaluate(()=>document.getElementById('v299X').click());await p.waitForTimeout(500);
   await p.evaluate(()=>{try{__prog.close()}catch(e){};document.querySelector('#uNav [data-go="home"]').click()});await p.waitForTimeout(600);
   const gone=await p.evaluate(()=>{const s=document.getElementById('v299Sheet');if(!s)return true;const r=s.getBoundingClientRect();return getComputedStyle(s).display==='none'&&r.height===0});
   say(okSheet&&gone,`${d}/${m}/${w} نافذة الملاحظة: ثابتة ومقروءة ${okSheet} ${sh?JSON.stringify({t:+sh.ratioText.toFixed(1),h:+sh.ratioH.toFixed(1),s:+sh.ratioS.toFixed(1)}):'لا نافذة'} — تختفي بعد الإغلاق ${gone}`);
   await open();}
  const pos0=await p.evaluate(()=>document.querySelector('.bk-pos').textContent);
  const b1=await hl('.bk-page.on p.pd-ver:not(.pd-bold)');
  const pos1=await p.evaluate(()=>document.querySelector('.bk-pos').textContent);
  const b2=await hl('.pd-r p');
  /* تظليل يمتد عبر عدة فقرات: سحب رأسي من فقرة إلى ما بعدها */
  await p.evaluate(()=>{document.querySelector('.bk-page.on').scrollIntoView({block:'start'})});await p.waitForTimeout(300);
  const mp=await p.evaluate(()=>{const ps=[...document.querySelectorAll('.bk-page.on p.pd-ver:not(.pd-bold)')];const r=ps[0].getBoundingClientRect();const last=ps[Math.min(3,ps.length-1)].getBoundingClientRect();return {x:r.right-40,y:r.top+12,ex:r.left+120,ey:last.bottom-10,np:ps.length}});
  await T('touchStart',mp.x,mp.y);await p.waitForTimeout(600);const steps=12;for(let i=1;i<=steps;i++){await T('touchMove',mp.x+(mp.ex-mp.x)*i/steps,mp.y+(mp.ey-mp.y)*i/steps);await p.waitForTimeout(40)}await T('touchEnd',0,0);await p.waitForTimeout(500);
  const b3=await p.evaluate(()=>{const e=document.querySelector('#v302Bar');return !!e&&!e.hidden});
  if(b3)await p.evaluate(()=>document.querySelector('#v302Bar [data-a=save]').click());await p.waitForTimeout(500);
  const multi=await p.evaluate(()=>Object.values(localStorage).some(v=>v.includes('\u2029')));
  const n=await p.evaluate(()=>(CSS.highlights.get('rf-saved-0')||{size:0}).size);
  const meta=await p.evaluate(()=>Object.values(localStorage).some(v=>v.includes('من كتاب «')&&v.includes('رحلتي')));
  await p.reload();await p.waitForTimeout(1800);await open();
  const n2=await p.evaluate(()=>(CSS.highlights.get('rf-saved-0')||{size:0}).size);
  say(b1&&b2&&b3&&multi&&pos0===pos1&&n>=5&&meta&&n2>=5&&!errs.length,`${d}/${m}/${w} شريط:${b1}/${b2}/${b3} عدة فقرات:${multi} الصفحة ثابتة:${pos0===pos1} نطاقات محفوظة:${n} مصدر:${meta} بعد التحميل:${n2} ${errs.join('|')}`);
  await ctx.close();
}
await b.close();if(srv)srv.close();process.exit(fail?1:0);
