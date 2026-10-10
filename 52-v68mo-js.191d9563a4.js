
(function(){
'use strict';
if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
function $(i){return document.getElementById(i)}
/* ١) فقرات الرسالة */
var mb=$('msgBody'), lastKey='', tm=0;
function msgRun(){
  var d=mb&&mb.querySelector('.mg-date b'); if(!d) return;
  var pg=$('page-msg'), on=pg&&pg.classList.contains('on');
  var key=d.textContent+'|'+(on?1:0);
  if(key===lastKey) return;
  var was=lastKey; lastKey=key;
  if(!on) return;
  var kids=mb.querySelectorAll('.mg-letter>*'); kids.forEach(function(k,i){ k.style.setProperty('--i',Math.min(i,14)) });
  mb.classList.add('v68go'); clearTimeout(tm); tm=setTimeout(function(){ mb.classList.remove('v68go') },2200);
}
if(mb){ new MutationObserver(msgRun).observe(mb,{childList:true}); var pm=$('page-msg'); if(pm) new MutationObserver(msgRun).observe(pm,{attributes:true,attributeFilter:['class']}); }
/* ٣) المؤشر المنزلق */
var nav=$('uNav');
function place(instant){
  if(!nav) return;
  var cls=document.documentElement.dataset.layout;
  var classic=!cls||cls==='classic';
  var b=nav.querySelector('button.on'); var nr=nav.getBoundingClientRect(), r=b&&b.getBoundingClientRect();
  if(!classic||!b||!r.width||!nr.width){ nav.classList.remove('v68s'); return; }
  if(instant) nav.classList.add('v68nt');
  nav.classList.add('v68s');
  nav.style.setProperty('--v68w',(r.width*.48)+'px'); nav.style.setProperty('--v68x',(r.left-nr.left+r.width*.26)+'px');
  if(instant){ void nav.offsetWidth; nav.classList.remove('v68nt'); }
}
if(nav){
  new MutationObserver(function(ms){ if(ms.every(function(m){return m.target===nav})) return; place(false) }).observe(nav,{attributes:true,subtree:true,attributeFilter:['class']});
  new MutationObserver(function(){ place(true) }).observe(document.documentElement,{attributes:true,attributeFilter:['data-layout','class','data-design']});
  new MutationObserver(function(){ place(true) }).observe(document.body,{attributes:true,attributeFilter:['class']});
  window.addEventListener('resize',function(){ place(true) });
  setTimeout(function(){ place(true) },300); setTimeout(function(){ place(true) },1200);
}
/* ٤) نبضة ✓ */
document.addEventListener('click',function(e){
  var el=e.target.closest&&e.target.closest('[data-chk],[data-hk]'); if(!el) return;
  var sel=el.hasAttribute('data-chk')?'[data-chk="'+el.getAttribute('data-chk')+'"]':'[data-hk="'+el.getAttribute('data-hk')+'"]';
  setTimeout(function(){
    document.querySelectorAll(sel).forEach(function(n){
      if(n.getAttribute('aria-pressed')==='true'||n.classList.contains('on')||n.classList.contains('done')||/✓|☑/.test(n.textContent||'')){ n.classList.remove('v68pop'); void n.offsetWidth; n.classList.add('v68pop'); setTimeout(function(){ n.classList.remove('v68pop') },600); }
    });
  },60);
},true);
})();
