# أدوات البناء

الـ repo يحتوي الناتج المبني فقط. بعد أي تعديل على ملف `app*` أو `data-*` أو `store*` أو `index.html`:

    node tools/build.mjs          # يعيد التهشير ويحدّث index.html و sw.js
    node tools/build.mjs --bump   # نفس الشيء مع رفع رقم الإصدار (الثالث)

لا تعدّل `sw.js` يدويًا (قائمة FILES واسم الكاش يُولَّدان).

## السنكسار
`tools/syn-import.py` يحوّل نصوص OCR (من `pdftoppm -r 300 -gray` ثم `tesseract -l ara --psm 3` بنموذج tessdata_best) إلى `syn-m01.js … syn-m12.js`:

    python3 tools/syn-import.py <مجلد صفحات النص> .
    node tools/build.mjs

النص مستخرج آليًا وغير مراجع، وبعض الأيام ناقصة (تظهر في تقرير السكريبت).
