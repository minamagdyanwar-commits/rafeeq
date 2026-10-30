/* v6.9.0 — «أطلس الكتاب»: شخصيات الكتاب المقدس، وأنساب المسيح وبيت يعقوب، وخرائط (إبراهيم، الخروج، العائلة المقدسة، أرض الإنجيل، رحلات بولس).
   البيانات من content/atlas/*.json عبر tools/content-build.mjs (window.__atlas). كل شيء بدون إنترنت: الخرائط SVG مرسومة من إحداثيات مبسّطة (data-atlas.js).
   تفتح من «المزيد» ومن البحث الموحّد، وتفتح الآيات في الكتاب المقدس نفسه عبر F().openBible. */
(function () {
  'use strict';
  function F() { return window.__F || {}; }
  function A() { return window.__atlas || { groups: [], people: [], places: [], maps: [], lines: [], tribes: { mothers: [] }, geo: {} }; }
  function esc(s) { return RF.esc(s); }
  function ar(n) { return RF.ar(n); }
  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function person(id) { return byId(A().people, id); }
  function place(id) { return byId(A().places, id); }
  function mapOf(id) { return byId(A().maps, id); }
  var CATS = [['ot', 'العهد القديم'], ['nt', 'الإنجيل'], ['paul', 'رحلات بولس']];
  var TABS = [['people', 'الشخصيات'], ['lines', 'الأنساب'], ['maps', 'الخرائط']];

  /* حالة الشاشة: tab (people|lines|maps)، view (main|person|map)، g (مجموعة)، q (بحث)، pid، mid، sel (مكان محدد)، z (تكبير الخريطة) */
  var S = { tab: 'people', view: 'main', g: 'all', q: '', pid: null, mid: null, sel: null, z: 1 };
  var el = null;

  function root() {
    if (el && document.body.contains(el)) return el;
    el = document.createElement('div');
    el.id = 'atlasPg'; el.className = 'prg-page'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'أطلس الكتاب');
    document.body.appendChild(el);
    return el;
  }
  function isOpen() { return !!(el && el.classList.contains('on')); }
  function close() { if (el) el.classList.remove('on'); }

  /* ---------- الشخصيات ---------- */
  function groupName(g) { for (var i = 0; i < A().groups.length; i++) if (A().groups[i][0] === g) return A().groups[i][1]; return ''; }
  function matches(p, nq) {
    if (!nq) return true;
    var nm = F().norm; if (!nm) return (p.n + ' ' + p.t).indexOf(S.q) > -1;
    return nm(p.n + ' ' + p.t + ' ' + p.d).indexOf(nq) > -1;
  }
  function nameHit(p, nq) { var nm = F().norm; return (nm ? nm(p.n) : p.n).indexOf(nq) > -1 ? 1 : 0; }
  function listHtml() {
    var nm = F().norm, nq = S.q && nm ? nm(S.q) : S.q, rows = A().people.filter(function (p) { return (S.g === 'all' || p.g === S.g) && matches(p, nq); });
    if (!rows.length) return '<p class="at-empty">لا توجد نتائج. جرّب اسمًا آخر أو مجموعة أخرى.</p>';
    if (nq) rows.sort(function (x, y) { return nameHit(y, nq) - nameHit(x, nq); });
    return rows.map(function (p) {
      return '<button type="button" class="at-row" data-atp="' + p.id + '"><b>' + esc(p.n) + '</b><small>' + esc(p.t) + '</small></button>';
    }).join('');
  }
  function peopleTab() {
    var chips = '<button type="button" class="at-chip' + (S.g === 'all' ? ' on' : '') + '" data-atg="all">الكل</button>' +
      A().groups.map(function (g) { return '<button type="button" class="at-chip' + (S.g === g[0] ? ' on' : '') + '" data-atg="' + g[0] + '">' + esc(g[1]) + '</button>'; }).join('');
    return '<input type="search" id="atQ" class="at-q" placeholder="ابحث عن شخصية…" value="' + esc(S.q) + '" autocomplete="off" aria-label="بحث في الشخصيات">' +
      '<div class="at-chips">' + chips + '</div><div id="atList" class="at-list">' + listHtml() + '</div>';
  }
  function refBtns(refs) {
    return refs.map(function (r) { return '<button type="button" class="at-ref" data-atref="' + esc(r) + '">' + esc(ar(r)) + '</button>'; }).join('');
  }
  function personView(p) {
    var fam = (p.fam || []).map(function (f) {
      return f[2] ? '<button type="button" class="at-fam" data-atp="' + f[2] + '"><small>' + esc(f[0]) + '</small>' + esc(f[1]) + '</button>'
        : '<span class="at-fam"><small>' + esc(f[0]) + '</small>' + esc(f[1]) + '</span>';
    }).join('');
    var inLines = A().lines.filter(function (l) { return l.items.some(function (it) { return it.id === p.id || it.woman_id === p.id; }); });
    var lineBtns = inLines.map(function (l) { return '<button type="button" class="at-ref" data-atl="' + l.id + '">النسب: ' + esc(l.title) + '</button>'; }).join('');
    var places = A().places.filter(function (x) { return x.id === p.id; });
    return '<small>' + esc(groupName(p.g)) + ' · ' + esc(p.t) + '</small><h2>' + esc(p.n) + '</h2>' +
      '<div class="pd-v"><p>' + esc(p.d) + '</p></div>' +
      (fam ? '<h3 class="at-h">الأسرة</h3><div class="at-fams">' + fam + '</div>' : '') +
      '<h3 class="at-h">في الكتاب</h3><div class="at-refs">' + refBtns(p.r) + '</div>' +
      (lineBtns ? '<h3 class="at-h">في الأنساب</h3><div class="at-refs">' + lineBtns + '</div>' : '') + (places.length ? '' : '') +
      '<p class="at-foot">نبذة مختصرة للتعريف، والمرجع هو نص الكتاب المقدس نفسه.</p>';
  }

  /* ---------- الأنساب ---------- */
  function railItem(it) {
    var nm = it.id ? '<button type="button" class="at-nm" data-atp="' + it.id + '">' + esc(it.n) + '</button>' : '<span class="at-nm">' + esc(it.n) + '</span>';
    var wm = it.woman ? (it.woman_id ? '<button type="button" class="at-wm" data-atp="' + it.woman_id + '">' + esc(it.woman) + '</button>' : '<span class="at-wm">' + esc(it.woman) + '</span>') : '';
    return '<li class="at-nd' + (it.christ ? ' ch' : '') + '"><i></i><div>' + nm + (it.w ? ' <small>' + esc(it.w) + '</small>' : '') + (wm ? ' ' + wm : '') + '</div></li>';
  }
  function linesTab() {
    var L = A().lines, T = A().tribes;
    var jump = L.map(function (l) { return '<button type="button" class="at-chip" data-atj="' + l.id + '">' + esc(l.title) + '</button>'; }).join('') +
      '<button type="button" class="at-chip" data-atj="tribes">بيت يعقوب</button>';
    var secs = L.map(function (l) {
      return '<section class="at-sec" id="atl-' + l.id + '"><h3>' + esc(l.title) + '</h3><small>' + esc(l.sub) + '</small>' +
        '<ol class="at-rail">' + l.items.map(railItem).join('') + '</ol>' +
        (l.note ? '<p class="at-note">' + esc(l.note) + '</p>' : '') + '<div class="at-refs">' + refBtns(l.r) + '</div></section>';
    }).join('');
    var tribes = '<section class="at-sec" id="atl-tribes"><h3>' + esc(T.title) + '</h3><small>' + esc(T.sub) + '</small>' +
      T.mothers.map(function (m) {
        return '<div class="pd-v at-mom"><b>' + (m.id ? '<button type="button" class="at-nm" data-atp="' + m.id + '">' + esc(m.n) + '</button>' : esc(m.n)) + '</b><p>' +
          m.sons.map(function (s) { return '<span class="at-son">' + esc(s) + '</span>'; }).join('') + '</p></div>';
      }).join('') + '<div class="at-refs">' + refBtns(T.r) + '</div></section>';
    return '<div class="at-chips">' + jump + '</div>' + secs + tribes;
  }

  /* ---------- الخرائط ---------- */
  function mapsTab() {
    return CATS.map(function (c) {
      var ms = A().maps.filter(function (m) { return m.cat === c[0]; });
      if (!ms.length) return '';
      return '<h3 class="at-h">' + c[1] + '</h3>' + ms.map(function (m) {
        return '<button type="button" class="at-row at-mrow" data-atm="' + m.id + '"><i>' + m.ic + '</i><span><b>' + esc(m.title) + '</b><small>' + esc(m.sub) + '</small></span></button>';
      }).join('');
    }).join('');
  }

  /* الإسقاط: خط الطول مضروبًا في جيب تمام خط العرض الأوسط ليبقى الشكل قريبًا من الواقع */
  function geom(m) {
    var vb = m.vb, k = Math.cos((vb[1] + vb[3]) / 2 * Math.PI / 180), K = 100;
    return { k: k, K: K, x0: vb[0], y1: vb[3], W: (vb[2] - vb[0]) * k * K, H: (vb[3] - vb[1]) * K };
  }
  function pt(g, ll) { return [(ll[0] - g.x0) * g.k * g.K, (g.y1 - ll[1]) * g.K]; }
  function r1(n) { return Math.round(n * 10) / 10; }
  function pathOf(g, pts, close) {
    return 'M' + pts.map(function (p) { var q = pt(g, p); return r1(q[0]) + ' ' + r1(q[1]); }).join('L') + (close ? 'Z' : '');
  }
  function stopsOf(m) {
    var seen = {}, out = [];
    m.legs.forEach(function (l) { l.ids.forEach(function (id) { if (typeof id === 'string' && !seen[id]) { seen[id] = 1; out.push(id); } }); });
    return out;
  }
  function placesOf(m) { return stopsOf(m).concat((m.pins || []).filter(function (id) { return stopsOf(m).indexOf(id) < 0; })); }

  /* wpx = العرض المعروض بالبكسل؛ mk = وحدات الإسقاط لكل بكسل، فيبقى حجم الخط والدبابيس ثابتًا على الشاشة مهما كان التكبير */
  function svgHtml(m, wpx) {
    var g = geom(m), mk = g.W / wpx, G = A().geo, out = [];
    out.push('<svg viewBox="0 0 ' + r1(g.W) + ' ' + r1(g.H) + '" width="' + Math.round(wpx) + '" height="' + Math.round(wpx * g.H / g.W) + '" class="at-svg" role="img" aria-label="' + esc(m.title) + '">');
    out.push('<rect x="-20000" y="-20000" width="40000" height="40000" class="at-land"/>');
    G.sea.forEach(function (s) { out.push('<path d="' + pathOf(g, s.p, true) + '" class="at-sea"/>'); });
    G.isl.forEach(function (s) { out.push('<path d="' + pathOf(g, s.p, true) + '" class="at-isl"/>'); });
    G.ell.forEach(function (e) { var c = pt(g, e.c); out.push('<ellipse cx="' + r1(c[0]) + '" cy="' + r1(c[1]) + '" rx="' + r1(e.rx * g.k * g.K) + '" ry="' + r1(e.ry * g.K) + '" class="at-isl"/>'); });
    G.rivers.forEach(function (s) { out.push('<path d="' + pathOf(g, s.p, false) + '" class="at-riv" stroke-width="' + r1(2.6 * mk) + '"/>'); });
    /* خطوط المسار */
    m.legs.forEach(function (l, i) {
      var pts = l.ids.map(function (id) { return typeof id === 'string' ? place(id).ll : id; });
      out.push('<path d="' + pathOf(g, pts, false) + '" class="at-rt c' + (i % 3) + (l.dash ? ' d' : '') + '" stroke-width="' + r1(2.4 * mk) + '"' + (l.dash ? ' stroke-dasharray="' + r1(7 * mk) + ' ' + r1(5 * mk) + '"' : '') + '/>');
    });
    /* الدبابيس والأسماء مع تفادي تداخل الأسماء */
    var ids = placesOf(m), stops = stopsOf(m), fs = 12 * mk, rad = 6.5 * mk, boxes = [], pins = [], labels = [];
    ids.forEach(function (id) { var p = place(id), c = pt(g, p.ll); boxes.push({ x1: c[0] - rad, x2: c[0] + rad, y1: c[1] - rad, y2: c[1] + rad }); });
    function hit(b) { if (b.x1 < 0 || b.x2 > g.W || b.y1 < 0 || b.y2 > g.H) return true; for (var i = 0; i < boxes.length; i++) { var o = boxes[i]; if (b.x1 < o.x2 && b.x2 > o.x1 && b.y1 < o.y2 && b.y2 > o.y1) return true; } return false; }
    ids.forEach(function (id) {
      var p = place(id), c = pt(g, p.ll), n = stops.indexOf(id) + 1, w = p.n.length * fs * 0.5 + 2 * mk, h = fs * 1.1, sel = S.sel === id;
      var cands = [[rad + 3 * mk, 0.35 * fs, 'start'], [-rad - 3 * mk, 0.35 * fs, 'end'], [0, -rad - 4 * mk, 'middle'], [0, rad + fs, 'middle']];
      if (p.lo) cands.unshift([p.lo[0] * mk, p.lo[1] * mk, p.lo[2]]);
      var pick = cands[0], b;
      for (var i = 0; i < cands.length; i++) {
        var cd = cands[i], x = c[0] + cd[0], a = cd[2];
        b = { x1: a === 'start' ? x : a === 'end' ? x - w : x - w / 2, x2: a === 'start' ? x + w : a === 'end' ? x : x + w / 2, y1: c[1] + cd[1] - h * 0.8, y2: c[1] + cd[1] + h * 0.25 };
        if (!hit(b)) { pick = cd; break; }
      }
      if (b) { b = { x1: c[0] + pick[0] - (pick[2] === 'end' ? w : pick[2] === 'middle' ? w / 2 : 0), x2: c[0] + pick[0] + (pick[2] === 'start' ? w : pick[2] === 'middle' ? w / 2 : 0), y1: c[1] + pick[1] - h * 0.8, y2: c[1] + pick[1] + h * 0.25 }; boxes.push(b); }
      labels.push('<text x="' + r1(c[0] + pick[0]) + '" y="' + r1(c[1] + pick[1]) + '" text-anchor="' + pick[2] + '" font-size="' + r1(fs) + '" stroke-width="' + r1(3.4 * mk) + '" class="at-lb' + (sel ? ' on' : '') + '">' + esc(p.n) + '</text>');
      pins.push('<g class="at-pin' + (sel ? ' on' : '') + (p.ap ? ' ap' : '') + '" data-atpl="' + id + '" role="button" tabindex="0" aria-label="' + esc(p.n) + '"><circle cx="' + r1(c[0]) + '" cy="' + r1(c[1]) + '" r="' + r1(16 * mk) + '" class="hit"/>' +
        '<circle cx="' + r1(c[0]) + '" cy="' + r1(c[1]) + '" r="' + r1(n ? rad : 4 * mk) + '" class="dot"/>' +
        (n ? '<text x="' + r1(c[0]) + '" y="' + r1(c[1] + 0.34 * fs) + '" text-anchor="middle" font-size="' + r1(fs * 0.85) + '" class="nu">' + ar(n) + '</text>' : '') + '</g>');
    });
    out.push(labels.join(''), pins.join(''), '</svg>');
    return out.join('');
  }
  function box() { return document.getElementById('atSvg'); }
  function boxW() { var b = box(); return (b && b.clientWidth) || Math.min(window.innerWidth, 600) - 40 || 340; }
  function center(m) {
    var ids = stopsOf(m).length ? stopsOf(m) : placesOf(m), g = geom(m), sx = 0, sy = 0;
    ids.forEach(function (id) { var c = pt(g, place(id).ll); sx += c[0]; sy += c[1]; });
    return [sx / ids.length / g.W, sy / ids.length / g.H];
  }
  /* fx/fy = نقطة المنتصف المطلوبة كنسبة من الخريطة؛ بدونها يُحفظ منتصف ما يراه المستخدم الآن */
  function paintMap(fx, fy) {
    var m = mapOf(S.mid), b = box(); if (!m || !b) return;
    var cw = boxW(), old = b.querySelector('svg');
    if (fx == null && old) { fx = (b.scrollLeft + b.clientWidth / 2) / old.clientWidth; fy = (b.scrollTop + b.clientHeight / 2) / old.clientHeight; }
    var w = cw * S.z; b.innerHTML = svgHtml(m, w);
    var h = w * geom(m).H / geom(m).W; b.style.height = Math.min(h, Math.round(window.innerHeight * 0.62)) + 'px';
    b.scrollLeft = (fx == null ? 0.5 : fx) * w - b.clientWidth / 2; b.scrollTop = (fy == null ? 0.5 : fy) * h - b.clientHeight / 2;
    var z = document.getElementById('atZ'); if (z) z.textContent = '×' + ar(String(Math.round(S.z * 10) / 10).replace('.', '٫'));
  }
  function startVw(m) { S.z = m.z0 || 1; }
  function zoom(f) { S.z = Math.max(1, Math.min(6, S.z * f)); paintMap(); }
  function placeCard() {
    var p = S.sel && place(S.sel); if (!p) return '<p class="at-hint">اضغط على أي دبوس لتقرأ عن المكان.</p>';
    return '<div class="pd-v at-pc"><b>' + esc(p.n) + (p.ap ? ' <em>موقع تقليدي أو تقريبي</em>' : '') + '</b><p>' + esc(p.d) + '</p><div class="at-refs">' + refBtns(p.r) + '</div></div>';
  }
  function mapView(m) {
    var legs = m.legs.map(function (l, i) { return '<span class="at-lg"><i class="c' + (i % 3) + (l.dash ? ' d' : '') + '"></i>' + esc(l.n) + '</span>'; }).join('');
    var stops = stopsOf(m).map(function (id, i) { return '<button type="button" class="at-st' + (S.sel === id ? ' on' : '') + '" data-atpl="' + id + '"><u>' + ar(i + 1) + '</u>' + esc(place(id).n) + '</button>'; }).join('');
    var pins = (m.pins || []).filter(function (id) { return stopsOf(m).indexOf(id) < 0; }).map(function (id) { return '<button type="button" class="at-st' + (S.sel === id ? ' on' : '') + '" data-atpl="' + id + '">' + esc(place(id).n) + '</button>'; }).join('');
    return '<small>' + esc(m.sub) + '</small><h2>' + esc(m.title) + '</h2>' +
      '<div class="at-mapbox"><div id="atSvg" class="at-svgbox"></div><div class="at-zoom"><button type="button" data-atz="in" aria-label="تكبير">+</button><button type="button" data-atz="out" aria-label="تصغير">−</button><button type="button" data-atz="reset" aria-label="إعادة الضبط">⟲</button><span id="atZ">×١</span></div></div>' +
      (legs ? '<div class="at-legs">' + legs + '</div>' : '') +
      '<div id="atPc">' + placeCard() + '</div>' +
      (stops ? '<h3 class="at-h">المحطات بالترتيب</h3><div class="at-sts">' + stops + '</div>' : '') +
      (pins ? '<h3 class="at-h">أماكن أخرى</h3><div class="at-sts">' + pins + '</div>' : '') +
      (m.note ? '<p class="at-note">' + esc(m.note) + '</p>' : '') +
      '<h3 class="at-h">في الكتاب</h3><div class="at-refs">' + refBtns(m.refs) + '</div>';
  }

  /* ---------- الإطار العام ---------- */
  function render(keepScroll) {
    var e = root(), top = keepScroll ? e.scrollTop : 0, html;
    if (S.view === 'person' && person(S.pid)) html = personView(person(S.pid));
    else if (S.view === 'map' && mapOf(S.mid)) html = mapView(mapOf(S.mid));
    else {
      S.view = 'main';
      html = '<small>الكتاب المقدس</small><h2>أطلس الكتاب</h2><div class="at-tabs" role="tablist">' +
        TABS.map(function (t) { return '<button type="button" role="tab" aria-selected="' + (S.tab === t[0]) + '" class="' + (S.tab === t[0] ? 'on' : '') + '" data-att="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>' +
        (S.tab === 'people' ? peopleTab() : S.tab === 'lines' ? linesTab() : mapsTab());
    }
    e.innerHTML = '<button type="button" class="pg-x" data-atx="1" aria-label="' + (S.view === 'main' ? 'إغلاق' : 'رجوع') + '">' + (S.view === 'main' ? '✕' : '→ رجوع') + '</button><div class="pd-c at-c">' + html + '</div>';
    e.classList.add('on'); e.scrollTop = top;
    if (S.view === 'map') { var cc = S.sel && place(S.sel) ? pt(geom(mapOf(S.mid)), place(S.sel).ll) : null, gg = geom(mapOf(S.mid)), c0 = center(mapOf(S.mid)); paintMap(cc ? cc[0] / gg.W : c0[0], cc ? cc[1] / gg.H : c0[1]); }
  }
  function open(tab, id, sub) {
    if (tab === 'p' && person(id)) { S.view = 'person'; S.pid = id; }
    else if (tab === 'm' && mapOf(id)) { S.view = 'map'; S.mid = id; S.sel = sub || null; startVw(mapOf(id)); }
    else { S.view = 'main'; if (tab && TABS.some(function (t) { return t[0] === tab; })) S.tab = tab; }
    render(false);
  }
  function back() { if (S.view === 'main') close(); else { S.view = 'main'; render(false); } }

  function openRef(ref) {
    var b = F().bible; if (!b || !b.load) return;
    b.load().then(function () {
      var r = b.parseRef(ref); if (!r) { F().toast && F().toast('تعذّر فتح المرجع'); return; }
      close(); F().openBible(r.bi, r.ch, r.v1 || 1);
    });
  }
  function select(id) {
    S.sel = id; var p = place(id), m = mapOf(S.mid), b = box();
    var pc = document.getElementById('atPc'); if (pc) pc.innerHTML = placeCard();
    Array.prototype.forEach.call(el.querySelectorAll('.at-st'), function (x) { x.classList.toggle('on', x.getAttribute('data-atpl') === id); });
    if (p && m && b) { var g = geom(m), c = pt(g, p.ll); paintMap(c[0] / g.W, c[1] / g.H); }
    if (pc && pc.scrollIntoView) { var r = pc.getBoundingClientRect(); if (r.bottom > window.innerHeight || r.top < 0) pc.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  }

  document.addEventListener('click', function (e) {
    var t = e.target, b; if (!t || !t.closest) return;
    if ((b = t.closest('[data-atlas]'))) { e.preventDefault(); e.stopPropagation(); try { F().closeSheet(); } catch (x) { } open(b.getAttribute('data-atlas') || 'people'); return; }
    if (!el || !el.contains(t)) return;
    if (t.closest('[data-atx]')) return back();
    if ((b = t.closest('[data-att]'))) { S.tab = b.getAttribute('data-att'); return render(false); }
    if ((b = t.closest('[data-atg]'))) { S.g = b.getAttribute('data-atg'); return render(true); }
    if ((b = t.closest('[data-atp]'))) { S.view = 'person'; S.pid = b.getAttribute('data-atp'); return render(false); }
    if ((b = t.closest('[data-atm]'))) { open('m', b.getAttribute('data-atm')); return; }
    if ((b = t.closest('[data-atpl]'))) return select(b.getAttribute('data-atpl'));
    if ((b = t.closest('[data-atref]'))) return openRef(b.getAttribute('data-atref'));
    if ((b = t.closest('[data-atl]'))) { S.view = 'main'; S.tab = 'lines'; render(false); var s = document.getElementById('atl-' + b.getAttribute('data-atl')); if (s) el.scrollTop = s.offsetTop - 70; return; }
    if ((b = t.closest('[data-atj]'))) { var s2 = document.getElementById('atl-' + b.getAttribute('data-atj')); if (s2) el.scrollTo({ top: s2.offsetTop - 70, behavior: 'smooth' }); return; }
    if ((b = t.closest('[data-atz]'))) { var k = b.getAttribute('data-atz'); if (k === 'reset') { startVw(mapOf(S.mid)); var c1 = center(mapOf(S.mid)); paintMap(c1[0], c1[1]); } else zoom(k === 'in' ? 1.6 : 1 / 1.6); return; }
  });
  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'atQ') { S.q = e.target.value; var l = document.getElementById('atList'); if (l) l.innerHTML = listHtml(); }
  });
  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') back();
    else if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.getAttribute && e.target.getAttribute('data-atpl') && e.target.tagName !== 'BUTTON') { e.preventDefault(); select(e.target.getAttribute('data-atpl')); }
  });
  window.addEventListener('resize', function () { if (isOpen() && S.view === 'map') paintMap(); });

  /* ---------- مدخل «المزيد» ---------- */
  function injectMore() {
    var box = document.querySelector('#uSheet .v14-more');
    if (!box || box.querySelector('[data-atlas]')) return;
    var h4 = document.createElement('h4'); h4.textContent = 'استكشاف';
    var b = document.createElement('button'); b.type = 'button'; b.setAttribute('data-atlas', 'people');
    b.innerHTML = 'أطلس الكتاب<small>شخصيات · أنساب · خرائط</small>';
    var first = box.querySelector('h4'); box.insertBefore(h4, first); box.insertBefore(b, first);
  }
  new MutationObserver(injectMore).observe(document.body, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', injectMore);
  setTimeout(injectMore, 600);

  /* ---------- البحث الموحّد ---------- */
  function mapWithPlace(id) {
    var ms = A().maps;
    for (var i = 0; i < ms.length; i++) if (placesOf(ms[i]).indexOf(id) > -1) return ms[i];
    return null;
  }
  RF.search.register({
    id: 'atlas', title: 'أطلس الكتاب', order: 64,
    run: function (q, nq) {
      var nm = F().norm, rows = [];
      if (!nm || nq.length < 2) return rows;
      A().people.forEach(function (p) {
        if (rows.length < 8 && nm(p.n + ' ' + p.t).indexOf(nq) > -1) rows.push({ go: 'atlas:p:' + p.id, title: p.n, sub: 'شخصيات الكتاب — ' + p.t });
      });
      A().places.forEach(function (p) {
        var m = mapWithPlace(p.id);
        if (rows.length < 14 && m && nm(p.n).indexOf(nq) > -1) rows.push({ go: 'atlas:m:' + m.id + ':' + p.id, title: p.n, sub: 'خريطة — ' + m.title });
      });
      A().maps.forEach(function (m) {
        if (rows.length < 16 && nm(m.title + ' ' + m.sub).indexOf(nq) > -1) rows.push({ go: 'atlas:m:' + m.id, title: m.title, sub: 'خريطة — ' + m.sub });
      });
      return rows;
    },
    go: function (parts) { open(parts[1], parts[2], parts[3]); }
  });
  window.__atlasUI = { open: open, close: close };
})();
