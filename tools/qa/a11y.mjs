// إتاحة صفحة يوم الرحلة (ورقة الكتاب): node tools/qa/a11y.mjs [تصاميم] [dark|light]
// التركيز يدخل الرحلة ويُحبس فيها، Esc يرجع، حقل الإجابة له اسم، الروابط ≥٤٤، أسهم ← → تقلّب الصفحات، تظليل بلا لمس (تحديد ثم زر «تظليل» ثم شريط بالتركيز)، ونافذة حفظ الجملة بتركيز داخلها وحبس Tab وEsc
const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium }=await import(PW);
import {serve} from './serve.mjs';
const PORT=+process.env.PORT||8777,BASE=process.env.BASE||`http://localhost:${PORT}`;
const srv=process.env.BASE?null:await serve(PORT);
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium'});
const ALL=['bearer','church','classic','cross','crown','glory','holy','lamp','qalaya','royal','shroud'];
const DES=(process.argv[2]&&!['dark','light'].includes(process.argv[2])?process.argv[2].split(','):ALL);
const MODES=process.argv.includes('dark')?['dark']:process.argv.includes('light')?['light']:['dark','light'];
let fail=0;const say=(ok,m)=>{if(!ok)fail++;console.log((ok?'ok   ':'FAIL ')+m)};
for(const d of DES)for(const m of MODES){
  const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,90)));
  await p.addInitScript(([d,m])=>{localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}))},[d,m]);
  await p.goto(BASE+'/index.html');await p.waitForTimeout(1500);
  await p.evaluate(()=>__prog.open('bk_spiritual_vigil'));await p.waitForTimeout(500);
  await p.evaluate(()=>{const e=document.querySelector('[data-pgd="1"]');e&&e.focus();e&&e.click()});await p.waitForTimeout(1200);
  const R={};
  R.focusIn=await p.evaluate(()=>{const a=document.activeElement;return !!(a&&a.closest&&a.closest('#progDay'))});
  const tabs=[];for(let i=0;i<16;i++){await p.keyboard.press('Tab');tabs.push(await p.evaluate(()=>{const a=document.activeElement;return !!(a&&a.closest&&(a.closest('#progDay')||a.closest('#uFab,#uDrv,#uThx,#settingsPanel,[role=dialog]')))}))}
  R.trapped=tabs.every(Boolean);
  R.label=await p.evaluate(()=>{const t=document.getElementById('pdNote');return !!(t&&t.getAttribute('aria-label'))});
  R.links=await p.evaluate(()=>[...document.querySelectorAll('#progDay a.pd-open,#progDay button.pd-open')].every(e=>e.getBoundingClientRect().height>=43.5));
  await p.evaluate(()=>document.querySelector('.pd-bk').focus());
  const pa=await p.evaluate(()=>document.querySelector('.bk-pos').textContent);await p.keyboard.press('ArrowLeft');const pb=await p.evaluate(()=>document.querySelector('.bk-pos').textContent);await p.keyboard.press('ArrowRight');const pc=await p.evaluate(()=>document.querySelector('.bk-pos').textContent);
  R.arrows=pa!==pb&&pa===pc;
  // تظليل بلا لمس
  await p.evaluate(()=>{const e=document.querySelector('.bk-page.on p.pd-ver:not(.pd-bold)');e.scrollIntoView({block:'center'});const r=document.createRange();r.selectNodeContents(e);const s=getSelection();s.removeAllRanges();s.addRange(r)});await p.waitForTimeout(400);
  R.btn=await p.evaluate(()=>{const b=document.getElementById('pgHl');return !!b&&!b.hidden});
  await p.evaluate(()=>document.getElementById('pgHl').click());await p.waitForTimeout(500);
  R.bar=await p.evaluate(()=>{const e=document.getElementById('v302Bar');return !!e&&!e.hidden&&!!(document.activeElement&&document.activeElement.closest('#v302Bar'))});
  await p.keyboard.press('Enter');await p.waitForTimeout(500);   // حفظ
  R.saved=await p.evaluate(()=>(CSS.highlights.get('rf-saved-0')||{size:0}).size>0);
  // نافذة الملاحظة
  await p.evaluate(()=>{const e=document.querySelector('.bk-page.on p.pd-ver:not(.pd-bold)');const r=document.createRange();r.selectNodeContents(e);const s=getSelection();s.removeAllRanges();s.addRange(r)});await p.waitForTimeout(300);
  await p.evaluate(()=>document.getElementById('pgHl').click());await p.waitForTimeout(400);
  await p.evaluate(()=>document.querySelector('#v302Bar [data-a=note]').click());await p.waitForTimeout(800);
  R.sheetFocus=await p.evaluate(()=>{const a=document.activeElement;return !!(a&&a.closest&&a.closest('#v299Sheet'))});
  const st=[];for(let i=0;i<8;i++){await p.keyboard.press('Tab');st.push(await p.evaluate(()=>{const a=document.activeElement;return !!(a&&a.closest&&a.closest('#v299Sheet'))}))}
  R.sheetTrap=st.every(Boolean);
  await p.keyboard.press('Escape');await p.waitForTimeout(500);
  R.sheetEsc=await p.evaluate(()=>{const s=document.getElementById('v299Sheet');return !s||s.hidden});
  // لوحة الإعدادات (الخط) من داخل الرحلة تبقى قابلة للتركيز (لا يسرقه الحبس)
  await p.evaluate(()=>document.querySelector('[data-pgset]').click());await p.waitForTimeout(800);
  R.settingsFocus=await p.evaluate(()=>{const b=document.querySelector('#settingsPanel button, #settingsPanel input, #settingsPanel [role=button]');if(!b)return false;b.focus();return !!(document.activeElement&&document.activeElement.closest&&document.activeElement.closest('#settingsPanel'))});
  await p.evaluate(()=>{const c=document.getElementById('settingsClose');c&&c.click()});await p.waitForTimeout(500);
  // Esc يغلق اليوم ثم المسار
  await p.evaluate(()=>{document.activeElement&&document.activeElement.blur&&document.activeElement.blur()});
  await p.evaluate(()=>document.querySelector('[data-pgback]').focus());
  await p.keyboard.press('Escape');await p.waitForTimeout(600);
  R.escDay=await p.evaluate(()=>!document.getElementById('progDay').classList.contains('on'));
  const ok=Object.values(R).every(Boolean)&&!errs.length;
  say(ok,`${d}/${m} ${Object.entries(R).filter(([k,v])=>!v).map(([k])=>k).join(',')||'كل الفحوص'} ${errs.join('|')}`);
  await p.close();
}
await b.close();if(srv)srv.close();process.exit(fail?1:0);
