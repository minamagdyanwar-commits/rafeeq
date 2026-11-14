/* v6.16 — «يوم الكنيسة» + «رحلة الموسم»
   شاشة واحدة تجمع كل ما للكنيسة في هذا اليوم: التاريخ القبطي والموسم/العيد (window.__copCal)، قراءات القطمارس (__rfResolve)،
   تذكار السنكسار (synData)، تأمل السنة (__khalwaYear)، قول من الآباء (__fatherOfDay)، ترنيمة مناسبة (__hymnsKhalwa)،
   ورحلة الموسم (إن كانت رحلة موسمية قائمة الآن: window.__prog.season()). كلها بيانات موجودة فعلًا؛ هذا الملف يجمعها فقط. */
(function () {
  'use strict';
  var WD = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  var RK = { oshia: 'عشية', bakr: 'باكر', boulos: 'البولس', catholicon: 'الكاثوليكون', abraksis: 'الإبركسيس', liturgy: 'القداس', synaxarium: 'السنكسار', vespers: 'عشية', matins: 'باكر' };
  function F() { return window.__F || {}; }
  function esc(s) { return RF.esc(s); }
  function ar(n) { return RF.ar(n); }
  function cal(d) { try { return window.__copCal && window.__copCal.label(d); } catch (e) { return null; } }
  function copticLine(d) {
    try { var c = window.__copCal.coptic(d); return ar(c.d) + ' ' + window.__copCal.CM[c.m - 1] + ' ' + ar(c.y) + ' ش'; } catch (e) { return ''; }
  }
  function season() { try { return window.__prog && window.__prog.season ? window.__prog.season() : []; } catch (e) { return []; } }

  /* ---------- مصادر البيانات (كل واحد يرجّع null إن لم يتوفر فلا ينكسر شيء) ---------- */
  function readings(d) {
    try {
      if (!window.__rfResolve && window.__initReadings) (window.__ensureReadings || window.__initReadings)();
      var x = window.__rfResolve && window.__rfResolve(d);
      return x && x.res ? { title: x.res.title, list: x.res.readings || [] } : null;
    } catch (e) { return null; }
  }
  var SYN = null;
  function synToday(d) {
    try {
      if (!SYN) SYN = JSON.parse(document.getElementById('synData').textContent);
      var c = window.__copCal.coptic(d), mo = SYN.m[c.m - 1], day = mo && mo.d[c.d - 1];
      return day && day.h && day.h.length ? day.h.slice(0, 3) : null;
    } catch (e) { return null; }
  }
  function khalwa(d) {
    try { var K = window.__khalwaYear, e = K && K.ready && K.entry && K.entry(d); return e && e.m && e.m.length ? e : null; } catch (x) { return null; }
  }
  function father(d) { try { return window.__fatherOfDay && window.__fatherOfDay(d); } catch (e) { return null; } }
  function hymnOf(d) {
    try {
      var L = window.__hymnsKhalwa ? window.__hymnsKhalwa() : (window.__hymns || []);
      if (!L.length) return null;
      var n = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
      return L[n % L.length];
    } catch (e) { return null; }
  }

  /* ---------- الصفحة ---------- */
  function sec(title, body, go, goLabel) {
    return '<section class="cd-sec"><h3>' + title + '</h3>' + body + (go ? '<button type="button" class="cd-go" data-cdgo="' + go + '">' + goLabel + ' ‹</button>' : '') + '</section>';
  }
  function build(d) {
    var c = cal(d), info = c && c.info, h = '';
    h += '<div class="cd-hd"><small>' + WD[d.getDay()] + ' — ' + esc(RF.fmtDate(d, { day: 'numeric', month: 'long', year: 'numeric' })) + '</small><h2>' + esc(copticLine(d)) + '</h2>' +
      ((c && c.text) ? '<p class="cd-tx">' + esc(c.text) + '</p>' : '') +
      (info && info.fast && !(c && /يوم صوم/.test(c.text || '')) ? '<span class="cd-chip">يوم صوم</span>' : '') + '</div>';
    var sj = season();
    if (sj.length) {
      h += sec('رحلة الموسم', sj.map(function (j) { return '<button type="button" class="cd-row" data-cdsx="' + esc(j.id) + '"><b>' + esc(j.icon || '') + ' ' + esc(j.title) + '</b><small>اليوم ' + ar(j.day) + ' من ' + ar(j.n) + ' في موسمها</small></button>'; }).join(''));
    }
    var rd = readings(d);
    if (rd) {
      var li = rd.list.map(function (r) {
        var ref = r.shortRef || [r.psalmRef, r.gospelRef].filter(Boolean).join(' — ') || '';
        return '<li><b>' + esc(RK[r.key] || r.key) + '</b> <span>' + esc(ref) + '</span></li>';
      }).join('');
      h += sec('قراءات اليوم', (rd.title ? '<p class="cd-sub">' + esc(rd.title) + '</p>' : '') + '<ul class="cd-ul">' + li + '</ul>', 'read', 'افتح القراءات');
    } else h += sec('قراءات اليوم', '<p class="cd-sub">قراءات القطمارس لهذا اليوم تُفتح من صفحة القراءات.</p>', 'read', 'افتح القراءات');
    var sy = synToday(d);
    if (sy) h += sec('تذكار اليوم (السنكسار)', '<ul class="cd-ul">' + sy.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>', 'syn', 'سنكسار اليوم كامل');
    var kh = khalwa(d);
    if (kh) {
      var m0 = kh.m[0];
      h += sec('تأمل اليوم', '<p class="cd-sub">' + esc(kh.th || '') + '</p>' + (m0 ? '<p class="cd-q">«' + esc(m0.v || '') + '»</p><small class="cd-ref">' + esc(m0.ref || '') + '</small>' : ''), 'med', 'افتح التأمل');
    }
    var fa = father(d);
    if (fa && fa.t) {
      var ct = ''; try { ct = window.__fathers && window.__fathers.cite ? window.__fathers.cite(fa) : ''; } catch (e) {}
      h += sec('قول من الآباء', '<p class="cd-q">«' + esc(fa.t) + '»</p><small class="cd-ref">' + esc(fa.f) + (ct ? ' — ' + esc(ct) : '') + '</small>', 'fat', 'أقوال الآباء');
    }
    var hy = hymnOf(d);
    if (hy) h += sec('ترنيمة لليوم', '<p class="cd-sub"><b>' + esc(hy.title) + '</b></p><p class="cd-q">' + esc(String(hy.lines[0]).split('\n').slice(0, 2).join(' / ')) + '</p>', 'hymn:' + hy.id, 'اقرأ الترنيمة');
    return h;
  }
  function ensure() {
    var el = document.getElementById('churchDay');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'churchDay'; el.className = 'prg-page'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'يوم الكنيسة');
    document.body.appendChild(el);
    return el;
  }
  function open() {
    var el = ensure();
    el.innerHTML = '<button type="button" class="pg-x" data-cdclose="1" aria-label="إغلاق">✕</button><div class="cd-c">' + build(new Date()) + '</div>';
    el.classList.add('on'); el.scrollTop = 0;
  }
  function close() { var el = document.getElementById('churchDay'); if (el) el.classList.remove('on'); }

  /* ---------- بطاقات الرئيسية ---------- */
  function homeCards() {
    var d = new Date(), c = cal(d), sj = season(), out = '';
    out += '<button type="button" class="pg-home cd" data-cdopen="1"><i>⛪</i><span><b>يوم الكنيسة</b><small>' + esc((c && c.text) || copticLine(d)) + '</small></span><em>‹</em></button>';
    if (sj.length) out += '<button type="button" class="pg-home sx" data-cdsx="' + esc(sj[0].id) + '"><i>' + esc(sj[0].icon || '🗓') + '</i><span><b>رحلة الموسم</b><small>' + esc(sj[0].short || sj[0].title) + ' — اليوم ' + ar(sj[0].day) + ' من ' + ar(sj[0].n) + '</small></span><em>‹</em></button>';
    return out;
  }
  /* الرئيسية القديمة (church · classic · cross · qalaya): بطاقات .hm-card بنفس شكل بطاقة «قول اليوم من الآباء» */
  function legacyCards() {
    var d = new Date(), c = cal(d), sj = season(), out = '';
    out += '<button type="button" class="hm-card hm-fat cdc" data-cdopen="1"><div class="hm-h"><b>⛪ يوم الكنيسة</b></div><p>' + esc((c && c.text) || copticLine(d)) + '</p><small>قراءات اليوم · السنكسار · التأمل · ترنيمة</small></button>';
    if (sj.length) out += '<button type="button" class="hm-card hm-fat cdc" data-cdsx="' + esc(sj[0].id) + '"><div class="hm-h"><b>' + esc(sj[0].icon || '🗓') + ' رحلة الموسم</b></div><p>' + esc(sj[0].title) + '</p><small>اليوم ' + ar(sj[0].day) + ' من ' + ar(sj[0].n) + ' في موسمها</small></button>';
    return out;
  }
  function injectHome() {
    var b = document.querySelector('#nhHome .nh-body');
    if (b) {
      var sig = homeCards(), cur = b.querySelector('.pg-home.cd');
      if (cur && b.__cdSig === sig) return;
      [].slice.call(b.querySelectorAll('.pg-home.cd,.pg-home.sx')).forEach(function (e) { e.remove(); });
      b.__cdSig = sig; b.insertAdjacentHTML('beforeend', sig);
      return;
    }
    var L = document.getElementById('v6Home');
    if (!L || !L.children.length) return;
    var sg = legacyCards();
    if (L.__cdSig === sg && L.querySelector('.cdc')) return;
    [].slice.call(L.querySelectorAll('.cdc')).forEach(function (e) { e.remove(); });
    L.__cdSig = sg;
    var anchor = L.querySelector('.hm-prog');
    if (anchor) anchor.insertAdjacentHTML('afterend', sg); else L.insertAdjacentHTML('beforeend', sg);
  }
  function injectMore() {
    var box = document.querySelector('#uSheet .v14-more');
    if (!box || box.querySelector('[data-cdopen]')) return;
    var b = document.createElement('button'); b.type = 'button'; b.setAttribute('data-cdopen', '1');
    b.innerHTML = 'يوم الكنيسة<small>قراءات · سنكسار · موسم · تأمل · لحن</small>';
    var h4 = document.createElement('h4'); h4.textContent = 'اليوم';
    var first = box.querySelector('h4');
    if (first) { box.insertBefore(h4, first); box.insertBefore(b, first); } else { box.appendChild(h4); box.appendChild(b); }
  }
  function boot() { try { injectHome(); injectMore(); } catch (e) {} }
  new MutationObserver(boot).observe(document.body, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', boot);
  setTimeout(boot, 800);

  /* ---------- الأحداث ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return; var b;
    if ((b = t.closest('[data-cdopen]'))) { e.preventDefault(); try { F().closeSheet(); } catch (x) {} open(); return; }
    if ((b = t.closest('[data-cdclose]'))) { close(); return; }
    if ((b = t.closest('[data-cdsx]'))) {
      e.preventDefault(); close(); try { F().closeSheet(); } catch (x) {}
      if (window.__prog && window.__prog.openSeason) window.__prog.openSeason(b.getAttribute('data-cdsx'));
      return;
    }
    if ((b = t.closest('[data-cdgo]'))) {
      var g = b.getAttribute('data-cdgo');
      if (g.indexOf('hymn:') === 0) { if (window.__hymnsUI) window.__hymnsUI.open(g.slice(5)); return; }
      close();
      var R = window.__rafeeq; if (!R) return;
      if (g === 'syn') R.show('syn', { top: 1 }); else R.act(g === 'med' ? 'meditation' : g);
      return;
    }
  });
  document.addEventListener('keydown', function (e) { var el = document.getElementById('churchDay'); if (e.key === 'Escape' && el && el.classList.contains('on') && !(document.getElementById('progDay') && document.getElementById('progDay').classList.contains('on'))) close(); });

  /* قراءات القطمارس تُهيَّأ مرة واحدة فقط سواء فُتحت صفحتها أو هذه الشاشة أولًا */
  window.__ensureReadings = function () { if (window.__rdInited || !window.__initReadings) return; window.__rdInited = 1; window.__initReadings(); };

  window.__churchDay = { open: open, close: close, build: build };
})();
