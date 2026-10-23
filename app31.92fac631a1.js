/* v6.2 — يربط شريط تقدّم «متابعتي اليوم» بحالة الأزرار (aria-pressed)؛ لا يغيّر أي بيانات محفوظة */
(function(){
  var raf=0;
  function sync(){
    raf=0;
    var s=document.querySelector('#page-home .hm-prog'); if(!s) return;
    var cks=s.querySelectorAll('.hm-ck'), n=0;
    cks.forEach(function(b){
      var on=b.getAttribute('aria-pressed')==='true'; if(on) n++;
      if(b.parentNode) b.parentNode.setAttribute('data-done',on?'1':'0');
    });
    s.style.setProperty('--p',cks.length?(n/cks.length).toFixed(3):'0');
    s.classList.toggle('rf-complete',cks.length>0&&n===cks.length);
  }
  function q(){ if(!raf) raf=requestAnimationFrame(sync); }
  function start(){
    var h=document.getElementById('page-home'); if(!h) return;
    new MutationObserver(q).observe(h,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-pressed']});
    sync();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
