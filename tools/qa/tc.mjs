const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium }=await import(PW);
const BASE=process.env.BASE||'http://localhost:8777';
const CHROME=process.env.CHROME||'/opt/pw-browsers/chromium';
const OUT=process.env.OUT||'/tmp/qa';
const NOFIX=process.env.NOFIX==='1';
import fs from 'node:fs';
import {makeSettle} from './settle.mjs';
const des=process.argv[2],mode=process.argv[3]||'dark',vw=+(process.argv[4]||390),vh=+(process.argv[5]||844);
const b=await chromium.launch({executablePath:CHROME});
const ctx=await b.newContext({viewport:{width:vw,height:vh},hasTouch:true,isMobile:vw<700});
const p=await ctx.newPage();
const {settle,raf2,noAnim}=makeSettle(p);
let __items=0;
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,80)));
await p.addInitScript(([d,m])=>{localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}));localStorage.setItem('rafeeq_lines_hint_v2','1');window.__talkFast=1;if(NOFIX)localStorage.setItem('rafeeq_nofix','1')},[des,mode]);
await p.goto(BASE+'/index.html');await p.waitForFunction(()=>window.__F&&window.__rafeeq&&document.querySelector('#uNav [data-go]'),null,{timeout:15000}).catch(()=>{});await settle(900);
await noAnim();/* للاختبار فقط: لا نلتقط ألوانًا في منتصف انتقال */
await p.evaluate(()=>{try{__F.closeSheet()}catch(e){}});
/* خطة قراءة الكتاب بدأت قبل ١٠ أيام: لتظهر خطوتها في «يومي» وتبويب الخطة وزر «علّم الأيام السابقة» وعمود الجدول */
await p.evaluate(async()=>{try{const F=__F;await F.bible.load();const st=F.dkey(F.addDays(F.parseKey(F.dkey()),-10));const pr=F.prefs();pr.plan={scope:'gospels',days:30,start:st,name:'خطة الأناجيل',from:0};F.savePrefs(pr)}catch(e){}});await settle(400);
const GATHER=()=>{const out=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while(n=w.nextNode()){const tx=n.nodeValue.trim();if(tx.length<2)continue;const e=n.parentElement;if(!e||e.closest('script,style,noscript,#v302Bar'))continue;
  const cs=getComputedStyle(e);if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity<.1)continue;if(!/[\p{L}\p{N}]/u.test(tx))continue;/* إيموجي/رموز فقط: لونها لا يتبع لون الخط */
  const rg=document.createRange();rg.selectNodeContents(n);const r=rg.getBoundingClientRect();if(r.width<3||r.height<3||r.bottom<0||r.top>innerHeight||r.right<0||r.left>innerWidth||r.top<-2||r.bottom>innerHeight+2)continue;/* مقطوع بحافة الشاشة: لا يمكن قياسه */
  let clipped=false;for(let q=e.parentElement;q&&q!==document.body;q=q.parentElement){const o=getComputedStyle(q);if(o.overflow==='visible'&&o.overflowX==='visible'&&o.overflowY==='visible')continue;const qr=q.getBoundingClientRect();const ix=Math.min(r.right,qr.right)-Math.max(r.left,qr.left),iy=Math.min(r.bottom,qr.bottom)-Math.max(r.top,qr.top);if(ix<r.width*.5||iy<r.height*.5){clipped=true;break}}if(clipped)continue;/* مقصوص داخل أب (أكورديون مغلق أو شريط يتمرر) */
  const t=document.elementFromPoint(Math.min(innerWidth-1,Math.max(0,r.left+r.width/2)),Math.min(innerHeight-1,Math.max(0,r.top+r.height/2)));if(t&&t!==e&&!e.contains(t)&&!t.contains(e))continue;
  /* تغطية جزئية: نقاط من حواف النص (لا المنتصف فقط) يغطيها عنصر آخر من فوقه (شريط كتابة عائم، أزرار عائمة) */
  {let cov=false;for(const [fx,fy] of [[.12,.5],[.88,.5],[.5,.15],[.5,.85]]){const px=Math.min(innerWidth-1,Math.max(0,r.left+r.width*fx)),py=Math.min(innerHeight-1,Math.max(0,r.top+r.height*fy));const u=document.elementFromPoint(px,py);if(u&&u!==e&&!e.contains(u)&&!u.contains(e)){cov=true;break}}if(cov)continue}
  let col=cs.color.match(/[\d.]+/g).map(Number);if(/^color\(/.test(cs.color))col=col.map((v,i)=>i<3?v*255:v);/* color(srgb 0-1) */if(col.length>3&&col[3]<.05)continue;
  const P=c=>{const m=String(c).match(/^rgba?\(([^)]+)\)/);if(m){const a=m[1].split(/[ ,\/]+/).map(Number);return {r:a[0],g:a[1],b:a[2],a:a.length>3?a[3]:1}}const m2=String(c).match(/^color\(srgb\s+([^)]+)\)/);if(m2){const b=m2[1].split(/[ \/]+/).map(Number);return {r:b[0]*255,g:b[1]*255,b:b[2]*255,a:b.length>3?b[3]:1}}return null};
  let n2=e,domBg=null,img=false;while(n2&&n2.nodeType===1){const c2=getComputedStyle(n2);if(c2.backgroundImage&&c2.backgroundImage!=='none'&&n2!==document.body&&n2!==document.documentElement)img=true;const pc=P(c2.backgroundColor);if(pc&&pc.a>.6){domBg=pc;break}n2=n2.parentElement}
  const fgc=P(cs.color);const L=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c.r)+.7152*f(c.g)+.0722*f(c.b)};
  let dom=null;if(domBg&&fgc){const x=L(fgc),y=L(domBg);dom=+((Math.max(x,y)+.05)/(Math.min(x,y)+.05)).toFixed(2)}
  out.push({dom,img,t:tx.slice(0,22),tag:e.tagName.toLowerCase()+'.'+String(e.className||'').split(/\s+/).slice(0,2).join('.'),x:r.left,y:r.top,w:r.width,h:r.height,col,fs:parseFloat(cs.fontSize),fw:+cs.fontWeight||400})}
 return out};
