#!/bin/bash
# الفحص الشامل (قاعدة CLAUDE.md): كل التصميمات × الوضعين × عروض الجوال/التابلت + تباين + تصحيحات المُصلح + اختبارات الميزات.
# الاستخدام: tools/qa/full.sh [تصاميم مفصولة بفواصل]   (الافتراضي: كل الـ١١)
cd "$(dirname "$0")"
DES="${1:-bearer,church,classic,cross,crown,glory,holy,lamp,qalaya,royal,shroud}"
set -u
fail=0
node serve.mjs 8777 >/dev/null 2>&1 &
SRV=$!; trap 'kill $SRV 2>/dev/null' EXIT; sleep 1
step(){ echo; echo "=== $1"; shift; "$@" || { echo "FAIL: $*"; fail=1; }; }
step "حارس الـCSS" node lint-css.mjs
step "smoke (كل التصاميم والوضعين)" node smoke.mjs
step "تباين مقابل الخط الأساس (٣٩٠)" node contrast.mjs "$DES"
OUT=${OUT:-/tmp/rfqa-wide}; mkdir -p "$OUT"; export OUT BASE=${BASE:-http://localhost:8777}
echo; echo "=== تباين بعروض ٣٦٠ و٧٦٨ (موازاة ٤)"
for W in 360 768; do for d in ${DES//,/ }; do for m in dark light; do echo "$d $m $W"; done; done; done | \
  xargs -P ${CONC:-4} -L1 bash -c 'H=844; [ "$2" = 768 ] && H=1024; [ "$2" = 768 ] || true; node tc.mjs "$0" "$1" "$2" $([ "$2" = 768 ] && echo 1024 || echo 844) 2>&1 | tail -1' | tee "$OUT/wide.txt"
grep -v "issues 0 " "$OUT/wide.txt" | sed 's/^/  ⚠ مراجعة: /' || true
step "تصحيحات مُصلح التباين وقت التشغيل (الهدف: صفر)" node fixlog.mjs "$DES"
step "خطة قراءة الكتاب" node bplan.mjs "$DES"
step "الرفيق" node companion.mjs "$DES"
step "النشاط والمفضلة والبحث" node unified.mjs
echo; [ $fail = 0 ] && echo "كل الفحوص نجحت" || echo "فيه فحوص فشلت (راجع الأعلى)"
exit $fail
