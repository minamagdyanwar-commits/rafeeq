/* v4.2 — «الخلوة الفردية»: خلوة مرتبطة بيوم الكنيسة + أنماط + تخصيص + سجل ومتابعة */
(function(){
'use strict';
var GD=window.__GD; if(!GD) return;
var SK='rafeeq_gd_v1', LK='rafeeq_gd_log_v1', HK='rafeeq_gd_hist_v1', CK='rafeeq_gd_cfg_v1';
function $(i){return document.getElementById(i)}
function rd(k){try{return localStorage.getItem(k)}catch(e){return null}}
function wr(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function jr(k,d){try{var v=JSON.parse(rd(k)); return v==null?d:v}catch(e){return d}}
function ar(n){return String(n).replace(/\d/g,function(d){return '٠١٢٣٤٥٦٧٨٩'[d]})}
function en(s){return String(s).replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)})}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function rnd(a){return a[Math.floor(Math.random()*a.length)]}
function wc(s){return String(s).trim().split(/\s+/).length}
function toast(m){try{window.__F&&window.__F.toast(m)}catch(e){}}
var DURS=[10,20,30,45];
var STEPS=[
 {k:'ps',w:14,t:'مزمور',ic:'🕊',h:'اقرأ المزمور ببطء، وقف عند الكلمة اللي تلمس قلبك. وبعدها ابقَ صامتًا.'},
 {k:'jp1',w:18,t:'صلاة يسوع',ic:'✠',h:'قلها مع النَّفَس، وحدّة الذهن: الشهيق «يا ربي يسوع المسيح»، الزفير «ارحمني أنا الخاطئ».'},
 {k:'pa',w:16,t:'من الكتاب المقدس',ic:'📖',h:'اقرأ الفصل مرتين: مرة لتفهم، ومرة لتسمع صوت الله لك أنت.'},
 {k:'fp',w:10,t:'من صلوات الآباء',ic:'🕯',h:'صلِّ هذه الصلاة كأنها كلامك أنت.'},
 {k:'jp2',w:18,t:'الصلاة السهمية (صلاة يسوع)',ic:'➳',h:'كل طلبة كسهم صغير ينطلق لقلب الله. اقرأها، وانتظر قليلًا بعد كل واحدة.'},
 {k:'ct',w:14,t:'صلاة تأمّلية وقول من أقوال الآباء',ic:'🌿',h:'صلِّ الكلمات واصمت في المواضع المحددة.'},
 {k:'ky',w:6,t:'كيرياليسون',ic:'❖',h:'يا رب ارحم — بقلب منسحق.'},
 {k:'ab',w:4,t:'أبانا الذي',ic:'☩',h:'اختم بصلاة الرب.'}
];
var MODES=[
 {k:'today',t:'خلوة اليوم',ic:'📅',d:'مرتبطة بموضوع اليوم وكلمته وقول أبوي اليوم'},
 {k:'rand',t:'مفاجأة',ic:'🎲',d:'اختيار عشوائي متنوّع'},
 {k:'tawba',t:'توبة',ic:'💧',d:'رجوع وانسحاق وطلب رحمة'},
 {k:'shukr',t:'شكر وتسبيح',ic:'🌾',d:'امتنان وفرح بالله'},
 {k:'ishtiyaq',t:'اشتياق',ic:'🔥',d:'عطش وقرب وثبات في المسيح'},
 {k:'thiqa',t:'ثقة وسلام',ic:'🕊',d:'رجاء وتسليم وطمأنينة'},
 {k:'dayiq',t:'ضيق وتعب',ic:'🌧',d:'صبر ورجاء وسط الأحمال'},
 {k:'shafaa',t:'شفاعة ومحبة',ic:'🤝',d:'صلاة لأجل الآخرين وغفران'}
];
function stepOf(k){ for(var i=0;i<STEPS.length;i++) if(STEPS[i].k===k) return STEPS[i]; }
function modeOf(k){ for(var i=0;i<MODES.length;i++) if(MODES[i].k===k) return MODES[i]; return MODES[1]; }
/* ---------- الإعدادات المحفوظة ---------- */
function cfgGet(){ var c=jr(CK,{})||{}; var du=DURS.indexOf(c.dur)>=0?c.dur:20; return {mode:c.mode||'today',dur:du,off:c.off||{},rt:c.rt||''}; }
function cfgSet(p){ var c=cfgGet(); for(var k in p) c[k]=p[k]; wr(CK,JSON.stringify(c)); return c; }
function activeKeys(c){ var a=STEPS.filter(function(s){return !c.off[s.k]}).map(function(s){return s.k}); return a.length>=2?a:STEPS.map(function(s){return s.k}); }
function plan(dur,keys){
  keys=keys||STEPS.map(function(s){return s.k});
  var tot=dur*60, W=keys.map(function(k){return stepOf(k).w}), sw=W.reduce(function(a,b){return a+b},0);
  var s=W.map(function(w){return Math.max(15,Math.round(tot*w/sw/5)*5)});
  var sum=s.reduce(function(a,b){return a+b},0), big=0; for(var i=1;i<W.length;i++) if(W[i]>W[big]) big=i;
  s[big]=Math.max(15,s[big]+tot-sum); return s;
}
function fmt(sec){ if(sec<60) return ar(Math.round(sec))+' ث'; var m=Math.floor(sec/60), r=Math.round(sec%60/5)*5; if(r===60){m++;r=0} return ar(m)+' د'+(r?' '+ar(r)+' ث':''); }
function clock(sec){ sec=Math.max(0,Math.round(sec)); var m=Math.floor(sec/60), s=sec%60; return ar(m)+':'+ar(s<10?'0'+s:s); }
/* الكتاب المقدس */
var B=null;
function bible(){ var F=window.__F; if(!F||!F.bible) return Promise.reject(); return F.bible.load().then(function(d){B=d;return d}); }
function bookIdx(n){ for(var i=0;i<B.length;i++) if(B[i].n===n) return i; return -1; }
function lxx(h){ if(h<=8) return String(h); if(h<=10) return '9'; if(h<=113) return String(h-1); if(h<=115) return '113'; if(h===116) return '114، 115'; if(h<=146) return String(h-1); if(h===147) return '146، 147'; return String(h); }
function hist(){return jr(HK,[])}
function remember(id){ var a=hist().filter(function(x){return x!==id}); a.unshift(id); wr(HK,JSON.stringify(a.slice(0,40))); }
function fit(cands,allowed,keepTrim){
  var h=hist(), fits=cands.filter(function(c){return c.w<=allowed*1.35}), mid=fits.filter(function(c){return c.w>=allowed*.45}), pool=mid.length?mid:fits;
  var fresh=pool.filter(function(c){return h.indexOf(c.id)<0}); if(fresh.length) pool=fresh;
  if(!pool.length){ if(keepTrim) return {c:rnd(cands),trim:true}; var m=cands.slice().sort(function(a,b){return a.w-b.w}); return {c:m[0],trim:false}; } return {c:rnd(pool),trim:false};
}
function allowedWords(secs){ return secs/60*70; }
/* ---------- يوم الكنيسة والأنماط ---------- */
var KW={
 tawba:/توب|خطي|اعتراف|دموع|ندم|رحمة|الابن الضال|انسحاق/,
 shukr:/شكر|فرح|تسبيح|حمد|بركة|عطايا|نعمة|ميلاد|بشارة/,
 ishtiyaq:/اشتياق|عطش|حب |محبة الله|قرب|شركة|ثبات|لقاء|الكرمة|ملكوت|سهر/,
 thiqa:/ثقة|رجاء|إيمان|سلام|طمأن|رعاية|حفظ|أمان|عناية|وعد|اتكال|تسليم|بيد الله/,
 dayiq:/ضيق|تعب|ألم|صليب|حزن|خوف|قلق|تجرب|احتمال|صبر|حرب|جهاد|ظلم|مرض|رحيل|موت|رقاد/,
 shafaa:/خدمة|قريب|إخوة|شفاعة|عطاء|غفران|كنيسة|ضيافة|الفقراء|المحتاج|محبة القريب/
};
function moodFrom(txt){ var best=null,bs=0; for(var k in KW){ var m=txt.match(new RegExp(KW[k].source,'g')); var s=m?m.length:0; if(s>bs){bs=s;best=k} } return best; }
function todayInfo(){
  try{
    var Y=window.__khalwaYear; if(!Y||!Y.ready||!Y.entry) return null; var d=new Date(), e=Y.entry(d); if(!e||!e.th) return null;
    var txt=e.th+' '+e.th+' '+(e.m||[]).map(function(x){return (x.t||'')+' '+(x.f||'')}).join(' ');
    var c=Y.copticOf(d), mn=(Y.months||[])[c.m-1]||'', lab='';
    lab=ar(c.d)+' '+mn;
    try{ var L=window.__copCal.label(d); if(L&&L.text) lab+=' — '+L.text; }catch(x){}
    return {th:e.th, lab:lab, mood:moodFrom(txt), m:e.m||[]};
  }catch(x){ return null; }
}
function parseRef(ref){
  if(!ref) return null; var m=String(ref).replace(/[–—]/g,'-').match(/^\s*(.+?)\s+([٠-٩0-9]+)\s*:\s*([٠-٩0-9]+)(?:\s*-\s*([٠-٩0-9]+))?/); if(!m) return null;
  return {b:m[1].trim(),c:+en(m[2]),a:+en(m[3]),z:m[4]?+en(m[4]):+en(m[3])};
}
function dayPassage(ti){
  for(var i=0;i<ti.m.length;i++){
    var p=parseRef(ti.m[i].ref); if(!p) continue; var bi=bookIdx(p.b); if(bi<0) continue;
    var ch=B[bi].c[p.c-1]; if(!ch) continue;
    var a=Math.max(1,p.a-1), z=Math.min(ch.length,Math.max(p.z+3,a+4)); if(z<a) continue;
    return [p.b,p.c,a,z,bi>=47?'NT':'OT','day'];
  }
  return null;
}
var PSM={'ثقة':'thiqa','توبة':'tawba','اشتياق':'ishtiyaq','شفاعة':'shafaa','شكر':'shukr','ضيق':'dayiq'};
function tagged(list,tags,mood,min){
  if(!mood) return list.map(function(x,i){return i});
  var ix=[]; list.forEach(function(x,i){ if(tags[i]&&(' '+tags[i]+' ').indexOf(' '+mood+' ')>=0) ix.push(i) });
  return ix.length>=(min||1)?ix:list.map(function(x,i){return i});
}
function build(){
  var C=cfgGet(), keys=activeKeys(C), dur=C.dur, secs=plan(dur,keys), ix={}; keys.forEach(function(k,i){ix[k]=i});
  var ti=C.mode==='today'?todayInfo():null, mood=C.mode==='today'?(ti&&ti.mood):(C.mode==='rand'?null:C.mode);
  var P={dur:dur,secs:secs,keys:keys,mode:C.mode,mood:mood||null,day:ti?{th:ti.th,lab:ti.lab}:null,i:0,ts:Date.now(),el:0,it:{}};
  return bible().then(function(){
    if(ix.ps!=null){
      var bi=bookIdx('المزامير'), ids=GD.ps.map(function(x,i){return i});
      if(mood){ ids=ids.filter(function(i){return PSM[GD.ps[i][1]]===mood}); if(ids.length<3) ids=ids.concat(GD.ps.map(function(x,i){return i}).filter(function(i){return !PSM[GD.ps[i][1]]})); }
      var psC=ids.map(function(i){ var x=GD.ps[i], v=B[bi].c[x[0]-1]; return {id:'ps'+x[0],h:x[0],cat:x[1],w:wc(v.join(' '))} });
      var r=fit(psC,allowedWords(secs[ix.ps]),true), h=r.c.h, vs=B[bi].c[h-1], n=vs.length;
      if(r.trim){ var a=allowedWords(secs[ix.ps]),acc=0; n=0; while(n<vs.length&&(n<3||acc+wc(vs[n])<=a)){acc+=wc(vs[n]);n++} }
      P.it.ps={h:h,cat:r.c.cat,n:n,all:vs.length}; remember(r.c.id);
    }
    if(ix.pa!=null){
      var dp=ti?dayPassage(ti):null, pa;
      if(dp){ pa=dp; }
      else { var pi=tagged(GD.pa,GD.pt||[],mood,3), paC=pi.map(function(i){ var x=GD.pa[i], c=B[bookIdx(x[0])].c[x[1]-1].slice(x[2]-1,x[3]); return {id:'pa'+i,i:i,w:wc(c.join(' '))} });
        var r2=fit(paC,allowedWords(secs[ix.pa])); pa=GD.pa[r2.c.i]; remember(r2.c.id); }
      P.it.pa=pa;
    }
    if(ix.fp!=null){
      var fi=tagged(GD.fp,GD.ft||[],mood,2), fpC=fi.map(function(i){return {id:'fp'+i,i:i,w:wc(GD.fp[i].text.join(' '))}});
      var r3=fit(fpC,allowedWords(secs[ix.fp])); P.it.fp=r3.c.i; remember(r3.c.id);
    }
    if(ix.jp2!=null){
      var arr=GD.ar.map(function(_,i){return i}), N=Math.max(3,Math.min(14,Math.round(secs[ix.jp2]/25)));
      for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=arr[i];arr[i]=arr[j];arr[j]=t}
      P.it.ar=arr.slice(0,N);
    }
    if(ix.ct!=null){
      var ci=tagged(GD.ct,GD.cg||[],mood,2), ctC=ci.map(function(i){return {id:'ct'+i,i:i,w:wc(GD.ct[i].x.join(' '))}});
      var rc=fit(ctC,allowedWords(secs[ix.ct])*.65); P.it.ct=rc.c.i; remember(rc.c.id);
      var q=null;
      if(C.mode==='today'){ try{ var fo=window.__fatherOfDay&&window.__fatherOfDay(new Date()); if(fo&&fo.t&&wc(fo.t)<=90) q={f:fo.f,p:fo.p,n:fo.n,t:fo.t,day:1}; }catch(x){} }
      if(!q){ var si=tagged(GD.fs,GD.sg||[],mood,3), fsC=si.map(function(i){return {id:'fs'+i,i:i,w:wc(GD.fs[i].t)}}); var rf=fit(fsC,allowedWords(secs[ix.ct])*.35); var f=GD.fs[rf.c.i]; q={f:f.f,p:f.p,n:f.n,t:f.t}; remember(rf.c.id); }
      P.it.fs=q;
    }
    return P;
  });
}
/* ---------- السجل والمتابعة ---------- */
var WD=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'], MON=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
function dkey(t){ var d=new Date(t); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }
function logs(){ var a=jr(LK,[]); return Array.isArray(a)?a:[]; }
function stats(){
  var L=logs(), days={}, now=new Date(), wkMin=0, wkN=0, tot=0, i;
  L.forEach(function(e){ days[dkey(e.ts)]=1; tot+=e.mins||e.dur||0; if(now-e.ts<7*864e5){wkN++;wkMin+=e.mins||e.dur||0} });
  var st=0, d=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  if(!days[dkey(d)]) d=new Date(d.getTime()-864e5);
  while(days[dkey(d)]){ st++; d=new Date(d.getTime()-864e5); }
  var dots=[]; for(i=6;i>=0;i--){ var x=new Date(now.getFullYear(),now.getMonth(),now.getDate()-i); dots.push({on:!!days[dkey(x)],wd:WD[x.getDay()].replace(/^ال/,'').slice(0,2),today:i===0}); }
  return {n:L.length,tot:tot,streak:st,wkN:wkN,wkMin:wkMin,dots:dots,today:!!days[dkey(now)]};
}
function when(t){ var d=new Date(t); return WD[d.getDay()]+' '+ar(d.getDate())+' '+MON[d.getMonth()]; }
function modeName(k){ return k?modeOf(k).t:''; }
function logText(){
  return logs().map(function(e){ var it=e.items||{}; return '• '+when(e.ts)+' — '+ar(e.mins||e.dur)+' دقيقة'+(e.mode?' — '+modeName(e.mode):'')+(it.ps?'\n  مزمور '+ar(it.ps):'')+(it.pa?'\n  '+it.pa:'')+(it.fp?'\n  '+it.fp:'')+(e.note?'\n  ملاحظتي: '+e.note:''); }).join('\n\n');
}
function copyText(t){
  function fb(){ try{ var ta=document.createElement('textarea'); ta.value=t; ta.style.cssText='position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); toast('✓ اتنسخ السجل'); }catch(e){ toast('تعذّر النسخ'); } }
  try{ navigator.clipboard.writeText(t).then(function(){toast('✓ اتنسخ السجل')},fb); }catch(e){ fb(); }
}
/* ---------- الواجهة ---------- */
var root, P=null, paused=false, wake=null, cnt=0, arI=0, openLog=false;
function ensureDom(){
  if($('view-guided')) return;
  var vm=$('view-meditation'), sw=document.querySelector('#mod-k .app-switcher'); if(!vm||!sw) return;
  var v=document.createElement('div'); v.id='view-guided'; v.style.display='none'; v.innerHTML='<div class="gd-wrap" id="gdRoot"></div>';
  vm.parentNode.insertBefore(v,vm.nextSibling); root=$('gdRoot');
  var tab=document.createElement('div'); tab.className='app-tab'; tab.id='tabGuided'; tab.setAttribute('role','button'); tab.tabIndex=0; tab.textContent='🕯 الخلوة الفردية';
  tab.addEventListener('click',function(){window.switchApp('guided')});
  tab.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();window.switchApp('guided')}});
  var tm=$('tabMeditation'); tm.parentNode.insertBefore(tab,tm.nextSibling);
  var os=window.switchApp, og=window.goHome;
  var ta0=$('tabAgpeya'); if(ta0) ta0.addEventListener('click',function(){ if(ta0.classList.contains('home-tap')) try{window.goHome()}catch(e){} ta0.classList.add('home-tap'); },true);
  window.switchApp=function(which){
    var va=$('view-agpeya'), vm2=$('view-meditation'), vg=$('view-guided'), ta=$('tabAgpeya'), tm2=$('tabMeditation'), tg=$('tabGuided');
    if(which==='guided'){
      os('meditation'); vm2.style.display='none'; vg.style.display=''; tm2.classList.remove('active'); ta.classList.remove('active'); tg.classList.add('active'); onShow();
    } else { os(which); vg.style.display='none'; tg.classList.remove('active'); stopTimer(); }
  };
  window.goHome=function(){ og.apply(this,arguments); var vg=$('view-guided'); if(vg){vg.style.display='none'; $('tabGuided').classList.remove('active'); stopTimer();} };
}
function onShow(){ if(!P||P.done) setup(); else if(root&&!root.firstChild) setup(); else if(P&&!P.done){ startTimer(); lastT=Date.now(); } try{window.scrollTo(0,0)}catch(e){} }
function saved(){ var s=jr(SK,null); if(!s||!s.secs||s.done) return null; var n=(s.keys||STEPS).length; return s.i<n?s:null; }
function setup(){
  stopTimer(); tickStop(); paused=false; P=null;
  var C=cfgGet(), sv=saved(), S=stats(), ti=todayInfo(), h='';
  h+='<div class="gd-hero"><div class="gd-ic">🕯</div><h2>الخلوة الفردية</h2><p>اختر نمط الخلوة والوقت اللي معاك، والتطبيق يرتّب لك خلوة كاملة: مزمور، صلاة يسوع، كلمة من الكتاب، صلاة من الآباء، صلاة سهمية، تأمل مع قول من أقوال الآباء، كيرياليسون، وأبانا الذي. في كل مرة بتختلف.</p></div>';
  if(sv){ var nk=(sv.keys||STEPS).length; h+='<div class="gd-card gd-resume"><b>عندك خلوة لسه ما خلصتش</b><span>'+ar(sv.dur)+' دقيقة · وصلت للجزء '+ar(sv.i+1)+' من '+ar(nk)+'</span><div class="gd-row"><button type="button" class="gd-btn gd-pri" data-a="resume">كمّل خلوتك</button><button type="button" class="gd-btn" data-a="drop">ابدأ من جديد</button></div></div>'; }
  h+=remindHtml(C,S);
  h+='<div class="gd-card gd-stats" id="gdStats">'+statsHtml(S,C)+'</div>';
  h+='<div class="gd-lab">نمط الخلوة</div><div class="gd-modes" role="radiogroup" aria-label="نمط الخلوة">'+MODES.map(function(m){ return '<button type="button" role="radio" aria-checked="'+(m.k===C.mode)+'" class="gd-mode'+(m.k===C.mode?' on':'')+'" data-m="'+m.k+'"><span class="gd-mi">'+m.ic+'</span><b>'+esc(m.t)+'</b></button>'}).join('')+'</div><div class="gd-sub gd-mdesc" id="gdMd"></div><div id="gdToday"></div>';
  h+='<div class="gd-lab">كام دقيقة عندك؟</div><div class="gd-durs" role="radiogroup" aria-label="مدة الخلوة" id="gdDurs"></div>';
  h+='<details class="gd-det" id="gdDet"><summary>خصّص أجزاء الخلوة <span id="gdDetN"></span></summary><div class="gd-sub" style="margin:4px 0 6px">شيل أي جزء مش عايزه، والوقت يتوزّع على الباقي. لازم جزءان على الأقل.</div><div id="gdSw"></div></details>';
  h+='<div class="gd-card" id="gdPrev"></div><div class="gd-row"><button type="button" class="gd-btn gd-pri gd-big" data-a="start">ابدأ الخلوة</button></div>';
  h+='<details class="gd-det" id="gdSet"><summary>ميعادي المعتاد</summary><div class="gd-setrow"><label for="gdRt">ميعادي المعتاد <small>(اختياري)</small></label><input type="time" id="gdRt" class="gd-time" value="'+esc(C.rt)+'"></div><div class="gd-sub">التذكير بيظهر هنا جوّه الصفحة لما تفتح التطبيق؛ مش إشعار خارجي.</div></details>';
  h+='<div class="gd-lab">سجلّ خلواتي</div><div class="gd-card" id="gdLog"></div>';
  h+='<p class="gd-note">مفيش مؤقّت بيجبرك على وقت لكل جزء: التطبيق بيختار لك المحتوى بحجم يناسب وقتك، وإنت تاخد راحتك في كل جزء. اضغط مطوّلًا على أي جملة لتظلّلها وتحفظها.</p>';
  root.innerHTML=h; paintSetup();
}
function remindHtml(C,S){
  if(S.today) return '';
  if(!C.rt) return '';
  var n=new Date(), p=C.rt.split(':'), t=new Date(n.getFullYear(),n.getMonth(),n.getDate(),+p[0]||0,+p[1]||0), h12=((+p[0]||0)%12)||12, ap=(+p[0]||0)>=12?'م':'ص', tm=ar(h12)+':'+ar(('0'+(+p[1]||0)).slice(-2))+' '+ap;
  return '<div class="gd-card gd-rem">'+(n>=t?'⏰ عدّى ميعاد خلوتك ('+tm+') ولسه ما عملتش خلوة النهارده':'⏰ ميعاد خلوتك النهارده الساعة '+tm)+'</div>';
}
function statsHtml(S,C){
  var L=logs(), by={}, now=new Date(), t0=new Date(now.getFullYear(),now.getMonth(),now.getDate()), cells='', i;
  L.forEach(function(e){ var k=dkey(e.ts); by[k]=(by[k]||0)+(e.mins||e.dur||0); });
  for(i=6;i>=0;i--){
    var d=new Date(t0.getFullYear(),t0.getMonth(),t0.getDate()-i), m=by[dkey(d)]||0, lv=m>=40?4:m>=20?3:m>=10?2:m>0?1:0;
    cells+='<div class="gd-hc"><i class="gd-hm'+(lv?' s'+lv:'')+(i===0?' today':'')+'" title="'+esc(when(d.getTime())+(m?' — '+ar(m)+' د':''))+'"></i><u>'+esc(WD[d.getDay()].replace(/^ال/,'').slice(0,2))+'</u></div>';
  }
  return '<div class="gd-lab" style="margin-top:0">آخر ٧ أيام</div><div class="gd-heat" role="img" aria-label="متابعة الخلوة آخر سبعة أيام">'+cells+'</div><div class="gd-legend"><span>أقل</span><i class="gd-hm"></i><i class="gd-hm s1"></i><i class="gd-hm s2"></i><i class="gd-hm s3"></i><i class="gd-hm s4"></i><span>أكثر</span></div><div class="gd-sub gd-hs">'+(S.streak?ar(S.streak)+' يوم متتالي · ':'')+ar(S.wkN)+' خلوة و'+ar(S.wkMin)+' دقيقة آخر ٧ أيام'+(S.n?' · إجمالي '+ar(S.n)+' خلوة':'')+'</div>';
}
function paintSetup(){
  var C=cfgGet(), m=modeOf(C.mode), ti=todayInfo();
  $('gdMd').textContent=m.d;
  var td=$('gdToday'); td.innerHTML=(C.mode==='today'&&ti)?'<div class="gd-card gd-day"><div class="gd-dl">📅 '+esc(ti.lab)+'</div><div class="gd-dt">موضوع اليوم: <b>'+esc(ti.th)+'</b></div>'+(ti.mood?'<div class="gd-sub">النمط اللي هيتختار على حسبه: '+esc(modeName(ti.mood))+'</div>':'')+'</div>':(C.mode==='today'?'<div class="gd-sub">تأمل اليوم مش متاح دلوقتي، هنختار لك خلوة متنوعة.</div>':'');
  var du=$('gdDurs'); du.innerHTML=DURS.map(function(d){return '<button type="button" role="radio" aria-checked="'+(d===C.dur)+'" class="gd-dur'+(d===C.dur?' on':'')+'" data-d="'+d+'"><b>'+ar(d)+'</b><span>دقيقة</span></button>'}).join('');
    var keys=activeKeys(C), secs=plan(C.dur,keys);
  $('gdSw').innerHTML=STEPS.map(function(s){ var on=keys.indexOf(s.k)>=0, i=keys.indexOf(s.k); return '<label class="gd-sw"><input type="checkbox" data-s="'+s.k+'"'+(on?' checked':'')+'><span class="gd-pi">'+s.ic+'</span><span class="gd-pt">'+esc(s.t)+'</span></label>'}).join('');
  $('gdDetN').textContent='('+ar(keys.length)+' من '+ar(STEPS.length)+')';
  $('gdPrev').innerHTML='<div class="gd-lab" style="margin-top:0">إيه اللي هتصليه (بحجم يناسب '+ar(C.dur)+' دقيقة)</div><ol class="gd-plan">'+keys.map(function(k,i){var s=stepOf(k);return '<li><span class="gd-pi">'+s.ic+'</span><span class="gd-pt">'+esc(s.t)+'</span></li>'}).join('')+'</ol>';
  $('gdStats').innerHTML=statsHtml(stats(),C); paintLog();
}
function paintLog(){
  var L=logs(), el=$('gdLog'); if(!el) return;
  if(!L.length){ el.innerHTML='<div class="gd-sub" style="text-align:center">لسه مفيش خلوات متسجّلة. أول خلوة تخلصها هتظهر هنا مع ملاحظتك.</div>'; return; }
  var shown=openLog?L.slice(0,40):L.slice(0,3);
  el.innerHTML=shown.map(function(e){ var it=e.items||{};
    return '<div class="gd-le"><div class="gd-lh"><b>'+esc(when(e.ts))+'</b><span>'+ar(e.mins||e.dur)+' د'+(e.mode?' · '+esc(modeName(e.mode)):'')+'</span><button type="button" class="gd-x" data-a="ldel" data-t="'+e.ts+'" aria-label="حذف">✕</button></div>'+
    '<div class="gd-lr">'+[it.ps?'مزمور '+ar(it.ps):'',it.pa||'',it.fp||''].filter(Boolean).map(esc).join(' · ')+'</div>'+(e.note?'<div class="gd-ln">«'+esc(e.note)+'»</div>':'')+'</div>'; }).join('')+
   '<div class="gd-row">'+(L.length>3?'<button type="button" class="gd-btn" data-a="ltog">'+(openLog?'إخفاء':'عرض الكل ('+ar(L.length)+')')+'</button>':'')+'<button type="button" class="gd-btn" data-a="lcopy">نسخ السجل</button></div>';
}
function fns(list){ return list&&list.length?'<div class="gd-fn"><b>المصدر:</b> '+list.map(function(f){return f.url?'<a href="'+esc(f.url)+'" target="_blank" rel="noopener">'+esc(f.name)+'</a>':esc(f.name)}).join(' — ')+'</div>':'' }
var BIBFN='<div class="gd-fn"><b>المصدر:</b> الكتاب المقدس (الترجمة العربية المتداولة) المضمّن بالتطبيق — للمطابقة: <a href="https://st-takla.org/" target="_blank" rel="noopener">موقع الأنبا تكلا</a></div>';
function paOf(){ var p=P.it.pa; return typeof p==='number'?GD.pa[p]:p; }
function fsOf(){ var q=P.it.fs; return typeof q==='number'?GD.fs[q]:q; }
function body(i){
  var it=P.it, k=P.keys[i], s=P.secs[i];
  if(k==='ps'){
    var h=it.ps.h, vs=B[bookIdx('المزامير')].c[h-1].slice(0,it.ps.n), l=lxx(h), ttl='مزمور '+ar(l)+(l!==String(h)?' ('+ar(h)+')':'');
    return '<div class="gd-ref">'+esc(ttl)+' <i>'+esc(it.ps.cat)+'</i></div><div class="gd-text gd-scr">'+vs.map(function(t,j){return '<span class="gd-v" data-n="'+ar(j+1)+'">'+esc(t)+'</span>'}).join(' ')+'</div>'+(it.ps.n<it.ps.all?'<div class="gd-sub">مقتطف: الآيات ١–'+ar(it.ps.n)+' من '+ar(it.ps.all)+' (على قد وقت الخلوة)</div>':'')+BIBFN;
  }
  if(k==='pa'){
    var p=paOf(), b=B[bookIdx(p[0])], vs2=b.c[p[1]-1].slice(p[2]-1,p[3]);
    var dayNote=P.day&&p[5]==='day'?'<div class="gd-sub gd-dn">من تأمل اليوم: «'+esc(P.day.th)+'» — الآية في وسط الفصل وحولها السياق</div>':'';
    return '<div class="gd-ref">'+esc(p[0])+' '+ar(p[1])+': '+ar(p[2])+(p[3]>p[2]?'–'+ar(p[3]):'')+' <i>'+(p[5]==='day'?'كلمة اليوم':(p[4]==='OT'?'عهد قديم':'عهد جديد'))+'</i></div><div class="gd-text gd-scr">'+vs2.map(function(t,j){return '<span class="gd-v" data-n="'+ar(p[2]+j)+'">'+esc(t)+'</span>'}).join(' ')+'</div>'+dayNote+BIBFN;
  }
  if(k==='fp'){
    var f=GD.fp[it.fp]; return '<div class="gd-ref">'+esc(f.title)+(f.author?' <i>'+esc(f.author)+'</i>':'')+'</div><div class="gd-text gd-scr">'+f.text.map(function(t){return '<p>'+esc(t)+'</p>'}).join('')+'</div>'+(f.source?'<div class="gd-fn"><b>المصدر:</b> '+esc(f.source)+'</div>':'')+fns(f.fn);
  }
  if(k==='jp1'){
    var target=Math.max(5,Math.round(s/10));
    return '<div class="gd-big-pr gd-text">يا ربي يسوع المسيح ابن الله الحي،<br>ارحمني أنا الخاطئ</div>'+counter(target)+'<div class="gd-fn"><b>ملحوظة:</b> الصلاة التقليدية في الكنيسة؛ للاستزادة: <a href="https://popeshenouda.org.eg/" target="_blank" rel="noopener">موقع البابا شنودة الثالث</a> · <a href="https://st-takla.org/" target="_blank" rel="noopener">الأنبا تكلا</a></div>';
  }
  if(k==='jp2'){
    return '<div class="gd-base gd-text">يا ربي يسوع المسيح ابن الله الحي، ارحمني أنا الخاطئ</div><div class="gd-arrow" id="gdArrow"></div><div class="gd-row gd-ar-nav"><button type="button" class="gd-btn" data-a="arp">→ السابقة</button><span id="gdArC" class="gd-sub"></span><button type="button" class="gd-btn gd-pri" data-a="arn">التالية ←</button></div><div class="gd-fn"><b>ملحوظة:</b> «الصلاة السهمية» نص متداول للتعبّد، أضافه صاحب التطبيق.</div>';
  }
  if(k==='ct'){
    var c=GD.ct[it.ct], q=fsOf();
    return '<div class="gd-ref">'+esc(c.t)+'</div><div class="gd-text gd-scr">'+c.x.map(function(t){return /^\(.*\)$/.test(t)?'<p class="gd-pause">'+esc(t)+'</p>':'<p>'+esc(t)+'</p>'}).join('')+'</div><div class="gd-quote gd-text">«'+esc(q.t)+'»</div><div class="gd-sub">— '+esc(q.f)+(q.day?' · قول اليوم من الآباء':'')+'</div><div class="gd-fn"><b>المصدر:</b> الصلاة: صياغة تأمّلية خاصة بالتطبيق. القول: «أقوال الآباء الشيوخ» (آباء الكنيسة ٦)، ترجمة معهد القديس يوحنا الدمشقي – البلمند، منشورات النور ١٩٩٠ — ص '+ar(q.p)+'، رقم '+ar(q.n)+'.</div>';
  }
  if(k==='ky'){
    var K=GD.kyrie, tg=Math.max(3,Math.min(41,Math.round(s/4)));
    return '<div class="gd-text gd-scr">'+K.text.map(function(t){return '<p>'+esc(t)+'</p>'}).join('')+'</div>'+counter(tg,'والكنيسة تقولها ٤١ مرة')+fns(K.fn);
  }
  var A=GD.abana; return '<div class="gd-ref">'+esc(A.title)+' <i>'+esc(String(A.ref).split(' — ')[0])+'</i></div><div class="gd-text gd-scr">'+A.text.map(function(t){return '<p>'+esc(t)+'</p>'}).join('')+'</div>'+fns(A.fn);
}
function counter(target,extra){ return '<div class="gd-cnt"><button type="button" class="gd-cb" data-a="cnt" aria-label="عدّاد"><b id="gdCn">'+ar(cnt)+'</b><span>اضغط مع كل مرة</span></button><div class="gd-sub">المقترح حوالي '+ar(target)+' مرة'+(extra?' ('+extra+')':'')+' — مش لازم تكمّلها بالظبط</div></div>'; }
function mount(){
  var segs=P.keys.map(function(k){return '<i style="flex-grow:'+stepOf(k).w+'"></i>'}).join('');
  var dayBar=P.day?'<div class="gd-daybar">📅 '+esc(P.day.lab)+' · '+esc(P.day.th)+'</div>':(P.mood?'<div class="gd-daybar">'+modeOf(P.mood).ic+' نمط: '+esc(modeOf(P.mood).t)+'</div>':'');
  root.innerHTML='<div class="gd-clock" id="gdClock"><div class="gd-ck-row"><button type="button" class="gd-sbtn" data-a="exit" aria-label="خروج">✕</button><div class="gd-ck-mid"><span class="gd-clk" id="gdClk" role="timer" aria-live="off">'+clock(P.dur*60-(P.el||0))+'</span><span class="gd-ck-l" id="gdCkL">متبقّي من الخلوة</span></div><button type="button" class="gd-sbtn" data-a="pause" id="gdPz" aria-label="إيقاف مؤقت للعدّاد">⏸</button></div><div class="gd-seg" id="gdSeg" aria-hidden="true">'+segs+'<b id="gdNd"></b></div></div>'+dayBar+'<div id="gdStep"></div>';
  tickStart(); needle();
}
function needle(){ var n=$('gdNd'); if(!n||!P) return; n.style.insetInlineStart=Math.min(100,(P.el||0)/(P.dur*60)*100).toFixed(2)+'%'; var sg=$('gdSeg'); if(sg) sg.querySelectorAll('i').forEach(function(e,k){e.className=k<P.i?'dn':k===P.i?'cu':''}); }
function paintClock(){
  var c=$('gdClk'); if(!c||!P) return; var rem=Math.max(0,P.dur*60-(P.el||0));
  c.textContent=clock(rem); c.classList.toggle('end',rem<=0); var l=$('gdCkL'); if(l) l.textContent=rem<=0?'انتهى وقت الخلوة ✓ — كمّل براحتك أو أنهِها':(paused?'العدّاد متوقّف':'متبقّي من الخلوة');
  var pz=$('gdPz'); if(pz) pz.textContent=paused?'▶':'⏸'; needle();
  var sw=document.querySelector('#mod-k .app-switcher'); if(sw){ var cs=getComputedStyle(sw), t=parseFloat(cs.top)||0; root.style.setProperty('--gd-top',(t+sw.offsetHeight+6)+'px'); }
}
var tk=0, lastT=0, ticks=0;
function tickStart(){ clearInterval(tk); lastT=Date.now(); ticks=0; paintClock(); tk=setInterval(function(){
  var now=Date.now(), d=(now-lastT)/1000; lastT=now; if(!P||P.done||!$('gdClk')){ return; }
  var vg=$('view-guided'), vis=document.visibilityState==='visible'&&vg&&vg.style.display!=='none';
  if(vis&&!paused&&d<5){ var before=P.el||0; P.el=before+d; if(before<P.dur*60&&P.el>=P.dur*60){ try{navigator.vibrate&&navigator.vibrate([80,80,80])}catch(e){} toast('انتهى وقت الخلوة ✓') } }
  if(++ticks%5===0) save(); paintClock();
},1000); }
function tickStop(){ clearInterval(tk); tk=0; }
function step(i){
  P.i=i; cnt=0; arI=0; if(!$('gdStep')) mount(); save();
  var k=P.keys[i], S=stepOf(k), n=P.keys.length;
  $('gdStep').innerHTML='<div class="gd-card gd-st"><div class="gd-sh"><span class="gd-ic2">'+S.ic+'</span><h3>'+esc(S.t)+'</h3><span class="gd-pn">'+ar(i+1)+' / '+ar(n)+'</span></div><div class="gd-hint">'+esc(S.h)+'</div>'+
   body(i)+'</div><div class="gd-nav"><button type="button" class="gd-btn" data-a="prev"'+(i?'':' disabled')+'>→ السابق</button><button type="button" class="gd-btn gd-pri" data-a="next">'+(i===n-1?'إنهاء الخلوة ✓':'التالي ←')+'</button></div>';
  if(k==='jp2') arShow();
  startTimer(); needle(); try{window.scrollTo(0,0)}catch(e){}
}
function arShow(){ var a=P.it.ar, n=a.length; $('gdArrow').innerHTML='<span class="gd-pre">يا ربي يسوع المسيح</span> <b class="gd-text">'+esc(GD.ar[a[arI]])+'</b>'; $('gdArC').textContent=ar(arI+1)+' / '+ar(n); }
function startTimer(){ try{if(navigator.wakeLock&&!wake) navigator.wakeLock.request('screen').then(function(w){wake=w;w.addEventListener('release',function(){wake=null})},function(){})}catch(e){} }
function stopTimer(keepWake){ if(!keepWake&&wake){ try{wake.release()}catch(e){} wake=null } }
function save(){ if(P) wr(SK,JSON.stringify({dur:P.dur,secs:P.secs,keys:P.keys,mode:P.mode,mood:P.mood,day:P.day,i:P.i,ts:P.ts,it:P.it,el:Math.round(P.el||0),done:!!P.done})); }
function summary(){
  var it=P.it, o=[];
  P.keys.forEach(function(k){
    if(k==='ps'&&it.ps) o.push('مزمور '+ar(lxx(it.ps.h)));
    else if(k==='pa'){ var p=paOf(); if(p) o.push(p[0]+' '+ar(p[1])+': '+ar(p[2])+(p[3]>p[2]?'–'+ar(p[3]):'')); }
    else if(k==='fp'&&it.fp!=null&&GD.fp[it.fp]) o.push(GD.fp[it.fp].title);
    else if(k==='ct'&&it.ct!=null) o.push('صلاة «'+GD.ct[it.ct].t+'»');
  });
  return o;
}
function finish(){
  stopTimer(); tickStop(); P.done=true; wr(SK,''); var mins=Math.max(1,Math.round((P.el||0)/60)); P.mins=mins;
  var sm=summary();
  root.innerHTML='<div class="gd-hero"><div class="gd-ic">🕯</div><h2>بارك الله خلوتك</h2><p>قضيت وقتًا مع الله. خلّي كلمة واحدة من اللي قريتها تفضل معاك النهارده.</p></div><div class="gd-card"><div class="gd-lab" style="margin-top:0">اللي صلّيته النهارده</div><ol class="gd-plan">'+P.keys.map(function(k){var s=stepOf(k);return '<li><span class="gd-pi">✓</span><span class="gd-pt">'+esc(s.t)+'</span></li>'}).join('')+'</ol>'+(sm.length?'<div class="gd-sub gd-sm">'+sm.map(esc).join(' · ')+'</div>':'')+'</div><label class="gd-lab" for="gdNote">إيه اللي لمسك النهارده؟ <small>(اختياري)</small></label><textarea id="gdNote" class="gd-ta" rows="3" maxlength="400" placeholder="سطر بكلامك إنت…"></textarea><div class="gd-row"><button type="button" class="gd-btn gd-pri gd-big" data-a="done">حفظ والعودة</button></div>';
}
function logIt(note){
  var a=logs(), it=P.it, p=P.keys.indexOf('pa')>=0?paOf():null, q=P.keys.indexOf('fp')>=0&&it.fp!=null?GD.fp[it.fp]:null;
  a.unshift({ts:Date.now(),dur:P.dur,mins:P.mins||P.dur,note:note||'',mode:P.mode||'',items:{ps:it.ps?lxx(it.ps.h):'',pa:p?p[0]+' '+ar(p[1])+': '+ar(p[2])+(p[3]>p[2]?'–'+ar(p[3]):''):'',fp:q?q.title:''}});
  wr(LK,JSON.stringify(a.slice(0,120)));
}
function load(){ var s=saved(); if(!s) return; if(!s.keys) s.keys=STEPS.map(function(x){return x.k}); bible().then(function(){ P=s; step(P.i) },function(){toast('تعذّر تحميل نص الكتاب')}); }
var delArm=0;
function click(e){
  var m=e.target.closest('[data-m]'); if(m&&root.contains(m)){ cfgSet({mode:m.getAttribute('data-m')}); root.querySelectorAll('.gd-mode').forEach(function(b){var on=b===m;b.classList.toggle('on',on);b.setAttribute('aria-checked',on)}); paintSetup(); return; }
  var d=e.target.closest('[data-d]'); if(d&&root.contains(d)){ cfgSet({dur:+d.getAttribute('data-d')}); paintSetup(); return; }
  var b=e.target.closest('[data-a]'); if(!b||!root.contains(b)) return; var a=b.getAttribute('data-a');
  if(a==='start'){ b.disabled=true; b.textContent='لحظة…'; build().then(function(p){P=p;step(0)},function(){toast('تعذّر تحميل نص الكتاب');b.disabled=false;b.textContent='ابدأ الخلوة'}); }
  else if(a==='resume') load();
  else if(a==='drop'){ wr(SK,''); setup(); }
  else if(a==='ltog'){ openLog=!openLog; paintLog(); }
  else if(a==='lcopy'){ copyText(logText()); }
  else if(a==='ldel'){ var t=+b.getAttribute('data-t'); if(delArm===t){ wr(LK,JSON.stringify(logs().filter(function(x){return x.ts!==t}))); delArm=0; paintSetup(); toast('اتحذفت'); } else { delArm=t; b.textContent='تأكيد؟'; b.classList.add('arm'); setTimeout(function(){ if(delArm===t){delArm=0; if(b.isConnected){b.textContent='✕'; b.classList.remove('arm')}} },3000); } }
  else if(a==='next'){ if(P.i>=P.keys.length-1) finish(); else step(P.i+1); }
  else if(a==='prev'){ if(P.i>0) step(P.i-1); }
  else if(a==='exit'){ save(); tickStop(); P=null; setup(); }
  else if(a==='pause'){ paused=!paused; lastT=Date.now(); paintClock(); }
  else if(a==='cnt'){ cnt++; $('gdCn').textContent=ar(cnt); try{navigator.vibrate&&navigator.vibrate(8)}catch(e){} }
  else if(a==='arn'){ if(arI<P.it.ar.length-1){arI++;arShow()} else toast('وصلت لآخر طلبة ✓') }
  else if(a==='arp'){ if(arI>0){arI--;arShow()} }
  else if(a==='done'){ var t2=$('gdNote'); logIt(t2&&t2.value.trim()); P=null; setup(); toast('✓ تم حفظ خلوتك'); }
}
function change(e){
  var s=e.target.closest&&e.target.closest('input[data-s]'); if(s){
    var c=cfgGet(), off=c.off||{}, k=s.getAttribute('data-s');
    if(s.checked) delete off[k]; else off[k]=1;
    if(STEPS.filter(function(x){return !off[x.k]}).length<2){ delete off[k]; s.checked=true; toast('لازم جزءان على الأقل'); return; }
    cfgSet({off:off}); paintSetup(); var dt=$('gdDet'); if(dt) dt.open=true; return;
  }
  if(e.target.id==='gdRt'){ cfgSet({rt:e.target.value||''}); toast(e.target.value?'✓ اتحفظ ميعادك':'اتشال الميعاد'); }
}
function boot(){ ensureDom(); if(!root) return; root.addEventListener('click',click); root.addEventListener('change',change); }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
window.__gd={plan:plan,lxx:lxx,build:build,stats:stats,todayInfo:todayInfo,moodFrom:moodFrom};
})();
