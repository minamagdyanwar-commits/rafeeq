/* v3.2 — «الجملة اللي وقفتني»: ضغط مطوّل يظلّل الكلمة، سحب يمين/شمال يكمّل التظليل، وعند رفع الإصبع تظهر الاختيارات.
   (القراءات اليومية + الخلوة اليومية — وتم إلغاؤها من الأجبية) */
(function(){
'use strict';
var LK='rafeeq_lines_v1', HK='rafeeq_lines_hint_v2';
var SEL_READ='#page-read .subtitle, #page-read blockquote, #page-read .med-text, #page-read .applybox, #page-read .discussion-text, #page-read .book-info-summary';
var SEL_MED='#view-meditation .verse-text, #view-meditation .reflect-text, #view-meditation .deep-text, #view-meditation .prayer-text';
var SEL=SEL_READ+', '+SEL_MED;
var KIND=[['verse-text','آية'],['reflect-text','تأمل'],['deep-text','تعمّق'],['prayer-text','صلاة'],['psalm','مزمور'],['blockquote','إنجيل'],['med-text','تأمل'],['applybox','تطبيق'],['discussion-text','للنقاش'],['subtitle','القراءة'],['book-info-summary','عن السفر']];
function $(i){return document.getElementById(i)}
function rd(k){try{return localStorage.getItem(k)}catch(e){return null}}
function wr(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function list(){try{var a=JSON.parse(rd(LK)); return Array.isArray(a)?a:[]}catch(e){return []}}
function save(a){wr(LK,JSON.stringify(a))}
function norm(s){return String(s||'').replace(/\s+/g,' ').trim()}
function idOf(t){t=norm(t).replace(/[ً-ْـ]/g,'').slice(0,160);var h=0;for(var i=0;i<t.length;i++){h=(h*31+t.charCodeAt(i))|0}return 'l'+(h>>>0).toString(36)}
function find(id){var a=list();for(var i=0;i<a.length;i++) if(a[i].id===id) return a[i];return null}
function toast(m,o){try{window.__F&&window.__F.toast(m,o)}catch(e){}}
var touchy=('ontouchstart' in window)||(navigator.maxTouchPoints>0);
if(touchy) document.documentElement.classList.add('rf-touch');
var HL=!!(window.CSS&&CSS.highlights&&window.Highlight);

/* ---------- سياق الجملة ---------- */
function ctx(el){
  var inMed=!!el.closest('#view-meditation'), k='';
  for(var i=0;i<KIND.length;i++){ if(el.classList.contains(KIND[i][0])||el.tagName.toLowerCase()===KIND[i][0]){k=KIND[i][1];break} }
  var r='', box=el.closest('.content-card, .card, section, .med-card')||el.parentElement, rr=box&&box.querySelector('.verse-ref, .ref, cite, .reading-ref, h3');
  if(rr&&!el.contains(rr)) r=norm(rr.textContent).slice(0,60);
  return {k:inMed?'med':'read', h:inMed?'الخلوة اليومية':'القراءات اليومية', c:k, r:r};
}

/* ---------- نقطة → كلمة ---------- */
function caretAt(x,y){
  var n,o;
  if(document.caretRangeFromPoint){ var r=document.caretRangeFromPoint(x,y); if(r){n=r.startContainer;o=r.startOffset} }
  else if(document.caretPositionFromPoint){ var p=document.caretPositionFromPoint(x,y); if(p){n=p.offsetNode;o=p.offset} }
  return n?{n:n,o:o}:null;
}
var WS=/[\s ]/;
function wordRange(n,o){
  if(!n||n.nodeType!==3) return null;
  var t=n.nodeValue, L=t.length; if(!L) return null;
  if(o>=L) o=L-1; if(o>0&&WS.test(t.charAt(o))&&!WS.test(t.charAt(o-1))) o--;
  if(WS.test(t.charAt(o))){ var q=o; while(q<L&&WS.test(t.charAt(q))) q++; if(q>=L){q=o;while(q>0&&WS.test(t.charAt(q))) q--;} o=q; if(WS.test(t.charAt(o))) return null; }
  var s=o,e=o+1; while(s>0&&!WS.test(t.charAt(s-1))) s--; while(e<L&&!WS.test(t.charAt(e))) e++;
  var r=document.createRange(); r.setStart(n,s); r.setEnd(n,e); return r;
}
function wordAt(x,y,box){
  var c=caretAt(x,y); if(!c||!box.contains(c.n)) return null;
  return wordRange(c.n,c.o);
}

/* ---------- التظليل ---------- */
var hlAct=HL?new Highlight():null, hlSav=HL?new Highlight():null;
if(HL){ CSS.highlights.set('rf-sel',hlAct); CSS.highlights.set('rf-saved',hlSav); }
var rng=null, anchor=null, box=null, active=false;
function paint(){
  if(!rng) return;
  if(HL){ hlAct.clear(); hlAct.add(rng); }
  else { try{var s=getSelection(); s.removeAllRanges(); s.addRange(rng)}catch(e){} }
}
function unpaint(){
  if(HL) hlAct.clear(); else { try{getSelection().removeAllRanges()}catch(e){} }
}
function extendTo(x,y){
  var w=wordAt(x,y,box); if(!w||!anchor) return;
  var r=document.createRange(), a=anchor;
  if(w.compareBoundaryPoints(Range.START_TO_START,a)<0) r.setStart(w.startContainer,w.startOffset); else r.setStart(a.startContainer,a.startOffset);
  if(w.compareBoundaryPoints(Range.END_TO_END,a)>0) r.setEnd(w.endContainer,w.endOffset); else r.setEnd(a.endContainer,a.endOffset);
  rng=r; paint();
}

/* ---------- تمييز المحفوظ ---------- */
function markSaved(){
  if(!HL) return; hlSav.clear();
  var a=list().filter(function(x){return x.raw});
  if(!a.length) return;
  document.querySelectorAll(SEL).forEach(function(el){
    if(!el.offsetParent&&el.getClientRects().length===0) return;
    var tn=[], w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT), s='', n;
    while((n=w.nextNode())){ tn.push({n:n,st:s.length}); s+=n.nodeValue; }
    a.forEach(function(x){
      var i=s.indexOf(x.raw); if(i<0) return; var j=i+x.raw.length, r=document.createRange(), set=0;
      for(var k=0;k<tn.length;k++){
        var T=tn[k], e=T.st+T.n.nodeValue.length;
        if(!set&&i>=T.st&&i<e){r.setStart(T.n,i-T.st);set=1}
        if(set&&j>T.st&&j<=e){r.setEnd(T.n,j-T.st);break}
      }
      if(set) try{hlSav.add(r)}catch(e){}
    });
  });
}
var mt=0;
function schedule(){ clearTimeout(mt); mt=setTimeout(function(){markSaved();hint()},250); }
function hint(){
  if(rd(HK)) return;
  var pr=$('page-read'), vm=$('view-meditation');
  var vis=(pr&&pr.classList.contains('on')&&pr.querySelector(SEL_READ))||(vm&&vm.offsetParent&&vm.querySelector(SEL_MED));
  if(vis){ wr(HK,'1'); setTimeout(function(){toast('💡 اضغط مطوّلًا على كلمة واسحب يمينًا أو شمالًا لتظلّل الجملة اللي عجبتك')},1400); }
}

/* ---------- شريط الاختيارات ---------- */
var bar=null, cur=null, openedAt=0;
function ensureBar(){
  if(bar) return bar;
  bar=document.createElement('div'); bar.id='v302Bar'; bar.hidden=true; bar.setAttribute('role','toolbar'); bar.setAttribute('aria-label','اختيارات الجملة المظلّلة');
  bar.innerHTML='<button type="button" data-a="save"><b>★</b><span id="v302SaveL">حفظ</span></button>'+
   '<button type="button" data-a="note"><b>✎</b><span>ملاحظة</span></button>'+
   '<button type="button" data-a="copy"><b>⧉</b><span>نسخ</span></button>'+
   '<button type="button" data-a="share"><b>↗</b><span>مشاركة</span></button>'+
   '<button type="button" data-a="x" aria-label="إغلاق"><b>✕</b></button>';
  document.body.appendChild(bar);
  bar.addEventListener('touchstart',function(e){e.stopPropagation()},{passive:true});
  bar.addEventListener('click',function(e){
    var b=e.target.closest('button'); if(!b||!cur) return; e.stopPropagation();
    var a=b.getAttribute('data-a');
    if(a==='x') return dismiss();
    if(a==='save') return doSave();
    if(a==='note') return openSheet();
    if(a==='copy') return doCopy();
    if(a==='share') return doShare();
  });
  return bar;
}
function snapshot(){
  if(!rng||!box) return null;
  var raw=rng.toString(), t=norm(raw); if(t.length<2) return null;
  var c=ctx(box);
  return {id:idOf(t),t:t,raw:raw,k:c.k,h:c.h,c:c.c,r:c.r};
}
function showBar(){
  cur=snapshot(); if(!cur){ dismiss(); return; }
  var b=ensureBar(), ex=find(cur.id);
  $('v302SaveL').textContent=ex?'إزالة':'حفظ';
  b.querySelector('[data-a=save] b').textContent=ex?'☆':'★';
  b.hidden=false; b.classList.remove('on');
  var rc=rng.getBoundingClientRect(), W=window.innerWidth, H=window.innerHeight, bw=b.offsetWidth, bh=b.offsetHeight;
  var top=rc.top-bh-12; if(top<8) top=Math.min(rc.bottom+16,H-bh-8);
  var left=rc.left+rc.width/2-bw/2; left=Math.max(8,Math.min(W-bw-8,left));
  b.style.top=top+'px'; b.style.left=left+'px';
  requestAnimationFrame(function(){b.classList.add('on')});
}
function dismiss(){
  if(bar){bar.hidden=true;bar.classList.remove('on')}
  unpaint(); rng=null; anchor=null; box=null; cur=null; active=false;
}
function doSave(){
  var a=list(), ex=find(cur.id);
  if(ex){ var raw=rd(LK); save(a.filter(function(x){return x.id!==cur.id})); markSaved(); dismiss(); toast('أُزيلت الجملة',{undo:function(){wr(LK,raw||'[]');markSaved()}}); return; }
  a.unshift({id:cur.id,t:cur.t,raw:cur.raw,k:cur.k,h:cur.h,c:cur.c,r:cur.r,n:'',ts:Date.now()});
  save(a); markSaved(); dismiss(); toast('★ حُفظت في «جمل لمستني» (المفضلة)');
}
function doCopy(){
  var t='«'+cur.t+'»'+(cur.r?'\n— '+cur.r:''); dismiss();
  function ok(){toast('تم النسخ ✓')}
  try{ navigator.clipboard.writeText(t).then(ok,fb) }catch(e){ fb() }
  function fb(){ var ta=document.createElement('textarea'); ta.value=t; ta.style.cssText='position:fixed;opacity:0;top:0'; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy');ok()}catch(e){} ta.remove(); }
}
function doShare(){
  var t='«'+cur.t+'»'+(cur.r?'\n— '+cur.r:'')+'\n(الرفيق الروحي)'; var c=cur; dismiss();
  if(navigator.share){ navigator.share({text:t}).catch(function(){}); } else { try{navigator.clipboard.writeText(t); toast('تم النسخ للمشاركة ✓')}catch(e){} }
}

/* ---------- ورقة الملاحظة ---------- */
var sheetCur=null;
function ensureSheet(){
  var s=$('v299Sheet'); if(s) return s;
  s=document.createElement('div'); s.id='v299Sheet'; s.hidden=true;
  s.innerHTML='<div class="v299-bd"></div><div class="v299-box" role="dialog" aria-modal="true" aria-label="حفظ الجملة">'+
   '<div class="v299-h">✨ الجملة اللي وقفتني</div><blockquote class="v299-q" id="v299Q"></blockquote><div class="v299-s" id="v299S"></div>'+
   '<label class="v299-l" for="v299N">إيه اللي وقفك فيها؟ <small>(اختياري)</small></label>'+
   '<textarea id="v299N" rows="2" maxlength="300" placeholder="سطر بكلامك إنت…"></textarea>'+
   '<div class="v299-a"><button type="button" class="v299-ok" id="v299Ok">حفظ</button><button type="button" class="v299-rm" id="v299Rm">إزالة</button><button type="button" class="v299-x" id="v299X">إلغاء</button></div></div>';
  document.body.appendChild(s);
  s.querySelector('.v299-bd').addEventListener('click',function(){ if(Date.now()-openedAt<600) return; closeSheet(); });
  s.querySelector('.v299-bd').addEventListener('touchmove',function(e){e.preventDefault()},{passive:false});
  $('v299X').addEventListener('click',closeSheet);
  $('v299Ok').addEventListener('click',function(){
    if(!sheetCur) return; var a=list(), n=norm($('v299N').value), ex=null;
    a.forEach(function(x){if(x.id===sheetCur.id) ex=x});
    if(ex){ex.n=n} else {a.unshift({id:sheetCur.id,t:sheetCur.t,raw:sheetCur.raw,k:sheetCur.k,h:sheetCur.h,c:sheetCur.c,r:sheetCur.r,n:n,ts:Date.now()})}
    save(a); closeSheet(); markSaved(); toast(ex?'تم تحديث ملاحظتك':'★ حُفظت في «جمل لمستني» (المفضلة)');
  });
  $('v299Rm').addEventListener('click',function(){
    if(!sheetCur) return; var id=sheetCur.id, raw=rd(LK);
    save(list().filter(function(x){return x.id!==id})); closeSheet(); markSaved();
    toast('أُزيلت الجملة',{undo:function(){wr(LK,raw||'[]');markSaved()}});
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){ if(!s.hidden) closeSheet(); else if(bar&&!bar.hidden) dismiss(); }});
  return s;
}
function openSheet(){
  var c=cur; dismiss();
  var s=ensureSheet(), ex=find(c.id); sheetCur=c;
  $('v299Q').textContent='«'+c.t+'»';
  $('v299S').textContent=[c.h,c.c,c.r].filter(Boolean).join(' · ');
  $('v299N').value=ex?ex.n||'':'';
  $('v299Ok').textContent=ex?'تحديث':'حفظ';
  $('v299Rm').style.display=ex?'':'none';
  openedAt=Date.now(); s.hidden=false; requestAnimationFrame(function(){s.classList.add('on')});
}
function closeSheet(){var s=$('v299Sheet'); if(!s) return; s.classList.remove('on'); setTimeout(function(){s.hidden=true},180); sheetCur=null}

/* ---------- اللمس ---------- */
var timer=0, sx=0, sy=0, tgt=null, suppress=false;
function clearT(){clearTimeout(timer);timer=0}
document.addEventListener('touchstart',function(e){
  if(bar&&!bar.hidden&&!(e.target.closest&&e.target.closest('#v302Bar'))) dismiss();
  var p=e.target.closest&&e.target.closest(SEL); if(!p||e.touches.length!==1) return;
  sx=e.touches[0].clientX; sy=e.touches[0].clientY; tgt=p; clearT();
  timer=setTimeout(function(){
    timer=0;
    var w=wordAt(sx,sy,tgt); if(!w) return;
    active=true; suppress=true; box=tgt; anchor=w; rng=w.cloneRange();
    try{navigator.vibrate&&navigator.vibrate(18)}catch(e){}
    paint();
  },420);
},{passive:true});
document.addEventListener('touchmove',function(e){
  var t=e.touches[0];
  if(active){ if(e.cancelable) e.preventDefault(); extendTo(t.clientX,t.clientY); return; }
  if(timer&&(Math.abs(t.clientX-sx)>10||Math.abs(t.clientY-sy)>10)) clearT();
},{passive:false});
document.addEventListener('touchend',function(e){
  clearT();
  if(active){ if(e.cancelable) e.preventDefault(); active=false; showBar(); }
},{passive:false});
document.addEventListener('touchcancel',function(){ clearT(); if(active){ active=false; if(rng) showBar(); } },{passive:true});
document.addEventListener('click',function(e){
  if(suppress){ suppress=false; if(e.target.closest&&e.target.closest(SEL)){e.preventDefault();e.stopPropagation()} }
},true);
document.addEventListener('contextmenu',function(e){
  if(touchy&&e.target.closest&&e.target.closest(SEL)) e.preventDefault();
});
document.addEventListener('scroll',function(){ if(bar&&!bar.hidden) dismiss(); },{passive:true,capture:true});

window.__lines={list:list,key:LK,idOf:idOf};
function boot(){ new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true}); schedule(); }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
