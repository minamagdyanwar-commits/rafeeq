
(function(){
'use strict';
var F=window.__F; if(!F) return;
function $(i){return document.getElementById(i)}
function jget(k){ try{ return JSON.parse(localStorage.getItem(k)) }catch(e){ return null } }
function jset(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)) }catch(e){} }

/* ===== ١) الجولة التعريفية ===== */
var TOUR=[
 {i:'✠',h:'أهلًا بك في «الرفيق الروحي»',p:'صلاتك وقراءاتك وتأملاتك ومحاسبتك في مكان واحد، وتعمل كلها <b>بدون إنترنت</b>.'},
 {i:'🕊',h:'الصلاة',p:'من «الصلاة» افتح <b>صلاة الساعة الحالية</b> مباشرة، أو اختر أي ساعة من الأجبية، ويمكنك دمج صلاتين معًا.'},
 {i:'📖',h:'القراءات والكتاب المقدس',p:'«القراءات» لقراءات اليوم، و«الكتاب» (من «المزيد» أو «رحلتي») للكتاب المقدس كاملًا. حدّد آية لتحفظها أو تنسخها.'},
 {i:'✉',h:'رسالة من يسوع',p:'رسالة جديدة كل يوم باسمك. احفظ المفضلة، وشاركها كبطاقة جميلة. تظهر نقطة حمراء حتى تقرأ رسالة اليوم.'},
 {i:'🕯',h:'الخلوة والمحاسبة',p:'الشمعة 🕯 أعلى الشاشة تُبقي الشاشة مضاءة وتخفي المشتّتات (اضغط مطوّلًا للخروج). و«المحاسبة» لمراجعة يومك قبل النوم.'}
];
var step=0;
function tourHtml(){
  var t=TOUR[step], last=step===TOUR.length-1;
  var dots=TOUR.map(function(_,i){return '<i'+(i===step?' class="on"':'')+'></i>'}).join('');
  return '<div class="v69tour" role="group" aria-label="الجولة '+(step+1)+' من '+TOUR.length+'"><div class="ic" aria-hidden="true">'+t.i+'</div><h3>'+t.h+'</h3><p>'+t.p+'</p><div class="v69dots" aria-hidden="true">'+dots+'</div><div class="v69row">'+(last?'':'<button type="button" data-v69="skip">تخطي</button>')+'<button type="button" class="p" data-v69="'+(last?'done':'next')+'">'+(last?'ابدأ':'التالي')+'</button></div></div>';
}
function tour(){ step=0; F.sheet(tourHtml(),'v69t'); }
window.__tour=tour;
document.addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('[data-v69]'); if(!b) return;
  var a=b.getAttribute('data-v69');
  if(a==='next'){ step++; var body=$('uSheetBody'); if(body) body.innerHTML=tourHtml(); }
  else if(a==='skip'||a==='done'){ F.closeSheet(); jset('rafeeq_onb_v1',1); }
  else if(a==='res'){ resume() }
  else if(a==='tour'){ var p=$('settingsClose'); if(p) p.click(); setTimeout(tour,150); }
});
function fresh(){
  try{
    if(localStorage.getItem('rafeeq_onb_v1')) return false;
    var ok={rafeeq_last:1,rafeeq_prefs_v1:1,rafeeq_msgseen_v1:1,rafeeq_resume_v1:1,dr_visited_v1:1};
    for(var i=0;i<localStorage.length;i++){ if(!ok[localStorage.key(i)]) return false; }
    return true;
  }catch(e){ return false }
}
if(!/[?&]go=/.test(location.search)) setTimeout(function(){
  var sh=$('uSheet'); if(fresh()&&sh&&!sh.classList.contains('on')){ tour(); }
},1200);
/* زر في الإعدادات */
function addTourBtn(){
  var p=$('settingsPanel'); if(!p||p.querySelector('.v69tourbtn')) return;
  var b=document.createElement('button'); b.type='button'; b.className='v69tourbtn'; b.setAttribute('data-v69','tour'); b.textContent='عرض الجولة التعريفية';
  var v=$('rfVer'); if(v&&v.parentNode===p) p.insertBefore(b,v); else p.appendChild(b);
}
addTourBtn(); setTimeout(addTourBtn,800);
document.addEventListener('click',function(e){ if(e.target.closest&&e.target.closest('#settingsBtn,#uGear')) setTimeout(addTourBtn,200) },true);

