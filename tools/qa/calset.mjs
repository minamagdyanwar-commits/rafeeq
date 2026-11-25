// تبويب «ضبط الأصوام» في التقويم: تعديل بداية الصوم يدويًا لسنة محددة + أثره على العدّاد، والتباين، وكل التصميمات × الوضعين × ٣٩٠/٣٦٠/٧٦٨
// node tools/qa/calset.mjs [تصاميم] [dark|light] [--shots]
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
const SHOTS=process.argv.includes('--shots');if(SHOTS)mkdirSync('tools/qa/reports/calset',{recursive:true});
let fail=0;const say=(ok,m)=>{if(!ok)fail++;if(!ok||process.env.V)console.log((ok?'ok   ':'FAIL ')+m)};
const lum=c=>{const f=x=>{x/=255;return x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])};
const cr=(a,c)=>{const x=lum(a),y=lum(c);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
for(const d of DES)for(const m of MODES)for(const w of [390,360,768]){
  const ctx=await b.newContext({viewport:{width:w,height:w===768?1024:844}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,90)));
  await p.clock.install({time:new Date('2026-11-24T10:00:00')});
  await p.addInitScript(fp=>{if(fp)localStorage.setItem('rafeeq_fontpct',fp)},process.env.FP||'');
  await p.addInitScript(([d,m])=>{if(sessionStorage.__i)return;sessionStorage.__i='1';localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}));localStorage.setItem('rafeeq_onboarded','1')},[d,m]);
  await p.goto(BASE+'/index.html');await p.waitForTimeout(1500);const tag=`${d}/${m}/${w}`;
  await p.evaluate(()=>{__rafeeq.show('cal');});await p.waitForTimeout(700);
  await p.evaluate(()=>[...document.querySelectorAll('#calBody .u-tabs button')].find(b=>/ضبط الأصوام/.test(b.textContent))?.click());await p.waitForTimeout(500);
  const r=await p.evaluate(()=>{const rows=[...document.querySelectorAll('#calBody .cal-setrow')],inp=[...document.querySelectorAll('#calBody input[data-cfs]')];
   function bgOf(el){const L=[];for(let e=el;e;e=e.parentElement){const c=getComputedStyle(e).backgroundColor,mm=c.match(/[\d.]+/g);if(mm&&(mm[3]===undefined||+mm[3]>0)){L.push(mm.map(Number));if(mm[3]===undefined||+mm[3]===1)break}}let base=[255,255,255];if(!L.length||(L[L.length-1].length===4&&L[L.length-1][3]<1)){const cs=getComputedStyle(document.body).backgroundColor.match(/[\d.]+/g);if(cs)base=cs.slice(0,3).map(Number)}L.reverse().forEach(l=>{const a=l.length===4?l[3]:1;base=[0,1,2].map(i=>base[i]*(1-a)+l[i]*a)});return base}
   const fg=el=>getComputedStyle(el).color.match(/[\d.]+/g).slice(0,3).map(Number);
   const c=[];rows.forEach(r=>{for(const e of [r.querySelector('b'),r.querySelector('span'),r.querySelector('label'),r.querySelector('input')])if(e)c.push([fg(e),bgOf(e)])});
   const sm=document.querySelector('#calBody .cal-note');if(sm)c.push([fg(sm),bgOf(sm)]);
   const small=inp.map(i=>{const r=i.getBoundingClientRect();return r.height});
   return {n:rows.length,inputs:inp.length,vals:inp.map(i=>i.value),min:Math.min(...c.map(([f,bg])=>{const L=x=>{x/=255;return x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4)};const l=a=>.2126*L(a[0])+.7152*L(a[1])+.0722*L(a[2]);const A=l(f),B=l(bg);return (Math.max(A,B)+.05)/(Math.min(A,B)+.05)})),heights:small,ov:document.documentElement.scrollWidth>innerWidth+1}});
  say(r.n===5&&r.inputs===5,`${tag} خمسة أصوام في الضبط (${r.n}/${r.inputs})`);
  say(r.min>=4.5,`${tag} تباين صفحة الضبط (أدنى ${r.min.toFixed(2)})`);say(r.heights.every(h=>h>=44),`${tag} حقول التاريخ ≥٤٤px (${r.heights})`);say(!r.ov,`${tag} بلا تمرير أفقي`);
  if(SHOTS&&w===390)await p.screenshot({path:`tools/qa/reports/calset/${d}-${m}.png`});
  if(w===390){
   /* تعديل بداية صوم الميلاد ٢٠٢٦ إلى ٢٤ نوفمبر: العدّاد يتحدث، وتظهر «معدَّل» وزر إعادة الضبط، ويُحفظ على الجهاز */
   const idx=r.vals.length?0:-1;
   await p.fill('input[data-cfs="advA"]','2026-11-24');await p.waitForTimeout(500);
   const a=await p.evaluate(()=>({txt:document.querySelector('#calBody').innerText,lab:__copCal.label(new Date(2026,10,24,12)).text,lab2:__copCal.label(new Date(2026,10,25,12)).text,saved:localStorage.getItem('rafeeq_fast_start_v1'),rs:!!document.querySelector('[data-cfr="advA"]')}));
   say(/معدَّل/.test(a.txt)&&a.rs&&/اليوم ١ من ٤٤/.test(a.lab)&&/اليوم ٢ من ٤٤/.test(a.lab2)&&/2026-11-24/.test(a.saved||''),`${tag} تعديل البداية ${JSON.stringify({lab:a.lab,saved:a.saved})}`);
   /* خارج ±١٥ يومًا يُرفض */
   await p.evaluate(()=>{const i=document.querySelector('input[data-cfs="advA"]');i.removeAttribute('min');i.removeAttribute('max');});
   await p.fill('input[data-cfs="advA"]','2026-10-01');await p.waitForTimeout(400);
   const rj=await p.evaluate(()=>({lab:__copCal.label(new Date(2026,9,5,12)).text,saved:localStorage.getItem('rafeeq_fast_start_v1')}));
   say(!/صوم الميلاد/.test(rj.lab)&&!/2026-10-01/.test(rj.saved||''),`${tag} رفض تاريخ بعيد ${JSON.stringify(rj)}`);
   /* إعادة الضبط */
   await p.evaluate(()=>__copCal.setFastOverride(2026,'advA','2026-11-24'));await p.evaluate(()=>{[...document.querySelectorAll('#calBody .u-tabs button')].find(b=>/القادم/.test(b.textContent))?.click();[...document.querySelectorAll('#calBody .u-tabs button')].find(b=>/ضبط الأصوام/.test(b.textContent))?.click()});await p.waitForTimeout(300);
   await p.click('[data-cfr="advA"]');await p.waitForTimeout(400);
   const rs=await p.evaluate(()=>({lab:__copCal.label(new Date(2026,10,24,12)).text,lab2:__copCal.label(new Date(2026,10,25,12)).text,saved:localStorage.getItem('rafeeq_fast_start_v1'),btn:!!document.querySelector('[data-cfr="advA"]')}));
   say(rs.lab===''&&/اليوم ١ من ٤٣/.test(rs.lab2)&&!rs.btn&&!/advA/.test(rs.saved||''),`${tag} إعادة الضبط ${JSON.stringify(rs)}`);
  }
  say(!errs.length,`${tag} أخطاء ${errs.join('|')}`);await ctx.close();
}
await b.close();if(srv)srv.close();console.log(fail?`FAIL ${fail}`:'PASS');process.exit(fail?1:0);
