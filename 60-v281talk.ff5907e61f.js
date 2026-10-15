/* v2.87: + أقوال الآباء (مختارة يدويًا ومرتبطة بالموضوع)، إيموجي اختياري، كتابة تدريجية، أسئلة توضيح، ذاكرة قصيرة للمحادثة، زر «اشرح».
   v2.81 — «صوت الله»: تكتب إحساسك، فيأتيك الرد آياتٍ من الكتاب المقدس (فان دايك) حرفيًا.
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
 {id:'guide',k:['ضايع','محتار','حيرة','قرار','مش عارف اعمل','مش عارف اختار','طريق','توجيه','ارشدني','ارشاد','اختيار'],r:['الأمثال 3:5-6','المزامير 32:8','إشعياء 30:21','المزامير 119:105','يوحنا 14:6*','يعقوب 1:5','إرميا 29:11','المزامير 37:5','المزامير 25:9','يوحنا 8:12*']},
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

function norm(s){ return F.norm(String(s||'')).replace(/ث/g,'ت').replace(/ذ/g,'د').replace(/ظ/g,'ض').replace(/[ؤئ]/g,'ي').replace(/ء/g,'').replace(/\s+/g,' ').trim(); }
function kn(k){ var w=/^_/.test(k), e=/_$/.test(k), c=norm(k.replace(/^_|_$/g,'')); return (w?' ':'')+c+(e?' ':''); }

/* v2.87: مرادفات وتعبيرات عامية إضافية (لكل موضوع) */
var XK={fear:'مرعوب|مرتعب|بخاف|خايفه|خوفي|رجفه|هلع|فوبيا|كابوس|بيخوفني|مخيف|مفزوع|الرعب|خايفين|توجس|وسواس',anx:'مضغوط|ضغوط|متوتر|مشغول بالي|بالي مشغول|مش بتبطل تفكير|مش بيبطل تفكير|اوفر ثينكنج|هموم|شايل هم|مش قادر اتنفس|كتر الحاجات|توتر|متوتره|قلقانين|بتوتر|قلق|قلقت',sad:'عياط|اعيط|موجوع|قلبي وجعني|قلبي موجوع|قلبي مكسور|مجروح|انكسار|كئيب|نفسيتي تعبانه|نفسيتي وحشه|مفيش حاجه بتفرحني|مش بفرح|ضيق صدر|احزان|نفسي اعيط|دموعي|غم|زعلانه|حزينه|مكتئبه',lonely:'غربه|غريب|مفيش حد فاهمني|محدش فاهمني|مفيش حد جنبي|ماحدش جنبي|ماليش سند|الكل سابني|وسط الناس|معزول|منعزل|ماليش صاحب|محدش بيسال عني|مفيش حد يسمعني|مفيش حد اكلمه|مش لاقي حد|ماليش حد',love:'ازاي ربنا يحب|بيحبني|بتحبني|محبتك ليا|بتهتم بيا|ربنا بيهتم|بتحب واحد زيي|محبتك حقيقيه|تحبني فعلا|هل تحبني|يحب واحد زيي',forgive:'يتغفر|مستحيل تتغفر|ربنا يسامحني|ذنوب|معصيه|اخطات|اخطيت|عملت غلطه|غلطه كبيره|خطيئه|خطيئتي|يغفرها|تغفرها|غفران',regret:'بندم|بيانبني|تانيب|الوم نفسي|حاسس بالذنب|مكسوف من نفسي|بتكسف من نفسي|عار|ندمانه|نادمه|ضميري بيانبني',tired:'استنزفت|مستنزف|تعبت|زهقت|احتراق|برن اوت|محتاج راحه|عايز ارتاح|محتاج استراحه|طاقتي خلصت|مفيش طاقه|مش قادر استحمل|ما بقيتش قادر|هلكانه|تعبانين|مرهقين',weak:'مفيش عندي قوه|معنديش قوه|مش لاقي قوه|مفيش قوه|اقاوم|قله حيله|مش قادر اتغير|مش قادر اغير|مكسور|انهزم|هزيمه|ضعيفه|ضعفي',anger:'بغلي|اتعصب|بتعصب|عصبي|عصبيه|انتقم|انتقام|حقد|مش طايق|مش طايقه|نرفزه|انفعل|دمي بيغلي|اتخانق|خناق|بكرهه|كارهه|غضبانه',doubt:'مش قادر اصدق|مش مصدق|شكوك|هل ربنا موجود|وجود ربنا|وجود الله|الحاد|ملحد|ايماني بيهتز|ايماني اهتز|اتشكك|بتشكك|مش حاسس بربنا|ايماني ضعيف',sick:'سرطان|ورم|عمليه|تحاليل|مستشفي|المستشفي|كيماوي|اشعه|مريضه|صحتي|بتوجع|_وجع_|مرضت|دكتور|الاطباء|تشخيص|السكر|المرض|مرض ',need:'ديون|مديون|مصاريف|ايجار|مرتب|مفيش فلوس|مش لاقي شغل|عاطل|بطاله|وظيفه|احتياج|غلاء|قرض|فقر|مفلس|مش معايا فلوس|الدنيا ضيقه|ماليش شغل|مش لاقي رزق|اتفصلت|فصلوني',guide:'حيره|مش عارف اختار|مش عارف اعمل ايه|وجهني|اتجوز مين|اشتغل فين|اختار بين|تايه|مش عارف اتصرف|ايه الصح|محتار|ضايع',joy:'الحمد لله|ممتن|حصلت علي|نجحت|اتخطبت|اتجوزت|ربنا كريم|ربنا اكرمني|اشكر ربنا|امتنان|مبسوطه|فرحانه|شاكره',worth:'مليش قيمه|بكره نفسي|كاره نفسي|مش كفايه|مش مستاهل|مش مستحق|احسن مني|اقل من|مفيش فايده مني|مليش فايده|عبء|حاسس اني حمل|ثقتي في نفسي|مش بحب نفسي|ناقص|فاشله|ولا حاجه',unjust:'اتظلمت|ظلموني|خاني|جرحني|بيتكلموا عليا|اساءوا|اذاني|اتخدعت|نصب|نصبوا عليا|سرقوني|غدر|بيتنمروا|تنمر|ماحدش وقف معايا|اتهموني|اتهمني ظلم|كدبوا عليا',wait:'استنيت|بقالي كتير|بقالي سنين|الحل اتاخر|مش بيستجيب|امتي ربنا|فقدت الصبر|الصبر خلص|صبري خلص|طول الانتظار|متي ربنا|مش بيستجيب',loss:'فقدان|ماتت|توفي|فراق|سابنا|رحيل|رحل|عزاء|فراغ|ابويا مات|امي ماتت|حبيبي مات|افتقد|اتوفت|فقدت|مات ',silent:'ساكت عليا|مش بترد|مش بيرد|مفيش صوت|مفيش اجابه|مفيش رد|تخلي عني|تخليت|اتخلي|مش حاسس بوجودك|مختفي|مستخبي|ليه مش بتسمعني|مش بتسمعني|ربنا سايبني|سايبني',temptation:'بقع في|بكرر نفس|نفس الخطيه|نفس الغلطه|عاده وحشه|شهوتي|شهوه|بيغلبني|بتغلبني|سقطت|سقوط|اتجربت|حرب روحيه|افكار نجسه|نجاسه|اباحي|اباحيه|تدخين|مخدرات|قمار|عاده سريه|بقع تاني|مش قادر ابطل',dry:'فتور|مفيش حماس|مليت|زهقت من الصلاه|مش عايز اصلي|مش عايز اقرا|مش بصلي|قلبي ناشف|جفاف|روتين|صلاتي بلا حياه|صلاه ميكانيكيه|مش حاسس وانا بصلي|مش حاسس بحاجه|مليت من العباده|بارد روحيا',near:'انا محتاجك|محتاجلك|محتاجك يا رب|مشتاق|احس بوجودك|احس بيك|وحشتني صلاتي|وحشتني عشرتك|قرب منك|عطشان لحضورك|نفسي اقرب',hope:'يئست|مفيش حل|مفيش مخرج|مش شايف مخرج|مش شايف حل|هتفشل|هيفشل|كل حاجه فشلت|طريق مسدود|مسدود|مفيش فايده|ماليش فايده|اخرتها ايه|مفيش امل',fresh:'عايز اتغير|ارجع لربنا|ارجع لك|رجعت لربنا|ابتعدت|بعدت عنك|بعدت عن ربنا|عايز اتوب|ناوي ابدا|ابدا بدايه جديده'};
T.forEach(function(t){ (XK[t.id]||'').split('|').forEach(function(k){ if(k&&t.k.indexOf(k)<0) t.k.push(k); }); });
var XK2={fear:'بتخض|اتخض|خضه|ارتجف|بترعب|بتفزع',anx:'مصيبه جايه|حاجه وحشه هتحصل|حاسس بمصيبه|اسوا الاحتمالات|بفكر في اسوا|ضغط شغل|مش بنام من التفكير',sad:'نفسيتي في الارض|الدنيا سودا|سودا في وشي|محدش حاسس بيا|مفيش حد حاسس بيا|مش حاسس بطعم|زهق من الحياه|حزن كبير',lonely:'مبكلمش حد|مبكلم حد|محدش بيكلمني|مش بكلم حد|غريب في بيتي|بقعد لوحدي|قاعد لوحدي|ماليش صحاب',tired:'مش لاقي طاقه|اقوم من السرير|مش قادر اقوم|الحياه تقيله|تقيله عليا|تقل الحياه|مجهد',love:'بيهتم بالتفاصيل|بيهتم بحياتي|فعلا بيهتم|بيشوفني|مش متخيل ان ربنا بيحبني',forgive:'مش قادر انساها|عملت حاجه وحشه|عملت الغلط|عملت حاجه غلط|بخدع الناس|عايز ربنا يسامحني',temptation:'حاجات وحشه|مش عارف ابطل|برجع اقع|ارجع اقع|اقع في نفس|بتفرج علي حاجات',dry:'عاده من غير روح|من غير روح|من غير حياه|سرحان|قلبي بعيد|مبقتش بحس|مش بحس بحاجه|بقرا ولا بحس',sick:'العنايه المركزه|العنايه|غرفه العمليات|حاله صعبه|الحاله صعبه|الم في|ضهري|بيتالم|بتالم|مصاب|حادثه',need:'الاسعار|غليت|اصرف علي|مش مكفي|مكفيش|مفيش دخل|معنديش دخل|الدخل',unjust:'غدر بيا|حكي سري|فضحني|باعني|باعوني|خذلني|بيظلمني|بيحملني فوق طاقتي',wait:'بيأخر|اخر الرد|بدور علي وظيفه|بقالي سنتين|بقالي شهور|متاخر عليا|بيتاخر',silent:'السما مقفوله|السماء مقفوله|مقفوله|بصرخ ليك|بصرخ لك|بصرخ',hope:'استسلمت|مفيش جدوي|لا جدوي|بلا جدوي|خلاص مفيش',worth:'حمل تقيل علي اهلي|حمل علي اهلي|بقارن نفسي|ببقي اقل|اقل منهم|عبء علي',guide:'اقبل العرض|اقبل ولا ارفض|ولا لا$|مش عارف اخدم|اكمل دراسه|اسافر ولا|اغير شغلي|ماعرفش',doubt:'هو ربنا موجود|ربنا موجود فعلا|بسال نفسي|موجود فعلا',fresh:'اصلح علاقتي|علاقتي بربنا|ارجع احسن|من تاني'};
T.forEach(function(t){ (XK2[t.id]||'').split('|').forEach(function(k){ k=k.replace(/\$$/,''); if(k&&t.k.indexOf(k)<0) t.k.push(k); }); });
var XK3={near2:'',fear:'بترعش|ارتعش|الفزع|فزع|شل تفكيري',anx:'مشغول البال|مش قادر اركز|الافكار بتلف|بتلف في دماغي|اعصابي',lonely:'اصحابي بعدوا|بعدوا عني|مفيش حد بيسال|بيسال عليا|لوحدي في',tired:'مش مستحمل|الجري ورا الدنيا|مش لاقي قوه|اكمل اليوم',love:'يحب واحد بيغلط|بيغلط كتير|شايفني ومهتم|مهتم بيا|مهتم بي',forgive:'خطاياي|خطايا|يرفضني',regret:'لاوم نفسي|بتعذب من ضميري|ضميري',temptation:'العاده القديمه|رجعت للعاده|بحارب نفس',dry:'الانجيل بقي مجرد|مجرد كلام|مفيش دفا|دفا في صلاتي',sick:'سخنه|مرض مزمن|مزمن|التحاليل طلعت',need:'اسدد|القسط|اقساط|الفلوس خلصت|محتاج شغل|محتاج وظيفه',unjust:'اتهموني|اخد مجهودي|نسبه لنفسه|سرق مجهودي',wait:'دعيت كتير|مفيش حاجه اتغيرت|اشاره|بقالي زمن',loss:'اشوف امي تاني|نفسي اشوف|وحشني ابويا|اتوفي',silent:'مش بترد|مش سامع|انت بعيد|انك بعيد',hope:'مفيش اي حاجه|الابواب اتقفلت|اتقفلت قدامي|كل الابواب',worth:'بلا قيمه|مش بتقبل نفسي|مش بقبل نفسي',guide:'اي طريق|عايز اعرف ارادتك|ارادتك في',doubt:'ساعات بشك|بشك',fresh:'ابدا حياتي|من الاول'};
T.forEach(function(t){ (XK3[t.id]||'').split('|').forEach(function(k){ if(k&&t.k.indexOf(k)<0) t.k.push(k); }); });
var WEAKK={};'شغل|امتحان|مستقبل|ضغط|علاج|طريق|قرار|فلوس|مادي|اختيار|عمليه|وجع|الم|ملل|عدو|تجربه|بجرب|مرض|دين|غم|حب|فرح|شك|ظلم|رزق|سرقوني|تعب|كاره|كره|عار'.split('|').forEach(function(w){WEAKK[w]=1});
var CTX={family:1,work:1,marriage:1,travel:1,birth:1,friend:1,morning:1,saints:1,eucharist:1,sonship:1,giving:1,bless:1,word:1,prayer:1,presence:1,face:1,know:1,voice:1,light:1,salvation:1,cross:1,resurrection:1,spirit:1,calling:1,wisdom:1,fasting:1,obey:1,will:1,abide:1};
var KN=T.map(function(t){ return t.k.map(kn); });
var CN=CRISIS.map(norm);

