/* v2.98 — قفل التمرير خلف النوافذ، إغلاق صورة المشاركة بـ Escape/الرجوع، وتكبير مساحات اللمس الصغيرة */
(function(){
  'use strict';
  var H=document.documentElement;
  function $(i){return document.getElementById(i)}
  function anyOpen(){
    var s=$('settingsPanel'),sh=$('uSheet'),so=$('uSearchOv'),sp=$('shotOverlay'),hd=$('hoursDrawer');
    return !!((s&&s.classList.contains('open'))||(sh&&sh.classList.contains('on'))||(so&&!so.hidden)||(sp&&sp.classList.contains('open'))||(hd&&hd.classList.contains('open')));
  }
  function sync(){ H.classList.toggle('v298-lock',anyOpen()); }
  var guard=false;
  function boot(){
    var ids=['settingsPanel','uSheet','uSearchOv','shotOverlay','hoursDrawer'];
    var mo=new MutationObserver(sync);
    ids.forEach(function(i){var e=$(i); if(e) mo.observe(e,{attributes:true,attributeFilter:['class','hidden']});});
    sync();
    /* صورة المشاركة: Escape + زر الرجوع */
    var so=$('shotOverlay'),pushed=false;
    if(so){
      new MutationObserver(function(){
        var open=so.classList.contains('open');
        if(open&&!pushed){ try{history.pushState({v298shot:1},'')}catch(e){} pushed=true; }
        else if(!open&&pushed){ pushed=false; if(history.state&&history.state.v298shot){ guard=true; try{history.back()}catch(e){} setTimeout(function(){guard=false},400); } }
      }).observe(so,{attributes:true,attributeFilter:['class']});
      window.addEventListener('popstate',function(){
        if(guard) return;
        if(so.classList.contains('open')){ pushed=false; var b=$('shotCloseBtn'); if(b) b.click(); }
      });
      document.addEventListener('keydown',function(e){
        if(e.key==='Escape'&&so.classList.contains('open')){ var b=$('shotCloseBtn'); if(b) b.click(); }
      });
    }
    /* مساحات لمس صغيرة */
    var t=0;
    function hits(){
      clearTimeout(t); t=setTimeout(function(){
        var pg=document.querySelector('.u-page.on'); if(!pg) return;
        pg.querySelectorAll('button,[role=button],[role=tab]').forEach(function(b){
          if(b.classList.contains('v298-hit')) return;
          var r=b.getBoundingClientRect();
          if(r.width>0&&r.height>0&&(r.height<34||r.width<34)&&getComputedStyle(b).position!=='absolute'&&getComputedStyle(b).position!=='fixed') b.classList.add('v298-hit');
        });
      },250);
    }
    new MutationObserver(hits).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    hits();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
