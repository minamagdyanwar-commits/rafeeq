const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium }=await import(PW);
const BASE=process.env.BASE||'http://localhost:8777';
const CHROME=process.env.CHROME||'/opt/pw-browsers/chromium';
const OUT=process.env.OUT||'/tmp/qa';
const NOFIX=process.env.NOFIX==='1';
import fs from 'node:fs';
const des=process.argv[2],mode=process.argv[3]||'dark',vw=+(process.argv[4]||390),vh=+(process.argv[5]||844);
const b=await chromium.launch({executablePath:CHROME});
const ctx=await b.newContext({viewport:{width:vw,height:vh},hasTouch:true,isMobile:vw<700});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,80)));
await p.addInitScript(([d,m])=>{localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}));localStorage.setItem('rafeeq_lines_hint_v2','1');window.__talkFast=1;if(NOFIX)localStorage.setItem('rafeeq_nofix','1')},[des,mode]);
await p.goto(BASE+'/index.html');await p.waitForTimeout(2500);
await p.evaluate(()=>{try{__F.closeSheet()}catch(e){}});
const GATHER=()=>{const out=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while(n=w.nextNode()){const tx=n.nodeValue.trim();if(tx.length<2)continue;const e=n.parentElement;if(!e||e.closest('script,style,noscript,#v302Bar'))continue;
  const cs=getComputedStyle(e);if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity<.1)continue;
  const rg=document.createRange();rg.selectNodeContents(n);const r=rg.getBoundingClientRect();if(r.width<3||r.height<3||r.bottom<0||r.top>innerHeight||r.right<0||r.left>innerWidth)continue;
  const t=document.elementFromPoint(Math.min(innerWidth-1,Math.max(0,r.left+r.width/2)),Math.min(innerHeight-1,Math.max(0,r.top+r.height/2)));if(t&&t!==e&&!e.contains(t)&&!t.contains(e))continue;
  const col=cs.color.match(/[\d.]+/g).map(Number);if(col.length>3&&col[3]<.05)continue;
  const P=c=>{const m=String(c).match(/^rgba?\(([^)]+)\)/);if(m){const a=m[1].split(/[ ,\/]+/).map(Number);return {r:a[0],g:a[1],b:a[2],a:a.length>3?a[3]:1}}const m2=String(c).match(/^color\(srgb\s+([^)]+)\)/);if(m2){const b=m2[1].split(/[ \/]+/).map(Number);return {r:b[0]*255,g:b[1]*255,b:b[2]*255,a:b.length>3?b[3]:1}}return null};
  let n2=e,domBg=null,img=false;while(n2&&n2.nodeType===1){const c2=getComputedStyle(n2);if(c2.backgroundImage&&c2.backgroundImage!=='none'&&n2!==document.body&&n2!==document.documentElement)img=true;const pc=P(c2.backgroundColor);if(pc&&pc.a>.6){domBg=pc;break}n2=n2.parentElement}
  const fgc=P(cs.color);const L=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c.r)+.7152*f(c.g)+.0722*f(c.b)};
  let dom=null;if(domBg&&fgc){const x=L(fgc),y=L(domBg);dom=+((Math.max(x,y)+.05)/(Math.min(x,y)+.05)).toFixed(2)}
  out.push({dom,img,t:tx.slice(0,22),tag:e.tagName.toLowerCase()+'.'+String(e.className||'').split(/\s+/).slice(0,2).join('.'),x:r.left,y:r.top,w:r.width,h:r.height,col,fs:parseFloat(cs.fontSize),fw:+cs.fontWeight||400})}
 return out};
