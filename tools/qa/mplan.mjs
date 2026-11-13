// فحص «خطتي اليومية» (mplan) كخطة كتاب داخل «يومي» والمتابعة. node tools/qa/mplan.mjs [designs] [mode]
const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium }=await import(PW);
import {serve} from './serve.mjs';
const PORT=+process.env.PORT||8777;const srv=process.env.BASE?null:await serve(PORT);const BASE=process.env.BASE||`http://localhost:${PORT}`;
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium'});
const DES=['bearer','church','classic','cross','crown','glory','holy','lamp','qalaya','royal','shroud'];const MODES=process.argv[3]?[process.argv[3]]:['dark','light'];
const des=process.argv[2]?process.argv[2].split(','):DES;let bad=0;const fail=m=>{bad++;console.log('  ✗',m)};
for(const d of des)for(const mode of MODES){
  console.log(d,mode);
  const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
  await p.addInitScript(([d,m])=>{if(sessionStorage.__i)return;sessionStorage.__i='1';localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}))},[d,mode]);
  await p.goto(BASE+'/index.html');await p.waitForTimeout(1500);
  const r=await p.evaluate(async()=>{const F=__F;await F.bible.load();F.closeSheet();const pr=F.prefs();pr.plan=null;
    pr.mplan={tr:{ot:{n:1,pos:0},ps:{n:1,pos:0},nt:{n:1,pos:0}},dc:true,log:{},start:F.dkey(F.addDays(F.parseKey(F.dkey()),-3))};F.savePrefs(pr);
    const it=F.dayPlan(F.dkey()).items.find(x=>x.type==='bplan');return it?{l:it.label,d:it.done}:null});
  if(!r||r.d||!/٤/.test(r.l))fail('item '+JSON.stringify(r));
  await p.reload();await p.waitForTimeout(1500);
  await p.evaluate(()=>{__F.setTrkTab&&(__rafeeq.show&&__rafeeq.show('trk'),__F.setTrkTab('sects'))});await p.waitForTimeout(700);
  if(!/خطة قراءة الكتاب/.test(await p.evaluate(()=>document.getElementById('trkBody').innerText)))fail('tracker row');
  await p.evaluate(()=>{__F.setTrkTab('track')});await p.waitForTimeout(600);
  if(!await p.$('[data-tdo="bplan"]'))fail('track chip');
  if(errs.length)fail('errs '+errs[0]);await p.close();
}
await b.close();srv&&srv.close&&srv.close();console.log(bad?`FAIL ${bad}`:'PASS');process.exit(bad?1:0);