/* ---- المطابقة: معانٍ جاهزة (قديمة بالكلمات المفتاحية + جديدة بالتعبيرات) ثم بحث في نص الكتاب ---- */
function M(){ return window.__talkMeaning||null; }
function asTheme(c){ return {id:c.id,n:c.n,r:c.r.split('|')}; }
function classify(text){
  var n=' '+norm(text)+' ', crisis=CN.some(function(c){return n.indexOf(c)>-1}), sc=[], nm=(M()&&M().NAMES)||{};
  T.forEach(function(t,i){ var s=0; KN[i].forEach(function(k){ if(n.indexOf(k)>-1){ var inc=Math.min(4,1+(k.length>5?1:0)+(k.indexOf(' ')>-1?1:0)); if(inc<2&&!WEAKK[k.trim()]) inc=2; s+=inc; } }); if(s) sc.push({t:{id:t.id,n:nm[t.id]||t.id,r:t.r},s:s}); });
  if(M()) M().match(text).forEach(function(m){ sc.push({t:asTheme(m.c),s:m.s}); });
  if(M()&&VOICEASK.test(n)&&!sc.some(function(x){return x.s>=3&&!CTX[x.t.id]})){ var vc=M().C.filter(function(x){return x.id==='voice'})[0]; if(vc) sc.push({t:asTheme(vc),s:4}); }
  /* المعاني السياقية (أسرة/عمل/صلاة…) تأتي بعد الإحساس إن وُجد إحساس */
  if(sc.some(function(x){return !CTX[x.t.id]})) sc.forEach(function(x){ if(CTX[x.t.id]) x.s*=.5; });
  sc.sort(function(a,b){return b.s-a.s});
  return {crisis:crisis, top:sc.length?sc[0].s:0, themes:sc.slice(0,2).map(function(x){return x.t})};
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
      why=cl.top>=2?cl.themes.map(function(t){return t.n}).filter(function(x,i,ar){return ar.indexOf(x)===i}):[];
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
  var fq=0; if(!cl.crisis&&cl.top>=2&&cl.themes.length) fq=fPick(cl.themes.map(function(t){return t.id}),(opts.exclF||[]));
  var seen=seenMap(); refs.forEach(function(x){ seen[x[0]]=(seen[x[0]]||0)+1; }); F.jset(SEEN,seen);
  return {refs:refs, crisis:cl.crisis, why:why, words:words, mode:mode, top:cl.top, fq:fq, themes:cl.themes.map(function(t){return t.id})};
}


