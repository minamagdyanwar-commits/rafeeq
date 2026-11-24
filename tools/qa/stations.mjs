// رحلة «وصايا ووعود الكتاب المقدس» الواحدة (محطات حسب الأسفار ثم الموضوعات) — الهب، فتح الرحلة، المحطة الأولى، التباين، الوضعان — كل التصميمات × ٣٩٠/٣٦٠/٧٦٨
// node tools/qa/stations.mjs [تصاميم] [dark|light] [--shots]
import {mkdirSync} from 'node:fs';
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
const SHOTS=process.argv.includes('--shots');if(SHOTS)mkdirSync('tools/qa/reports/stations',{recursive:true});
let fail=0;const say=(ok,m)=>{if(!ok)fail++;if(!ok||process.env.V)console.log((ok?'ok   ':'FAIL ')+m)};
const lum=c=>{const f=x=>{x/=255;return x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])};
const cr=(a,c)=>{const x=lum(a),y=lum(c);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
for(const d of DES)for(const m of MODES)for(const w of [390,360,768]){
  const p=await b.newPage({viewport:{width:w,height:w===768?1024:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,90)));
  await p.addInitScript(([d,m])=>{if(sessionStorage.__i)return;sessionStorage.__i='1';localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}));localStorage.setItem('rafeeq_onboarded','1')},[d,m]);
  await p.goto(BASE+'/index.html');await p.waitForTimeout(1500);const tag=`${d}/${m}/${w}`;
  /* الهب: رحلة واحدة فقط تحت فئتها (لا رحلات متفرقة) */
  await p.evaluate(()=>__prog.hub('all'));await p.waitForTimeout(600);
  const h=await p.evaluate(()=>{const t=[...document.querySelectorAll('.pg-hubp h3')].map(e=>e.textContent.trim());const cards=[...document.querySelectorAll('.pg-hubp .pg-card')].map(e=>e.getAttribute('data-prog'));return {t,n:cards.filter(x=>x==='bnotes').length,old:cards.filter(x=>/^(bt|bb)_/.test(x)).length,txt:(document.querySelector('.pg-card[data-prog="bnotes"]')||{}).innerText||'',ov:document.documentElement.scrollWidth>innerWidth+1}});
  say(h.t.some(x=>/وصايا ووعود الكتاب المقدس/.test(x)),`${tag} فئة الرحلة في الهب`);
  say(h.n===1&&h.old===0,`${tag} رحلة واحدة فقط (${h.n}) ولا بقايا للرحلات المتفرقة (${h.old})`);say(/محطة/.test(h.txt),`${tag} بطاقة الرحلة تسمّي «محطة» (${h.txt.replace(/\s+/g,' ').slice(0,60)})`);say(!h.ov,`${tag} هب بلا تمرير أفقي`);
  for(const id of ['bnotes']){
    await p.evaluate(i=>{try{__prog.close()}catch(e){};__prog.open(i)},id);await p.waitForTimeout(700);
    const mp=await p.evaluate(()=>({nodes:document.querySelectorAll('.pg-path .nd').length,n:__progData.bnotes.days.length,stages:[...document.querySelectorAll('.pg-path .sg,.pg-path .lb')].map(e=>e.textContent.trim()).join('|'),aria:(document.querySelector('.pg-path .nd')||{}).getAttribute&&document.querySelector('.pg-path .nd').getAttribute('aria-label')}));
    say(mp.nodes===mp.n&&mp.n>=100,`${tag} ${id} خريطة المحطات (${mp.nodes}/${mp.n})`);
    say(/المحطة/.test(mp.aria||''),`${tag} ${id} تسمية العقدة «${mp.aria}»`);say(/الشريعة والتاريخ/.test(mp.stages)&&/الحكمة والأنبياء/.test(mp.stages)&&/العهد الجديد/.test(mp.stages)&&/محطات الموضوعات/.test(mp.stages),`${tag} ${id} مراحل الرحلة الأربع (${mp.stages.slice(0,90)})`);
    await p.evaluate(()=>__prog.day(1));await p.waitForTimeout(700);
    const r=await p.evaluate(()=>{const g=s=>document.querySelector(s),pg=g('#progDay');
     function bgOf(el){const L=[];for(let e=el;e;e=e.parentElement){const c=getComputedStyle(e).backgroundColor,mm=c.match(/[\d.]+/g);if(mm&&(mm[3]===undefined||+mm[3]>0)){L.push(mm.map(Number));if(mm[3]===undefined||+mm[3]===1)break}}let base=[255,255,255];if(!L.length||(L[L.length-1].length===4&&L[L.length-1][3]<1)){const cs=getComputedStyle(document.body).backgroundColor.match(/[\d.]+/g);if(cs)base=cs.slice(0,3).map(Number)}L.reverse().forEach(l=>{const a=l.length===4?l[3]:1;base=[0,1,2].map(i=>base[i]*(1-a)+l[i]*a)});return base}
     const fg=el=>getComputedStyle(el).color.match(/[\d.]+/g).slice(0,3).map(Number);
     const secs=[...document.querySelectorAll('#progDay .pd-r')];const hs=secs.map(s=>s.querySelector('h4').textContent.trim());
     const c=[];secs.forEach(s=>{for(const e of [s.querySelector('h4'),s.querySelector('p')])if(e&&e.textContent.trim())c.push([fg(e),bgOf(e)])});
     const bgL=pg?(()=>{const bb=bgOf(pg);return (0.2126*bb[0]+0.7152*bb[1]+0.0722*bb[2])/255})():null;
     return {on:!!(pg&&pg.classList.contains('on')),hs,txt:secs.map(s=>s.querySelector('p').textContent.length),c,bgL,ov:document.documentElement.scrollWidth>innerWidth+1,hasW:/وصية|وعد/.test(pg?pg.innerText:''),head:(pg&&pg.querySelector('.pd-c small')||{}).textContent||'',ok:(pg&&pg.querySelector('.pd-ok')||{}).textContent||'',runtimeFix:document.querySelectorAll('[data-cfix]').length}});
    say(r.on&&r.hs.length>=3&&r.txt.every(x=>x>20),`${tag} ${id} المحطة الأولى: أقسام ${r.hs.length} ${r.txt}`);
    say(/المحطة ١ من/.test(r.head)&&/محطة/.test(r.ok)&&!/اليوم/.test(r.head),`${tag} ${id} تسمية «المحطة» في العنوان والزر (${r.head} | ${r.ok})`);
    say(r.hasW,`${tag} ${id} يظهر نص الوصية/الوعد`);
    say(r.txt[1]>=60,`${tag} ${id} قسم «لماذا قيل؟» غير فارغ (${r.txt[1]} حرفًا)`);
    say(r.c.every(([f,bg])=>cr(f,bg)>=4.5),`${tag} ${id} تباين الأقسام (أدنى ${Math.min(...r.c.map(([f,bg])=>cr(f,bg))).toFixed(2)})`);
    say(m==='light'?r.bgL>0.6:r.bgL<0.4,`${tag} ${id} يتبع وضع الشاشة (${r.bgL&&r.bgL.toFixed(2)})`);
    say(!r.ov,`${tag} ${id} بلا تمرير أفقي`);
    if(SHOTS&&w===390)await p.screenshot({path:`tools/qa/reports/stations/${d}-${m}-day.png`});
  }
  say(!errs.length,`${tag} أخطاء ${errs.join('|')}`);await p.close();
}
await b.close();if(srv)srv.close();console.log(fail?`FAIL ${fail}`:'PASS');process.exit(fail?1:0);
