# أدوات البناء

الـ repo يحتوي الناتج المبني فقط. بعد أي تعديل على ملف `app*` أو `data-*` أو `store*` أو `index.html`:

    node tools/build.mjs          # يعيد التهشير ويحدّث index.html و sw.js
    node tools/build.mjs --bump   # نفس الشيء مع رفع رقم الإصدار (الثالث)

لا تعدّل `sw.js` يدويًا (قائمة FILES واسم الكاش يُولَّدان).