/* ---- أقوال الآباء: اختيار يدوي لكل موضوع من كتاب «أقوال الآباء الشيوخ» (أرقام الأقوال كما في بيانات الكتاب). لا ربط بالوسوم الآلية. ---- */
var FQ={fear:[17,140,79,95],anx:[478,294,438,239],sad:[290,400,222],lonely:[95,79,25],tired:[55,222,525,50],weak:[525,55,239],anger:[61,289,446,116],doubt:[204,380,30],sick:[222,239],need:[239],guide:[23,239,1],joy:[84,37,222,472],worth:[],unjust:[446,116,288],wait:[400,387,155,515],silent:[95,79,30,503],near:[30,503,99],dry:[290,424,110,50],temptation:[69,525,501,128,155,386,380,387],love:[243,493,17],loveGod:[17],forgive:[76,128,384,316,494,517,229,2,375,493,285],regret:[384,2,76,229,517],fresh:[25,163,501,515,316],hope:[204,387,493],why:[400,387],forgiveOthers:[375,288,446],envy:[82],prayer:[239,290,50,99],repent:[316,494,229,384],mercy:[76,465,478],help:[239,478,525],faith:[204,30],trust:[294,493],peace:[294],praise:[84,37],giving:[465],confess:[384,386]};
var FSEEN='rafeeq_talk_fseen_v1';
function fPick(themeIds,excl){
  var A=window.__fathers; if(!A||!A.ready) return 0;
  var seen=F.jget(FSEEN,{}), pool=[];
  themeIds.forEach(function(id,ti){ (FQ[id]||[]).forEach(function(i){ if(A.byId[i]&&excl.indexOf(i)<0&&pool.every(function(p){return p.i!==i})) pool.push({i:i,c:seen[i]||0,t:ti,r:Math.random()}); }); });
  if(!pool.length) return 0;
  pool.sort(function(a,b){ return a.c-b.c||a.t-b.t||a.r-b.r; });
  seen[pool[0].i]=(seen[pool[0].i]||0)+1; F.jset(FSEEN,seen); return pool[0].i;
}
var EMO={fear:'🤍',anx:'🌿',sad:'🤍',lonely:'🕊️',tired:'🌙',weak:'🌱',anger:'🌊',sick:'🤍',need:'🍞',unjust:'⚖️',wait:'⏳',loss:'🕯️',silent:'🕊️',temptation:'🛡️',dry:'💧',regret:'🤍',worth:'✨',doubt:'🔍',hope:'🌅',guide:'🧭',joy:'🙏',praise:'🙏',love:'💛',loveGod:'💛',near:'🕊️',fresh:'🌱',forgive:'🕊️',why:'🤍',envy:'🌿'};
function ls2(k,v){ try{ return v===undefined?localStorage.getItem(k):localStorage.setItem(k,v); }catch(e){ return null; } }
function emojiOn(){ return ls2('rafeeq_talk_emoji')!=='0'; }
/* أسئلة التوضيح: عند ضعف الثقة نعرض أقرب أحاسيس ليختار المستخدم، فيصير الرد أدق */
var EPAL=['🙏','✝️','☦️','🕊️','🤍','❤️','💛','🌿','🌱','✨','🌅','🕯️','📖','⛪','😊','🥹','😢','😔','😰','🙌','🤲','🌹','😴','🥰'];
var CLAR=[['fear','خوف','يا رب أنا خايف'],['anx','قلق','يا رب أنا قلقان'],['sad','حزن','يا رب أنا حزين'],['lonely','وحدة','يا رب أنا حاسس إني وحيد'],['tired','تعب','يا رب أنا تعبان'],['forgive','ذنب','يا رب إنت مسامحني؟'],['dry','برود روحي','مش حاسس بحاجة وأنا بصلي'],['hope','يأس','يا رب مفيش أمل'],['temptation','تجربة','بقع في نفس الخطية كل مرة'],['need','احتياج','محتاج فلوس'],['sick','مرض','أنا مريض'],['loss','فقد','فقدت حد غالي'],['unjust','ظلم','اتظلمت'],['guide','حيرة','يا رب أنا محتار']];


