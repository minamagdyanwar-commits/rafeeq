/* تظليل الجمل بالضغط المطوّل على نطاق التطبيق كله: المحدِّد وبيانات المصدر (يقرؤهما محرك التظليل في app23) */
(function(){
var ROOTS='#page-talk,#page-msg,#page-fat,#page-exam,#page-syn,#page-cal,#page-favs,#page-trk,#page-home,#view-agpeya,#progDay,#nhPage';
var TAGS='p,blockquote,li,.tk-say,.mg-p,.fat-q,.fat-c,.verse,.intro,.syn-note,.mg-feast,.coptic-note,.acc-sub,.u-note,.opening-note,.bv-pstitle';
window.__hlSel=':is('+ROOTS+') :is('+TAGS+'):not(button *,a *,summary *,label *,textarea *,input *,select *,#v302Bar *,#v299Sheet *,.nh-peek *,.nh-grab *)';
var NAMES=[['#progDay','رحلتي'],['#page-talk','صوت الله'],['#page-msg','رسالة من يسوع'],['#page-fat','أقوال الآباء'],['#page-exam','محاسبة النفس'],['#page-syn','السنكسار'],['#page-cal','التقويم القبطي'],['#page-favs','المفضلات'],['#view-agpeya','الأجبية'],['#nhPage','الرئيسية'],['#page-home','الرئيسية']];
function tx(e){return e?String(e.textContent||'').replace(/\s+/g,' ').trim().slice(0,60):''}
window.__hlMeta=function(x){try{if(!x||x.closest('#page-read,#view-meditation,#view-guided'))return null;
  var h='',r='',c='';
  if(x.closest('.bible-text')){h='الكتاب المقدس';r=tx(document.querySelector('.rd-title'));var v=x.getAttribute&&x.getAttribute('data-v');if(v)r+=(r?': ':'')+v}
  else{for(var i=0;i<NAMES.length;i++){if(x.closest(NAMES[i][0])){h=NAMES[i][1];break}}
    if(x.closest('#page-trk'))h='الكتاب المقدس';
    var hd=document.querySelector('#progDay h2');
    if(x.closest('#progDay')&&hd)r=tx(hd);
    else{var sc=x.closest('section,article,.u-card,.card,.mg-card,.fat-card');var t=sc&&sc.querySelector('h1,h2,h3,h4,cite,.verse-ref,.ref');if(t&&!x.contains(t))r=tx(t)}}
  return h?{h:h,c:c,r:r}:null}catch(e){return null}};
})();
/* v6.13 — رحلات الكتاب المقدس والكنيسة: درب صعود بمحطات، لكل يوم قراءة وموقف ودرس وسؤال ومهمة. شاشة «رحلاتي» وشارات الإتمام. كل شيء على جهازك. */
(function(){
"use strict";
var K='rafeeq_prog_v1',AR='٠١٢٣٤٥٦٧٨٩';
var CATS=[['person','شخصيات الكتاب','👤'],['topic','موضوعات روحية','🕊'],['church','من الكنيسة والتقليد','⛪'],['season','رحلات المواسم','📅'],['shenouda','رحلات قداسة البابا شنوده','📖'],['custom','رحلاتي الخاصة','✨']];
function ar(n){return RF.ar(n)}
function esc(s){return RF.esc(s)}
function F(){return window.__F||{}}
function q(s,r){return (r||document).querySelector(s)}
function PG(){return window.__progData||{}}
function IDS(){return Object.keys(PG())}
function N(id){return (PG()[id]&&PG()[id].days.length)||40}
function load(){var v;try{v=JSON.parse(localStorage.getItem(K)||'null')}catch(e){}v=v||{};IDS().forEach(function(i){v[i]=v[i]||{done:{},notes:{}};v[i].done=v[i].done||{};v[i].notes=v[i].notes||{}});return v}
function save(s){try{localStorage.setItem(K,JSON.stringify(s))}catch(e){}if(window.RF&&RF.act)RF.act.changed(F().dkey&&F().dkey(),'prog')}
var MN=['المحطة الأولى','منتصف الرحلة','قرب القمة','القمة'];
function mileOf(id,d){var n=N(id);for(var k=1;k<=4;k++)if(d===Math.ceil(n*k/4))return MN[k-1];return ''}
function stIdx(p,d){return p.stageAt?p.stageAt[d-1]:Math.min(3,Math.floor((d-1)*4/p.days.length))} function stageOf(p,d){return p.stages[stIdx(p,d)]}
function cur(s,id){var n=N(id);for(var i=1;i<=n;i++)if(!s[id].done[i])return i;return n+1}
function doneCount(s,id){var n=0,m=N(id);for(var i=1;i<=m;i++)if(s[id].done[i])n++;return n}
function lastTs(s,id){var m=0;for(var k in s[id].done)m=Math.max(m,s[id].done[k]);return m}
function lastId(s){var best=null,t=0;IDS().forEach(function(i){var m=lastTs(s,i);if(m>t){t=m;best=i}});return best}
function finished(s,id){return cur(s,id)>N(id)}
/* ربط الرحلات الموسمية بالتقويم القبطي: يوم الموسم الحالي (٠ إن لم يكن الموسم قائمًا) */
function seasonMain(){try{var c=window.__copCal;var r=c&&c.label&&c.label(new Date());return r&&(r.main||(r.info&&r.info.main))||null}catch(e){return null}}
function syncDay(id){var p=PG()[id];if(!p||!p.sync)return 0;var m=seasonMain();if(!m)return 0;if(p.sync.alt&&m.k===p.sync.alt.k)return Math.min(m.day+p.sync.alt.add,N(id));if(m.k!==p.sync.k)return 0;if(m.day<p.sync.from||m.day>p.sync.to)return 0;var d=m.day-p.sync.from+1;return Math.min(d,N(id))}
function inSeason(s){return IDS().filter(function(i){return syncDay(i)>0&&!finished(s,i)})}
var active='joseph',tab='mine';
/* معايرة ألوان النص على ألوان التصميم الحالي: لون التشديد للنص، ولون النص فوق الأسطح الملوّنة */
function calib(){try{var d=document.documentElement,pr=document.createElement('div');pr.id='progProbe';pr.style.cssText='position:fixed;left:-9px;top:0;width:1px;height:1px';document.body.appendChild(pr);
  function res(v,fb){pr.style.color='';pr.style.backgroundColor='';pr.style.color='var('+v+','+fb+')';var m=getComputedStyle(pr).color.match(/[\d.]+/g)||[0,0,0];return {r:+m[0],g:+m[1],b:+m[2],a:m[3]==null?1:+m[3]}}
  function lum(c){function f(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}return .2126*f(c.r)+.7152*f(c.g)+.0722*f(c.b)}
  function cr(a,b){var x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
  function over(f,b){return {r:f.r*f.a+b.r*(1-f.a),g:f.g*f.a+b.g*(1-f.a),b:f.b*f.a+b.b*(1-f.a),a:1}}
  function mix(a,b,t){return {r:a.r+(b.r-a.r)*t,g:a.g+(b.g-a.g)*t,b:a.b+(b.b-a.b)*t,a:1}}
  var acc=res('--nh-acc','#d2b98a'),bg=res('--nh-bg','#0f1318'),card=over(res('--nh-card','#1b222a'),bg),ink=res('--nh-ink','#efe6d2');pr.remove();
  var t=0,a=acc;while(t<=1&&Math.min(cr(a,bg),cr(a,card))<4.6){t+=.1;a=mix(acc,ink,t)}
  d.style.setProperty('--pg-a','rgb('+(a.r|0)+','+(a.g|0)+','+(a.b|0)+')');
  var w={r:255,g:255,b:255},k={r:26,g:18,b:6};d.style.setProperty('--pg-on',cr(w,acc)>=cr(k,acc)?'#fff':'#1a1206')}catch(e){}}
/* ---------- بطاقات ---------- */
function card(s,id){var p=PG()[id];if(!p)return'';var n=N(id),c=cur(s,id),dn=doneCount(s,id),pct=Math.round(dn*100/n);
  return '<button type="button" class="pg-card'+(finished(s,id)?' fin':'')+'" data-prog="'+id+'"><i>'+p.icon+'</i><span><b>'+esc(p.title)+'</b><small>'+esc(p.sub)+'</small>'+(dn?'<u><s style="width:'+pct+'%"></s></u>':'')+'<em>'+(syncDay(id)&&!finished(s,id)?'🔔 الآن: اليوم '+ar(syncDay(id))+' من '+ar(n):(dn===0?ar(n)+' يومًا'+(p.season?' · '+esc(p.season):''):(finished(s,id)?'🏅 أتممتَ الرحلة':'اليوم '+ar(c)+' من '+ar(n))))+'</em></span><strong>‹</strong></button>'}
function started(s){return IDS().filter(function(i){return doneCount(s,i)>0}).sort(function(a,b){return lastTs(s,b)-lastTs(s,a)})}
window.__progCard=function(){var s=load(),st=started(s),id=st.filter(function(i){return !finished(s,i)})[0]||st[0],p=PG()[id];
  if(!id||!p)return '<button type="button" class="pg-home" data-prog="hub"><i>🏔</i><span><b>رحلات ٤٠ يومًا وأكثر</b><small>شخصيات · موضوعات · مواسم</small></span><em>‹</em></button>';
  var c=cur(s,id),n=N(id);
  return '<button type="button" class="pg-home" data-prog="hub"><i>'+p.icon+'</i><span><b>رحلاتي</b><small>'+esc(p.short)+' — '+(c>n?'أتممتها 🏅':'اليوم '+ar(c)+' من '+ar(n))+'</small></span><em>‹</em></button>'};
/* ---------- المركز داخل الأجبية ---------- */
function paintHub(){var h=document.getElementById('progHub');if(!h)return;calib();var s=load(),st=started(s).filter(function(i){return !finished(s,i)}).slice(0,3);
  var ins=inSeason(s);ins.slice().reverse().forEach(function(i){var k=st.indexOf(i);if(k>-1)st.splice(k,1);st.unshift(i)});st=st.slice(0,3);
  var list=st.length?st:['joseph','peter','psalms'];
  h.innerHTML='<h3>🏔 رحلاتي</h3><p>'+(ins.length?'🔔 رحلة موسمية قائمة الآن — يومها مفتوح لك.':st.length?'تابع من حيث وقفت.':'ابدأ رحلة: كل يوم قراءة وتأمل وسؤال ومهمة صغيرة.')+'</p>'+list.map(function(i){return card(s,i)}).join('')+'<button type="button" class="pg-all" data-prog="hub">كل الرحلات ('+ar(IDS().length)+') والشارات ‹</button>'}
function V(i){return document.getElementById(i)}
function showJourneys(){var ag=V('view-agpeya'),md=V('view-meditation'),gd=V('view-guided'),jv=V('view-journeys');if(!jv)return;
  [ag,md,gd].forEach(function(e){if(e)e.style.display='none'});jv.style.display='';
  ['tabAgpeya','tabMeditation','tabGuided'].forEach(function(i){var e=V(i);e&&e.classList.remove('active')});var t=V('tabJourneys');t&&t.classList.add('active');
  paintHub();try{window.scrollTo(0,0)}catch(e){}try{window.__F&&window.__F.updatePrayBar&&window.__F.updatePrayBar()}catch(e){}}
function mountHub(){var md=V('view-meditation');if(!md)return;
  var tm=V('tabMeditation');if(tm&&tm.textContent.indexOf('التأملات اليومية')>=0)tm.textContent='📖 التأملات';
  var tg=V('tabGuided');if(tg&&tg.textContent.indexOf('الفردية')>=0)tg.textContent='🕯 الخلوة';
  if(!V('view-journeys')){var jv=document.createElement('div');jv.id='view-journeys';jv.style.display='none';var h=document.createElement('div');h.id='progHub';jv.appendChild(h);md.parentNode.insertBefore(jv,md)}
  if(!V('tabJourneys')&&tm){var t=document.createElement('div');t.className='app-tab';t.id='tabJourneys';t.setAttribute('role','button');t.tabIndex=0;t.textContent='🏔 رحلاتي';
    t.addEventListener('click',showJourneys);t.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();showJourneys()}});tm.parentNode.insertBefore(t,tm)}
  var sw=window.switchApp;if(typeof sw==='function'&&!sw.__pg){var f=function(x){var jv=V('view-journeys');if(jv)jv.style.display='none';var t=V('tabJourneys');t&&t.classList.remove('active');return sw.apply(this,arguments)};f.__pg=1;window.switchApp=f}}
