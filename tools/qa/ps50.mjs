// المزمور الخمسون في الأجبية: النص المعتمد ظاهر كاملًا بسطوره، بلا النص القديم، قابل للقراءة (تباين) وبلا تمرير أفقي — كل التصميمات × الوضعين × ٣٩٠/٣٦٠/٧٦٨
// node tools/qa/ps50.mjs [تصاميم] [dark|light] [--shots]
import {mkdirSync,readFileSync} from 'node:fs';
const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium }=await import(PW);
import {serve} from './serve.mjs';
const PORT=+process.env.PORT||8777,BASE=process.env.BASE||`http://localhost:${PORT}`;
const srv=process.env.BASE?null:await serve(PORT);
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium'});
const ALL=['bearer','church','classic','cross','crown','glory','holy','lamp','qalaya','royal','shroud'];
const arg=process.argv.slice(2).filter(x=>!x.startsWith('--'));
const DES=arg[0]&&!['dark','light'].includes(arg[0])?arg[0].split(','):ALL;
const MODES=arg.includes('dark')?['dark']:arg.includes('light')?['light']:['dark','light'];
const SHOTS=process.argv.includes('--shots');if(SHOTS)mkdirSync('tools/qa/reports/ps50',{recursive:true});
const EXP=readFileSync(new URL('./ps50-expected.txt',import.meta.url),'utf8').split('\n').filter(Boolean);
let fail=0;const say=(ok,m)=>{if(!ok)fail++;if(!ok||process.env.V)console.log((ok?'ok   ':'FAIL ')+m)};
const lum=c=>{const f=x=>{x/=255;return x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])};
const cr=(a,c)=>{const x=lum(a),y=lum(c);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
for(const d of DES)for(const m of MODES)for(const w of [390,360,768]){
  const p=await b.newPage({viewport:{width:w,height:w===768?1024:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,90)));
  await p.addInitScript(([d,m])=>{if(sessionStorage.__i)return;sessionStorage.__i='1';localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}));localStorage.setItem('rafeeq_onboarded','1')},[d,m]);
  await p.goto(BASE+'/index.html');await p.waitForTimeout(1500);const tag=`${d}/${m}/${w}`;
  await p.evaluate(()=>{window.__rafeeq.show('pray');});await p.waitForTimeout(600);
  await p.evaluate(()=>window.__rafeeq.act('hour',{dataset:{key:'bakr'}}));await p.waitForTimeout(1800);
  await p.evaluate(()=>{const c=[...document.querySelectorAll('#openingArea .opening-chip')].find(x=>/الخمسون/.test(x.textContent));c&&c.click()});await p.waitForTimeout(500);
  await p.evaluate(()=>document.querySelectorAll('#openingArea details').forEach(x=>x.open=true));await p.waitForTimeout(400);
  const r=await p.evaluate(EXP=>{const body=document.body.innerText;const norm=s=>s.replace(/\s+/g,' ').trim();const nb=norm(body);
   const found=EXP.filter(l=>nb.includes(norm(l))).length;
   const el=[...document.querySelectorAll('p,div,span')].find(x=>x.children.length===0&&norm(x.textContent)===norm(EXP[0]));
   function bgOf(e){const L=[];for(let x=e;x;x=x.parentElement){const c=getComputedStyle(x).backgroundColor,mm=c.match(/[\d.]+/g);if(mm&&(mm[3]===undefined||+mm[3]>0)){L.push(mm.map(Number));if(mm[3]===undefined||+mm[3]===1)break}}let base=[255,255,255];if(!L.length||(L[L.length-1].length===4&&L[L.length-1][3]<1)){const s=getComputedStyle(document.body).backgroundColor.match(/[\d.]+/g);if(s)base=s.slice(0,3).map(Number)}L.reverse().forEach(l=>{const a=l.length===4?l[3]:1;base=[0,1,2].map(i=>base[i]*(1-a)+l[i]*a)});return base}
   const old=/تَمحُ مَأثَمَتي|مأثمتي/.test(body);
   const stz=[...document.querySelectorAll('#openingArea .scripture .stz')],ps=stz.map(z=>z.querySelectorAll('p').length),tops=stz.map(z=>z.getBoundingClientRect().top),pl=stz[0]?[...stz[0].querySelectorAll('p')].map(p=>p.getBoundingClientRect()):[],gapIn=pl.length>1?pl[1].top-pl[0].bottom:null,last=pl.length?pl[pl.length-1].bottom:0,gapBetween=stz[1]?stz[1].getBoundingClientRect().top-last:null,lh=pl.map(r=>r.height),fs=pl.length?parseFloat(getComputedStyle(stz[0].querySelector('p')).lineHeight):0,maxLines=pl.length&&fs?Math.max(...document.querySelectorAll('#openingArea .scripture .stz p').length?[...document.querySelectorAll('#openingArea .scripture .stz p')].map(p=>Math.round(p.getBoundingClientRect().height/fs)):[0]):0,order=[...document.querySelectorAll('#openingArea .scripture p')].map(p=>p.textContent.trim());
   return {stz:ps,gapIn,gapBetween,maxLines,order,found,total:EXP.length,old,fg:el?getComputedStyle(el).color.match(/[\d.]+/g).slice(0,3).map(Number):null,bg:el?bgOf(el):null,ov:document.documentElement.scrollWidth>innerWidth+1,found0:!!el}},EXP);
  say(r.found===r.total,`${tag} سطور المزمور الظاهرة ${r.found}/${r.total}`);
  say(!r.old,`${tag} لا بقايا من النص القديم`);
  say(JSON.stringify(r.stz)==='[8,6,5]',`${tag} المقاطع الثلاثة (١–٨ · ٩–١٤ · ١٥–١٩) ${JSON.stringify(r.stz)}`);
  say(r.order.length===19&&r.order.every((l,i)=>l.replace(/\s+/g,' ')===EXP[i].replace(/\s+/g,' ')),`${tag} ١٩ سطرًا بترتيبها (آية لكل سطر) ${r.order.length}`);
  say(r.gapBetween!=null&&r.gapIn!=null&&r.gapBetween>r.gapIn+8,`${tag} فاصل المقاطع (${r.gapBetween&&r.gapBetween.toFixed(1)}) أكبر من تقارب السطور (${r.gapIn&&r.gapIn.toFixed(1)})`);
  say(r.maxLines<=(w===768?3:4),`${tag} أطول سطر ${r.maxLines} أسطر مرئية`);
  if(r.fg)say(cr(r.fg,r.bg)>=4.5,`${tag} تباين نص المزمور ${cr(r.fg,r.bg).toFixed(2)}`);
  say(!r.ov,`${tag} بلا تمرير أفقي`);say(!errs.length,`${tag} أخطاء ${errs.join('|')}`);
  if(SHOTS&&w===390){await p.evaluate(()=>{const n=document.body.innerText;const e=document.getElementById('openingArea');e&&e.scrollIntoView({block:'start'})});await p.waitForTimeout(300);await p.screenshot({path:`tools/qa/reports/ps50/${d}-${m}.png`})}
  await p.close();
}
await b.close();if(srv)srv.close();console.log(fail?`FAIL ${fail}`:'PASS');process.exit(fail?1:0);
