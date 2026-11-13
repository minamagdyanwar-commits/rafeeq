// فحص خطة قراءة الكتاب داخل «يومي» و«المتابعة» وزر «علّم الأيام السابقة كمقروءة».
// node tools/qa/bplan.mjs [design,design]
const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium }=await import(PW);
import {serve} from './serve.mjs';
const PORT=+process.env.PORT||8777;const srv=process.env.BASE?null:await serve(PORT);const BASE=process.env.BASE||`http://localhost:${PORT}`;
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium'});
const DES=['church','crown','classic','bearer'];
const des=process.argv[2]?process.argv[2].split(','):DES;let bad=0;const fail=m=>{bad++;console.log('  ✗',m)};
for(const d of des){
  console.log(d);
  const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
  await p.addInitScript(d=>{if(sessionStorage.__i)return;sessionStorage.__i='1';localStorage.setItem('rafeeq_v76_design',d)},d);
  await p.goto(BASE+'/index.html');await p.waitForTimeout(1500);
  /* خطة بدأت من ١٠ أيام */
  const info=await p.evaluate(async()=>{
    const F=__F;await F.bible.load();
    const st=F.dkey(F.addDays(F.parseKey(F.dkey()),-10));
    const pr=F.prefs();pr.plan={scope:'gospels',days:30,start:st,name:'اختبار',from:0};F.savePrefs(pr);
    const dp=F.dayPlan(F.dkey());const it=dp.items.find(x=>x.type==='bplan');
    return {item:it?{label:it.label,done:it.done}:null,start:st};
  });
  if(!info.item||info.item.done||!/١١/.test(info.item.label))fail('bplan item in dayPlan '+JSON.stringify(info.item));
  /* افتح تبويب الخطة واضغط الزر */
  await p.evaluate(()=>{__F.closeSheet();__rafeeq.act('plan')});await p.waitForTimeout(900);
  if(!await p.$('[data-tback]'))fail('backfill button missing');
  else{
    await p.click('[data-tback]');await p.waitForTimeout(400);
    const v=await p.evaluate(()=>{const i=document.getElementById('tbackN');return i?+i.value:null});
    if(v!==10)fail('default N '+v);
    await p.click('[data-tbackgo]');await p.waitForTimeout(700);
    const r=await p.evaluate(()=>{const F=__F,st=F.parseKey(F.dkey(F.addDays(F.parseKey(F.dkey()),-10))),out=[];for(let d=0;d<=10;d++)out.push(!!F.day(F.dkey(F.addDays(st,d))).bp);return out});
    // الأيام ١-١٠ (d=0..9) مكتملة، واليوم الحالي (d=10) لا
    if(!r.slice(0,10).every(Boolean)||r[10])fail('bp flags '+JSON.stringify(r));
    const txt=await p.evaluate(()=>document.getElementById('trkBody').innerText);
    if(!/ملتزم بالخطة/.test(txt))fail('plan tab does not show caught-up');
    /* المتابعة: صف الخطة */
    await p.evaluate(()=>__F.setTrkTab('sects'));await p.waitForTimeout(700);
    const dash=await p.evaluate(()=>document.getElementById('trkBody').innerText);
    if(!/خطة قراءة الكتاب/.test(dash))fail('dashboard row missing');
    /* إلغاء قراءة إصحاح من اليوم الثالث يلغي علامته */
    const un=await p.evaluate(()=>{const F=__F,plan=F.prefs().plan;const all=[];F.bible.data.forEach((bk,i)=>{if(['متى','مرقس','لوقا','يوحنا'].includes(bk.n))for(let c=1;c<=bk.c.length;c++)all.push([i,c])});
      const n=all.length,a=Math.floor((3-1)*n/plan.days);const c=all[a];F.bible.setRead(c[0],c[1],false);
      const date=F.dkey(F.addDays(F.parseKey(plan.start),2));return !!F.day(date).bp});
    if(un)fail('unread chapter did not clear flag');
    /* إخفاء الخطوة من «يومي» */
    const hid=await p.evaluate(()=>{const o=__F.dayOrder();o.x.push('bplan');__F.saveDayOrder(o);const r=__F.dayPlan(__F.dkey()).items.some(x=>x.type==='bplan');o.x=o.x.filter(k=>k!=='bplan');__F.saveDayOrder(o);return r});
    if(hid)fail('hidden step still shown');
  }
  /* جدول «استرجاع سجل الأيام»: عمود «خطة الكتاب» وتعليم العمود كله */
  {
    const q=await b.newPage({viewport:{width:390,height:900}});const e2=[];q.on('pageerror',e=>e2.push(String(e)));
    await q.addInitScript(d=>{if(sessionStorage.__i)return;sessionStorage.__i='1';localStorage.setItem('rafeeq_v76_design',d)},d);
    await q.goto(BASE+'/index.html');await q.waitForTimeout(1500);
    await q.evaluate(async()=>{const F=__F;await F.bible.load();F.closeSheet();const st=F.dkey(F.addDays(F.parseKey(F.dkey()),-10));const pr=F.prefs();pr.plan={scope:'gospels',days:30,start:st,name:'اختبار',from:0};F.savePrefs(pr);__rafeeq.show&&__rafeeq.show('trk');F.setTrkTab('track')});
    await q.waitForTimeout(800);
    await q.evaluate(()=>{const b=document.querySelector('[data-v70="backfill"]');b&&b.click()});await q.waitForTimeout(500);
    if(!await q.$('[data-v70="bfc:bp"]'))fail('grid column bp missing');
    else{
      await q.click('[data-v70="bfplan"]').catch(()=>fail('from-plan-start button missing'));await q.waitForTimeout(300);
      await q.click('[data-v70="bfc:bp"]');await q.waitForTimeout(1500);
      const r=await q.evaluate(()=>{const F=__F,st=F.parseKey(F.dkey(F.addDays(F.parseKey(F.dkey()),-10))),o=[];for(let d=0;d<=10;d++)o.push(!!F.day(F.dkey(F.addDays(st,d))).bp);return o});
      if(!r.every(Boolean))fail('grid column did not mark plan days '+JSON.stringify(r));
      await q.evaluate(()=>{__F.closeSheet();__F.setTrkTab('track')});await q.waitForTimeout(500);
      const chip=await q.evaluate(()=>{const c=document.querySelector('[data-tdo="bplan"]');return c?c.className:null});
      if(!chip||!/on/.test(chip))fail('track chip not on: '+chip);
    }
    if(e2.length)fail('errs(grid) '+e2[0]);await q.close();
  }
  if(errs.length)fail('errs '+errs[0]);await p.close();
}
await b.close();srv&&srv.close&&srv.close();console.log(bad?`FAIL ${bad}`:'PASS');process.exit(bad?1:0);