/* ---------- الدرب ---------- */
var H=74,ST=180;
function pos(i,W,n){var x=W*(.5+.3*Math.sin((i-1)*.85)),y=ST+(n-i)*H+40;return [x,y]}
function render(open){calib();
  var p=PG()[active],s=load(),n=N(active),c=cur(s,active),dn=doneCount(s,active),pct=Math.round(100*dn/n),W=Math.min(window.innerWidth,520),totalH=ST+n*H+120;
  var pts=[];for(var i=1;i<=n;i++)pts.push(pos(i,W,n));
  var path='M'+pts[0][0].toFixed(1)+' '+pts[0][1].toFixed(1);
  for(var j=1;j<pts.length;j++){var a=pts[j-1],b=pts[j],my=(a[1]+b[1])/2;path+=' C'+a[0].toFixed(1)+' '+my.toFixed(1)+' '+b[0].toFixed(1)+' '+my.toFixed(1)+' '+b[0].toFixed(1)+' '+b[1].toFixed(1)}
  var nodes='',labels='',stPrev=-1,sdy=syncDay(active);
  for(var d=1;d<=n;d++){var pt=pts[d-1],state=s[active].done[d]?'done':(d===c?'now':(d<c?'done':(d<=sdy?'open':'lock'))),mil=mileOf(active,d),sIdx=stIdx(p,d);
    nodes+='<button type="button" class="nd '+state+(mil?' mil':'')+(sdy&&d===sdy?' td':'')+'" style="left:'+pt[0].toFixed(1)+'px;top:'+pt[1].toFixed(1)+'px" data-pgd="'+d+'" aria-label="اليوم '+d+'"><i>'+(state==='done'?'✓':ar(d))+'</i>'+(state==='now'?'<u></u>':'')+'</button>';
    var st=p.stages[sIdx];
    if(sIdx!==stPrev){labels+='<div class="'+(d===1?'lb':'sg')+'" style="top:'+(pt[1]-(d===1?66:62))+'px">'+(d===1?'<span>'+st[2]+' '+esc(st[0])+'</span>':st[2]+' '+esc(st[0])+' — '+esc(st[1]))+'</div>';stPrev=sIdx}
    else if(mil){labels+='<div class="lb" style="top:'+(pt[1]-64)+'px"><span>'+st[2]+' '+mil+'</span></div>'}}
  var r=34,C=2*Math.PI*r,off=C*(1-pct/100);
  var h='<button type="button" class="pg-x" data-pgclose="1" aria-label="إغلاق">✕</button>'+
   '<header class="pg-hd"><div class="pg-ring"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="'+r+'" class="t"/><circle cx="40" cy="40" r="'+r+'" class="p" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'"/></svg><b>'+ar(pct)+'٪</b></div>'+
   '<div class="pg-tt"><small>رحلة</small><h2>'+esc(p.title)+'</h2><p>'+(c>n?'أتممتَ الرحلة كلها 🏅':'اليوم '+ar(c)+' · '+esc(stageOf(p,c)[0])+' · '+esc(stageOf(p,c)[1]))+'</p></div></header>'+
   '<div class="pg-path" style="height:'+totalH+'px"><svg class="pg-line" viewBox="0 0 '+W+' '+totalH+'" width="'+W+'" height="'+totalH+'" preserveAspectRatio="xMidYMin meet"><path d="'+path+'" class="bg"/><path d="'+path+'" class="fg" pathLength="1" stroke-dasharray="1" stroke-dashoffset="'+(1-Math.min(1,Math.max(0,(Math.min(dn,n))/Math.max(1,n-1)))).toFixed(3)+'"/></svg>'+labels+nodes+'<div class="pg-top">'+p.icon+' القمة</div></div>'+
   (dn>0?'<button type="button" class="pg-rs" data-pgreset="1">إعادة الرحلة من البداية</button>':'<div style="height:110px"></div>');
  var pgEl=pgBox();var sc=pgEl.scrollTop;pgEl.innerHTML=h;pgEl.className='prg-page on';document.body.classList.add('nh-lock');
  if(open){var y=pts[Math.min(sdy||c,n)-1][1];requestAnimationFrame(function(){pgEl.scrollTop=Math.max(0,y-pgEl.clientHeight*.55)})}else pgEl.scrollTop=sc}
