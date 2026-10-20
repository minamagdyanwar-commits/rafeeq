
/* ===================== بحث شامل + شريط الصلاة + وضع التركيز + ملاحظة سريعة ===================== */
(function(){
'use strict';
var F=window.__F,$=F.$,B=F.bible,esc=F.esc,ard=F.ard;

/* ---------- البحث الشامل ---------- */
var ov=$('uSearchOv'), inp=$('uSearchIn'), res=$('uSearchRes'), tm;
function openS(){ ov.hidden=false; inp.value=''; res.innerHTML='<div class="so-empty">ابحث بكلمة أو بمرجع (مثال: يوحنا ٣: ١٦). يشمل الكتاب المقدس والصلوات وملاحظاتك وآيات الحفظ.</div>'; setTimeout(function(){inp.focus()},40); }
function closeS(){ ov.hidden=true; }
$('uSearchBtn').addEventListener('click',openS);
$('uSearchX').addEventListener('click',closeS);
ov.addEventListener('click',function(e){ if(e.target===ov) closeS(); });
document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&!ov.hidden) closeS(); if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();openS()} });
function sec(title,rows){ return rows.length?'<div class="so-sec">'+title+'</div>'+rows.join(''):''; }
function row(attr,t,s){ return '<button type="button" class="so-row" '+attr+'><b>'+t+'</b>'+(s?'<span>'+s+'</span>':'')+'</button>'; }
function snip(text,q){
  var n=F.norm(text), i=n.indexOf(q.split(/\s+/)[0]); if(i<0) i=0;
  var a=Math.max(0,i-30); return esc((a?'…':'')+text.slice(a,a+120)+(text.length>a+120?'…':''));
}
function run(q){
  q=q.trim(); if(!q){ res.innerHTML=''; return; }
  var nq=F.norm(q), parts=[];
  /* الكتاب */
  var bp=B.data?Promise.resolve():B.load().catch(function(){});
  bp.then(function(){
    var rows=[];
    if(B.data){
      var ref=B.parseRef(q);
      if(ref) rows.push(row('data-sgo="bible:'+ref.bi+':'+ref.ch+':'+(ref.v1||'')+'"',esc(B.label(ref.bi,ref.ch,ref.v1,ref.v2)),esc(B.verses(ref.bi,ref.ch,ref.v1,ref.v2).slice(0,2).join(' ').slice(0,140))));
      B.search(q,12).forEach(function(x){ rows.push(row('data-sgo="bible:'+x.bi+':'+x.ch+':'+x.v+'"',esc(B.label(x.bi,x.ch,x.v)),snip(B.data[x.bi].c[x.ch-1][x.v-1],nq))); });
    }
    var out=sec('الكتاب المقدس',rows);
    /* الصلوات */
    var K=window.__k, pr=[];
    if(K&&K.PRAYER_TOPICS){
      K.PRAYER_TOPICS.forEach(function(t){ (t.prayers||[]).forEach(function(p,i){
        var body=(p.title||'')+' '+(Array.isArray(p.text)?p.text.join(' '):(p.text||''));
        if(F.norm(body).indexOf(nq)>-1&&pr.length<10) pr.push(row('data-sgo="prayer:'+t.key+':'+i+'"',esc(p.title||'صلاة'),esc(t.label)+' — '+snip(Array.isArray(p.text)?p.text.join(' '):(p.text||''),nq)));
      }); });
    }
    if(K&&K.HOURS){ Object.keys(K.HOURS).forEach(function(k){ var h=K.HOURS[k]; if(h&&h.label&&F.norm(h.label).indexOf(nq)>-1) pr.unshift(row('data-sgo="hour:'+k+'"','صلاة '+esc(h.label),'افتح الساعة')); }); }
    out+=sec('الصلوات والأجبية',pr);
    /* ملاحظاتي وآياتي */
    var nr=[]; (F.notesAll?F.notesAll():[]).forEach(function(n){ if(F.norm((n.body||'')+' '+(n.src||'')).indexOf(nq)>-1&&nr.length<6) nr.push(row('data-sgo="notes"',esc(n.src||'ملاحظة'),snip(n.body||'',nq))); });
    (F.versesAll?F.versesAll():[]).forEach(function(v){ if(F.norm(v.ref+' '+v.text).indexOf(nq)>-1&&nr.length<9) nr.push(row('data-sgo="memo"',esc(v.ref),snip(v.text,nq))); });
    out+=sec('ملاحظاتي وآياتي',nr);
    /* المحاسبة (تُخفى مع القفل) */
    var er=[]; if(!(F.locked&&F.locked())&&window.__m&&window.__m.CATS){
      window.__m.CATS.forEach(function(c){ c.sins.forEach(function(s){ if(F.norm(s[0]+' '+s[1]).indexOf(nq)>-1&&er.length<5) er.push(row('data-sgo="exam"',esc(s[0]),esc(c.name))); }); });
    }
    out+=sec('محاسبة النفس',er);
    /* القراءات */
    out+=sec('القراءات اليومية',[row('data-sgo="readings:'+esc(q)+'"','ابحث عن «'+esc(q)+'» في مناسبات القراءات','عناوين الأيام والمناسبات القبطية')]);
    res.innerHTML=out||'<div class="so-empty">لا توجد نتائج.</div>';
  });
}
inp.addEventListener('input',function(){ clearTimeout(tm); tm=setTimeout(function(){run(inp.value)},200); });
res.addEventListener('click',function(e){
  var el=e.target.closest('[data-sgo]'); if(!el) return;
  var a=el.dataset.sgo.split(':'), t=a[0]; closeS();
  var R=window.__rafeeq, K=window.__k;
  if(t==='bible'){ F.openBible(+a[1],+a[2],a[3]?+a[3]:null); }
  else if(t==='prayer'){ R.show('pray',{top:1}); if(window.switchApp) window.switchApp('agpeya'); if(K&&K.goPrayer) K.goPrayer(a[1],+a[2]); }
  else if(t==='hour'){ R.act('hour',{dataset:{key:a[1]}}); }
  else if(t==='notes'){ R.show('trk',{top:1}); F.setTrkTab('notes'); }
  else if(t==='memo'){ R.show('trk',{top:1}); F.setTrkTab('memo'); }
  else if(t==='exam'){ R.act('exam'); }
  else if(t==='readings'){
    R.show('read',{top:1});
    setTimeout(function(){ var b=$('sidebarBtn'), s=$('searchInput'); if(b) b.click(); if(s){ s.value=el.dataset.sgo.slice(9); s.dispatchEvent(new Event('input')); } },120);
  }
});

