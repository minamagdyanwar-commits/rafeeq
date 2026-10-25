/* v6.8.77 — «رحلتك الخاصة»: يبني التطبيق رحلة من موضوع تختاره وعدد أيام تحدده.
   الآيات من مكتبة مواضيع «صوت الله» (window.__talkThemes) والأسئلة والمهام من قوالب تتدرّج مع مراحل الرحلة.
   الرحلات المحفوظة في rafeeq_prog_custom_v1 وتتسجل في __progData فيتعامل معها محرك الرحلات كأي رحلة. */
(function () {
  'use strict';
  var KEY = 'rafeeq_prog_custom_v1';
  var STAGES = [['نبدأ بالإصغاء', 'اقرأ ببطء', '🌱'], ['نتعمّق', 'نسأل ونتأمل', '🌿'], ['نعيش الكلمة', 'من القراءة إلى العمل', '🔥'], ['نثبت ونشكر', 'نحفظ ما تعلمناه', '🕊']];
  var LESSON = [
    ['اقرأ المقطع بهدوء وكأنه كُتب لك اليوم. لاحظ ما يقوله الله عن «{t}» وكيف يريد أن يكون قلبك أمامه.', 'ابدأ بالإصغاء قبل الكلام: كلمة الله تسبق طلباتنا في موضوع «{t}».', 'لا تستعجل الفهم؛ يكفي اليوم أن تسمع الكلمة. هي تتحدث عن «{t}» بما يناسب حاجتك الآن.'],
    ['هذا المقطع يضيف بعدًا جديدًا لما تتأمل فيه في موضوع «{t}». اسأل: ما الذي كنت أراه خطأ وصححته الكلمة؟', 'الفهم يتعمق بالعودة إلى المقطع أكثر من مرة. ما يخص «{t}» في هذه الآية قد لا يظهر من القراءة الأولى.', 'كلمة الله تقودنا إلى ما هو أبعد من الشعور. اطلب من الروح أن يريك ما في المقطع عن «{t}».'],
    ['حان وقت أن تتحول الكلمة إلى سلوك. ما الذي يطلبه الله منك اليوم في «{t}» بحسب هذا المقطع؟', 'الإيمان الحي يُترجم إلى خطوة. اجعل ما قرأته عن «{t}» قرارًا صغيرًا ملموسًا.', 'لا يكفي أن نعرف: «كونوا عاملين بالكلمة». اختر موقفًا اليوم تطبق فيه ما يقوله المقطع عن «{t}».'],
    ['اشكر الله على ما أعطاك في رحلتك مع «{t}». المقطع اليوم يثبّت ما تعلمته.', 'نختم بالثبات: ارجع إلى ما تعلمته وثبّته. ما قاله الله لك عن «{t}» يستحق أن يبقى معك.', 'الرحلة لا تنتهي بانتهاء الأيام. خذ من هذا المقطع كلمة تحفظها وتعيش بها في «{t}».']
  ];
  var QUESTION = ['ما الكلمة أو العبارة التي استوقفتك في هذا المقطع، ولماذا؟', 'ماذا يخبرك هذا المقطع عن الله؟', 'ما الذي يطلب منك المقطع أن تغيّره أو تتركه أو تبدأه؟', 'لو كان هذا المقطع رسالة من الله لك اليوم، فماذا تقول لك؟', 'أين ترى هذا المعنى في حياتك الآن؟ اذكر موقفًا قريبًا.', 'ما الذي يصعّب عليك أن تعيش هذه الكلمة، وماذا تقول لله عنه؟', 'من يحتاج أن يسمع هذه الكلمة منك؟', 'ما الذي تشكر الله عليه بعد قراءة هذا المقطع؟'];
  var TASK = ['اكتب الآية بخط يدك وضعها في مكان تراه كثيرًا.', 'صلِّ المقطع: حوّل كل جملة إلى طلب أو شكر.', 'اقرأ المقطع بصوت مسموع مرتين ببطء.', 'اختر عبارة واحدة وكررها في قلبك كلما شعرت بالقلق أو الانشغال.', 'أرسل الآية لشخص يحتاج تشجيعًا اليوم.', 'خصص ٥ دقائق صمتًا بعد القراءة ولا تطلب شيئًا.', 'نفّذ خطوة عملية واحدة صغيرة بناءً على المقطع.', 'احفظ آية واحدة من المقطع وراجعها قبل النوم.'];
  function themes() { return window.__talkThemes || []; }
  function load() { var v = RF.jget(KEY, []); return Array.isArray(v) ? v : []; }
  function save(v) { RF.jset(KEY, v); }
  function register(j) {
    window.__progData = window.__progData || {};
    window.__progData[j.id] = j;
  }
  function refsOf(i, n) {
    var T = themes(), seen = {}, out = [], k = 0;
    while (out.length < n && k < T.length) {
      var th = T[(i + k) % T.length];
      String(th.r).split('|').forEach(function (r) {
        r = r.replace(/\*/g, '').trim();
        if (r && !seen[r] && out.length < n) { seen[r] = 1; out.push(r); }
      });
      k++;
    }
    return out;
  }
  function build(ti, n, custom) {
    var T = themes(), th = T[ti]; if (!th) return null;
    var refs = refsOf(ti, n), id = 'my_' + Date.now().toString(36), name = th.n;
    n = refs.length;
    var days = refs.map(function (r, i) {
      var st = Math.min(3, Math.floor(i * 4 / n)), L = LESSON[st][i % 3].replace(/\{t\}/g, name);
      return [r, r, '', '', L, QUESTION[(i * 3 + ti) % QUESTION.length], TASK[(i * 5 + ti) % TASK.length]];
    });
    return { id: id, title: (custom && custom.trim()) || ('رحلة ' + RF.ar(n) + ' أيام في ' + name), short: name, icon: '✨', sub: 'رحلة بنيتها بنفسك', cat: 'custom', labels: ['', '', 'ما يكلّمك به المقطع'], stages: STAGES, days: days, topic: th.id, created: Date.now() };
  }
  load().forEach(register);

  function box() { return document.getElementById('progPage'); }
  function close() { var m = document.getElementById('pgMake'); if (m && m.parentNode) m.parentNode.removeChild(m); }
  function openMake() {
    var host = box(); if (!host || !themes().length) return;
    close();
    var m = document.createElement('div'); m.id = 'pgMake'; m.className = 'pg-make-sheet';
    var opts = themes().map(function (t, i) { return '<option value="' + i + '">' + RF.esc(t.n) + '</option>'; }).join('');
    var mine = load().map(function (j) { return '<div class="pgm-row"><span>' + RF.esc(j.title) + '</span><button type="button" data-pgmdel="' + RF.esc(j.id) + '" aria-label="حذف">✕</button></div>'; }).join('');
    m.innerHTML = '<div class="pgm-c"><button type="button" class="pg-x" data-pgmclose="1" aria-label="إغلاق">✕</button><h3>✨ رحلتك الخاصة</h3>' +
      '<label>الموضوع<select id="pgmT">' + opts + '</select></label>' +
      '<div class="pgm-d" id="pgmD">' + [5, 7, 10, 14, 21].map(function (d) { return '<button type="button" data-pgmd="' + d + '" class="' + (d === 7 ? 'on' : '') + '">' + RF.ar(d) + ' أيام</button>'; }).join('') + '</div>' +
      '<label>اسم الرحلة (اختياري)<input id="pgmN" maxlength="40" placeholder="مثلًا: أسبوع مع السلام"></label>' +
      '<button type="button" class="pgm-go" data-pgmgo="1">ابدأ الرحلة</button>' +
      (mine ? '<h4>رحلاتي الخاصة</h4>' + mine : '') + '</div>';
    host.appendChild(m);
  }
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return; var b;
    if ((b = t.closest('[data-pgmake]'))) { e.preventDefault(); e.stopPropagation(); openMake(); return; }
    if (!document.getElementById('pgMake')) return;
    if (t.closest('[data-pgmclose]')) { close(); return; }
    if ((b = t.closest('[data-pgmd]'))) { [].forEach.call(document.querySelectorAll('#pgmD button'), function (x) { x.classList.toggle('on', x === b); }); return; }
    if ((b = t.closest('[data-pgmdel]'))) {
      if (!confirm('تحذف هذه الرحلة وتقدّمها؟')) return;
      var id = b.getAttribute('data-pgmdel'); save(load().filter(function (j) { return j.id !== id; })); delete window.__progData[id];
      var P = RF.jget('rafeeq_prog_v1', {}); if (P[id]) { delete P[id]; RF.jset('rafeeq_prog_v1', P); }
      openMake(); if (window.__prog) window.__prog.hub('all'); setTimeout(openMake, 0); return;
    }
    if (t.closest('[data-pgmgo]')) {
      var on = document.querySelector('#pgmD button.on'), n = on ? +on.getAttribute('data-pgmd') : 7,
        j = build(+document.getElementById('pgmT').value, n, document.getElementById('pgmN').value);
      if (!j) return;
      var all = load(); all.push(j); save(all); register(j); close();
      if (window.__prog) window.__prog.open(j.id);
    }
  }, true);
  window.__progMake = { build: build, load: load, open: openMake };
})();
