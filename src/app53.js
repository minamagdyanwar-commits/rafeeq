/* v6.11.1 — «الكتاب المقدس الدراسي»: تبويب داخل صفحة «الكتاب» (بجانب الخطة وإنجازي والحفظ) يجمع أدوات الدراسة، فيرث تصميم التطبيق كله (الرأس والشريط السفلي والبطاقات والأزرار والألوان) في كل تصميم وكل وضع:
   الأناجيل (حدث واحد بنص متى ومرقس ولوقا ويوحنا جنبًا إلى جنب) · الملوك والأخبار · نبوّة وتحقيق · الرمز والمرموز · المسيح حسب الموضوع · حياة المسيح (٥٧ محطة)،
   ثم الشخصيات والأنساب والخرائط (أطلس الكتاب، واجهته في app51.js وتُرسم داخل هذا التبويب نفسه).
   البيانات من content/study/*.json عبر tools/content-build.mjs (window.__study)؛ والنصوص تُقرأ من الكتاب المقدس داخل البرنامج (F().bible) فلا نسخ ولا إنترنت.
   تُرسم الواجهة بأصناف التطبيق نفسها (u-card · u-h3 · chips/chip · h-row · u-btn · u-in · u-note · u-wide) لا بأصناف مستقلة، فلا تخرج عن تصميم الصفحة المحيطة. */
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
  var host = null;

  function secs() { return D().sections; }
  function sec(id) { var a = secs(); for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i]; return null; }
  function isAtlas(id) { return ATLAS.some(function (a) { return a[0] === id; }); }
  function evSec(s) { return s.kind === 'life' ? sec(s.from) : s; }
  function evList(s) { var b = evSec(s); return b ? b.events || [] : []; }
  function evById(s, id) { var L = evList(s); for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i]; return null; }
  function catName(s, id) { var c = (evSec(s) || {}).cats || []; for (var i = 0; i < c.length; i++) if (c[i][0] === id) return c[i][1]; return ''; }
  function collById(s, id) { var L = s.collections || []; for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i]; return null; }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { } try { RF.favs && RF.favs.changed(); } catch (e) { } }
  function noteKey(s, id) { return (s.kind === 'life' ? s.from : s.id) + '/' + id; }
  function mounted() { return !!(host && document.body.contains(host)); }
  function title(id) { var s = sec(id); return SHORT[id] || (s && s.title) || ''; }

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
  function refsHtml(ps) { return ps.map(function (p) { return '<button type="button" class="chip gs-ref" data-gsref="' + esc(p.ref) + '">' + esc(p.label) + '</button>'; }).join(''); }

  /* ---------- الرأس والشريط (أقسام الدراسة + الأطلس) ---------- */
  function chip(id, label) { return '<button type="button" role="tab" aria-selected="' + (S.sec === id) + '" class="chip' + (S.sec === id ? ' on' : '') + '" data-stb="' + id + '">' + esc(label) + '</button>'; }
  function head() {
    var s = sec(S.sec), lead = s ? s.lead : (S.sec === 'people' ? 'شخصيات الكتاب المقدس بنبذة وأسرة ومراجع تفتح الآية.' : S.sec === 'lines' ? 'أنساب المسيح من آدم إلى يسوع، وأبناء يعقوب الاثنا عشر.' : 'خرائط بدون إنترنت: رحلة إبراهيم والخروج والعائلة المقدسة ورحلات بولس.');
    return '<div class="u-card st-head"><h3 class="u-h3">الكتاب المقدس الدراسي</h3><div class="u-sub">' + esc(lead) + '</div>' +
      '<div class="chips st-chips" role="tablist" aria-label="أقسام الدراسة">' + secs().map(function (x) { return chip(x.id, title(x.id)); }).join('') + '<span class="st-sep" aria-hidden="true"></span>' + ATLAS.map(function (a) { return chip(a[0], a[1]); }).join('') + '</div></div>';
  }

  /* ---------- القوائم ---------- */
  function badgeText(s, e) { return e.cols.map(function (c) { return c.l; }).join(' · '); }
  function row(attr, label, sub, ic, done) {
    return '<button type="button" class="h-row st-row' + (done ? ' done' : '') + '" ' + attr + '>' + (ic != null ? '<span class="ic">' + ic + '</span>' : '') + '<span class="tx"><b>' + esc(label) + '</b>' + (sub ? '<span>' + esc(sub) + '</span>' : '') + '</span><span class="ar"><i class=chv>‹</i></span></button>';
  }
  function evRows(s, list) {
    var nq = S.q && s.kind !== 'life' ? nrm(S.q) : '', cat = S.cat[s.id] || 'all', life = load().life || {};
    var rows = list.filter(function (e) { return (cat === 'all' || e.cat === cat) && (!nq || nrm(e.title + ' ' + (e.note || '')).indexOf(nq) > -1); });
    if (!rows.length) return '<div class="u-note">لا نتائج.</div>';
    var out = '', last = '';
    rows.forEach(function (e) {
      if (s.kind !== 'life' && cat === 'all' && !nq && e.cat !== last) { last = e.cat; out += '<h3 class="h-sec">' + esc(catName(s, e.cat)) + '</h3>'; }
      out += row('data-gse="' + esc(e.id) + '"', e.title, badgeText(s, e), s.kind === 'life' ? (life[e.id] ? '✓' : esc(ar(list.indexOf(e) + 1))) : null, s.kind === 'life' && life[e.id]);
    });
    return out;
  }
  function listHtml(s) {
    if (s.kind === 'collection') {
      var nq = S.q ? nrm(S.q) : '', rows = s.collections.filter(function (c) { return !nq || nrm(c.title + ' ' + (c.sub || '')).indexOf(nq) > -1; });
      return rows.length ? rows.map(function (c) { return row('data-gsco="' + esc(c.id) + '"', c.title, (c.sub ? c.sub + ' — ' : '') + ar(c.items.length) + ' موضعًا'); }).join('') : '<div class="u-note">لا نتائج.</div>';
    }
    if (s.kind === 'life') return evRows(s, s.order.map(function (id) { return evById(s, id); }).filter(Boolean));
    return evRows(s, s.events);
  }
  function lifeHead(s) {
    var done = load().life || {}, n = s.order.length, c = s.order.filter(function (id) { return done[id]; }).length;
    var next = null; for (var i = 0; i < s.order.length; i++) if (!done[s.order[i]]) { next = evById(s, s.order[i]); break; }
    return '<div class="u-card"><div class="row-between"><h3 class="u-h3">' + esc(ar(c)) + ' من ' + esc(ar(n)) + ' محطة</h3></div><div class="st-prog" role="progressbar" aria-valuemin="0" aria-valuemax="' + n + '" aria-valuenow="' + c + '"><i style="width:' + Math.round(100 * c / n) + '%"></i></div>' +
      (next ? '<button type="button" class="u-wide st-go" data-gse="' + esc(next.id) + '">' + (c ? 'تابع: ' : 'ابدأ: ') + esc(next.title) + '</button>' : '<div class="u-note ok">أتممتَ المحطات كلها ✓ — الحمد لله.</div>') + '</div>';
  }
  function listView() {
    var s = sec(S.sec); if (!s) return '';
    var cats = (evSec(s) || {}).cats || [], cat = S.cat[s.id] || 'all';
    return (s.kind === 'life' ? lifeHead(s) : '') +
      '<div class="u-card">' + (s.kind !== 'life' ? '<input id="gsQ" class="u-in" type="search" inputmode="search" placeholder="ابحث في «' + esc(title(s.id)) + '»…" value="' + esc(S.q) + '" aria-label="بحث">' : '') +
      (s.kind === 'parallel' && cats.length ? '<div class="chips" role="group" aria-label="الأقسام"><button type="button" class="chip' + (cat === 'all' ? ' on' : '') + '" data-gsc="all">الكل</button>' + cats.map(function (c) { return '<button type="button" class="chip' + (cat === c[0] ? ' on' : '') + '" data-gsc="' + c[0] + '">' + esc(c[1]) + '</button>'; }).join('') + '</div>' : '') + '</div>' +
      '<div class="h-list" id="gsList">' + listHtml(s) + '</div>' +
      '<div class="u-note">النصوص من الكتاب المقدس داخل البرنامج. الأزواج والمجموعات والملاحظات القصيرة من إعداد البرنامج وتحتاج مراجعة كنسية قبل اعتمادها' + (s.diff ? '، وتظليل الاختلافات آلي (كلمات لا ترد في الروايات الأخرى المعروضة)' : '') + '.</div>';
  }

  /* ---------- حدث ---------- */
  function eventView() {
    var s = sec(S.sec), ev = s && evById(s, S.id); if (!ev) return listView();
    var b = evSec(s), shown = ev.cols.filter(function (c) { return S.sel[c.k] !== 0; }), cards = '';
    if (!bibleReady()) cards = '<div class="u-note">جارٍ تجهيز الكتاب المقدس…</div>';
    else {
      var P = {}; shown.forEach(function (c) { P[c.k] = parts(c.r); });
      var diff = !!(b.diff && S.diff);
      shown.forEach(function (c) {
        var others = null;
        if (diff && shown.length > 1) { var all = []; shown.forEach(function (h) { if (h !== c) all = all.concat(P[h.k]); }); others = wordSet(all); }
        cards += '<div class="u-card st-col c' + ev.cols.indexOf(c) + '"><div class="row-between"><h3 class="u-h3">' + esc(c.l) + '</h3></div><div class="chips">' + refsHtml(P[c.k]) + '</div>' + textHtml(P[c.k], others, diff) + '</div>';
      });
    }
    var L = s.kind === 'life' ? s.order.map(function (id) { return evById(s, id); }) : s.events, ix = L.indexOf(ev), prev = L[ix - 1], next = L[ix + 1], mine = load().notes || {}, my = mine[noteKey(s, ev.id)] || '';
    var life = load().life || {};
    return '<button type="button" class="u-btn st-back" data-gsx="1">‹ ' + esc(title(s.id)) + '</button>' +
      '<div class="u-card"><div class="u-sub">' + (s.kind === 'life' ? 'المحطة ' + esc(ar(ix + 1)) + ' من ' + esc(ar(L.length)) : esc(catName(s, ev.cat))) + '</div><h3 class="u-h3">' + esc(ev.title) + '</h3>' +
      '<div class="chips" role="group" aria-label="الأعمدة">' + ev.cols.map(function (c) { return '<button type="button" class="chip' + (S.sel[c.k] !== 0 ? ' on' : '') + '" aria-pressed="' + (S.sel[c.k] !== 0 ? 'true' : 'false') + '" data-gsg="' + esc(c.k) + '">' + esc(c.l) + '</button>'; }).join('') +
      (b.diff ? '<button type="button" class="chip' + (S.diff ? ' on' : '') + '" aria-pressed="' + (S.diff ? 'true' : 'false') + '" data-gsd="1">ظلّل الاختلافات</button>' : '') + '</div>' +
      (b.diff && S.diff && shown.length > 1 ? '<div class="u-sub"><mark class="gs-u">كلمات مظلّلة</mark> لا ترد في الروايات الأخرى المعروضة.</div>' : '') + '</div>' +
      '<div class="st-cols">' + (shown.length ? cards : '<div class="u-note">اختر عمودًا واحدًا على الأقل.</div>') + '</div>' +
      (ev.note ? '<div class="u-note"><b>يلفت النظر:</b> ' + esc(ev.note) + '</div>' : '') +
      (s.kind === 'life' ? '<button type="button" class="u-wide' + (life[ev.id] ? ' on' : '') + '" data-gsl="' + esc(ev.id) + '" aria-pressed="' + (life[ev.id] ? 'true' : 'false') + '">' + (life[ev.id] ? '✓ قرأتُ هذه المحطة (اضغط للتراجع)' : 'قرأتُ هذه المحطة') + '</button>' : '') +
      '<div class="u-card"><h3 class="u-h3">للتأمل</h3><div class="u-sub">' + (b.id === 'gospels' ? 'إيه اللي اتفرّد بيه كل إنجيلي؟ وإيه اللي بتقوله لي أنا في هذا الحدث؟' : b.id === 'kings' ? 'إيه اللي اختلف في رواية الأخبار؟ ولماذا ركّز عليه الكاتب؟' : b.id === 'prophecy' || b.id === 'types' ? 'كيف رأى كاتب العهد الجديد الصلة بين النصين؟ وماذا تضيف لك؟' : 'إيه اللي لفت نظرك؟') + '</div>' +
      '<textarea id="gsMe" class="u-in" rows="3" maxlength="600" placeholder="اكتب ما لفت نظرك — يُحفظ على جهازك فقط" aria-label="ملاحظتي">' + esc(my) + '</textarea></div>' +
      '<div class="row-gap st-nav">' + (prev ? '<button type="button" class="u-btn" data-gse="' + esc(prev.id) + '">‹ ' + esc(prev.title) + '</button>' : '') + (next ? '<button type="button" class="u-btn" data-gse="' + esc(next.id) + '">' + esc(next.title) + ' ›</button>' : '') + '</div>';
  }

  /* ---------- مجموعة آيات ---------- */
  function collView() {
    var s = sec(S.sec), c = s && collById(s, S.id); if (!c) return listView();
    var out = '<button type="button" class="u-btn st-back" data-gsx="1">‹ ' + esc(title(s.id)) + '</button><div class="u-card"><div class="u-sub">' + esc(ar(c.items.length)) + ' موضعًا</div><h3 class="u-h3">' + esc(c.title) + '</h3>' + (c.sub ? '<div class="u-sub">' + esc(c.sub) + '</div>' : '') + '</div>';
    if (!bibleReady()) return out + '<div class="u-note">جارٍ تجهيز الكتاب المقدس…</div>';
    out += c.items.map(function (it) {
      var ps = parts(it.r);
      return '<div class="u-card st-col c0"><div class="row-between"><h3 class="u-h3">' + esc(it.t) + '</h3></div><div class="chips">' + refsHtml(ps) + '</div>' + textHtml(ps, null, false) + '</div>';
    }).join('');
    var L = s.collections, ix = L.indexOf(c), prev = L[ix - 1], next = L[ix + 1];
    return out + '<div class="row-gap st-nav">' + (prev ? '<button type="button" class="u-btn" data-gsco="' + esc(prev.id) + '">‹ ' + esc(prev.title) + '</button>' : '') + (next ? '<button type="button" class="u-btn" data-gsco="' + esc(next.id) + '">' + esc(next.title) + ' ›</button>' : '') + '</div>';
  }

  /* ---------- الإطار العام ---------- */
  function render(keepTop) {
    if (!mounted()) return;
    var y = keepTop ? window.scrollY : 0, body;
    if (isAtlas(S.sec)) body = '<div id="stAtlas" class="st-atlas"></div>';
    else body = S.view === 'event' ? eventView() : S.view === 'coll' ? collView() : listView();
    host.innerHTML = '<div class="st">' + (S.view === 'list' || isAtlas(S.sec) ? head() : '') + body + '</div>';
    if (isAtlas(S.sec) && window.__atlasUI) window.__atlasUI.mount(document.getElementById('stAtlas'), S.sec);
    if (keepTop) window.scrollTo(0, y);
  }
  /* يُستدعى من app6 كلما رُسم تبويب «الكتاب الدراسي» داخل صفحة الكتاب */
  function mount(container) { host = container; render(false); ensureBible(); }
  function ensureBible() {
    var b = F().bible; if (!b || !b.load || bibleReady()) return;
    b.load().then(function () { if (mounted() && S.view !== 'list' && !isAtlas(S.sec)) render(true); });
  }
  function showTab() {
    try { window.__rafeeq && window.__rafeeq.show('trk', { top: 1 }); } catch (e) { }
    try { F().setTrkTab('study'); } catch (e) { }
    window.scrollTo(0, 0);
  }
  function openSection(id) {
    if (!sec(id) && !isAtlas(id)) id = 'gospels';
    if (S.sec !== id) S.q = '';
    S.sec = id; S.view = 'list'; S.id = null;
    if (isAtlas(id) && window.__atlasUI) window.__atlasUI.setTab(id);
    if (isStudyTab() && mounted()) { render(false); window.scrollTo(0, 0); } else showTab();
  }
  function isStudyTab() { var t = document.querySelector('#trkTabs [data-ttab="study"]'); return !!(t && t.classList.contains('on') && document.getElementById('page-trk') && document.getElementById('page-trk').classList.contains('on')); }
  function open(id, item) {
    var s = sec(id);
    if (!s) return openSection(id || S.sec || 'gospels');
    if (S.sec !== id) S.q = '';
    S.sec = id;
    if (item && s.kind === 'collection' && collById(s, item)) { S.view = 'coll'; S.id = item; }
    else if (item && evById(s, item)) { S.view = 'event'; S.id = item; S.sel = {}; }
    else { S.view = 'list'; S.id = null; }
    if (isStudyTab() && mounted()) { render(false); window.scrollTo(0, 0); ensureBible(); } else showTab();
  }
  /* يستدعيه الأطلس (app51) حين يُفتح من البحث أو الروابط: يعرض تبويب الدراسة على قسم الأطلس المناسب */
  function showAtlas(tab) {
    S.sec = isAtlas(tab) ? tab : 'people'; S.view = 'list';
    if (isStudyTab() && mounted()) { render(false); window.scrollTo(0, 0); } else showTab();
  }
  function back() { S.view = 'list'; S.id = null; render(true); window.scrollTo(0, 0); }
  function openRef(ref) {
    var b = F().bible; if (!b || !b.load) return;
    b.load().then(function () {
      var r = b.parseRef(ref); if (!r) { F().toast && F().toast('تعذّر فتح المرجع'); return; }
      F().openBible(r.bi, r.ch, r.v1 || 1);
    });
  }

  document.addEventListener('click', function (e) {
    var t = e.target, b; if (!t || !t.closest) return;
    if ((b = t.closest('[data-study]'))) { e.preventDefault(); e.stopPropagation(); try { F().closeSheet(); } catch (x) { } open(S.sec || 'gospels'); return; }
    if (!mounted() || !host.contains(t)) return;
    if ((b = t.closest('[data-stb]'))) { e.preventDefault(); openSection(b.getAttribute('data-stb')); return; }
    if (t.closest('[data-gsx]')) return back();
    if ((b = t.closest('[data-gse]'))) { S.view = 'event'; S.id = b.getAttribute('data-gse'); S.sel = {}; render(false); window.scrollTo(0, 0); ensureBible(); return; }
    if ((b = t.closest('[data-gsco]'))) { S.view = 'coll'; S.id = b.getAttribute('data-gsco'); render(false); window.scrollTo(0, 0); ensureBible(); return; }
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
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mounted() && isStudyTab() && S.view !== 'list' && !isAtlas(S.sec)) back(); });

  /* ---------- «المزيد» + المفضلات + البحث الموحّد ---------- */
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
      Object.keys(o).forEach(function (k) { var p = k.split('/'), s = sec(p[0]), e = s && evById(s, p[1]); if (e && String(o[k]).trim()) out.push({ id: k, head: e.title, sub: title(s.id), text: String(o[k]), ts: 0 }); });
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
          if (rows.length < 10 && nrm(e.title + ' ' + (e.note || e.sub || '')).indexOf(nq) > -1) rows.push({ go: 'study:' + s.id + ':' + e.id, title: e.title, sub: 'الكتاب الدراسي — ' + title(s.id) });
        });
      });
      return rows;
    },
    go: function (p) { open(p[1], p[2]); }
  });
  window.__studyUI = { open: open, mount: mount, showAtlas: showAtlas, isAtlasSection: isAtlas, current: function () { return S.sec; } };
})();