/* ---------- شريط تعليم الصلاة ---------- */
var bar=$('prayBar'), lastSig='';
function activeGroups(){
  var K=window.__k; if(!K||!K.getState) return [];
  var s=K.getState(), keys=[];
  if(s.hour) keys=[s.hour]; else if(s.mergedPair) keys=[].concat(s.mergedPair);
  var seen={}, out=[]; keys.forEach(function(k){ var g=F.groupOf(k); if(g&&!seen[g.id]){seen[g.id]=1;out.push(g)} });
  return out;
}
function paintBar(){
  var onPray=$('page-pray').classList.contains('on');
  var va=$('view-agpeya'), vg=$('view-guided'), inGd=!!(onPray&&vg&&getComputedStyle(vg).display!=='none'), inAg=!!(onPray&&!inGd&&va&&getComputedStyle(va).display!=='none'&&$('tabAgpeya')&&$('tabAgpeya').classList.contains('active'));
  document.body.classList.toggle('gd-on',inGd);
  var gs=inAg?activeGroups():[];
  document.body.classList.remove('u-focus'); /* v71: وضع التركيز في الصلاة محذوف */
  if(!gs.length){ bar.hidden=true; document.body.classList.remove('has-bar'); lastSig=''; return; }
  var key=F.dkey(), all=gs.every(function(g){return F.hourDone(key,g.id)});
  var sig=gs.map(function(g){return g.id}).join('+')+':'+all;
  bar.hidden=false; document.body.classList.add('has-bar');
  if(sig===lastSig) return; lastSig=sig;
  bar.innerHTML='<button type="button" class="pb-done'+(all?' on':'')+'" id="pbDone">'+(all?'✓ صلّيتُ '+gs.map(function(g){return g.label}).join(' + '):'علّم: صلّيتُ '+gs.map(function(g){return g.label}).join(' + '))+'</button>';
}
F.updatePrayBar=function(){lastSig='';paintBar()};
bar.addEventListener('click',function(e){
  if(e.target.closest('#pbDone')){
    var gs=activeGroups(), key=F.dkey(), all=gs.every(function(g){return F.hourDone(key,g.id)});
    gs.forEach(function(g){F.setHour(key,g.id,!all)});
    if(all)F.toast('أُلغي التعليم'); F.updatePrayBar(); if(F.refreshHome)F.refreshHome();
  }
});
var mt; var obs=new MutationObserver(function(){ clearTimeout(mt); mt=setTimeout(paintBar,120); });
obs.observe($('mod-k'),{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
setInterval(paintBar,1500);

/* ---------- ملاحظة سريعة ---------- */
var fabLP=0, fabHeld=false;
function driveBtn(){ var b=$('uDrive'); if(!b){ b=document.createElement('button'); b.id='uDrive'; b.type='button'; b.hidden=true; b.innerHTML='🚗 وضع القيادة<small>قراءة صوتية للصلاة</small>'; document.body.appendChild(b);
  b.addEventListener('click',function(e){ e.stopPropagation(); b.hidden=true; if(window.__driveOpen) window.__driveOpen(); else F.toast('وضع القيادة غير جاهز بعد — افتح الصلاة أولًا'); });
  document.addEventListener('click',function(e){ if(!b.hidden&&e.target!==b&&e.target!==$('uFab')) b.hidden=true; },true); }
  return b; }
function showDrive(){ var fab=$('uFab'), b=driveBtn(); b.hidden=false;
  function place(){ var r=fab.getBoundingClientRect(); b.style.left='0px'; b.style.bottom='0px'; var w=b.offsetWidth, W=document.documentElement.clientWidth;
    b.style.left=Math.max(8,Math.min(W-w-8,r.left+r.width/2-w/2))+'px'; b.style.bottom=(innerHeight-r.top+10)+'px'; }
  place(); setTimeout(place,160);
  clearTimeout(b._t); b._t=setTimeout(function(){ b.hidden=true; },6000); try{ navigator.vibrate&&navigator.vibrate(25); }catch(e){} }
(function(){ var fab=$('uFab');
  fab.addEventListener('pointerdown',function(){ fabHeld=false; clearTimeout(fabLP); fabLP=setTimeout(function(){ fabHeld=true; showDrive(); },550); });
  ['pointerup','pointerleave','pointercancel'].forEach(function(ev){ fab.addEventListener(ev,function(){ clearTimeout(fabLP); }); });
  fab.addEventListener('contextmenu',function(e){ e.preventDefault(); });
})();
$('uFab').addEventListener('click',function(e){
  if(fabHeld){ fabHeld=false; e.preventDefault(); e.stopPropagation(); return; }
  var ctx=''; var R=window.__rafeeq;
  F.noteDialog({src:ctx});
});
})();