function pgBox(){var e=document.getElementById('progPage');if(!e){e=document.createElement('div');e.id='progPage';e.setAttribute('role','dialog');e.setAttribute('aria-modal','true');document.body.appendChild(e)}return e}
/* ---------- شاشة «رحلاتي» ---------- */
function badges(s){var out='';IDS().forEach(function(i){var p=PG()[i],ok=finished(s,i);out+='<div class="pg-bd'+(ok?' on':'')+'" title="'+esc(p.title)+'"><i>'+(ok?p.icon:'🔒')+'</i><small>'+esc(p.short)+'</small></div>'});return out}
function hubPage(t){calib();if(t)tab=t;var s=load(),all=IDS(),st=started(s),run=st.filter(function(i){return !finished(s,i)}),fin=st.filter(function(i){return finished(s,i)});
  var days=0;all.forEach(function(i){days+=doneCount(s,i)});
  var body='';
  if(tab==='mine'){
    body+='<div class="pg-stats"><div><b>'+ar(days)+'</b><small>يومًا مكتملًا</small></div><div><b>'+ar(run.length)+'</b><small>رحلة جارية</small></div><div><b>'+ar(fin.length)+'</b><small>رحلة مكتملة</small></div></div>';
    var ins=inSeason(s);if(ins.length)body+='<h3>🔔 الآن في الكنيسة</h3>'+ins.map(function(i){return card(s,i)}).join('');
    body+=run.length?'<h3>جارية</h3>'+run.map(function(i){return card(s,i)}).join(''):'<p class="pg-em">لم تبدأ رحلة بعد. اختر من «كل الرحلات».</p>';
    if(fin.length)body+='<h3>مكتملة</h3>'+fin.map(function(i){return card(s,i)}).join('');
    var sug=all.filter(function(i){return doneCount(s,i)===0}).slice(0,3);if(sug.length)body+='<h3>اقتراح لك</h3>'+sug.map(function(i){return card(s,i)}).join('')}
  else if(tab==='all'){body+='<button type="button" class="pg-make" data-pgmake="1">✨ ابنِ رحلتك الخاصة <small>اختر موضوعًا وعدد الأيام</small></button>';CATS.forEach(function(c){var ids=all.filter(function(i){return PG()[i].cat===c[0]});if(ids.length)body+='<h3>'+c[2]+' '+c[1]+'</h3>'+ids.map(function(i){return card(s,i)}).join('')})}
  else if(tab==='bp'){var bi=all.filter(function(i){return PG()[i].cat==='shenouda'});body+='<p class="pg-em">رحلات مستوحاة من كتب ومحاضرات قداسة البابا شنوده الثالث، كل رحلة مستقلة بذاتها. النص صياغة جديدة لأفكار الكتاب مع ربطها بالكتاب المقدس.</p>'+bi.map(function(i){return card(s,i)}).join('')+'<p class="pg-em pg-src">'+bi.map(function(i){return esc(PG()[i].src||'')}).join('<br>')+'</p>'}
  else{body+='<p class="pg-em">كل رحلة تكملها تمنحك شارة. أكمل أيامها كلها لتفتح الشارة.</p><div class="pg-bds">'+badges(s)+'</div>'}
  var tabs=[['mine','رحلاتي'],['all','كل الرحلات'],['bp','البابا شنوده'],['bd','الشارات']].map(function(x){return '<button type="button" class="'+(tab===x[0]?'on':'')+'" data-pgtab="'+x[0]+'">'+x[1]+'</button>'}).join('');
  var e=pgBox();e.innerHTML='<button type="button" class="pg-x" data-pgclose="1" aria-label="إغلاق">✕</button><div class="pg-hubp"><h2>🏔 رحلات الكتاب المقدس</h2><div class="pg-tabs">'+tabs+'</div>'+body+'</div>';e.className='prg-page on';document.body.classList.add('nh-lock');e.scrollTop=0}
