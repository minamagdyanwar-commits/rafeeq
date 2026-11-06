/* v6.12.0 (تجريبي) — «الرفيق»: شخصية تمشي معك على الدرب (مسافر بمصباح) تستقبلك وتتابع خطواتك وتسأل آخر اليوم.
   مبدأ العزل: الميزة كلها مغلقة افتراضيًا ولا تغيّر شيئًا في البرنامج وهي مغلقة (لا عناصر ولا أنماط ولا مستمعين غير زرّ الإعدادات)،
   وتُشغَّل وتُوقَف من الإعدادات ← «الرفيق الروحي»، وبرابط الطوارئ ?companion=off، وتوقف نفسها لو تعطّلت مرتين متتاليتين عند البدء.
   الحالة في localStorage: rafeeq_companion_on (٠/١) وrafeeq_companion_v1 (البروفايل والإعدادات والذاكرة)، وكلها محلية.
   كل ألوانه من متغيرات التصميم الحالي (--s-* و--nh-*) فيتبع كل تصميم وكل وضع. لا ذكاء اصطناعي: جمل جاهزة بحسب السياق. */
(function () {
  'use strict';
  var K_ON = 'rafeeq_companion_on', K_ST = 'rafeeq_companion_v1', K_BOOT = 'rafeeq_companion_boot';
  function F() { return window.__F || {}; }
  function esc(s) { return RF.esc(s); }
  function ar(n) { return RF.ar(n); }
  function q(s, r) { return (r || document).querySelector(s); }
  function qa(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }

  /* ---------- مفتاح الطوارئ ---------- */
  try {
    if (/[?&]companion=off\b/.test(location.search)) { lsSet(K_ON, '0'); history.replaceState(null, '', location.pathname + location.search.replace(/([?&])companion=off&?/, '$1').replace(/[?&]$/, '') + location.hash); }
  } catch (e) { }
  function isOn() { return lsGet(K_ON) === '1'; }

  /* ---------- الحالة ---------- */
  var DEF = {
    done: false, name: 'رفيق', age: '30', stage: 2, tone: 'calm', preset: 'with', gate: 1, evening: 1,
    pages: { home: 2, pray: 0, read: 1, bible: 1, exam: 0, other: 1 }, lamp: { side: 'right', y: 'mid' }, readq: 1, promiseq: 1, mem: 1,
    quiet: { on: 1, from: 21, to: 6 }, promise: '', promiseDay: '', memory: [], log: [], lastGate: '', lastEve: '', cnt: { d: '', n: 0 }, hideDay: '', sixAns: []
  };
  var S = null;
  function load() { var v = RF.jget(K_ST, null) || {}; S = JSON.parse(JSON.stringify(DEF)); Object.keys(v).forEach(function (k) { if (k === 'pages' || k === 'quiet' || k === 'cnt' || k === 'lamp') S[k] = Object.assign(S[k], v[k] || {}); else S[k] = v[k]; }); }
  function save() { RF.jset(K_ST, S); }
  function today() { return RF.dkey(); }
  RF.keys && (RF.keys[K_ON] = 'الرفيق الروحي: مُفعَّل أم لا (تجريبي)', RF.keys[K_ST] = 'الرفيق الروحي: البروفايل والإعدادات والذاكرة');

  /* ---------- مستويات القرب ---------- */
  /* مستويات الظهور لكل صفحة: 0 غير موجود تمامًا، 1 زر فقط، 2 يظهر ويتكلم (شريط في الرئيسية). */
  var PRESETS = {
    ask: { t: 'عند الطلب', d: 'زر صغير بس. يرد لو ناديته', gate: 0, evening: 0, cap: 0, pages: { home: 1, pray: 0, read: 1, bible: 1, exam: 0, other: 1 } },
    calm: { t: 'هادي', d: 'يحييك الصبح ويسألك آخر اليوم. مفيش كلام تاني', gate: 1, evening: 1, cap: 2, pages: { home: 2, pray: 0, read: 1, bible: 1, exam: 0, other: 1 } },
    with: { t: 'معاك', d: 'الافتراضي: حضور متوازن بنصيحة وسؤال بعد القراءة', gate: 1, evening: 1, cap: 4, pages: { home: 2, pray: 0, read: 2, bible: 1, exam: 0, other: 1 } },
    near: { t: 'قريب', d: 'يتابع ويفتكر ويسأل عن وعدك', gate: 1, evening: 1, cap: 6, pages: { home: 2, pray: 0, read: 2, bible: 2, exam: 0, other: 1 } },
    all: { t: 'حاضر دايمًا', d: 'في كل الصفحات، وبيبعد عن الصلاة والمحاسبة (زر بس)', gate: 1, evening: 1, cap: 9, pages: { home: 2, pray: 1, read: 2, bible: 2, exam: 1, other: 2 } }
  };
  var PAGES = [['home', 'الرئيسية'], ['pray', 'الصلاة'], ['read', 'القراءات'], ['bible', 'الكتاب والدراسة'], ['exam', 'محاسبة النفس'], ['talk', 'صوت الله'], ['msg', 'الرسالة'], ['cal', 'التقويم'], ['syn', 'السنكسار'], ['fat', 'الآباء'], ['favs', 'المفضلة']];
  var NOSPEAK = { pray: 1, exam: 1 }; /* في الصلاة والمحاسبة: زر فقط كحدّ أقصى، لا كلام */
  var AGES = [['8', '٨–١٢'], ['13', '١٣–١٧'], ['18', '١٨–٢٩'], ['30', '٣٠–٥٩'], ['60', '٦٠+']];
  var TONES = [['calm', 'هادي ودافي'], ['direct', 'مباشر وبسيط'], ['few', 'كلام قليل']];
  function kid() { return S.age === '8'; }
  function elder() { return S.age === '60'; }
  function ageKind() { return S.age === '8' ? 'child' : (S.age === '13' || S.age === '18') ? 'youth' : S.age === '60' ? 'elder' : 'adult'; }

  /* ---------- الأفاتار: مسافر بمصباح، بلا ملامح ---------- */
  function avatar(o) {
    o = o || {}; var pose = o.pose || 'stand', lamp = o.lamp == null ? 2 : o.lamp, stage = o.stage || S.stage || 2, age = o.age || ageKind(), w = o.w || 120, id = 'cp' + (avatar.n = (avatar.n || 0) + 1);
    var glowR = [0, 26, 46, 70, 50][lamp], scale = age === 'child' ? 0.82 : 1, headR = age === 'child' ? 23 : 20;
    var hx = 80, hy = 58, lx = 128, ly = 62, st = 70, rot = 0, top = 82, hem = 206, armL = 'M62 96 C52 112 48 128 52 146', armR = 'M100 96 C112 98 120 102 124 108', extra = '';
    if (pose === 'walk') { rot = -3; extra += '<ellipse cx="60" cy="208" rx="13" ry="5" class="cpa-shoe"/><ellipse cx="102" cy="204" rx="13" ry="5" class="cpa-shoe"/>'; }
    if (pose === 'raise') { ly = 30; st = 40; armR = 'M100 96 C116 80 124 60 126 44'; glowR = Math.round(glowR * 1.25); }
    if (pose === 'sit') { top = 104; hy = 82; lx = 134; ly = 184; st = 190; armR = 'M100 118 C112 140 124 164 130 182'; armL = 'M62 118 C52 140 56 160 66 172'; }
    if (pose === 'pray') { hy = 62; armL = 'M64 98 C62 118 74 134 80 138'; armR = 'M96 98 C98 118 86 134 80 138'; lx = 80; ly = 196; st = 204; }
    if (pose === 'offer') { armL = 'M62 96 C44 104 30 114 22 124'; extra += '<circle cx="21" cy="126" r="7" class="cpa-head"/>'; }
    if (age === 'youth') extra += '<path d="M64 90 L108 150" class="cpa-strap"/><rect x="96" y="140" width="20" height="26" rx="5" class="cpa-bag"/>';
    if (age === 'elder') { extra += '<path d="M54 86 C70 98 90 98 106 86 L112 100 C92 110 68 110 48 100Z" class="cpa-shawl"/>'; rot += 3; }
    if (stage === 2) extra += '<path d="M44 136 C66 146 94 146 116 136" class="cpa-sash"/>';
    if (stage === 3) extra += '<path d="M48 90 C58 82 102 82 112 90 L108 108 C92 100 68 100 52 108Z" class="cpa-cape"/>';
    if (stage === 4) for (var i = 0; i < 8; i++) { var a = i * 0.785; extra += '<line x1="' + lx + '" y1="' + ly + '" x2="' + (lx + Math.round(48 * Math.cos(a))) + '" y2="' + (ly + Math.round(48 * Math.sin(a))) + '" class="cpa-ray"/>'; }
    if (stage === 5) extra += '<path d="M' + (lx - 4) + ' ' + (st + 16) + ' c-10 -6 -14 -2 -14 4 c8 2 12 0 14 -4z M' + (lx + 4) + ' ' + (st + 30) + ' c10 -6 14 -2 14 4 c-8 2 -12 0 -14 -4z" class="cpa-leaf"/><path d="M' + (lx - 34) + ' 24 l3 8 8 1 -6 5 2 8 -7 -4 -7 4 2 -8 -6 -5 8 -1z" class="cpa-star"/>';
    var staff = (pose === 'sit' || pose === 'pray') ? '' : (age === 'elder' ? '<path d="M' + lx + ' 206 L' + lx + ' ' + (st + 10) + ' q0 -16 -14 -16" class="cpa-staff"/>' : '<line x1="' + lx + '" y1="' + st + '" x2="' + lx + '" y2="206" class="cpa-staff"/>');
    var lampSvg = age === 'child' ? '<rect x="' + (lx - 11) + '" y="' + (ly - 14) + '" width="22" height="26" rx="10" class="cpa-lamp l' + lamp + '"/><line x1="' + lx + '" y1="' + (ly - 14) + '" x2="' + lx + '" y2="' + (ly - 22) + '" class="cpa-frame"/>'
      : '<rect x="' + (lx - 9) + '" y="' + (ly - 11) + '" width="18" height="22" rx="6" class="cpa-lamp l' + lamp + '"/><path d="M' + (lx - 9) + ' ' + (ly - 11) + ' L' + lx + ' ' + (ly - 19) + ' L' + (lx + 9) + ' ' + (ly - 11) + '" class="cpa-frame"/>';
    var glow = glowR ? '<circle cx="' + lx + '" cy="' + ly + '" r="' + glowR + '" fill="url(#g' + id + ')"/>' : '';
    return '<svg class="cpa s' + stage + ' l' + lamp + '" viewBox="-45 -45 250 312" width="' + w + '" height="' + Math.round(w * 312 / 250) + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><defs><radialGradient id="g' + id + '"><stop offset="0" class="cpa-g0"/><stop offset=".5" class="cpa-g1"/><stop offset="1" class="cpa-g2"/></radialGradient><linearGradient id="c' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="cpa-c1"/><stop offset="1" class="cpa-c2"/></linearGradient></defs>' +
      '<g transform="translate(80,206) scale(' + scale + ') translate(-80,-206) rotate(' + rot + ' 80 206)">' + glow + '<ellipse cx="80" cy="210" rx="40" ry="6" class="cpa-shadow"/>' +
      '<path d="M80 ' + top + ' C46 ' + (top + 6) + ' 36 ' + (hem - 60) + ' 28 ' + hem + ' L132 ' + hem + ' C124 ' + (hem - 60) + ' 114 ' + (top + 6) + ' 80 ' + top + 'Z" fill="url(#c' + id + ')" class="cpa-cloak"/>' + extra +
      '<path d="' + armL + '" fill="none" stroke="url(#c' + id + ')" stroke-width="11" stroke-linecap="round"/>' + staff +
      '<path d="' + armR + '" fill="none" stroke="url(#c' + id + ')" stroke-width="11" stroke-linecap="round"/>' +
      '<circle cx="' + hx + '" cy="' + hy + '" r="' + headR + '" class="cpa-head"/><path d="M' + (hx - 22) + ' ' + (hy + 2) + ' C' + (hx - 24) + ' ' + (hy - 26) + ' ' + (hx + 24) + ' ' + (hy - 26) + ' ' + (hx + 22) + ' ' + (hy + 2) + ' C' + (hx + 16) + ' ' + (hy - 14) + ' ' + (hx - 16) + ' ' + (hy - 14) + ' ' + (hx - 22) + ' ' + (hy + 2) + 'Z" class="cpa-hood"/>' + lampSvg + '</g></svg>';
  }
  function meFig(w) { return '<svg viewBox="0 0 90 130" width="' + (w || 56) + '" height="' + Math.round((w || 56) * 130 / 90) + '" aria-hidden="true"><path d="M45 50 C22 54 18 92 14 126 L76 126 C72 92 68 54 45 50Z" class="cpa-me"/><circle cx="45" cy="32" r="17" class="cpa-head"/></svg>'; }

  /* ---------- جمل جاهزة (بحسب النبرة) ---------- */
  function pick(a, seed) { return a[Math.abs(seed | 0) % a.length]; }
  function seed() { var d = new Date(); return d.getFullYear() * 400 + d.getMonth() * 31 + d.getDate(); }
  function sub(t, m) { return String(t).replace(/\{(\w+)\}/g, function (x, k) { return m[k] != null ? m[k] : ''; }); }
  var L = {
    gateAM: { calm: ['صباح النور يا {n}. النهارده {k} خطوات صغيرة. أول واحدة: {f}.', 'يوم جديد يا {n}. خلّينا نبدأ بـ{f}.'], direct: ['صباح الخير يا {n}. أول خطوة: {f}.', 'النهارده {k} خطوات. نبدأ بـ{f}.'], few: ['صباح النور. {f}.'] },
    gatePM: { calm: ['أهلًا يا {n}. فاضل النهارده {l} من {k}. الجاية: {f}.', 'ماشيين سوا يا {n}. نكمّل بـ{f}؟'], direct: ['فاضل {l} خطوات. الجاية: {f}.'], few: ['{f}.'] },
    gateDone: { calm: ['أتممنا يومنا يا {n}. الحمد لله. ارتاح.', 'كل خطوات النهارده تمّت. بارك الرب فيك.'], direct: ['خلصنا النهارده.'], few: ['تمام.'] },
    back: { calm: ['وحشتني يا {n}. مفيش لوم — نبدأ بخطوة صغيرة؟', 'حمدًا لله على سلامتك يا {n}. نرجع سوا بالتدريج.'], direct: ['رجعت. نبدأ بخطوة واحدة.'], few: ['أهلًا من تاني.'] },
    stripLeft: { calm: ['فاضل {l} من {k}. الخطوة الجاية: {f}.', 'ماشيين كويس يا {n}. الجاية: {f}.'], direct: ['فاضل {l}. الجاية: {f}.'], few: ['{f}.'] },
    stripDone: { calm: ['أتمّينا يومنا يا {n}. بارك الرب فيك.'], direct: ['خلصنا النهارده.'], few: ['تمام.'] },
    eveQ: { calm: 'يومك كان عامل إزاي يا {n}؟', direct: 'يومك كان إزاي؟', few: 'كان عامل إيه؟' },
    eveTouch: { calm: 'إيه اللي لمسك النهارده؟', direct: 'إيه أهم لحظة؟', few: 'لحظة؟' },
    eveNext: { calm: 'وخطوة بكرة؟', direct: 'خطوة بكرة؟', few: 'بكرة؟' },
    readQ: { calm: 'إيه الكلمة اللي وقفت معاك؟', direct: 'أنهي كلمة وقفت معاك؟', few: 'الكلمة؟' },
    promiseQ: { calm: 'إمبارح وعدنا «{p}» — حصل؟', direct: 'وعدنا «{p}» — حصل؟', few: '«{p}»؟' }
  };
  function line(key, m) { var o = L[key]; var t = o[S.tone] || o.calm; return sub(Array.isArray(t) ? pick(t, seed()) : t, m || {}); }
  function nm() { return 'صاحبي'; }

  /* ---------- خطة اليوم ---------- */
  function plan() { try { return F().dayPlan(F().dkey ? F().dkey() : today()); } catch (e) { return null; } }
  function planInfo() {
    var p = plan(), items = (p && p.items) || [], todo = items.filter(function (x) { return !x.done; }), nx = (p && p.next) || todo[0] || null;
    return { total: items.length, done: items.length - todo.length, left: todo.length, next: nx, all: items.length && !todo.length };
  }
  function goItem(it) {
    var a = window.__rafeeq; if (!it || !a) return;
    try {
      if (it.type === 'hour') a.act('hour', { dataset: { key: it.key || it.gid } }); else if (it.type === 'read') a.act('read'); else if (it.type === 'med') a.act('meditation'); else if (it.type === 'gd') a.act('guided'); else if (it.type === 'exam') a.act('exam'); else if (it.type === 'memo') a.act('memo'); else if (it.type === 'prog' && window.__prog) window.__prog.openCurrent();
    } catch (e) { }
  }
  function curPage() {
    var e = q('.u-page.on'), id = e ? e.id.replace(/^page-/, '') : 'home';
    if (id === 'trk') return 'bible';
    return PAGES.some(function (x) { return x[0] === id; }) ? id : 'home';
  }
  function level(pg) { var v = S.pages[pg]; if (v == null) v = S.pages.other == null ? 1 : S.pages.other; return NOSPEAK[pg] ? Math.min(v, 1) : v; }
  function quietNow() { if (!S.quiet.on) return false; var h = new Date().getHours(), a = +S.quiet.from, b = +S.quiet.to; return a > b ? (h >= a || h < b) : (h >= a && h < b); }
  function capLeft() { var c = PRESETS[S.preset] ? PRESETS[S.preset].cap : 4; if (S.cnt.d !== today()) { S.cnt = { d: today(), n: 0 }; } return c - S.cnt.n; }
  function bump() { if (S.cnt.d !== today()) S.cnt = { d: today(), n: 0 }; S.cnt.n++; save(); }

  /* ---------- طبقة الواجهة ---------- */
  var layer = null;
  function root() { if (layer && document.body.contains(layer)) return layer; layer = document.createElement('div'); layer.id = 'cpLayer'; document.body.appendChild(layer); return layer; }
  function closeOv(id) { var e = document.getElementById(id); if (e) e.remove(); if (!q('#cpLayer .cp-ov')) document.documentElement.classList.remove('cp-lock'); }
  function ov(id, cls, html) {
    var oldE = document.getElementById(id), oldSc = oldE && q('.cp-sheet', oldE) ? q('.cp-sheet', oldE).scrollTop : 0;
    closeOv(id); var e = document.createElement('div'); e.id = id; e.className = 'cp-ov ' + (cls || '') + (elder() ? ' cp-big' : ''); e.setAttribute('role', 'dialog'); e.setAttribute('aria-modal', 'true'); e.innerHTML = html;
    root().appendChild(e); document.documentElement.classList.add('cp-lock');
    var shEl = q('.cp-sheet', e); if (shEl && oldSc) shEl.scrollTop = oldSc;
    if (!oldE) { var f = q('button,[tabindex]', e); if (f) try { f.focus({ preventScroll: true }); } catch (x) { } }
    return e;
  }
  function chips(list, cur, attr) { return list.map(function (x) { return '<button type="button" class="cp-chip' + (String(cur) === String(x[0]) ? ' on' : '') + '" ' + attr + '="' + esc(x[0]) + '">' + esc(x[1]) + '</button>'; }).join(''); }

  /* ---------- الاستقبال (أول مرة) ---------- */
  var QS = [
    ['كام مرة بتصلّي في الأسبوع؟', ['بالكاد', 'مرتين أو تلاتة', 'أغلب الأيام', 'كل يوم']],
    ['لما بتصلّي… بتحس إنك:', ['دماغي بعيدة', 'بصلّي بانتظام بس جاف', 'بحس بحضور ربنا أوقات كتير', 'الصلاة مكان راحتي الأساسي']],
    ['القراءة في الكتاب المقدس:', ['نادرًا', 'أحيانًا', 'منتظمة', 'جزء من يومي']],
    ['لما بغلط…', ['بتجنّب وأبعد', 'بتضايق وأرجع بعد فترة', 'برجع سريع وبعترف', 'بتعلّم وبقوم وبكمّل']],
    ['علاقتي بالكنيسة والاعتراف:', ['متقطعة', 'بحضر وبس', 'منتظمة', 'خدمة وشركة']],
    ['بحس بسلام وفرح روحي:', ['نادرًا', 'أحيانًا', 'كتير', 'بثبات']]
  ];
  var OB = { step: 0, ans: [], tmp: {} };
  function startOnboarding() { OB = { step: 0, ans: [], tmp: { name: S.name, tone: S.tone, age: S.age } }; obRender(); }
  function stageFrom(ans) { var s = 0; ans.forEach(function (x) { s += x; }); var avg = ans.length ? s / ans.length : 1; return Math.max(1, Math.min(5, 1 + Math.round(avg / 3 * 4))); }
  function pathHtml(st) {
    var names = ['الرجوع', 'التأسيس', 'الجهاد', 'الاستنارة', 'الثمر'], pts = [[250, 250], [110, 190], [250, 130], [110, 70], [250, 12]], d = 'M' + pts[0].join(' ');
    for (var i = 1; i < pts.length; i++) { var a = pts[i - 1], b = pts[i], my = (a[1] + b[1]) / 2; d += ' C' + a[0] + ' ' + my + ' ' + b[0] + ' ' + my + ' ' + b[0] + ' ' + b[1]; }
    var s = '<svg viewBox="0 -14 360 290" class="cp-path" role="img" aria-label="الدرب"><path d="' + d + '" class="cp-route"/>';
    pts.forEach(function (p, i) { var on = i + 1 <= st; s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i + 1 === st ? 15 : 10) + '" class="cp-node' + (on ? ' on' : '') + '"/>' + (i + 1 === st ? '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="25" class="cp-halo"/>' : '') + '<text x="' + (p[0] + (p[0] > 180 ? 30 : -30)) + '" y="' + (p[1] + 6) + '" text-anchor="' + (p[0] > 180 ? 'start' : 'end') + '" class="cp-nl' + (on ? ' on' : '') + '">' + names[i] + '</text>'; });
    return s + '</svg>';
  }
  function obRender() {
    var st = OB.step, body = '', foot = '', head = '';
    var hero = '<div class="cp-hero">' + avatar({ pose: 'stand', lamp: 3, w: st === 0 ? 200 : 96, stage: 2 }) + '</div>';
    if (st === 0) {
      body = hero + '<h1 class="cp-h">أهلًا بيك يا صاحبي.<br>أنا رفيقك على الدرب.</h1><p class="cp-p">مش هقولك تعمل إيه… هنمشي سوا خطوة خطوة.<br>قبل ما ندخل، عايز أتعرف عليك شوية.</p>';
      foot = '<button type="button" class="cp-btn" data-cpob="next">يلا نبدأ</button><button type="button" class="cp-btn ghost" data-cpob="skip">أدخل البرنامج مباشرة</button>';
    } else if (st === 1) {
      body = '<div class="cp-mini">' + avatar({ w: 70 }) + '<div class="cp-bub">عرّفني بنفسك عشان أمشي معاك صح.</div></div><div class="cp-q">سنك؟</div><div class="cp-chips">' + chips(AGES, OB.tmp.age, 'data-cpage') + '</div>' +
        '<div class="cp-q">تحب تسميني إيه؟</div><input class="cp-in" id="cpName" maxlength="14" value="' + esc(OB.tmp.name) + '" aria-label="اسم الرفيق"><div class="cp-q">وأكلمك إزاي؟</div><div class="cp-chips">' + chips(TONES, OB.tmp.tone, 'data-cptone') + '</div>' + (OB.tmp.age === '8' ? '<p class="cp-note">للأطفال: كلام بسيط ومحدود، ومن غير ذاكرة ولا أسئلة عن الصراعات — ويُنصح بإشراف أب أو مسؤول.</p>' : '');
      foot = '<div class="cp-dots">' + dots(1) + '</div><button type="button" class="cp-btn" data-cpob="next">كمّل</button>';
    } else if (st >= 2 && st <= 1 + QS.length) {
      var i = st - 2, qq = QS[i], cur = OB.ans[i];
      body = '<div class="cp-mini">' + avatar({ w: 64 }) + '<div class="cp-hint">سؤال ' + ar(i + 1) + ' من ' + ar(QS.length) + ' — مفيش إجابة صح، اختار الأقرب</div></div><div class="cp-q big">' + esc(qq[0]) + '</div>' + qq[1].map(function (t, k) { return '<button type="button" class="cp-opt' + (cur === k ? ' on' : '') + '" data-cpans="' + k + '"><i></i>' + esc(t) + '</button>'; }).join('');
      foot = '<div class="cp-dots">' + dots(st) + '</div><div class="cp-row"><button type="button" class="cp-btn ghost" data-cpob="back">رجوع</button><button type="button" class="cp-btn" data-cpob="next"' + (cur == null ? ' disabled' : '') + '>التالي</button></div>';
    } else if (st === 2 + QS.length) {
      var stg = stageFrom(OB.ans); OB.tmp.stage = OB.tmp.stage || stg;
      body = '<h1 class="cp-h sm">غالبًا إحنا هنا…</h1>' + pathHtml(OB.tmp.stage) + '<p class="cp-p">ده مكاننا النهارده — مش حكم عليك. وتقدر تغيّره بإيدك:</p><div class="cp-chips">' + [1, 2, 3, 4, 5].map(function (k) { return '<button type="button" class="cp-chip' + (OB.tmp.stage === k ? ' on' : '') + '" data-cpstage="' + k + '">' + ['الرجوع', 'التأسيس', 'الجهاد', 'الاستنارة', 'الثمر'][k - 1] + '</button>'; }).join('') + '</div>';
      foot = '<button type="button" class="cp-btn" data-cpob="next">كمّل</button><button type="button" class="cp-btn ghost" data-cpob="back">رجوع</button>';
    } else if (st === 3 + QS.length) {
      var pm = [['صلاة الصبح ١٠ دقايق', 'صلاة الصبح ١٠ دقايق'], ['قراءة اليوم', 'قراءة اليوم'], ['شكر قبل النوم', 'شكر قبل النوم'], ['', 'مفيش دلوقتي']];
      body = hero + '<h1 class="cp-h sm">نبدأ بخطوة صغيرة؟</h1><div class="cp-chips">' + pm.map(function (x) { return '<button type="button" class="cp-chip' + (OB.tmp.promise === x[0] ? ' on' : '') + '" data-cppromise="' + esc(x[0]) + '">' + esc(x[1]) + '</button>'; }).join('') + '</div><p class="cp-p">هسألك عليها بكرة… من غير لوم لو ماحصلش.</p><div class="cp-note">🔒 كلامنا بيفضل على جهازك بس، وتقدر تمسحه كله بزرار واحد. وتقدر توقف الرفيق تمامًا من الإعدادات.</div>';
      foot = '<button type="button" class="cp-btn" data-cpob="finish">ادخل البرنامج</button><button type="button" class="cp-btn ghost" data-cpob="back">رجوع</button>';
    }
    ov('cpOnb', 'night', '<div class="cp-sky"></div><div class="cp-scroll">' + body + '</div><div class="cp-foot">' + foot + '</div>');
  }
  function dots(n) { var t = 2 + QS.length, o = ''; for (var i = 1; i <= t; i++) o += '<i class="' + (i <= n ? 'on' : '') + '"></i>'; return o; }
  function obFinish() {
    S.done = true; S.name = (OB.tmp.name || '').trim() || 'رفيق'; S.tone = OB.tmp.tone || 'calm'; S.age = OB.tmp.age || '30'; S.stage = OB.tmp.stage || stageFrom(OB.ans); S.sixAns = OB.ans.slice();
    if (kid() && (S.preset === 'near' || S.preset === 'all')) S.preset = 'calm';
    applyPreset(S.preset, true);
    if (OB.tmp.promise) { S.promise = OB.tmp.promise; S.promiseDay = today(); S.memory.push({ k: 'promise', t: OB.tmp.promise, d: today() }); }
    S.lastGate = today(); save(); closeOv('cpOnb'); refresh();
  }
  function applyPreset(p, keepPages) { var P = PRESETS[p] || PRESETS.with; S.preset = p; S.gate = P.gate; S.evening = P.evening; var pg = Object.assign({}, P.pages); PAGES.forEach(function (x) { if (pg[x[0]] == null) pg[x[0]] = P.pages.other; }); S.pages = pg; save(); }

  /* ---------- العتبة اليومية ---------- */
  function gateText() {
    var pi = planInfo(), h = new Date().getHours(), gap = daysSince(S.lastGate), m = { n: nm() || 'يا صاحبي', k: ar(pi.total), l: ar(pi.left), f: pi.next ? pi.next.label : '' };
    if (m.n === 'يا صاحبي') m.n = 'صاحبي';
    if (gap >= 3) return line('back', m);
    if (pi.all) return line('gateDone', m);
    return line(h < 12 ? 'gateAM' : 'gatePM', m);
  }
  function daysSince(d) { if (!d) return 99; var a = new Date(d + 'T00:00:00'), b = new Date(); return Math.floor((b - a) / 86400000); }
  function maybeGate() {
    if (!S.done || !S.gate || S.lastGate === today() || quietNow() || capLeft() <= 0) return;
    var pi = planInfo(), pr = '';
    if (S.promiseq && S.promise && S.promiseDay && S.promiseDay !== today() && !S.promiseAsked) pr = S.promise;
    var txt = gateText(), cal = ''; try { var c = window.__copCal && window.__copCal.label(new Date()); cal = (c && c.text) || ''; } catch (e) { }
    var dt = RF.fmtDate(new Date(), { weekday: 'long', day: 'numeric', month: 'long' });
    var html = '<div class="cp-sky"></div><div class="cp-hills"></div><div class="cp-walk"><span>' + avatar({ pose: 'stand', lamp: 3, w: 150 }) + '</span><span>' + meFig(66) + '</span></div><div class="cp-gtxt"><p class="cp-hint">' + esc(dt) + (cal ? ' · ' + esc(cal) : '') + '</p><h1 class="cp-h">' + esc(txt) + '</h1>' +
      (pr ? '<div class="cp-bub">' + esc(sub(line('promiseQ'), { p: pr })) + '<div class="cp-chips" style="margin-top:8px"><button type="button" class="cp-chip" data-cpprom="yes">أيوه</button><button type="button" class="cp-chip" data-cpprom="no">مش بالظبط</button></div></div>' : '') + '</div>' +
      '<div class="cp-foot"><button type="button" class="cp-btn" data-cpgate="go">' + (pi.next && !pi.all ? 'يلا نبدأ' : 'تمام') + '</button><button type="button" class="cp-btn ghost" data-cpgate="skip">أدخل على طول</button></div>';
    ov('cpGate', 'night gate', html); S.lastGate = today(); bump(); save();
  }

  /* ---------- شريط الرئيسية ---------- */
  function paintStrip() {
    var host = q('#page-home .u-wrap'), el = document.getElementById('cpStrip'), ok = isOn() && S.done && host && level('home') >= 2 && S.hideDay !== today();
    if (!ok) { if (el) el.remove(); return; }
    var pi = planInfo(), m = { n: nm(), k: ar(pi.total), l: ar(pi.left), f: pi.next ? pi.next.label : '' }, txt = pi.all ? line('stripDone', m) : line('stripLeft', m);
    var pct = pi.total ? Math.round(100 * pi.done / pi.total) : 0;
    var h = '<button type="button" class="cp-fig" data-cppanel="1" aria-label="افتح ' + esc(S.name) + '">' + avatar({ pose: pi.all ? 'raise' : 'stand', lamp: pi.all ? 3 : 2, w: 40 }) + '</button><div class="cp-sbody"><div class="cp-stxt">' + (txt ? esc(txt) : esc(S.name)) + '</div><div class="cp-bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + pi.total + '" aria-valuenow="' + pi.done + '"><i style="width:' + pct + '%"></i></div></div>' + (pi.next && !pi.all ? '<button type="button" class="cp-go" data-cpnext="1">ابدأ</button>' : '');
    if (!el) { el = document.createElement('section'); el.id = 'cpStrip'; el.className = 'cp-strip'; host.insertBefore(el, host.firstChild); } else if (host.firstChild !== el) host.insertBefore(el, host.firstChild);
    if (el.dataset.h !== h) { el.innerHTML = h; el.dataset.h = h; }
  }

  /* ---------- المصباح العائم ولوحة الرفيق ---------- */
  function paintLamp() {
    var el = document.getElementById('cpLamp'), pg = curPage(), hid = S.hideDay === today(), lv = level(pg);
    if (!isOn() || !S.done || hid || lv < 1 || q('#cpOnb') || q('#cpGate') || (pg === 'home' && lv >= 2)) { if (el) el.remove(); return; }
    var pi = planInfo(), lamp = pi.all ? 3 : 2, h = avatar({ pose: 'stand', lamp: lamp, w: 34 });
    if (!el) { el = document.createElement('button'); el.id = 'cpLamp'; el.type = 'button'; el.setAttribute('aria-label', 'افتح ' + S.name); document.body.appendChild(el); }
    el.className = 'cp-lamp cp-side-' + (S.lamp.side === 'left' ? 'left' : 'right') + ' cp-y-' + (S.lamp.y || 'mid');
    if (el.dataset.h !== h) { el.innerHTML = h; el.dataset.h = h; }
  }
  function openPanel() {
    var pi = planInfo(), m = { n: nm(), k: ar(pi.total), l: ar(pi.left), f: pi.next ? pi.next.label : '' }, mem = S.memory.slice(-5).reverse();
    var items = (plan() && plan().items || []).slice(0, 8);
    var html = '<div class="cp-dim" data-cpclose="cpPanel"></div><div class="cp-sheet"><div class="cp-mini">' + avatar({ pose: 'offer', lamp: 2, w: 78 }) + '<div class="cp-bub">' + esc(pi.all ? line('gateDone', m) : (pi.next ? line('stripLeft', m) : 'أنا هنا لو احتجتني.')) + '</div></div>' +
      '<div class="cp-card"><h3>خطواتنا النهارده</h3>' + items.map(function (x) { return '<div class="cp-step' + (x.done ? ' done' : '') + '"><i></i><span>' + esc(x.label) + '</span></div>'; }).join('') + '</div>' +
      '<div class="cp-btns">' + (pi.next && !pi.all ? '<button type="button" class="cp-btn" data-cpnext="1">ابدأ: ' + esc(pi.next.label) + '</button>' : '') + (curPage() === 'read' && !kid() ? '<button type="button" class="cp-btn ghost2" data-cpreadnote="1">سجّل اللي لمسني في القراءة</button>' : '') + (S.evening ? '<button type="button" class="cp-btn ghost2" data-cpevening="1">مراجعة آخر اليوم</button>' : '') + '</div>' +
      (!kid() && mem.length ? '<div class="cp-card"><h3>اللي فاكره عنك</h3>' + mem.map(function (x, i) { return '<div class="cp-mem"><span class="cp-tag">' + (x.k === 'promise' ? 'وعد' : x.k === 'word' ? 'كلمة' : 'يوم') + '</span><span>' + esc(x.t) + '</span><button type="button" class="cp-forget" data-cpforget="' + (S.memory.length - 1 - i) + '">انسَ</button></div>'; }).join('') + '</div>' : '') +
      '<div class="cp-btns"><button type="button" class="cp-btn ghost2" data-cpsettings="1">إعدادات ' + esc(S.name) + '</button><button type="button" class="cp-btn ghost2" data-cphide="1">إخفاء لباقي اليوم</button><button type="button" class="cp-btn ghost" data-cpclose="cpPanel">إغلاق</button></div></div>';
    ov('cpPanel', 'panel', html);
  }

  /* ---------- مراجعة آخر اليوم ---------- */
  var EV = { mood: '', touch: '', next: '' };
  function openEvening(manual) {
    if (!manual && (!S.evening || S.lastEve === today() || quietNow() && false || capLeft() <= 0)) return;
    EV = { mood: '', touch: '', next: '' }; evRender(); if (!manual) bump();
  }
  function evRender() {
    var m = { n: nm() }, moods = [['مطمّن', 'مطمّن'], ['تعبان بس شاكر', 'تعبان بس شاكر'], ['قلقان', 'قلقان'], ['جاف', 'جاف'], ['فرحان', 'فرحان']];
    var nexts = [['صلاة باكر', 'صلاة باكر'], ['زي النهارده', 'زي النهارده'], ['قراءة اليوم', 'قراءة اليوم']];
    var html = '<div class="cp-dim" data-cpclose="cpEve"></div><div class="cp-sheet"><div class="cp-mini">' + avatar({ pose: 'sit', lamp: 1, w: 70 }) + '<div class="cp-bub">' + esc(line('eveQ', m)) + '</div></div><div class="cp-chips">' + chips(moods, EV.mood, 'data-cpmood') + '</div>' +
      (kid() ? '' : '<div class="cp-q">' + esc(line('eveTouch')) + '</div><input class="cp-in" id="cpTouch" maxlength="90" placeholder="سطر واحد لو حبيت…" value="' + esc(EV.touch) + '">') +
      '<div class="cp-q">' + esc(line('eveNext')) + '</div><div class="cp-chips">' + chips(nexts, EV.next, 'data-cpnextstep') + '</div><div class="cp-btns"><button type="button" class="cp-btn" data-cpevsave="1">تصبح على خير</button><button type="button" class="cp-btn ghost" data-cpclose="cpEve">مش دلوقتي</button></div></div>';
    ov('cpEve', 'panel', html);
  }
  function evSave() {
    var t = q('#cpTouch'); if (t) EV.touch = t.value.trim();
    S.log.push({ d: today(), mood: EV.mood, touch: kid() ? '' : EV.touch, next: EV.next }); if (S.log.length > 60) S.log = S.log.slice(-60);
    if (S.mem && !kid() && EV.touch) { S.memory.push({ k: 'day', t: EV.touch, d: today() }); if (S.memory.length > 40) S.memory = S.memory.slice(-40); }
    S.lastEve = today(); save(); closeOv('cpEve'); toast('تصبح على خير. الرب يحرسك.');
  }
  function toast(t) { try { F().toast && F().toast(t); } catch (e) { } }

  /* ---------- سؤال بعد القراءة ---------- */
  /* سؤال القراءة: لا يظهر إلا بعد أن تضغط «قرأتُ قراءات اليوم» أنت (انتقال من غير مقروء إلى مقروء)، أو يدويًا من لوحة الرفيق */
  var readAsked = '';
  function readSheet() {
    var opts = [['أعمل بيها', 'أعمل بيها'], ['سلام', 'سلام'], ['توبة', 'توبة'], ['شكر', 'شكر'], ['مش عارف', 'مش عارف']];
    ov('cpRead', 'panel', '<div class="cp-dim" data-cpclose="cpRead"></div><div class="cp-sheet"><div class="cp-mini">' + avatar({ pose: 'offer', lamp: 2, w: 62 }) + '<div class="cp-bub">' + esc(line('readQ')) + '</div></div><div class="cp-chips">' + chips(opts, '', 'data-cpword') + '</div><div class="cp-q">أو اكتب بكلامك:</div><textarea class="cp-in cp-ta" id="cpWordTxt" rows="3" maxlength="240" placeholder="الآية أو الفكرة اللي لمستك…"></textarea><div class="cp-btns"><button type="button" class="cp-btn" data-cpwordsave="1">احفظ</button><button type="button" class="cp-btn ghost" data-cpclose="cpRead">مش دلوقتي</button></div></div>');
  }
  function afterReadClick() {
    if (!isOn() || !S.done || !S.readq || level('read') < 2 || readAsked === today() || capLeft() <= 0 || quietNow() || kid()) return;
    var done = false; try { done = !!F().readDone(F().dkey()); } catch (e) { }
    if (!done) return; readAsked = today(); bump(); readSheet();
  }
  function maybeReadQ() { }
  function saveWord(t) { t = String(t || '').trim(); if (!t) return false; S.log.push({ d: today(), word: t }); if (S.mem && !kid()) { S.memory.push({ k: 'word', t: 'من القراءة: ' + t, d: today() }); if (S.memory.length > 40) S.memory = S.memory.slice(-40); } save(); return true; }

  /* ---------- الإعدادات ---------- */
  function openSettings() {
    var LB = ['غير موجود', 'زر فقط', 'يتكلم'];
    var pg = PAGES.map(function (p) {
      var lv = level(p[0]), lab = LB.slice(); if (p[0] === 'home') lab[2] = 'شريط';
      return '<div class="cp-pg"><b>' + esc(p[1]) + '</b><div class="cp-seg">' + lab.map(function (t, i) { var dis = (NOSPEAK[p[0]] && i === 2) ? ' disabled' : ''; return '<button type="button" class="' + (lv === i ? 'on' : '') + '" data-cppg="' + p[0] + ':' + i + '"' + dis + '>' + t + '</button>'; }).join('') + '</div></div>';
    }).join('');
    var pre = Object.keys(PRESETS).map(function (k) { var P = PRESETS[k], dis = kid() && (k === 'near' || k === 'all'); return '<button type="button" class="cp-pre' + (S.preset === k ? ' on' : '') + '" data-cppre="' + k + '"' + (dis ? ' disabled' : '') + '><b>' + P.t + '</b><small>' + P.d + '</small></button>'; }).join('');
    function sel(id, v) { var o = ''; for (var h = 0; h < 24; h++) o += '<option value="' + h + '"' + (+v === h ? ' selected' : '') + '>' + ar(h) + ':٠٠</option>'; return '<select class="cp-in cp-sel" id="' + id + '">' + o + '</select>'; }
    var html = '<div class="cp-dim" data-cpclose="cpSet"></div><div class="cp-sheet tall"><h2 class="cp-h2">إعدادات ' + esc(S.name) + '</h2>' +
      '<div class="cp-card"><h3>أنا</h3><div class="cp-lab">سنّي</div><div class="cp-chips">' + chips(AGES, S.age, 'data-cpsage') + '</div><div class="cp-lab">محطتي على الدرب</div><div class="cp-chips">' + [1, 2, 3, 4, 5].map(function (k) { return '<button type="button" class="cp-chip' + (S.stage === k ? ' on' : '') + '" data-cpsstage="' + k + '">' + ['الرجوع', 'التأسيس', 'الجهاد', 'الاستنارة', 'الثمر'][k - 1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="cp-card"><h3>الرفيق</h3><div class="cp-lab">الاسم</div><input class="cp-in" id="cpSName" maxlength="14" value="' + esc(S.name) + '"><div class="cp-lab">النبرة</div><div class="cp-chips">' + chips(TONES, S.tone, 'data-cpstone') + '</div></div>' +
      '<div class="cp-card"><h3>قد إيه يقرّب؟</h3><div class="cp-small">اختيار سريع يضبط الصفحات والأوقات، وتقدر تعدّل كل حاجة بعده بنفسك.</div>' + pre + '</div>' +
      '<div class="cp-card"><h3>يظهر فين؟</h3><div class="cp-small">لكل صفحة: <b>غير موجود</b> (مش هيظهر خالص)، أو <b>زر فقط</b> (زر صغير تدوس عليه لو احتجته)، أو <b>يتكلم</b> (في الرئيسية: شريط، وفي غيرها: يسألك ويعلّق). في الصلاة والمحاسبة أقصى حاجة زر.</div>' + pg + '</div>' +
      '<div class="cp-card"><h3>شكل الزر ومكانه</h3><div class="cp-lab">الجنب</div><div class="cp-chips">' + chips([['right', 'يمين'], ['left', 'شمال']], S.lamp.side, 'data-cpside') + '</div><div class="cp-lab">الارتفاع</div><div class="cp-chips">' + chips([['high', 'فوق'], ['mid', 'وسط'], ['low', 'تحت']], S.lamp.y, 'data-cpy') + '</div></div>' +
      '<div class="cp-card"><h3>أسئلة وذاكرة</h3>' + tog('cpTgGate', 'شاشة الصباح (أول فتحة في اليوم)', S.gate) + tog('cpTgEve', 'مراجعة آخر اليوم', S.evening) + tog('cpTgReadq', 'سؤال بعد ما أضغط «قرأتُ»', S.readq) + tog('cpTgProm', 'سؤال الوعد في اليوم التالي', S.promiseq) + tog('cpTgMem', 'يفتكر اللي أكتبه (على جهازي بس)', S.mem) + '</div>' +
      '<div class="cp-card"><h3>ساعات الهدوء</h3>' + tog('cpTgQuiet', 'مفيش أسئلة ولا شاشات في الوقت ده', S.quiet.on) + '<div class="cp-trow"><span>من</span>' + sel('cpQFrom', S.quiet.from) + '<span>إلى</span>' + sel('cpQTo', S.quiet.to) + '</div></div>' +
      '<div class="cp-btns"><button type="button" class="cp-btn ghost2" data-cprestart="1">أعيد التعارف من الأول</button><button type="button" class="cp-btn ghost2" data-cpwipe="1">امسح الذاكرة</button><button type="button" class="cp-btn danger" data-cpoff="1">أوقف الرفيق (يرجع البرنامج كما كان)</button><button type="button" class="cp-btn" data-cpclose="cpSet">تمّ</button></div></div>';
    ov('cpSet', 'panel', html);
  }
  function tog(id, label, on) { return '<div class="cp-trow"><span>' + label + '</span><button type="button" id="' + id + '" role="switch" aria-checked="' + (on ? 'true' : 'false') + '" class="cp-sw"><i></i></button></div>'; }

  /* ---------- قسم الإعدادات الرئيسي (زر التشغيل) ---------- */
  function injectSettings() {
    var panel = document.getElementById('settingsPanel'); if (!panel) return;
    var sec = document.getElementById('cpSection');
    if (!sec) {
      sec = document.createElement('div'); sec.className = 'settings-section'; sec.id = 'cpSection';
      var head = q('.settings-head', panel); if (head && head.nextSibling) panel.insertBefore(sec, head.nextSibling); else panel.appendChild(sec);
    }
    var on = isOn(), h = '<div class="settings-label">الرفيق الروحي <small>(تجريبي)</small></div><div class="settings-reminder-row"><span class="settings-reminder-text">شخصية تمشي معك على الدرب وتتابع خطواتك. ولو قفلته يرجع البرنامج لشكله الحالي تمامًا.</span><button class="settings-toggle" id="cpToggle" role="switch" aria-checked="' + (on ? 'true' : 'false') + '" aria-label="تشغيل الرفيق الروحي"><span class="settings-toggle-knob"></span></button></div>' + (on ? '<div class="settings-reminder-row"><button type="button" class="settings-mbtn" id="cpOpenSet">إعدادات الرفيق</button></div>' : '');
    if (sec.dataset.h !== h) { sec.innerHTML = h; sec.dataset.h = h; }
  }
  function setOn(v) {
    lsSet(K_ON, v ? '1' : '0');
    if (v) { load(); boot(true); if (!S.done) { try { var c = document.getElementById('settingsClose'); c && c.click(); } catch (e) { } startOnboarding(); } }
    else { teardown(); }
    injectSettings();
  }
  function teardown() {
    ['cpLayer', 'cpStrip', 'cpLamp'].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
    document.documentElement.classList.remove('cp-lock'); document.documentElement.removeAttribute('data-companion'); layer = null;
  }

  /* ---------- التحديث والأحداث ---------- */
  var tmr = 0;
  function refresh() { if (!isOn()) return; clearTimeout(tmr); tmr = setTimeout(function () { try { paintStrip(); paintLamp(); } catch (e) { fail(e); } }, 60); }
  var errs = 0; function fail(e) { errs++; if (errs >= 3) { lsSet(K_ON, '0'); teardown(); injectSettings(); try { console.warn('companion disabled after errors', e); } catch (x) { } } }
  function maybeEveningAuto() { if (!isOn() || !S.done || !S.evening || S.lastEve === today() || new Date().getHours() < 20 || quietNow() || ['pray', 'exam'].indexOf(curPage()) > -1 || q('.cp-ov') || capLeft() <= 0) return; openEvening(false); }

  var booted = false;
  function boot(force) {
    if (!isOn()) return;
    try {
      load(); document.documentElement.setAttribute('data-companion', 'on');
      if (!booted || force) {
        booted = true;
        if (RF.act && RF.act.on) RF.act.on(refresh);
        qa('.u-page').forEach(function (pgEl) { new MutationObserver(refresh).observe(pgEl, { attributes: true, attributeFilter: ['class'] }); });
        document.addEventListener('visibilitychange', function () { if (!document.hidden) { refresh(); } });
        setInterval(function () { if (isOn()) maybeEveningAuto(); }, 60000);
      }
      if (!S.done) { if (!q('#cpOnb')) startOnboarding(); }
      else { setTimeout(function () { try { maybeGate(); paintStrip(); paintLamp(); setTimeout(maybeEveningAuto, 3000); } catch (e) { fail(e); } }, 700); }
    } catch (e) { fail(e); }
  }

  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return; var b;
    if ((b = t.closest('#cpToggle'))) { e.preventDefault(); setOn(!isOn()); return; }
    if (t.closest('#cpOpenSet')) { try { document.getElementById('settingsClose').click(); } catch (x) { } openSettings(); return; }
    if (!isOn()) return;
    if ((b = t.closest('[data-cpob]'))) {
      var a = b.getAttribute('data-cpob');
      if (a === 'skip') { OB.tmp = { name: 'رفيق', tone: 'calm', age: '30', stage: 2 }; OB.ans = []; S.done = true; S.stage = 2; applyPreset('calm'); S.lastGate = today(); save(); closeOv('cpOnb'); refresh(); return; }
      if (a === 'next') { var nameEl = q('#cpName'); if (nameEl) OB.tmp.name = nameEl.value; if (OB.step === 1 && OB.tmp.age === '8') { /* أطفال: ٣ أسئلة فقط */ } OB.step++; if (OB.step === 2 + QS.length) OB.tmp.stage = 0; obRender(); return; }
      if (a === 'back') { OB.step = Math.max(0, OB.step - 1); obRender(); return; }
      if (a === 'finish') { obFinish(); return; }
    }
    if ((b = t.closest('[data-cpage]'))) { var n0 = q('#cpName'); if (n0) OB.tmp.name = n0.value; OB.tmp.age = b.getAttribute('data-cpage'); obRender(); return; }
    if ((b = t.closest('[data-cptone]'))) { var n1 = q('#cpName'); if (n1) OB.tmp.name = n1.value; OB.tmp.tone = b.getAttribute('data-cptone'); S.tone = OB.tmp.tone; obRender(); return; }
    if ((b = t.closest('[data-cpans]'))) { OB.ans[OB.step - 2] = +b.getAttribute('data-cpans'); obRender(); return; }
    if ((b = t.closest('[data-cpstage]'))) { OB.tmp.stage = +b.getAttribute('data-cpstage'); obRender(); return; }
    if ((b = t.closest('[data-cppromise]'))) { OB.tmp.promise = b.getAttribute('data-cppromise'); obRender(); return; }
    if ((b = t.closest('[data-cpgate]'))) { var g = b.getAttribute('data-cpgate'), pi = planInfo(); closeOv('cpGate'); refresh(); if (g === 'go' && pi.next && !pi.all) goItem(pi.next); return; }
    if ((b = t.closest('[data-cpprom]'))) { S.promiseAsked = true; S.memory.push({ k: 'promise', t: S.promise + (b.getAttribute('data-cpprom') === 'yes' ? ' — تمّ' : ' — نكمّل'), d: today() }); save(); b.parentNode.innerHTML = '<span class="cp-hint">' + (b.getAttribute('data-cpprom') === 'yes' ? 'الحمد لله.' : 'مفيش لوم، نكمّل سوا.') + '</span>'; return; }
    if (t.closest('[data-cppanel]')) { openPanel(); return; }
    if (t.closest('#cpLamp')) { openPanel(); return; }
    if (t.closest('[data-cpnext]')) { var p2 = planInfo(); closeOv('cpPanel'); goItem(p2.next); return; }
    if ((b = t.closest('[data-cpclose]'))) { closeOv(b.getAttribute('data-cpclose')); return; }
    if (t.closest('[data-cpevening]')) { closeOv('cpPanel'); openEvening(true); return; }
    if (t.closest('[data-cpsettings]')) { closeOv('cpPanel'); openSettings(); return; }
    if (t.closest('[data-cphide]')) { S.hideDay = today(); save(); closeOv('cpPanel'); refresh(); toast('هرجع لك بكرة. المصباح مخفي لباقي اليوم.'); return; }
    if ((b = t.closest('[data-cpforget]'))) { S.memory.splice(+b.getAttribute('data-cpforget'), 1); save(); openPanel(); return; }
    if ((b = t.closest('[data-cpmood]'))) { EV.mood = b.getAttribute('data-cpmood'); var tt = q('#cpTouch'); if (tt) EV.touch = tt.value; evRender(); return; }
    if ((b = t.closest('[data-cpnextstep]'))) { EV.next = b.getAttribute('data-cpnextstep'); var t3 = q('#cpTouch'); if (t3) EV.touch = t3.value; evRender(); return; }
    if (t.closest('[data-cpevsave]')) { evSave(); return; }
    if ((b = t.closest('[data-cpword]'))) { saveWord(b.getAttribute('data-cpword')); closeOv('cpRead'); toast('تمام. حفظتها.'); return; }
    if (t.closest('[data-cpwordsave]')) { var wt = q('#cpWordTxt'); if (wt && saveWord(wt.value)) { closeOv('cpRead'); toast('اتحفظت. بارك الرب فيك.'); } return; }
    if (t.closest('[data-cpreadnote]')) { closeOv('cpPanel'); readSheet(); return; }
    if ((b = t.closest('[data-cpside]'))) { S.lamp.side = b.getAttribute('data-cpside'); save(); openSettings(); refresh(); return; }
    if ((b = t.closest('[data-cpy]'))) { S.lamp.y = b.getAttribute('data-cpy'); save(); openSettings(); refresh(); return; }
    if (t.closest('#cpTgReadq')) { S.readq = S.readq ? 0 : 1; save(); openSettings(); return; }
    if (t.closest('#cpTgProm')) { S.promiseq = S.promiseq ? 0 : 1; save(); openSettings(); return; }
    if (t.closest('#cpTgMem')) { S.mem = S.mem ? 0 : 1; save(); openSettings(); return; }
    if (t.closest('#readDoneBar')) { setTimeout(afterReadClick, 350); return; }
    /* الإعدادات */
    if ((b = t.closest('[data-cpsage]'))) { S.age = b.getAttribute('data-cpsage'); if (kid() && (S.preset === 'near' || S.preset === 'all')) applyPreset('calm'); save(); openSettings(); refresh(); return; }
    if ((b = t.closest('[data-cpsstage]'))) { S.stage = +b.getAttribute('data-cpsstage'); save(); openSettings(); refresh(); return; }
    if ((b = t.closest('[data-cpstone]'))) { S.tone = b.getAttribute('data-cpstone'); save(); openSettings(); refresh(); return; }
    if ((b = t.closest('[data-cppre]'))) { applyPreset(b.getAttribute('data-cppre')); openSettings(); refresh(); return; }
    if ((b = t.closest('[data-cppg]'))) { var pp = b.getAttribute('data-cppg').split(':'); S.pages[pp[0]] = +pp[1]; save(); openSettings(); refresh(); return; }
    if ((b = t.closest('#cpTgGate'))) { S.gate = S.gate ? 0 : 1; save(); openSettings(); return; }
    if ((b = t.closest('#cpTgEve'))) { S.evening = S.evening ? 0 : 1; save(); openSettings(); return; }
    if ((b = t.closest('#cpTgQuiet'))) { S.quiet.on = S.quiet.on ? 0 : 1; save(); openSettings(); return; }
    if (t.closest('[data-cprestart]')) { S.done = false; save(); closeOv('cpSet'); startOnboarding(); return; }
    if (t.closest('[data-cpwipe]')) { S.memory = []; S.log = []; S.promise = ''; save(); toast('اتمسحت الذاكرة.'); return; }
    if (t.closest('[data-cpoff]')) { closeOv('cpSet'); setOn(false); toast('الرفيق متوقف. البرنامج رجع زي ما كان.'); return; }
  });
  document.addEventListener('input', function (e) { var t = e.target; if (!t || !isOn()) return; if (t.id === 'cpSName') { S.name = t.value.trim() || 'رفيق'; save(); } else if (t.id === 'cpName') OB.tmp.name = t.value; else if (t.id === 'cpTouch') EV.touch = t.value; });
  document.addEventListener('change', function (e) { var t = e.target; if (!t || !isOn()) return; if (t.id === 'cpQFrom') { S.quiet.from = +t.value; save(); refresh(); } else if (t.id === 'cpQTo') { S.quiet.to = +t.value; save(); refresh(); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOn()) { var o = q('#cpPanel,#cpEve,#cpSet,#cpRead,#cpGate'); if (o) o.remove(); if (!q('#cpLayer .cp-ov')) document.documentElement.classList.remove('cp-lock'); } });

  /* ---------- بدء التشغيل (آمن) ---------- */
  function start() {
    injectSettings(); new MutationObserver(injectSettings).observe(document.body, { childList: true, subtree: true });
    if (!isOn()) return;
    var crashes = +(lsGet(K_BOOT) || 0);
    if (crashes >= 2) { lsSet(K_ON, '0'); lsSet(K_BOOT, '0'); try { console.warn('companion: disabled after repeated start failures'); } catch (e) { } return; }
    lsSet(K_BOOT, String(crashes + 1));
    boot();
    setTimeout(function () { lsSet(K_BOOT, '0'); }, 4000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.__companion = { on: isOn, setOn: setOn, state: function () { return S; }, openPanel: openPanel, openSettings: openSettings, gate: function () { if (S) { S.lastGate = ''; save(); } maybeGate(); }, evening: function () { openEvening(true); }, avatar: avatar };
})();
