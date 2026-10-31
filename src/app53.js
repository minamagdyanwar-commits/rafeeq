/* دفتري مع يسوع — صفحات مبنية من المحتوى مباشرة (ليست إعادة تلبيس لصفحات البرنامج).
   كل صفحة هنا تقرأ البيانات (نصوص الأجبية…) أو حالة الصفحة الأصلية وتعرضها بعناصر الدفتر، وتُحوِّل أفعالها إلى الأزرار الأصلية فتبقى الوظائف كما هي.
   تعمل فقط حين يكون التصميم diary/. الصفحة الأصلية تبقى حيّة لكن مخفية (CSS). */
(function () {
  'use strict';
  function F() { return window.__F || {}; }
  function K() { return window.__k || {}; }
  function esc(s) { return RF.esc(s); }
  function ar(n) { return RF.ar(n); }
  function q(s, r) { return (r || document).querySelector(s); }
  function qa(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function on() { return /^diary\//.test(document.documentElement.getAttribute('data-rf-theme') || ''); }
  function para(s) { return '<p>' + esc(String(s)).replace(/\n/g, '<br>') + '</p>'; }
  function paras(a) { return (Array.isArray(a) ? a : [a]).filter(function (x) { return x != null && String(x).trim(); }).map(para).join(''); }

  /* =============== الصلاة (الأجبية) =============== */
  var PS = { hour: null, open: {} };
  function hourIds() { try { var v = F().hourKeys(); if (v && v.length) return v; } catch (e) { } return ['bakr', 'thalitha', 'sadisa', 'tasi3a', 'ghouroub', 'noum']; }
  function keysOf(id) { var g = null; try { g = F().groupById(id); } catch (e) { } return g && g.keys && g.keys.length ? g.keys : [id]; }
  function hourLabel(id) { var g = null; try { g = F().groupById(id); } catch (e) { } if (g) return g.label; var H = (K().HOURS || {})[id]; return H ? H.label : id; }
  function hourTime(id) { return ((K().HOUR_TIME || {})[keysOf(id)[0]]) || ''; }
  function suggested() { try { var s = K().getSuggestedHourKey(); return s; } catch (e) { return hourIds()[0]; } }
  function dkey() { return F().dkey ? F().dkey() : ''; }
  function isDone(id) { try { return !!F().hourDone(dkey(), id); } catch (e) { return false; } }
  function activeSub() {
    var m = { tabAgpeya: 'agpeya', tabJourneys: 'journeys', tabMeditation: 'meditation', tabGuided: 'guided' }, r = 'agpeya';
    Object.keys(m).forEach(function (id) { var e = document.getElementById(id); if (e && e.classList.contains('active')) r = m[id]; });
    return r;
  }
  function pItem(it) {
    var med = it.meditation && it.meditation.length ? '<details class="dy-med"><summary>تأمّل</summary>' + paras(it.meditation) + '</details>' : '';
    return '<article class="dy-pi" id="dyp-' + esc(it.id || '') + '"><h3>' + esc(it.title || '') + '</h3>' +
      ((it.subtitle || it.ref) ? '<small>' + esc([it.subtitle, it.ref].filter(Boolean).join(' · ')) + '</small>' : '') +
      '<div class="dy-pt">' + paras(it.text || '') + '</div>' + med + '</article>';
  }
  function prayerBody(id) {
    var out = [], toc = [], hk = keysOf(id);
    hk.forEach(function (k, ix) {
      var H = (K().HOURS || {})[k]; if (!H) return;
      var pre = hk.length > 1 ? k + '-' : '';
      function sec(sid, title, html) { var a = 'dys-' + pre + sid; toc.push([a, hk.length > 1 ? (H.label || '') + ': ' + title : title]); out.push('<section class="dy-ps" id="' + a + '"><h2>' + esc(title) + '</h2>' + html + '</section>'); }
      if (hk.length > 1) out.push('<h2 class="dy-hsub">' + esc(H.label || '') + (H.sub ? ' <small>' + esc(H.sub) + '</small>' : '') + '</h2>');
      if (H.intro) sec('intro', H.intro.title || 'عن الصلاة', paras(H.intro.paragraphs || []));
      if (H.openingReflection) sec('oref', H.openingReflection.title || 'صلاة تأملية افتتاحية', paras(H.openingReflection.lines || []) + (H.openingReflection.amen ? '<p class="dy-amen">' + esc(H.openingReflection.amen) + '</p>' : ''));
      if (H.opening && H.opening.items && H.opening.items.length) sec('open', 'مقدمة الصلاة', H.opening.items.map(pItem).join(''));
      ['psalm', 'gospel', 'qeta', 'tahleel'].forEach(function (pk) { var P = H.parts && H.parts[pk]; if (P && P.items && P.items.length) sec(pk, P.label || pk, P.items.map(pItem).join('')); });
      if (H.recurring && H.recurring.items && H.recurring.items.length) sec('rec', 'الصلوات الثابتة', H.recurring.items.map(pItem).join(''));
      if (H.closing) sec('close', H.closing.title || 'صلاة تأملية ختامية', paras(H.closing.lines || []) + (H.closing.amen ? '<p class="dy-amen">' + esc(H.closing.amen) + '</p>' : ''));
    });
    return { toc: toc, html: out.join('') };
  }
  function prayHtml() {
    var ids = hourIds(), sug = suggested(), cur = PS.hour || sug || ids[0];
    if (ids.indexOf(cur) < 0) ids = ids.concat([cur]);
    var done = isDone(cur), sub = activeSub();
    var flags = [['agpeya', 'الأجبية', 'tabAgpeya'], ['journeys', 'رحلاتي', 'tabJourneys'], ['meditation', 'التأملات', 'tabMeditation'], ['guided', 'الخلوة', 'tabGuided']].map(function (f) {
      return '<button type="button" class="dy-flag' + (sub === f[0] ? ' on' : '') + '" data-dyproxy="#' + f[2] + '">' + f[1] + '</button>';
    }).join('');
    var h = '<div class="dy-flags" role="tablist">' + flags + '</div>';
    if (sub !== 'agpeya') return h;
    var chips = ids.map(function (id) {
      var d = isDone(id), now = id === sug && !d;
      return '<button type="button" class="dy-hc' + (id === cur ? ' sel' : '') + (d ? ' done' : '') + (now ? ' now' : '') + '" data-dyhour="' + esc(id) + '">' + esc(hourLabel(id)) + (d ? ' ✓' : '') + '</button>';
    }).join('');
    var body = prayerBody(cur);
    var note = (cur !== sug && sug) ? '<div class="dy-sticky"><b>الساعة المناسبة الآن: ' + esc(hourLabel(sug)) + '</b><button type="button" data-dyhour="' + esc(sug) + '">افتحها ‹</button></div>' : '';
    h += '<div class="dy-hours">' + chips + '</div>' + note +
      '<header class="dy-ph"><h1>صلاة ' + esc(hourLabel(cur)) + '</h1><p>' + esc(hourTime(cur)) + '</p></header>' +
      '<nav class="dy-toc" aria-label="محتويات الصلاة">' + body.toc.map(function (t) { return '<button type="button" data-dyjump="' + t[0] + '">' + esc(t[1]) + '</button>'; }).join('') + '</nav>' +
      body.html +
      '<div class="dy-end"><button type="button" class="dy-stampbtn' + (done ? ' on' : '') + '" data-dyhourdone="' + esc(cur) + '">' + (done ? '✓ صلّيتُ ' : 'علّم: صلّيتُ ') + esc(hourLabel(cur)) + '</button></div>' +
      '<div class="dy-tools"><h2>أدوات الصلاة</h2><button type="button" class="dy-link" data-dyproxy="#wakeChip">☀ إبقاء الشاشة مضاءة أثناء الصلاة</button></div>';
    return h;
  }
  function paintPray() {
    var mod = q('#mod-k'), el = document.getElementById('dyV-pray');
    if (!on() || !mod) { if (el) el.remove(); return; }
    if (!el) { el = document.createElement('div'); el.id = 'dyV-pray'; el.className = 'dy-view'; mod.insertBefore(el, mod.firstChild); }
    var h = prayHtml();
    if (el.dataset.h !== h) { var y = window.scrollY; el.innerHTML = h; el.dataset.h = h; if (document.documentElement.getAttribute('data-pg') === 'pray') window.scrollTo(0, y); }
  }


  /* =============== أقوال الآباء =============== */
  var FS = { q: '', f: '', n: 24 };
  function nrm(x) { try { return RF.norm ? RF.norm(x) : String(x).replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه'); } catch (e) { return String(x); } }
  function fathersHtml() {
    var A = window.__fathers; if (!A || !A.items) return '';
    var names = []; A.items.forEach(function (t) { if (names.indexOf(t.f) < 0) names.push(t.f); });
    var nq = nrm(FS.q.trim());
    var list = A.items.filter(function (t) { return (!FS.f || t.f === FS.f) && (!nq || nrm(t.t + ' ' + t.f + ' ' + (t.g || []).join(' ')).indexOf(nq) > -1); });
    var shown = list.slice(0, FS.n);
    return '<header class="dy-ph"><h1>أقوال الآباء</h1><p>من كتاب «أقوال الآباء الشيوخ» — اقرأ قولًا، وسجّل ما لمس قلبك</p></header>' +
      '<div class="dy-find"><input type="search" class="dy-in" id="dyFatQ" placeholder="ابحث في الأقوال…" value="' + esc(FS.q) + '">' +
      '<select class="dy-in" id="dyFatF"><option value="">كل الآباء</option>' + names.map(function (n) { return '<option' + (n === FS.f ? ' selected' : '') + '>' + esc(n) + '</option>'; }).join('') + '</select></div>' +
      '<p class="dy-count">' + ar(list.length) + ' قولًا</p>' +
      shown.map(function (t) {
        return '<article class="dy-say"><div class="dy-sayf">' + esc(t.f) + '</div><blockquote>' + esc(t.t) + '</blockquote>' +
          ((t.g && t.g.length) ? '<div class="dy-sayg">' + t.g.slice(0, 3).map(function (g) { return '<span>' + esc(g) + '</span>'; }).join('') + '</div>' : '') + '</article>';
      }).join('') +
      (list.length > shown.length ? '<div class="dy-end"><button type="button" class="dy-stampbtn" data-dymore="fat">المزيد ‹</button></div>' : '');
  }
  function paintFat() {
    var pg = q('#page-fat'), el = document.getElementById('dyV-fat');
    if (!on() || !pg) { if (el) el.remove(); return; }
    var h = fathersHtml(); if (!h) return;
    if (!el) { el = document.createElement('div'); el.id = 'dyV-fat'; el.className = 'dy-view'; pg.insertBefore(el, pg.firstChild); }
    if (el.dataset.h !== h) {
      var act = document.activeElement, keep = act && act.id, pos = act && act.selectionStart;
      el.innerHTML = h; el.dataset.h = h;
      if (keep && /^dyFat/.test(keep)) { var n = document.getElementById(keep); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) { } } }
    }
  }
  document.addEventListener('input', function (e) { var t = e.target; if (t && t.id === 'dyFatQ') { FS.q = t.value; FS.n = 24; paintFat(); } });
  document.addEventListener('change', function (e) { var t = e.target; if (t && t.id === 'dyFatF') { FS.f = t.value; FS.n = 24; paintFat(); } });

  /* =============== رسالة اليوم (خطاب من يسوع) =============== */
  function paintMsg() {
    var pg = q('#page-msg'), body = document.getElementById('msgBody'), el = document.getElementById('dyV-msg');
    if (!on() || !pg || !body) { if (el) el.remove(); return; }
    var head = q('.mg-head', body), art = q('article', body); if (!head || !art) return;
    var d = q('.mg-date b', head), dd = q('.mg-date span', head), feast = q('.mg-feast', head), th = q('.mg-theme b', head);
    var btns = qa('.u-btn', head);
    var h = '<header class="dy-ph dy-lt"><p>' + esc(dd ? dd.textContent : '') + '</p><h1>' + esc(d ? d.textContent : '') + '</h1>' +
      (feast ? '<p class="dy-feast">' + esc(feast.textContent) + '</p>' : '') +
      (th ? '<p class="dy-theme">موضوع اليوم: <b>' + esc(th.textContent) + '</b></p>' : '') + '</header>' +
      '<div class="dy-flags">' + btns.map(function (b, i) { return '<button type="button" class="dy-flag" data-dymsg="' + i + '">' + esc(b.textContent.trim()) + '</button>'; }).join('') + '</div>';
    h += '<article class="dy-letter">';
    [].slice.call(art.children).forEach(function (c) {
      if (c.classList.contains('mg-from')) h += '<div class="dy-from">' + esc(c.textContent) + '</div>';
      else if (c.tagName === 'SECTION') {
        var tag = q('.mg-tag', c);
        h += '<section class="dy-ls"><h2>' + esc(tag ? tag.textContent : '') + '</h2>' + [].slice.call(c.children).filter(function (x) { return x !== tag; }).map(function (x) {
          if (x.tagName === 'BLOCKQUOTE') return '<blockquote>' + esc((q('p', x) || x).textContent) + (q('cite', x) ? '<cite>' + esc(q('cite', x).textContent) + '</cite>' : '') + '</blockquote>';
          return '<p>' + esc(x.textContent) + '</p>';
        }).join('') + '</section>';
      } else if (c.tagName === 'P') h += '<p class="dy-lp">' + esc(c.textContent) + '</p>';
      else if (c.textContent.trim()) h += '<p class="dy-lp">' + esc(c.textContent) + '</p>';
    });
    h += '</article>';
    if (!el) { el = document.createElement('div'); el.id = 'dyV-msg'; el.className = 'dy-view'; pg.insertBefore(el, pg.firstChild); }
    if (el.dataset.h !== h) { el.innerHTML = h; el.dataset.h = h; }
  }
  var msgObs = 0;
  function watchMsg() { var m = document.getElementById('msgBody'); if (!m || msgObs) return; msgObs = 1; new MutationObserver(function () { setTimeout(paintMsg, 30); }).observe(m, { childList: true }); }

  /* =============== الأحداث والتزامن =============== */
  function paintAll() { try { paintPray(); } catch (e) { } try { paintFat(); } catch (e) { } try { paintMsg(); watchMsg(); } catch (e) { } }
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest || !on()) return;
    var b;
    if ((b = t.closest('[data-dymore]'))) { e.preventDefault(); FS.n += 24; paintFat(); return; }
    if ((b = t.closest('[data-dymsg]'))) { e.preventDefault(); var ob = qa('#msgBody .mg-head .u-btn')[+b.getAttribute('data-dymsg')]; if (ob) ob.click(); setTimeout(paintAll, 120); return; }
    if ((b = t.closest('[data-dyproxy]'))) { e.preventDefault(); var o = q(b.getAttribute('data-dyproxy')); if (o) o.click(); setTimeout(paintAll, 80); return; }
    if ((b = t.closest('[data-dyhour]'))) { e.preventDefault(); PS.hour = b.getAttribute('data-dyhour'); paintAll(); window.scrollTo(0, 0); return; }
    if ((b = t.closest('[data-dyjump]'))) { e.preventDefault(); var s = document.getElementById(b.getAttribute('data-dyjump')); if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if ((b = t.closest('[data-dyhourdone]'))) {
      e.preventDefault(); var id = b.getAttribute('data-dyhourdone');
      try { F().setHour(dkey(), id, !isDone(id)); if (F().toast) F().toast(isDone(id) ? 'تمّ ختم «صلّيتُ ' + hourLabel(id) + '»' : 'أُلغي الختم'); } catch (x) { }
      paintAll(); return;
    }
  }, true);
  new MutationObserver(function () { setTimeout(paintAll, 30); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-rf-theme', 'data-pg'] });
  var modObs = 0;
  function watchMod() {
    var m = q('#mod-k'); if (!m || modObs) return; modObs = 1;
    new MutationObserver(function () { setTimeout(paintAll, 30); }).observe(m, { attributes: true, subtree: true, attributeFilter: ['class'] });
  }
  if (window.RF && RF.act && RF.act.on) RF.act.on(paintAll);
  document.addEventListener('rafeeq:theme', paintAll);
  function boot() { paintAll(); watchMod(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  setTimeout(boot, 1000);
  window.__diaryViews = { paint: paintAll };
})();
