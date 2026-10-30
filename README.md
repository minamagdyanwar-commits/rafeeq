# الرفيق الروحي — بنية المشروع

تطبيق ويب ثابت (PWA) يعمل بدون خادم ولا إنترنت. هذا الملف يشرح أين تعدّل وكيف تبني.

## أين أعدّل؟

| ما أريد تغييره | الملف |
|---|---|
| منطق التطبيق وشاشاته | `src/app*.js` (مقروءة ومنسّقة — هذا هو المصدر) |
| الأنماط | `src/app*.css` |
| الرحلات (نصوص، آيات، مراحل) | `content/journeys/<id>.json` ثم `node tools/build.mjs` |
| ترتيب ظهور الرحلات | `content/journeys/_order.json` |
| أطلس الكتاب (شخصيات، أنساب، خرائط) | `content/atlas/*.json` ثم `node tools/build.mjs` (الواجهة في `src/app51.js`) |
| بيانات كبيرة جاهزة (الكتاب المقدس، الأجبية…) | `data-*.js` في الجذر (ناتج جاهز) |

> الملفات المهشّرة في الجذر (`app5.b40b15aadc.js`…) **ناتج بناء** — لا تعدّلها يدويًا؛ يُعاد توليدها من `src/`.

## البناء

    npm install                 # مرة واحدة: terser + esbuild + prettier (للضغط فقط)
    node tools/build.mjs --bump # يبني المحتوى، يضغط src → الجذر، يهشّر، يحدّث index.html وsw.js ويرفع الإصدار

بدون `npm install` يعمل البناء أيضًا لكن الناتج غير مضغوط. متغير `RF_TOOLS` يشير لمجلد `node_modules` خارجي.

## النماذج الموحّدة (`src/store-core.js`)

- **`RF.act`** — نموذج «النشاط» الواحد: (تاريخ، نوع، منجَز؟). الأنواع: `hour:<مفتاح>` `read` `med` `gd` `exam` `prog`.
  `RF.act.set/has/list/score` ويطلق حدثًا واحدًا `rf:activity` تستمع له شاشات «يومي» والرئيسية والعدّادات. لا تحسب شيئًا من مخازنك الخاصة.
- **`__F.dayPlan(key)`** — خطة اليوم الوحيدة (الخطوات والعدّاد والخطوة التالية) تقرأ منها كل الشاشات.
- **`RF.favs`** — سجلّ المفضّلات: كل وحدة تسجّل مصدرها بـ `RF.favs.register({id,t,ic,items(),rm(id)})`.
- **`RF.search`** — مزوّدو البحث: `RF.search.register({id,title,order,run(q,nq,ctx),go(parts)})` فتظهر نتائجه في نافذة البحث الواحدة.
- **`RF.esc / RF.ar / RF.fmtDate / RF.jget / RF.jset`** — دوال مشتركة. **`RF.keys`** — سجلّ مفاتيح التخزين.

## الألوان والتباين

- الألوان المخبوزة لكل تصميم/وضع: `src/app49.css` (يولّدها `tools/qa/bake-contrast.mjs`).
- مُصلح التباين وقت التشغيل (في `src/app39.js`) صار **شبكة أمان وكاشفًا**: `node tools/qa/fixlog.mjs` يجب أن يطبع صفر تصحيحات؛ أي ظهور = نمط جديد يلزم خبزه.
- ميزانية `!important`: `node tools/qa/lint-css.mjs`.

## الفحص (`tools/qa/`)

    tools/qa/run.sh smoke       # فتح كل التصاميم + مراجع آيات الرحلات
    node tools/qa/unified.mjs   # النشاط والمفضلات والبحث الموحّد
    node tools/qa/contrast.mjs  # التباين مقابل baseline.json
    node tools/qa/fixlog.mjs    # التصحيحات وقت التشغيل (يجب صفر)
    RF_TOOLS=... node tools/qa/visual.mjs <BASE_A> <BASE_B>   # مقارنة بصرية بين بناءين

راجع `tools/qa/README.md` للتفاصيل.

## المحتوى والمراجعة

كل رحلة في `content/journeys/*.json` لها حقل `src` (المصدر) و`review.status` (`draft` | `needs-review` | `reviewed`).
رحلات «البابا شنوده» صياغة جديدة لأفكار الكتب وتحتاج مراجعة عقائدية قبل اعتبارها معتمدة.
