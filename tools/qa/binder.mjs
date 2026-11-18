// شكل الدفتر (بايندر) لما له مرجع من كتاب: node tools/qa/binder.mjs [تصاميم] [dark|light] — يمر على التصاميم × الوضعين × العروض ٣٩٠/٣٦٠/٧٦٨ × إعدادات الخط
// يتحقق: ظهور السلك والهامش، توافق سطور الورقة مع ارتفاع السطر (الكلام واقف على السطور)، عدم وجود تمرير أفقي، وأن الأيام بلا كتاب تبقى بلا دفتر
const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium }=await import(PW);
import {serve} from './serve.mjs';
const PORT=+process.env.PORT||8777,BASE=process.env.BASE||`http://localhost:${PORT}`;
const srv=process.env.BASE?null:await serve(PORT);
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium'});
const ALL=['bearer','church','classic','cross','crown','glory','holy','lamp','qalaya','royal','shroud'];
const DES=(process.argv[2]&&!['dark','light'].includes(process.argv[2])?process.argv[2].split(','):ALL);
const MODES=process.argv.includes('dark')?['dark']:process.argv.includes('light')?['light']:['dark','light'];
const OUT=process.env.OUT||'/tmp/rfqa-binder';import fs from 'node:fs';fs.mkdirSync(OUT,{recursive:true});
const SHOTS=process.env.SHOTS==='1';
let fail=0;const say=(ok,m)=>{if(!ok)fail++;console.log((ok?'ok   ':'FAIL ')+m)};
const CASES=[[390,844,''],[360,780,''],[768,1024,''],[390,844,'130']];
for(const d of DES)for(const m of MODES)for(const [w,h,fp] of CASES){
  const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,90)));
  await p.addInitScript(([d,m,fp])=>{localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}));if(fp)localStorage.setItem('rafeeq_fontpct',fp)},[d,m,fp]);
  await p.goto(BASE+'/index.html');await p.waitForTimeout(1500);
  const R=async(id)=>{await p.evaluate(i=>{try{__prog.close()}catch(e){};__prog.open(i)},id);await p.waitForTimeout(500);await p.evaluate(()=>__prog.day(1));await p.waitForTimeout(700);
    return p.evaluate(()=>{const a=document.querySelector('.pd-bk'),q=document.querySelector('.pd-quote.pd-bind');const el=a||q;const lum=(c)=>{const m=(c||'').match(/[\d.]+/g);return m?(0.2126*+m[0]+0.7152*+m[1]+0.0722*+m[2])/255:null};const pg=document.querySelector('.prg-page.on,.prg-day.on');const out={pgLum:lum(pg&&getComputedStyle(pg).backgroundColor),bk:!!a,quote:!!q,hov:document.documentElement.scrollWidth>innerWidth+1,fix:Object.keys(window.__rfFixLog||{}).filter(k=>/pd-bk|bk-|pd-quote/.test(k))};
      if(el){const cs=getComputedStyle(el),bf=getComputedStyle(el,'::before'),af=getComputedStyle(el,'::after');out.rings=bf.content!=='none'&&bf.backgroundImage.includes('svg');out.margin=af.content!=='none'&&parseFloat(af.width)>0;
        const t=el.querySelector(a?'.bk-page.on .pd-ver':'p');const pc=getComputedStyle(a?el.querySelector('.bk-page.on'):t);out.lh=parseFloat(getComputedStyle(t).lineHeight);
        const gp=pc.backgroundImage.match(/(\d+(\.\d+)?)px\)/g)||[];out.grad=gp.length?parseFloat(gp[gp.length-1]):null;
        const bx=el.getBoundingClientRect();out.inView=bx.left>=-1&&bx.right<=innerWidth+1}
      return out})};
  const a=await R('bk_spiritual_vigil');
  const modeOk=m==='light'?a.pgLum>0.6:a.pgLum<0.4;
  say(modeOk,`${d}/${m}/${w} الرحلات تتبع وضع الشاشة (إضاءة الخلفية ${a.pgLum&&a.pgLum.toFixed(2)})`);
  say(!errs.length&&a.bk&&a.rings&&a.margin&&!a.hov&&a.inView&&!a.fix.length&&a.grad&&Math.abs(a.grad-a.lh)<1.2,`${d}/${m}/${w}${fp?'/font'+fp:''} book ${JSON.stringify(a)} ${errs.join('|')}`);
  if(SHOTS)await p.screenshot({path:`${OUT}/${d}-${m}-${w}${fp?'-f'+fp:''}.png`});
  if(!fp&&w===390){const n=await R('bk_dedication');say(n.bk&&n.rings,`${d}/${m} dedication binder`);
    const pl=await R('joseph');say(!pl.bk,`${d}/${m} non-book journey joseph ${JSON.stringify({bk:pl.bk,quote:pl.quote})}`)}
  await p.close();
}
await b.close();if(srv)srv.close();process.exit(fail?1:0);
