// فحص «الكتاب المقدس الدراسي» في كل تصميم/وضع: لا أخطاء JS، كل قسم يُرسم، وكل حدث يرسم عمودًا لكل مرجع مجموعة، وكل مجموعة آيات تُرسم بكل عناصرها،
// والتظليل (للأقسام المتوازية النصية) والتنقّل والبحث والملاحظة وختم «قرأتُ» في حياة المسيح تعمل، والأطلس يشارك الشريط، وصفر تصحيحات تباين على عناصره.
// node tools/qa/study.mjs [design,design] [dark|light]
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
  await p.addInitScript(([d,m])=>{localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}));localStorage.removeItem('rafeeq_study_v1')},[d,m]);
  await p.goto(BASE+'/index.html');await p.waitForTimeout(1600);
  const st=await p.evaluate(async()=>{
    const w=ms=>new Promise(r=>setTimeout(r,ms)),q=s=>document.querySelectorAll(s).length,o={},fails=[];
    const secs=window.__study.sections;
    const ready=async()=>{for(let t=0;t<60&&(q('#studyPg .gs-hint')||!q('#studyPg .gs-t'));t++)await w(50)};
    for(const s of secs){
      __studyUI.open(s.id);await w(60);
      const want=s.kind==='parallel'?s.events.length:s.kind==='collection'?s.collections.length:s.order.length;
      if(q('#studyPg .gs-row')!==want)fails.push('list:'+s.id);
      if(s.kind==='parallel')for(const e of s.events){
        __studyUI.open(s.id,e.id);await ready();
        const n=e.cols.length;
        if(q('#studyPg .gs-card')!==n||q('#studyPg .gs-card .gs-t')!==n+q('#studyPg .gs-card .gs-sep2')||!q('#studyPg .gs-card sup'))fails.push(s.id+'/'+e.id);
      }
      if(s.kind==='collection')for(const c of s.collections){
        __studyUI.open(s.id,c.id);await ready();
        if(q('#studyPg .gs-card')!==c.items.length||!q('#studyPg .gs-card sup'))fails.push(s.id+'/'+c.id);
      }
    }
    o.cards=fails.join(',');
    __studyUI.open('gospels','transfiguration');await ready();
    o.mark=q('#studyPg mark.gs-u')>0;
    document.querySelector('[data-gsd]').click();await w(60);o.markOff=q('#studyPg mark.gs-u')===0;
    document.querySelector('[data-gsg="mk"]').click();await w(60);o.toggle=q('#studyPg .gs-card')===2;
    const ta=document.getElementById('gsMe');ta.value='تجربة';ta.dispatchEvent(new Event('input',{bubbles:true}));
    o.note=(JSON.parse(localStorage.getItem('rafeeq_study_v1')||'{}').notes||{})['gospels/transfiguration']==='تجربة';
    document.querySelector('.gs-nav button:last-child').click();await w(120);o.nav=!!q('#studyPg .gs-card');
    document.querySelector('[data-gsx="1"]').click();await w(60);o.back=q('#studyPg .gs-row')>0;
    const sq=document.getElementById('gsQ');sq.value='العشاء';sq.dispatchEvent(new Event('input',{bubbles:true}));o.search=q('#studyPg .gs-row')>=1&&q('#studyPg .gs-row')<5;
    // حياة المسيح: ختم «قرأتُ» والتقدّم
    __studyUI.open('life','birth');await ready();
    document.querySelector('[data-gsl]').click();await w(60);
    const lf=()=>JSON.parse(localStorage.getItem('rafeeq_study_v1')||'{}').life||{};
    o.lifeOn=!!lf().birth;
    document.querySelector('[data-gsx="1"]').click();await w(60);
    o.lifeProg=/١ من ٥٧/.test(document.querySelector('#studyPg .gs-prog b').textContent)&&q('#studyPg .gs-row.done')===1;
    __studyUI.open('life','birth');await ready();document.querySelector('[data-gsl]').click();await w(60);o.lifeOff=!lf().birth;
    // الأطلس يشارك الشريط والتنقّل منه وإليه
    __atlasUI.open('people');await w(120);o.atlasBar=q('#atlasPg .gs-tab')===9&&q('#atlasPg .gs-tab.on')===1;
    document.querySelector('#atlasPg [data-stb="kings"]').click();await w(150);o.toStudy=document.getElementById('studyPg').classList.contains('on')&&!document.getElementById('atlasPg').classList.contains('on');
    document.querySelector('#studyPg [data-stb="maps"]').click();await w(250);o.toAtlas=document.getElementById('atlasPg').classList.contains('on')&&!document.getElementById('studyPg').classList.contains('on')&&q('#atlasPg [data-atm]')>0;
    await w(300);
    const L=window.__rfFixLog||{};o.fix=Object.keys(L).filter(k=>/(^|[ .#>])gs-|studyPg/.test(k));return o});
  const fails=Object.entries(st).filter(([k,v])=>k!=='fix'&&k!=='cards'&&!v).map(([k])=>k).concat(st.cards?['cards:'+st.cards]:[]);
  const ok=!errs.length&&!fails.length&&!st.fix.length;if(!ok)bad++;
  console.log(`${ok?'ok  ':'FAIL'} ${d}/${m} errors:${errs.length}${errs.length?' '+errs[0].slice(0,120):''} failed:[${fails}] fixed:${st.fix.length}${st.fix.length?' '+st.fix.join(' | '):''}`);
  await p.close();
}
await b.close();if(srv)srv.close();process.exit(bad?1:0);