function closePage(){var p=document.getElementById('progPage');if(p)p.classList.remove('on');var d=document.getElementById('progDay');if(d)d.classList.remove('on');if(!document.querySelector('#nhPage.on'))document.body.classList.remove('nh-lock');paintHub()}
/* ---------- بطاقة اليوم ---------- */
function openDay(d){calib();var p=PG()[active],s=load(),c=cur(s,active),n=N(active);if(d>c&&d>syncDay(active)){var t=F().toast;t&&t('كمّل اليوم '+ar(c)+' الأول');return}
  var it=p.days[d-1],b=F().bible,done=!!s[active].done[d],st=stageOf(p,d),L=p.labels;
  var el=document.getElementById('progDay');if(!el){el=document.createElement('div');el.id='progDay';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');document.body.appendChild(el)}
  function sec(lbl,txt){return txt?'<section class="pd-r"><h4>'+esc(lbl)+'</h4><p>'+esc(txt)+'</p></section>':''}
  var Q=it[7],BK=Object.assign({},p.book||{},(it[7]&&it[7].b)||{});
  /* رحلات الكتب: الاقتباس من الكتاب أولًا (مع المصدر والصفحة)، ثم الآية للتأمل */
  function top(psalm){
    if(!Q)return '<article class="pd-v">'+psalm+'</article>';
    var src='من كتاب «'+esc(BK.title||p.short)+'»'+(BK.author?' — '+esc(BK.author):'')+(Q.c?' — '+esc(Q.c):'')+'<br>صفحة '+ar(Q.p)+(BK.part&&Q.f?' من '+esc(Q.f):'')+' · ترقيم الملف الأصلي';
    var bu=(BK.urls&&Q.f&&BK.urls[Q.f])||BK.url;
    var link=bu?'<a class="pd-open pd-book" href="'+esc(bu)+'" target="_blank" rel="noopener">افتح الكتاب كاملًا</a>':'';
    return '<article class="pd-v pd-quote"><p>'+esc(Q.q)+'</p><b>'+src+'</b>'+link+'</article>'+(psalm?'<section class="pd-v pd-bible"><h4>آية للتأمل</h4>'+psalm+'</section>':'')}
  function paint(psalm){
    el.innerHTML='<button type="button" class="pg-x" data-pgback="1" aria-label="رجوع">‹ الدرب</button><div class="pd-c"><small>'+st[2]+' اليوم '+ar(d)+' من '+ar(n)+' · '+esc(st[0])+'</small><h2>'+esc(it[0])+'</h2>'+
      top(psalm)+
      sec(L[0],it[2])+sec(L[1],it[3])+sec(L[2],it[4])+
      '<section class="pd-q"><h4>سؤال اليوم</h4><p>'+esc(it[5])+'</p><textarea id="pdNote" rows="3" maxlength="500" placeholder="اكتب إجابتك — تتحفظ على جهازك فقط">'+esc(s[active].notes[d]||'')+'</textarea></section>'+
      '<section class="pd-t"><i>✦</i><div><h4>مهمة اليوم</h4><p>'+esc(it[6])+'</p></div></section>'+
      '<button type="button" class="pd-ok'+(done?' on':'')+'" data-pgok="'+d+'">'+(done?'✓ أكملت هذا اليوم (اضغط للتراجع)':'أكملت هذا اليوم ✓')+'</button></div>';
    el.className='prg-day on';el.scrollTop=0}
  function psalmHtml(){
    try{var r=b.parseRef(it[1]),txt=b.verses(r.bi,r.ch,r.v1,r.v2),lab=b.label(r.bi,r.ch,r.v1,r.v2);
      return '<p>'+esc(txt.slice(0,6).join(' '))+(txt.length>6?' …':'')+'</p><b>'+esc(lab)+'</b><button type="button" class="pd-open" data-pgopen="'+r.bi+':'+r.ch+':'+(r.v1||1)+'">افتح الفصل في الكتاب المقدس</button>'}catch(e){return '<b>'+esc(it[1])+'</b>'}}
  if(!it[1]){paint('');return}
  if(b&&b.load)b.load().then(function(){paint(psalmHtml())},function(){paint('<b>'+esc(it[1])+'</b>')});else paint('<b>'+esc(it[1])+'</b>')}
function closeDay(){var el=document.getElementById('progDay');if(el)el.classList.remove('on')}
/* ---------- ربط «يومي» ---------- */
function activeId(s){var st=started(s).filter(function(i){return !finished(s,i)});var se=st.filter(function(i){return syncDay(i)>0});return se[0]||st[0]||null}
function doneOn(dk){var s=load(),f=F().dkey;if(!f)return false;for(var i=0,ids=IDS();i<ids.length;i++){for(var k in s[ids[i]].done){try{if(f(new Date(s[ids[i]].done[k]))===dk)return true}catch(e){}}}return false}
function status(dk){var s=load(),id=activeId(s);if(!id)return null;var p=PG()[id];return {id:id,label:'رحلتي: '+p.short+' — اليوم '+ar(cur(s,id)),done:doneOn(dk)}}
function openCurrent(){var s=load(),id=activeId(s);if(!id){hubPage('all');return}active=id;render(true);var sd=syncDay(id);openDay(sd&&!s[id].done[sd]?sd:Math.min(cur(s,id),N(id)))}
/* ---------- قائمة «المزيد» والرئيسية ---------- */
function injectMore(){var box=q('#uSheet .v14-more');if(!box||q('[data-prog="hub"]',box))return;
  var h4=document.createElement('h4');h4.textContent='رحلات';var b=document.createElement('button');b.type='button';b.setAttribute('data-prog','hub');
  b.innerHTML='رحلاتي<small>شخصيات · موضوعات · مواسم · شارات</small>';
  var first=box.querySelector('h4');box.insertBefore(h4,first);box.insertBefore(b,first)}
function injectHome(){var b=q('#nhHome .nh-body');if(!b)return;if(q('.pg-home',b))return;b.insertAdjacentHTML('beforeend',window.__progCard())}
function boot(){injectMore();injectHome();mountHub()}
new MutationObserver(boot).observe(document.body,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',boot);setTimeout(boot,600);
/* ---------- الأحداث ---------- */
document.addEventListener('click',function(e){var t=e.target,b;if(!t.closest)return;
  if(b=t.closest('[data-prog]')){e.preventDefault();e.stopPropagation();var id=b.getAttribute('data-prog');try{F().closeSheet()}catch(x){};if(id==='cur'){openCurrent()}else if(id==='hub'||!PG()[id]){hubPage(started(load()).length?'mine':'all')}else{active=id;render(true)}return}
  if(b=t.closest('[data-pgtab]')){hubPage(b.getAttribute('data-pgtab'));return}
  if(b=t.closest('[data-pgclose]')){closePage();return}
  if(b=t.closest('[data-pgback]')){closeDay();render(false);return}
  if(b=t.closest('[data-pgd]')){openDay(+b.getAttribute('data-pgd'));return}
  if(b=t.closest('[data-pgopen]')){var a=b.getAttribute('data-pgopen').split(':');closeDay();closePage();try{F().openBible(+a[0],+a[1],+a[2])}catch(x){}return}
  if(b=t.closest('[data-pgok]')){var d=+b.getAttribute('data-pgok'),s=load(),n=N(active),note=(q('#pdNote')||{}).value;if(note!=null)s[active].notes[d]=note;
    var tt=F().toast;
    if(s[active].done[d]){delete s[active].done[d]}else{s[active].done[d]=Date.now();
      if(cur(s,active)>n)tt&&tt('🏅 أتممتَ «'+PG()[active].short+'» — مبروك الشارة!');else if(mileOf(active,d))tt&&tt('🎉 '+mileOf(active,d)+' — أحسنت!');else tt&&tt('✓ اليوم '+ar(d)+' اكتمل')}
    save(s);closeDay();render(false);var pe=document.getElementById('progPage');if(pe){var nx=Math.min(n,cur(s,active)),y=pos(nx,Math.min(window.innerWidth,520),n)[1];pe.scrollTo({top:Math.max(0,y-pe.clientHeight*.55),behavior:'smooth'})}
    try{window.__nh&&window.__nh.paint()}catch(x){};return}
  if(b=t.closest('[data-pgreset]')){if(confirm('هتبدأ الرحلة من اليوم الأول وتتمسح إجاباتك. متأكد؟')){var s2=load();s2[active]={done:{},notes:{}};save(s2);render(true)}return}
},true);
document.addEventListener('input',function(e){if(e.target&&e.target.id==='pdNote'){var ok=q('[data-pgok]');if(!ok)return;var d=+ok.getAttribute('data-pgok'),s=load();s[active].notes[d]=e.target.value;save(s)}});
/* المفضّلات: تسجيل «ملاحظاتي في الرحلات» في سجلّ RF.favs */
RF.favs.register({id:'prog',order:76,ic:'🧭',t:'ملاحظاتي في الرحلات',hint:'في أي يوم من «رحلاتي» اكتب إجابتك — بتتحفظ هنا تلقائيًا.',key:K,
  items:function(){var s=load(),o=[];Object.keys(s).forEach(function(r){var n=(s[r]&&s[r].notes)||{};Object.keys(n).forEach(function(d){if(n[d]&&String(n[d]).trim())o.push({id:r+'|'+d,head:((PG()[r]&&(PG()[r].short||PG()[r].title))||r)+' — يوم '+ar(d),sub:'',text:String(n[d]),ts:0})})});return o},
  rm:function(id){var s=load(),p=id.split('|');if(s[p[0]]&&s[p[0]].notes){delete s[p[0]].notes[p[1]];save(s)}}});
/* البحث الموحّد: الرحلات (عناوين الرحلات وأيامها) */
RF.search.register({id:'prog',title:'الرحلات',order:60,
  run:function(q,nq,ctx){var nm=F().norm,rows=[];if(!nm)return rows;IDS().forEach(function(id){var p=PG()[id];if(rows.length>=8)return;
    if(nm(p.title+' '+p.short+' '+(p.sub||'')).indexOf(nq)>-1){rows.push({go:'prog:'+id,title:p.title,sub:p.sub||''});return}
    for(var i=0;i<p.days.length&&rows.length<8;i++){var d=p.days[i];if(nm(d[0]+' '+d[1]+' '+d[2]+' '+d[4]).indexOf(nq)>-1){rows.push({go:'prog:'+id,title:p.short+' — يوم '+ar(i+1)+': '+d[0],sub:ctx.snip(String(d[2]||d[4]||''))});break}}});return rows},
  go:function(parts){if(window.__prog)window.__prog.open(parts[1])}});
window.__prog={status:status,doneOn:doneOn,openCurrent:openCurrent,tab:showJourneys,open:function(id){active=id||'joseph';render(true)},hub:hubPage,day:openDay,close:closePage};
})();