const issues=[];
async function check(name){
  const items=await p.evaluate(GATHER);if(!items.length)return;
  await p.addStyleTag({content:'*,*::before,*::after{color:transparent!important;text-shadow:none!important;-webkit-text-fill-color:transparent!important;caret-color:transparent!important}svg{visibility:hidden!important}',}).then(async h=>{
    await p.waitForTimeout(120);const buf=await p.screenshot();await p.evaluate(el=>el&&el.remove&&el.remove(),h);
    const res=await p.evaluate(async([b64,items])=>{const img=new Image();img.src='data:image/png;base64,'+b64;await img.decode();const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const g=c.getContext('2d');g.drawImage(img,0,0);const sc=img.width/innerWidth;
     const lum=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])};
     const cr=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
     return items.map(it=>{const x=Math.max(0,Math.floor(it.x*sc)),y=Math.max(0,Math.floor(it.y*sc)),w=Math.max(1,Math.min(img.width-x,Math.floor(it.w*sc))),h=Math.max(1,Math.min(img.height-y,Math.floor(it.h*sc)));
      const d=g.getImageData(x,y,w,h).data;const px=[];for(let i=0;i<d.length;i+=4*Math.max(1,Math.floor(d.length/4/200)))px.push([d[i],d[i+1],d[i+2]]);
      // background = median color
      const med=[0,1,2].map(k=>px.map(q=>q[k]).sort((a,b)=>a-b)[Math.floor(px.length/2)]);
      const fgv=it.col.slice(0,3),a=it.col.length>3?it.col[3]:1;const fg=fgv.map((v,i)=>v*a+med[i]*(1-a));
      return {...it,bg:med,ratio:+cr(fg,med).toFixed(2)}})},[buf.toString('base64'),items]);
    res.forEach(r=>{const large=r.fs>=24||(r.fs>=18.66&&r.fw>=700);const need=large?3:4.5;if(r.ratio<Math.min(need,3.6))issues.push({page:name,t:r.t,tag:r.tag,dom:r.dom,img:r.img,ratio:r.ratio,col:r.col.slice(0,3).join(','),bg:r.bg.join(',')})});
  });
}
async function nav(g){await p.evaluate(g=>document.querySelector('#uNav [data-go="'+g+'"]').click(),g);await p.waitForTimeout(900)}
async function more(sel){await p.evaluate(()=>document.querySelector('#uNavMore').click());await p.waitForTimeout(450);await p.evaluate(s=>document.querySelector(s).click(),sel);await p.waitForTimeout(1300)}
async function scrollChk(name){await check(name+'@0');await p.evaluate(()=>window.scrollTo(0,innerHeight*.8));await p.waitForTimeout(250);await check(name+'@1');await p.evaluate(()=>window.scrollTo(0,0))}
try{
 await check('home');
 await nav('pray');await scrollChk('pray');
 await p.evaluate(()=>window.__rafeeq.act('hour',{dataset:{key:'bakr'}}));await p.waitForTimeout(1500);await scrollChk('hour-bakr');
 for(const t of ['tabJourneys','tabMeditation','tabGuided']){await p.evaluate(i=>document.getElementById(i).click(),t);await p.waitForTimeout(700);await scrollChk(t)}
 await nav('read');await scrollChk('read');
 await nav('msg');await scrollChk('msg');
 await nav('exam');await scrollChk('exam');
 await nav('fat');await scrollChk('fat');
 await more('[data-ma="syn"]');await scrollChk('syn');
 await more('[data-ma="cal"]');await scrollChk('cal');
 await more('[data-ma="favs"]');await scrollChk('favs');
 await more('[data-ma="talk"]');
 await p.evaluate(()=>{const t=document.querySelector('#page-talk textarea');if(t){t.value='خايف من المستقبل';t.dispatchEvent(new Event('input',{bubbles:true}));const b=[...document.querySelectorAll('#page-talk button')].find(x=>/أرسل|اسأل|ارسل|✦|إرسال/.test(x.textContent));b&&b.click()}});await p.waitForTimeout(2500);await scrollChk('talk');
 await p.evaluate(()=>__F.openBible(21,23,1));await p.waitForTimeout(2200);await scrollChk('bible-reader');
 await p.evaluate(()=>{document.querySelector('[data-bback="chapters"]')?.click()});await p.waitForTimeout(700);await scrollChk('bible-chapters');
 await p.evaluate(()=>__F.setTrkTab('plan'));await p.waitForTimeout(900);await scrollChk('plan');
 await p.evaluate(()=>__F.setTrkTab('dash'));await p.waitForTimeout(900);await scrollChk('dash');
 await p.evaluate(()=>__F.setTrkTab('memo'));await p.waitForTimeout(900);await scrollChk('memo');
 await p.evaluate(()=>__F.setTrkTab('track'));await p.waitForTimeout(900);await scrollChk('track');
 await p.evaluate(()=>document.querySelector('#uNavMore').click());await p.waitForTimeout(500);await check('more-sheet');await p.evaluate(()=>__F.closeSheet());
 await p.evaluate(()=>__prog.hub('all'));await p.waitForTimeout(500);await check('prog-all');
 await p.evaluate(()=>{__prog.close();__prog.open('joseph')});await p.waitForTimeout(500);await check('prog-path');
 await p.evaluate(()=>document.querySelector('.nd.now').click());await p.waitForTimeout(800);await check('prog-day');
}catch(e){issues.push({page:'SCRIPT',t:e.message.slice(0,100)})}
fs.writeFileSync(`${OUT}/tc_${des}_${mode}_${vw}.json`,JSON.stringify({issues,errs},null,1));
const by={};issues.forEach(i=>{const k=i.page.replace(/@\d/,'');by[k]=(by[k]||0)+1});
console.log(des,mode,vw,'issues',issues.length,JSON.stringify(by));
await b.close();
