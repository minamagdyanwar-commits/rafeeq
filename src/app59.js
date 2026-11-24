/* v6.28 — «وصية ووعد في هذا الإصحاح»: تعليم الوصايا والوعود في نص الإصحاح + بطاقة تحته + خيارات في الإعدادات.
   البيانات: window.__bibleNotes (من content/bible-notes). نص كل وصية/وعد يُقرأ من نص الكتاب نفسه وقت العرض.
   الإعدادات تُحفظ على الجهاز: rafeeq_bn_v1 = {c:1|0, p:1|0, m:'both'|'card'|'text'}؛ وتنعكس على <html> كسمات
   data-bn-c / data-bn-p / data-bn-m ويتولى CSS الإخفاء، فلا يُعاد بناء الصفحة عند التبديل. */
(function () {
  'use strict';
  var KEY = 'rafeeq_bn_v1';
  function F() { return window.__F || {}; }
  function B() { return F().bible; }
  function esc(s) { return RF.esc(s); }
  function ar(n) { return String(n).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); }
  function load() {
    var s = { c: 1, p: 1, m: 'both' };
    try { var j = JSON.parse(localStorage.getItem(KEY) || '{}'); if (j.c === 0) s.c = 0; if (j.p === 0) s.p = 0; if (j.m === 'card' || j.m === 'text') s.m = j.m; } catch (e) {}
    return s;
  }
  var S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function apply() {
    var r = document.documentElement;
    r.setAttribute('data-bn-c', S.c ? '1' : '0'); r.setAttribute('data-bn-p', S.p ? '1' : '0'); r.setAttribute('data-bn-m', S.m);
    var q = function (id) { return document.getElementById(id); };
    [['bnTgC', S.c], ['bnTgP', S.p]].forEach(function (a) { var e = q(a[0]); if (e) e.setAttribute('aria-checked', a[1] ? 'true' : 'false'); });
    [['bnMBoth', 'both'], ['bnMCard', 'card'], ['bnMText', 'text']].forEach(function (a) { var e = q(a[0]); if (e) { e.classList.toggle('on', S.m === a[1]); e.setAttribute('aria-pressed', S.m === a[1] ? 'true' : 'false'); } });
  }

  function notes(b, c) { var N = window.__bibleNotes; return (N && N[b] && N[b][c]) || null; }
  function rangeLabel(r) { return r[0] === r[1] ? ar(r[0]) : ar(r[0]) + '–' + ar(r[1]); }
  function verseText(b, c, r) { try { return B().verses(b, c, r[0], r[1]).join(' '); } catch (e) { return ''; } }
  function chip(b, c, r) { return '<button type="button" class="chip bn-ref" data-bngo="' + b + ':' + c + ':' + r[0] + '" aria-label="اذهب إلى الآية ' + rangeLabel(r) + '">' + (r[0] === r[1] ? 'آية ' : 'آيات ') + rangeLabel(r) + '</button>'; }

  function why(it) { return it.why ? '<details class="bn-why"><summary>لماذا قيل؟</summary><p>' + esc(it.why) + '</p></details>' : ''; }

  function html(b, c) {
    var n = notes(b, c); if (!n) return '';
    var h = '';
    (n.c || []).forEach(function (it) {
      var t = verseText(b, c, it.v); if (!t) return;
      h += '<div class="bn-it bn-it-c"><div class="bn-k">' + (it.d ? 'وصية (مستنتجة من الإصحاح)' : 'وصية') + '</div><div class="bn-q">' + esc(t) + '</div><div class="bn-refs">' + chip(b, c, it.v) + '</div><div class="bn-line"><b>أعملها اليوم:</b> ' + esc(it['do']) + '</div>' + why(it) + '</div>';
    });
    var hc = h; h = '';
    (n.p || []).forEach(function (it) {
      var t = verseText(b, c, it.v); if (!t) return;
      h += '<div class="bn-it bn-it-p"><div class="bn-k">وعد</div><div class="bn-q">' + esc(t) + '</div><div class="bn-refs">' + chip(b, c, it.v) + '</div><div class="bn-line"><b>في المقابل:</b> ' + esc(it.back) + '</div>' + why(it) + '</div>';
    });
    var hp = h;
    if (!hc && !hp) return '';
    return '<div class="u-card pad bn-card" id="bnCard" data-k="' + b + ':' + c + '"><h3 class="u-h3">وصية ووعد في هذا الإصحاح</h3>' +
      (hc ? '<div class="bn-sec bn-sec-c">' + hc + '</div>' : '') + (hp ? '<div class="bn-sec bn-sec-p">' + hp + '</div>' : '') + '</div>';
  }

  function inject() {
    try {
      var t = document.getElementById('bibleText'), bb = B();
      if (!t || !bb || !bb.cur || !bb.data) return;
      var cur = bb.cur(); if (!cur) return;
      var k = cur.b + ':' + cur.c, n = notes(cur.b, cur.c);
      /* تعليم الآيات في النص (الإخفاء/الإظهار يتولاه CSS) */
      var ps = t.querySelectorAll('p.bv[data-v]');
      for (var i = 0; i < ps.length; i++) {
        var p = ps[i]; if (p.getAttribute('data-bnk') === k) continue;
        var v = +p.getAttribute('data-v'), c = false, pr = false;
        if (n) { (n.c || []).forEach(function (it) { if (v >= it.v[0] && v <= it.v[1]) c = true; }); (n.p || []).forEach(function (it) { if (v >= it.v[0] && v <= it.v[1]) pr = true; }); }
        p.classList.toggle('bn-c', c); p.classList.toggle('bn-p', pr); p.setAttribute('data-bnk', k);
      }
      var ex = document.getElementById('bnCard');
      if (ex && ex.getAttribute('data-k') === k) { var pv = ex.previousElementSibling; if (pv === t || (pv && pv.id === 'chCtx')) return; }
      if (ex) ex.remove();
      var h = html(cur.b, cur.c); if (!h) return;
      var anchor = t, nx = t.nextElementSibling; if (nx && nx.id === 'chCtx') anchor = nx;
      anchor.insertAdjacentHTML('afterend', h);
    } catch (e) {}
  }
  var raf = 0;
  new MutationObserver(function () { if (raf) return; raf = requestAnimationFrame(function () { raf = 0; inject(); }); }).observe(document.body, { childList: true, subtree: true });

  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return; var b;
    if ((b = t.closest('[data-bngo]'))) { var p = b.getAttribute('data-bngo').split(':'); try { F().openBible(+p[0], +p[1], +p[2]); } catch (x) {} return; }
    if ((b = t.closest('#bnTgC'))) { S.c = S.c ? 0 : 1; save(); apply(); return; }
    if ((b = t.closest('#bnTgP'))) { S.p = S.p ? 0 : 1; save(); apply(); return; }
    if ((b = t.closest('#bnMBoth,#bnMCard,#bnMText'))) { S.m = b.id === 'bnMCard' ? 'card' : b.id === 'bnMText' ? 'text' : 'both'; save(); apply(); return; }
  });
  apply(); document.addEventListener('DOMContentLoaded', apply);
  window.__bn = { html: html, notes: notes, state: function () { return JSON.parse(JSON.stringify(S)); } };
})();