/* ضبط تلقائي لنص الأزرار والشارات الملوّنة بحسب لون خلفيتها الفعلي (كل التصاميم) */
(function(){
var SEL='button,.app-tab,.part-btn,.tab,.pill,.chip,.tk-badge,.u-btn,.y-prog,.y-head span,.dc-i';
function rgb(str){var m=String(str||'').match(/^rgba?\(([^)]+)\)/);if(m){var a=m[1].split(/[ ,\/]+/).map(Number);return {r:a[0],g:a[1],b:a[2],a:a.length>3?a[3]:1}}
  m=String(str||'').match(/^color\(srgb\s+([^)]+)\)/);if(m){var b=m[1].split(/[ \/]+/).map(Number);return {r:b[0]*255,g:b[1]*255,b:b[2]*255,a:b.length>3?b[3]:1}}return null}
function lum(c){function f(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}return .2126*f(c.r)+.7152*f(c.g)+.0722*f(c.b)}
function cr(a,b){var x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
function mix(a,b,t){return {r:a.r+(b.r-a.r)*t,g:a.g+(b.g-a.g)*t,b:a.b+(b.b-a.b)*t,a:1}}
/* متوسط لون صورة الخلفية (مخزَّن): الصورة هي الخلفية الفعلية للنص فوقها، لا لون الاحتياط المرسوم تحتها (مثل تصميم الإكليل: لون فاتح تحت صورة داكنة).
   تُقرأ من نفس النطاق فلا يتلوّث الـcanvas؛ وإلى أن تُحمَّل يُترك العنصر بلا تصحيح ثم يُعاد الفحص عند تمام التحميل. a = متوسط الشفافية. */
var IMGAVG={};
function imgAvg(u){var m=/url\(\s*["']?([^"')]+?)["']?\s*\)/.exec(u);if(!m)return null;var k=m[1],v=IMGAVG[k];
  if(v&&v.r!==undefined)return v;if(v)return null;IMGAVG[k]='w';
  var im=new Image();im.onload=function(){try{var c=document.createElement('canvas');c.width=c.height=8;var x=c.getContext('2d');x.drawImage(im,0,0,8,8);var d=x.getImageData(0,0,8,8).data,r=0,g=0,b=0,al=0,w=0;
      for(var i=0;i<d.length;i+=4){var a=d[i+3]/255;r+=d[i]*a;g+=d[i+1]*a;b+=d[i+2]*a;al+=a;w++}
      IMGAVG[k]=al>0?{r:r/al,g:g/al,b:b/al,a:al/w}:'x'}catch(e){IMGAVG[k]='x'}sch()};
  im.onerror=function(){IMGAVG[k]='x'};im.src=k;return null}
function over(t,b){var a=t.a;return {r:t.r*a+b.r*(1-a),g:t.g*a+b.g*(1-a),b:t.b*a+b.b*(1-a),a:1}}
/* الخلفية الفعلية للعنصر: تُدمج الطبقات الشفافة (لون أو صورة) من أعلى لأسفل فوق أول طبقة معتمة، فيُحسب التباين على ما يراه المستخدم فعلًا */
function bgOf(e){var layers=[],n=e,d=0,base=null;
  while(n&&n.nodeType===1&&d<9){var cs=getComputedStyle(n),c=rgb(cs.backgroundColor),im=String(cs.backgroundImage||'');
    if(/url\(/.test(im)){var av=imgAvg(im);if(!av)return null;if(av.a>=.97){base=av;break}layers.push(av)}
    else if(d===0){var g=im.match(/rgba?\([^)]+\)|color\(srgb[^)]+\)/g);if(g){var cols=g.map(rgb).filter(function(x){return x&&x.a>.6});if(cols.length){var sm={r:0,g:0,b:0,a:1};cols.forEach(function(x){sm.r+=x.r;sm.g+=x.g;sm.b+=x.b});sm.r/=cols.length;sm.g/=cols.length;sm.b/=cols.length;base=sm;break}}}
    if(c&&c.a>=.99){base=c;break}if(c&&c.a>.01)layers.push(c);n=n.parentElement;d++}
  if(!base)return null;for(var i=layers.length-1;i>=0;i--)base=over(layers[i],base);return base}
