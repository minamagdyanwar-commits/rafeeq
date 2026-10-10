
(function(){
'use strict';
var F=window.__F; if(!F) return;
function $(i){return document.getElementById(i)}
var t0=Date.now(), tT;
/* ---- إشعار مع «تراجع» ---- */
F.toast=function(msg,o){
  var t=$('uToast'); if(!t) return; o=o||{};
  clearTimeout(tT); t.textContent='';
  var sp=document.createElement('span'); sp.textContent=msg; t.appendChild(sp);
  t.classList.toggle('act',!!o.undo);
  if(o.undo){
    var b=document.createElement('button'); b.type='button'; b.className='v67undo'; b.textContent='تراجع';
    b.onclick=function(e){ e.stopPropagation(); clearTimeout(tT); t.classList.remove('on','act'); try{o.undo()}catch(x){} F.toast('تمت الاستعادة'); };
    t.appendChild(b);
  }
  t.classList.add('on');
  tT=setTimeout(function(){t.classList.remove('on','act')}, o.undo?6000:Math.max(2400,Math.min(6000,String(msg).length*70)));
};
window.__say=function(m){ F.toast(m) };
window.__copyFallback=function(txt){
  F.sheet('<div class="v67cp"><b>انسخ النص يدويًا</b><textarea id="v67ta" readonly></textarea><button type="button" class="u-wide" onclick="__F.closeSheet()">تم</button></div>');
  var ta=$('v67ta'); if(ta){ ta.value=txt; setTimeout(function(){ try{ta.focus();ta.select()}catch(e){} },60); }
};
/* ---- قارئ الشاشة ---- */
var lr=document.createElement('div'); lr.id='v67live'; lr.className='v67sr'; lr.setAttribute('role','status'); lr.setAttribute('aria-live','polite'); lr.setAttribute('aria-atomic','true');
document.body.appendChild(lr);
function announce(m){ lr.textContent=''; setTimeout(function(){ lr.textContent=m },80); }
var lastPage='';
function pageWatch(){
  var on=document.querySelector('.u-page.on'); if(!on) return;
  if(on.id!==lastPage){
    var first=!lastPage; lastPage=on.id;
    if(!first && Date.now()-t0>1500) setTimeout(function(){ var ti=$('uTitle'); if(ti&&ti.textContent) announce(ti.textContent) },150);
  }
  document.querySelectorAll('#uNav [data-go]').forEach(function(b){
    if(b.classList.contains('on')) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
  });
  msgSeenCheck();
}
var mo=new MutationObserver(pageWatch);
document.querySelectorAll('.u-page').forEach(function(p){ mo.observe(p,{attributes:true,attributeFilter:['class']}) });
var nv=$('uNav'); if(nv) mo.observe(nv,{attributes:true,subtree:true,attributeFilter:['class']});
/* نافذة الورقة: تركيز + Escape */
var sh=$('uSheet'), prevFocus=null;
if(sh){
  new MutationObserver(function(){
    var card=sh.querySelector('.u-sheet-card');
    if(sh.classList.contains('on')){
      if(!prevFocus) prevFocus=document.activeElement;
      if(card){ card.setAttribute('tabindex','-1'); setTimeout(function(){ try{ if(!card.contains(document.activeElement)) card.focus({preventScroll:true}) }catch(e){} },30); }
    } else if(prevFocus){ var p=prevFocus; prevFocus=null; try{ if(p&&p.focus&&document.contains(p)) p.focus({preventScroll:true}) }catch(e){} }
  }).observe(sh,{attributes:true,attributeFilter:['class']});
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&sh.classList.contains('on')){ F.closeSheet() } });
}
/* ---- نقطة «رسالة اليوم» ---- */
var SEEN='rafeeq_msgseen_v1';
function getSeen(){ try{ return localStorage.getItem(SEEN)||'' }catch(e){ return '' } }
function msgBtns(){ return document.querySelectorAll('[data-go="msg"]') }
function dotRefresh(){
  var show=getSeen()!==F.dkey();
  msgBtns().forEach(function(b){
    var d=b.querySelector('.v67dot');
    if(!d){ d=document.createElement('i'); d.className='v67dot'; d.setAttribute('aria-hidden','true'); b.appendChild(d); if(getComputedStyle(b).position==='static') b.style.position='relative'; }
    d.hidden=!show;
    if(show) b.setAttribute('aria-label','رسالة — رسالة اليوم لم تُقرأ بعد'); else b.removeAttribute('aria-label');
  });
}
function msgSeenCheck(){
  var p=$('page-msg');
  if(p&&p.classList.contains('on')){ try{ localStorage.setItem(SEEN,F.dkey()) }catch(e){} }
  dotRefresh();
}
dotRefresh(); pageWatch();
document.addEventListener('visibilitychange',function(){ if(!document.hidden) dotRefresh() });
setInterval(dotRefresh,60000);
/* ---- اختصارات الشاشة الرئيسية: ?go=pray|msg|read|khalwa ---- */
var m=/[?&]go=([a-z]+)/.exec(location.search);
if(m){
  var g=m[1], n=0;
  (function tryGo(){
    if(!(window.__rafeeq&&window.__k&&document.querySelector('#uNav [data-go]')) && n++<40) return setTimeout(tryGo,150);
    try{
      if(g==='pray') window.__rafeeq.act('hour',{dataset:{key:window.__k.getSuggestedHourKey()}});
      else if(g==='khalwa'&&window.__v14&&window.__v14.start) window.__v14.start();
      else { var b=document.querySelector('#uNav [data-go="'+g+'"]'); if(b) b.click(); }
    }catch(e){}
    try{ history.replaceState(null,'',location.pathname+location.hash) }catch(e){}
  })();
}
})();
