/* v6.13 — رحلات الكتاب المقدس والكنيسة: درب صعود بمحطات، لكل يوم قراءة وموقف ودرس وسؤال ومهمة. شاشة «رحلاتي» وشارات الإتمام. كل شيء على جهازك. */
(function(){
"use strict";
var K='rafeeq_prog_v1',AR='٠١٢٣٤٥٦٧٨٩';
var CATS=[['person','شخصيات الكتاب','👤'],['topic','موضوعات روحية','🕊'],['church','من الكنيسة والتقليد','⛪'],['season','رحلات المواسم','📅']];
function ar(n){return String(n).replace(/\d/g,function(d){return AR[d]})}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function F(){return window.__F||{}}
function q(s,r){return (r||document).querySelector(s)}
function PG(){return window.__progData||{}}
function IDS(){return Object.keys(PG())}
function N(id){return (PG()[id]&&PG()[id].days.length)||40}
function load(){var v;try{v=JSON.parse(localStorage.getItem(K)||'null')}catch(e){}v=v||{};IDS().forEach(function(i){v[i]=v[i]||{done:{},notes:{}};v[i].done=v[i].done||{};v[i].notes=v[i].notes||{}});return v}
function save(s){try{localStorage.setItem(K,JSON.stringify(s))}catch(e){}}
var MN=['المحطة الأولى','منتصف الرحلة','قرب القمة','القمة'];
function mileOf(id,d){var n=N(id);for(var k=1;k<=4;k++)if(d===Math.ceil(n*k/4))return MN[k-1];return ''}
function stageOf(p,d){return p.stages[Math.min(3,Math.floor((d-1)*4/p.days.length))]}
function cur(s,id){var n=N(id);for(var i=1;i<=n;i++)if(!s[id].done[i])return i;return n+1}
function doneCount(s,id){var n=0,m=N(id);for(var i=1;i<=m;i++)if(s[id].done[i])n++;return n}
function lastTs(s,id){var m=0;for(var k in s[id].done)m=Math.max(m,s[id].done[k]);return m}
function lastId(s){var best=null,t=0;IDS().forEach(function(i){var m=lastTs(s,i);if(m>t){t=m;best=i}});return best}
function finished(s,id){return cur(s,id)>N(id)}
var active='joseph',tab='mine';
/* معايرة ألوان النص على ألوان التصميم الحالي: لون التشديد للنص، ولون النص فوق الأسطح الملوّنة */
function calib(){try{var d=document.documentElement,pr=document.createElement('div');pr.style.cssText='position:fixed;left:-9px;top:0;width:1px;height:1px';document.body.appendChild(pr);
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
  return '<button type="button" class="pg-card'+(finished(s,id)?' fin':'')+'" data-prog="'+id+'"><i>'+p.icon+'</i><span><b>'+esc(p.title)+'</b><small>'+esc(p.sub)+'</small>'+(dn?'<u><s style="width:'+pct+'%"></s></u>':'')+'<em>'+(dn===0?ar(n)+' يومًا'+(p.season?' · '+esc(p.season):''):(finished(s,id)?'🏅 أتممتَ الرحلة':'اليوم '+ar(c)+' من '+ar(n)))+'</em></span><strong>‹</strong></button>'}
function started(s){return IDS().filter(function(i){return doneCount(s,i)>0}).sort(function(a,b){return lastTs(s,b)-lastTs(s,a)})}
window.__progCard=function(){var s=load(),st=started(s),id=st.filter(function(i){return !finished(s,i)})[0]||st[0],p=PG()[id];
  if(!id||!p)return '<button type="button" class="pg-home" data-prog="hub"><i>🏔</i><span><b>رحلات ٤٠ يومًا وأكثر</b><small>شخصيات · موضوعات · مواسم</small></span><em>‹</em></button>';
  var c=cur(s,id),n=N(id);
  return '<button type="button" class="pg-home" data-prog="hub"><i>'+p.icon+'</i><span><b>رحلاتي</b><small>'+esc(p.short)+' — '+(c>n?'أتممتها 🏅':'اليوم '+ar(c)+' من '+ar(n))+'</small></span><em>‹</em></button>'};
/* ---------- المركز داخل الأجبية ---------- */
function paintHub(){var h=document.getElementById('progHub');if(!h)return;calib();var s=load(),st=started(s).filter(function(i){return !finished(s,i)}).slice(0,3);
  var list=st.length?st:['joseph','peter','psalms'];
  h.innerHTML='<h3>🏔 رحلاتي</h3><p>'+(st.length?'تابع من حيث وقفت.':'ابدأ رحلة: كل يوم قراءة وتأمل وسؤال ومهمة صغيرة.')+'</p>'+list.map(function(i){return card(s,i)}).join('')+'<button type="button" class="pg-all" data-prog="hub">كل الرحلات ('+ar(IDS().length)+') والشارات ‹</button>'}
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
  var nodes='',labels='',stPrev=-1;
  for(var d=1;d<=n;d++){var pt=pts[d-1],state=s[active].done[d]?'done':(d===c?'now':(d<c?'done':'lock')),mil=mileOf(active,d),sIdx=Math.min(3,Math.floor((d-1)*4/n));
    nodes+='<button type="button" class="nd '+state+(mil?' mil':'')+'" style="left:'+pt[0].toFixed(1)+'px;top:'+pt[1].toFixed(1)+'px" data-pgd="'+d+'" aria-label="اليوم '+d+'"><i>'+(state==='done'?'✓':ar(d))+'</i>'+(state==='now'?'<u></u>':'')+'</button>';
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
  if(open){var y=pts[Math.min(c,n)-1][1];requestAnimationFrame(function(){pgEl.scrollTop=Math.max(0,y-pgEl.clientHeight*.55)})}else pgEl.scrollTop=sc}
function pgBox(){var e=document.getElementById('progPage');if(!e){e=document.createElement('div');e.id='progPage';e.setAttribute('role','dialog');e.setAttribute('aria-modal','true');document.body.appendChild(e)}return e}
/* ---------- شاشة «رحلاتي» ---------- */
function badges(s){var out='';IDS().forEach(function(i){var p=PG()[i],ok=finished(s,i);out+='<div class="pg-bd'+(ok?' on':'')+'" title="'+esc(p.title)+'"><i>'+(ok?p.icon:'🔒')+'</i><small>'+esc(p.short)+'</small></div>'});return out}
function hubPage(t){calib();if(t)tab=t;var s=load(),all=IDS(),st=started(s),run=st.filter(function(i){return !finished(s,i)}),fin=st.filter(function(i){return finished(s,i)});
  var days=0;all.forEach(function(i){days+=doneCount(s,i)});
  var body='';
  if(tab==='mine'){
    body+='<div class="pg-stats"><div><b>'+ar(days)+'</b><small>يومًا مكتملًا</small></div><div><b>'+ar(run.length)+'</b><small>رحلة جارية</small></div><div><b>'+ar(fin.length)+'</b><small>رحلة مكتملة</small></div></div>';
    body+=run.length?'<h3>جارية</h3>'+run.map(function(i){return card(s,i)}).join(''):'<p class="pg-em">لم تبدأ رحلة بعد. اختر من «كل الرحلات».</p>';
    if(fin.length)body+='<h3>مكتملة</h3>'+fin.map(function(i){return card(s,i)}).join('');
    var sug=all.filter(function(i){return doneCount(s,i)===0}).slice(0,3);if(sug.length)body+='<h3>اقتراح لك</h3>'+sug.map(function(i){return card(s,i)}).join('')}
  else if(tab==='all'){CATS.forEach(function(c){var ids=all.filter(function(i){return PG()[i].cat===c[0]});if(ids.length)body+='<h3>'+c[2]+' '+c[1]+'</h3>'+ids.map(function(i){return card(s,i)}).join('')})}
  else{body+='<p class="pg-em">كل رحلة تكملها تمنحك شارة. أكمل أيامها كلها لتفتح الشارة.</p><div class="pg-bds">'+badges(s)+'</div>'}
  var tabs=[['mine','رحلاتي'],['all','كل الرحلات'],['bd','الشارات']].map(function(x){return '<button type="button" class="'+(tab===x[0]?'on':'')+'" data-pgtab="'+x[0]+'">'+x[1]+'</button>'}).join('');
  var e=pgBox();e.innerHTML='<button type="button" class="pg-x" data-pgclose="1" aria-label="إغلاق">✕</button><div class="pg-hubp"><h2>🏔 رحلات الكتاب المقدس</h2><div class="pg-tabs">'+tabs+'</div>'+body+'</div>';e.className='prg-page on';document.body.classList.add('nh-lock');e.scrollTop=0}
function closePage(){var p=document.getElementById('progPage');if(p)p.classList.remove('on');var d=document.getElementById('progDay');if(d)d.classList.remove('on');if(!document.querySelector('#nhPage.on'))document.body.classList.remove('nh-lock');paintHub()}
/* ---------- بطاقة اليوم ---------- */
function openDay(d){calib();var p=PG()[active],s=load(),c=cur(s,active),n=N(active);if(d>c){var t=F().toast;t&&t('كمّل اليوم '+ar(c)+' الأول');return}
  var it=p.days[d-1],b=F().bible,done=!!s[active].done[d],st=stageOf(p,d),L=p.labels;
  var el=document.getElementById('progDay');if(!el){el=document.createElement('div');el.id='progDay';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');document.body.appendChild(el)}
  function sec(lbl,txt){return txt?'<section class="pd-r"><h4>'+esc(lbl)+'</h4><p>'+esc(txt)+'</p></section>':''}
  function paint(psalm){
    el.innerHTML='<button type="button" class="pg-x" data-pgback="1" aria-label="رجوع">‹ الدرب</button><div class="pd-c"><small>'+st[2]+' اليوم '+ar(d)+' من '+ar(n)+' · '+esc(st[0])+'</small><h2>'+esc(it[0])+'</h2>'+
      '<article class="pd-v">'+psalm+'</article>'+
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
  if(b=t.closest('[data-prog]')){e.preventDefault();e.stopPropagation();var id=b.getAttribute('data-prog');try{F().closeSheet()}catch(x){};if(id==='hub'||!PG()[id]){hubPage(started(load()).length?'mine':'all')}else{active=id;render(true)}return}
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
window.__prog={tab:showJourneys,open:function(id){active=id||'joseph';render(true)},hub:hubPage,day:openDay,close:closePage};
})();
