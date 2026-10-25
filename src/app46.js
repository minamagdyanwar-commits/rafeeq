/* v6.8.75 — «ملخصي الموحّد» أعلى تبويب المتابعة: يجمع المتابعة اليومية والرحلات والخلوة في كارت واحد
   (المصدر: __F.dayPlan + rafeeq_prog_v1 + rafeeq_gd_log_v1) بدل ثلاث شاشات متفرقة. */
(function () {
  'use strict';
  function F() { return window.__F || {}; }
  function week() { var n = Date.now() - 7 * 864e5; return n; }
  function journeys() {
    var P = window.__progData || {}, S = RF.jget('rafeeq_prog_v1', {}), out = [];
    Object.keys(P).forEach(function (id) {
      var pr = P[id], st = S[id] || {}, d = st.done || {}, n = Object.keys(d).length, tot = (pr.days || []).length, last = 0;
      Object.keys(d).forEach(function (k) { if (d[k] > last) last = d[k]; });
      if (n > 0 && n < tot) out.push({ id: id, name: pr.short || pr.title || id, n: n, tot: tot, last: last });
    });
    return out.sort(function (a, b) { return b.last - a.last; }).slice(0, 3);
  }
  function khalwaWeek() {
    var l = RF.jget('rafeeq_gd_log_v1', []), w = week();
    return (Array.isArray(l) ? l : []).filter(function (x) { return x && x.ts > w; }).length;
  }
  function html() {
    var f = F(); if (!f.dayPlan) return '';
    var P = f.dayPlan(f.dkey()), J = journeys(), K = khalwaWeek(), s = 0;
    try { s = f.streak() || 0; } catch (e) {}
    var h = '<div class="rfu-top"><b>ملخصي</b><span>' + RF.ar(P.done) + ' / ' + RF.ar(P.total) + ' النهاردة</span></div>' +
      '<div class="rfu-bar"><i style="width:' + P.pct + '%"></i></div><div class="rfu-row">' +
      '<span>🔥 ' + RF.ar(s) + ' يوم متواصل</span><span>🕯 خلوة ' + RF.ar(K) + ' هذا الأسبوع</span></div>';
    if (P.next) h += '<button type="button" class="rfu-next" data-rfu="next"><small>الخطوة التالية</small><b>' + RF.esc(P.next.label) + '</b></button>';
    J.forEach(function (j) {
      h += '<button type="button" class="rfu-j" data-rfu="j" data-id="' + RF.esc(j.id) + '"><span>' + RF.esc(j.name) + '</span><em>' + RF.ar(j.n) + ' / ' + RF.ar(j.tot) + '</em><i><u style="width:' + Math.round(100 * j.n / j.tot) + '%"></u></i></button>';
    });
    return h;
  }
  function mount() {
    var f = F(), body = document.getElementById('trkBody');
    if (!body || !f.trkTab || f.trkTab() !== 'track') return;
    var c = document.getElementById('rfUni');
    if (c && c.parentNode === body && body.firstChild === c) return;
    var h = html(); if (!h) return;
    if (!c) { c = document.createElement('section'); c.id = 'rfUni'; c.className = 'u-card rfu'; }
    c.innerHTML = h; body.insertBefore(c, body.firstChild);
  }
  var t = 0;
  function sched() { clearTimeout(t); t = setTimeout(mount, 60); }
  function init() {
    var body = document.getElementById('trkBody');
    if (!body) { setTimeout(init, 600); return; }
    new MutationObserver(function (m) { if (m.some(function (x) { return !(x.target.id === 'rfUni' || (x.target.closest && x.target.closest('#rfUni'))); })) sched(); }).observe(body, { childList: true });
    sched();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-rfu]'); if (!b) return;
    var f = F();
    if (b.dataset.rfu === 'j') { if (window.__prog) window.__prog.open(b.dataset.id); return; }
    var P = f.dayPlan(f.dkey()), n = P.next, a = window.__rafeeq; if (!n || !a) return;
    if (n.type === 'hour') a.act('hour', { dataset: { key: n.key } });
    else if (n.type === 'read') a.act('read'); else if (n.type === 'med') a.act('meditation');
    else if (n.type === 'gd') a.act('guided'); else if (n.type === 'exam') a.act('exam');
    else if (n.type === 'memo') a.act('memo'); else if (n.type === 'prog' && window.__prog) window.__prog.openCurrent();
  }, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
