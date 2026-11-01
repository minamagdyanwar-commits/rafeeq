# أدوات الفحص (QA)

تحتاج Playwright + Chromium. المسارات قابلة للتعديل بمتغيرات البيئة: `PW` (مسار index.mjs الخاص بـplaywright)، `CHROME`، `PORT`/`BASE`، `OUT`.

| الأمر | ما يفعله |
|---|---|
| `tools/qa/run.sh smoke` | يفتح التطبيق في كل تصميم × وضع (٢٢ حالة) ويفشل لو فيه خطأ JS، ويتحقق من آيات كل أيام الرحلات في الكتاب المقدس |
| `tools/qa/run.sh contrast` | فحص التباين بالصورة (لقطة شاشة + DOM) لكل تصميم/وضع ويقارن بـ`baseline.json` — يفشل لو زادت المشاكل |
| `node tools/qa/contrast.mjs --update` | يسجّل الأعداد الحالية كخط أساس جديد (بعد مراجعة بصرية) |
| `node tools/qa/lint-css.mjs` | حارس الـCSS: ميزانية `!important` لكل ملف + ممنوعات (`html[data-nh]` عارية، فئات `.nd/.lb/.sg` بدون نطاق) |
| `node tools/qa/fixlog.mjs [تصاميم] [dark|light]` | يعرض العناصر التي يصلحها مُصلح التباين وقت التشغيل — كل واحد منها «دين» لازم يُنقل إلى CSS |
| `node tools/qa/home_audit.mjs` | تدقيق الصفحة الرئيسية في كل التصاميم |
| `node tools/qa/serve.mjs [port]` | خادم ثابت للتطوير (الأدوات تشغّله تلقائيًا لو المنفذ فاضي) |

قبل أي دمج: `node tools/build.mjs --bump && tools/qa/run.sh smoke && node tools/qa/lint-css.mjs`.

## إضافات

| الأمر | ما يفعله |
|---|---|
| `node tools/qa/unified.mjs` | يختبر RF.act (النشاط) وRF.favs وRF.search وعدّاد «يومي» |
| `node tools/qa/fixlog.mjs [تصاميم] [dark|light]` | عدد وأسماء التصحيحات التي أجراها المُصلح وقت التشغيل (الهدف: صفر) |
| `node tools/qa/bake-contrast.mjs` | يخبز تلك التصحيحات في `src/app49.css` |
| `RF_TOOLS=… node tools/qa/visual.mjs A B` | يقارن بكسليًا بين بناءين (٩ شاشات × ٢٢ تصميم/وضع) |
| `SHOTS=1 OUT=<مجلد> node tools/qa/tc.mjs <تصميم> <dark\|light> [عرض] [ارتفاع]` | فحص تباين تصميم واحد بعرض اختياري (٣٩٠ افتراضيًا؛ جرّب ٣٦٠ و٧٦٨)؛ يغطي ~٥٠ صفحة (الأجبية والقراءات والكتاب والمتابعة والإعدادات والبحث وأطلس الكتاب والألحان ونافذة اليوم والرحلات واليوم القديم…)، ويتجاهل نصًّا لا يراه المستخدم (مقصوص، إيموجي فقط، مغطّى بعنصر آخر، مقطوع بحافة الشاشة). `SHOTS=1` يحفظ لقطة كل صفحة وإحداثيات البلاغات لمراجعتها بالعين |
| `node tools/qa/atlas.mjs [تصاميم] [dark\|light]` | «أطلس الكتاب»: يفتح كل التبويبات والخرائط في كل تصميم/وضع، ويفشل لو ظهر خطأ JS أو تصحيح تباين لعناصره |
| `node tools/qa/atlas-refs.mjs` | يتحقق من كل مرجع كتابي في `content/atlas/*.json` مقابل نص الكتاب المقدس (السفر والإصحاح والآيات) |
| `node tools/content-build.mjs` | يتحقق من `content/journeys/*.json` ويولّد `src/data-journeys.js` |