/* ===== ٢) أكمل من حيث توقفت ===== */
var RK='rafeeq_resume_v1';
function save(o){ o.ts=Date.now(); var old=jget(RK); if(old&&old.t===o.t&&old.b===o.b&&old.c===o.c&&old.key===o.key&&Date.now()-old.ts<30000) return; jset(RK,o); renderRes(); }
var trk=$('trkBody');
function bibleWatch(){
  var B=F.bible, R=B&&B.state; if(!R||!B.data||R.view!=='read') return;
  try{ save({t:'bible',b:R.b,c:R.c,label:B.label(R.b,R.c)}) }catch(e){}
}
if(trk) new MutationObserver(bibleWatch).observe(trk,{childList:true});
var lastHour='';
function hourWatch(){
  var pg=$('page-pray'); if(!pg||!pg.classList.contains('on')) return;
  var k=window.__k, st=k&&k.getState&&k.getState(); if(!st||!st.hour||st.mergedPair) return;
  if(st.hour===lastHour) return; lastHour=st.hour;
  var h=k.HOURS&&k.HOURS[st.hour]; save({t:'hour',key:st.hour,label:'صلاة '+(h&&h.label?h.label:'الساعة')});
}
setInterval(hourWatch,2000);
var pp=$('page-pray'); if(pp) new MutationObserver(function(){ setTimeout(hourWatch,300) }).observe(pp,{attributes:true,attributeFilter:['class']});
function renderRes(){
  var w=document.querySelector('#page-home .u-wrap'); if(!w) return;
  var r=jget(RK), old=$('v69res');
  var okRec=r&&r.label&&Date.now()-r.ts<72*3600*1000;
  if(!okRec){ if(old) old.remove(); return; }
  var html='<div><small>أكمل من حيث توقفت</small><b></b></div><button type="button" data-v69="res">متابعة ←</button>';
  if(!old){ old=document.createElement('div'); old.id='v69res'; old.className='u-card v69res'; var ex=$('hExtra'); w.insertBefore(old,ex||w.children[1]||null); }
  if(old.getAttribute('data-k')!==String(r.ts)){ old.innerHTML=html; old.querySelector('b').textContent=r.label; old.setAttribute('data-k',String(r.ts)); }
}
function resume(){
  var r=jget(RK); if(!r) return;
  try{
    if(r.t==='bible') F.openBible(r.b,r.c);
    else if(r.t==='hour') window.__rafeeq.act('hour',{dataset:{key:r.key}});
  }catch(e){}
}
var ph=$('page-home'); if(ph) new MutationObserver(renderRes).observe(ph,{attributes:true,attributeFilter:['class']});
document.addEventListener('visibilitychange',function(){ if(!document.hidden) renderRes() });
renderRes();

