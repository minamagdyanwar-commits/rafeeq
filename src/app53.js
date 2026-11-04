/* v6.10.0 — «الحدث في أكثر من إنجيل»: الحدث الواحد كما رواه متى ومرقس ولوقا ويوحنا جنبًا إلى جنب، مع تظليل الكلمات التي ينفرد بها كل إنجيل.
   الفهرس (٥٧ حدثًا) من content/gospels/parallels.json عبر tools/content-build.mjs (window.__gospels)؛ والنصوص تُقرأ من الكتاب المقدس داخل البرنامج نفسه (F().bible)،
   فلا نسخ ولا إنترنت. تفتح من «المزيد» ومن تبويب «الأناجيل» في الكتاب ومن البحث الموحّد، وتفتح المراجع في الكتاب عبر F().openBible. */
(function () {
  'use strict';
  function F() { return window.__F || {}; }
  function G() { return window.__gospels || { cats: [], events: [] }; }
  function esc(s) { return RF.esc(s); }
  function ar(n) { return RF.ar(n); }
  var ORD = ['mt', 'mk', 'lk', 'jn'], NM = { mt: 'متى', mk: 'مرقس', lk: 'لوقا', jn: 'يوحنا' }, SH = { mt: 'م', mk: 'مر', lk: 'لو', jn: 'يو' };
  var KEY = 'rafeeq_gospels_v1';
  var S = { view: 'main', cat: 'all', q: '', id: null, sel: { mt: 1, mk: 1, lk: 1, jn: 1 }, diff: true };
  var el = null;

  function byId(id) { var E = G().events; for (var i = 0; i < E.length; i++) if (E[i].id === id) return E[i]; return null; }
  function catName(id) { var c = G().cats; for (var i = 0; i < c.length; i++) if (c[i][0] === id) return c[i][1]; return ''; }
  function gospelsOf(ev) { return ORD.filter(function (g) { return ev.refs[g]; }); }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { } try { RF.favs && RF.favs.changed(); } catch (e) { } }

  function root() {
    if (el && document.body.contains(el)) return el;
    el = document.createElement('div');
    el.id = 'gospelsPg'; el.className = 'prg-page'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'الحدث في أكثر من إنجيل');
    document.body.appendChild(el);
    return el;
  }
  function isOpen() { return !!(el && el.classList.contains('on')); }
  function close() { if (el) el.classList.remove('on'); }

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
  function parts(g, ev) {
    /* [{label, ref, verses:[{n, t}]}] لكل مرجع في هذا الإنجيل */
    var b = F().bible, out = [];
    ev.refs[g].forEach(function (ref) {
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
  function cardHtml(g, ps, others) {
    var body = ps.map(function (p, i) {
      var txt = p.verses.map(function (v) {
        var words = v.t.split(/(\s+)/).map(function (w) {
          if (!w.trim()) return w;
          var k = key(w), uniq = S.diff && others && k.length > 2 && !STOP[k] && !others[k];
          return uniq ? '<mark class="gs-u">' + esc(w) + '</mark>' : esc(w);
        }).join('');
        return '<sup>' + esc(ar(v.n)) + '</sup>' + words;
      }).join(' ');
      return (i ? '<hr class="gs-sep">' : '') + '<p class="gs-t">' + txt + '</p>';
    }).join('');
    var refs = ps.map(function (p) { return '<button type="button" class="gs-ref" data-gsref="' + esc(p.ref) + '">' + esc(p.label) + '</button>'; }).join('');
    return '<article class="gs-card g-' + g + '"><header><b>' + NM[g] + '</b><span>' + refs + '</span></header>' + body + '</article>';
  }

  /* ---------- الشاشات ---------- */
  function listHtml() {
    var nq = S.q ? nrm(S.q) : '', rows = G().events.filter(function (e) {
      return (S.cat === 'all' || e.cat === S.cat) && (!nq || nrm(e.title + ' ' + (e.note || '')).indexOf(nq) > -1);
    });
    if (!rows.length) return '<p class="gs-empty">لا نتائج.</p>';
    var out = '', last = '';
    rows.forEach(function (e) {
      if (S.cat === 'all' && !nq && e.cat !== last) { last = e.cat; out += '<h3 class="gs-h">' + esc(catName(e.cat)) + '</h3>'; }
      out += '<button type="button" class="gs-row" data-gse="' + esc(e.id) + '"><b>' + esc(e.title) + '</b><span class="gs-bd" aria-label="' + gospelsOf(e).map(function (g) { return NM[g]; }).join('، ') + '">' +
        ORD.map(function (g) { return '<i class="' + (e.refs[g] ? 'on' : '') + '">' + SH[g] + '</i>'; }).join('') + '</span></button>';
    });
    return out;
  }
  function mainHtml() {
    return '<h2>الحدث في أكثر من إنجيل</h2><p class="gs-lead">اقرأ الحدث الواحد كما رواه كل إنجيلي، وانظر ما اتفقوا عليه وما انفرد به كلٌّ منهم.</p>' +
      '<input id="gsQ" class="gs-q" type="search" inputmode="search" placeholder="ابحث عن حدث (التجلّي، العشاء الأخير…)" value="' + esc(S.q) + '" aria-label="بحث">' +
      '<div class="gs-chips" role="group" aria-label="الأقسام"><button type="button" class="gs-chip' + (S.cat === 'all' ? ' on' : '') + '" data-gsc="all">الكل</button>' +
      G().cats.map(function (c) { return '<button type="button" class="gs-chip' + (S.cat === c[0] ? ' on' : '') + '" data-gsc="' + c[0] + '">' + esc(c[1]) + '</button>'; }).join('') + '</div>' +
      '<div class="gs-list" id="gsList">' + listHtml() + '</div>' +
      '<p class="gs-foot">النصوص من الكتاب المقدس داخل البرنامج. وتظليل الاختلافات آلي (كلمات لا ترد في الروايات الأخرى المعروضة)، أما الملاحظات القصيرة فتحتاج مراجعة كنسية قبل اعتمادها.</p>';
  }
  function eventHtml() {
    var ev = byId(S.id); if (!ev) return mainHtml();
    var gs = gospelsOf(ev), shown = gs.filter(function (g) { return S.sel[g]; });
    var b = F().bible;
    var cards = '';
    if (!b || !b.data || !b.data.length) cards = '<p class="gs-hint">جارٍ تجهيز الكتاب المقدس…</p>';
    else {
      var P = {}; shown.forEach(function (g) { P[g] = parts(g, ev); });
      shown.forEach(function (g) {
        var others = null;
        if (shown.length > 1) { var all = []; shown.forEach(function (h) { if (h !== g) all = all.concat(P[h]); }); others = wordSet(all); }
        cards += cardHtml(g, P[g], others);
      });
    }
    var E = G().events, ix = E.indexOf(ev), prev = E[ix - 1], next = E[ix + 1], mine = load()[ev.id] || '';
    return '<small class="gs-cat">' + esc(catName(ev.cat)) + '</small><h2>' + esc(ev.title) + '</h2>' +
      '<div class="gs-chips" role="group" aria-label="الأناجيل">' + gs.map(function (g) { return '<button type="button" class="gs-chip g-' + g + (S.sel[g] ? ' on' : '') + '" aria-pressed="' + (S.sel[g] ? 'true' : 'false') + '" data-gsg="' + g + '">' + NM[g] + '</button>'; }).join('') +
      '<button type="button" class="gs-chip gs-dtg' + (S.diff ? ' on' : '') + '" aria-pressed="' + (S.diff ? 'true' : 'false') + '" data-gsd="1">ظلّل الاختلافات</button></div>' +
      (S.diff && shown.length > 1 ? '<p class="gs-lg"><mark class="gs-u">كلمات مظلّلة</mark> لا ترد في الروايات الأخرى المعروضة.</p>' : '') +
      '<div class="gs-cols">' + (shown.length ? cards : '<p class="gs-hint">اختر إنجيلًا واحدًا على الأقل.</p>') + '</div>' +
      (ev.note ? '<aside class="gs-note"><b>يلفت النظر</b><p>' + esc(ev.note) + '</p></aside>' : '') +
      '<section class="gs-me"><h3>للتأمل</h3><p>إيه اللي اتفرّد بيه كل إنجيلي؟ وإيه اللي بتقوله لي أنا في هذا الحدث؟</p>' +
      '<textarea id="gsMe" rows="3" maxlength="600" placeholder="اكتب ما لفت نظرك — يُحفظ على جهازك فقط" aria-label="ملاحظتي">' + esc(mine) + '</textarea></section>' +
      '<nav class="gs-nav">' + (prev ? '<button type="button" data-gse="' + esc(prev.id) + '">‹ ' + esc(prev.title) + '</button>' : '<span></span>') + (next ? '<button type="button" data-gse="' + esc(next.id) + '">' + esc(next.title) + ' ›</button>' : '<span></span>') + '</nav>';
  }
  function render(keepTop) {
    var e = root(), top = keepTop ? e.scrollTop : 0;
    e.innerHTML = '<button type="button" class="pg-x" data-gsx="1" aria-label="' + (S.view === 'main' ? 'إغلاق' : 'رجوع') + '">' + (S.view === 'main' ? '✕' : '→ رجوع') + '</button><div class="pd-c gs-c">' + (S.view === 'main' ? mainHtml() : eventHtml()) + '</div>';
    e.classList.add('on'); e.scrollTop = top;
  }
  function open(id) {
    if (id && byId(id)) { S.view = 'event'; S.id = id; S.sel = { mt: 1, mk: 1, lk: 1, jn: 1 }; render(false); ensureBible(); }
    else { S.view = 'main'; render(false); }
  }
  function ensureBible() {
    var b = F().bible; if (!b || !b.load) return;
    if (b.data && b.data.length) return;
    b.load().then(function () { if (isOpen() && S.view === 'event') render(true); });
  }
  function back() { if (S.view === 'main') close(); else { S.view = 'main'; render(false); } }
  function openRef(ref) {
    var b = F().bible; if (!b || !b.load) return;
    b.load().then(function () {
      var r = b.parseRef(ref); if (!r) { F().toast && F().toast('تعذّر فتح المرجع'); return; }
      close(); F().openBible(r.bi, r.ch, r.v1 || 1);
    });
  }

  document.addEventListener('click', function (e) {
    var t = e.target, b; if (!t || !t.closest) return;
    if ((b = t.closest('[data-gospels]'))) { e.preventDefault(); e.stopPropagation(); try { F().closeSheet(); } catch (x) { } open(); return; }
    if (!el || !el.contains(t)) return;
    if (t.closest('[data-gsx]')) return back();
    if ((b = t.closest('[data-gse]'))) { open(b.getAttribute('data-gse')); el.scrollTop = 0; return; }
    if ((b = t.closest('[data-gsc]'))) { S.cat = b.getAttribute('data-gsc'); return render(true); }
    if ((b = t.closest('[data-gsg]'))) { var g = b.getAttribute('data-gsg'); S.sel[g] = S.sel[g] ? 0 : 1; return render(true); }
    if (t.closest('[data-gsd]')) { S.diff = !S.diff; return render(true); }
    if ((b = t.closest('[data-gsref]'))) return openRef(b.getAttribute('data-gsref'));
  });
  document.addEventListener('input', function (e) {
    var t = e.target; if (!t) return;
    if (t.id === 'gsQ') { S.q = t.value; var l = document.getElementById('gsList'); if (l) l.innerHTML = listHtml(); }
    else if (t.id === 'gsMe') { var o = load(); if (t.value.trim()) o[S.id] = t.value; else delete o[S.id]; save(o); }
  });
  document.addEventListener('keydown', function (e) { if (isOpen() && e.key === 'Escape') back(); });

  /* ---------- المداخل: «المزيد» + المفضلات + البحث الموحّد ---------- */
  function injectMore() {
    var box = document.querySelector('#uSheet .v14-more');
    if (!box || box.querySelector('[data-gospels]')) return;
    var b = document.createElement('button'); b.type = 'button'; b.setAttribute('data-gospels', '1');
    b.innerHTML = 'الحدث في أكثر من إنجيل<small>متى · مرقس · لوقا · يوحنا</small>';
    var at = box.querySelector('[data-atlas]');
    if (at && at.parentNode) at.parentNode.insertBefore(b, at.nextSibling);
    else { var h4 = document.createElement('h4'); h4.textContent = 'استكشاف'; var first = box.querySelector('h4'); box.insertBefore(h4, first); box.insertBefore(b, first); }
  }
  new MutationObserver(injectMore).observe(document.body, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', injectMore);
  setTimeout(injectMore, 700);

  RF.favs.register({
    id: 'gospels', order: 77, ic: '📜', t: 'ملاحظاتي في الأناجيل',
    hint: 'في أي حدث من «الحدث في أكثر من إنجيل» اكتب ما لفت نظرك — يتحفظ هنا تلقائيًا.', key: KEY,
    items: function () { var o = load(), out = []; Object.keys(o).forEach(function (id) { var e = byId(id); if (e && String(o[id]).trim()) out.push({ id: id, head: e.title, sub: '', text: String(o[id]), ts: 0 }); }); return out; },
    rm: function (id) { var o = load(); delete o[id]; save(o); }
  });

  RF.search.register({
    id: 'gospels', title: 'الحدث في أكثر من إنجيل', order: 66,
    run: function (q, nq) {
      var rows = [];
      if (nq.length < 2) return rows;
      G().events.forEach(function (e) { if (rows.length < 8 && nrm(e.title + ' ' + (e.note || '')).indexOf(nq) > -1) rows.push({ go: 'gospels:' + e.id, title: e.title, sub: 'الأناجيل — ' + gospelsOf(e).map(function (g) { return NM[g]; }).join(' · ') }); });
      return rows;
    },
    go: function (p) { open(p[1]); }
  });
  window.__gospelsUI = { open: open, close: close };
})();
