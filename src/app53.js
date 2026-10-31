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


  /* =============== القراءات =============== */
  function tx(e) { return e ? e.textContent.replace(/\s+/g, ' ').trim() : ''; }
  function readHtml() {
    var m = q('#mod-r'); if (!m || !q('#readingHost', m)) return '';
    var h = '<header class="dy-ph"><h1>قراءات اليوم</h1><p>' + esc(tx(q('#copticOut', m))) + '</p></header>';
    h += '<div class="dy-flags"><button type="button" class="dy-flag" data-dyproxy="#prevDay">‹ أمس</button><button type="button" class="dy-flag" data-dyproxy="#todayBtn">اليوم</button><button type="button" class="dy-flag" data-dyproxy="#nextDay">غدًا ›</button></div>';
    var cm = qa('.syn-cm', m).filter(function (x) { return !x.classList.contains('syn-cm-go'); });
    if (cm.length) h += '<div class="dy-sticky">' + cm.map(function (x) { return '<div>' + esc(tx(x)) + '</div>'; }).join('') + '</div>';
    h += '<div class="dy-hours">' + qa('#weekStrip .week-chip', m).map(function (b, i) {
      return '<button type="button" class="dy-hc' + (b.classList.contains('is-current') ? ' sel' : '') + '" data-dyproxy="#weekStrip .week-chip:nth-child(' + (i + 1) + ')">' + esc(tx(q('.wd', b)) + ' ' + tx(q('.dn', b))) + '</button>';
    }).join('') + '</div>';
    h += '<div class="dy-flags">' + qa('#tabs .tab', m).map(function (b) {
      return '<button type="button" class="dy-flag' + (b.classList.contains('active') || b.classList.contains('on') ? ' on' : '') + '" data-dyproxy="#' + b.id + '">' + esc(tx(b)) + '</button>';
    }).join('') + '</div>';
    var host = q('#readingHost', m), card = host.firstElementChild;
    if (card) {
      var bi = q('.book-info-summary', card);
      qa('.context-line', card).forEach(function (c) { if (!c.querySelector('.book-info-body')) h += '<p class="dy-ctx">' + esc(tx(c)) + '</p>'; });
      qa('.subreading', card).forEach(function (sr) {
        var bq = q('blockquote', sr), isP = bq && bq.classList.contains('psalm');
        h += '<section class="dy-ps"><h2>' + esc(tx(q('.name', sr))) + ' <small>' + esc(tx(q('.ref', sr))) + '</small></h2><div class="dy-pt' + (isP ? ' dy-psalm' : '') + '">' + (bq ? paras(bq.innerText.split(/\n+/)) : '') + '</div></section>';
      });
      if (bi) h += '<details class="dy-med"><summary>عن السفر</summary>' + para(tx(bi)) + '</details>';
    }
    var st = q('#readDoneBar button', m);
    if (st) { var dn = /✓|●|done|on/.test((st.className || '') + tx(q('b', st))); h += '<div class="dy-end"><button type="button" class="dy-stampbtn' + (dn ? ' on' : '') + '" data-dyproxy="#readDoneBar button">' + (dn ? '✓ ' : '') + esc(tx(q('span', st))) + '</button></div>'; }
    var med = q('#medHost', m);
    if (med && tx(med)) {
      h += '<section class="dy-ps"><h2>تأمّل</h2>' + qa('.med-block', med).map(function (b) {
        var lab = tx(q('.med-label', b));
        if (q('.verse-list', b)) return '<h3>' + esc(lab) + '</h3>' + qa('.verse-item', b).map(function (v) { return '<blockquote class="dy-q">' + esc(tx(v)) + '</blockquote>'; }).join('');
        if (q('.applybox', b)) return '<div class="dy-sticky"><b>' + esc(lab) + '</b><div>' + esc(tx(q('.applybox', b))) + '</div></div>';
        return '<h3>' + esc(lab) + '</h3>' + qa('.med-text', b).map(function (t2) { return para(tx(t2)); }).join('');
      }).join('') + '</section>';
    }
    var di = q('#discussionHost .discussion-text', m);
    if (di) h += '<div class="dy-sticky"><b>للنقاش</b><div>' + esc(tx(di)) + '</div></div>';
    var ln = qa('#v297Links .l-btn', m);
    if (ln.length) h += '<div class="dy-tools"><h2>مرتبط بقراءات اليوم</h2>' + ln.map(function (b, i) { return '<button type="button" class="dy-link" data-dyproxy="#v297Links .l-btn:nth-of-type(' + (qa('#v297Links .l-btn', m).indexOf(b) + 1) + ')">' + esc(tx(b)) + '</button>'; }).join('') + '</div>';
    return h;
  }
  function paintRead() {
    var pg = q('#page-read'), el = document.getElementById('dyV-read');
    if (!on() || !pg) { if (el) el.remove(); return; }
    var h = readHtml(); if (!h) return;
    if (!el) { el = document.createElement('div'); el.id = 'dyV-read'; el.className = 'dy-view'; pg.insertBefore(el, pg.firstChild); }
    if (el.dataset.h !== h) { var y = window.scrollY; el.innerHTML = h; el.dataset.h = h; if (document.documentElement.getAttribute('data-pg') === 'read') window.scrollTo(0, y); }
  }
  var rdObs = 0, rdT;
  function watchRead() { var m = q('#mod-r'); if (!m || rdObs) return; rdObs = 1; new MutationObserver(function () { clearTimeout(rdT); rdT = setTimeout(paintRead, 60); }).observe(m, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] }); }


  /* =============== صوت الله =============== */
  function talkLog() {
    var log = q('#tkLog'); if (!log) return '';
    var vi = 0, h = '';
    function say(c) { var t = tx(c); return t ? '<p class="dy-tsay' + (c.classList.contains('tk-lead') ? ' lead' : '') + '">' + esc(t) + '</p>' : ''; }
    [].slice.call(log.children).forEach(function (c) {
      if (c.classList.contains('tk-me')) h += '<p class="dy-tme">' + esc(tx(c)) + '</p>';
      else if (c.id === 'tkPlay' || c.classList.contains('tk-re')) {
        [].slice.call(c.children).forEach(function (r) {
          if (r.tagName === 'ARTICLE') {
            var i = vi++, b = qa('.tk-a button', r);
            h += '<blockquote class="dy-q">' + (q('.tk-badge', r) ? '<small>' + esc(tx(q('.tk-badge', r))) + '</small>' : '') + esc(tx(q('.tk-t', r))) + '<cite>' + esc(tx(q('.tk-m b', r))) + '</cite><span class="dy-va">' +
              b.map(function (x, j) { return '<button type="button" data-dyvb="' + i + ':' + j + '">' + esc(tx(x)) + '</button>'; }).join('') + '</span></blockquote>';
          } else h += say(r);
        });
      } else h += say(c);
    });
    if (!h) h = '<p class="dy-tsay lead">اكتب ما في قلبك، وسيأتيك الجواب من الكتاب.</p>';
    return h;
  }
  function paintTalk() {
    var pg = q('#page-talk'), el = document.getElementById('dyV-talk');
    if (!on() || !pg || !q('#tkLog')) { if (el) el.remove(); return; }
    if (!el) {
      el = document.createElement('div'); el.id = 'dyV-talk'; el.className = 'dy-view';
      el.innerHTML = '<header class="dy-ph"><h1>صوت الله</h1><p>الآيات نصّ حرفي من الكتاب — اكتب ما تشعر به</p></header><div class="dy-flags" id="dyTkG"></div><div id="dyTkLog"></div><div class="dy-hours" id="dyTkC"></div>' +
        '<div class="dy-tin"><textarea id="dyTkT" rows="2" placeholder="اكتب ما في قلبك…"></textarea><button type="button" class="dy-stampbtn" data-dytksend="1">أرسل</button></div><div class="dy-flags" id="dyTkX"></div>';
      pg.insertBefore(el, pg.firstChild);
    }
    function set(id, h) { var n = document.getElementById(id); if (n && n.dataset.h !== h) { n.innerHTML = h; n.dataset.h = h; } }
    set('dyTkG', qa('.tkx-g button').map(function (b, i) { return '<button type="button" class="dy-flag' + (b.classList.contains('on') ? ' on' : '') + '" data-dyproxy="#talkBody .tkx-g button:nth-of-type(' + (i + 1) + ')">' + esc(tx(b)) + '</button>'; }).join(''));
    set('dyTkLog', talkLog());
    set('dyTkC', qa('.tk-chips button').map(function (b, i) { return '<button type="button" class="dy-hc" data-dyproxy="#talkBody .tk-chips button:nth-child(' + (i + 1) + ')">' + esc(tx(b)) + '</button>'; }).join(''));
    set('dyTkX', qa('.tkx-t button').concat(qa('.tk-clear button')).map(function (b) { return '<button type="button" class="dy-flag" data-dyproxy="#' + (b.id || 'x') + '" data-dyel="' + esc(tx(b)) + '">' + esc(tx(b)) + '</button>'; }).join(''));
  }
  var tkObs = 0, tkT;
  function watchTalk() { var m = q('#tkLog'); if (!m || tkObs) return; tkObs = 1; new MutationObserver(function () { clearTimeout(tkT); tkT = setTimeout(paintTalk, 60); }).observe(q('#talkBody'), { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] }); }
  document.addEventListener('click', function (e) {
    var t = e.target; if (!on() || !t.closest) return; var b;
    if ((b = t.closest('[data-dytksend]'))) { e.preventDefault(); var a = document.getElementById('dyTkT'), o = document.getElementById('tkText'); if (a && o && a.value.trim()) { o.value = a.value; o.dispatchEvent(new Event('input', { bubbles: true })); document.getElementById('tkSend').click(); a.value = ''; } return; }
    if ((b = t.closest('[data-dyvb]'))) { e.preventDefault(); e.stopPropagation(); var p = b.getAttribute('data-dyvb').split(':'), art = qa('#tkLog article.tk-v')[+p[0]]; if (art) { var bt = qa('.tk-a button', art)[+p[1]]; if (bt) bt.click(); } setTimeout(paintTalk, 150); return; }
    if ((b = t.closest('[data-dyel]'))) { var nm = b.getAttribute('data-dyel'), tg = qa('.tkx-t button,.tk-clear button').filter(function (x) { return tx(x) === nm; })[0]; if (tg) { e.preventDefault(); e.stopPropagation(); tg.click(); } }
  }, true);


  /* =============== محاسبة النفس =============== */
  function examHtml() {
    var m = q('#mod-m'); if (!m || !q('#cats', m)) return '';
    var tabs = [['tabToday', 'محاسبة اليوم'], ['tabHist', 'السجل'], ['tabConf', 'ورقة الاعتراف']];
    var h = '<header class="dy-ph"><h1>محاسبة النفس</h1><p>' + esc(tx(q('#uSub'))) + '</p></header><div class="dy-flags">' + tabs.map(function (t) {
      var b = document.getElementById(t[0]); return '<button type="button" class="dy-flag' + (b && b.classList.contains('on') ? ' on' : '') + '" data-dyproxy="#' + t[0] + '">' + t[1] + '</button>';
    }).join('') + '</div>';
    var today = q('#tabToday', m) && q('#tabToday', m).classList.contains('on');
    if (!today) return h;
    var intro = q('.card.intro', m); if (intro) h += '<details class="dy-med"><summary>إزاي أستخدم الصفحة؟</summary>' + para(intro.innerText.replace(/إزاي أستخدم الصفحة؟/, '').trim()) + '</details>';
    qa('#cats details.cat', m).forEach(function (d) {
      var sm = q('summary', d), c = d.getAttribute('data-c'), cnt = tx(q('.badge', sm)), name = tx(sm).replace(cnt, '').trim();
      h += '<details class="dy-cat" data-dyc="' + esc(c) + '"' + (EX.open[c] ? ' open' : '') + '><summary><span>' + esc(name) + '</span>' + (+cnt ? '<b class="dy-badge">' + esc(cnt) + '</b>' : '') + '</summary>';
      var v = q('.verse', d); if (v) h += '<p class="dy-verse">' + esc(tx(v)) + '</p>';
      qa('.sin', d).forEach(function (sn) {
        var cb = q('input[type=checkbox]', sn), k = cb.getAttribute('data-k'), dsc = q('.desc', sn), qq = dsc && q('.q', dsc), nt = q('textarea', sn);
        h += '<div class="dy-sin' + (cb.checked ? ' on' : '') + '"><label><input type="checkbox" data-dyk="' + esc(k) + '"' + (cb.checked ? ' checked' : '') + '><span>' + esc(tx(q('label', sn))) + '</span></label>';
        if (dsc) h += '<details class="dy-med"><summary>ⓘ شرح</summary>' + para((dsc.firstChild && dsc.firstChild.textContent) || '') + (qq ? '<p class="dy-qq">' + esc(tx(qq)) + '</p>' : '') + '</details>';
        if (cb.checked && nt) h += '<textarea class="dy-nt" data-dyn="' + esc(k) + '" rows="2" placeholder="الموقف الذي حدث (لتتذكره في الاعتراف)">' + esc(nt.value) + '</textarea>';
        h += '</div>';
      });
      h += '</details>';
    });
    var ot = q('#otherIn', m);
    h += '<section class="dy-ps"><h2>خطايا أخرى</h2><textarea class="dy-nt" id="dyOther" rows="3" placeholder="خطية وقعتُ فيها ولم أجدها في القوائم…">' + esc(ot ? ot.value : '') + '</textarea></section>';
    h += '<div class="dy-end"><button type="button" class="dy-stampbtn" data-dyproxy="#finish">ملخص اليوم وصلاة التوبة</button></div>';
    var sm2 = q('#summary', m);
    if (sm2 && tx(sm2)) h += '<section class="dy-ps"><h2>ملخص اليوم</h2>' + paras(sm2.innerText.split(/\n+/)) + '</section>';
    return h;
  }
  var EX = { open: {} };
  function paintExam() {
    var pg = q('#page-exam'), el = document.getElementById('dyV-exam');
    if (!on() || !pg) { if (el) el.remove(); return; }
    var h = examHtml(); if (!h) return;
    if (!el) { el = document.createElement('div'); el.id = 'dyV-exam'; el.className = 'dy-view'; pg.insertBefore(el, pg.firstChild); }
    if (el.dataset.h !== h) { var y = window.scrollY, a = document.activeElement; if (a && el.contains(a) && a.tagName === 'TEXTAREA') return; el.innerHTML = h; el.dataset.h = h; window.scrollTo(0, y); }
    pg.classList.toggle('dy-exnat', !!q('#tabToday') && q('#tabToday').classList.contains('on'));
  }
  var exObs = 0, exT;
  function watchExam() { var m = q('#mod-m'); if (!m || exObs) return; exObs = 1; new MutationObserver(function () { clearTimeout(exT); exT = setTimeout(paintExam, 80); }).observe(m, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'open'] }); }
  document.addEventListener('change', function (e) {
    var t = e.target; if (!t || !on()) return;
    if (t.getAttribute && t.getAttribute('data-dyk')) { var o = q('#cats input[data-k="' + t.getAttribute('data-dyk') + '"]'); if (o) o.click(); setTimeout(paintExam, 120); }
  });
  document.addEventListener('input', function (e) {
    var t = e.target; if (!t || !on() || !t.getAttribute) return;
    var n = t.getAttribute('data-dyn'), o = n ? q('#cats textarea[data-n="' + n + '"]') : (t.id === 'dyOther' ? q('#otherIn') : null);
    if (o) { o.value = t.value; o.dispatchEvent(new Event('input', { bubbles: true })); }
  });
  document.addEventListener('toggle', function (e) { var d = e.target; if (d && d.getAttribute && d.getAttribute('data-dyc')) EX.open[d.getAttribute('data-dyc')] = d.open; }, true);


  /* =============== محوّل عام: يقرأ محتوى صفحة ويعيد عرضه بعناصر الدفتر =============== */
  var GEN = {};
  function genConv(root, refs) {
    function ref(el) { refs.push(el); return refs.length - 1; }
    function isHid(e) { return e.hidden || e.classList.contains('hidden') || (e.getAttribute('style') || '').indexOf('display:none') > -1; }
    function walk(e) {
      var o = '';
      [].slice.call(e.childNodes).forEach(function (n) {
        if (n.nodeType === 3) { var t = n.textContent.replace(/\s+/g, ' ').trim(); if (t) o += esc(t) + ' '; return; }
        if (n.nodeType !== 1 || isHid(n)) return;
        var tg = n.tagName, c = n.className && n.className.baseVal === undefined ? String(n.className) : '';
        if (/^(SCRIPT|STYLE|NOSCRIPT)$/.test(tg)) return;
        if (/^(svg|canvas|IMG)$/i.test(tg) || /\b(heat|rfu-bar|legend|chart|bar)\b/.test(c)) { o += '<div class="dy-keep">' + n.outerHTML + '</div>'; return; }
        if (tg === 'BUTTON') { var tt = tx(n); if (tt) o += '<button type="button" class="' + (n.parentNode.classList && n.parentNode.classList.contains('u-tabs') ? 'dy-flag' : /\bchip\b|chips/.test(c + ' ' + (n.parentNode.className || '')) ? 'dy-chip' : 'dy-link') + (/\b(on|active|sel|done)\b/.test(c) || n.getAttribute('aria-pressed') === 'true' ? ' on' : '') + '" data-dyref="' + ref(n) + '">' + esc(tt) + '</button>'; return; }
        if (tg === 'SELECT') { o += '<select class="dy-in" data-dyval="' + ref(n) + '">' + [].slice.call(n.options).map(function (op) { return '<option value="' + esc(op.value) + '"' + (op.selected ? ' selected' : '') + '>' + esc(op.text) + '</option>'; }).join('') + '</select>'; return; }
        if (tg === 'TEXTAREA') { o += '<textarea class="dy-nt" rows="3" data-dyval="' + ref(n) + '" placeholder="' + esc(n.placeholder || '') + '">' + esc(n.value) + '</textarea>'; return; }
        if (tg === 'INPUT') { var ty = n.type; if (ty === 'checkbox') o += '<label class="dy-ck"><input type="checkbox" data-dyref="' + ref(n) + '"' + (n.checked ? ' checked' : '') + '></label>'; else if (ty !== 'hidden' && ty !== 'file' && ty !== 'button' && ty !== 'submit') o += '<input class="dy-in" type="' + esc(ty) + '" data-dyval="' + ref(n) + '" value="' + esc(n.value) + '" placeholder="' + esc(n.placeholder || '') + '">'; return; }
        if (/^H[1-4]$/.test(tg)) { o += '<h2 class="dy-gh">' + esc(tx(n)) + '</h2>'; return; }
        if (tg === 'A') { var h = n.getAttribute('href'); o += '<a class="dy-lnk" ' + (h && h.charAt(0) !== '#' ? 'href="' + esc(h) + '" target="_blank" rel="noopener"' : 'data-dyref="' + ref(n) + '"') + '>' + esc(tx(n)) + '</a>'; return; }
        if (tg === 'DETAILS') { var sm = n.querySelector('summary'); o += '<details class="dy-med"><summary>' + esc(tx(sm)) + '</summary>' + walk(n).replace(esc(tx(sm)) + ' ', '') + '</details>'; return; }
        if (tg === 'SUMMARY') return;
        if (tg === 'OL' || tg === 'UL') { o += '<ol class="dy-ol">' + [].slice.call(n.children).map(function (li) { return '<li>' + walk(li) + '</li>'; }).join('') + '</ol>'; return; }
        var kids = n.children.length, own = [].slice.call(n.childNodes).some(function (x) { return x.nodeType === 3 && x.textContent.trim(); });
        if (!kids) { var t2 = tx(n); if (t2) o += '<p class="dy-gp">' + esc(t2) + '</p>'; return; }
        if (/\bu-card\b|\brfu\b|\bsection\b/.test(c) || tg === 'SECTION' || tg === 'ARTICLE') o += '<section class="dy-ps">' + walk(n) + '</section>';
        else if (/\bu-tabs\b/.test(c)) o += '<div class="dy-flags">' + walk(n) + '</div>';
        else if (/\bchips\b|row-gap|row-between/.test(c)) o += '<div class="dy-row">' + walk(n) + '</div>';
        else o += (own ? '<div class="dy-gp">' : '<div class="dy-gb">') + walk(n) + '</div>';
      });
      return o;
    }
    return walk(root);
  }
  function genPaint(key, pageSel, rootSel, cond) {
    var pg = q(pageSel), el = document.getElementById('dyV-' + key), root = pg && q(rootSel, pg);
    if (!on() || !pg || !root || (cond && !cond(root))) { if (el) el.remove(); if (pg) pg.classList.remove('dy-gen'); return; }
    var refs = [], h = genConv(root, refs);
    if (!h) return;
    GEN[key] = refs;
    if (!el) { el = document.createElement('div'); el.id = 'dyV-' + key; el.className = 'dy-view'; el.setAttribute('data-gk', key); pg.insertBefore(el, pg.firstChild); }
    var a = document.activeElement; if (a && el.contains(a) && /^(TEXTAREA|INPUT|SELECT)$/.test(a.tagName)) return;
    if (el.dataset.h !== h) { var y = window.scrollY; el.innerHTML = h; el.dataset.h = h; if (document.documentElement.getAttribute('data-pg') === pg.id.replace('page-', '')) window.scrollTo(0, y); }
    pg.classList.add('dy-gen');
  }
  var GP = [['trk', '#page-trk', '.u-wrap', function (r) { return !!q('#trkTabs', r); }], ['favs', '#page-favs', '.u-wrap'], ['cal', '#page-cal', '.u-wrap'], ['syn', '#page-syn', '.u-wrap']];
  var gT = {};
  function genAll() { GP.forEach(function (g) { try { genPaint.apply(null, g); } catch (e) { } }); }
  function watchGen() { GP.forEach(function (g) { var pg = q(g[1]); if (!pg || pg._dyw) return; pg._dyw = 1; new MutationObserver(function (ml) { if (ml.every(function (m) { var v = document.getElementById('dyV-' + g[0]); return v && v.contains(m.target); })) return; clearTimeout(gT[g[0]]); gT[g[0]] = setTimeout(function () { try { genPaint.apply(null, g); } catch (e) { } }, 90); }).observe(pg, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'open', 'aria-pressed'] }); }); }
  function gref(t) { var v = t.closest && t.closest('.dy-view[data-gk]'); return v ? (GEN[v.getAttribute('data-gk')] || []) : null; }
  document.addEventListener('click', function (e) {
    var t = e.target; if (!on() || !t.closest) return; var b = t.closest('[data-dyref]'); if (!b) return; var R = gref(b); if (!R) return;
    var o = R[+b.getAttribute('data-dyref')]; if (!o) return;
    if (b.type === 'checkbox') return;
    e.preventDefault(); e.stopPropagation(); o.click();
  }, true);
  document.addEventListener('change', function (e) {
    var t = e.target; if (!on() || !t.getAttribute) return; var R = gref(t); if (!R) return;
    var k = t.getAttribute('data-dyref'); if (k != null && t.type === 'checkbox') { var o = R[+k]; if (o) o.click(); return; }
    var v = t.getAttribute('data-dyval'); if (v != null) { var o2 = R[+v]; if (o2) { o2.value = t.value; o2.dispatchEvent(new Event('input', { bubbles: true })); o2.dispatchEvent(new Event('change', { bubbles: true })); } }
  }, true);
  document.addEventListener('input', function (e) {
    var t = e.target; if (!on() || !t.getAttribute) return; var v = t.getAttribute('data-dyval'); if (v == null) return; var R = gref(t); if (!R) return;
    var o = R[+v]; if (o) { o.value = t.value; o.dispatchEvent(new Event('input', { bubbles: true })); }
  }, true);

  /* =============== الأحداث والتزامن =============== */
  function paintAll() { try { paintPray(); } catch (e) { } try { paintFat(); } catch (e) { } try { paintMsg(); watchMsg(); } catch (e) { } try { paintRead(); watchRead(); } catch (e) { } try { paintTalk(); watchTalk(); } catch (e) { } try { paintExam(); watchExam(); } catch (e) { } genAll(); watchGen();
    if (on() && document.documentElement.getAttribute('data-pg') === 'talk' && !document.getElementById('dyV-talk') && !paintAll._r) { paintAll._r = 1; setTimeout(function () { paintAll._r = 0; paintAll(); }, 500); } }
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
