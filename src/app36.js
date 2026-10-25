/* v6.9 — أربعة تصاميم بفكرة وصفحات مختلفة: الكفن (الدرب) · قدس الأقداس (غرفة الصلاة) · سراج الكلمة (المكتبة) · الملك المتوّج (إكليلي) */
(function(){
"use strict";
var DS={shroud:'الكفن',holy:'قدس الأقداس',lamp:'سراج الكلمة',royal:'الملك المتوّج',bearer:'حامل الصليب',crown:'الإكليل',glory:'المجد'};
var ALLH=['bakr','thalitha','sadisa','tasi3a','ghouroub','noum','nos_layl_1','nos_layl_2','nos_layl_3','setar'],DEFH=['bakr','thalitha','sadisa','tasi3a','ghouroub','noum'];
function migHours(){var f=F();if(!f.setHourGroups||!f.groupOf)return;var raw=null;try{raw=localStorage.getItem('rafeeq_nh_hours')}catch(e){}if(raw===null)return;try{var ks=JSON.parse(raw),g=[];(Array.isArray(ks)?ks:[]).forEach(function(k){var x=f.groupOf(k);x&&g.indexOf(x.id)<0&&g.push(x.id)});if(g.length>=2)f.setHourGroups(g)}catch(e){}try{localStorage.removeItem('rafeeq_nh_hours')}catch(e){}}
function hoursList(){migHours();var f=F(),v=null;try{v=f.hourKeys&&f.hourKeys()}catch(e){}return v&&v.length>=2?v:DEFH}
function editBtn(){return '<button type="button" class="nh-edit" data-nhedit="1">⚙ تعديل الساعات المعروضة</button>'}
function editHours(){var k=K(),f=F(),G=f.GROUPS||[],cur=(f.prefs&&f.prefs().rule)||[];
  var rows=G.map(function(g){return '<label class="nh-ck"><input type="checkbox" value="'+g.id+'"'+(cur.indexOf(g.id)>=0?' checked':'')+'><span>'+esc(g.label)+'</span><small>'+esc((k.HOUR_TIME||{})[g.keys[0]]||'')+'</small></label>'}).join('');
  f.sheet('<h3 class="u-h3">الساعات المعروضة في الرئيسية</h3><p class="u-sub">اختر الصلوات اللي تظهر في الرئيسية وفي «يومي» (٢ على الأقل). نفس الاختيار في إعدادات المتابعة.</p><div id="nhHrs">'+rows+'</div><div class="row-gap"><button type="button" class="u-btn on" id="nhHrsSave">حفظ</button><button type="button" class="u-btn" id="nhHrsReset">الافتراضي</button></div>');
  var sv=document.getElementById('nhHrsSave'),rs=document.getElementById('nhHrsReset');
  function done(){f.closeSheet();lastBody='';lastPk='';paint()}
  if(sv)sv.onclick=function(){var v=[].slice.call(document.querySelectorAll('#nhHrs input:checked')).map(function(i){return i.value});if(v.length<2){f.toast&&f.toast('اختر ساعتين على الأقل');return}f.setHourGroups(v);done()};
  if(rs)rs.onclick=function(){f.setHourGroups(['bakr','thalitha','sadisa','tasi3a','ghouroub','noum']);done()}}
var AR='٠١٢٣٤٥٦٧٨٩';
function ar(n){return RF.ar(n)}
function esc(s){return RF.esc(s)}
function q(s,r){return (r||document).querySelector(s)}
function des(){var t=(document.documentElement.getAttribute('data-rf-theme')||'').split('/')[0];return DS[t]?t:''}
function key(d){var m=d.getMonth()+1,x=d.getDate();return d.getFullYear()+'-'+(m<10?'0':'')+m+'-'+(x<10?'0':'')+x}
function F(){return window.__F||{}}
function K(){return window.__k||{}}
function info(){
  var f=F(),k=K(),i={items:[],hours:[],sug:'bakr',score:0,streak:0,verse:'',vref:'',wd:'',dt:'',hij:''};
  var today0=f.realKey?f.realKey():key(new Date());try{i.items=(f.dayPlan?f.dayPlan(today0).items:f.todayItems(today0))||[]}catch(e){}
  try{i.sug=k.getSuggestedHourKey?k.getSuggestedHourKey():'bakr'}catch(e){}
  var today=f.realKey?f.realKey():key(new Date());
  hoursList().forEach(function(h){var H=(k.HOURS||{})[h]||{},done=false;try{done=!!f.hourDone(today,h)}catch(e){}
    i.hours.push({k:h,label:(H.label||h).replace(/^صلاة\s*/,'').split(' — ')[0],time:(k.HOUR_TIME||{})[h]||'',done:done})});
  try{i.score=f.dayScore(today)||0}catch(e){}
  try{i.streak=f.streak()||0}catch(e){}
  var v=q('.hm-verse p'),vs=q('.hm-verse small'),dd=q('.hm-date b'),ds=q('.hm-date span');
  i.verse=v?v.textContent.trim():'';i.vref=vs?vs.textContent.trim():'';i.wd=dd?dd.textContent.trim():'';i.dt=ds?ds.textContent.trim():'';
  i.done=i.items.filter(function(x){return x.done}).length;i.total=i.items.length||1;
  i.pct=Math.round(100*i.done/i.total);i.today=today;
  return i}
function act(it){ if(it.type==='hour')return 'data-act="hour" data-key="'+esc(it.gid)+'"'; if(it.type==='read')return 'data-act="read"'; if(it.type==='med')return 'data-act="meditation"'; if(it.type==='exam')return 'data-act="exam"'; if(it.type==='prog')return 'data-prog="cur"'; if(it.type==='memo')return 'data-act="memo"'; if(it.type==='gd')return 'data-act="guided"'; return 'data-act="agpeya"'}
function rowsItems(i,cls){return i.items.map(function(it){return '<button type="button" class="'+cls+(it.done?' on':'')+'" '+act(it)+'><i></i><span>'+esc(it.label)+'</span></button>'}).join('')}
/* ---------------- محتوى الورقة (يطلع بسحبة لفوق) لكل تصميم ---------------- */
var TAG={bearer:'من أراد أن يتبعني فليحمل صليبه',crown:'اثبت إلى الموت فسأعطيك إكليل الحياة',glory:'قومي استنيري فقد جاء نورك',shroud:'اقترب من الصليب خطوة اليوم',holy:'قدس الأقداس — اجلس في حضرته',lamp:'سراجٌ لرجلي كلامك',royal:'إكليل الحياة لمن يغلب'};
var WL=['ح','ن','ث','ر','خ','ج','س'];
function nextHour(i){return i.hours.filter(function(h){return h.k===i.sug})[0]||i.hours[0]}
function bodyShroud(i){
  var rail=i.hours.map(function(h,n){var c=h.done?' done':(h.k===i.sug?' now':'');
    return '<li class="st'+c+'"><button type="button" data-act="hour" data-key="'+h.k+'"><i class="nd">'+(h.done?'✓':ar(n+1))+'</i><span class="tx"><b>'+esc(h.label)+'</b><small>'+esc(h.time)+'</small></span><em>'+(h.done?'تمّت':(h.k===i.sug?'الآن':''))+'</em></button></li>'}).join('');
  return '<section class="nh-rail"><h2>درب اليوم</h2><ol>'+rail+'</ol><button type="button" class="nh-more" data-nh="week">شريط الأسبوع ‹</button>'+editBtn()+'</section>'+
  '<section class="nh-linen"><div>'+rowsItems(i,'nh-chk')+'</div></section>'+
  '<section class="nh-linen nh-vs"><small>كلمة اليوم</small><p>'+esc(i.verse)+'</p><em>'+esc(i.vref)+'</em></section>'}
function bodyHoly(i){
  var cur=nextHour(i),r=46,c=2*Math.PI*r,off=c*(1-i.pct/100);
  var chips=i.hours.map(function(h){return '<button type="button" class="hy-chip'+(h.done?' done':'')+(h.k===cur.k?' now':'')+'" data-act="hour" data-key="'+h.k+'">'+esc(h.label)+'</button>'}).join('');
  return '<section class="hy-core"><button type="button" class="hy-orb" data-act="hour" data-key="'+cur.k+'" aria-label="ابدأ صلاة '+esc(cur.label)+'"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="'+r+'" class="trk"/><circle cx="50" cy="50" r="'+r+'" class="prg" stroke-dasharray="'+c.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'"/></svg><span class="cx">✝</span></button>'+
  '<small class="hy-k">الآن</small><h1>صلاة '+esc(cur.label)+'</h1><p>'+esc(cur.time)+'</p><button type="button" class="hy-go" data-nh="room">ادخل غرفة الصلاة</button></section>'+
  '<div class="hy-hours">'+chips+'</div>'+editBtn()+'<section class="hy-verse"><p>«'+esc(i.verse)+'»</p><small>'+esc(i.vref)+'</small></section>'}
function bodyLamp(i){
  var flame=Math.max(.35,i.pct/100);
  return '<section class="lp-book"><div class="lp-pg lp-l"><small>كلمة اليوم</small><p>'+esc(i.verse)+'</p><em>'+esc(i.vref)+'</em></div><div class="lp-pg lp-r"><small>اليوم</small>'+rowsItems(i,'lp-row')+'</div></section>'+
  '<section class="lp-lamp"><div class="fl" style="--f:'+flame+'"></div><span>'+ar(i.done)+' من '+ar(i.total)+' — شعلة سراجك</span></section>'+
  '<section class="lp-tabs"><button type="button" data-act="read"><b>قراءات</b><small>اليوم</small></button><button type="button" data-act="meditation"><b>تأمل</b><small>خلوة</small></button><button type="button" data-act="fat"><b>الآباء</b><small>قول اليوم</small></button><button type="button" data-nh="shelf"><b>المكتبة</b><small>سراجي</small></button></section>'+editBtn()}
function bodyRoyal(i){
  var r=70,c=2*Math.PI*r,off=c*(1-i.pct/100),w=weekDays(),jw=w.map(function(x,n){var on=x.s>0;return '<span class="dy'+(on?' on':'')+(n===6?' td':'')+'"><i>'+(on?'✓':'')+'</i><small>'+WL[x.dow]+'</small></span>'}).join('');
  return '<section class="ry-crown"><div class="rays"></div><svg viewBox="0 0 160 160"><circle cx="80" cy="80" r="'+r+'" class="trk"/><circle cx="80" cy="80" r="'+r+'" class="prg" stroke-dasharray="'+c.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'"/></svg><div class="mid"><b dir="ltr">'+ar(i.pct)+'%</b><small>إكليل اليوم</small></div></section>'+
  '<section class="ry-str"><div class="sn"><b>'+ar(i.streak)+'</b><span>يوم متتالٍ</span></div><button type="button" data-nh="crown">إكليلي ‹</button><div class="jw">'+jw+'</div></section>'+
  '<section class="ry-list">'+rowsItems(i,'ry-row')+'</section><section class="ry-verse"><p>'+esc(i.verse)+'</p><small>'+esc(i.vref)+'</small></section>'+editBtn()}
/* ---- حامل الصليب: الخطوة التالية + مربعات الساعات + أحمال اليوم ---- */
function bodyBearer(i){
  var nx=nextHour(i),tiles=i.hours.map(function(h,n){return '<button type="button" class="tl'+(h.done?' done':(h.k===i.sug?' now':''))+'" data-act="hour" data-key="'+h.k+'"><b>'+ar(n+1)+'</b><span>'+esc(h.label)+'</span><small>'+(h.done?'✓ تمّت':esc(h.time))+'</small></button>'}).join('');
  return '<section class="br-next"><div><small>الخطوة التالية</small><b>صلاة '+esc(nx.label)+'</b><span>'+esc(nx.time)+'</span></div><button type="button" data-act="hour" data-key="'+nx.k+'">ابدأ</button></section>'+
  '<section class="br-grid">'+tiles+'</section><section class="br-loads"><h2>أحمال اليوم</h2>'+rowsItems(i,'br-row')+'</section>'+
  '<section class="br-verse"><p>'+esc(i.verse)+'</p><small>'+esc(i.vref)+'</small></section><button type="button" class="br-more" data-nh="steps">طريق الأسبوع ‹</button>'+editBtn()}
/* ---- الإكليل: إكليل الأيام الثلاثين ---- */
function monthBeads(){var f=F(),d=new Date(),out=[];for(var n=29;n>=0;n--){var x=new Date(d.getFullYear(),d.getMonth(),d.getDate()-n),s=0;try{s=f.dayScore(key(x))||0}catch(e){}out.push(s>0)}return out}
function wreathSvg(size,rr,beads,r0){var c=size/2,h='<svg viewBox="0 0 '+size+' '+size+'" aria-hidden="true">';beads.forEach(function(on,n){var a=-Math.PI/2+n*2*Math.PI/beads.length;h+='<circle cx="'+(c+rr*Math.cos(a)).toFixed(1)+'" cy="'+(c+rr*Math.sin(a)).toFixed(1)+'" r="'+(n===beads.length-1?r0*1.35:r0)+'" class="bd'+(on?' on':'')+(n===beads.length-1?' td':'')+'"/>'});return h+'</svg>'}
function bodyCrown(i){
  var beads=monthBeads(),chips=i.hours.map(function(h){return '<button type="button" class="cr-chip'+(h.done?' done':'')+(h.k===i.sug?' now':'')+'" data-act="hour" data-key="'+h.k+'">'+esc(h.label)+'</button>'}).join('');
  return '<section class="cr-wreath">'+wreathSvg(220,88,beads,7)+'<div class="mid"><b dir="ltr">'+ar(i.pct)+'%</b><small>اليوم</small><em>'+ar(i.streak)+' يوم متتالٍ</em></div></section>'+
  '<div class="cr-chips">'+chips+'</div><section class="cr-list">'+rowsItems(i,'cr-row')+'</section>'+
  '<section class="cr-verse"><p>'+esc(i.verse)+'</p><small>'+esc(i.vref)+'</small></section><button type="button" class="cr-more" data-nh="wreath">إكليل الشهر ‹</button>'+editBtn()}
/* ---- المجد: مسار الشمس ---- */
function bodyGlory(i){
  var N=i.hours.length,idx=Math.max(0,i.hours.map(function(h){return h.k}).indexOf(i.sug)),pts=i.hours.map(function(h,n){var a=Math.PI*n/(N-1),x=50+42*Math.cos(a),y=8+84*Math.sin(a);
    return '<button type="button" class="sp'+(h.done?' done':(n===idx?' now':''))+'" style="left:'+x.toFixed(1)+'%;bottom:'+y.toFixed(1)+'%" data-act="hour" data-key="'+h.k+'"><i>'+(h.done?'✓':ar(n+1))+'</i><span>'+esc(h.label)+'</span></button>'}).join('');
  return '<section class="gl-arc'+(N>7?' dense':'')+'"><div class="ground"></div>'+pts+'<div class="gl-mid"><b dir="ltr">'+ar(i.pct)+'%</b><small>مجد اليوم</small></div></section>'+
  '<section class="gl-pills">'+rowsItems(i,'gl-row')+'</section><section class="gl-verse"><p>'+esc(i.verse)+'</p><small>'+esc(i.vref)+'</small></section><button type="button" class="gl-more" data-nh="sun">أشعة الأسبوع ‹</button>'+editBtn()}
var BODY={bearer:bodyBearer,crown:bodyCrown,glory:bodyGlory,shroud:bodyShroud,holy:bodyHoly,lamp:bodyLamp,royal:bodyRoyal};
/* ---------------- الصفحات الجديدة ---------------- */
function weekDays(){var f=F(),out=[],d=new Date(),W=['أحد','اثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'];
  for(var n=6;n>=0;n--){var x=new Date(d.getFullYear(),d.getMonth(),d.getDate()-n),s=0;try{s=f.dayScore(key(x))||0}catch(e){}out.push({w:W[x.getDay()],dow:x.getDay(),d:x.getDate(),s:s})}
  return out}
function pageWeek(i){var w=weekDays();
  return '<h2>شريط الأسبوع</h2><p class="pg-sub">كل يوم طيّة في كفن الأسبوع — كلما أكملت زادت امتلاءً</p><div class="wk">'+w.map(function(x){var p=Math.min(100,Math.round(x.s*(x.s<=1?100:1)));return '<div class="fold"><i style="--p:'+p+'%"></i><b>'+ar(x.d)+'</b><small>'+x.w+'</small></div>'}).join('')+'</div>'+
  '<div class="pg-card"><small>اليوم</small><b>'+ar(i.done)+' من '+ar(i.total)+'</b></div><div class="pg-card"><small>أيام متتالية</small><b>'+ar(i.streak)+'</b></div>'}
function pageRoom(i){
  var h=i.hours.filter(function(x){return x.k===i.sug})[0]||i.hours[0];
  return '<div class="rm"><div class="halo"></div><small>غرفة الصلاة</small><h1>صلاة '+esc(h.label)+'</h1><p>'+esc(h.time)+'</p><button type="button" class="rm-go" data-act="hour" data-key="'+h.k+'" data-nhclose="1">ابدأ الصلاة</button>'+
  '<div class="rm-list">'+i.hours.map(function(x){return '<button type="button" class="'+(x.done?'done':'')+'" data-act="hour" data-key="'+x.k+'" data-nhclose="1">'+(x.done?'✓ ':'')+esc(x.label)+'</button>'}).join('')+'</div><button type="button" class="rm-sec" data-act="meditation" data-nhclose="1">خلوة اليوم</button></div>'}
function pageShelf(i){
  var spines=[['قراءات اليوم','read','اقرأ فصول اليوم'],['خلوة اليوم','meditation','تأمل هادئ'],['الكتاب المقدس','bible','تابع قراءتك'],['أقوال الآباء','fat','حكمة الشيوخ'],['صوت الله','talk','اكتب ما تشعر به'],['السنكسار','syn','قديسو اليوم']];
  return '<h2>مكتبة السراج</h2><p class="pg-sub">رفّ كتبك اليومي</p><div class="shelf">'+spines.map(function(s,n){return '<button type="button" class="bk b'+(n%4)+'" data-act="'+s[1]+'" data-nhclose="1"><b>'+s[0]+'</b><small>'+s[2]+'</small></button>'}).join('')+'</div><div class="pg-verse"><small>آية اليوم</small><p>'+esc(i.verse)+'</p><em>'+esc(i.vref)+'</em></div>'}
function pageCrown(i){
  var M=[[1,'بذرة'],[3,'ثلاثة أيام'],[7,'أسبوع'],[14,'أسبوعان'],[30,'شهر'],[60,'شهران'],[100,'مئة يوم']];
  return '<h2>إكليلي</h2><p class="pg-sub">سلسلة الأمانة: '+ar(i.streak)+' يوم</p><div class="med">'+M.map(function(m){var on=i.streak>=m[0];return '<div class="md'+(on?' on':'')+'"><i>'+(on?'♛':'○')+'</i><b>'+ar(m[0])+'</b><small>'+m[1]+'</small></div>'}).join('')+'</div>'+
  '<div class="pg-card"><small>إنجاز اليوم</small><b>'+ar(i.pct)+'٪</b></div>'}
function pageSteps(i){var w=weekDays();return '<h2>طريق الأسبوع</h2><p class="pg-sub">كل يوم خطوة على الدرب — طول الشريط بقدر ما حملته</p><div class="stp">'+w.map(function(x){var p=Math.min(100,Math.round(x.s*(x.s<=1?100:1)));return '<div class="rw"><b>'+x.w+'</b><i><u style="width:'+Math.max(4,p)+'%"></u></i><small>'+ar(x.d)+'</small></div>'}).join('')+'</div><div class="pg-card"><small>اليوم</small><b>'+ar(i.done)+' من '+ar(i.total)+'</b></div><div class="pg-card"><small>أيام متتالية</small><b>'+ar(i.streak)+'</b></div>'}
function pageWreath(i){return '<h2>إكليل الشهر</h2><p class="pg-sub">ثلاثون يومًا — كل خرزة يوم صلّيت فيه</p><div class="cr-big">'+wreathSvg(260,104,monthBeads(),8)+'<div class="mid"><b>'+ar(i.streak)+'</b><small>يوم متتالٍ</small></div></div><div class="pg-card"><small>اليوم</small><b>'+ar(i.pct)+'%</b></div>'}
function pageSun(i){var w=weekDays(),rays=w.map(function(x,n){var a=Math.PI*(1-n/6),p=Math.min(100,Math.round(x.s*(x.s<=1?100:1))),l=34+p*.5,cx=130,cy=130;return '<line x1="'+(cx+34*Math.cos(a)).toFixed(1)+'" y1="'+(cy-34*Math.sin(a)).toFixed(1)+'" x2="'+(cx+l*Math.cos(a)).toFixed(1)+'" y2="'+(cy-l*Math.sin(a)).toFixed(1)+'" class="ry"/>'}).join('');return '<h2>أشعة الأسبوع</h2><p class="pg-sub">كل شعاع يوم — يطول بقدر ما أكملت</p><svg class="sun" viewBox="0 0 260 150"><circle cx="130" cy="130" r="26"/>'+rays+'</svg><div class="pg-card"><small>اليوم</small><b>'+ar(i.pct)+'%</b></div><div class="pg-card"><small>أيام متتالية</small><b>'+ar(i.streak)+'</b></div>'}
var PAGES={steps:pageSteps,wreath:pageWreath,sun:pageSun,week:pageWeek,room:pageRoom,shelf:pageShelf,crown:pageCrown};
function openPage(n){var d=des();if(!d)return;var i=info(),p=document.getElementById('nhPage');
  if(!p){p=document.createElement('div');p.id='nhPage';p.setAttribute('role','dialog');p.setAttribute('aria-modal','true');document.body.appendChild(p)}
  p.className='nh-page nh-'+d;p.innerHTML='<button type="button" class="nh-x" data-nhclose="1" aria-label="إغلاق">✕</button><div class="nh-pc">'+PAGES[n](i)+'</div>';
  requestAnimationFrame(function(){p.classList.add('on')});document.body.classList.add('nh-lock')}
function closePage(){var p=document.getElementById('nhPage');if(p)p.classList.remove('on');document.body.classList.remove('nh-lock')}
/* ---------------- الغلاف (الصورة) + الورقة المنزلقة ---------------- */
var open_=false,drag=null,lastBody='',lastPk='';
function metrics(){var t=document.getElementById('uTop'),n=document.getElementById('uNav'),r=document.documentElement.style;
  r.setProperty('--nh-top',((t?t.getBoundingClientRect().bottom:60)|0)+'px');r.setProperty('--nh-nav',((n?n.getBoundingClientRect().height:62)|0)+'px')}
function setOpen(v){open_=!!v;var e=document.getElementById('nhHome');if(!e)return;e.classList.toggle('open',open_);document.documentElement.toggleAttribute('data-nho',open_);var b=q('.nh-body',e);if(b&&!open_)b.scrollTop=0}
function paint(){
  var d=des(),w=q('#page-home .u-wrap'),el=document.getElementById('nhHome');
  document.documentElement.setAttribute('data-nh',d||'');
  if(!d||!w){if(el)el.remove();lastBody='';lastPk='';return}
  metrics();
  var i=info(),nx=nextHour(i);
  if(!el){el=document.createElement('section');el.id='nhHome';w.insertBefore(el,w.firstChild);lastBody='';lastPk='';el.innerHTML=
    '<div class="nh-cover"><div class="cv"></div></div><div class="nh-sheet"><button type="button" class="nh-grab" aria-label="عرض يومك"><i></i></button><div class="nh-peek"></div><div class="nh-body"></div></div>';
    bind(el)}
  el.className='nh nh-'+d+(open_?' open':'');
  var cv='<small>'+esc(i.dt)+'</small><h1>'+esc(i.wd)+'</h1><p>'+esc(TAG[d])+'</p>';
  var cvEl=q('.cv',el);if(cvEl.dataset.h!==cv){cvEl.innerHTML=cv;cvEl.dataset.h=cv}
  var pk='<div class="pk"><span class="pk-t"><b class="t1">اسحب لأعلى لعرض يومك</b><b class="t2">اسحب لأسفل لرؤية الصورة</b></span><button type="button" class="pk-go" data-act="hour" data-key="'+nx.k+'">صلاة '+esc(nx.label)+' ‹</button><em>'+ar(i.done)+' من '+ar(i.total)+'</em></div>';
  if(pk!==lastPk){q('.nh-peek',el).innerHTML=pk;lastPk=pk}
  var h=BODY[d](i);if(h!==lastBody){var bd=q('.nh-body',el),st=bd.scrollTop;bd.innerHTML=h;bd.scrollTop=st;lastBody=h}
}
function bind(el){
  var sh=q('.nh-sheet',el),bd=q('.nh-body',el),y0=0,y=0,mode='',t0=0;
  function tr(v){sh.style.transform=v==null?'':'translateY('+v+'px)'}
  function range(){return sh.offsetHeight-(q('.nh-peek',el).offsetHeight+q('.nh-grab',el).offsetHeight)}
  el.addEventListener('touchstart',function(e){if(e.touches.length!==1)return;var t=e.target;
    if(!t.closest('.nh-sheet')){y0=e.touches[0].clientY;mode='cover';t0=Date.now();return}
    if(t.closest('.nh-grab,.nh-peek')&&!t.closest('button:not(.nh-grab)')||(!open_&&!t.closest('.pk-go'))){y0=e.touches[0].clientY;mode='grab';t0=Date.now();y=0;sh.style.transition='none';return}
    if(open_){y0=e.touches[0].clientY;mode='body';t0=Date.now();y=0}
  },{passive:true});
  el.addEventListener('touchmove',function(e){if(!mode)return;var dy=e.touches[0].clientY-y0;
    if(mode==='cover'){return}
    if(mode==='body'){if(bd.scrollTop>0||dy<=0){mode='';return}mode='grab';sh.style.transition='none'}
    if(mode==='grab'){y=dy;var R=range();tr(open_?Math.max(0,Math.min(R,dy)):Math.max(0,Math.min(R,R+dy)));if(e.cancelable)e.preventDefault()}
  },{passive:false});
  el.addEventListener('touchend',function(e){var m=mode;mode='';
    if(m==='cover'){var d=(e.changedTouches[0]||{}).clientY-y0;if(d<-40)setOpen(true);return}
    if(m!=='grab'){return}
    sh.style.transition='';tr(null);var fast=Date.now()-t0<260,mv=Math.abs(y)>8;
    if(!mv){return}
    if(open_)setOpen(!(y>60||(fast&&y>20)));else setOpen(y<-60||(fast&&y<-20))
  },{passive:true});
  q('.nh-grab',el).addEventListener('click',function(){setOpen(!open_)});
  q('.nh-peek',el).addEventListener('click',function(e){if(!e.target.closest('button'))setOpen(true)});
  q('.cv',el).parentNode.addEventListener('click',function(){if(open_)setOpen(false)});
}
document.addEventListener('click',function(e){
  if(e.target.closest&&e.target.closest('[data-nhedit]')){e.preventDefault();editHours();return}
  var t=e.target.closest&&e.target.closest('body [data-nh]');
  if(t){e.preventDefault();openPage(t.getAttribute('data-nh'));return}
  var c=e.target.closest&&e.target.closest('[data-nhclose]');
  if(c)closePage();
  setTimeout(paint,350)
},true);
new MutationObserver(function(m){var pg=document.documentElement.getAttribute('data-pg');closePage();if(pg==='home')setOpen(false);paint()}).observe(document.documentElement,{attributes:true,attributeFilter:['data-rf-theme','data-pg']});
window.addEventListener('resize',function(){paint()});
RF.act.on(function(){lastBody='';lastPk='';paint()});
setInterval(function(){if(!document.hidden)paint()},10000);
window.addEventListener('pageshow',paint);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',paint);else paint();
window.__nh={setOpen:setOpen,paint:paint,open:openPage,close:closePage};
})();