/* ===== ٣) مشاركة الرسالة كبطاقة ===== */
var mb=$('msgBody');
function addShare(){
  if(!mb) return; var c=mb.querySelector('[data-mg="copy"]'); if(!c||mb.querySelector('.v69share')) return;
  var b=document.createElement('button'); b.type='button'; b.className='u-btn v69share'; b.textContent='🖼 مشاركة كبطاقة';
  c.parentNode.insertBefore(b,c.nextSibling);
}
if(mb){ new MutationObserver(addShare).observe(mb,{childList:true}); addShare(); }
function wrap(ctx,text,maxW){
  var words=String(text).split(/\s+/), lines=[], cur='';
  words.forEach(function(w){ var t=cur?cur+' '+w:w; if(ctx.measureText(t).width>maxW&&cur){ lines.push(cur); cur=w } else cur=t });
  if(cur) lines.push(cur); return lines;
}
async function card(){
  var W=1080,H=1350, cv=document.createElement('canvas'); cv.width=W; cv.height=H; var x=cv.getContext('2d');
  try{ await Promise.all(['700 44px Amiri','700 40px Cairo','400 38px Cairo'].map(function(f){return document.fonts.load(f)})) }catch(e){}
  var g=x.createLinearGradient(0,0,0,H); g.addColorStop(0,'#5a1a28'); g.addColorStop(1,'#26080f'); x.fillStyle=g; x.fillRect(0,0,W,H);
  x.strokeStyle='#d6ad5a'; x.lineWidth=4; x.strokeRect(36,36,W-72,H-72); x.lineWidth=1.5; x.strokeRect(52,52,W-104,H-104);
  x.direction='rtl'; x.textAlign='center'; x.textBaseline='alphabetic';
  var y=170; x.fillStyle='#e8c468'; x.font='700 90px Amiri, serif'; x.fillText('✠',W/2,y);
  y+=82; x.fillStyle='#f6e7c1'; x.font='700 52px Amiri, Cairo, serif'; x.fillText('رسالة من يسوع',W/2,y);
  var d=mb.querySelector('.mg-date b'), dt=d?d.textContent:''; y+=64; x.fillStyle='#d6ad5a'; x.font='400 34px Cairo, sans-serif'; x.fillText(dt,W/2,y);
  var qs=mb.querySelectorAll('.mg-q'), q=qs[qs.length-1], qt=q&&q.querySelector('p')?q.querySelector('p').textContent:'', qr=q&&q.querySelector('cite')?q.querySelector('cite').textContent:'';
  var en=mb.querySelector('.mg-p.end'), et=en?en.textContent:'';
  var sig=mb.querySelector('.mg-sig'); var sg=sig?sig.textContent:'أحبك — يسوع ✠';
  y+=110; x.fillStyle='#fff6df'; x.font='700 50px Amiri, serif';
  wrap(x,'«'+qt+'»',860).forEach(function(l){ x.fillText(l,W/2,y); y+=78 });
  y+=4; x.fillStyle='#d6ad5a'; x.font='400 34px Cairo, sans-serif'; x.fillText(qr,W/2,y);
  y+=70; x.strokeStyle='#d6ad5a'; x.lineWidth=2; x.beginPath(); x.moveTo(W/2-90,y); x.lineTo(W/2+90,y); x.stroke();
  y+=82; x.fillStyle='#f3e6cf'; x.font='400 40px Cairo, sans-serif';
  var lines=wrap(x,et,840); lines.slice(0,5).forEach(function(l){ x.fillText(l,W/2,y); y+=66 });
  x.fillStyle='#e8c468'; x.font='700 46px Amiri, serif'; x.fillText(sg,W/2,Math.max(y+60,1130));
  x.fillStyle='rgba(246,231,193,.55)'; x.font='400 28px Cairo, sans-serif'; x.fillText('الرفيق الروحي',W/2,H-86);
  return new Promise(function(res){ cv.toBlob(res,'image/png') });
}
window.__shareCard=card;
document.addEventListener('click',async function(e){
  var b=e.target.closest&&e.target.closest('.v69share'); if(!b) return;
  b.disabled=true;
  try{
    var blob=await card(); if(!blob) throw 0;
    var f=new File([blob],'رسالة-يسوع.png',{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[f]})){ await navigator.share({files:[f],title:'رسالة من يسوع'}); }
    else{ var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='رسالة-يسوع.png'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){URL.revokeObjectURL(a.href)},4000); F.toast('حُفظت البطاقة كصورة'); }
  }catch(err){ if(err&&err.name==='AbortError'){} else F.toast('تعذّر إنشاء البطاقة'); }
  b.disabled=false;
});
/* ?go=tour */
if(/[?&]go=tour/.test(location.search)) setTimeout(tour,900);
})();
