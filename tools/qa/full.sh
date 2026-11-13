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
OUT=${OUT:-/tmp/rfqa-wide}; mkdir -p "$OUT"
for W in 360 768; do
  for d in ${DES//,/ }; do for m in dark light; do
    H=844; [ "$W" = 768 ] && H=1024
    r=$(OUT=$OUT BASE=${BASE:-http://localhost:8777} node tc.mjs "$d" "$m" "$W" "$H" 2>&1 | tail -1); echo "$W $r"
    echo "$r" | grep -q "issues 0 " || echo "  ⚠ مراجعة: $W $d/$m"
  done; done
done
step "تصحيحات مُصلح التباين وقت التشغيل (الهدف: صفر)" node fixlog.mjs "$DES"
step "خطة قراءة الكتاب" node bplan.mjs "$DES"
step "الرفيق" node companion.mjs "$DES"
step "النشاط والمفضلة والبحث" node unified.mjs
echo; [ $fail = 0 ] && echo "كل الفحوص نجحت" || echo "فيه فحوص فشلت (راجع الأعلى)"
exit $fail
