/* v6.11.0 — «الكتاب المقدس الدراسي»: قسم واحد يجمع أدوات الدراسة (أطلس الكتاب + المقارنات والمجموعات):
   الأناجيل (حدث واحد بنص متى ومرقس ولوقا ويوحنا جنبًا إلى جنب) · الملوك والأخبار · نبوّة وتحقيق · الرمز والمرموز · المسيح حسب الموضوع · حياة المسيح (٥٧ محطة)،
   ثم الشخصيات والأنساب والخرائط (واجهتها في app51.js وتشارك هذا الشريط).
   البيانات من content/study/*.json عبر tools/content-build.mjs (window.__study)؛ والنصوص تُقرأ من الكتاب المقدس داخل البرنامج (F().bible) فلا نسخ ولا إنترنت.
   تفتح من تبويب «الكتاب الدراسي» في الكتاب ومن «المزيد» ومن البحث الموحّد، وتفتح المراجع في الكتاب عبر F().openBible. */
(function () {
  'use strict';
  function F() { return window.__F || {}; }
  function D() { return window.__study || { sections: [] }; }
  function esc(s) { return RF.esc(s); }
  function ar(n) { return RF.ar(n); }
  var KEY = 'rafeeq_study_v1';
  var SHORT = { gospels: 'الأناجيل', kings: 'الملوك والأخبار', prophecy: 'نبوّة وتحقيق', types: 'الرمز والمرموز', themes: 'المسيح بالموضوع', life: 'حياة المسيح' };
  var ATLAS = [['people', 'الشخصيات'], ['lines', 'الأنساب'], ['maps', 'الخرائط']];
  var S = { sec: 'gospels', view: 'list', id: null, cat: {}, q: '', sel: {}, diff: true };
  var el = null;

  function secs() { return D().sections; }
  function sec(id) { var a = secs(); for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i]; return null; }
  function evSec(s) { return s.kind === 'life' ? sec(s.from) : s; }
  function evList(s) { var b = evSec(s); return b ? b.events || [] : []; }
  function evById(s, id) { var L = evList(s); for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i]; return null; }
  function catName(s, id) { var c = (evSec(s) || {}).cats || []; for (var i = 0; i < c.length; i++) if (c[i][0] === id) return c[i][1]; return ''; }
  function collById(s, id) { var L = s.collections || []; for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i]; return null; }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { } try { RF.favs && RF.favs.changed(); } catch (e) { } }
  function noteKey(s, id) { return (s.kind === 'life' ? s.from : s.id) + '/' + id; }

  function root() {
    if (el && document.body.contains(el)) return el;
    el = document.createElement('div');
    el.id = 'studyPg'; el.className = 'prg-page'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'الكتاب المقدس الدراسي');
    document.body.appendChild(el);
    return el;
  }
  function isOpen() { return !!(el && el.classList.contains('on')); }
  function close() { if (el) el.classList.remove('on'); }

  /* ---------- الشريط المشترك (يظهر أيضًا في صفحة الأطلس) ---------- */
  function bar(active) {
    function chip(id, label) { return '<button type="button" role="tab" aria-selected="' + (active === id) + '" class="gs-tab' + (active === id ? ' on' : '') + '" data-stb="' + id + '">' + esc(label) + '</button>'; }
    return '<small>الكتاب المقدس</small><h2>الكتاب المقدس الدراسي</h2><div class="gs-bar" role="tablist" aria-label="أقسام الدراسة">' +
      secs().map(function (s) { return chip(s.id, SHORT[s.id] || s.title); }).join('') + '<span class="gs-sep" aria-hidden="true"></span>' +
      ATLAS.map(function (a) { return chip(a[0], a[1]); }).join('') + '</div>';
  }

  /* ---------- النص ---------- */
  var STOP = {};
  'في من على الى الي الذي التي الذين هذا هذه ذلك كان كانت كانوا قال قالوا قالت له لهم لها لكم لك فقال وقال ثم ان انه انها لا ما هو هي هم قد كل مع عن اذ اذا او ام بل لكن حتي حيث ايضا هنا هناك الي اليه عليه عليهم منه منهم به بها فيه فيها لانه لان انا انت انتم نحن يا'.split(' ').forEach(function (w) { STOP[w] = 1; });
  function nrm(s) { var n = F().norm; return n ? n(s) : String(s); }
  /* جذع تقريبي: يُسقط واو/فاء العطف وأل التعريف وحروف الجر الملاصقة ولواحق الضمائر والجمع، فلا يُظلَّل «الأرض» لأن الآخر كتب «أرض» */
  function key(tok) {
    var k = nrm(String(tok).replace(/[«»"“”‘’،؛:.؟!()\[\]\-–—…]/g, '')).replace(/\s+/g, '');
    if (k.length > 3 && /^[وف]/.test(k)) k = k.slice(1);
    k = k.replace(/^(بال|كال|وال|فال|لل|ال)/, function (m) { return k.length - m.length >= 3 ? '' : m; });
    k = k.replace(/(هما|هم|ها|كم|نا|ون|ين|ان|ات|ه|ة|ي)$/, function (m) { return k.length - m.length >= 3 ? '' : m; });
    return k;
  }
  function bibleReady() { var b = F().bible; return !!(b && b.data && b.data.length); }
  function parts(refs) {
    /* [{ref, label, verses:[{n, t}]}] لكل مرجع */
    var b = F().bible, out = [];
    [].concat(refs).forEach(function (ref) {
      var r = b.parseRef(ref); if (!r) return;
      var vs = b.verses(r.bi, r.ch, r.v1, r.v2), a = r.v1 || 1;
      out.push({ ref: ref, label: b.label(r.bi, r.ch, r.v1, r.v2), verses: vs.map(function (t, i) { return { n: b.vNum(r.bi, r.ch, a + i), t: t }; }) });
    });
    return out;
  }
  function wordSet(ps) {
    var s = {};
    ps.forEach(function (p) { p.verses.forEach(function (v) { v.t.split(/\s+/).forEach(function (w) { var k = key(w); if (k) s[k] = 1; }); }); });
    return s;
  }
  function textHtml(ps, others, diff) {
    return ps.map(function (p, i) {
      var txt = p.verses.map(function (v) {
        var words = v.t.split(/(\s+)/).map(function (w) {
          if (!w.trim()) return w;
          var k = key(w), uniq = diff && others && k.length > 2 && !STOP[k] && !others[k];
          return uniq ? '<mark class="gs-u">' + esc(w) + '</mark>' : esc(w);
        }).join('');
        return '<sup>' + esc(ar(v.n)) + '</sup>' + words;
      }).join(' ');
      return (i ? '<hr class="gs-sep2">' : '') + '<p class="gs-t">' + txt + '</p>';
    }).join('');
  }
  function refsHtml(ps) { return ps.map(function (p) { return '<button type="button" class="gs-ref" data-gsref="' + esc(p.ref) + '">' + esc(p.label) + '</button>'; }).join(''); }

  /* ---------- القوائم ---------- */
  function badges(s, e) {
    var b = evSec(s);
    if (b.slots) return b.slots.map(function (k) { var c = null; e.cols.forEach(function (x) { if (x.k === k) c = x; }); return '<i class="' + (c ? 'on' : '') + '">' + esc(c ? c.s : '·') + '</i>'; }).join('');
    return e.cols.map(function (c) { return '<i class="on">' + esc(c.s || c.l.charAt(0)) + '</i>'; }).join('');
  }
  function evRows(s, list) {
    var nq = S.q && s.kind !== 'life' ? nrm(S.q) : '', cat = S.cat[s.id] || 'all', life = load().life || {};
    var rows = list.filter(function (e) { return (cat === 'all' || e.cat === cat) && (!nq || nrm(e.title + ' ' + (e.note || '')).indexOf(nq) > -1); });
    if (!rows.length) return '<p class="gs-empty">لا نتائج.</p>';
    var out = '', last = '';
    rows.forEach(function (e) {
      if (s.kind !== 'life' && cat === 'all' && !nq && e.cat !== last) { last = e.cat; out += '<h3 class="gs-h">' + esc(catName(s, e.cat)) + '</h3>'; }
      out += '<button type="button" class="gs-row' + (s.kind === 'life' && life[e.id] ? ' done' : '') + '" data-gse="' + esc(e.id) + '">' +
        (s.kind === 'life' ? '<span class="gs-n">' + (life[e.id] ? '✓' : esc(ar(list.indexOf(e) + 1))) + '</span>' : '') + '<b>' + esc(e.title) + '</b><span class="gs-bd">' + badges(s, e) + '</span></button>';
    });
    return out;
  }
  function listHtml(s) {
    if (s.kind === 'collection') {
      var nq = S.q ? nrm(S.q) : '', rows = s.collections.filter(function (c) { return !nq || nrm(c.title + ' ' + (c.sub || '')).indexOf(nq) > -1; });
      return rows.length ? rows.map(function (c) { return '<button type="button" class="gs-row" data-gsco="' + esc(c.id) + '"><span class="gs-ct"><b>' + esc(c.title) + '</b>' + (c.sub ? '<small>' + esc(c.sub) + '</small>' : '') + '</span><span class="gs-cn">' + esc(ar(c.items.length)) + '</span></button>'; }).join('') : '<p class="gs-empty">لا نتائج.</p>';
    }
    if (s.kind === 'life') {
      var order = s.order.map(function (id) { return evById(s, id); }).filter(Boolean);
      return evRows(s, order);
    }
    return evRows(s, s.events);
  }
  function lifeHead(s) {
    var done = load().life || {}, n = s.order.length, c = s.order.filter(function (id) { return done[id]; }).length;
    var next = null; for (var i = 0; i < s.order.length; i++) if (!done[s.order[i]]) { next = evById(s, s.order[i]); break; }
    return '<div class="gs-prog" role="progressbar" aria-valuemin="0" aria-valuemax="' + n + '" aria-valuenow="' + c + '"><b>' + esc(ar(c)) + ' من ' + esc(ar(n)) + ' محطة</b><span><i style="width:' + Math.round(100 * c / n) + '%"></i></span></div>' +
      (next ? '<button type="button" class="gs-go" data-gse="' + esc(next.id) + '"><small>' + (c ? 'تابع من حيث وقفت' : 'ابدأ الرحلة') + '</small><b>' + esc(next.title) + '</b></button>' : '<p class="gs-all">أتممتَ المحطات كلها ✓ — الحمد لله.</p>');
  }
  function mainHtml() {
    var s = sec(S.sec); if (!s) return '';
    var cats = (evSec(s) || {}).cats || [], cat = S.cat[s.id] || 'all';
    var searchable = s.kind !== 'life';
    return bar(s.id) + '<p class="gs-lead">' + esc(s.lead) + '</p>' + (s.kind === 'life' ? lifeHead(s) : '') +
      (searchable ? '<input id="gsQ" class="gs-q" type="search" inputmode="search" placeholder="ابحث في «' + esc(SHORT[s.id] || s.title) + '»…" value="' + esc(S.q) + '" aria-label="بحث">' : '') +
      (s.kind === 'parallel' && cats.length ? '<div class="gs-chips" role="group" aria-label="الأقسام"><button type="button" class="gs-chip' + (cat === 'all' ? ' on' : '') + '" data-gsc="all">الكل</button>' + cats.map(function (c) { return '<button type="button" class="gs-chip' + (cat === c[0] ? ' on' : '') + '" data-gsc="' + c[0] + '">' + esc(c[1]) + '</button>'; }).join('') + '</div>' : '') +
      '<div class="gs-list" id="gsList">' + listHtml(s) + '</div>' +
      '<p class="gs-foot">النصوص من الكتاب المقدس داخل البرنامج. الأزواج والمجموعات والملاحظات القصيرة من إعداد البرنامج وتحتاج مراجعة كنسية قبل اعتمادها' + (s.diff ? '، وتظليل الاختلافات آلي (كلمات لا ترد في الروايات الأخرى المعروضة)' : '') + '.</p>';
  }

  /* ---------- حدث ---------- */
  function eventHtml() {
    var s = sec(S.sec), ev = s && evById(s, S.id); if (!ev) return mainHtml();
    var b = evSec(s), shown = ev.cols.filter(function (c) { return S.sel[c.k] !== 0; }), cards = '';
    if (!bibleReady()) cards = '<p class="gs-hint">جارٍ تجهيز الكتاب المقدس…</p>';
    else {
      var P = {}; shown.forEach(function (c) { P[c.k] = parts(c.r); });
      var diff = !!(b.diff && S.diff);
      shown.forEach(function (c) {
        var others = null;
        if (diff && shown.length > 1) { var all = []; shown.forEach(function (h) { if (h !== c) all = all.concat(P[h.k]); }); others = wordSet(all); }
        cards += '<article class="gs-card c' + ev.cols.indexOf(c) + '"><header><b>' + esc(c.l) + '</b><span>' + refsHtml(P[c.k]) + '</span></header>' + textHtml(P[c.k], others, diff) + '</article>';
      });
    }
    var L = s.kind === 'life' ? s.order.map(function (id) { return evById(s, id); }) : s.events, ix = L.indexOf(ev), prev = L[ix - 1], next = L[ix + 1], mine = load().notes || {}, my = mine[noteKey(s, ev.id)] || '';
    var life = load().life || {};
    return '<button type="button" class="gs-back" data-gsx="1">‹ ' + esc(SHORT[s.id] || s.title) + '</button><small class="gs-cat">' + (s.kind === 'life' ? 'المحطة ' + esc(ar(ix + 1)) + ' من ' + esc(ar(L.length)) : esc(catName(s, ev.cat))) + '</small><h2>' + esc(ev.title) + '</h2>' +
      '<div class="gs-chips" role="group" aria-label="الأعمدة">' + ev.cols.map(function (c, i) { return '<button type="button" class="gs-chip c' + i + (S.sel[c.k] !== 0 ? ' on' : '') + '" aria-pressed="' + (S.sel[c.k] !== 0 ? 'true' : 'false') + '" data-gsg="' + esc(c.k) + '">' + esc(c.l) + '</button>'; }).join('') +
      (b.diff ? '<button type="button" class="gs-chip gs-dtg' + (S.diff ? ' on' : '') + '" aria-pressed="' + (S.diff ? 'true' : 'false') + '" data-gsd="1">ظلّل الاختلافات</button>' : '') + '</div>' +
      (b.diff && S.diff && shown.length > 1 ? '<p class="gs-lg"><mark class="gs-u">كلمات مظلّلة</mark> لا ترد في الروايات الأخرى المعروضة.</p>' : '') +
      '<div class="gs-cols">' + (shown.length ? cards : '<p class="gs-hint">اختر عمودًا واحدًا على الأقل.</p>') + '</div>' +
      (ev.note ? '<aside class="gs-note"><b>يلفت النظر</b><p>' + esc(ev.note) + '</p></aside>' : '') +
      (s.kind === 'life' ? '<button type="button" class="gs-read' + (life[ev.id] ? ' on' : '') + '" data-gsl="' + esc(ev.id) + '" aria-pressed="' + (life[ev.id] ? 'true' : 'false') + '">' + (life[ev.id] ? '✓ قرأتُ هذه المحطة (اضغط للتراجع)' : 'قرأتُ هذه المحطة') + '</button>' : '') +
      '<section class="gs-me"><h3>للتأمل</h3><p>' + (b.id === 'gospels' ? 'إيه اللي اتفرّد بيه كل إنجيلي؟ وإيه اللي بتقوله لي أنا في هذا الحدث؟' : b.id === 'kings' ? 'إيه اللي اختلف في رواية الأخبار؟ ولماذا ركّز عليه الكاتب؟' : b.id === 'prophecy' || b.id === 'types' ? 'كيف رأى كاتب العهد الجديد الصلة بين النصين؟ وماذا تضيف لك؟' : 'إيه اللي لفت نظرك؟') + '</p>' +
      '<textarea id="gsMe" rows="3" maxlength="600" placeholder="اكتب ما لفت نظرك — يُحفظ على جهازك فقط" aria-label="ملاحظتي">' + esc(my) + '</textarea></section>' +
      '<nav class="gs-nav">' + (prev ? '<button type="button" data-gse="' + esc(prev.id) + '">‹ ' + esc(prev.title) + '</button>' : '<span></span>') + (next ? '<button type="button" data-gse="' + esc(next.id) + '">' + esc(next.title) + ' ›</button>' : '<span></span>') + '</nav>';
  }

  /* ---------- مجموعة آيات ---------- */
  function collHtml() {
    var s = sec(S.sec), c = s && collById(s, S.id); if (!c) return mainHtml();
    var out = '<button type="button" class="gs-back" data-gsx="1">‹ ' + esc(SHORT[s.id] || s.title) + '</button><small class="gs-cat">' + esc(ar(c.items.length)) + ' موضعًا</small><h2>' + esc(c.title) + '</h2>' + (c.sub ? '<p class="gs-lead">' + esc(c.sub) + '</p>' : '');
    if (!bibleReady()) return out + '<p class="gs-hint">جارٍ تجهيز الكتاب المقدس…</p>';
    out += '<div class="gs-items">' + c.items.map(function (it) {
      var ps = parts(it.r);
      return '<article class="gs-card c0"><header><b>' + esc(it.t) + '</b><span>' + refsHtml(ps) + '</span></header>' + textHtml(ps, null, false) + '</article>';
    }).join('') + '</div>';
    var L = s.collections, ix = L.indexOf(c), prev = L[ix - 1], next = L[ix + 1];
    return out + '<nav class="gs-nav">' + (prev ? '<button type="button" data-gsco="' + esc(prev.id) + '">‹ ' + esc(prev.title) + '</button>' : '<span></span>') + (next ? '<button type="button" data-gsco="' + esc(next.id) + '">' + esc(next.title) + ' ›</button>' : '<span></span>') + '</nav>';
  }

  function render(keepTop) {
    var e = root(), top = keepTop ? e.scrollTop : 0;
    e.innerHTML = '<button type="button" class="pg-x" data-gsx="x" aria-label="إغلاق">✕</button><div class="pd-c gs-c">' + (S.view === 'event' ? eventHtml() : S.view === 'coll' ? collHtml() : mainHtml()) + '</div>';
    e.classList.add('on'); e.scrollTop = top;
  }
  function ensureBible() {
    var b = F().bible; if (!b || !b.load || bibleReady()) return;
    b.load().then(function () { if (isOpen() && S.view !== 'list') render(true); });
  }
  function openSection(id) {
    if (!sec(id)) id = 'gospels';
    S.sec = id; S.view = 'list'; S.id = null; S.q = ''; render(false); el.scrollTop = 0;
  }
  function open(id, item) {
    var s = sec(id); try { window.__atlasUI && window.__atlasUI.close(); } catch (e) { }
    if (!s) { openSection(S.sec || 'gospels'); return; }
    if (S.sec !== id) S.q = '';
    S.sec = id;
    if (item && s.kind === 'collection' && collById(s, item)) { S.view = 'coll'; S.id = item; render(false); ensureBible(); }
    else if (item && evById(s, item)) { S.view = 'event'; S.id = item; S.sel = {}; render(false); ensureBible(); }
    else openSection(id);
  }
  function back() { if (S.view === 'list') close(); else { S.view = 'list'; S.id = null; render(true); } }
  function openRef(ref) {
    var b = F().bible; if (!b || !b.load) return;
    b.load().then(function () {
      var r = b.parseRef(ref); if (!r) { F().toast && F().toast('تعذّر فتح المرجع'); return; }
      close(); F().openBible(r.bi, r.ch, r.v1 || 1);
    });
  }

  document.addEventListener('click', function (e) {
    var t = e.target, b; if (!t || !t.closest) return;
    if ((b = t.closest('[data-study]'))) { e.preventDefault(); e.stopPropagation(); try { F().closeSheet(); } catch (x) { } open(S.sec || 'gospels'); return; }
    /* شريط الأقسام: يظهر هنا وفي صفحة الأطلس */
    if ((b = t.closest('[data-stb]'))) {
      var id = b.getAttribute('data-stb'), at = ATLAS.some(function (a) { return a[0] === id; });
      e.preventDefault(); e.stopPropagation();
      if (at) { close(); if (window.__atlasUI) window.__atlasUI.open(id); } else open(id);
      return;
    }
    if (!el || !el.contains(t)) return;
    if ((b = t.closest('[data-gsx]'))) return b.getAttribute('data-gsx') === 'x' ? close() : back();
    if ((b = t.closest('[data-gse]'))) { S.view = 'event'; S.id = b.getAttribute('data-gse'); S.sel = {}; render(false); el.scrollTop = 0; ensureBible(); return; }
    if ((b = t.closest('[data-gsco]'))) { S.view = 'coll'; S.id = b.getAttribute('data-gsco'); render(false); el.scrollTop = 0; ensureBible(); return; }
    if ((b = t.closest('[data-gsc]'))) { S.cat[S.sec] = b.getAttribute('data-gsc'); return render(true); }
    if ((b = t.closest('[data-gsg]'))) { var k = b.getAttribute('data-gsg'); S.sel[k] = S.sel[k] === 0 ? 1 : 0; return render(true); }
    if (t.closest('[data-gsd]')) { S.diff = !S.diff; return render(true); }
    if ((b = t.closest('[data-gsl]'))) { var o = load(); o.life = o.life || {}; var lid = b.getAttribute('data-gsl'); if (o.life[lid]) delete o.life[lid]; else o.life[lid] = Date.now(); save(o); return render(true); }
    if ((b = t.closest('[data-gsref]'))) return openRef(b.getAttribute('data-gsref'));
  });
  document.addEventListener('input', function (e) {
    var t = e.target; if (!t) return;
    if (t.id === 'gsQ') { S.q = t.value; var s = sec(S.sec), l = document.getElementById('gsList'); if (l && s) l.innerHTML = listHtml(s); }
    else if (t.id === 'gsMe') { var s2 = sec(S.sec), o = load(); o.notes = o.notes || {}; var k = noteKey(s2, S.id); if (t.value.trim()) o.notes[k] = t.value; else delete o.notes[k]; save(o); }
  });
  document.addEventListener('keydown', function (e) { if (isOpen() && e.key === 'Escape') back(); });

  /* ---------- المداخل: «المزيد» + المفضلات + البحث الموحّد ---------- */
  function injectMore() {
    var box = document.querySelector('#uSheet .v14-more');
    if (!box || box.querySelector('[data-study]')) return;
    /* زر واحد تحت قسم «الكتاب المقدس» بدل «أطلس الكتاب» و«الحدث في أكثر من إنجيل» المنفصلين */
    var old = box.querySelector('[data-atlas]'); if (old) { var h = old.previousElementSibling; old.remove(); if (h && h.tagName === 'H4' && !(h.nextElementSibling && h.nextElementSibling.tagName === 'BUTTON')) h.remove(); }
    var h4 = document.createElement('h4'); h4.textContent = 'الدراسة';
    var b = document.createElement('button'); b.type = 'button'; b.setAttribute('data-study', '1');
    b.innerHTML = 'الكتاب المقدس الدراسي<small>أناجيل · نبوّات · موضوعات · أطلس</small>';
    var hs = [].slice.call(box.querySelectorAll('h4')), bi = -1, i;
    for (i = 0; i < hs.length; i++) if (/الكتاب المقدس/.test(hs[i].textContent)) { bi = i; break; }
    var nxt = bi > -1 ? hs[bi + 1] : null;
    if (nxt) { box.insertBefore(h4, nxt); box.insertBefore(b, nxt); } else { box.appendChild(h4); box.appendChild(b); }
  }
  new MutationObserver(injectMore).observe(document.body, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', injectMore);
  setTimeout(injectMore, 700);

  RF.favs.register({
    id: 'study', order: 77, ic: '📜', t: 'ملاحظاتي في الكتاب الدراسي',
    hint: 'في أي حدث من «الكتاب المقدس الدراسي» اكتب ما لفت نظرك — يتحفظ هنا تلقائيًا.', key: KEY,
    items: function () {
      var o = (load().notes) || {}, out = [];
      Object.keys(o).forEach(function (k) { var p = k.split('/'), s = sec(p[0]), e = s && evById(s, p[1]); if (e && String(o[k]).trim()) out.push({ id: k, head: e.title, sub: SHORT[s.id] || s.title, text: String(o[k]), ts: 0 }); });
      return out;
    },
    rm: function (id) { var o = load(); if (o.notes) delete o.notes[id]; save(o); }
  });

  RF.search.register({
    id: 'study', title: 'الكتاب المقدس الدراسي', order: 66,
    run: function (q, nq) {
      var rows = [];
      if (nq.length < 2) return rows;
      secs().forEach(function (s) {
        if (s.kind === 'life') return;
        (s.kind === 'collection' ? s.collections : s.events).forEach(function (e) {
          if (rows.length < 10 && nrm(e.title + ' ' + (e.note || e.sub || '')).indexOf(nq) > -1) rows.push({ go: 'study:' + s.id + ':' + e.id, title: e.title, sub: 'الكتاب الدراسي — ' + (SHORT[s.id] || s.title) });
        });
      });
      return rows;
    },
    go: function (p) { open(p[1], p[2]); }
  });
  window.__studyUI = { open: open, close: close, bar: bar, isOpen: isOpen };
})();