/* ---- v2.89: محادثة عادية (تحيات/شكر/وداع/إيموجي) بلا آيات. الآيات تأتي حين تتكلم عن إحساس أو احتياج أو تطلب صوته. ---- */
var GRE={
 morning:{full:['صباح النور يا حبيبي ☀️ يوم جديد وأنا معاك فيه. عامل إيه النهارده؟','صباح الخير والنور يا حبيبي 🌅 نمت كويس؟ احكي لي، حاسس بإيه النهارده؟','صباح النور 🤍 ربنا يبارك يومك. إيه أخبارك؟'],only:['صباح النور يا حبيبي ☀️']},
 evening:{full:['مساء النور يا حبيبي 🌙 يومك كان عامل إيه؟','مساء الخير 🤍 أنا هنا. احكي لي عن يومك.'],only:['مساء النور يا حبيبي 🌙']},
 hello:{full:['أهلًا بيك يا حبيبي 🤍 نورت. عامل إيه؟','أهلًا يا حبيبي! 😊 فرحان إنك جيت. إيه أخبارك؟','سلام ونعمة ليك يا حبيبي 🕊️ ازيك النهارده؟'],only:['أهلًا بيك يا حبيبي 🤍','سلام ونعمة ليك يا حبيبي 🕊️']},
 howru:{full:['أنا كويس يا حبيبي، وفرحان بيك 🤍 وإنت عامل إيه؟ احكي لي.','أنا هنا معاك يا حبيبي 😊 المهم إنت، إيه أخبارك النهارده؟'],only:['أنا كويس يا حبيبي 🤍']},
 miss:{full:['إنت كمان وحشتني يا حبيبي 🤍 كنت مستنيك. احكي لي، عملت إيه الأيام اللي فاتت؟','وإنت كمان وحشتني 🤍 فرحان إنك رجعت. عامل إيه؟'],only:['وإنت كمان وحشتني يا حبيبي 🤍']},
 thanks:{full:['العفو يا حبيبي 🤍 أنا دايمًا معاك.','ولا يهمك يا حبيبي 😊 في أي وقت.'],only:[]},
 goodnight:{full:['تصبح على خير يا حبيبي 🌙 نام في سلام، وأنا معاك.','ليلة هادية يا حبيبي 🤍 سلّم يومك كله ونام مطمن.'],only:[]},
 bye:{full:['في رعاية ربنا يا حبيبي 🤍 ارجع في أي وقت.','مع السلامة يا حبيبي 🕊️ ربنا يحفظك.'],only:[]},
 amen:{full:['آمين يا حبيبي 🙏','آمين 🤍 ربنا يسمع ويستجيب.'],only:[]},
 ok:{full:['ماشي يا حبيبي 🤍 لو في حاجة في قلبك قولها.','تمام 😊 أنا هنا.'],only:[]},
 call:{full:['أيوه يا حبيبي، أنا سامعك 🤍 احكي لي.','قول يا حبيبي، أنا معاك 🤍'],only:[]}
};
var SOCR=[['evening',/(^| )مسا (الخير|النور|الفل)/],['morning',/(^| )(صباح (الخير|النور|الفل|الورد)|صباحو|صباحك)/],['goodnight',/تصبح علي خير|تصبحوا علي خير|ليله (سعيده|هاديه)|هنام|هروح انام|رايح انام/],['bye',/مع السلامه|(^| )باي( |$)|هسيبك|همشي|الي اللقاء|اشوفك بعدين/],['miss',/وحشتني|وحشتيني/],['howru',/عامل ايه|ازيك|اخبارك|ايه الاخبار|انت كويس|عامل ايه انت/],['hello',/^(اهلا|اهلين|مرحبا|هاي|هالو|هلو|السلام عليكم|سلام عليكم|سلام ونعمه|سلام|نورت|يا هلا)( |$)/],['thanks',/^(شكرا|مرسي|ميرسي|متشكر|شكرا ليك|شكرا يا رب|شكرا يارب)( |$)/],['amen',/^(امين)( |$)/],['ok',/^(تمام|ماشي|طيب|اوكي|اوك|حاضر|حلو|جميل)( |$)/]];
var FILL=' يا حبيبي حبيبي رب يارب ربنا يسوع المسيح الله الهي ربي سيدي يا ربي يا الهي انت انتي كمان اوي قوي جدا والله بقي بقا بس ده دي النهارده الحمد لله و ثم يوم الخير النور الفل الورد صباح مسا كده يعني ياريت ';
var FILLS={}; FILL.split(' ').forEach(function(w){ if(w) FILLS[w]=1; });
var EKW={'😢':'حزين','😭':'حزين','😔':'حزين','😞':'حزين','🥹':'حزين','😰':'قلقان','😟':'قلقان','😨':'خايف','😱':'خايف','😩':'تعبان','😫':'تعبان','😴':'تعبان'};
function emoKw(t){ var o=''; Array.from(String(t||'')).forEach(function(c){ if(EKW[c]) o+=' '+EKW[c]; }); return o; }
function stripEmo(t){ return String(t).replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}‍]/gu,'').replace(/\s+/g,' ').trim(); }
function emoReply(t){
  var c=Array.from(String(t)); var has=function(a){ return c.some(function(x){return a.indexOf(x)>-1}) };
  if(has(['😢','😭','😔','😞','🥹','😰','😟'])) return '🤍 أنا سامعك يا حبيبي. قول لي، إيه اللي في قلبك؟';
  if(has(['🙏','🤲','🙌'])) return rnd(['🙏 آمين يا حبيبي.','🤍🙏 ربنا يسمع ويستجيب.']);
  if(has(['❤️','🤍','💛','🥰','🌹'])) return rnd(['🤍 قلبك غالي عندي يا حبيبي.','💛 وإنت كمان غالي. احكي لي عايز تقول إيه؟']);
  if(has(['😊','😄','😁','🙂','😀'])) return rnd(['😊 فرحتني يا حبيبي! إيه اللي فرحك؟','🙂 ضحكتك حلوة. احكي لي إيه الأخبار؟']);
  if(has(['🕊️','🕊','✨','🌅','🌿','🌱','🕯️'])) return rnd(['🕊️ سلام ليك يا حبيبي.','🌿 ربنا يعطيك سلام يملأ يومك.']);
  if(has(['✝️','☦️','⛪','📖'])) return '✝️ النعمة معاك يا حبيبي.';
  return '🤍 وصلتني يا حبيبي. احكي لي بكلمات، أنا سامعك.';
}
function socialOf(text,cl){
  var raw=String(text||''), n=norm(raw).replace(/[^ء-ي\s]/g,' ').replace(/\s+/g,' ').trim();
  if(cl&&cl.crisis) return null;
  if(!n){ return /\S/.test(raw)?{kind:'emoji',reply:emoReply(raw)}:null; }
  var kind=null, m;
  for(var i=0;i<SOCR.length;i++){ if(SOCR[i][1].test(n)){ kind=SOCR[i][0]; break; } }
  var rest=n.split(' ').filter(function(w){ return w&&!FILLS[w]; });
  /* يا رب / يا يسوع وحدها */
  if(!kind&&!rest.length&&n.split(' ').length<=3) return {kind:'call',reply:rnd(GRE.call.full)};
  if(!kind) return null;
  var g=GRE[kind];
  var matchedWords=(SOCR.filter(function(r){return r[0]===kind})[0][1].exec(n)||[''])[0].trim().split(' ');
  var left=rest.filter(function(w){ return matchedWords.indexOf(w)<0; });
  var pure=left.length<=(kind==='howru'?1:0);
  if(pure) return {kind:kind,reply:rnd(g.full)};
  if(g.only&&g.only.length) return {kind:kind,greet:rnd(g.only)};
  return null;
}
var VOICEASK=/اتكلم معاك|اكلمك|اسمع صوتك|اسمع كلمتك|كلمني|عايز كلمه منك|عاوز كلمه منك|قول لي حاجه|اسمعك/;