const issues=[];
async function check(name){
  const items=await p.evaluate(GATHER);if(!items.length)return;__items+=items.length;
  if(process.env.SHOTS)try{fs.writeFileSync(`${OUT}/pg_${des}_${mode}_${name.replace(/[^a-z0-9@-]/gi,'_')}.png`,await p.screenshot())}catch(e){}/* SHOTS=1: لقطة كل صفحة (قبل إخفاء النص) لمراجعة البلاغات بالعين */
  await p.addStyleTag({content:'*,*::before,*::after{color:transparent!important;text-shadow:none!important;-webkit-text-fill-color:transparent!important;caret-color:transparent!important}svg{visibility:hidden!important}',}).then(async h=>{
    await raf2();const buf=await p.screenshot();await p.evaluate(el=>el&&el.remove&&el.remove(),h);
    const res=await p.evaluate(async([b64,items])=>{const img=new Image();img.src='data:image/png;base64,'+b64;await img.decode();const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const g=c.getContext('2d');g.drawImage(img,0,0);const sc=img.width/innerWidth;
     const lum=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])};
     const cr=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
     return items.map(it=>{const x=Math.max(0,Math.floor(it.x*sc)),y=Math.max(0,Math.floor(it.y*sc)),w=Math.max(1,Math.min(img.width-x,Math.floor(it.w*sc))),h=Math.max(1,Math.min(img.height-y,Math.floor(it.h*sc)));
      const d=g.getImageData(x,y,w,h).data;const px=[];for(let i=0;i<d.length;i+=4*Math.max(1,Math.floor(d.length/4/200)))px.push([d[i],d[i+1],d[i+2]]);
      // background = median color
      const med=[0,1,2].map(k=>px.map(q=>q[k]).sort((a,b)=>a-b)[Math.floor(px.length/2)]);
      const fgv=it.col.slice(0,3),a=it.col.length>3?it.col[3]:1;const fg=fgv.map((v,i)=>v*a+med[i]*(1-a));
      return {...it,bg:med,ratio:+cr(fg,med).toFixed(2)}})},[buf.toString('base64'),items]);
    res.forEach(r=>{const large=r.fs>=24||(r.fs>=18.66&&r.fw>=700);const need=large?3:4.5;if(r.ratio<Math.min(need,3.6))issues.push({page:name,x:r.x,y:r.y,w:r.w,h:r.h,t:r.t,tag:r.tag,dom:r.dom,img:r.img,ratio:r.ratio,col:r.col.slice(0,3).join(','),bg:r.bg.join(',')})});
  });
}
async function nav(g){await p.evaluate(g=>document.querySelector('#uNav [data-go="'+g+'"]').click(),g);await settle(900)}
async function more(sel){await p.evaluate(()=>document.querySelector('#uNavMore').click());await settle(450);await p.evaluate(s=>document.querySelector(s).click(),sel);await settle(1300)}
async function scrollChk(name){await check(name+'@0');/* صفحة لا تتمرّر لا تحتاج مرورًا ثانيًا (نفس المحتوى) */const sc=await p.evaluate(()=>Math.max(document.documentElement.scrollHeight,document.body.scrollHeight)-innerHeight);if(sc<120)return;await p.evaluate(()=>window.scrollTo(0,innerHeight*.8));await settle(550);await check(name+'@1');await p.evaluate(()=>window.scrollTo(0,0))}
try{
 await check('home');
 await nav('pray');await scrollChk('pray');
 await p.evaluate(()=>window.__rafeeq.act('hour',{dataset:{key:'bakr'}}));await settle(1500);await scrollChk('hour-bakr');
 for(const t of ['tabJourneys','tabMeditation','tabGuided']){await p.evaluate(i=>document.getElementById(i).click(),t);await settle(700);await scrollChk(t)}
 await nav('read');await scrollChk('read');
 await nav('msg');await scrollChk('msg');
 await nav('exam');await scrollChk('exam');
 await nav('fat');await scrollChk('fat');
 await more('[data-ma="syn"]');await scrollChk('syn');
 await more('[data-ma="cal"]');await scrollChk('cal');
 await more('[data-ma="favs"]');await scrollChk('favs');
 await more('[data-ma="talk"]');
 await p.evaluate(()=>{const t=document.querySelector('#page-talk textarea');if(t){t.value='خايف من المستقبل';t.dispatchEvent(new Event('input',{bubbles:true}));const b=[...document.querySelectorAll('#page-talk button')].find(x=>/أرسل|اسأل|ارسل|✦|إرسال/.test(x.textContent));b&&b.click()}});await settle(2500);await scrollChk('talk');
 await p.evaluate(()=>__F.openBible(21,23,1));await settle(2200);await scrollChk('bible-reader');
 await p.evaluate(()=>{document.querySelector('[data-bback="chapters"]')?.click()});await settle(700);await scrollChk('bible-chapters');
 await p.evaluate(()=>__F.setTrkTab('plan'));await settle(900);await scrollChk('plan');
 await p.evaluate(()=>{const x=document.querySelector('[data-tback]');x&&x.click()});await settle(600);await check('plan-backfill-sheet');await p.evaluate(()=>{try{__F.closeSheet()}catch(e){}});
 await p.evaluate(()=>__F.setTrkTab('dash'));await settle(900);await scrollChk('dash');
 await p.evaluate(()=>__F.setTrkTab('memo'));await settle(900);await scrollChk('memo');
 await p.evaluate(()=>__F.setTrkTab('track'));await settle(900);await scrollChk('track');
 await p.evaluate(()=>{const x=document.querySelector('[data-v70="backfill"]');x&&x.click()});await settle(700);await check('bf-grid');await p.evaluate(()=>{try{__F.closeSheet()}catch(e){}});
 await p.evaluate(()=>document.querySelector('#uNavMore').click());await settle(500);await check('more-sheet');await p.evaluate(()=>__F.closeSheet());
 await p.evaluate(()=>__prog.hub('all'));await settle(500);await check('prog-all');
 await p.evaluate(()=>{__prog.close();__prog.open('joseph')});await settle(500);await check('prog-path');
 await p.evaluate(()=>document.querySelector('.nd.now').click());await settle(800);await check('prog-day');

 await p.evaluate(()=>{try{__prog.close()}catch(e){}});await settle(300);
 /* صفحات إضافية (كل خطوة تتخطّى بهدوء لو عنصرها غير موجود): الإعدادات، البحث، أطلس الكتاب، الألحان، يوم قديم، تبويبات المتابعة، نافذة اليوم */
 const step=async(name,fn,wait=700,scroll=false)=>{try{await p.evaluate(fn);await settle(wait);if(scroll)await scrollChk(name);else await check(name)}catch(e){errs.push(name+': '+String(e.message).slice(0,60))}};
 const byLabel=l=>`(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.getAttribute('aria-label')==='${l}'&&x.offsetParent);b&&b.click()})()`;
 await step('settings',byLabel('الإعدادات'),900);await p.evaluate(()=>{try{__F.closeSheet()}catch(e){}document.querySelectorAll('.on[role=dialog]').forEach(x=>x.classList.remove('on'))});
 await step('search',byLabel('بحث'),700);
 try{await p.evaluate(()=>{const i=document.querySelector('input[type=search],#sInput,#searchInput');if(i){i.value='الصلاة';i.dispatchEvent(new Event('input',{bubbles:true}))}});await settle(900);await check('search-res')}catch(e){}
 await p.keyboard.press('Escape');await p.evaluate(()=>{try{__F.closeSheet()}catch(e){}document.querySelectorAll('.on[role=dialog]').forEach(x=>x.classList.remove('on'));document.getElementById('uSearchOv')&&document.getElementById('uSearchOv').classList.remove('on');[...document.querySelectorAll('button')].find(x=>x.offsetParent&&/^إغلاق$/.test(x.textContent.trim()))?.click()});await settle(400);
 await step('atlas-people',()=>__atlasUI.open('people'),500,true);
 await step('atlas-person',()=>__atlasUI.open('p','abraham'),400);
 await step('atlas-lines',()=>__atlasUI.open('lines'),400,true);
 await step('atlas-maps',()=>__atlasUI.open('maps'),400);
 await step('atlas-map',()=>__atlasUI.open('m','paul2','athens'),600);
 await p.evaluate(()=>{try{__atlasUI.close()}catch(e){}});
 await step('study-gospels',()=>__studyUI.open('gospels'),500,true);
 await step('study-event',()=>__studyUI.open('gospels','transfiguration'),900);
 await step('study-kings',()=>__studyUI.open('kings','ramoth'),900);
 await step('study-prophecy',()=>__studyUI.open('prophecy','virgin'),900);
 await step('study-themes',()=>__studyUI.open('themes','questions'),900);
 await step('study-life',()=>__studyUI.open('life'),500,true);
 await p.evaluate(()=>{try{__studyUI.close()}catch(e){}});
 await step('hymn',()=>__hymnsUI.open('afta7_fay'),500,true);await p.evaluate(()=>{try{__hymnsUI.close()}catch(e){}});
 /* v6.16: مكتبة الألحان والترانيم + قارئ بشريط المفضلة + «يوم الكنيسة» + سياق الإصحاح */
 await step('hymlib',()=>__hymLib.open(),500,true);
 await step('hymlib-search',()=>{const i=document.getElementById('hlQ');i.value='سامحني';i.dispatchEvent(new Event('input',{bubbles:true}))},500);
 await step('hymn-ref',()=>{document.getElementById('hlQ').value='';__hymnsUI.open('emsek_ya_rab')},500,true);await p.evaluate(()=>{try{__hymnsUI.close();__hymLib.close()}catch(e){}});
 await step('churchday',()=>__churchDay.open(),700,true);await p.evaluate(()=>{try{__churchDay.close()}catch(e){}});
 await step('bible-ctx',()=>__F.openBible(0,22,1),2000);await p.evaluate(()=>{const e=document.getElementById('chCtx');e&&e.scrollIntoView({block:'center'})});await settle(400);await check('bible-ctx@card');
 await step('bible-ctx2',()=>__F.openBible(39,1,1),1800);await p.evaluate(()=>{const e=document.getElementById('chCtx');e&&e.scrollIntoView({block:'center'})});await settle(400);await check('bible-ctx2@card');
 for(const t of ['notes','khalwa','sects'])await step('trk-'+t,`(()=>{window.__rafeeq&&__rafeeq.show('trk',{top:1});__F.setTrkTab('${t}')})()`,800,true);
 await step('cal-next',()=>{window.__rafeeq&&__rafeeq.show('cal');[...document.querySelectorAll('#calBody .u-tabs button')].find(b=>/القادم/.test(b.textContent))?.click()},900,true);
 await step('day-dialog',()=>__F.dayDialog(),600);await p.evaluate(()=>{try{__F.closeSheet()}catch(e){}document.querySelectorAll('.on[role=dialog]').forEach(x=>x.classList.remove('on'))});
 await p.evaluate(()=>{const F=__F;F.setEntry(F.dkey(F.addDays(F.parseKey(F.realKey()),-1)),false);document.querySelector('#uNav [data-go="home"]')?.click()});await settle(1100);await check('home-offday');
 /* موسم الصوم الكبير (وقت ثابت): بطاقتا الرئيسية و«يوم الكنيسة» برحلة الموسم */
 try{await p.clock.setFixedTime(new Date('2026-03-10T10:00:00'));await p.evaluate(()=>{document.querySelector('#uNav [data-go="home"]')?.click();document.body.appendChild(document.createElement('i')).remove()});await settle(1200);await check('home-lent');
  await step('churchday-lent',()=>__churchDay.open(),700,true);await p.evaluate(()=>{try{__churchDay.close()}catch(e){}});}catch(e){errs.push('lent: '+String(e.message).slice(0,60))}
}catch(e){issues.push({page:'SCRIPT',t:e.message.slice(0,100)})}
fs.writeFileSync(`${OUT}/tc_${des}_${mode}_${vw}.json`,JSON.stringify({issues,errs,items:__items},null,1));
const by={};issues.forEach(i=>{const k=i.page.replace(/@\d/,'');by[k]=(by[k]||0)+1});
console.log(des,mode,vw,'issues',issues.length,JSON.stringify(by),'items',__items);
await b.close();