var BLACK={r:26,g:18,b:6},WHITE={r:255,g:255,b:255},CREAM={r:251,g:243,b:231};
function best(cur,bg){var lightBg=lum(bg)>.4;
  if(cur&&cr(cur,bg)>=2.2){var tgt=lightBg?BLACK:WHITE;for(var t=.15;t<=.85;t+=.1){var m=mix(cur,tgt,t);if(cr(m,bg)>=4.6)return m}}
  var br=0,out=BLACK;[BLACK,WHITE,CREAM].forEach(function(c){var r=cr(c,bg);if(r>br){br=r;out=c}});return out}
/* مسار CSS ثابت للعنصر (للتسجيل والخَبز في app49.css بواسطة tools/qa/bake-contrast.mjs) */
function cssPath(e){var segs=[],n=e,d=0;while(n&&n.nodeType===1&&d<5){var seg=n.tagName.toLowerCase();String(n.className&&n.className.baseVal!==undefined?'':n.className).split(/\s+/).filter(Boolean).forEach(function(c){seg+='.'+(window.CSS&&CSS.escape?CSS.escape(c):c)});if(n.id){seg='#'+n.id+seg.slice(n.tagName.length);segs.unshift(seg);break}segs.unshift(seg);n=n.parentElement;d++}return segs.join(' > ')}
function fix(){try{if(localStorage.getItem('rafeeq_nofix')==='1')return}catch(x){}document.querySelectorAll(SEL).forEach(function(e){try{if(!e.getClientRects().length||e.closest('#v302Bar,#dmRoot'))return;if(e.closest('#uNav')&&document.documentElement.getAttribute('data-nh')==='lamp')return;
    var tx=(e.textContent||'').trim();if(!tx)return;var bg=bgOf(e);if(!bg)return;var cur=rgb(getComputedStyle(e).color);
    if(cur&&cur.a>.5&&cr(cur,bg)>=4.5)return;
    if(!e.__pgo)e.__pgo=cur;
    var c=best(e.__pgo||cur,bg);if(cur&&(cur.r|0)===(c.r|0)&&(cur.g|0)===(c.g|0)&&(cur.b|0)===(c.b|0))return;e.style.setProperty('color','rgb('+(c.r|0)+','+(c.g|0)+','+(c.b|0)+')','important');e.style.setProperty('transition','none','important');var L=window.__rfFixLog=window.__rfFixLog||{},pth=cssPath(e);(L[pth]=L[pth]||{})['rgb('+(c.r|0)+','+(c.g|0)+','+(c.b|0)+')']=1}catch(x){}})}
