/* v6.11 — برامج ٤٠ يومًا: «٤٠ يومًا مع المزامير» — درب صعود بمحطات، لكل يوم قراءة وتأمل وسؤال ومهمة. كل شيء على جهازك. */
(function(){
"use strict";
var K='rafeeq_prog_v1',AR='٠١٢٣٤٥٦٧٨٩';
function ar(n){return String(n).replace(/\d/g,function(d){return AR[d]})}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function F(){return window.__F||{}}
function q(s,r){return (r||document).querySelector(s)}
function load(){try{var v=JSON.parse(localStorage.getItem(K)||'null');return v&&v.ps?v:{ps:{done:{},notes:{}}}}catch(e){return {ps:{done:{},notes:{}}}}}
function save(s){try{localStorage.setItem(K,JSON.stringify(s))}catch(e){}}
var STAGES=[['عند السفح','الاتكال والأمان','⛺'],['الصعود','التوبة والرجاء','🏔'],['الجبل','الاشتياق والشكر','🔥'],['القمة','التسبيح والثقة','👑']];
/* [العنوان، المزمور، التأمل، السؤال، المهمة] */
var D=[
['طوبى للرجل','المزامير 1:1-6','الحياة المباركة تبدأ باختيار: أين أجلس وفي ماذا أتأمل. اليوم نبدأ الرحلة بقلب يريد جذورًا لا ظلًا.','ما الذي يشدّك بعيدًا عن كلمة الله؟','ابدأ يومك بقراءة هذا المزمور بصوت مسموع.'],
['أضطجع وأنام','المزامير 3:1-8','حتى وسط الضيق يمكن أن نضطجع وننام، لأن الرب هو الذي يعضدنا.','ما الذي يسرق نومك؟','قبل النوم سلّم الرب ثلاثة همومٍ بأسمائها.'],
['في الضيق رحّبت لي','المزامير 4:1-8','الله يتّسع لنا في ضيقنا، وسلامه يسبق تغيّر الظروف.','متى انفرجت عليك ضيقة؟','اكتب موقفًا واحدًا كان الله فيه سندًا لك.'],
['ما هو الإنسان','المزامير 8:1-9','حين نرى عظمة الخليقة نفهم صِغَرنا، ثم نفهم أن الله يذكرنا مع ذلك.','ما الذي يدهشك من عمل يديه؟','اخرج خمس دقائق وتأمل السماء أو نباتًا واحدًا.'],
['فرح حضرته','المزامير 16:1-11','في حضرة الله شبع سرور. الفرح الحقيقي ليس غياب المتاعب بل حضور الله فيها.','أين تبحث عن الفرح بعيدًا عنه؟','امتنع اليوم عن شيء واحد يسرق انتباهك.'],
['السماوات تحدّث','المزامير 19:1-14','الخليقة تحدّثنا بمجد الله، وكلمته تردّ النفس. اجعل صوتهما واحدًا في أذنك.','ما الآية التي كلّمتك مؤخرًا؟','احفظ آية واحدة من هذا المزمور.'],
['الرب راعيّ','المزامير 23:1-6','لا يعوزني شيء لأن الراعي معي، حتى في وادي ظل الموت.','أين تحتاج أن يرعاك؟','ردّد «الرب راعيّ» كلما قلقت اليوم.'],
['علّمني طرقك','المزامير 25:1-11','الإرشاد يُطلب بتواضع ويُعطى للودعاء. لا يلزم أن تعرف الطريق كله، يكفي الخطوة التالية.','أي قرار أمامك يحتاج هدايته؟','اطلب الإرشاد بجملة صادقة قبل قرار اليوم.'],
['نوري وخلاصي','المزامير 27:1-14','الخوف يصغر حين ننظر إلى من نحن في حِماه. انتظر الرب وليتشدد قلبك.','ما الخوف الذي تريد مواجهته؟','اكتب خوفًا واحدًا واقرأ عليه الآية الأولى.'],
['طوبى للمغفور له','المزامير 32:1-11','ما كتمناه أنهكنا، وما اعترفنا به حرّرنا. الاعتراف باب الراحة.','ما الذي تحمله ولم تقله بعد؟','حدّد موعد اعتراف أو اكتب ورقة اعترافك.'],
['ذوقوا وانظروا','المزامير 34:1-10','الإيمان تجربة حسّية: نذوق صلاح الرب فنعرفه. من اتكل عليه لا يعوزه خير.','أين ذقتَ صلاحه مؤخرًا؟','اشكره اليوم على ثلاث خيرات صغيرة بالاسم.'],
['لا تغر من الأشرار','المزامير 37:1-11','المقارنة تسرق السلام. تلذّذ بالرب وهو يعطيك سؤل قلبك.','بمن تقارن نفسك؟','صلِّ بركةً لشخص تغار منه.'],
['انتظرت الرب','المزامير 40:1-10','الانتظار ليس ضياعًا للوقت، فيه يرفعنا من الحفرة ويضع أقدامنا على صخرة.','ما الذي تنتظره منذ مدة؟','اكتب طلبتك وضع لها تاريخ مراجعة بعد شهر.'],
['كما يشتاق الأيل','المزامير 42:1-11','العطش إلى الله نعمة. لا تهرب منه بالإشباع السريع.','متى آخر مرة اشتقتَ إليه؟','اقضِ عشر دقائق في صمت قبل أي شاشة.'],
['الله ملجأنا','المزامير 46:1-11','حين تهتز الجبال يبقى الله ثابتًا. اسكنوا واعلموا أني أنا الله.','ما الذي يهتز في حياتك الآن؟','قل «الله لنا ملجأ وقوة» سبع مرات ببطء.'],
['قلبًا نقيًا','المزامير 51:1-12','التوبة ليست خجلًا بل طلب تجديد: اخلق فيّ قلبًا نقيًا يا الله.','ما الذي تريد أن يتجدد فيك؟','اقرأ صلاة التوبة بصوتك وأنت جالس في هدوء.'],
['حين أخاف','المزامير 56:1-13','الثقة لا تعني غياب الخوف بل ما نفعله به: «حين أخاف أنا عليك أتكل».','هل تثق وأنت خائف؟','اكتب «حين أخاف أتكل عليك» وضعها حيث تراها.'],
['صخرتي وخلاصي','المزامير 62:1-8','النفس تصمت لله وحده لأن منه خلاصها. كل سند آخر ينهار.','على ماذا تستند؟','تخلَّ اليوم عن مصدر أمان زائف.'],
['شوق الصباح','المزامير 63:1-11','رحمتك أفضل من الحياة. من يشتاق إليه يبكّر في طلبه.','كيف تبدأ يومك؟','ابدأ غدًا بتسبيحة قبل أن تمسك الهاتف.'],
['الاقتراب خير','المزامير 73:23-28','أما أنا فالاقتراب إلى الله خير لي. وقد وصلت إلى منتصف الصعود.','ما الذي يقرّبك منه فعلًا؟','افعل شيئًا يقرّبك: زيارة أو خدمة أو قراءة.'],
['ما أحلى مساكنك','المزامير 84:1-12','طوبى للساكنين في بيتك. يوم واحد في أروقتك خير من ألف.','ما الذي تحبه في بيت الله؟','ادخل كنيسة وصلِّ دقائق إن أمكن.'],
['وحّد قلبي','المزامير 86:1-13','القلب المشتت لا يسمع. اطلب قلبًا واحدًا يخاف اسمه.','ما الذي يشتتك؟','اطلب «وحّد قلبي» ثلاث مرات في ثلاث أوقات.'],
['علّمنا إحصاء أيامنا','المزامير 90:1-17','قِصَر العمر ليس تهديدًا بل دعوة لنؤتى قلب حكمة.','لو كان هذا آخر شهر، ماذا كنت تغيّر؟','اكتب ثلاث أولويات للشهر.'],
['تحت جناحيه','المزامير 91:1-16','الساكن في ستر العلي يبيت في ظل القدير. الحماية قريبة جدًّا.','أي حماية تحتاج؟','صلِّ بهذا المزمور لأجل شخص مريض أو مسافر.'],
['اشكروا','المزامير 100:1-5','الشكر دخول إلى الأبواب. هو ليس نتيجة الفرح بل طريقه.','ما الذي تشكر عليه اليوم؟','اشكر شخصًا بمكالمة أو رسالة.'],
['لا تنسَ حسناته','المزامير 103:1-14','نسيان الإحسان يُفقر القلب. بارك يا نفسي الرب ولا تنسي كل حسناته.','ما الحسنة التي نسيتها؟','اكتب خمس حسنات في حياتك.'],
['الذين افتداهم','المزامير 107:1-9','لكل منا قصة إنقاذ. من يحكيها يمنح غيره رجاءً.','أين أنقذك من ضيق؟','احكِ قصة إنقاذ لشخص يحتاج رجاءً.'],
['ماذا أرد؟','المزامير 116:1-12','الامتنان يتحول إلى عطاء. «ماذا أرد للرب من أجل كل حسناته؟»','ماذا تريد أن ترد؟','قدّم عطاءً بسيطًا في الخفاء.'],
['هذا هو اليوم','المزامير 118:19-29','هذا هو اليوم الذي صنعه الرب: نبتهج ونفرح فيه. كل يوم هدية.','كيف تعيش اليوم كهدية؟','ابتسم لأول ثلاثة أشخاص تقابلهم.'],
['سراج لرجلي','المزامير 119:105-112','كلمتك سراج لرجلي ونور لسبيلي. وصلتَ إلى الثلاثين، ما بقي سوى القمة.','أي مجال في حياتك يحتاج نورًا؟','اقرأ صفحة من الإنجيل واكتب ما أضاءه لك.'],
['من أين يأتي عوني','المزامير 121:1-8','أرفع عينيّ إلى الجبال: المعونة ليست من الجبل بل من خالقه.','من أين تنتظر عونك؟','ارفع عينيك إلى السماء وقل هذا المزمور.'],
['الزارعون بدموع','المزامير 126:1-6','ما نزرعه بدموع نحصده بابتهاج. لا شيء يضيع في عين الله.','ما الذي تزرعه بدموع؟','صلِّ لأجل شخص يبكي الآن.'],
['إن لم يبنِ الرب','المزامير 127:1-5','التعب بلا الرب باطل، والنوم مع الرب نعمة.','ما الذي تبنيه بتعب بدون الرب؟','سلّم بيتك أو عملك للرب بصلاة قصيرة.'],
['من الأعماق','المزامير 130:1-8','من الأعماق ندعوه، فتتحوّل الأعماق إلى مكان لقاء.','من أي عمق تصرخ؟','اكتب صرخة وسلّمها له.'],
['نفسي مفطومة','المزامير 131:1-3','الطفل الهادئ على صدر أمه يعلّمنا ألا نطلب العظائم بل الراحة.','ما الذي تحتاج أن تتركه؟','اجلس خمس دقائق بلا طلبات.'],
['ما أطيب الإخوة','المزامير 133:1-3','الوحدة هي حيث تُعطى البركة. لا بركة بدون سلام مع الآخرين.','من تحتاج أن تتصالح معه؟','اتخذ خطوة صغيرة نحو من اختلفت معه.'],
['يا رب قد اختبرتني','المزامير 139:1-12','هو يعرفك ويحيط بك من كل جانب. لا مكان تهرب فيه من محبته.','هل تؤمن أنه يعرفك بالكامل؟','قل له اسمك وكل ما تخجل منه.'],
['علّمني مشيئتك','المزامير 143:1-12','طريق الله لا يُعرف بالمنطق وحده بل بالاستسلام: علّمني أن أعمل رضاك.','ما الذي تستسلم له؟','اطلب إرشادًا في أمر أمامك.'],
['أعظّمك يا إلهي','المزامير 145:1-13','جيل إلى جيل يسبّح أعمالك. حكايتك مع الله ليست لك وحدك.','ما الذي تريد أن تحكيه للأجيال؟','شارك آية أو قصة نعمة مع شخص.'],
['كل نسمة تسبّح','المزامير 150:1-6','كل نسمة فلتسبّح الرب. وصلتَ إلى القمة، والتسبيح هو الطريق بعدها.','كيف ستكمل ما بدأته؟','رتّل مزمورًا كاملًا، وحدّد ما ستداوم عليه.']
];
var MILE={10:'نهاية المرحلة الأولى',20:'منتصف الصعود',30:'قرب القمة',40:'القمة'};
function day(d){return D[d-1]}
function stageOf(d){return STAGES[Math.min(3,Math.floor((d-1)/10))]}
function cur(s){for(var i=1;i<=40;i++)if(!s.ps.done[i])return i;return 41}
function doneCount(s){var n=0;for(var i=1;i<=40;i++)if(s.ps.done[i])n++;return n}
/* ---------- بطاقة الرئيسية ---------- */
window.__progCard=function(){var s=load(),c=cur(s),dn=doneCount(s);
  return '<button type="button" class="pg-home" data-prog="1"><i>🏔</i><span><b>٤٠ يومًا مع المزامير</b><small>'+(dn===0?'ابدأ الرحلة':(c>40?'أتممت الرحلة 🎉':'اليوم '+ar(c)+' من ٤٠'))+'</small></span><em>‹</em></button>'};
/* ---------- الصفحة ---------- */
var H=74,ST=180;
function pos(i,W){var x=W*(.5+.3*Math.sin((i-1)*.85)),y=ST+(40-i)*H+40;return [x,y]}
function render(open){
  var s=load(),c=cur(s),dn=doneCount(s),pct=Math.round(100*dn/40),W=Math.min(window.innerWidth,520),totalH=ST+40*H+120;
  var pts=[];for(var i=1;i<=40;i++)pts.push(pos(i,W));
  var path='M'+pts[0][0].toFixed(1)+' '+pts[0][1].toFixed(1);
  for(var j=1;j<pts.length;j++){var a=pts[j-1],b=pts[j],my=(a[1]+b[1])/2;path+=' C'+a[0].toFixed(1)+' '+my.toFixed(1)+' '+b[0].toFixed(1)+' '+my.toFixed(1)+' '+b[0].toFixed(1)+' '+b[1].toFixed(1)}
  var nodes='',labels='';
  for(var d=1;d<=40;d++){var p=pts[d-1],state=s.ps.done[d]?'done':(d===c?'now':(d<c?'done':'lock')),mil=MILE[d];
    nodes+='<button type="button" class="nd '+state+(mil?' mil':'')+'" style="left:'+p[0].toFixed(1)+'px;top:'+p[1].toFixed(1)+'px" data-pgd="'+d+'" aria-label="اليوم '+d+'"><i>'+(state==='done'?'✓':ar(d))+'</i>'+(state==='now'?'<u></u>':'')+'</button>';
    if(mil||d===1){var st=stageOf(d);labels+='<div class="lb" style="top:'+(p[1]-(mil?64:66))+'px"><span>'+(mil?st[2]+' '+MILE[d]:st[2]+' '+st[0])+'</span></div>'}
    if(d%10===1&&d>1){var st2=stageOf(d);labels+='<div class="sg" style="top:'+(pts[d-1][1]-62)+'px">'+st2[2]+' المرحلة '+ar(Math.floor((d-1)/10)+1)+' — '+st2[1]+'</div>'}}
  var r=34,C=2*Math.PI*r,off=C*(1-pct/100);
  var h='<button type="button" class="pg-x" data-pgclose="1" aria-label="إغلاق">✕</button>'+
   '<header class="pg-hd"><div class="pg-ring"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="'+r+'" class="t"/><circle cx="40" cy="40" r="'+r+'" class="p" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'"/></svg><b>'+ar(pct)+'٪</b></div>'+
   '<div class="pg-tt"><small>برنامج</small><h2>٤٠ يومًا مع المزامير</h2><p>'+(c>40?'أتممت الرحلة كلها 🎉':'اليوم '+ar(c)+' · '+stageOf(c)[0]+' · '+stageOf(c)[1])+'</p></div></header>'+
   '<div class="pg-path" style="height:'+totalH+'px"><svg class="pg-line" viewBox="0 0 '+W+' '+totalH+'" width="'+W+'" height="'+totalH+'" preserveAspectRatio="xMidYMin meet"><path d="'+path+'" class="bg"/><path d="'+path+'" class="fg" pathLength="1" stroke-dasharray="1" stroke-dashoffset="'+(1-Math.min(1,Math.max(0,(Math.min(dn,40))/39))).toFixed(3)+'"/></svg>'+labels+nodes+'<div class="pg-top">👑 القمة</div></div>'+
   (dn>0?'<button type="button" class="pg-rs" data-pgreset="1">إعادة الرحلة من البداية</button>':'');
  var pgEl=document.getElementById('progPage');if(!pgEl){pgEl=document.createElement('div');pgEl.id='progPage';pgEl.setAttribute('role','dialog');pgEl.setAttribute('aria-modal','true');document.body.appendChild(pgEl)}
  var sc=pgEl.scrollTop;pgEl.innerHTML=h;pgEl.className='prg-page on';document.body.classList.add('nh-lock');
  if(open){var tgt=Math.min(c,40),y=pts[tgt-1][1];requestAnimationFrame(function(){pgEl.scrollTop=Math.max(0,y-pgEl.clientHeight*.55)})}else pgEl.scrollTop=sc}
function closePage(){var p=document.getElementById('progPage');if(p)p.classList.remove('on');var d=document.getElementById('progDay');if(d)d.classList.remove('on');if(!document.querySelector('#nhPage.on'))document.body.classList.remove('nh-lock')}
/* ---------- بطاقة اليوم ---------- */
function openDay(d){var s=load(),c=cur(s);if(d>c){var t=F().toast;t&&t('كمّل اليوم '+ar(c)+' الأول');return}
  var it=day(d),b=F().bible,done=!!s.ps.done[d],st=stageOf(d);
  var el=document.getElementById('progDay');if(!el){el=document.createElement('div');el.id='progDay';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');document.body.appendChild(el)}
  function paint(psalm){
    el.innerHTML='<button type="button" class="pg-x" data-pgback="1" aria-label="رجوع">‹ الدرب</button><div class="pd-c"><small>'+st[2]+' اليوم '+ar(d)+' من ٤٠ · '+esc(st[1])+'</small><h2>'+esc(it[0])+'</h2>'+
      '<article class="pd-v">'+psalm+'</article>'+
      '<section class="pd-r"><h4>تأمل</h4><p>'+esc(it[2])+'</p></section>'+
      '<section class="pd-q"><h4>سؤال اليوم</h4><p>'+esc(it[3])+'</p><textarea id="pdNote" rows="3" maxlength="500" placeholder="اكتب إجابتك — تتحفظ على جهازك فقط">'+esc((s.ps.notes||{})[d]||'')+'</textarea></section>'+
      '<section class="pd-t"><i>✦</i><div><h4>مهمة اليوم</h4><p>'+esc(it[4])+'</p></div></section>'+
      '<button type="button" class="pd-ok'+(done?' on':'')+'" data-pgok="'+d+'">'+(done?'✓ أكملت هذا اليوم (اضغط للتراجع)':'أكملت هذا اليوم ✓')+'</button></div>';
    el.className='prg-day on'}
  function psalmHtml(){
    try{var p=b.parseRef(it[1]),txt=b.verses(p.bi,p.ch,p.v1,p.v2),lab=b.label(p.bi,p.ch,p.v1,p.v2),more=txt.length>14;
      return '<p>'+esc(txt.slice(0,6).join(' '))+(txt.length>6?' …':'')+'</p><b>'+esc(lab)+'</b><button type="button" class="pd-open" data-pgopen="'+p.bi+':'+p.ch+':'+(p.v1||1)+'">افتح المزمور كاملًا</button>'}catch(e){return '<b>'+esc(it[1])+'</b>'}}
  if(b&&b.load)b.load().then(function(){paint(psalmHtml())},function(){paint('<b>'+esc(it[1])+'</b>')});else paint('<b>'+esc(it[1])+'</b>')}
function closeDay(){var el=document.getElementById('progDay');if(el)el.classList.remove('on')}
/* ---------- إدخال في قائمة «المزيد» ---------- */
function injectMore(){var box=q('#uSheet .v14-more');if(!box||q('[data-prog="more"]',box))return;
  var h4=document.createElement('h4');h4.textContent='برامج';var b=document.createElement('button');b.type='button';b.setAttribute('data-prog','more');
  var s=load(),c=cur(s);b.innerHTML='٤٠ يومًا مع المزامير<small>'+(doneCount(s)===0?'رحلة صعود بمحطات — قراءة وتأمل ومهمة كل يوم':(c>40?'أتممت الرحلة':'اليوم '+ar(c)+' من ٤٠'))+'</small>';
  var first=box.querySelector('h4');box.insertBefore(h4,first);box.insertBefore(b,first)}
new MutationObserver(function(){if(document.getElementById('uSheet'))injectMore()}).observe(document.body,{childList:true,subtree:true});
function injectHome(){var b=q('#nhHome .nh-body');if(!b||q('.pg-home',b))return;b.insertAdjacentHTML('beforeend',window.__progCard())}
new MutationObserver(function(){injectHome()}).observe(document.body,{childList:true,subtree:true});
/* ---------- الأحداث ---------- */
document.addEventListener('click',function(e){var t=e.target,b;if(!t.closest)return;
  if(b=t.closest('[data-prog]')){e.preventDefault();e.stopPropagation();try{F().closeSheet()}catch(x){};render(true);return}
  if(b=t.closest('[data-pgclose]')){closePage();return}
  if(b=t.closest('[data-pgback]')){closeDay();render(false);return}
  if(b=t.closest('[data-pgd]')){openDay(+b.getAttribute('data-pgd'));return}
  if(b=t.closest('[data-pgopen]')){var a=b.getAttribute('data-pgopen').split(':');closeDay();closePage();try{F().openBible(+a[0],+a[1],+a[2])}catch(x){}return}
  if(b=t.closest('[data-pgok]')){var d=+b.getAttribute('data-pgok'),s=load(),note=(q('#pdNote')||{}).value;s.ps.notes=s.ps.notes||{};if(note!=null)s.ps.notes[d]=note;
    if(s.ps.done[d]){delete s.ps.done[d]}else{s.ps.done[d]=Date.now();var tt=F().toast;if(MILE[d])tt&&tt('🎉 '+MILE[d]+' — أحسنت!');else tt&&tt('✓ اليوم '+ar(d)+' اكتمل')}
    if(!s.ps.start)s.ps.start=Date.now();save(s);closeDay();render(false);var pe=document.getElementById('progPage');if(pe){var nx=Math.min(40,cur(s)),y=pos(nx,Math.min(window.innerWidth,520))[1];pe.scrollTo({top:Math.max(0,y-pe.clientHeight*.55),behavior:'smooth'})}
    try{window.__nh&&window.__nh.paint()}catch(x){};return}
  if(b=t.closest('[data-pgreset]')){if(confirm('هتبدأ الرحلة من اليوم الأول وتتمسح إجاباتك. متأكد؟')){save({ps:{done:{},notes:{}}});render(true)}return}
},true);
document.addEventListener('input',function(e){if(e.target&&e.target.id==='pdNote'){var ok=q('[data-pgok]');if(!ok)return;var d=+ok.getAttribute('data-pgok'),s=load();s.ps.notes=s.ps.notes||{};s.ps.notes[d]=e.target.value;save(s)}});
window.__prog={open:function(){render(true)},day:openDay,close:closePage};
})();
