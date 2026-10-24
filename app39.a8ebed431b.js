/* v6.12 — رحلات الـ٤٠ يومًا: درب صعود بمحطات، لكل يوم قراءة وموقف وتصرّف ودرس وسؤال ومهمة. يوسف · بطرس · ثمر الروح · المزامير. كل شيء على جهازك. */
(function(){
"use strict";
var K='rafeeq_prog_v1',AR='٠١٢٣٤٥٦٧٨٩',IDS=['joseph','peter','fruit','psalms'];
function ar(n){return String(n).replace(/\d/g,function(d){return AR[d]})}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function F(){return window.__F||{}}
function q(s,r){return (r||document).querySelector(s)}
function PG(){return window.__progData||{}}
function load(){var v;try{v=JSON.parse(localStorage.getItem(K)||'null')}catch(e){}v=v||{};IDS.forEach(function(i){v[i]=v[i]||{done:{},notes:{}};v[i].done=v[i].done||{};v[i].notes=v[i].notes||{}});return v}
function save(s){try{localStorage.setItem(K,JSON.stringify(s))}catch(e){}}
var MILE={10:'نهاية المرحلة ١',20:'منتصف الرحلة',30:'قرب القمة',40:'القمة'};
function stageOf(p,d){return p.stages[Math.min(3,Math.floor((d-1)/10))]}
function cur(s,id){for(var i=1;i<=40;i++)if(!s[id].done[i])return i;return 41}
function doneCount(s,id){var n=0;for(var i=1;i<=40;i++)if(s[id].done[i])n++;return n}
function lastId(s){var best=null,t=0;IDS.forEach(function(i){var m=0;for(var k in s[i].done)m=Math.max(m,s[i].done[k]);if(m>t){t=m;best=i}});return best}
var active='joseph';
/* ---------- بطاقات الاختيار ---------- */
function cards(s){return IDS.map(function(id){var p=PG()[id];if(!p)return'';var c=cur(s,id),dn=doneCount(s,id),pct=Math.round(dn*2.5);
  return '<button type="button" class="pg-card" data-prog="'+id+'"><i>'+p.icon+'</i><span><b>'+esc(p.title)+'</b><small>'+esc(p.sub)+'</small><u><s style="width:'+pct+'%"></s></u><em>'+(dn===0?'لم تبدأ بعد':(c>40?'أتممتَ الرحلة 🎉':'اليوم '+ar(c)+' من ٤٠'))+'</em></span><strong>‹</strong></button>'}).join('')}
window.__progCard=function(){var s=load(),id=lastId(s)||'joseph',p=PG()[id];if(!p)return'';var c=cur(s,id),dn=doneCount(s,id);
  return '<button type="button" class="pg-home" data-prog="hub"><i>'+p.icon+'</i><span><b>رحلات ٤٠ يومًا</b><small>'+(dn===0?'يوسف · بطرس · ثمر الروح · المزامير':esc(p.short)+' — '+(c>40?'أتممتها 🎉':'اليوم '+ar(c)+' من ٤٠'))+'</small></span><em>‹</em></button>'};
/* ---------- المركز داخل الأجبية ---------- */
function paintHub(){var h=document.getElementById('progHub');if(!h)return;h.innerHTML='<h3>🏔 رحلات ٤٠ يومًا</h3><p>اختر رحلة، وكل يوم: قراءة وتأمل وسؤال ومهمة صغيرة.</p>'+cards(load())}
function mountHub(){var v=document.getElementById('view-meditation');if(!v)return;
  var tab=document.getElementById('tabMeditation');if(tab&&tab.textContent.indexOf('الرحلات')<0)tab.textContent='🏔 الرحلات';
  if(!document.getElementById('progHub')){var h=document.createElement('div');h.id='progHub';v.insertBefore(h,v.firstChild);paintHub();
    var sp=document.createElement('div');sp.id='progOldTitle';sp.textContent='تأمل اليوم';h.after(sp)}}
/* ---------- الصفحة ---------- */
var H=74,ST=180;
function pos(i,W){var x=W*(.5+.3*Math.sin((i-1)*.85)),y=ST+(40-i)*H+40;return [x,y]}
function render(open){
  var p=PG()[active],s=load(),c=cur(s,active),dn=doneCount(s,active),pct=Math.round(100*dn/40),W=Math.min(window.innerWidth,520),totalH=ST+40*H+120;
  var pts=[];for(var i=1;i<=40;i++)pts.push(pos(i,W));
  var path='M'+pts[0][0].toFixed(1)+' '+pts[0][1].toFixed(1);
  for(var j=1;j<pts.length;j++){var a=pts[j-1],b=pts[j],my=(a[1]+b[1])/2;path+=' C'+a[0].toFixed(1)+' '+my.toFixed(1)+' '+b[0].toFixed(1)+' '+my.toFixed(1)+' '+b[0].toFixed(1)+' '+b[1].toFixed(1)}
  var nodes='',labels='';
  for(var d=1;d<=40;d++){var pt=pts[d-1],state=s[active].done[d]?'done':(d===c?'now':(d<c?'done':'lock')),mil=MILE[d];
    nodes+='<button type="button" class="nd '+state+(mil?' mil':'')+'" style="left:'+pt[0].toFixed(1)+'px;top:'+pt[1].toFixed(1)+'px" data-pgd="'+d+'" aria-label="اليوم '+d+'"><i>'+(state==='done'?'✓':ar(d))+'</i>'+(state==='now'?'<u></u>':'')+'</button>';
    if(mil||d===1){var st=stageOf(p,d);labels+='<div class="lb" style="top:'+(pt[1]-(mil?64:66))+'px"><span>'+(mil?st[2]+' '+MILE[d]:st[2]+' '+st[0])+'</span></div>'}
    if(d%10===1&&d>1){var st2=stageOf(p,d);labels+='<div class="sg" style="top:'+(pt[1]-62)+'px">'+st2[2]+' '+esc(st2[0])+' — '+esc(st2[1])+'</div>'}}
  var r=34,C=2*Math.PI*r,off=C*(1-pct/100);
  var h='<button type="button" class="pg-x" data-pgclose="1" aria-label="إغلاق">✕</button>'+
   '<header class="pg-hd"><div class="pg-ring"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="'+r+'" class="t"/><circle cx="40" cy="40" r="'+r+'" class="p" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'"/></svg><b>'+ar(pct)+'٪</b></div>'+
   '<div class="pg-tt"><small>رحلة</small><h2>'+esc(p.title)+'</h2><p>'+(c>40?'أتممتَ الرحلة كلها 🎉':'اليوم '+ar(c)+' · '+esc(stageOf(p,c)[0])+' · '+esc(stageOf(p,c)[1]))+'</p></div></header>'+
   '<div class="pg-path" style="height:'+totalH+'px"><svg class="pg-line" viewBox="0 0 '+W+' '+totalH+'" width="'+W+'" height="'+totalH+'" preserveAspectRatio="xMidYMin meet"><path d="'+path+'" class="bg"/><path d="'+path+'" class="fg" pathLength="1" stroke-dasharray="1" stroke-dashoffset="'+(1-Math.min(1,Math.max(0,(Math.min(dn,40))/39))).toFixed(3)+'"/></svg>'+labels+nodes+'<div class="pg-top">👑 القمة</div></div>'+
   (dn>0?'<button type="button" class="pg-rs" data-pgreset="1">إعادة الرحلة من البداية</button>':'<div style="height:110px"></div>');
  var pgEl=document.getElementById('progPage');if(!pgEl){pgEl=document.createElement('div');pgEl.id='progPage';pgEl.setAttribute('role','dialog');pgEl.setAttribute('aria-modal','true');document.body.appendChild(pgEl)}
  var sc=pgEl.scrollTop;pgEl.innerHTML=h;pgEl.className='prg-page on';document.body.classList.add('nh-lock');
  if(open){var tgt=Math.min(c,40),y=pts[tgt-1][1];requestAnimationFrame(function(){pgEl.scrollTop=Math.max(0,y-pgEl.clientHeight*.55)})}else pgEl.scrollTop=sc}
function hubPage(){var s=load(),pgEl=document.getElementById('progPage');if(!pgEl){pgEl=document.createElement('div');pgEl.id='progPage';pgEl.setAttribute('role','dialog');pgEl.setAttribute('aria-modal','true');document.body.appendChild(pgEl)}
  pgEl.innerHTML='<button type="button" class="pg-x" data-pgclose="1" aria-label="إغلاق">✕</button><div class="pg-hubp"><h2>🏔 رحلات ٤٠ يومًا</h2><p>اختر رحلة. كل يوم قراءة وتأمل وسؤال ومهمة صغيرة، ويتحفظ تقدمك على جهازك.</p>'+cards(s)+'</div>';pgEl.className='prg-page on';pgEl.scrollTop=0;document.body.classList.add('nh-lock')}
function closePage(){var p=document.getElementById('progPage');if(p)p.classList.remove('on');var d=document.getElementById('progDay');if(d)d.classList.remove('on');if(!document.querySelector('#nhPage.on'))document.body.classList.remove('nh-lock');paintHub()}
/* ---------- بطاقة اليوم ---------- */
function openDay(d){var p=PG()[active],s=load(),c=cur(s,active);if(d>c){var t=F().toast;t&&t('كمّل اليوم '+ar(c)+' الأول');return}
  var it=p.days[d-1],b=F().bible,done=!!s[active].done[d],st=stageOf(p,d),L=p.labels;
  var el=document.getElementById('progDay');if(!el){el=document.createElement('div');el.id='progDay';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');document.body.appendChild(el)}
  function sec(lbl,txt,cls){return txt?'<section class="'+(cls||'pd-r')+'"><h4>'+esc(lbl)+'</h4><p>'+esc(txt)+'</p></section>':''}
  function paint(psalm){
    el.innerHTML='<button type="button" class="pg-x" data-pgback="1" aria-label="رجوع">‹ الدرب</button><div class="pd-c"><small>'+st[2]+' اليوم '+ar(d)+' من ٤٠ · '+esc(st[0])+'</small><h2>'+esc(it[0])+'</h2>'+
      '<article class="pd-v">'+psalm+'</article>'+
      sec(L[0],it[2])+sec(L[1],it[3])+sec(L[2],it[4])+
      '<section class="pd-q"><h4>سؤال اليوم</h4><p>'+esc(it[5])+'</p><textarea id="pdNote" rows="3" maxlength="500" placeholder="اكتب إجابتك — تتحفظ على جهازك فقط">'+esc(s[active].notes[d]||'')+'</textarea></section>'+
      '<section class="pd-t"><i>✦</i><div><h4>مهمة اليوم</h4><p>'+esc(it[6])+'</p></div></section>'+
      '<button type="button" class="pd-ok'+(done?' on':'')+'" data-pgok="'+d+'">'+(done?'✓ أكملت هذا اليوم (اضغط للتراجع)':'أكملت هذا اليوم ✓')+'</button></div>';
    el.className='prg-day on';el.scrollTop=0}
  function psalmHtml(){
    try{var r=b.parseRef(it[1]),txt=b.verses(r.bi,r.ch,r.v1,r.v2),lab=b.label(r.bi,r.ch,r.v1,r.v2);
      return '<p>'+esc(txt.slice(0,6).join(' '))+(txt.length>6?' …':'')+'</p><b>'+esc(lab)+'</b><button type="button" class="pd-open" data-pgopen="'+r.bi+':'+r.ch+':'+(r.v1||1)+'">افتح الفصل في الكتاب المقدس</button>'}catch(e){return '<b>'+esc(it[1])+'</b>'}}
  if(b&&b.load)b.load().then(function(){paint(psalmHtml())},function(){paint('<b>'+esc(it[1])+'</b>')});else paint('<b>'+esc(it[1])+'</b>')}
function closeDay(){var el=document.getElementById('progDay');if(el)el.classList.remove('on')}
/* ---------- قائمة «المزيد» والرئيسية ---------- */
function injectMore(){var box=q('#uSheet .v14-more');if(!box||q('[data-prog="hub"]',box))return;
  var h4=document.createElement('h4');h4.textContent='رحلات';var b=document.createElement('button');b.type='button';b.setAttribute('data-prog','hub');
  b.innerHTML='رحلات ٤٠ يومًا<small>يوسف · بطرس · ثمر الروح · المزامير</small>';
  var first=box.querySelector('h4');box.insertBefore(h4,first);box.insertBefore(b,first)}
function injectHome(){var b=q('#nhHome .nh-body');if(!b)return;var old=q('.pg-home',b);if(old)return;b.insertAdjacentHTML('beforeend',window.__progCard())}
function boot(){injectMore();injectHome();mountHub()}
new MutationObserver(boot).observe(document.body,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',boot);setTimeout(boot,600);
/* ---------- الأحداث ---------- */
document.addEventListener('click',function(e){var t=e.target,b;if(!t.closest)return;
  if(b=t.closest('[data-prog]')){e.preventDefault();e.stopPropagation();var id=b.getAttribute('data-prog');try{F().closeSheet()}catch(x){};if(id==='hub'||!PG()[id]){hubPage()}else{active=id;render(true)}return}
  if(b=t.closest('[data-pgclose]')){closePage();return}
  if(b=t.closest('[data-pgback]')){closeDay();render(false);return}
  if(b=t.closest('[data-pgd]')){openDay(+b.getAttribute('data-pgd'));return}
  if(b=t.closest('[data-pgopen]')){var a=b.getAttribute('data-pgopen').split(':');closeDay();closePage();try{F().openBible(+a[0],+a[1],+a[2])}catch(x){}return}
  if(b=t.closest('[data-pgok]')){var d=+b.getAttribute('data-pgok'),s=load(),note=(q('#pdNote')||{}).value;if(note!=null)s[active].notes[d]=note;
    if(s[active].done[d]){delete s[active].done[d]}else{s[active].done[d]=Date.now();var tt=F().toast;if(MILE[d])tt&&tt('🎉 '+MILE[d]+' — أحسنت!');else tt&&tt('✓ اليوم '+ar(d)+' اكتمل')}
    save(s);closeDay();render(false);var pe=document.getElementById('progPage');if(pe){var nx=Math.min(40,cur(s,active)),y=pos(nx,Math.min(window.innerWidth,520))[1];pe.scrollTo({top:Math.max(0,y-pe.clientHeight*.55),behavior:'smooth'})}
    try{window.__nh&&window.__nh.paint()}catch(x){};return}
  if(b=t.closest('[data-pgreset]')){if(confirm('هتبدأ الرحلة من اليوم الأول وتتمسح إجاباتك. متأكد؟')){var s2=load();s2[active]={done:{},notes:{}};save(s2);render(true)}return}
},true);
document.addEventListener('input',function(e){if(e.target&&e.target.id==='pdNote'){var ok=q('[data-pgok]');if(!ok)return;var d=+ok.getAttribute('data-pgok'),s=load();s[active].notes[d]=e.target.value;save(s)}});
window.__prog={open:function(id){active=id||'joseph';render(true)},hub:hubPage,day:openDay,close:closePage};
})();
