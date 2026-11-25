// بدايات الأصوام ونهاياتها في التقويم (حساب فقط، كل السنوات ١٩٠٠–٢٠٩٩): node tools/qa/fasts.mjs
// صوم الميلاد: يبدأ ١٦ هاتور ويمتد ٤٣ يومًا متصلة إلى ٢٨ كيهك؛ صوم العذراء ١–١٥ مسرى؛ صوم الرسل ينتهي يوم ٤ أبيب؛ يونان والكبير من القيامة.
const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium }=await import(PW);
import {serve} from './serve.mjs';
const PORT=+process.env.PORT||8777,BASE=process.env.BASE||`http://localhost:${PORT}`,srv=process.env.BASE?null:await serve(PORT);
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium'});
const p=await b.newPage();await p.addInitScript(()=>localStorage.setItem('rafeeq_onboarded','1'));
await p.goto(`${BASE}/index.html`);await p.waitForTimeout(1500);
const bad=await p.evaluate(()=>{const C=__copCal,o=[],c=d=>C.coptic(d),n=d=>Math.round(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5);
 for(let y=1900;y<=2099;y++){const S=C.seasons(y),g=id=>S.find(x=>x.id===id);
  const a=g('advA'),v=g('virgin'),ap=g('apostles'),j=g('jonah'),l=g('lent'),E=C.easter(y);
  if(!a||c(a.from).m!==3||c(a.from).d!==16)o.push(y+' الميلاد: البداية ليست ١٦ هاتور');
  if(!a||c(a.to).m!==4||c(a.to).d!==28)o.push(y+' الميلاد: النهاية ليست ٢٨ كيهك');
  if(a&&n(a.to)-n(a.from)+1!==43)o.push(y+' الميلاد: '+(n(a.to)-n(a.from)+1)+' يومًا');
  if(!v||c(v.from).m!==12||c(v.from).d!==1||c(v.to).m!==12||c(v.to).d!==15)o.push(y+' صوم العذراء');
  if(!ap||c(ap.to).m!==11||c(ap.to).d!==4||ap.from.getDay()!==1)o.push(y+' صوم الرسل (النهاية ٤ أبيب والبداية اثنين)');
  if(j.from.getDay()!==1||l.from.getDay()!==1||n(l.from)!==n(E)-55)o.push(y+' يونان/الكبير');
  /* عدّاد الميلاد متصل: اليوم ١ في البداية، ٤٣ في النهاية، ولا انقطاع عند رأس السنة */
  if(a){const f=C.label(a.from).main,e=C.label(a.to).main,jn=C.label(new Date(a.to.getFullYear(),0,1,12)).main;
   if(!f||f.day!==1||f.len!==43)o.push(y+' عدّاد اليوم الأول');if(!e||e.day!==43)o.push(y+' عدّاد اليوم الأخير');if(!jn||jn.len!==43)o.push(y+' عدّاد يناير');
   const before=C.label(new Date(a.from.getFullYear(),a.from.getMonth(),a.from.getDate()-1,12)).main;if(before&&before.k==='adv')o.push(y+' الميلاد يبدأ يومًا مبكرًا');}
 }return o});
console.log(bad.length?bad.slice(0,20).join('\n'):'كل السنوات ١٩٠٠–٢٠٩٩ سليمة');
await b.close();if(srv)srv.close();process.exit(bad.length?1:0);
