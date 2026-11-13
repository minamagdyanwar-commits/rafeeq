/* v6.16 — «الألحان والترانيم»: مكتبة كاملة فوق window.__hymns (من content/hymns/*.json)
   بحث + تصنيف + مفضلة + «تظهر في خلوتي» + مناسب للموسم. القارئ نفسه في app50.js (#progDay).
   التخزين: rafeeq_hymfav_v1 (المفضلة) و rafeeq_hymoff_v1 (ما استبعده المستخدم من الخلوة). */
(function () {
  'use strict';
  var KF = 'rafeeq_hymfav_v1', KO = 'rafeeq_hymoff_v1';
  var KORD = ['لحن', 'تمجيد', 'إبصالية', 'ترنيمة', 'مديح', 'طلبة', 'مزمور'];
  var S = { q: '', kind: '' };
  function F() { return window.__F || {}; }
  function esc(s) { return RF.esc(s); }
  function all() { return window.__hymns || []; }
  function arr(k) { var v = RF.jget(k, []); return Array.isArray(v) ? v : []; }
  function favs() { return arr(KF); }
  function offs() { return arr(KO); }
  function has(a, id) { return a.indexOf(id) > -1; }
  function flip(k, id) { var a = arr(k), i = a.indexOf(id); if (i < 0) a.push(id); else a.splice(i, 1); RF.jset(k, a); }
  function nrm(s) { var n = F().norm; return n ? n(s) : String(s).replace(/[ً-ْـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه'); }
  function byId(id) { return all().filter(function (h) { return h.id === id; })[0]; }
  function kinds() {
    var k = [];
    all().forEach(function (h) { if (k.indexOf(h.kind) < 0) k.push(h.kind); });
    return k.sort(function (a, b) { var x = KORD.indexOf(a), y = KORD.indexOf(b); return (x < 0 ? 99 : x) - (y < 0 ? 99 : y) || (a < b ? -1 : 1); });
  }
  /* الموسم الحالي من تقويم الكنيسة (__copCal): jonah · lent · holy · pasc · apostles · virgin · adv */
  function season() {
    try {
      var c = window.__copCal && window.__copCal.label(new Date()), m = c && c.main;
      return m ? { id: m.k, label: m.name } : null;
    } catch (e) { return null; }
  }
  function seasonal() {
    var se = season();
    return se ? all().filter(function (h) { return h.season && h.season.indexOf(se.id) > -1; }) : [];
  }

  /* ---------- المكتبة ---------- */
  function filtered() {
    var nq = nrm(S.q).trim(), fv = favs();
    return all().filter(function (h) {
      if (S.kind === '*fav' && !has(fv, h.id)) return false;
      if (S.kind && S.kind !== '*fav' && h.kind !== S.kind) return false;
      if (nq.length >= 2 && nrm(h.title + ' ' + h.kind + ' ' + h.sub + ' ' + (h.occasion || '') + ' ' + (h.tags || []).join(' ') + ' ' + h.lines.join(' ')).indexOf(nq) < 0) return false;
      return true;
    });
  }
  function subOf(h) { return String(h.sub || '').replace(new RegExp('^' + h.kind + '\\s*[—-]\\s*'), ''); }
  function card(h) {
    var f = has(favs(), h.id), rv = h.review && h.review.status && h.review.status !== 'reviewed';
    return '<div class="hl-it"><button type="button" class="hl-open" data-hlopen="' + esc(h.id) + '"><b>' + esc(h.title) + '</b><small>' + esc(h.kind) + (subOf(h) ? ' — ' + esc(subOf(h)) : '') + (rv ? ' · قيد المراجعة' : '') + '</small></button>' +
      '<button type="button" class="hl-fav' + (f ? ' on' : '') + '" data-hlfav="' + esc(h.id) + '" aria-pressed="' + f + '" aria-label="' + (f ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة') + '">' + (f ? '★' : '☆') + '</button></div>';
  }
  function chips() {
    var fv = favs().length, out = '<button type="button" class="hl-chip' + (!S.kind ? ' on' : '') + '" data-hlk="">الكل</button>';
    if (fv) out += '<button type="button" class="hl-chip' + (S.kind === '*fav' ? ' on' : '') + '" data-hlk="*fav">★ المفضلة</button>';
    kinds().forEach(function (k) { out += '<button type="button" class="hl-chip' + (S.kind === k ? ' on' : '') + '" data-hlk="' + esc(k) + '">' + esc(k) + '</button>'; });
    return out;
  }
  function listHtml() {
    var L = filtered(), out = '', se = season(), sm = (!S.q && !S.kind) ? seasonal() : [];
    if (sm.length) out += '<h3 class="hl-h">مناسب للموسم — ' + esc(se.label) + '</h3>' + sm.map(card).join('') + '<h3 class="hl-h">كل الألحان والترانيم</h3>';
    if (!L.length) return out + '<p class="hl-empty">' + (S.kind === '*fav' ? 'لسه مفيش مفضلة. اضغط ☆ جنب أي لحن أو ترنيمة.' : (all().length ? 'مفيش نتائج.' : 'لسه مفيش ألحان مضافة.')) + '</p>';
    return out + L.map(card).join('');
  }
  function ensure() {
    var el = document.getElementById('hymLib');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'hymLib'; el.className = 'prg-page'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'الألحان والترانيم');
    document.body.appendChild(el);
    return el;
  }
  function render() {
    var el = ensure(), n = all().length, k = kinds().length;
    el.innerHTML = '<button type="button" class="pg-x" data-hlclose="1" aria-label="إغلاق">✕</button><div class="hl-c"><h2>الألحان والترانيم</h2>' +
      '<p class="hl-sub">عدد النصوص: ' + RF.ar(n) + ' · الأقسام: ' + RF.ar(k) + ' — بتظهر في «الخلوة» كصلاة، وتقدر تختار أنهي واحد يظهر.</p>' +
      '<input class="hl-q" id="hlQ" type="search" placeholder="ابحث بالاسم أو بكلمة من النص…" value="' + esc(S.q) + '" aria-label="بحث في الألحان">' +
      '<div class="hl-chips" id="hlChips">' + chips() + '</div><div class="hl-list" id="hlList">' + listHtml() + '</div></div>';
  }
  function open() {
    S.q = ''; S.kind = '';
    render();
    var el = ensure(); el.classList.add('on'); el.scrollTop = 0;
  }
  function close() { var el = document.getElementById('hymLib'); if (el) el.classList.remove('on'); }
  function refresh() {
    var l = document.getElementById('hlList'), c = document.getElementById('hlChips');
    if (l) l.innerHTML = listHtml();
    if (c) c.innerHTML = chips();
  }

  /* ---------- شريط القارئ: مفضلة + «تظهر في خلوتي» ---------- */
  window.__hymBar = function (h) {
    var f = has(favs(), h.id), k = !has(offs(), h.id);
    return '<div class="hm-bar"><button type="button" class="hm-tg' + (f ? ' on' : '') + '" data-hmfav="' + esc(h.id) + '" aria-pressed="' + f + '">' + (f ? '★ في المفضلة' : '☆ أضف للمفضلة') + '</button>' +
      '<button type="button" class="hm-tg' + (k ? ' on' : '') + '" data-hmkh="' + esc(h.id) + '" aria-pressed="' + k + '">' + (k ? '✓ يظهر في خلوتي' : 'لا يظهر في خلوتي') + '</button></div>';
  };

  /* ---------- مجموعة الخلوة ----------
     نص الترنيمة وسط الخلوة: يُفضَّل ما يرتبط بموضوع تأمل اليوم (كلمات tags في ملف النص)، وإلا ما يناسب الموسم الكنسي، وإلا عشوائي.
     ما استبعده المستخدم («لا يظهر في خلوتي») وما علّمه khalwa:false لا يدخل أبدًا. */
  window.__hymCtx = function () {
    try {
      var K = window.__khalwaYear, en = K && K.ready && K.entry && K.entry(new Date());
      if (!en) return '';
      return (en.th || '') + ' ' + (en.m || []).map(function (x) { return (x.t || '') + ' ' + (x.r || '') + ' ' + (x.v || ''); }).join(' ');
    } catch (e) { return ''; }
  };
  window.__hymnsKhalwa = function (ctx) {
    var off = offs(), pool = all().filter(function (h) { return h.khalwa !== false && !has(off, h.id); });
    var nc = nrm(ctx == null ? window.__hymCtx() : ctx);
    if (nc.length > 8) {
      var sc = pool.map(function (h) { return { h: h, n: (h.tags || []).filter(function (t) { return t.length > 2 && nc.indexOf(nrm(t)) > -1; }).length }; }), top = 0;
      sc.forEach(function (x) { if (x.n > top) top = x.n; });
      if (top > 0) { var hit = sc.filter(function (x) { return x.n >= Math.max(1, top - 1); }).map(function (x) { return x.h; }); if (hit.length) return hit; }
    }
    var se = season();
    if (se) {
      var sm = pool.filter(function (h) { return h.season && h.season.indexOf(se.id) > -1; });
      if (sm.length) return sm;
    }
    return pool;
  };

  /* ---------- الأحداث ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return; var b;
    if ((b = t.closest('[data-hlmore]'))) { e.preventDefault(); try { F().closeSheet(); } catch (x) {} open(); return; }
    if ((b = t.closest('[data-hlclose]'))) { close(); return; }
    if ((b = t.closest('[data-hlk]'))) { S.kind = b.getAttribute('data-hlk'); refresh(); return; }
    if ((b = t.closest('[data-hlopen]'))) { if (window.__hymnsUI) window.__hymnsUI.open(b.getAttribute('data-hlopen')); return; }
    if ((b = t.closest('[data-hlfav]'))) { flip(KF, b.getAttribute('data-hlfav')); if (S.kind === '*fav' && !favs().length) S.kind = ''; refresh(); return; }
    if ((b = t.closest('[data-hmfav]'))) {
      var id = b.getAttribute('data-hmfav'); flip(KF, id); var f = has(favs(), id);
      b.classList.toggle('on', f); b.setAttribute('aria-pressed', f); b.textContent = f ? '★ في المفضلة' : '☆ أضف للمفضلة'; refresh(); return;
    }
    if ((b = t.closest('[data-hmkh]'))) {
      var id2 = b.getAttribute('data-hmkh'); flip(KO, id2); var k = !has(offs(), id2);
      b.classList.toggle('on', k); b.setAttribute('aria-pressed', k); b.textContent = k ? '✓ يظهر في خلوتي' : 'لا يظهر في خلوتي'; return;
    }
  });
  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'hlQ') { S.q = e.target.value; var l = document.getElementById('hlList'); if (l) l.innerHTML = listHtml(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && document.getElementById('hymLib') && document.getElementById('hymLib').classList.contains('on') && !(document.getElementById('progDay') && document.getElementById('progDay').classList.contains('on'))) close(); });

  /* ---------- «المزيد» ---------- */
  function injectMore() {
    var box = document.querySelector('#uSheet .v14-more');
    if (!box || box.querySelector('[data-hlmore]')) return;
    var h4 = document.createElement('h4'); h4.textContent = 'الألحان';
    var b = document.createElement('button'); b.type = 'button'; b.setAttribute('data-hlmore', '1');
    b.innerHTML = 'الألحان والترانيم<small>تماجيد · إبصاليات · ألحان · مفضلتي</small>';
    var hs = [].slice.call(box.querySelectorAll('h4')), anchor = null, i;
    for (i = 0; i < hs.length; i++) if (/الدراسة|رحلات/.test(hs[i].textContent)) { anchor = hs[i]; break; }
    if (anchor) { box.insertBefore(h4, anchor); box.insertBefore(b, anchor); } else { box.appendChild(h4); box.appendChild(b); }
  }
  new MutationObserver(injectMore).observe(document.body, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', injectMore);
  setTimeout(injectMore, 700);

  /* ---------- المفضلات الموحّدة + البحث ---------- */
  RF.favs.register({
    id: 'hymns', order: 74, ic: '🎶', t: 'ألحاني وترانيمي المفضلة',
    hint: 'في «الألحان والترانيم» اضغط ☆ جنب أي نص.', key: KF,
    items: function () { return favs().map(byId).filter(Boolean).map(function (h) { return { id: h.id, head: h.title, sub: h.kind + (h.sub ? ' — ' + h.sub : ''), text: h.lines.slice(0, 2).join(' / '), ts: 0 }; }); },
    rm: function (id) { flip(KF, id); }
  });

  window.__hymLib = { open: open, close: close, render: render };
})();
