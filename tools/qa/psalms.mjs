// كل مزامير الأجبية (١٣٦ + الخمسون): سلامة النص بعد إعادة التقسيم (بيانات) + العرض على كل التصميمات × الوضعين (متصفح)
// node tools/qa/psalms.mjs [تصاميم] [dark|light] [--data] (--data: فحص البيانات فقط بلا متصفح)
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('../../src/app5.js',import.meta.url),'utf8');
const base=JSON.parse(readFileSync(new URL('./psalms-baseline.json',import.meta.url),'utf8'));
let fail=0;const say=(ok,m)=>{if(!ok){fail++;console.log('FAIL '+m)}else if(process.env.V)console.log('ok   '+m)};
const strip=t=>t.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
/* ١) البيانات */
const pat=/title: "(المزمور[^"]*)",\s*(?:subtitle: "[^"]*",\s*)?ref: "([^"]*)",\s*text: \[(.*?)\n\s*\],(?:\s*(flow: true),)?/gs;
let n=0,lines=0;
for(const m of src.matchAll(pat)){
  const title=m[1],ref=m[2],body=m[3],fl=m[4];
  const ls=[...body.matchAll(/^\s*("(?:[^"\\]|\\.)*"),?\s*$/gm)].map(x=>JSON.parse(x[1]));
  n++;lines+=ls.length;
  say(fl!=null,`${title}: flow:true (نص متصل بلا مقاطع)`);
  if(/الخمسون/.test(title)){say(ls.length===19,`${title}: ١٩ سطرًا في الداتا`);continue}
  const key=title+'|'+ref,joined=ls.map(strip).join(' ');
  say(base[key]!==undefined,`${title}: له أصل في الـbaseline`);
  say(base[key]!==undefined&&joined.replace(/\s+/g,' ')===base[key].replace(/\s+/g,' ').trim(),`${title} (${ref}): النص كما هو`);
}
console.log(`بيانات: ${n} مزمورًا · ${lines} سطرًا في الداتا (تُعرض متصلة)`);
if(process.argv.includes('--data')){console.log(fail?`FAIL ${fail}`:'PASS (بيانات)');process.exit(fail?1:0)}
/* ٢) العرض */
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
const HOURS=['bakr','thalitha','sadisa','tasi3a','ghouroub','noum','nos_layl_1','nos_layl_2','nos_layl_3','setar'];
const lum=c=>{const f=x=>{x/=255;return x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])};
const cr=(a,c)=>{const x=lum(a),y=lum(c);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
for(const d of DES)for(const m of MODES)for(const w of [390,768]){
  const p=await b.newPage({viewport:{width:w,height:w===768?1024:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,90)));
  await p.addInitScript(fp=>{if(fp)localStorage.setItem('rafeeq_fontpct',fp)},process.env.FP||'');
  await p.addInitScript(([d,m])=>{if(sessionStorage.__i)return;sessionStorage.__i='1';localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}));localStorage.setItem('rafeeq_onboarded','1')},[d,m]);
  await p.goto(BASE+'/index.html');await p.waitForTimeout(1200);const tag=`${d}/${m}/${w}`;
  await p.evaluate(()=>{window.__rafeeq.show('pray');});await p.waitForTimeout(400);
  let total=0,bad=[];
  for(const hk of HOURS){
    await p.evaluate(k=>window.__rafeeq.act('hour',{dataset:{key:k}}),hk);await p.waitForTimeout(500);
    await p.evaluate(()=>{const b=[...document.querySelectorAll('.parts-row .part-btn')].find(x=>x.textContent.trim()==='المزمور');b&&b.click()});await p.waitForTimeout(400);
    const nchips=await p.evaluate(()=>document.querySelectorAll('.sub-chip').length);
    const lim=w===768?Math.min(nchips,4):nchips;
    for(let i=0;i<lim;i++){
      await p.evaluate(i=>{const c=document.querySelectorAll('.sub-chip')[i];c&&c.click()},i);await p.waitForTimeout(120);
      const r=await p.evaluate(()=>{const cards=[...document.querySelectorAll('.content-card')];const c=cards.find(x=>x.querySelector('p.flow'))||cards[cards.length-1];
        if(!c)return null;const sc=c.querySelector('.scripture');if(!sc)return null;
        const ps=[...sc.querySelectorAll('p')],stz=[...sc.querySelectorAll('.stz')],flow=[...sc.querySelectorAll('p.flow')],end=[...sc.querySelectorAll('p.flow-end')];
        function bgOf(el){const L=[];for(let x=el;x;x=x.parentElement){const cc=getComputedStyle(x).backgroundColor,mm=cc.match(/[\d.]+/g);if(mm&&(mm[3]===undefined||+mm[3]>0)){L.push(mm.map(Number));if(mm[3]===undefined||+mm[3]===1)break}}let base=[255,255,255];if(!L.length||(L[L.length-1].length===4&&L[L.length-1][3]<1)){const s=getComputedStyle(document.body).backgroundColor.match(/[\d.]+/g);if(s)base=s.slice(0,3).map(Number)}L.reverse().forEach(l=>{const a=l.length===4?l[3]:1;base=[0,1,2].map(i=>base[i]*(1-a)+l[i]*a)});return base}
        const fg=getComputedStyle(ps[0]).color.match(/[\d.]+/g).slice(0,3).map(Number);
        const r0=ps[0].getBoundingClientRect(),r1=ps[1]&&ps[1].getBoundingClientRect();
        return {title:(c.querySelector('h2')||{}).textContent,np:ps.length,nstz:stz.length,nflow:flow.length,nend:end.length,endtxt:end.map(e=>e.textContent.trim()).join('|'),fg,bg:bgOf(ps[0]),ov:document.documentElement.scrollWidth>innerWidth+1,gap:r1?r1.top-r0.bottom:null,tall:Math.max(...ps.map(p=>p.getBoundingClientRect().height))/parseFloat(getComputedStyle(ps[0]).lineHeight)}});
      if(r&&!/^المزمور/.test((r.title||'').trim()))continue;   /* تسابيح/صلوات أخرى في نفس الشريط ليست مزامير */
      total++;
      if(!r){bad.push(`${hk}#${i}: لا بطاقة`);continue}
      if(r.nflow!==1||r.nstz!==0||r.np>2)bad.push(`${hk}#${i} ${r.title}: ليس فقرة واحدة متصلة (flow=${r.nflow} stz=${r.nstz} p=${r.np})`);
      if(r.nend>1||(r.nend===1&&!/هلليلويا|هللويا|هَلِّلُويَا/.test(r.endtxt)))bad.push(`${hk}#${i} ${r.title}: السطر الختامي غير هلليلويا «${r.endtxt}»`);
      if(cr(r.fg,r.bg)<4.5)bad.push(`${hk}#${i} ${r.title}: تباين ${cr(r.fg,r.bg).toFixed(2)}`);
      if(r.ov)bad.push(`${hk}#${i} ${r.title}: تمرير أفقي`);
    }
  }
  say(!bad.length&&total>=(w===768?30:100),`${tag} ${total} مزمورًا معروضًا ${bad.slice(0,6).join(' | ')}`);
  say(!errs.length,`${tag} أخطاء ${errs.join('|')}`);await p.close();
}
await b.close();if(srv)srv.close();console.log(fail?`FAIL ${fail}`:'PASS');process.exit(fail?1:0);
