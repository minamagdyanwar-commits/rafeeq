/* v6.14 — «الرفيق» (تجريبي): محرّك المتابعة. يقرأ نشاطك الفعلي من التطبيق (الأجبية، القراءات، التأمل، الخلوة، المحاسبة، دفتر الشكر، صوت الله)
   ويحوّله إلى كلام قريب وهادئ: تشجيع على ما تواظب عليه، ودعوة لطيفة (لا لوم ولا اتهام) لما غاب.
   وحدة نقية بلا DOM: app54.js يستدعيها ويعرضها (شاشة الصباح، الشريط، فقاعة الرفيق، صندوق الرسائل، أسبوعك).
   لا ذكاء اصطناعي: قوالب جاهزة متعدّدة الصيغ تُختار بحسب الحالة، وبدون تكرار نفس الصيغة مرتين متتاليتين.
   ضوابط: الرفيق صاحب يمشي معك وليس صوت الله، لا يمنح حلًّا من خطية، ولا يذكر تفاصيل المحاسبة (يشير لفتح القسم فقط). */
(function () {
  'use strict';
  function F() { return window.__F || {}; }
  function ar(n) { return window.RF ? RF.ar(n) : String(n); }

  /* ---------- قراءة النشاط ---------- */
  var HOURS_WIN = { bakr: 11, thalitha: 13, sadisa: 16, tasi3a: 18, ghouroub: 21 }; /* بعد هذه الساعة تُعدّ «فاتت» النهارده */
  var HOURS_NAME = { bakr: 'صلاة باكر', thalitha: 'صلاة الثالثة', sadisa: 'صلاة السادسة', tasi3a: 'صلاة التاسعة', ghouroub: 'صلاة الغروب', noum: 'صلاة النوم', nos_layl_1: 'نصف الليل', nos_layl_2: 'نصف الليل', nos_layl_3: 'نصف الليل', setar: 'صلاة الستار' };
  function keys(n) {
    var f = F(), base = f.parseKey(f.realKey ? f.realKey() : f.dkey()), out = [];
    for (var i = 0; i < n; i++) out.push(f.dkey(f.addDays(base, -i)));
    return out;
  }
  function stat(a) { /* a[0] = النهارده، a[1] = إمبارح … */
    var c7 = 0, p14 = 0, run = 0, gap = a.indexOf(true), i;
    for (i = 0; i < 7; i++) if (a[i]) c7++;
    for (i = 1; i < 15; i++) if (a[i]) p14++;
    while (run + 1 < a.length && a[run + 1]) run++;
    var prev7 = 0; for (i = 1; i < 8; i++) if (a[i]) prev7++;
    return { today: !!a[0], yday: !!a[1], c7: c7, p14: p14, prev7: prev7, run: run, gap: gap, ever: gap > -1, dots: a.slice(0, 7).reverse().map(function (x) { return x ? 2 : 0; }) };
  }
  function lastTs(arr, field) { var m = 0; (arr || []).forEach(function (x) { var t = x && (x[field || 'ts'] || 0); if (t > m) m = t; }); return m; }
  function gapDays(ts) { if (!ts) return -1; return Math.floor((Date.now() - ts) / 86400000); }

  function signals() {
    var f = F(), ks = keys(45), o = { today: ks[0], hours: [], sec: {}, now: new Date() }, plan = null;
    try { plan = f.dayPlan(f.realKey ? f.realKey() : ks[0]); } catch (e) { }
    var hr = ((plan && plan.items) || []).filter(function (x) { return x.type === 'hour'; });
    hr.forEach(function (h) {
      var key = h.key || h.gid, a = ks.map(function (k) { try { return !!f.hourDone(k, key); } catch (e) { return false; } });
      var s = stat(a); s.key = key; s.label = h.label || HOURS_NAME[key] || key; o.hours.push(s);
    });
    [['read', 'readDone'], ['med', 'medDone'], ['gd', 'gdDone'], ['exam', 'examDone']].forEach(function (p) {
      var a = ks.map(function (k) { try { return !!f[p[1]](k); } catch (e) { return false; } }); o.sec[p[0]] = stat(a);
    });
    var me = {}, talk = [];
    try { me = JSON.parse(localStorage.getItem('rafeeq_me_v1') || '{}') || {}; } catch (e) { }
    try { talk = JSON.parse(localStorage.getItem('rafeeq_talk_v1') || '[]') || []; } catch (e) { }
    var thxTs = lastTs(me.thx), talkTs = lastTs(talk);
    o.sec.thx = { gap: gapDays(thxTs), ever: !!thxTs, c7: (me.thx || []).filter(function (x) { return x.ts && Date.now() - x.ts < 7 * 86400000; }).length };
    o.sec.talk = { gap: gapDays(talkTs), ever: !!talkTs, c7: talk.filter(function (x) { return x && x.ts && Date.now() - x.ts < 7 * 86400000; }).length };
    var pend = (me.reqs || []).filter(function (x) { return !x.done; }).sort(function (a, b) { return (a.ts || 0) - (b.ts || 0); });
    o.reqs = { n: pend.length, oldest: pend.length ? gapDays(pend[0].ts) : -1 };
    var hn = o.hours.length, h7 = 0; o.hours.forEach(function (h) { h7 += h.c7; }); o.hoursAvg7 = hn ? h7 / hn : 0;
    try { o.streak = f.streak ? f.streak() : 0; } catch (e) { o.streak = 0; }
    return o;
  }

  /* ---------- أسبوعك (نقط) ---------- */
  function week(sg) {
    var rows = [], n = sg.hours.length;
    if (n) {
      var dots = [], c = 0;
      for (var d = 0; d < 7; d++) { var k = 0; sg.hours.forEach(function (h) { if (h.dots[d] === 2) k++; }); dots.push(k === 0 ? 0 : k >= Math.ceil(n / 2) ? 2 : 1); }
      sg.hours.forEach(function (h) { c += h.c7; });
      rows.push({ k: 'pray', label: 'الصلوات', dots: dots, note: ar(c) + ' من ' + ar(n * 7) });
    }
    [['read', 'القراءات'], ['med', 'التأمل'], ['gd', 'الخلوة'], ['exam', 'المحاسبة']].forEach(function (p) { var s = sg.sec[p[0]]; rows.push({ k: p[0], label: p[1], dots: s.dots, note: ar(s.c7) + ' من ٧' }); });
    return rows;
  }

  /* ---------- قوالب الكلام ---------- */
  /* {h} اسم الصلاة، {n} عدد أيام. calm = الافتراضي، direct = أقصر، few = كلمات قليلة */
  var T = {
    hourToday: { calm: ['{h} لسه مستنياك النهارده… وإنت عادةً بتبقى معاها. دقيقتين بس ويرجع قلبك لمكانه.', '{h} وحشتني النهارده. تحب نصلّيها سوا دلوقتي؟', 'يومك من غير {h} ناقص حاجة حلوة، ولسه فيه وقت نرجع لها.', 'بحس إن {h} بتفرّق في يومك. لو فاضي لحظة، أنا جنبك.'], direct: ['فاتتك {h} النهارده. نصلّيها دلوقتي؟', '{h} لسه ما اتعملتش. دقيقتين؟'], few: ['{h}؟', 'نصلّي {h}؟'] },
    hourYday: { calm: ['إمبارح كنت مواظب على {h}، والنهارده لسه… أنا واثق إنك راجع لها.', 'مواظبتك على {h} إمبارح كانت حلوة. النهارده نكمّل نفس الخيط؟'], direct: ['صلّيت {h} إمبارح. النهارده؟'], few: ['{h} النهارده؟'] },
    hourGap: { calm: ['بقالك {n} أيام بعيد عن {h}، وإنت كنت اتعودت عليها. مفيش لوم أبدًا… الباب مفتوح، تحب نرجع بخطوة صغيرة؟', '{h} بقالها {n} أيام مستنياك. العودة أحلى من أي مرة، وأنا معاك.', 'حاسس إن {h} وحشتك زي ما وحشتني. نرجعلها النهارده بدقيقتين بس؟'], direct: ['بقالك {n} أيام من غير {h}. نرجع لها؟'], few: ['{h}… بقالها {n} أيام.'] },
    hourStreak: { calm: ['{n} أيام ورا بعض على {h}! عادة حلوة بتتبني… ربنا يثبّتك.', 'مواظب على {h} من {n} أيام. ده جهاد جميل، وأنا فخور بيك.'], direct: ['{n} أيام متتالية على {h}.'], few: ['{h}: {n} أيام. 👏'] },
    readGap: { calm: ['بقالك فترة ما فتحتش القراءات. كلمة ربنا بتفرّق في اليوم… تحب نقرأ سوا دلوقتي؟', 'القراءات مستنياك. ممكن نبدأ بآية واحدة بس لو الوقت ضيق.', 'حاسس إن الكتاب المقدس وحشك. افتح معايا قراءة النهارده؟'], direct: ['بقالك أيام من غير القراءات. نقرا النهارده؟'], few: ['القراءات؟'] },
    readPraise: { calm: ['ملتزم جدًا بقراءة الكتاب المقدس الأسبوع ده. شايف فيك حب للكلمة، ربنا يزيده.', 'قراءتك للكلمة منتظمة… وده بيبان على يومك. كمّل.'], direct: ['منتظم في القراءة ({n} من ٧). ممتاز.'], few: ['قراءة منتظمة. 👏'] },
    medGap: { calm: ['التأملات اليومية بقالها فترة. لحظة هدوء مع آية واحدة ممكن تغيّر حالة يومك.', 'تحب نقعد خمس دقايق في تأمل النهارده؟'], direct: ['التأمل بقاله أيام. نبدأ؟'], few: ['تأمل النهارده؟'] },
    gdGap: { calm: ['الخلوة بقالها فترة. ربنا بيحب يقعد معاك لوحدكم… عشر دقايق بس.', 'وحشتني خلوتنا. لو تحب نمشي فيها خطوة خطوة؟'], direct: ['الخلوة بقالها أيام. نرجع لها؟'], few: ['خلوة؟'] },
    examGap: { calm: ['محاسبة النفس بقالها شوية مستنياك. لحظة صدق هادية مع ربنا بتريّح القلب… لما تحب.', 'حاسس إن القلب محتاج لحظة هدوء ومراجعة. المحاسبة جاهزة وقت ما تكون مستعد.'], direct: ['المحاسبة بقالها أيام. تفتحها؟'], few: ['محاسبة؟'] },
    thxGap: { calm: ['بقالك فترة ما كتبتش في دفتر الشكر. إيه حاجة صغيرة النهارده تستاهل شكر؟', 'الشكر بيفتح القلب. تحب نكتب سطر شكر واحد دلوقتي؟'], direct: ['دفتر الشكر بقاله أيام. تكتب سطر؟'], few: ['شكر؟'] },
    talkGap: { calm: ['فاكر لما كنت بتحكي مع ربنا في «صوت الله»؟ هو لسه سامعك… تحب تحكي له عن يومك؟', 'بقالك فترة ما اتكلمتش مع ربنا هناك. هو بيحب يسمعك، وأنا جنبك.'], direct: ['«صوت الله» بقاله أيام. تحكي؟'], few: ['صوت الله؟'] },
    balance: { calm: ['ملتزم جدًا بقراءة الكتاب، وده جميل. والأجبية محتاجة شوية نفَس… تحب نبدأ بصلاة واحدة بس؟', 'عندك قوة في القراءة. نوازنها بصلاة قصيرة؟'], direct: ['القراءة ممتازة، والصلوات أقل. نبدأ بصلاة واحدة؟'], few: ['القراءة جميلة. صلاة كمان؟'] },
    prayPraise: { calm: ['مواظب على صلواتك الأسبوع ده. قلبي مطمّن لما أشوفك كده.', 'صلواتك منتظمة… ربنا يبارك ويثبّتك.'], direct: ['منتظم في الصلوات الأسبوع ده.'], few: ['صلواتك منتظمة. 👏'] },
    reqOld: { calm: ['فيه طلبة قديمة في دفترك لسه مستنية… تحب ترجع تصلّيها من جديد؟', 'طلباتك محفوظة عندي. وقت ما تحب نرفعها لربنا تاني.'], direct: ['عندك طلبة قديمة. تصلّيها؟'], few: ['طلباتك؟'] },
    back: { calm: ['حمدًا لله على سلامتك! غبت {n} أيام، وأنا فضلت فاكرك. نبدأ بخطوة صغيرة مع بعض؟', 'وحشتني! مفيش لوم، المهم إنك رجعت. نمشي بالتدريج.', 'أهلًا من تاني. الدرب لسه مفتوح قدامنا، وأنا معاك.'], direct: ['غبت {n} أيام. نبدأ بخطوة واحدة؟'], few: ['أهلًا من تاني.'] },
    streak: { calm: ['{n} أيام متتالية بنشاط في يومك! ربنا يكمّل لك الجهاد الحلو.', 'سلسلة {n} أيام… ده مجهود يستاهل الفرح.'], direct: ['سلسلة {n} أيام.'], few: ['{n} أيام. 👏'] }
  };
  var REACT = {
    hour: { calm: ['الله يبارك! {h} خلصت… حاسس إن يومك بقى أخف.', 'بارك الرب. {h} في موضعها، وأنا فرحان بيك.', 'تمام يا بطل. خطوة حلوة على الدرب.'], direct: ['{h} تمّت. ممتاز.'], few: ['تمام. 👏'] },
    read: { calm: ['كلمة ربنا دخلت يومك. ربنا يزرعها فيك.', 'قرأت النهارده… ده بيبني جواك حاجة، حتى لو ما حسّتش.'], direct: ['القراءة تمّت.'], few: ['تمام. 👏'] },
    exam: { calm: ['ربنا يريّح قلبك. لحظة صدق زي دي كبيرة قدامه.'], direct: ['المحاسبة تمّت.'], few: ['تمام.'] },
    all: { calm: ['كل خطوات النهارده تمّت! الحمد لله، ارتاح وربنا يحرسك.', 'يوم كامل مع ربنا. أنا فخور بيك.'], direct: ['كل خطوات اليوم تمّت.'], few: ['يوم كامل. 👏'] },
    other: { calm: ['حلو. خطوة تانية على الدرب.', 'الله يبارك فيك.'], direct: ['تمّت.'], few: ['👏'] }
  };
  var OPEN = {
    morning: ['صباح النور.', 'الرب يبارك صباحك.', 'يوم جديد ونعمة جديدة.', 'صباح الخير… أنا جنبك النهارده.', 'صباحك سلام.'],
    noon: ['أهلًا بيك.', 'نهارك سعيد.', 'ماشيين سوا.', 'منوّر.'],
    evening: ['مساء الخير.', 'مساء النور… يومك كان طويل؟', 'ربنا يبارك مساءك.', 'أهلًا، قرّب وقت الراحة.'],
    night: ['تصبح على خير.', 'ليلة هادية مع ربنا.', 'الرب يحرسك الليلة.']
  };
  function partOf() { var h = new Date().getHours(); return h < 5 ? 'night' : h < 12 ? 'morning' : h < 17 ? 'noon' : h < 21 ? 'evening' : 'night'; }
  function sub(t, m) { return String(t).replace(/\{(\w+)\}/g, function (x, k) { return m[k] != null ? m[k] : ''; }); }
  function seed() { var d = new Date(); return d.getFullYear() * 400 + d.getMonth() * 31 + d.getDate(); }
  /* يختار صيغة ولا يكرّر آخر صيغة قيلت لنفس المفتاح */
  function choose(S, id, pool, tone) {
    var list = (pool && (pool[tone] || pool.calm)) || [''];
    var said = (S.said = S.said || {}), last = said[id], i = (seed() + id.length * 7 + (S.cnt && S.cnt.n || 0)) % list.length;
    if (list.length > 1 && last === i) i = (i + 1) % list.length;
    said[id] = i; return list[i];
  }
  function opener(S, tone) {
    if (tone === 'few') return '';
    var pool = OPEN[partOf()] || OPEN.noon, said = (S.said = S.said || {}), id = 'open' + partOf(), i = (seed() + (S.cnt && S.cnt.n || 0)) % pool.length;
    if (said[id] === i) i = (i + 1) % pool.length; said[id] = i; return pool[i];
  }

  /* ---------- المرشّحات: ما يمكن أن يقوله الرفيق الآن (مرتّبة بالأهمية) ---------- */
  var DAYCD = { hourToday: 1, hourYday: 1, hourGap: 3, hourStreak: 5, readGap: 3, readPraise: 6, medGap: 5, gdGap: 6, examGap: 5, thxGap: 6, talkGap: 6, balance: 5, prayPraise: 6, reqOld: 7, back: 1, streak: 5 };
  function candidates(S, sg, opt) {
    opt = opt || {}; var tone = S.tone || 'calm', top = S.topics || {}, out = [], hr = sg.now.getHours(), kid = !!opt.kid;
    function add(type, topic, pri, m, go, ckey) {
      if (top[topic] === 0) return;
      var key = ckey || type, cd = DAYCD[type] || 2, last = (S.cool || {})[key];
      if (!opt.ignoreCool && last && sg.today && daysBetweenKeys(last, sg.today) < cd) return;
      out.push({ key: key, type: type, topic: topic, pri: pri, m: m, go: go, tone: tone });
    }
    if (opt.back > 1) add('back', 'any', 95, { n: ar(opt.back) }, { k: 'home' });
    sg.hours.forEach(function (h) {
      var win = HOURS_WIN[h.key], m = { h: h.label, n: ar(h.run || h.gap) }, go = { k: 'pray', key: h.key };
      var usual = h.p14 >= 6 || h.prev7 >= 4;
      if (!h.today && !h.yday && h.p14 >= 5 && h.gap >= 2) { m.n = ar(h.gap); add('hourGap', 'pray', 72, m, go, 'hourGap:' + h.key); }
      else if (!h.today && usual && win && hr >= win) add('hourToday', 'pray', 80, m, go, 'hourToday:' + h.key);
      else if (!h.today && h.yday && h.prev7 >= 3 && win && hr >= win - 3) add('hourYday', 'pray', 55, m, go, 'hourYday:' + h.key);
      if (h.today && h.run >= 3) { m.n = ar(h.run + 1); add('hourStreak', 'pray', 40, m, go, 'hourStreak:' + h.key); }
    });
    var S2 = sg.sec;
    if (S2.read.c7 === 0 && S2.read.p14 >= 4 && S2.read.gap >= 3 || (S2.read.gap >= 4)) add('readGap', 'read', 68, {}, { k: 'read' });
    if (S2.read.c7 >= 6) add('readPraise', 'read', 38, { n: ar(S2.read.c7) }, { k: 'read' });
    if (!kid) {
      if (S2.med.p14 >= 4 && S2.med.gap >= 5) add('medGap', 'med', 45, {}, { k: 'med' });
      if (S2.gd.p14 >= 3 && S2.gd.gap >= 6) add('gdGap', 'gd', 45, {}, { k: 'gd' });
      if (S2.exam.p14 >= 3 && S2.exam.gap >= 5) add('examGap', 'exam', 62, {}, { k: 'exam' });
      if (S2.thx.ever && S2.thx.gap >= 6) add('thxGap', 'thx', 60, {}, { k: 'thx' });
      if (S2.talk.ever && S2.talk.gap >= 6) add('talkGap', 'talk', 58, {}, { k: 'talk' });
      if (sg.reqs.n && sg.reqs.oldest >= 14) add('reqOld', 'thx', 42, {}, { k: 'thx' });
    }
    if (sg.hours.length && S2.read.c7 >= 5 && sg.hoursAvg7 <= 2) add('balance', 'pray', 66, {}, { k: 'pray', key: (sg.hours[0] || {}).key });
    if (sg.hours.length >= 3 && sg.hoursAvg7 >= 5.5) add('prayPraise', 'pray', 39, {}, { k: 'pray', key: (sg.hours[0] || {}).key });
    if (sg.streak >= 3 && [3, 7, 14, 21, 30, 50, 100].indexOf(sg.streak) > -1) add('streak', 'any', 41, { n: ar(sg.streak) }, { k: 'home' });
    out.sort(function (a, b) { return b.pri - a.pri; });
    return out;
  }
  function daysBetweenKeys(a, b) { try { var f = F(); return Math.round((f.parseKey(b) - f.parseKey(a)) / 86400000); } catch (e) { return 99; } }
  /* يحوّل مرشّحًا إلى نص نهائي (ويسجّل الصيغة المستعملة) */
  function render(S, c) { var t = choose(S, c.key, T[c.type], c.tone); return sub(t, c.m || {}); }
  function react(S, type, label) { var t = choose(S, 'react:' + type, REACT[type] || REACT.other, S.tone || 'calm'); return sub(t, { h: label || '' }); }
  function markUsed(S, c, today) { S.cool = S.cool || {}; S.cool[c.key] = today; }
  /* ما يظهر في اللوحة: أهمّ ٣ ملاحظات حاليًا (بغضّ النظر عن «فترة الراحة») */
  function notes(S, sg, opt) { var o = {}; for (var k in (opt || {})) o[k] = opt[k]; o.ignoreCool = true; return candidates(S, sg, o).slice(0, 3); }

  window.__cpInsight = { signals: signals, week: week, candidates: candidates, notes: notes, render: render, react: react, opener: opener, markUsed: markUsed, partOf: partOf, T: T };
})();
