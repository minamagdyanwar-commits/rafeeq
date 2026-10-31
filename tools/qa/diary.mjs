// اختبار وظائف تصميم «دفتري مع يسوع»: الغلاف، صفحة اليوم، سطر لك، الفهرس، الشريط الأحمر، ركن الصفحة، اليوم القديم، تبديل التصميم.
// node tools/qa/diary.mjs
const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium } = await import(PW);
import {serve} from './serve.mjs';
const PORT=+process.env.PORT||8777;const srv=process.env.BASE?null:await serve(PORT);const BASE=process.env.BASE||`http://localhost:${PORT}`;
const b = await chromium.launch({ executablePath: process.env.CHROME||'/opt/pw-browsers/chromium' });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 150)));
let bad=0;const ok = (n, v) => { if(!v)bad++; console.log((v ? 'ok   ' : 'FAIL ') + n); };
await p.addInitScript(() => { if (!sessionStorage.getItem('init')) { sessionStorage.setItem('init', '1'); localStorage.setItem('rafeeq_v76_design', 'diary'); localStorage.setItem('khalwa_settings_v80', JSON.stringify({ themeMode: 'light' })); } });
await p.goto(BASE+'/index.html'); await p.waitForTimeout(2500);
ok('الغلاف ظاهر عند الفتح', await p.evaluate(() => !!document.getElementById('dyCover')));
await p.click('#dyOpen'); await p.waitForTimeout(900);
ok('الغلاف يُغلق بـ«افتح الدفتر»', await p.evaluate(() => !document.getElementById('dyCover')));
await p.reload(); await p.waitForTimeout(2200);
ok('الغلاف لا يتكرر في نفس الجلسة', await p.evaluate(() => !document.getElementById('dyCover')));
ok('صفحة اليوم مرسومة', await p.evaluate(() => !!document.querySelector('#dyHome .dy-plan li') && document.querySelectorAll('#dyHome .dy-todo').length >= 5));
// «سطر لك» يُحفظ
await p.fill('#dyTa', 'شكرًا يا رب'); await p.waitForTimeout(700); await p.reload(); await p.waitForTimeout(2200);
ok('سطر لك يُحفظ بعد إعادة التحميل', await p.evaluate(() => document.getElementById('dyTa').value === 'شكرًا يا رب'));
// عنصر الخطة يفتح الصلاة
await p.evaluate(() => document.querySelector('#dyHome .dy-todo[data-act="hour"]').click()); await p.waitForTimeout(1500);
ok('ضغط خطوة الصلاة يفتح الأجبية', await p.evaluate(() => document.documentElement.getAttribute('data-pg') !== 'home'));
await p.evaluate(() => document.querySelector('#uNav [data-go="home"]').click()); await p.waitForTimeout(800);
// الشريط الأحمر → الفهرس → «كل مفضلاتي»
await p.click('#dyRibbon'); await p.waitForTimeout(700);
ok('الشريط الأحمر يفتح الفهرس', await p.evaluate(() => !!document.getElementById('dyIndex') && document.querySelectorAll('#dyIndex li button').length >= 8));
await p.evaluate(() => [...document.querySelectorAll('#dyIndex li button')].find(b => /مفضلاتي/.test(b.textContent)).click()); await p.waitForTimeout(1200);
ok('سطر الفهرس يفتح الصفحة الأصلية (المفضلات)', await p.evaluate(() => !document.getElementById('dyIndex') && document.getElementById('page-favs').classList.contains('on')));
await p.evaluate(() => document.querySelector('#uNav [data-go="home"]').click()); await p.waitForTimeout(800);
await p.click('#uNavMore'); await p.waitForTimeout(700);
await p.click('.dy-ixx'); await p.waitForTimeout(500);
ok('إغلاق الفهرس ✕ يغلق الشيت أيضًا', await p.evaluate(() => !document.getElementById('dyIndex') && !document.getElementById('uSheet').classList.contains('on')));
// ركن الصفحة → نافذة اليوم
await p.click('#dyCurl'); await p.waitForTimeout(700);
ok('ركن الصفحة يفتح نافذة تغيير اليوم', await p.evaluate(() => document.getElementById('uSheet').classList.contains('on') && /تاريخ التدوين/.test(document.getElementById('uSheet').textContent)));
await p.evaluate(() => __F.closeSheet());
// أمس → ورقة لاصقة وزر الرجوع
await p.evaluate(() => document.querySelector('[data-dyday="-1"]').click()); await p.waitForTimeout(1200);
ok('«أمس» ينقل ليوم قديم وتظهر الورقة اللاصقة', await p.evaluate(() => !!document.querySelector('#dyHome .dy-sticky')));
await p.evaluate(() => document.querySelector('#dyHome .dy-sticky button').click()); await p.waitForTimeout(1200);
ok('«ارجع لليوم الفعلي» يعمل', await p.evaluate(() => !document.querySelector('#dyHome .dy-sticky')));
// تغيير التصميم من الإعدادات والعودة
await p.evaluate(() => __rfTheme.setDesign('classic')); await p.waitForTimeout(1200);
ok('تغيير التصميم يُزيل مكوّنات الدفتر', await p.evaluate(() => !document.getElementById('dyHome') && !document.getElementById('dyRibbon') && !document.getElementById('dyCurl')));
await p.evaluate(() => __rfTheme.setDesign('diary')); await p.waitForTimeout(1500);
ok('الرجوع للدفتر يعيد صفحة اليوم', await p.evaluate(() => !!document.querySelector('#dyHome .dy-todo') && !!document.getElementById('dyRibbon')));
// مفتاح الغلاف في الإعدادات
await p.evaluate(() => document.getElementById('uGear').click()); await p.waitForTimeout(900);
ok('خيار إظهار الغلاف في الإعدادات', await p.evaluate(() => !!document.getElementById('dyCoverTog')));
console.log('JS errors:', errs);if(errs.length)bad++;
await b.close();if(srv)srv.close();process.exit(bad?1:0);
