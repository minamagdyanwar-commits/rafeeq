/* v2.81 — «صوت الله»: تكتب إحساسك، فيأتيك الرد آياتٍ من الكتاب المقدس (فان دايك) حرفيًا.
   لا يؤلّف التطبيق أي كلام على لسان الرب: كل ما يظهر نصّ الكتاب كما هو، واللافتات (مثل «من كلام السيد المسيح») تصف مصدر الآية فقط.
   المطابقة محلية بالكامل (كلمات مفتاحية ← موضوعات ← آيات مختارة بعناية)، بلا إنترنت وبلا ذكاء اصطناعي. */
(function(){
'use strict';
var F=window.__F; if(!F) return;
var $=function(id){return document.getElementById(id)}, esc=F.esc, ard=F.ard;
var KEY='rafeeq_talk_v1', SEEN='rafeeq_talk_seen_v1', MAXH=40;

/* ---- الموضوعات: k = كلمات مفتاحية (مُطبَّعة)، r = آيات (النجمة * = من كلام السيد المسيح نفسه) ---- */
var T=[
 {id:'fear',k:['خايف','خائف','خوف','خاف','مرعوب','رعب','فزع','مفزوع','مرتعب','خايفه'],r:['إشعياء 41:10','يوحنا 14:27*','لوقا 12:32*','المزامير 23:4','المزامير 27:1','يشوع 1:9','متى 10:31*','إشعياء 43:1','تيموثاوس الثانية 1:7','التثنية 31:6','المزامير 56:3','رؤيا يوحنا 1:17*','إشعياء 41:13','يوحنا الأولى 4:18']},
 {id:'anx',k:['قلقان','قلق','قلقانه','مضغوط','ضغط','متوتر','توتر','خايف من بكره','مستقبل','امتحان','شغل'],r:['فيلبي 4:6-7','متى 6:34*','يوحنا 14:1*','بطرس الأولى 5:7','المزامير 55:22','متى 6:25*','المزامير 94:19','إشعياء 26:3','متى 11:28*','يوحنا 16:33*']},
 {id:'sad',k:['حزين','حزن','زعلان','زعل','مكتئب','اكتئاب','بعيط','ابكي','بكاء','دموع','مكسور','متضايق','ضايق','مخنوق'],r:['المزامير 34:18','متى 5:4*','المزامير 30:5','رؤيا يوحنا 21:4','المزامير 147:3','يوحنا 16:20*','كورنثوس الثانية 1:3-4','المزامير 56:8','المزامير 126:5','يوحنا 14:18*']},
 {id:'lonely',k:['وحيد','وحدي','لوحدي','وحده','وحدة','مفيش حد','ماليش حد','متروك','مهجور','حد مش معايا'],r:['متى 28:20*','العبرانيين 13:5','المزامير 27:10','إشعياء 49:15-16','يوحنا 14:18*','التثنية 31:8','إشعياء 41:10','المزامير 34:18','إشعياء 43:2','يشوع 1:5']},
 {id:'love',k:['بتحبني','تحبني','يحبني','تحبنى','محبتك لي','انت بتحب','بتحبنى','مش بتحبني','حبك لي','بتهتم'],r:['يوحنا 3:16','رومية 8:38-39','يوحنا 15:9*','رومية 5:8','يوحنا الأولى 4:10','إرميا 31:3','إشعياء 49:15-16','يوحنا الأولى 3:1','المزامير 103:13','صفنيا 3:17','أفسس 2:4-5','يوحنا الأولى 4:16','إشعياء 43:4']},
 {id:'forgive',k:['مسامحني','يسامحني','سامحني','مسامح','غفران','يغفر','اغفر','ذنب','ذنوبي','خطيت','خطيتي','اخطات','غلطت','ارتكبت'],r:['يوحنا الأولى 1:9','المزامير 103:12','يوحنا 8:11*','إشعياء 1:18','لوقا 15:20*','المزامير 103:8-10','إشعياء 43:25','إرميا 31:34','ميخا 7:19','رومية 8:1','المزامير 32:5','لوقا 15:7*','يوحنا 6:37*']},
 {id:'regret',k:['ندمان','ندم','نادم','ضميري','ضمير','مكسوف','اتكسف'],r:['المزامير 51:17','لوقا 15:20*','يوحنا الأولى 1:9','حزقيال 33:11','تيموثاوس الأولى 1:15','لوقا 15:7*','مراثي إرميا 3:22-23','ميخا 7:19','يوحنا 8:11*']},
 {id:'tired',k:['تعبان','تعبانه','تعب','مرهق','مجهد','منهك','مش قادر اكمل','زهقت من','استنزاف','مرهقه','هلكان','اتعبت'],r:['متى 11:28-30*','إشعياء 40:29-31','المزامير 55:22','كورنثوس الثانية 12:9','غلاطية 6:9','المزامير 23:2-3','يوحنا 14:27*','المزامير 121:1-2','المزامير 127:2','يوحنا 16:33*']},
 {id:'weak',k:['ضعيف','ضعف','ضعيفه','عاجز','مش قادر','مش هقدر','مقدرش','مش لاقي قوة','ما اقدر','معنديش قوة'],r:['كورنثوس الثانية 12:9-10','فيلبي 4:13','إشعياء 40:29','يوحنا 15:5*','زكريا 4:6','المزامير 28:7','نحميا 8:10','المزامير 46:1','متى 26:41*']},
 {id:'anger',k:['غضبان','غاضب','غضب','متعصب','متنرفز','عصبي','عصبية','بغلي','مقهور','حاقد','كاره'],r:['أفسس 4:26','يعقوب 1:19-20','الأمثال 15:1','المزامير 37:8','المزامير 4:4','رومية 12:19','كولوسي 3:13','رومية 12:21','متى 5:44*']},
 {id:'doubt',k:['_شاك_','_شك_','شكوك','مش متأكد','مش مصدق','ايماني ضعيف','إيماني ضعيف','ايماني تعبان','مش حاسس بيك','ما حسيتش','مش عارف اصدق'],r:['مرقس 9:24','يوحنا 20:27-29*','متى 14:31*','يعقوب 1:5-6','العبرانيين 11:1','متى 17:20*','لوقا 11:9-10*','المزامير 46:10','إرميا 29:13']},
 {id:'sick',k:['مريض','مرض','وجع','_الم_','الالم','بتوجعني','عملية','سرطان','علاج','تعبان صحيا','وجعاني'],r:['المزامير 103:3','إشعياء 53:5','المزامير 41:3','يعقوب 5:15','كورنثوس الثانية 4:16-17','المزامير 34:19','متى 9:22*','رؤيا يوحنا 21:4','متى 11:28*','يوحنا 14:27*']},
 {id:'need',k:['محتاج','احتياج','فلوس','رزق','مادي','ضايقه مادية','ديون','بطالة','عاطل','مش لاقي شغل','مصاريف'],r:['فيلبي 4:19','متى 6:33*','المزامير 23:1','متى 7:7-8*','لوقا 12:24*','المزامير 37:25','كورنثوس الثانية 9:8','متى 6:8*','المزامير 34:10']},
 {id:'guide',k:['ضايع','محتار','حيرة','قرار','مش عارف اعمل','مش عارف اختار','مش عارف','طريق','توجيه','ارشدني','ارشاد','اختيار'],r:['الأمثال 3:5-6','المزامير 32:8','إشعياء 30:21','المزامير 119:105','يوحنا 14:6*','يعقوب 1:5','إرميا 29:11','المزامير 37:5','المزامير 25:9','يوحنا 8:12*']},
 {id:'joy',k:['شاكر','اشكرك','شكرا','شكر','فرحان','فرح','سعيد','مبسوط','الحمد','حمدا','ممتن'],r:['المزامير 100:4-5','المزامير 107:1','تسالونيكي الأولى 5:16-18','فيلبي 4:4','المزامير 118:24','المزامير 103:2','يوحنا 15:11*','المزامير 16:11','نحميا 8:10','المزامير 136:1']},
 {id:'worth',k:['مش مستاهل','ما استحق','مستحقش','بلا قيمة','مفيش قيمة','فاشل','فشل','عديم القيمة','مش كفاية','مش كويس كفاية','ضعيف الثقة','كره نفسي','بكره نفسي'],r:['المزامير 139:14','إشعياء 43:4','بطرس الأولى 2:9','رومية 8:17','أفسس 2:10','لوقا 12:7*','المزامير 8:4-5','يوحنا 15:16*','إرميا 31:3']},
 {id:'unjust',k:['ظلم','مظلوم','ظلموني','اضطهاد','مضطهد','عدو','اعداء','أعداء','بيكرهوني','ضدي','خانني','خيانة','اتخدعت'],r:['المزامير 37:5-6','رومية 12:19','متى 5:10-12*','المزامير 34:17','بطرس الأولى 3:14','المزامير 56:4','إشعياء 54:17','رومية 12:21','متى 5:44*']},
 {id:'wait',k:['مستني','منتظر','انتظار','متاخر','اتاخر','اتأخر','مفيش استجابة','مش بيرد','مستجابش','صبر','مش بتستجيب'],r:['المزامير 27:14','المزامير 40:1-2','إشعياء 40:31','مراثي إرميا 3:25-26','حبقوق 2:3','العبرانيين 10:36','المزامير 37:7','رومية 8:25','لوقا 11:9-10*']},
 {id:'loss',k:['_مات_','وفاة','موت','فقدت','فقد','توفى','اتوفى','راح مني','فراق','جنازة','عزيز مات','فقدان'],r:['يوحنا 11:25-26*','تسالونيكي الأولى 4:13-14','رؤيا يوحنا 21:4','يوحنا 14:2-3*','المزامير 23:4','فيلبي 1:21','كورنثوس الثانية 5:1','المزامير 116:15','متى 5:4*']},
 {id:'near',k:['محتاجك','اقرب منك','عايز اقرب','عاوز اقرب','اشتاق','اشتياق','عطشان','نفسي اقرب','نفسي احس بيك','وحشتني','وحشتك'],r:['المزامير 42:1-2','المزامير 63:1','يعقوب 4:8','إرميا 29:13','متى 7:7*','المزامير 73:28','رؤيا يوحنا 3:20*','يوحنا 6:35*','المزامير 34:8','يوحنا 7:37-38*']},
 {id:'silent',k:['مش سامعني','مش بتسمعني','ساكت','صمت','مش بترد','مش بيرد عليا','سامعني','بتسمعني','فين انت','فين ربنا','ليه سايبني','سبتني'],r:['المزامير 34:15','إشعياء 65:24','لوقا 11:9-10*','متى 6:8*','إرميا 33:3','المزامير 66:19','المزامير 34:17','يوحنا 14:18*','إشعياء 41:10']},
 {id:'temptation',k:['تجربة','بجرب','تجربه','شهوة','ضعفت','وقعت','بكرر','مدمن','إدمان','ادمان','مش قادر اقاوم','خطية بكررها'],r:['كورنثوس الأولى 10:13','العبرانيين 4:15-16','يعقوب 4:7','يوحنا الأولى 2:1','الأمثال 24:16','متى 26:41*','المزامير 119:9-11','يوحنا 8:11*','رومية 8:1']},
 {id:'dry',k:['جفاف','ناشف','ناشفة','ملل','زهقان','مش بحس','مش حاسس','بارد','فتور','مفيش حماس','مش عايز اصلي','مش بصلي','قلبي قاسي'],r:['المزامير 42:1-5','المزامير 63:1','إرميا 29:13','إشعياء 44:3','يوحنا 7:37-38*','المزامير 143:6','هوشع 6:3','رؤيا يوحنا 3:20*','حزقيال 36:26']},
 {id:'loveGod',k:['بحبك','احبك','أحبك','بحبك يارب','بحبك يا رب','حبي لك'],r:['يوحنا 14:21*','يوحنا الأولى 4:19','المزامير 18:1','المزامير 73:25','يوحنا 15:9*','المزامير 116:1','متى 22:37*']},
 {id:'fresh',k:['ابدأ من جديد','ابقي احسن','انسان احسن','اكون احسن','اتحسن','ابدا من جديد','بداية جديدة','عايز اتغير','عاوز اتغير','اتغير','نفسي اتغير','صفحة جديدة','تجديد'],r:['مراثي إرميا 3:22-23','كورنثوس الثانية 5:17','إشعياء 43:18-19','فيلبي 3:13-14','المزامير 51:10','رؤيا يوحنا 21:5','حزقيال 36:26','ميخا 7:8','لوقا 15:20*']},
 {id:'hope',k:['يأس','ياس','مفيش امل','مفيش أمل','فقدت الامل','فقدت الأمل','مش شايف','اخرتها','ماليش فايدة','مفيش فايدة','مش هيتحل','مفيش حل','محبط','احباط','إحباط'],r:['إرميا 29:11','رومية 15:13','رومية 5:3-5','المزامير 42:5','إشعياء 40:31','مراثي إرميا 3:21-24','المزامير 34:18','رومية 8:28','يوحنا 16:33*']}
];
var CRISIS=['عايز اموت','عاوز اموت','نفسي اموت','انتحر','انتحار','اقتل نفسي','مش عايز اعيش','مش عاوز اعيش','انهي حياتي','اخلص علي نفسي','اخلص من حياتي','اذي نفسي','اؤذي نفسي'];
var CHIPS=[['خايف','يا رب أنا خايف'],['قلقان','يا رب أنا قلقان'],['حزين','يا رب أنا حزين'],['وحيد','يا رب أنا حاسس إني وحيد'],['تعبان','يا رب أنا تعبان'],['إنت بتحبني؟','يا رب إنت بتحبني؟'],['مسامحني؟','يا رب إنت مسامحني؟'],['محتاجك','يا رب أنا محتاجك'],['ضايع','يا رب أنا ضايع ومحتار'],['مش سامعني؟','يا رب إنت سامعني؟'],['شاكر','يا رب أنا شاكر'],['ضعيف','يا رب أنا ضعيف']];

function norm(s){ return F.norm(String(s||'')).replace(/\s+/g,' ').trim(); }
function kn(k){ var w=/^_/.test(k), e=/_$/.test(k), c=norm(k.replace(/^_|_$/g,'')); return (w?' ':'')+c+(e?' ':''); }
var KN=T.map(function(t){ return t.k.map(kn); });
var CN=CRISIS.map(norm);

/* ---- المطابقة: معانٍ جاهزة (قديمة بالكلمات المفتاحية + جديدة بالتعبيرات) ثم بحث في نص الكتاب ---- */
function M(){ return window.__talkMeaning||null; }
function asTheme(c){ return {id:c.id,n:c.n,r:c.r.split('|')}; }
function classify(text){
  var n=' '+norm(text)+' ', crisis=CN.some(function(c){return n.indexOf(c)>-1}), sc=[], nm=(M()&&M().NAMES)||{};
  T.forEach(function(t,i){ var s=0; KN[i].forEach(function(k){ if(n.indexOf(k)>-1) s+=Math.min(4,1+(k.length>5?1:0)+(k.indexOf(' ')>-1?1:0)); }); if(s) sc.push({t:{id:t.id,n:nm[t.id]||t.id,r:t.r},s:s}); });
  if(M()) M().match(text).forEach(function(m){ sc.push({t:asTheme(m.c),s:m.s}); });
  sc.sort(function(a,b){return b.s-a.s});
  return {crisis:crisis, themes:sc.slice(0,2).map(function(x){return x.t})};
}
function seenMap(){ return F.jget(SEEN,{}); }
function pick(theme,n,used){
  var seen=seenMap(), pool=theme.r.map(function(s,i){ var star=/\*$/.test(s); return {raw:s.replace(/\*$/,''),star:star,c:seen[s.replace(/\*$/,'')]||0,rnd:Math.random()}; })
    .filter(function(x){return used.indexOf(x.raw)<0});
  pool.sort(function(a,b){ return a.c-b.c||a.rnd-b.rnd; });
  var out=[];
  /* آية من كلام السيد المسيح أولًا إن وُجدت */
  var s0=pool.filter(function(x){return x.star})[0]; if(s0){ out.push(s0); }
  pool.forEach(function(x){ if(out.length<n&&out.indexOf(x)<0) out.push(x); });
  return out.slice(0,n);
}
function keysOf(refs){ var B=F.bible, k={}; refs.forEach(function(r){ var p=B.parseRef(String(r).replace(/\*$/,'')); if(!p) return; var v1=p.v1||1, v2=p.v2||(B.data[p.bi].c[p.ch-1].length); for(var v=v1;v<=v2;v++) k[p.bi+':'+p.ch+':'+v]=1; }); return k; }
/* opts.excl: مراجع سبق عرضها لنفس الكلام (لزرّ «آيات أخرى») */
function answer(text,opts){
  opts=opts||{}; var cl=classify(text), refs=[], used=(opts.excl||[]).map(function(x){return String(x).replace(/\*$/,'')}), why=[], words=[], mode='c', mm=M();
  if(cl.crisis){ pick(T.filter(function(t){return t.id==='hope'})[0],3,used).forEach(function(x){refs.push([x.raw,x.star?1:0,0])}); mode='crisis'; }
  else {
    var us=mm?mm.userStems(text):{q:{},words:[]}; words=us.words;
    if(cl.themes.length){
      why=cl.themes.map(function(t){return t.n});
      var a=pick(cl.themes[0], cl.themes[1]?2:3, used); a.forEach(function(x){used.push(x.raw);refs.push([x.raw,x.star?1:0,0])});
      if(cl.themes[1]){ pick(cl.themes[1],1,used).forEach(function(x){used.push(x.raw);refs.push([x.raw,x.star?1:0,0])}); }
    }
    /* ما لم يكتمل (لا معنى جاهز، أو نفدت الآيات المختارة): نبحث في نص الكتاب عن أقرب آيات للمعنى */
    if(refs.length<3&&mm){
      var q={}; Object.keys(us.q).forEach(function(s){q[s]=us.q[s]});
      cl.themes.forEach(function(t){ var c=mm.C.filter(function(x){return x.id===t.id})[0]; if(c){ var sg=mm.signature(c); Object.keys(sg).forEach(function(s){ q[s]=Math.max(q[s]||0,sg[s]); }); } });
      var ex=keysOf(used.concat(refs.map(function(r){return r[0]})));
      var B=F.bible;
      mm.retrieve(q,ex,3-refs.length).forEach(function(r){ refs.push([B.label(r.bi,r.ch,r.v,r.v),0,1]); });
      if(!cl.themes.length&&refs.length) mode='r';
    }
  }
  var seen=seenMap(); refs.forEach(function(x){ seen[x[0]]=(seen[x[0]]||0)+1; }); F.jset(SEEN,seen);
  return {refs:refs, crisis:cl.crisis, why:why, words:words, mode:mode, themes:cl.themes.map(function(t){return t.id})};
}

/* ---- كلام المحادثة (من التطبيق، وليس من الكتاب): نبرة دافئة تُبقي الحوار مستمرًا ---- */
var HARD={fear:1,anx:1,sad:1,lonely:1,tired:1,weak:1,anger:1,sick:1,need:1,unjust:1,wait:1,loss:1,silent:1,temptation:1,dry:1,regret:1,worth:1,doubt:1,hope:1,why:1,complain:1,envy:1,help:1,sleep:1,forgiveOthers:1};
var CLOSE_Q={love:1,forgive:1,near:1,know:1,voice:1,presence:1,face:1,abide:1,loveGod:1,sonship:1,friend:1,mercy:1,repent:1,confess:1,faith:1,prayer:1,spirit:1,will:1,calling:1};
var SAY={
 ack:['أنا سامعك يا حبيبي.','قول يا حبيبي، أنا سامعك.','أنا هنا يا حبيبي، وسامع كل كلمة.','ماشي يا حبيبي، أنا معاك.','وصلتني كلمتك يا حبيبي.'],
 hard:['ده شعور تقيل، وأنا حاسس بيك.','مش لوحدك في ده يا حبيبي.','كلامك مهم عندي، وخد راحتك.','ربنا شايف التعب ده كله.'],
 ask:['سؤالك ده قريب من القلب.','حلو إنك بتسأل كده يا حبيبي.','ده من أجمل الأسئلة.','أحلى حاجة إنك بتدور عليه.'],
 joy:['فرحتني يا حبيبي.','حلو أوي الكلام ده.','الله يفرحك دايمًا.'],
 life:['ربنا عارف التفاصيل دي كلها يا حبيبي.','حاجة تهمّك، وبالتالي تهمّه.','ماشي يا حبيبي، خلّينا نقف عند ده.'],
 intro:['وجاي أقول لك من كلمته:','خد يا حبيبي من كلمته:','بص كده إيه في الكتاب عن ده:','جبتلك الآيات دي من كتابه:'],
 introR:['مالقيتش معنى جاهز لكلامك، فدورت في الكتاب كله على أقرب حاجة له:','دورت في الكتاب على أقرب آيات لكلامك:'],
 more:['حاضر يا حبيبي، دول كمان:','عندي كمان من نفس المعنى:','طيب، شوف دول:'],
 close:['ده اللي جه في بالي دلوقتي. في إيه تاني يا حبيبي؟','أنا قاعد معاك، عايز تحكي لي إيه تاني؟','كمّل يا حبيبي، أنا سامعك.','في حاجة تانية في قلبك؟ قولها.','عايز تعرف إيه تاني يا حبيبي؟','وبعد كده؟ احكي لي يا حبيبي، أنا سامعك.'],
 care:['أنا سامعك يا حبيبي، وكلامك مهم عندي جدًا.'],
 none:['مش فاهم قصدك بالظبط يا حبيبي، قوله بكلمات تانية؟ أو اختار من تحت أقرب حاجة لإحساسك.'],
 hello:'أهلًا يا حبيبي، أنا سامعك. احكي لي إنت حاسس بإيه دلوقتي؟'
};
function rnd(a){ return a[Math.floor(Math.random()*a.length)]; }
function saysFor(a,more){
  var id=(a.themes&&a.themes[0])||'', pool=a.crisis?SAY.care:(HARD[id]?SAY.hard:(CLOSE_Q[id]?SAY.ask:(id==='joy'||id==='praise'?SAY.joy:(id?SAY.life:SAY.ack))));
  return {a:more?'':(a.crisis?rnd(SAY.care):rnd(Math.random()<.5?SAY.ack:pool)), i:more?rnd(SAY.more):(a.mode==='r'?rnd(SAY.introR):rnd(SAY.intro)), c:rnd(SAY.close)};
}

/* ---- العرض ---- */
function hist(){ var h=F.jget(KEY,[]); return Array.isArray(h)?h:[]; }
function saveHist(h){ F.jset(KEY,h.slice(-MAXH)); }
function bub(t,cls){ return '<div class="tk-say'+(cls?' '+cls:'')+'">'+t+'</div>'; }
function verseCard(r,idx,hi){
  var B=F.bible, p=B.parseRef(r[0]); if(!p) return '';
  var txt=B.verses(p.bi,p.ch,p.v1,p.v2).join(' '), lbl=B.label(p.bi,p.ch,p.v1,p.v2);
  return '<article class="tk-v'+(r[1]?' tk-c':'')+'">'+(r[1]?'<div class="tk-badge">من كلام السيد المسيح</div>':(r[2]?'<div class="tk-badge tk-near">قريبة من كلماتك</div>':''))+
    '<p class="tk-t">'+esc(txt)+'</p><div class="tk-m"><b>'+esc(lbl)+'</b>'+
    '<span class="tk-a"><button type="button" data-tko="'+p.bi+':'+p.ch+':'+(p.v1||'')+'">افتح الإصحاح</button><button type="button" data-tks="'+hi+'_'+idx+'">حفظ</button></span></div></article>';
}
/* خطوات رد واحد، كلٌّ منها فقاعة تظهر بعد «يكتب…» */
function steps(e,hi){
  var out=[], sy=e.say||{};
  if(sy.a) out.push({h:bub(esc(sy.a)),d:700});
  if(e.crisis) out.push({h:'<div class="tk-care" role="alert"><b>لا تحمل هذا وحدك.</b> تحدّث الآن مع أب اعترافك أو شخص قريب منك، وإن كنت في خطر فوري فاتصل بالإسعاف على ١٢٣ أو اذهب إلى أقرب طوارئ. وهذه كلمات من الكتاب لك:</div>',d:900});
  else if(e.refs.length){
    var ld=sy.i||'وجاي أقول لك من كلمته:';
    if(!e.more&&e.why&&e.why.length) ld+=' <small class="tk-why">(فهمتُ كلامك: '+e.why.map(esc).join(' و')+')</small>';
    else if(e.mode==='r'&&e.words&&e.words.length) ld+=' <small class="tk-why">(«'+e.words.slice(0,4).map(esc).join(' ')+'»)</small>';
    out.push({h:bub(ld,'tk-lead'),d:700});
  }
  e.refs.forEach(function(r,i){ var c=verseCard(r,i,hi); if(c) out.push({h:c,d:550}); });
  if(!e.refs.length) out.push({h:bub(esc(rnd(SAY.none)),'tk-none'),d:700});
  else out.push({h:bub(esc(sy.c||SAY.close[0])+(e.crisis?'':'<div class="tk-more"><button type="button" data-tkm="'+hi+'">آيات أخرى لنفس المعنى</button></div>'),'tk-close'),d:800});
  return out;
}
var PLAY=null, TOKEN=0, FAST=function(){ return !!window.__talkFast||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches); };
function render(){
  var host=$('talkBody'); if(!host) return;
  var B=F.bible;
  if(!B.data){ host.innerHTML='<div class="u-card pad c">جارٍ تجهيز الكتاب المقدس…</div>'; B.load().then(render,function(){ host.innerHTML='<div class="u-card pad c">تعذّر فتح الكتاب المقدس على هذا المتصفح.</div>'; }); return; }
  var h=hist(), html='<h3 class="u-h3">صوت الله</h3><p class="tk-intro">الآيات هنا نصّ حرفي من الكتاب المقدس (فان دايك). أما الكلام الذي بين الآيات فمن التطبيق، وليس من الكتاب.</p>';
  html+='<div class="tk-log" id="tkLog" aria-live="polite">';
  if(!h.length) html+='<div class="tk-re">'+bub(esc(SAY.hello))+'</div>';
  h.forEach(function(e,hi){
    html+='<div class="tk-me">'+esc(e.t)+'</div><div class="tk-re"'+(PLAY&&PLAY.hi===hi?' id="tkPlay"':'')+'>';
    if(!(PLAY&&PLAY.hi===hi)) html+=steps(e,hi).map(function(x){return x.h}).join('');
    html+='</div>';
  });
  html+='</div>';
  if(h.length) html+='<div class="tk-clear"><button type="button" id="tkClear">محادثة جديدة</button></div>';
  html+='<div class="tk-chips" role="group" aria-label="اختصارات">'+CHIPS.map(function(c,i){return '<button type="button" data-tkc="'+i+'">'+esc(c[0])+'</button>'}).join('')+'</div>';
  html+='<div class="tk-in"><label for="tkText" class="tk-sr">اكتب ما تشعر به</label><textarea id="tkText" rows="1" maxlength="400" placeholder="'+(h.length?'كمّل يا حبيبي…':'يا رب، أنا…')+'"></textarea><button type="button" id="tkSend" aria-label="إرسال">إرسال</button></div>';
  host.innerHTML=html;
  if(PLAY) play(PLAY);
}
function play(P){
  var box=$('tkPlay'); if(!box){ PLAY=null; return; }
  var my=++TOKEN, i=0, fast=FAST();
  function scroll(){ var l=box.lastElementChild; if(l&&l.scrollIntoView) l.scrollIntoView({block:'end',behavior:fast?'auto':'smooth'}); }
  function next(){
    if(my!==TOKEN) return;
    if(i>=P.steps.length){ PLAY=null; return; }
    var st=P.steps[i++], ty=document.createElement('div'); ty.className='tk-say tk-typing'; ty.setAttribute('aria-label','يكتب'); ty.innerHTML='<i></i><i></i><i></i>'; box.appendChild(ty); scroll();
    setTimeout(function(){ if(my!==TOKEN) return; ty.remove(); box.insertAdjacentHTML('beforeend',st.h); scroll(); next(); }, fast?0:st.d);
  }
  next();
}
function send(text,more){
  text=String(text||'').trim(); if(!text) return;
  var B=F.bible; B.load().then(function(){
    var src=more?more.src:text, excl=more?more.excl:[];
    var a=answer(src,{excl:excl}), h=hist(), e={t:more?'آيات أخرى':text,src:src,more:!!more,refs:a.refs,crisis:a.crisis,why:a.why,words:a.words,mode:a.mode,themes:a.themes,say:saysFor(a,!!more),ts:Date.now()};
    h.push(e); saveHist(h); TOKEN++; PLAY={hi:hist().length-1,steps:steps(e,hist().length-1)}; render();
    var me=document.querySelectorAll('#tkLog .tk-me'); var last=me[me.length-1]; if(last) last.scrollIntoView({block:'center',behavior:'auto'});
  });
}
function init(){ PLAY=null; TOKEN++; render(); }
window.__talkInit=init;
window.__talkTest={classify:classify,answer:answer,themes:T};

document.addEventListener('click',function(e){
  var host=$('talkBody'); if(!host||!host.contains(e.target)) return; var t=e.target, el;
  if((el=t.closest('#tkSend'))){ var ta=$('tkText'); send(ta.value); return; }
  if((el=t.closest('[data-tkm]'))){ var hh=hist(), en=hh[+el.dataset.tkm]; if(!en) return; var ex=[]; hh.forEach(function(x){ if((x.src||x.t)===(en.src||en.t)) x.refs.forEach(function(r){ex.push(r[0])}); }); send('x',{src:en.src||en.t,excl:ex}); return; }
  if((el=t.closest('[data-tkc]'))){ send(CHIPS[+el.dataset.tkc][1]); return; }
  if((el=t.closest('#tkClear'))){ var old=hist(); F.jset(KEY,[]); PLAY=null; TOKEN++; render(); F.toast('بدأت محادثة جديدة',{undo:function(){ F.jset(KEY,old); render(); }}); return; }
  if((el=t.closest('[data-tko]'))){ var p=el.dataset.tko.split(':'); F.openBible(+p[0],+p[1],p[2]?+p[2]:null); return; }
  if((el=t.closest('[data-tks]'))){ var ij=el.dataset.tks.split('_'), e2=hist()[+ij[0]]; if(!e2) return; var r=e2.refs[+ij[1]], B=F.bible, pr=B.parseRef(r[0]); if(!pr) return;
    F.addVerse({ref:B.label(pr.bi,pr.ch,pr.v1,pr.v2),text:B.verses(pr.bi,pr.ch,pr.v1,pr.v2).join(' ')}); return; }
});
document.addEventListener('keydown',function(e){
  if(e.target&&e.target.id==='tkText'&&e.key==='Enter'&&!e.shiftKey&&!e.isComposing){ e.preventDefault(); send(e.target.value); }
});
document.addEventListener('input',function(e){ var t=e.target; if(t&&t.id==='tkText'){ t.style.height='auto'; t.style.height=Math.min(120,t.scrollHeight)+'px'; } });
})();
