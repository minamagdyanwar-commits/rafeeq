// يطبع العناصر التي يصلحها مُصلح التباين وقت التشغيل (app39) لكل تصميم/وضع — هذه هي «ديون» الألوان التي يجب أن تُحلّ في CSS.
// node tools/qa/fixlog.mjs [design,design] [dark|light]
const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium }=await import(PW);
import {serve} from './serve.mjs';
const PORT=+process.env.PORT||8777;const srv=process.env.BASE?null:await serve(PORT);const BASE=process.env.BASE||`http://localhost:${PORT}`;
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium'});
const DES=['bearer','church','classic','cross','crown','glory','holy','lamp','qalaya','royal','shroud'];
const des=process.argv[2]?process.argv[2].split(','):DES,modes=process.argv[3]?[process.argv[3]]:['dark','light'];
const tot={};
for(const d of des)for(const m of modes){
  const p=await b.newPage({viewport:{width:390,height:844}});
  await p.addInitScript(([d,m])=>{localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}))},[d,m]);
  await p.goto(BASE+'/index.html');await p.waitForTimeout(1500);
  for(const g of ['pray','read','msg','exam','fat']){await p.evaluate(g=>{const e=document.querySelector('#uNav [data-go="'+g+'"]');e&&e.click()},g);await p.waitForTimeout(1300)}
  await p.evaluate(()=>__prog.hub('all'));await p.waitForTimeout(1800);
  const L=await p.evaluate(()=>window.__rfFixLog||{});
  const n=Object.keys(L).length;console.log(`${d}/${m}: ${n} selectors`);
  Object.keys(L).forEach(k=>tot[k]=(tot[k]||0)+1);await p.close();
}
console.log('--- selectors fixed in most design/mode combos ---');
Object.entries(tot).sort((a,b)=>b[1]-a[1]).slice(0,25).forEach(([k,v])=>console.log(String(v).padStart(3),k));
await b.close();if(srv)srv.close();