var t=0;function sch(){clearTimeout(t);t=setTimeout(fix,160)}
new MutationObserver(sch).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
new MutationObserver(sch).observe(document.documentElement,{attributes:true,attributeFilter:['data-rf-theme','data-design','data-nh','data-pg']});
setTimeout(fix,900);setInterval(fix,1500);
})();

/* شريط علوي بشفافية ٥٠٪ مع تغبيش في كل التصاميم: نقرأ لونه الأصلي لكل ثيم ونحفظه كمتغير */
(function(){
var NEW4=/^(holy|lamp|royal|shroud)$/;
function parse(c){var m=String(c||'').match(/^rgba?\(([^)]+)\)/);if(m){var a=m[1].split(/[ ,\/]+/).map(Number);return [a[0],a[1],a[2],a.length>3?a[3]:1]}
  m=String(c||'').match(/^color\(srgb\s+([^)]+)\)/);if(m){var b=m[1].split(/[ \/]+/).map(Number);return [Math.round(b[0]*255),Math.round(b[1]*255),Math.round(b[2]*255),b.length>3?b[3]:1]}return null}
function run(){var h=document.documentElement,t=document.getElementById('uTop');if(!t)return;
  var nh=h.getAttribute('data-nh');if(nh===null||NEW4.test(nh))return;
  h.removeAttribute('data-hdr50');var c=parse(getComputedStyle(t).backgroundColor);
  if(c&&c[3]>.5){var L=function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};var lm=.2126*L(c[0])+.7152*L(c[1])+.0722*L(c[2]);var lightMode=h.getAttribute('data-design')==='2';h.style.setProperty('--pg-hdr-a',(lm<.12&&lightMode)?'72%':'50%');h.style.setProperty('--pg-hdr','rgb('+c[0]+','+c[1]+','+c[2]+')');h.setAttribute('data-hdr50','1')}}
var tm=0;function sch(){clearTimeout(tm);tm=setTimeout(run,120)}
new MutationObserver(sch).observe(document.documentElement,{attributes:true,attributeFilter:['data-rf-theme','data-design','data-nh','style']});
document.addEventListener('DOMContentLoaded',sch);setTimeout(run,900);setTimeout(run,2600);
})();
