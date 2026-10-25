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

  /* ---------- أحداث موحّدة ---------- */
  RF.emit = function (name, detail) {
    try { window.dispatchEvent(new CustomEvent(name, { detail: detail || {} })); } catch (e) {}
  };
  RF.on = function (name, fn) { window.addEventListener(name, fn); };

  /* ---------- نموذج «النشاط» الموحّد ----------
     النشاط = (تاريخ، نوع، منجَز؟). الأنواع تُعرَّف مرة واحدة من الوحدة المالكة بـ RF.act.define(prefix, {get,set,keys}):
       hour:<مفتاح>  read  med  gd  exam   ← مخزّنة في rafeeq_track_v1 (app6)
       prog                                  ← محسوبة من تقدّم الرحلات (app39)، للقراءة فقط
     كل الشاشات (يومي، العدّادات، السلسلة، الشارات) تقرأ من هنا، وأي تغيير يطلق الحدث rf:activity مرة واحدة. */
  var kinds = {}, tAct = 0;
  var pre = function (k) { return String(k).split(':')[0]; };
  RF.act = {
    define: function (prefix, def) { kinds[prefix] = def; },
    has: function (date, kind) { var d = kinds[pre(kind)]; try { return !!(d && d.get(date, kind)); } catch (e) { return false; } },
    set: function (date, kind, on) {
      var d = kinds[pre(kind)]; if (!d || !d.set) return false;
      d.set(date, kind, !!on); RF.act.changed(date, kind); return true;
    },
    toggle: function (date, kind) { return RF.act.set(date, kind, !RF.act.has(date, kind)); },
    list: function (date) {
      var out = [];
      Object.keys(kinds).forEach(function (p) {
        var d = kinds[p], ks = d.keys ? d.keys(date) : [p];
        ks.forEach(function (k) { if (RF.act.has(date, k)) out.push(k); });
      });
      return out;
    },
    score: function (date) { return RF.act.list(date).length; },
    changed: function (date, kind) {
      clearTimeout(tAct);
      tAct = setTimeout(function () { RF.emit('rf:activity', { date: date, kind: kind }); }, 0);
    },
    on: function (fn) { RF.on('rf:activity', fn); }
  };

  /* ---------- سجلّ المفضّلات ----------
     كل مصدر يسجّل نفسه: {id, ic, t, hint, key, items():[{id,head,sub,text,ts,go}], rm(id)}.
     صفحة «المفضّلات» والبحث والعدّادات تقرأ من RF.favs فقط. */
  var favSrc = [];
  RF.favs = {
    register: function (src) {
      for (var i = 0; i < favSrc.length; i++) if (favSrc[i].id === src.id) { favSrc[i] = src; return; }
      favSrc.push(src);
      favSrc.sort(function (a, b) { return (a.order || 50) - (b.order || 50); });
    },
    sources: function () { return favSrc; },
    all: function () { return favSrc.map(function (s) { var it = []; try { it = s.items() || []; } catch (e) {} return { src: s, items: it }; }); },
    count: function () { return RF.favs.all().reduce(function (n, x) { return n + x.items.length; }, 0); },
    changed: function () { RF.emit('rf:favs'); }
  };

  /* ---------- سجلّ البحث ----------
     مزوّد البحث: {id, title, order, run(q, nq): [{title, sub, go:'type:arg:arg'}], go(parts)}.
     نتائج كل المزوّدين تظهر في نافذة البحث الواحدة. nq = النص بعد التطبيع (norm). */
  var providers = [];
  RF.search = {
    register: function (p) {
      for (var i = 0; i < providers.length; i++) if (providers[i].id === p.id) { providers[i] = p; return; }
      providers.push(p); providers.sort(function (a, b) { return (a.order || 50) - (b.order || 50); });
    },
    providers: function () { return providers; }
  };

  RF.isManaged = function (k) { return /^(khalwa_|dr_|mohasba_|rafeeq_)/.test(String(k)); };
})();