/* ---- كلام المحادثة (من التطبيق، وليس من الكتاب) ----
   v2.85: صيغة واحدة ثابتة: التطبيق يخاطبك أنت («إنت/عندك/كلامك») ولا يتكلم على لسان الله ولا يدّعي مشاعر،
   وكل جملة مرتبطة بما كتبتَه فعلًا؛ وإن لم يتضح المعنى بثقة يقول ذلك بدل أن يخمّن (حتى لا يضلّل). */
var ACK={
 fear:'واضح إنك خايف، والخوف ده حقيقي عندك ومن حقك تقوله.',
 anx:'واضح إن قلبك مشغول ومتضايق من اللي قدامك.',
 sad:'واضح إنك حزين، ومن حقك تقول ده زي ما هو.',
 lonely:'واضح إنك حاسس بالوحدة، وده إحساس تقيل.',
 tired:'واضح إنك تعبان، وده تعب حقيقي مش بسيط.',
 weak:'واضح إنك حاسس بالضعف وقلة الحيلة.',
 anger:'واضح إن في غضب جواك، وتقدر تقوله بصراحة.',
 sick:'واضح إنك بتمر بوجع أو مرض، وده صعب عليك.',
 need:'واضح إن عندك احتياج بيشغلك دلوقتي.',
 unjust:'واضح إنك حاسس بظلم أو أذى من حد.',
 wait:'واضح إنك مستني وقتك طال عليك.',
 loss:'واضح إنك بتمر بفقد، وده وجع كبير.',
 silent:'واضح إنك حاسس إن ربنا ساكت، وده سؤال بيتعب القلب.',
 temptation:'واضح إنك بتحارب تجربة أو ضعف متكرر.',
 dry:'واضح إنك حاسس ببرود أو جفاف في علاقتك بربنا.',
 regret:'واضح إن ضميرك مثقل بسبب اللي حصل.',
 worth:'واضح إنك شايف نفسك أقل مما أنت، وده بيوجعك.',
 doubt:'واضح إن عندك شك أو حيرة في إيمانك.',
 hope:'واضح إنك حاسس بإحباط أو إن مفيش مخرج.',
 why:'واضح إنك بتسأل «ليه» وسط ألم أو موقف صعب.',
 complain:'واضح إن في شكوى أو زعل جواك، وتقدر تقوله لربنا بصراحة.',
 envy:'واضح إن المقارنة بالناس بتتعبك.',
 help:'واضح إنك محتاج نجدة دلوقتي.',
 sleep:'واضح إن النوم والراحة بعيدين عنك.',
 forgiveOthers:'واضح إن مسامحة حد صعبة عليك دلوقتي.',
 voice:'عايز تسمع صوت ربنا؟ هو بيكلمك في كلمته.',
 presence:'واضح إنك عايز تحس بوجوده جنبك.',
 love:'سؤالك عن محبة ربنا ليك سؤال مهم، وفي الكتاب إجابته.',
 forgive:'واضح إنك بتسأل عن الغفران، وفي الكتاب كلام واضح عنه.',
 near:'واضح إنك مشتاق تقرب أكتر من ربنا.',
 loveGod:'جميل إنك بتعبّر عن محبتك لربنا.',
 joy:'جميل إنك بتشكر وبتفرح.',
 praise:'جميل إنك بتسبّح وتشكر.',
 guide:'واضح إنك محتار وعايز توجيه.',
 fresh:'واضح إنك عايز تبدأ من جديد.'
};
var SAY={
 ack:['وصلتني كلمتك.','قرأت اللي كتبته.'],
 ask:'سؤالك ده مهم، وفي الكتاب كلام عنه.',
 intro:['دي آيات من الكتاب تخص اللي كتبته:','اقرأ الآيات دي، هي من الكتاب وتخص كلامك:'],
 introLow:['دي أقرب آيات لكلامك، لو مش هي اللي تقصده قل لي بكلمات تانية:'],
 introR:['مالقيتش معنى واضح في كلامك، فدورت في الكتاب على أقرب آيات للكلمات اللي كتبتها:'],
 more:['دي آيات تانية قريبة من نفس كلامك:','وده كمان من نفس المعنى:'],
 close:['لو في حاجة تانية في بالك، اكتبها.','تقدر تكمّل وتقول اللي في قلبك.','لو عايز تحكي أكتر، اكتب هنا.'],
 care:['كلامك مهم، وأنا واخده بجدية.'],
 none:['مش واضح لي قصدك بالظبط، ممكن تكتبه بكلمات تانية؟ أو اختار من الاختصارات اللي تحت.'],
 hello:'أهلًا بيك. اكتب اللي حاسس بيه دلوقتي، وهيجيلك رد من آيات الكتاب.'
};
function rnd(a){ return a[Math.floor(Math.random()*a.length)]; }
function saysFor(a,more){
  var id=(a.themes&&a.themes[0])||'', conf=a.top>=2;
  var ack = a.crisis?rnd(SAY.care):((conf&&ACK[id])?ACK[id]:rnd(SAY.ack));
  var intro = more?rnd(SAY.more):(a.mode==='r'?rnd(SAY.introR):(conf?rnd(SAY.intro):rnd(SAY.introLow)));
  if(!more&&emojiOn()&&!a.crisis&&conf&&EMO[id]) ack=ack+' '+EMO[id];
  if(a.ctx&&!more) ack='فاهم إنك بتكمّل على كلامك اللي فات. '+ack;
  return {a:more?'':ack, i:intro, c:rnd(SAY.close)};
}

