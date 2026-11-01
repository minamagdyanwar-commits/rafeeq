// فحص «أطلس الكتاب» في كل تصميم/وضع: لا أخطاء JS، كل التبويبات والخرائط تُرسم، وعدد تصحيحات مُصلح التباين لعناصر الأطلس (الهدف: صفر).
// node tools/qa/atlas.mjs [design,design] [dark|light]
const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium }=await import(PW);
import {serve} from './serve.mjs';
const PORT=+process.env.PORT||8777;const srv=process.env.BASE?null:await serve(PORT);const BASE=process.env.BASE||`http://localhost:${PORT}`;
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium'});
const DES=['bearer','church','classic','cross','crown','glory','holy','lamp','qalaya','royal','shroud'];
const des=process.argv[2]?process.argv[2].split(','):DES,modes=process.argv[3]?[process.argv[3]]:['dark','light'];
let bad=0;
for(const d of des)for(const m of modes){
  const p=await b.newPage({viewport:{width:390,height:844}});
  const errs=[];p.on('pageerror',e=>errs.push(String(e)));
  await p.addInitScript(([d,m])=>{localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}))},[d,m]);
  await p.goto(BASE+'/index.html');await p.waitForTimeout(1600);
  const maps=await p.evaluate(()=>window.__atlas.maps.map(x=>x.id)),ppl=await p.evaluate(()=>window.__atlas.people.map(x=>x.id));
  const st=await p.evaluate(async([maps,ppl])=>{
    const w=ms=>new Promise(r=>setTimeout(r,ms)),q=s=>document.querySelectorAll(s).length,o={};
    for(const t of ['people','lines','maps']){__atlasUI.open(t);await w(60);o[t]=q('#atlasPg .pd-c *')}
    for(const id of ppl.filter((_,i)=>i%9===0)){__atlasUI.open('p',id);await w(30);if(!q('#atlasPg .pd-v'))o['p:'+id]=0}
    for(const id of maps){__atlasUI.open('m',id);await w(60);o['m:'+id]=q('#atlasPg svg .at-pin');if(!o['m:'+id])o['m:'+id]=0}
    await w(300);
    const L=window.__rfFixLog||{};o.fix=Object.keys(L).filter(k=>/at-|atlasPg/.test(k));return o},[maps,ppl]);
  const zero=Object.entries(st).filter(([k,v])=>k!=='fix'&&!v).map(([k])=>k);
  const ok=!errs.length&&!zero.length&&!st.fix.length;if(!ok)bad++;
  console.log(`${ok?'ok  ':'FAIL'} ${d}/${m} errors:${errs.length} empty:[${zero}] fixed:${st.fix.length}${st.fix.length?' '+st.fix.join(' | '):''}`);
  await p.close();
}
await b.close();if(srv)srv.close();process.exit(bad?1:0);
