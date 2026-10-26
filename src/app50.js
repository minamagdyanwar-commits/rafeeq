/* v6.8.101 — «الألحان والتماجيد»: نصوص مرتّلة (تماجيد وإبصاليات) من content/hymns/*.json (window.__hymns).
   تظهر في البحث الموحّد (RF.search) وتُفتح في نافذة القراءة نفسها المستخدمة لليوم في الرحلات (#progDay) ليرث التصميم والألوان. */
(function () {
  'use strict';
  function F() { return window.__F || {}; }
  function all() { return window.__hymns || []; }
  function byId(id) { return all().filter(function (h) { return h.id === id; })[0]; }
  function esc(s) { return RF.esc(s); }
  function open(id) {
    var h = byId(id); if (!h) return;
    var el = document.getElementById('progDay');
    if (!el) { el = document.createElement('div'); el.id = 'progDay'; el.className = 'prg-day'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); document.body.appendChild(el); }
    var link = h.src.url ? '<a class="pd-open pd-book" href="' + esc(h.src.url) + '" target="_blank" rel="noopener">افتح الصفحة الأصلية</a>' : '';
    el.innerHTML = '<button type="button" class="pg-x" data-hmback="1" aria-label="رجوع">✕</button><div class="pd-c"><small>' + esc(h.kind) + (h.sub ? ' · ' + esc(h.sub) : '') + '</small><h2>' + esc(h.title) + '</h2>' +
      '<article class="pd-v pd-quote hm-text">' + h.lines.map(function (l) { return '<p>' + esc(l) + '</p>'; }).join('') + '<b>المصدر: ' + esc(h.src.name) + '</b>' + link + '</article>' +
      (h.review && h.review.note ? '<p class="hm-note">' + esc(h.review.note) + '</p>' : '') + '</div>';
    el.classList.add('prg-day'); el.classList.add('on'); el.scrollTop = 0;
  }
  function close() { var el = document.getElementById('progDay'); if (el) el.classList.remove('on'); }
  document.addEventListener('click', function (e) {
    var t = e.target; if (t && t.closest && t.closest('[data-hmback]')) close();
  });
  RF.search.register({
    id: 'hymns', title: 'الألحان والتماجيد', order: 66,
    run: function (q, nq, ctx) {
      var nm = F().norm, rows = [];
      if (!nm || nq.length < 2) return rows;
      all().forEach(function (h) {
        if (rows.length >= 8) return;
        if (nm(h.title + ' ' + h.kind + ' ' + h.sub).indexOf(nq) > -1) { rows.push({ go: 'hymns:' + h.id, title: h.title, sub: h.kind + (h.sub ? ' — ' + h.sub : '') }); return; }
        for (var i = 0; i < h.lines.length; i++) {
          if (nm(h.lines[i]).indexOf(nq) > -1) { rows.push({ go: 'hymns:' + h.id, title: h.title, sub: h.kind + ' — ' + ctx.snip(h.lines[i]) }); break; }
        }
      });
      return rows;
    },
    go: function (p) { open(p[1]); }
  });
  window.__hymnsUI = { open: open, close: close };
})();