/* ---- العرض ---- */
function hist(){ var h=F.jget(KEY,[]); return Array.isArray(h)?h:[]; }
function saveHist(h){ F.jset(KEY,h.slice(-MAXH)); }
function bub(t,cls){ return '<div class="tk-say'+(cls?' '+cls:'')+'">'+t+'</div>'; }
function verseCard(r,idx,hi){
  var B=F.bible, p=B.parseRef(r[0]); if(!p) return '';
  var txt=B.verses(p.bi,p.ch,p.v1,p.v2).join(' '), lbl=B.label(p.bi,p.ch,p.v1,p.v2);
  var ervOk=B.ervHas&&p&&B.ervHas(p.bi), ervT='';
  if(ervOk&&B.erv){ var ev=[]; for(var vv=(p.v1||1);vv<=(p.v2||p.v1||B.data[p.bi].c[p.ch-1].length);vv++){ var e1=B.ervVerse(p.bi,p.ch,vv); if(e1) ev.push(e1); } ervT=ev.join(' '); }
  return '<article class="tk-v'+(r[1]?' tk-c':'')+'">'+(r[1]?'<div class="tk-badge">من كلام السيد المسيح</div>':(r[2]?'<div class="tk-badge tk-near">قريبة من كلماتك</div>':''))+
    '<p class="tk-t">'+esc(txt)+'</p>'+(ervT?'<p class="tk-erv" hidden>'+esc(ervT)+'</p>':'')+'<div class="tk-m"><b>'+esc(lbl)+'</b>'+
    '<span class="tk-a">'+(ervOk?'<button type="button" class="tk-ervb" data-tkerv="'+p.bi+'" aria-pressed="false">مبسطة</button>':'')+'<button type="button" data-tkx="'+p.bi+':'+p.ch+':'+(p.v1||1)+':'+(p.v2||p.v1||1)+'">اشرح</button><button type="button" data-tko="'+p.bi+':'+p.ch+':'+(p.v1||'')+'">افتح الإصحاح</button><button type="button" data-tks="'+hi+'_'+idx+'">حفظ</button></span></div></article>';
}
function fatherCard(i){
  var A=window.__fathers, x=A&&A.byId&&A.byId[i]; if(!x) return '';
  return '<article class="tk-v tk-f"><div class="tk-badge tk-fb">من أقوال الآباء</div>'+(x.c?'<div class="tk-fc">'+esc(x.c)+'</div>':'')+'<p class="tk-t">«'+esc(x.t)+'»</p><div class="tk-m"><b>'+esc(x.f)+'</b><span class="tk-fs">'+esc(A.cite(x))+'</span></div></article>';
}
function clarHtml(hi){
  return '<div class="tk-clar" role="group" aria-label="توضيح"><div class="tk-cq">لو مش دي اللي تقصدها، اختار أقرب إحساس لكلامك:</div><div class="tk-cb">'+CLAR.map(function(c){return '<button type="button" data-tkq="'+c[0]+'">'+esc(c[1])+'</button>'}).join('')+'</div></div>';
}
/* خطوات رد واحد، كلٌّ منها فقاعة تظهر بعد «يكتب…» */
function steps(e,hi){
  var out=[], sy=e.say||{};
  if(e.social) return [{h:bub(esc(sy.a)),d:500,tw:sy.a}];
  if(e.greet) out.push({h:bub(esc(e.greet)),d:450,tw:e.greet});
  if(sy.a&&(e.refs.length||e.crisis)) out.push({h:bub(esc(sy.a)),d:600,tw:sy.a});
  if(e.crisis) out.push({h:'<div class="tk-care" role="alert"><b>لا تحمل هذا وحدك.</b> تحدّث الآن مع أب اعترافك أو شخص قريب منك، وإن كنت في خطر فوري فاتصل بالإسعاف على ١٢٣ أو اذهب إلى أقرب طوارئ. وهذه كلمات من الكتاب لك:</div>',d:900});
  else if(e.refs.length){
    var ld=sy.i||'دي آيات من الكتاب تخص اللي كتبته:';
    if(!e.more&&e.why&&e.why.length) ld+=' <small class="tk-why">(المعنى الذي فهمته من كلامك: '+e.why.map(esc).join(' و')+')</small>';
    else if(e.mode==='r'&&e.words&&e.words.length) ld+=' <small class="tk-why">(«'+e.words.slice(0,4).map(esc).join(' ')+'»)</small>';
    out.push({h:bub(ld,'tk-lead'),d:700});
  }
  e.refs.forEach(function(r,i){ var c=verseCard(r,i,hi); if(c) out.push({h:c,d:550}); });
  if(e.fq){ var fcard=fatherCard(e.fq); if(fcard){ out.push({h:bub('ومن أقوال الآباء في نفس المعنى:','tk-lead'),d:650}); out.push({h:fcard,d:600}); } }
  if(!e.refs.length) out.push({h:bub(esc(rnd(SAY.none)),'tk-none'),d:700});
  else out.push({h:bub(esc(sy.c||SAY.close[0])+(e.crisis?'':'<div class="tk-more"><button type="button" data-tkm="'+hi+'">آيات أخرى لنفس المعنى</button></div>'),'tk-close'),d:800});
  if(!e.crisis&&!e.more&&!(e.top>=2)) out.push({h:clarHtml(hi),d:500});
  return out;
}
var PLAY=null, TOKEN=0, FAST=function(){ return !!window.__talkFast||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches); };
function render(){
  var host=$('talkBody'); if(!host) return;
  var B=F.bible;
  if(!B.data){ host.innerHTML='<div class="u-card pad c">جارٍ تجهيز الكتاب المقدس…</div>'; B.load().then(render,function(){ host.innerHTML='<div class="u-card pad c">تعذّر فتح الكتاب المقدس على هذا المتصفح.</div>'; }); return; }
  var h=hist(), html='<h3 class="u-h3">صوت الله</h3><p class="tk-intro">الآيات هنا نصّ حرفي من الكتاب المقدس (فان دايك). أما الكلام الذي بين الآيات فمن التطبيق، وليس من الكتاب. وأحيانًا يأتيك قول من «أقوال الآباء الشيوخ» مع اسم الأب ورقم الصفحة.</p>';
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
  html+='<div class="tk-in"><label for="tkText" class="tk-sr">اكتب ما تشعر به</label><textarea id="tkText" rows="1" maxlength="400" placeholder="'+(h.length?'كمّل، أنا أقرأ…':'يا رب، أنا…')+'"></textarea><button type="button" id="tkEmoBtn" class="tk-emob" aria-label="إيموجي" aria-expanded="false">🙂</button><button type="button" id="tkSend" aria-label="إرسال">إرسال</button><div class="tk-emo" id="tkEmoP" hidden role="group" aria-label="إيموجي">'+EPAL.map(function(x){return '<button type="button" data-tke="'+x+'" aria-label="'+x+'">'+x+'</button>'}).join('')+'</div></div>';
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
    setTimeout(function(){
      if(my!==TOKEN) return; ty.remove();
      if(st.tw&&!fast){
        var b=document.createElement('div'); b.className='tk-say'; box.appendChild(b);
        var ch=Array.from(st.tw), k=0;
        (function tick(){ if(my!==TOKEN) return; k+=2; b.textContent=ch.slice(0,k).join(''); scroll(); if(k<ch.length) setTimeout(tick,24); else { b.remove(); box.insertAdjacentHTML('beforeend',st.h); scroll(); next(); } })();
        return;
      }
      box.insertAdjacentHTML('beforeend',st.h); scroll(); next();
    }, fast?0:st.d);
  }
  next();
}
function send(text,more){
  text=String(text||'').trim(); if(!text) return;
  var B=F.bible; B.load().then(function(){
    var h0=hist(), prev=h0[h0.length-1], ctx=0, src=more?more.src:text+emoKw(text), excl=more?more.excl:[], greet='';
    if(!more){
      var so=socialOf(text,classify(src));
      if(so&&so.reply){ var rp=emojiOn()?so.reply:stripEmo(so.reply); var hh=hist(); hh.push({t:text,social:1,refs:[],themes:[],say:{a:rp},ts:Date.now()}); saveHist(hh); TOKEN++; PLAY={hi:hh.length-1,steps:steps(hh[hh.length-1],hh.length-1)}; render(); var me0=document.querySelectorAll('#tkLog .tk-me'); var l0=me0[me0.length-1]; if(l0) l0.scrollIntoView({block:'center',behavior:'auto'}); return; }
      if(so&&so.greet) greet=emojiOn()?so.greet:stripEmo(so.greet);
    }
    /* ذاكرة قصيرة: رسالة قصيرة بلا معنى واضح بعد رد حديث = تكملة لنفس الموضوع */
    if(!more&&prev&&prev.themes&&prev.themes.length&&!prev.crisis&&(Date.now()-(prev.ts||0))<12*60e3&&text.split(/\s+/).length<=6&&!/^(سلام|مرحبا|اهلا|أهلا|صباح|مساء|هاي)/.test(text)&&classify(text).top===0&&!classify(text).crisis){ src=(prev.src||prev.t)+' '+text; ctx=1; }
    var a=answer(src,{excl:excl,exclF:more?more.exclF:[]}); a.ctx=ctx; var h=hist(), e={t:more?'آيات أخرى':text,src:src,more:!!more,refs:a.refs,crisis:a.crisis,why:a.why,words:a.words,mode:a.mode,themes:a.themes,top:a.top,fq:a.fq,greet:greet,say:saysFor(a,!!more),ts:Date.now()};
    h.push(e); saveHist(h); TOKEN++; PLAY={hi:hist().length-1,steps:steps(e,hist().length-1)}; render();
    var me=document.querySelectorAll('#tkLog .tk-me'); var last=me[me.length-1]; if(last) last.scrollIntoView({block:'center',behavior:'auto'});
  });
}
function init(){ PLAY=null; TOKEN++; render(); }
window.__talkInit=init;
window.__talkTest={classify:classify,answer:answer,themes:T,social:function(t){return socialOf(t,classify(t+emoKw(t)))}};

