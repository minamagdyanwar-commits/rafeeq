// فحص «الحدث في أكثر من إنجيل» في كل تصميم/وضع: لا أخطاء JS، كل حدث يرسم بطاقة لكل إنجيل من أناجيله، التظليل يعمل، والتنقّل والبحث والملاحظة تعمل،
// وعدد تصحيحات مُصلح التباين لعناصره صفر (التباين مضبوط في CSS لا بالإصلاح اللحظي).
// node tools/qa/gospels.mjs [design,design] [dark|light]
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
  await p.addInitScript(([d,m])=>{localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}));localStorage.removeItem('rafeeq_gospels_v1')},[d,m]);
  await p.goto(BASE+'/index.html');await p.waitForTimeout(1600);
  const st=await p.evaluate(async()=>{
    const w=ms=>new Promise(r=>setTimeout(r,ms)),q=s=>document.querySelectorAll(s).length,o={},bad=[];
    const ev=window.__gospels.events;
    __gospelsUI.open();await w(80);o.list=q('#gospelsPg .gs-row')===ev.length;
    for(let i=0;i<ev.length;i++){
      __gospelsUI.open(ev[i].id);
      for(let t=0;t<40&&!q('#gospelsPg .gs-card .gs-t');t++)await w(50);
      const n=Object.keys(ev[i].refs).length;
      if(q('#gospelsPg .gs-card')!==n||q('#gospelsPg .gs-card .gs-t')!==n+q('#gospelsPg .gs-card .gs-sep')||!q('#gospelsPg .gs-card sup'))bad.push(ev[i].id);
    }
    o.cards=bad.length?bad.join(','):'';
    __gospelsUI.open('transfiguration');await w(120);
    o.mark=q('#gospelsPg mark.gs-u')>0;
    document.querySelector('[data-gsd]').click();await w(60);o.markOff=q('#gospelsPg mark.gs-u')===0;
    document.querySelector('[data-gsg="mk"]').click();await w(60);o.toggle=q('#gospelsPg .gs-card')===2;
    const ta=document.getElementById('gsMe');ta.value='تجربة';ta.dispatchEvent(new Event('input',{bubbles:true}));
    o.note=JSON.parse(localStorage.getItem('rafeeq_gospels_v1')||'{}').transfiguration==='تجربة';
    document.querySelector('.gs-nav button:last-child').click();await w(120);o.nav=!!q('#gospelsPg .gs-card');
    document.querySelector('[data-gsx]').click();await w(60);o.back=q('#gospelsPg .gs-row')>0;
    const sq=document.getElementById('gsQ');sq.value='العشاء';sq.dispatchEvent(new Event('input',{bubbles:true}));o.search=q('#gospelsPg .gs-row')>=1&&q('#gospelsPg .gs-row')<5;
    await w(300);
    const L=window.__rfFixLog||{};o.fix=Object.keys(L).filter(k=>/(^|[ .#>])gs-|gospelsPg/.test(k));return o});
  const fails=Object.entries(st).filter(([k,v])=>k!=='fix'&&k!=='cards'&&!v).map(([k])=>k).concat(st.cards?['cards:'+st.cards]:[]);
  const ok=!errs.length&&!fails.length&&!st.fix.length;if(!ok)bad++;
  console.log(`${ok?'ok  ':'FAIL'} ${d}/${m} errors:${errs.length} failed:[${fails}] fixed:${st.fix.length}${st.fix.length?' '+st.fix.join(' | '):''}`);
  await p.close();
}
await b.close();if(srv)srv.close();process.exit(bad?1:0);
