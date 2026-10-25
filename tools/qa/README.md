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
