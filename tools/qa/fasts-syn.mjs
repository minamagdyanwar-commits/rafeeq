// التقويم مقابل السنكسار: الأعياد الثابتة وبدايات الأصوام بالتاريخ القبطي لازم تطابق ما يذكره السنكسار في نفس اليوم.
// يكشف التناقض (مثل بدء صوم الميلاد ١٥ بدل ١٦ هاتور) تلقائيًا بدل أن يلاحظه المستخدم. node tools/qa/fasts-syn.mjs
const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium }=await import(PW);
import {serve} from './serve.mjs';
const PORT=+process.env.PORT||8777,BASE=process.env.BASE||`http://localhost:${PORT}`;
const srv=process.env.BASE?null:await serve(PORT);
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium'});
const p=await b.newPage();await p.addInitScript(()=>localStorage.setItem('rafeeq_onboarded','1'));
await p.goto(`${BASE}/index.html`);await p.waitForTimeout(1500);
const bad=await p.evaluate(()=>{
  const C=window.__copCal,D=JSON.parse(document.getElementById('synData').textContent),o=[];
  const norm=s=>String(s).replace(/[ً-ْـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه');
  const txt=(m,d)=>{const e=D.m[m-1]&&D.m[m-1].d[d-1];return e?norm(((e.h||[]).join(' ')+' '+(e.p||[]).join(' ')).replace(/\s+/g,' ')):''};
  /* الكلمة المفتاحية التي يجب أن يذكرها السنكسار لكل عيد ثابت */
  const KEY=[[/النيروز/,/نيروز|راس السنه/],[/الصليب/,/صليب/],[/ميخائيل/,/ميخائيل/],[/الميلاد/,/ميلاد/],[/الغطاس/,/غطاس/],[/قانا/,/قانا/],[/العذراء/,/العذراء|مريم/],[/الهيكل/,/هيكل/],[/البشاره/,/بشاره/],[/مصر/,/مصر/],[/الرسل/,/رسل|بطرس|بولس/],[/التجلي/,/تجلي/]];
  C.fixed.forEach(f=>{const [m,d,name]=f,t=txt(m,d),n=norm(name);const k=KEY.find(x=>x[0].test(n));
    if(!t)o.push(`${name} (${d}/${m}): لا مدخل في السنكسار`);
    else if(k&&!k[1].test(t))o.push(`${name}: التقويم يضعه ${d}/${m} لكن السنكسار في هذا اليوم لا يذكره`)});
  /* بدء صوم الميلاد: السنكسار يقولها صراحة، والتقويم يحسب بدايته لكل السنين */
  const syn=[];D.m.forEach((mo,mi)=>mo.d.forEach((x,di)=>{if(/بدء صوم الميلاد/.test(norm((x.h||[]).join(' ')+' '+(x.p||[]).join(' ')).replace(/بدء صوم الميلاد/,'بدء صوم الميلاد')))syn.push([mi+1,di+1])}));
  if(!syn.length)o.push('السنكسار لا يذكر «بدء صوم الميلاد» أصلًا');
  syn.forEach(([m,d])=>{for(let y=1900;y<=2099;y++){const a=C.baseSeasons(y).find(s=>s.id==='advA'),c=a&&C.coptic(a.from);if(!c||c.m!==m||c.d!==d){o.push(`بدء صوم الميلاد ${y}: السنكسار ${d}/${m} والتقويم ${c?c.d+'/'+c.m:'—'}`);break}}});
  /* برمون الميلاد والغطاس */
  [[4,28],[5,10]].forEach(([m,d])=>{if(!/برمون/.test(txt(m,d)))o.push(`${d}/${m}: السنكسار لا يذكر «برمون»`)});
  /* السنكسار: الأعياد التي يبدأ مدخلها بـ«عيد» لها مدخل في التقويم الثابت */
  D.m.forEach((mo,mi)=>mo.d.forEach((x,di)=>{const t=norm((x.h||[]).join(' ')).trim();const mm=/^عيد (الميلاد|الغطاس|الصليب|النيروز|التجلي)/.exec(t);if(mm&&!C.fixed.some(f=>f[0]===mi+1&&f[1]===di+1))o.push(`السنكسار يذكر «${t.slice(0,30)}» في ${di+1}/${mi+1} وليس في التقويم`)}));
  return o});
console.log(bad.length?bad.join('\n'):'التقويم يطابق السنكسار في الأعياد الثابتة وبدء صوم الميلاد والبرامون');
await b.close();if(srv)srv.close();process.exit(bad.length?1:0);
