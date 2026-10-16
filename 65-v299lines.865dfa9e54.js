/* v2.99 — «الجملة اللي وقفتني»: ضغط مطوّل على سطر في الأجبية يحفظه مع ملاحظة اختيارية */
(function(){
'use strict';
var LK='rafeeq_lines_v1', HK='rafeeq_lines_hint_v1', SEL='#view-agpeya .scripture p, #view-agpeya .closing p';
function $(i){return document.getElementById(i)}
function rd(k){try{return localStorage.getItem(k)}catch(e){return null}}
function wr(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function list(){try{var a=JSON.parse(rd(LK)); return Array.isArray(a)?a:[]}catch(e){return []}}
function save(a){wr(LK,JSON.stringify(a))}
function norm(s){return String(s||'').replace(/\s+/g,' ').trim()}
function idOf(t){t=norm(t).replace(/[ً-ْـ]/g,'').slice(0,160);var h=0;for(var i=0;i<t.length;i++){h=(h*31+t.charCodeAt(i))|0}return 'l'+(h>>>0).toString(36)}
function find(id){var a=list();for(var i=0;i<a.length;i++) if(a[i].id===id) return a[i];return null}
function F(){return window.__F}
function toast(m,o){try{F()&&F().toast(m,o)}catch(e){}}
function ctx(p){
  var K=window.__k, hr='', st=null;
  try{st=K&&K.getState&&K.getState(); var H=K&&K.HOURS&&st&&K.HOURS[st.hour]; if(H) hr=H.label;}catch(e){}
  var card=p.closest&&p.closest('.content-card'), h2=card&&card.querySelector('h2'), ref=card&&card.querySelector('.ref');
  return {h:hr, c:h2?norm(h2.textContent):(p.closest('.closing')?'الختام':''), r:ref?norm(ref.textContent):''};
}
/* ---- تمييز المحفوظ ---- */
var tm=0;
function mark(){
  clearTimeout(tm); tm=setTimeout(function(){
    var saved={}; list().forEach(function(x){saved[x.id]=1});
    document.querySelectorAll(SEL).forEach(function(p){
      p.classList.toggle('v299-saved',!!saved[idOf(p.textContent)]);
    });
    hint();
  },180);
}
function hint(){
  var pg=$('page-pray'); if(!pg||!pg.classList.contains('on')||rd(HK)) return;
  if(document.querySelector(SEL)){ wr(HK,'1'); setTimeout(function(){toast('💡 اضغط مطوّلًا على أي سطر في الصلاة لتحفظه في «جمل لمستني»')},1200); }
}
/* ---- الورقة ---- */
var cur=null;
function ensure(){
  var s=$('v299Sheet'); if(s) return s;
  s=document.createElement('div'); s.id='v299Sheet'; s.hidden=true;
  s.innerHTML='<div class="v299-bd"></div><div class="v299-box" role="dialog" aria-modal="true" aria-label="حفظ الجملة">'+
   '<div class="v299-h">✨ الجملة اللي وقفتني</div><blockquote class="v299-q" id="v299Q"></blockquote><div class="v299-s" id="v299S"></div>'+
   '<label class="v299-l" for="v299N">إيه اللي وقفك فيها؟ <small>(اختياري)</small></label>'+
   '<textarea id="v299N" rows="2" maxlength="300" placeholder="سطر بكلامك إنت…"></textarea>'+
   '<div class="v299-a"><button type="button" class="v299-ok" id="v299Ok">حفظ</button><button type="button" class="v299-rm" id="v299Rm">إزالة</button><button type="button" class="v299-x" id="v299X">إلغاء</button></div></div>';
  document.body.appendChild(s);
  s.querySelector('.v299-bd').addEventListener('click',close);
  s.querySelector('.v299-bd').addEventListener('touchmove',function(e){e.preventDefault()},{passive:false});
  $('v299X').addEventListener('click',close);
  $('v299Ok').addEventListener('click',function(){
    if(!cur) return; var a=list(), n=norm($('v299N').value), ex=null;
    a.forEach(function(x){if(x.id===cur.id) ex=x});
    if(ex){ex.n=n} else {a.unshift({id:cur.id,t:cur.t,h:cur.h,c:cur.c,r:cur.r,n:n,ts:Date.now()})}
    save(a); close(); mark(); toast(ex?'تم تحديث ملاحظتك':'★ حُفظت في «جمل لمستني» (المفضلة)');
  });
  $('v299Rm').addEventListener('click',function(){
    if(!cur) return; var id=cur.id, raw=rd(LK);
    save(list().filter(function(x){return x.id!==id})); close(); mark();
    toast('أُزيلت الجملة',{undo:function(){wr(LK,raw||'[]');mark()}});
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!s.hidden) close()});
  return s;
}
function open(p){
  var t=norm(p.textContent); if(t.length<4) return;
  var s=ensure(), id=idOf(t), ex=find(id), c=ctx(p);
  cur={id:id,t:t,h:c.h,c:c.c,r:c.r};
  $('v299Q').textContent='«'+t+'»';
  $('v299S').textContent=[c.h&&('صلاة '+c.h),c.c].filter(Boolean).join(' · ');
  $('v299N').value=ex?ex.n||'':'';
  $('v299Ok').textContent=ex?'تحديث':'حفظ';
  $('v299Rm').style.display=ex?'':'none';
  s.hidden=false; requestAnimationFrame(function(){s.classList.add('on')});
  try{window.getSelection().removeAllRanges()}catch(e){}
}
function close(){var s=$('v299Sheet'); if(!s) return; s.classList.remove('on'); setTimeout(function(){s.hidden=true},180); cur=null}
/* ---- الضغط المطوّل ---- */
var timer=0, sx=0, sy=0, fired=false;
function clearT(){clearTimeout(timer);timer=0}
document.addEventListener('touchstart',function(e){
  var p=e.target.closest&&e.target.closest(SEL); if(!p||e.touches.length!==1) return;
  sx=e.touches[0].clientX; sy=e.touches[0].clientY; fired=false; clearT();
  timer=setTimeout(function(){fired=true; try{navigator.vibrate&&navigator.vibrate(18)}catch(e){} open(p)},520);
},{passive:true});
document.addEventListener('touchmove',function(e){
  if(!timer) return; var t=e.touches[0]; if(Math.abs(t.clientX-sx)>10||Math.abs(t.clientY-sy)>10) clearT();
},{passive:true});
['touchend','touchcancel'].forEach(function(n){document.addEventListener(n,clearT,{passive:true})});
document.addEventListener('click',function(e){ if(fired){ fired=false; if(e.target.closest&&e.target.closest(SEL)){e.preventDefault();e.stopPropagation()} } },true);
document.addEventListener('contextmenu',function(e){
  var p=e.target.closest&&e.target.closest(SEL); if(p){ e.preventDefault(); open(p); }
});
window.__lines={list:list,key:LK,idOf:idOf};
function boot(){
  var v=$('view-agpeya')||document.body;
  new MutationObserver(mark).observe(document.body,{childList:true,subtree:true});
  mark();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