document.addEventListener('click',function(e){
  var host=$('talkBody'); if(!host||!host.contains(e.target)) return; var t=e.target, el;
  var pnl=$('tkEmoP');
  if((el=t.closest('#tkEmoBtn'))){ if(pnl){ pnl.hidden=!pnl.hidden; el.setAttribute('aria-expanded',pnl.hidden?'false':'true'); } return; }
  if((el=t.closest('[data-tke]'))){ var ta1=$('tkText'); if(ta1){ var s1=ta1.selectionStart==null?ta1.value.length:ta1.selectionStart, e1=ta1.selectionEnd==null?s1:ta1.selectionEnd; ta1.value=ta1.value.slice(0,s1)+el.dataset.tke+ta1.value.slice(e1); try{ta1.setSelectionRange(s1+el.dataset.tke.length,s1+el.dataset.tke.length);}catch(er){} ta1.dispatchEvent(new Event('input',{bubbles:true})); } return; }
  if(pnl&&!pnl.hidden) pnl.hidden=true;
  if((el=t.closest('#tkSend'))){ var ta=$('tkText'); send(ta.value); return; }
  if((el=t.closest('[data-tkm]'))){ var hh=hist(), en=hh[+el.dataset.tkm]; if(!en) return; var ex=[], exF=[]; hh.forEach(function(x){ if((x.src||x.t)===(en.src||en.t)){ x.refs.forEach(function(r){ex.push(r[0])}); if(x.fq) exF.push(x.fq); } }); send('x',{src:en.src||en.t,excl:ex,exclF:exF}); return; }
  if((el=t.closest('[data-tkq]'))){ var cq=CLAR.filter(function(c){return c[0]===el.dataset.tkq})[0]; if(cq) send(cq[2]); return; }
  if((el=t.closest('[data-tkc]'))){ send(CHIPS[+el.dataset.tkc][1]); return; }
  if((el=t.closest('#tkClear'))){ var old=hist(); F.jset(KEY,[]); PLAY=null; TOKEN++; render(); F.toast('بدأت محادثة جديدة',{undo:function(){ F.jset(KEY,old); render(); }}); return; }
  if((el=t.closest('[data-tko]'))){ var p=el.dataset.tko.split(':'); F.openBible(+p[0],+p[1],p[2]?+p[2]:null); return; }
  if((el=t.closest('[data-tkerv]'))){
    var card=el.closest('.tk-v'), pe=card&&card.querySelector('.tk-erv');
    var tog=function(){ var pe2=card.querySelector('.tk-erv'); if(!pe2) return; var show=pe2.hidden; pe2.hidden=!show; el.setAttribute('aria-pressed',show?'true':'false'); el.textContent=show?'إخفاء المبسطة':'مبسطة'; };
    if(pe){ tog(); return; }
    var ms=card.querySelector('.tk-m b').textContent, b0=F.bible;
    b0.loadErv().then(function(){ var pr=b0.parseRef(ms); if(!pr) return; var ev=[]; for(var vv=(pr.v1||1);vv<=(pr.v2||pr.v1||b0.data[pr.bi].c[pr.ch-1].length);vv++){ var e1=b0.ervVerse(pr.bi,pr.ch,vv); if(e1) ev.push(e1); }
      if(!ev.length) return; var p2=document.createElement('p'); p2.className='tk-erv'; p2.hidden=true; p2.textContent=ev.join(' '); card.querySelector('.tk-t').insertAdjacentElement('afterend',p2); tog(); },function(){ F.toast('تعذّر تحميل الترجمة المبسطة'); });
    return; }
  if((el=t.closest('[data-tkx]'))){
    var card2=el.closest('.tk-v'), old=card2&&card2.querySelector('.tk-ex'); if(old){ old.remove(); el.textContent='اشرح'; return; }
    var q=el.dataset.tkx.split(':').map(Number), B2=F.bible, html='';
    try{
      var g=B2.bg&&B2.bg[q[0]], c=g&&g.ch&&g.ch[q[1]-1];
      var gl=B2.glossFor?B2.glossFor(B2.verses(q[0],q[1],q[2],q[3])):[];
      if(gl.length) html+='<div class="tk-exh">معاني الكلمات الصعبة</div><dl class="tk-gl">'+gl.slice(0,6).map(function(e2){return '<dt>'+esc(e2.w)+'</dt><dd>'+esc(e2.m)+'</dd>'}).join('')+'</dl>';
      if(c&&(c.s||c.b)) html+='<div class="tk-exh">عن الإصحاح كله</div>'+(c.s?'<p><b>الخلاصة:</b> '+esc(c.s)+'</p>':'')+(c.b?'<p><b>للفهم:</b> '+esc(c.b)+'</p>':'');
    }catch(er){ html=''; }
    if(!html) html='<p>لا يوجد شرح جاهز لهذه الآية. افتح الإصحاح لتقرأها في سياقها.</p>';
    card2.insertAdjacentHTML('beforeend','<div class="tk-ex">'+html+'<div class="tk-exn">الشرح من مواد التطبيق وليس من الكتاب نفسه.</div></div>'); el.textContent='إخفاء الشرح'; return; }
  if((el=t.closest('[data-tks]'))){ var ij=el.dataset.tks.split('_'), e2=hist()[+ij[0]]; if(!e2) return; var r=e2.refs[+ij[1]], B=F.bible, pr=B.parseRef(r[0]); if(!pr) return;
    F.addVerse({ref:B.label(pr.bi,pr.ch,pr.v1,pr.v2),text:B.verses(pr.bi,pr.ch,pr.v1,pr.v2).join(' ')}); return; }
});
document.addEventListener('keydown',function(e){
  if(e.target&&e.target.id==='tkText'&&e.key==='Enter'&&!e.shiftKey&&!e.isComposing){ e.preventDefault(); send(e.target.value); }
});
document.addEventListener('input',function(e){ var t=e.target; if(t&&t.id==='tkText'){ t.style.height='auto'; t.style.height=Math.min(120,t.scrollHeight)+'px'; } });
})();
