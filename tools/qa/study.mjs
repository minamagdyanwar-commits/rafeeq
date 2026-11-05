// فحص «الكتاب المقدس الدراسي» (تبويب داخل صفحة الكتاب) في كل تصميم/وضع: لا أخطاء JS، كل قسم يُرسم، وكل حدث يرسم عمودًا لكل مرجع مجموعة، وكل مجموعة آيات تُرسم بكل عناصرها،
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
    const ready=async()=>{for(let t=0;t<60&&(q('#trkBody .st .u-note')&&!q('#trkBody .st .gs-t')||!q('#trkBody .st .gs-t'));t++)await w(50)};
    for(const s of secs){
      __studyUI.open(s.id);await w(60);
      const want=s.kind==='parallel'?s.events.length:s.kind==='collection'?s.collections.length:s.order.length;
      if(q('#trkBody .st .st-row')!==want)fails.push('list:'+s.id);
      if(s.kind==='parallel')for(const e of s.events){
        __studyUI.open(s.id,e.id);await ready();
        const n=e.cols.length;
        if(q('#trkBody .st .st-col')!==n||q('#trkBody .st .st-col .gs-t')!==n+q('#trkBody .st .st-col .gs-sep2')||!q('#trkBody .st .st-col sup'))fails.push(s.id+'/'+e.id);
      }
      if(s.kind==='collection')for(const c of s.collections){
        __studyUI.open(s.id,c.id);await ready();
        if(q('#trkBody .st .st-col')!==c.items.length||!q('#trkBody .st .st-col sup'))fails.push(s.id+'/'+c.id);
      }
    }
    o.cards=fails.join(',');
    __studyUI.open('gospels','transfiguration');await ready();
    o.mark=q('#trkBody .st mark.gs-u')>0;
    document.querySelector('[data-gsd]').click();await w(60);o.markOff=q('#trkBody .st mark.gs-u')===0;
    document.querySelector('[data-gsg="mk"]').click();await w(60);o.toggle=q('#trkBody .st .st-col')===2;
    const ta=document.getElementById('gsMe');ta.value='تجربة';ta.dispatchEvent(new Event('input',{bubbles:true}));
    o.note=(JSON.parse(localStorage.getItem('rafeeq_study_v1')||'{}').notes||{})['gospels/transfiguration']==='تجربة';
    document.querySelector('.st-nav .chip:last-child').click();await w(120);o.nav=!!q('#trkBody .st .st-col');
    document.querySelector('[data-gsx="1"]').click();await w(60);o.back=q('#trkBody .st .st-row')>0;
    const sq=document.getElementById('gsQ');sq.value='العشاء';sq.dispatchEvent(new Event('input',{bubbles:true}));o.search=q('#trkBody .st .st-row')>=1&&q('#trkBody .st .st-row')<5;
    // حياة المسيح: ختم «قرأتُ» والتقدّم
    __studyUI.open('life','birth');await ready();
    document.querySelector('[data-gsl]').click();await w(60);
    const lf=()=>JSON.parse(localStorage.getItem('rafeeq_study_v1')||'{}').life||{};
    o.lifeOn=!!lf().birth;
    document.querySelector('[data-gsx="1"]').click();await w(60);
    o.lifeProg=/١ من ٥٧/.test([...document.querySelectorAll('#trkBody .st .u-h3')].map(x=>x.textContent).join('|'))&&q('#trkBody .st .st-row.done')===1;
    __studyUI.open('life','birth');await ready();document.querySelector('[data-gsl]').click();await w(60);o.lifeOff=!lf().birth;
    // الأطلس يُرسم داخل التبويب نفسه، والتنقّل بين الدراسة والأطلس بالشريط نفسه
    __atlasUI.open('people');await w(250);o.atlasIn=q('#trkBody .st #stAtlas .h-row')>0&&q('#trkBody .st [data-stb].on')===1;
    document.querySelector('#trkBody [data-stb="kings"]').click();await w(200);o.toStudy=!q('#stAtlas')&&q('#trkBody .st .st-row')===window.__study.sections.find(x=>x.id==='kings').events.length;
    document.querySelector('#trkBody [data-stb="maps"]').click();await w(300);o.toAtlas=q('#stAtlas [data-atm]')>0;
    document.querySelector('#stAtlas [data-atm]').click();await w(500);o.mapView=q('#stAtlas svg .at-pin')>0&&q('#stAtlas [data-atx]')===1;
    document.querySelector('#stAtlas [data-atx]').click();await w(200);o.mapBack=q('#stAtlas [data-atm]')>0;
    o.tabBar=document.querySelector('#trkTabs [data-ttab="study"]').classList.contains('on')&&document.getElementById('page-trk').classList.contains('on');
    await w(300);
    const L=window.__rfFixLog||{};o.fix=Object.keys(L).filter(k=>/(^|[ .#>])(gs|st|at)-|stAtlas|trkBody/.test(k));return o});
  const fails=Object.entries(st).filter(([k,v])=>k!=='fix'&&k!=='cards'&&!v).map(([k])=>k).concat(st.cards?['cards:'+st.cards]:[]);
  const ok=!errs.length&&!fails.length&&!st.fix.length;if(!ok)bad++;
  console.log(`${ok?'ok  ':'FAIL'} ${d}/${m} errors:${errs.length}${errs.length?' '+errs[0].slice(0,120):''} failed:[${fails}] fixed:${st.fix.length}${st.fix.length?' '+st.fix.join(' | '):''}`);
  await p.close();
}
await b.close();if(srv)srv.close();process.exit(bad?1:0);
