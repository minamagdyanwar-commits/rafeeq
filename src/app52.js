/* دفتري مع يسوع (التصميم ١٢): مكوّنات الواجهة الخاصة — «صفحة اليوم» بديل الرئيسية، الغلاف، الشريط المرجعي (الفهرس)، ركن الصفحة، وسطر «لك أنت».
   يعمل فقط حين يكون التصميم diary/ (html[data-rf-theme^="diary/"]). باقي الصفحات يُلبسها app52.css مظهر الدفتر دون تغيير وظيفتها. */
(function () {
  'use strict';
  var KL = 'rafeeq_diary_lines_v1', KC = 'rafeeq_diary_cover';
  try {
    RF.keys[KL] = 'دفتري مع يسوع: ما كتبته لربنا في «صفحة اليوم» لكل يوم';
    RF.keys[KC] = 'دفتري مع يسوع: إظهار الغلاف عند الفتح (٠ = إخفاء)';
  } catch (e) { }
  function F() { return window.__F || {}; }
  function K() { return window.__k || {}; }
  function esc(s) { return RF.esc(s); }
  function ar(n) { return RF.ar(n); }
  function q(s, r) { return (r || document).querySelector(s); }
  function on() { return /^diary\//.test(document.documentElement.getAttribute('data-rf-theme') || ''); }
  function key(d) { var m = d.getMonth() + 1, x = d.getDate(); return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (x < 10 ? '0' : '') + x; }
  function dkey() { var f = F(); return f.dkey ? f.dkey() : key(new Date()); }

  /* ---------- بيانات اليوم (نفس مصادر بقية التصاميم) ---------- */
  function info() {
    var f = F(), k = K(), i = { items: [], sug: '', sugLabel: '', streak: 0, verse: '', vref: '', wd: '', dt: '', off: false, offLabel: '', done: 0, total: 1, today: dkey() };
    try { i.items = (f.dayPlan ? f.dayPlan(i.today).items : f.todayItems(i.today)) || []; } catch (e) { }
    try { i.sug = k.getSuggestedHourKey ? k.getSuggestedHourKey() : ''; } catch (e) { }
    try { var H = (k.HOURS || {})[i.sug]; i.sugLabel = H ? String(H.label || '').replace(/^صلاة\s*/, '').split(' — ')[0] : ''; } catch (e) { }
    i.off = !!(f.realKey && f.dkey && f.dkey() !== f.realKey());
    try { i.offLabel = f.parseKey(i.today).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' }); } catch (e) { i.offLabel = i.today; }
    try { i.streak = f.streak() || 0; } catch (e) { }
    var v = q('.hm-verse p'), vs = q('.hm-verse small'), dd = q('.hm-date b'), ds = q('.hm-date span');
    i.verse = v ? v.textContent.trim().replace(/^[«"]|[»"]$/g, '') : '';
    i.vref = vs ? vs.textContent.trim() : '';
    i.wd = dd ? dd.textContent.trim() : '';
    i.dt = ds ? ds.textContent.trim() : '';
    i.done = i.items.filter(function (x) { return x.done; }).length;
    i.total = i.items.length || 1;
    return i;
  }
  /* نفس ربط عناصر الخطة بأفعالها الذي تستخدمه التصاميم الأخرى (يعالجه مستمع النقر العام) */
  function act(it) {
    if (it.type === 'hour') return 'data-act="hour" data-key="' + esc(it.gid) + '"';
    if (it.type === 'read') return 'data-act="read"';
    if (it.type === 'med') return 'data-act="meditation"';
    if (it.type === 'exam') return 'data-act="exam"';
    if (it.type === 'prog') return 'data-prog="cur"';
    if (it.type === 'memo') return 'data-act="memo"';
    if (it.type === 'gd') return 'data-act="guided"';
    return 'data-act="agpeya"';
  }

  /* ---------- صفحة اليوم ---------- */
  function lines() { return RF.jget(KL, {}) || {}; }
  function topHtml(i) {
    return '<header class="dy-greet"><p class="dy-h1">يا حبيبي،</p><p class="dy-h2">كتبتُ لك اليوم:</p></header>' +
      (i.verse ? '<blockquote class="dy-verse"><span>' + esc(i.verse) + '</span></blockquote><small class="dy-ref">' + esc(i.vref) + '</small>' : '') +
      (i.off ? '<div class="dy-sticky"><b>تدوّن الآن ليوم ' + esc(i.offLabel) + '</b><button type="button" data-dayfix="1">↩ ارجع لليوم الفعلي</button></div>' : '');
  }
  function planHtml(i) {
    var rows = i.items.map(function (it) {
      var now = !it.done && it.type === 'hour' && it.gid === i.sug;
      return '<li><button type="button" class="dy-todo' + (it.done ? ' done' : '') + (now ? ' now' : '') + '" ' + act(it) + '><i class="dy-box"></i><span>' + esc(it.label) + '</span>' + (now ? '<em>الآن</em>' : '') + '</button></li>';
    }).join('');
    var go = i.sug && i.sugLabel ? '<button type="button" class="dy-go" data-act="hour" data-key="' + esc(i.sug) + '">صلاة ' + esc(i.sugLabel) + ' ‹</button>' : '';
    return '<h2 class="dy-h"><span>خطتي مع يسوع اليوم</span><b class="dy-count">' + ar(i.done) + ' من ' + ar(i.total) + '</b></h2><ul class="dy-plan">' + rows + '</ul>' + go +
      (i.streak > 1 ? '<div class="dy-stamp" aria-label="أيام متتالية"><b>' + ar(i.streak) + '</b><small>يومًا متتاليًا</small></div>' : '');
  }
  function turnHtml() { return '<nav class="dy-turn" aria-label="تقليب الأيام"><button type="button" data-dyday="-1">‹ أمس</button><span>·</span><button type="button" data-dyday="1">غدًا ›</button></nav>'; }
  function saveLine(v) {
    var o = lines(), k = dkey();
    if (v && v.trim()) o[k] = v; else delete o[k];
    RF.jset(KL, o);
  }
  var tmSave = 0;
  function paintHome() {
    var w = q('#page-home .u-wrap'), el = document.getElementById('dyHome');
    if (!on() || !w) { if (el) el.remove(); return; }
    var i = info();
    if (!el) {
      el = document.createElement('section'); el.id = 'dyHome';
      el.innerHTML = '<div id="dyTop"></div><div id="dyPlan"></div><h2 class="dy-h"><span>سطر لك أنت…</span></h2>' +
        '<textarea id="dyTa" class="dy-ta" rows="3" placeholder="اكتب لربنا كلمة قبل المساء…" aria-label="سطر لك أنت"></textarea><div id="dyTurn"></div>';
      w.insertBefore(el, w.firstChild);
      q('#dyTa', el).addEventListener('input', function (e) {
        var v = e.target.value; clearTimeout(tmSave); tmSave = setTimeout(function () { saveLine(v); }, 400);
      });
      q('#dyTurn', el).innerHTML = turnHtml();
    }
    var t = topHtml(i), p = planHtml(i), tn = q('#dyTop', el), pn = q('#dyPlan', el);
    if (tn.dataset.h !== t) { tn.innerHTML = t; tn.dataset.h = t; }
    if (pn.dataset.h !== p) { pn.innerHTML = p; pn.dataset.h = p; }
    var ta = q('#dyTa', el);
    if (ta.dataset.k !== i.today) { ta.dataset.k = i.today; if (document.activeElement !== ta) ta.value = lines()[i.today] || ''; }
  }

  /* ---------- الشريط المرجعي (الفهرس) وركن الصفحة ---------- */
  function chrome() {
    var has = document.getElementById('dyRibbon');
    if (!on()) { if (has) has.remove(); var c0 = document.getElementById('dyCurl'); if (c0) c0.remove(); return; }
    if (!has) {
      has = document.createElement('button'); has.type = 'button'; has.id = 'dyRibbon'; has.setAttribute('aria-label', 'الفهرس'); has.title = 'الفهرس';
      document.body.appendChild(has);
    }
    var c = document.getElementById('dyCurl');
    if (!c) {
      c = document.createElement('button'); c.type = 'button'; c.id = 'dyCurl'; c.setAttribute('aria-label', 'تغيير اليوم'); c.title = 'تغيير اليوم';
      document.body.appendChild(c);
    }
    c.hidden = document.documentElement.getAttribute('data-pg') !== 'home';
  }

  /* ---------- الفهرس: صفحة بنود «المزيد» (أسطر بنقاط وأرقام صفحات). كل سطر يضغط الزر الأصلي فتبقى الوظائف كما هي ---------- */
  function openIndex() {
    var src = q('#uSheet .v14-more'); if (!src || document.getElementById('dyIndex')) return;
    var html = '', open = false, n = 0, btns = [];
    [].slice.call(src.children).forEach(function (el) {
      if (el.tagName === 'H4') { if (open) html += '</ul>'; html += '<h2>' + esc(el.textContent) + '</h2><ul>'; open = true; }
      else if (el.tagName === 'BUTTON') {
        var sm = q('small', el), t = el.cloneNode(true); var s2 = q('small', t); if (s2) s2.remove();
        if (!open) { html += '<ul>'; open = true; }
        html += '<li><button type="button" data-ix="' + (btns.length) + '">' + esc(t.textContent.trim()) + (sm ? '<small>' + esc(sm.textContent) + '</small>' : '') + '</button></li>';
        btns.push(el); n++;
      }
    });
    if (open) html += '</ul>';
    var ov = document.createElement('div'); ov.id = 'dyIndex'; ov.className = 'prg-page on'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'الفهرس');
    ov.innerHTML = '<button type="button" class="dy-ixx" data-ixclose="1" aria-label="إغلاق">✕</button><div class="dy-ix"><h1>الفهرس</h1><p class="dy-ixsub">اضغط على أي سطر لتفتح صفحته</p>' + html +
      '<div class="dy-ixnote">اضغط على الشريط الأحمر 🔖 في أعلى أي صفحة لتفتح الفهرس</div></div>';
    ov._btns = btns; document.body.appendChild(ov); document.documentElement.classList.add('dy-idx');
  }
  function closeIndex(real) {
    var ov = document.getElementById('dyIndex'); if (ov) ov.remove();
    document.documentElement.classList.remove('dy-idx');
    if (real) { try { F().closeSheet(); } catch (e) { } }
  }

  /* ---------- الغلاف: يظهر مرة عند فتح البرنامج ---------- */
  function seen() { try { return sessionStorage.getItem('dy_cover') === '1'; } catch (e) { return false; } }
  function coverOn() { try { return localStorage.getItem(KC) !== '0'; } catch (e) { return true; } }
  function showCover() {
    if (!on() || seen() || !coverOn() || document.getElementById('dyCover')) return;
    var i = info(), el = document.createElement('div');
    el.id = 'dyCover'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'غلاف الدفتر');
    el.innerHTML = '<div class="dy-cv"><div class="dy-cv-x">✝</div><h1>دفتري<br>مع يسوع</h1><i class="dy-cv-rule"></i>' +
      '<p>«ها أنا واقفٌ على الباب وأقرع»<small>رؤيا ٣: ٢٠</small></p><button type="button" id="dyOpen">افتح الدفتر</button>' +
      '<small class="dy-cv-date">' + esc((i.wd ? i.wd + ' · ' : '') + i.dt) + '</small></div>';
    document.body.appendChild(el);
    var b = q('#dyOpen', el); if (b) setTimeout(function () { try { b.focus(); } catch (e) { } }, 50);
  }
  function openCover() {
    var el = document.getElementById('dyCover'); if (!el) return;
    try { sessionStorage.setItem('dy_cover', '1'); } catch (e) { }
    el.classList.add('open'); setTimeout(function () { if (el.parentNode) el.remove(); }, 650);
  }

  /* ---------- ظرف الاعتراف: يُضاف أسفل صفحة المحاسبة ويفتح تبويب «ورقة الاعتراف» ---------- */
  function ensureEnv() {
    var host = q('#viewToday') || q('#mod-m .wrap'); if (!host) return;
    var has = host.querySelector('.dy-env');
    if (!on()) { if (has) has.remove(); return; }
    if (has) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'dy-env'; b.setAttribute('aria-label', 'ورقة الاعتراف');
    b.innerHTML = '<span class="dy-env-flap"></span><i class="dy-wax">✝</i><b>ورقة الاعتراف · محمية برمز 🔒</b>';
    host.appendChild(b);
  }
  /* ---------- زر الغلاف في الإعدادات (يظهر فقط مع هذا التصميم) ---------- */
  function settingsRow() {
    var box = document.getElementById('themesBox'); if (!box) return;
    var row = document.getElementById('dyCoverRow');
    if (!on()) { if (row) row.remove(); return; }
    if (row) return;
    row = document.createElement('label'); row.id = 'dyCoverRow'; row.className = 'dy-set';
    row.innerHTML = '<input type="checkbox" id="dyCoverTog"' + (coverOn() ? ' checked' : '') + '><span>إظهار غلاف الدفتر عند فتح البرنامج</span>';
    box.appendChild(row);
    q('#dyCoverTog', row).addEventListener('change', function (e) { try { localStorage.setItem(KC, e.target.checked ? '1' : '0'); } catch (x) { } });
  }

  /* ---------- الأحداث ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return;
    if (t.closest('#dyOpen')) { openCover(); return; }
    if (t.closest('#dyRibbon')) { e.preventDefault(); var m = document.getElementById('uNavMore'); if (m) m.click(); return; }
    if (t.closest('[data-ixclose]')) { e.preventDefault(); closeIndex(true); return; }
    var ix = t.closest('[data-ix]');
    if (ix) { e.preventDefault(); var ov = document.getElementById('dyIndex'), bt = ov && ov._btns && ov._btns[+ix.getAttribute('data-ix')]; closeIndex(false); if (bt) bt.click(); return; }
    if (t.closest('#dyCurl')) { e.preventDefault(); try { F().dayDialog(); } catch (x) { } return; }
    if (t.closest('.dy-env')) { e.preventDefault(); var tc = document.getElementById('tabConf'); if (tc) tc.click(); return; }
    var d = t.closest('[data-dyday]');
    if (d) {
      e.preventDefault(); var f = F(), n = +d.getAttribute('data-dyday');
      try { f.setEntry(f.dkey(f.addDays(f.parseKey(f.dkey()), n)), false); } catch (x) { }
    }
  });
  function all() { chrome(); paintHome(); settingsRow(); showCover(); ensureEnv(); }
  new MutationObserver(function () { all(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-rf-theme', 'data-pg'] });
  var tmEnv = 0, exam0 = 0;
  function watchExam() { var x = document.getElementById('page-exam'); if (!x || exam0) return; exam0 = 1; new MutationObserver(function () { clearTimeout(tmEnv); tmEnv = setTimeout(ensureEnv, 150); }).observe(x, { childList: true, subtree: true }); ensureEnv(); }
  var box0 = 0;
  function watchBox() { var b = document.getElementById('themesBox'); if (!b || box0) return; box0 = 1; new MutationObserver(settingsRow).observe(b, { childList: true }); settingsRow(); }
  if (window.RF && RF.act && RF.act.on) RF.act.on(function () { paintHome(); });
  document.addEventListener('rafeeq:theme', all);
  document.addEventListener('click', function (e) { if (on() && e.target.closest && e.target.closest('#uNavMore,#dyRibbon')) setTimeout(openIndex, 120); setTimeout(function () { paintHome(); watchBox(); }, 350); }, true);
  setInterval(function () { if (!document.hidden) paintHome(); }, 10000);
  window.addEventListener('pageshow', all);
  function boot() { all(); watchBox(); watchExam(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  setTimeout(boot, 900);
  window.__diary = { on: on, paint: all };
})();
