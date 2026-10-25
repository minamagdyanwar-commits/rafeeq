/* RF — أدوات مشتركة (تُحمَّل بعد store.js وقبل أي وحدة): تهريب HTML، أرقام عربية، تواريخ، قراءة/كتابة JSON،
   وسجلّ مفاتيح التخزين. هذا المصدر الوحيد لهذه الدوال؛ الوحدات تستعملها بدل نسخها. */
(function () {
  var AR = '٠١٢٣٤٥٦٧٨٩';
  var RF = window.RF = window.RF || {};
  RF.esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  RF.ar = function (n) { return String(n).replace(/\d/g, function (d) { return AR[d]; }); };
  RF.unAr = function (n) { return String(n).replace(/[٠-٩]/g, function (d) { return AR.indexOf(d); }); };
  RF.pad = function (n) { return (n < 10 ? '0' : '') + n; };
  RF.dkey = function (d) { d = d || new Date(); return d.getFullYear() + '-' + RF.pad(d.getMonth() + 1) + '-' + RF.pad(d.getDate()); };
  /* تاريخ بالعربية المصرية: opts مثل {day:'numeric',month:'long'} — يرجّع '' لو فشل */
  RF.fmtDate = function (d, opts) {
    try { return (d instanceof Date ? d : new Date(d)).toLocaleDateString('ar-EG', opts || { day: 'numeric', month: 'long' }); } catch (e) { return ''; }
  };
  RF.jget = function (k, def) { try { var v = localStorage.getItem(k); return v == null ? def : JSON.parse(v); } catch (e) { return def; } };
  RF.jset = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
  /* سجلّ المفاتيح: كلها داخل نسخة store.js الواحدة وتدخل في النسخ الاحتياطي تلقائيًا (البادئات khalwa_ dr_ mohasba_ rafeeq_) */
  RF.keys = {
    'rafeeq_prefs_v1': 'تفضيلات التتبّع: ساعات الصلاة (rule) والمساء والخطة',
    'rafeeq_dayorder': 'ترتيب وإخفاء خطوات «يومي»',
    'rafeeq_prog_v1': 'تقدّم الرحلات (يوم الحالي والمكتمل والملاحظات)',
    'rafeeq_lines_v1': 'المفضّلات: الآيات والجمل المحفوظة بالضغط المطوّل',
    'rafeeq_dm_cfg_v1': 'إعدادات وضع القيادة (صوت/سرعة)',
    'rafeeq_v76_design': 'التصميم المختار',
    'khalwa_settings_v80': 'إعدادات الخلوة والمظهر (themeMode)',
    'rafeeq_nh_hours': 'قديم: دُمج في rafeeq_prefs_v1.rule (يُحذف تلقائيًا)'
  };
  RF.isManaged = function (k) { return /^(khalwa_|dr_|mohasba_|rafeeq_)/.test(String(k)); };
})();
