/* v6.16 — «سياق الإصحاح»: تحت نص الإصحاح في «الكتاب» بطاقة بثلاث وصلات من بيانات موجودة:
   ١) الأطلس: شخصيات وخرائط وأماكن مذكورة في هذا الإصحاح (مراجع content/atlas)
   ٢) الشواهد المقابلة: أكثر الإصحاحات إحالةً من آيات هذا الإصحاح (xrData)
   ٣) قول من الآباء يتصل بموضوع الإصحاح (تصنيفات «أقوال الآباء الشيوخ» مقابل كلمات النص)
   لا محتوى جديد: وصلات فقط، وتُبنى عند أول عرض لكل إصحاح وتُخزَّن. */
(function () {
  'use strict';
  function F() { return window.__F || {}; }
  function B() { return F().bible; }
  function esc(s) { return RF.esc(s); }
  function nrm(s) { var n = F().norm; return n ? n(s) : String(s); }
  var CACHE = {}, REFC = {};
  function refOf(ref) {
    if (REFC[ref] !== undefined) return REFC[ref];
    var r = null; try { r = B().parseRef(ref); } catch (e) {}
    return (REFC[ref] = r && r.bi != null ? { bi: r.bi, ch: r.ch } : null);
  }
  function hits(refs, b, c) { return (refs || []).some(function (x) { var r = refOf(x); return r && r.bi === b && r.ch === c; }); }

  function build(b, c) {
    var k = b + ':' + c; if (CACHE[k]) return CACHE[k];
    var bb = B(), A = window.__atlas || { people: [], places: [], maps: [] }, out = { people: [], maps: [], places: [], xr: [], father: null };
    out.people = A.people.filter(function (p) { return hits(p.r, b, c); }).slice(0, 6);
    out.maps = A.maps.filter(function (m) { return hits(m.refs, b, c); }).slice(0, 3);
    out.places = A.places.filter(function (p) { return hits(p.r, b, c); }).slice(0, 6);
    /* الشواهد المقابلة */
    try {
      if (bb.xr) {
        var tally = {}, n = (bb.data[b].c[c - 1] || []).length;
        for (var v = 1; v <= n; v++) bb.xrefs(b, c, v).forEach(function (g) {
          var t = bb.fromGid(g); if (t.bi === b && t.ch === c) return;
          var key = t.bi + ':' + t.ch, o = tally[key] || (tally[key] = { bi: t.bi, ch: t.ch, v: t.v, n: 0 }); o.n++;
        });
        out.xr = Object.keys(tally).map(function (x) { return tally[x]; }).sort(function (a, z) { return z.n - a.n || a.bi - z.bi || a.ch - z.ch; }).slice(0, 4);
      }
    } catch (e) {}
    /* قول من الآباء: مجموع مرات ظهور كلمات تصنيف القول في نص الإصحاح */
    try {
      var F2 = window.__fathers;
      if (F2 && F2.ready && F2.items) {
        var txt = nrm((bb.data[b].c[c - 1] || []).join(' ')), cnt = {};
        var best = [];
        F2.items.forEach(function (it, i) {
          var sc = 0, dist = 0;
          (it.g || []).forEach(function (g) {
            var key = nrm(g); if (key.length < 3) return;
            if (cnt[key] === undefined) { var m = txt.split(key).length - 1; cnt[key] = m; }
            if (cnt[key] >= 2) { sc += Math.min(cnt[key], 4); dist++; }
          });
          /* وصلة موضوعية حقيقية: تصنيفان على الأقل يتكرر كل منهما في الإصحاح */
          if (dist >= 2 && sc >= 5 && it.t && it.t.length < 420) best.push({ it: it, sc: sc, i: i });
        });
        best.sort(function (a, z) { return z.sc - a.sc || a.i - z.i; });
        if (best.length) out.father = best.slice(0, 3)[(b * 131 + c) % Math.min(3, best.length)].it;
      }
    } catch (e) {}
    return (CACHE[k] = out);
  }

  function html(b, c) {
    var d = build(b, c), bb = B(), h = '';
    function row(t, inner) { return '<div class="cc-r"><div class="u-sub">' + t + '</div><div class="cc-c">' + inner + '</div></div>'; }
    if (d.people.length) h += row('شخصيات في الإصحاح', d.people.map(function (p) { return '<button type="button" class="chip" data-ccp="' + esc(p.id) + '">' + esc(p.n) + '</button>'; }).join(''));
    if (d.maps.length) h += row('خرائط', d.maps.map(function (m) { return '<button type="button" class="chip" data-ccm="' + esc(m.id) + '">' + esc(m.title) + '</button>'; }).join(''));
    if (d.places.length) h += row('أماكن', d.places.map(function (p) { return '<span class="cc-pl">' + esc(p.n) + '</span>'; }).join('، '));
    if (d.xr.length) h += row('أكثر إصحاحات يُحال إليها من هنا', d.xr.map(function (x) { return '<button type="button" class="chip" data-ccgo="' + x.bi + ':' + x.ch + ':' + x.v + '">' + esc(bb.label(x.bi, x.ch)) + ' (' + RF.ar(x.n) + ')</button>'; }).join(''));
    if (d.father) {
      var ct = ''; try { ct = window.__fathers.cite(d.father); } catch (e) {}
      h += row('من الآباء', '<div class="u-note">«' + esc(d.father.t) + '»</div><div class="u-sub">' + esc(d.father.f) + (ct ? ' — ' + esc(ct) : '') + '</div>');
    }
    return h ? '<div class="u-card pad cc-b" id="chCtx" data-k="' + b + ':' + c + '"><h3 class="u-h3">سياق الإصحاح</h3>' + h + '</div>' : '';
  }

  function inject() {
    try {
      var t = document.getElementById('bibleText'), bb = B();
      if (!t || !bb || !bb.cur || !bb.data) return;
      var cur = bb.cur(); if (!cur) return;
      var k = cur.b + ':' + cur.c, ex = document.getElementById('chCtx');
      if (ex && ex.getAttribute('data-k') === k && ex.previousElementSibling === t) return;
      if (ex) ex.remove();
      var h = html(cur.b, cur.c);
      if (h) t.insertAdjacentHTML('afterend', h);
    } catch (e) {}
  }
  new MutationObserver(function () { inject(); }).observe(document.body, { childList: true, subtree: true });

  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return; var b;
    if ((b = t.closest('[data-ccp]'))) { if (window.__atlasUI) window.__atlasUI.open('p', b.getAttribute('data-ccp')); return; }
    if ((b = t.closest('[data-ccm]'))) { if (window.__atlasUI) window.__atlasUI.open('m', b.getAttribute('data-ccm')); return; }
    if ((b = t.closest('[data-ccgo]'))) { var p = b.getAttribute('data-ccgo').split(':'); try { F().openBible(+p[0], +p[1], +p[2]); } catch (x) {} return; }
  });
  window.__chCtx = { build: build, html: html };
})();
