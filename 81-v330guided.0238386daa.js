/* v3.3 — «الخلوة الفردية»: خلوة عشوائية بالوقت (١٠/٢٠/٣٠/٤٥ دقيقة) */
(function(){
'use strict';
var GD=window.__GD; if(!GD) return;
var SK='rafeeq_gd_v1', LK='rafeeq_gd_log_v1', HK='rafeeq_gd_hist_v1';
function $(i){return document.getElementById(i)}
function rd(k){try{return localStorage.getItem(k)}catch(e){return null}}
function wr(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function jr(k,d){try{var v=JSON.parse(rd(k)); return v==null?d:v}catch(e){return d}}
function ar(n){return String(n).replace(/\d/g,function(d){return '٠١٢٣٤٥٦٧٨٩'[d]})}
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
function plan(dur){
  var tot=dur*60, s=STEPS.map(function(x){return Math.max(15,Math.round(tot*x.w/100/5)*5)});
  var sum=s.reduce(function(a,b){return a+b},0); s[5]+=tot-sum; return s;
}
function fmt(sec){ if(sec<60) return ar(Math.round(sec))+' ث'; var m=Math.floor(sec/60), r=Math.round(sec%60/5)*5; if(r===60){m++;r=0} return ar(m)+' د'+(r?' و'+ar(r)+' ث':''); }
function clock(sec){ sec=Math.max(0,Math.round(sec)); var m=Math.floor(sec/60), s=sec%60; return ar(m)+':'+ar(s<10?'0'+s:s); }
/* الكتاب المقدس */
var B=null;
function bible(){ var F=window.__F; if(!F||!F.bible) return Promise.reject(); return F.bible.load().then(function(d){B=d;return d}); }
function bookIdx(n){ for(var i=0;i<B.length;i++) if(B[i].n===n) return i; return -1; }
function lxx(h){ if(h<=8) return String(h); if(h<=10) return '9'; if(h<=113) return String(h-1); if(h<=115) return '113'; if(h===116) return '114، 115'; if(h<=146) return String(h-1); if(h===147) return '146، 147'; return String(h); }
function hist(){return jr(HK,[])}
function remember(id){ var a=hist().filter(function(x){return x!==id}); a.unshift(id); wr(HK,JSON.stringify(a.slice(0,24))); }
function fit(cands,allowed,keepTrim){ /* cands:[{id,w}] */
  var h=hist(), fits=cands.filter(function(c){return c.w<=allowed*1.35}), mid=fits.filter(function(c){return c.w>=allowed*.45}), pool=mid.length?mid:fits;
  var fresh=pool.filter(function(c){return h.indexOf(c.id)<0}); if(fresh.length) pool=fresh;
  if(!pool.length){ if(keepTrim) return {c:rnd(cands),trim:true}; var m=cands.slice().sort(function(a,b){return a.w-b.w}); return {c:m[0],trim:false}; } return {c:rnd(pool),trim:false};
}
function allowedWords(secs){ return secs/60*70; }
function build(dur){
  var secs=plan(dur), P={dur:dur,secs:secs,i:0,ts:Date.now(),el:0,it:{}};
  return bible().then(function(){
    var bi=bookIdx('المزامير');
    var psC=GD.ps.map(function(x){ var v=B[bi].c[x[0]-1]; return {id:'ps'+x[0],h:x[0],cat:x[1],w:wc(v.join(' '))} });
    var r=fit(psC,allowedWords(secs[0]),true), h=r.c.h, vs=B[bi].c[h-1], n=vs.length;
    if(r.trim){ var a=allowedWords(secs[0]),acc=0; n=0; while(n<vs.length&&(n<3||acc+wc(vs[n])<=a)){acc+=wc(vs[n]);n++} }
    P.it.ps={h:h,cat:r.c.cat,n:n,all:vs.length}; remember(r.c.id);
    var paC=GD.pa.map(function(x,i){ var b=bookIdx(x[0]); var c=B[b].c[x[1]-1].slice(x[2]-1,x[3]); return {id:'pa'+i,i:i,w:wc(c.join(' '))} });
    var r2=fit(paC,allowedWords(secs[2])); P.it.pa=r2.c.i; remember(r2.c.id);
    var fpC=GD.fp.map(function(x,i){return {id:'fp'+i,i:i,w:wc(x.text.join(' '))}});
    var r3=fit(fpC,allowedWords(secs[3])); P.it.fp=r3.c.i; remember(r3.c.id);
    var arr=GD.ar.map(function(_,i){return i}), N=Math.max(3,Math.min(14,Math.round(secs[4]/25)));
    for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=arr[i];arr[i]=arr[j];arr[j]=t}
    P.it.ar=arr.slice(0,N);
    var ctC=GD.ct.map(function(x,i){return {id:'ct'+i,i:i,w:wc(x.x.join(' '))}}); var rc=fit(ctC,allowedWords(secs[5])*.65); P.it.ct=rc.c.i; remember(rc.c.id);
    var fsC=GD.fs.map(function(x,i){return {id:'fs'+i,i:i,w:wc(x.t)}}); var rf=fit(fsC,allowedWords(secs[5])*.35); P.it.fs=rf.c.i; remember(rf.c.id);
    return P;
  });
}
/* ---------- الواجهة ---------- */
var root, P=null, timer=0, t0=0, paused=false, left=0, wake=null, cnt=0, arI=0;
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
function saved(){ var s=jr(SK,null); return s&&s.secs&&s.i<8&&!s.done?s:null; }
function setup(sel){
  stopTimer(); tickStop(); paused=false; P=null; sel=sel||20;
  var sv=saved(), h='<div class="gd-hero"><div class="gd-ic">🕯</div><h2>الخلوة الفردية</h2><p>اختر الوقت اللي معاك، والتطبيق يرتّب لك خلوة كاملة بالتسلسل: مزمور، صلاة يسوع، كلمة من الكتاب، صلاة من الآباء، صلاة سهمية، تأمل مع قول من أقوال الآباء، كيرياليسون، وأبانا الذي. في كل مرة بتختلف.</p></div>';
  if(sv) h+='<div class="gd-card gd-resume"><b>عندك خلوة لسه ما خلصتش</b><span>'+ar(sv.dur)+' دقيقة · وصلت للجزء '+ar(sv.i+1)+' من ٨</span><div class="gd-row"><button type="button" class="gd-btn gd-pri" data-a="resume">كمّل خلوتك</button><button type="button" class="gd-btn" data-a="drop">ابدأ من جديد</button></div></div>';
  h+='<div class="gd-lab">كام دقيقة عندك؟</div><div class="gd-durs" role="radiogroup" aria-label="مدة الخلوة">'+DURS.map(function(d){return '<button type="button" role="radio" aria-checked="'+(d===sel)+'" class="gd-dur'+(d===sel?' on':'')+'" data-d="'+d+'"><b>'+ar(d)+'</b><span>دقيقة</span></button>'}).join('')+'</div>';
  h+='<div class="gd-card" id="gdPrev"></div><div class="gd-row"><button type="button" class="gd-btn gd-pri gd-big" data-a="start">ابدأ الخلوة</button></div><p class="gd-note">مفيش مؤقّت بيجبرك على وقت لكل جزء: التطبيق بيختار لك مزمورًا وفصلًا وصلوات بحجم يناسب وقتك، وإنت تاخد راحتك في كل جزء. اضغط مطوّلًا على أي جملة لتظلّلها وتحفظها.</p>';
  root.innerHTML=h; root.setAttribute('data-sel',sel); prev(sel);
}
function prev(d){
  var s=plan(d); $('gdPrev').innerHTML='<div class="gd-lab" style="margin-top:0">إيه اللي هتصليه (بحجم يناسب '+ar(d)+' دقيقة)</div><ol class="gd-plan">'+STEPS.map(function(x,i){return '<li><span class="gd-pi">'+x.ic+'</span><span class="gd-pt">'+esc(x.t)+'</span></li>'}).join('')+'</ol>';
}
function fns(list){ return list&&list.length?'<div class="gd-fn"><b>المصدر:</b> '+list.map(function(f){return f.url?'<a href="'+esc(f.url)+'" target="_blank" rel="noopener">'+esc(f.name)+'</a>':esc(f.name)}).join(' — ')+'</div>':'' }
var BIBFN='<div class="gd-fn"><b>المصدر:</b> الكتاب المقدس (الترجمة العربية المتداولة) المضمّن بالتطبيق — للمطابقة: <a href="https://st-takla.org/" target="_blank" rel="noopener">موقع الأنبا تكلا</a></div>';
function body(i){
  var it=P.it, k=STEPS[i].k, s=P.secs[i];
  if(k==='ps'){
    var h=it.ps.h, vs=B[bookIdx('المزامير')].c[h-1].slice(0,it.ps.n), l=lxx(h), ttl='مزمور '+ar(l)+(l!==String(h)?' ('+ar(h)+')':'');
    return '<div class="gd-ref">'+esc(ttl)+' <i>'+esc(it.ps.cat)+'</i></div><div class="gd-text gd-scr">'+vs.map(function(t,j){return '<span class="gd-v" data-n="'+ar(j+1)+'">'+esc(t)+'</span>'}).join(' ')+'</div>'+(it.ps.n<it.ps.all?'<div class="gd-sub">مقتطف: الآيات ١–'+ar(it.ps.n)+' من '+ar(it.ps.all)+' (على قد وقت الخلوة)</div>':'')+BIBFN;
  }
  if(k==='pa'){
    var p=GD.pa[it.pa], b=B[bookIdx(p[0])], vs2=b.c[p[1]-1].slice(p[2]-1,p[3]);
    return '<div class="gd-ref">'+esc(p[0])+' '+ar(p[1])+': '+ar(p[2])+(p[3]>p[2]?'–'+ar(p[3]):'')+' <i>'+(p[4]==='OT'?'عهد قديم':'عهد جديد')+'</i></div><div class="gd-text gd-scr">'+vs2.map(function(t,j){return '<span class="gd-v" data-n="'+ar(p[2]+j)+'">'+esc(t)+'</span>'}).join(' ')+'</div>'+BIBFN;
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
    var c=GD.ct[it.ct], q=GD.fs[it.fs];
    return '<div class="gd-ref">'+esc(c.t)+'</div><div class="gd-text gd-scr">'+c.x.map(function(t){return /^\(.*\)$/.test(t)?'<p class="gd-pause">'+esc(t)+'</p>':'<p>'+esc(t)+'</p>'}).join('')+'</div><div class="gd-quote gd-text">«'+esc(q.t)+'»</div><div class="gd-sub">— '+esc(q.f)+'</div><div class="gd-fn"><b>المصدر:</b> الصلاة: صياغة تأمّلية خاصة بالتطبيق. القول: «أقوال الآباء الشيوخ» (آباء الكنيسة ٦)، ترجمة معهد القديس يوحنا الدمشقي – البلمند، منشورات النور ١٩٩٠ — ص '+ar(q.p)+'، رقم '+ar(q.n)+'.</div>';
  }
  if(k==='ky'){
    var K=GD.kyrie, tg=Math.max(3,Math.min(41,Math.round(s/4)));
    return '<div class="gd-text gd-scr">'+K.text.map(function(t){return '<p>'+esc(t)+'</p>'}).join('')+'</div>'+counter(tg,'والكنيسة تقولها ٤١ مرة')+fns(K.fn);
  }
  var A=GD.abana; return '<div class="gd-ref">'+esc(A.title)+' <i>'+esc(String(A.ref).split(' — ')[0])+'</i></div><div class="gd-text gd-scr">'+A.text.map(function(t){return '<p>'+esc(t)+'</p>'}).join('')+'</div>'+fns(A.fn);
}
function counter(target,extra){ return '<div class="gd-cnt"><button type="button" class="gd-cb" data-a="cnt" aria-label="عدّاد"><b id="gdCn">'+ar(cnt)+'</b><span>اضغط مع كل مرة</span></button><div class="gd-sub">المقترح حوالي '+ar(target)+' مرة'+(extra?' ('+extra+')':'')+' — مش لازم تكمّلها بالظبط</div></div>'; }
function mount(){
  var segs=STEPS.map(function(x){return '<i style="flex-grow:'+x.w+'"></i>'}).join('');
  root.innerHTML='<div class="gd-clock" id="gdClock"><div class="gd-ck-row"><button type="button" class="gd-sbtn" data-a="exit" aria-label="خروج">✕</button><div class="gd-ck-mid"><span class="gd-clk" id="gdClk" role="timer" aria-live="off">'+clock(P.dur*60-(P.el||0))+'</span><span class="gd-ck-l" id="gdCkL">متبقّي من الخلوة</span></div><button type="button" class="gd-sbtn" data-a="pause" id="gdPz" aria-label="إيقاف مؤقت للعدّاد">⏸</button></div><div class="gd-seg" id="gdSeg" aria-hidden="true">'+segs+'<b id="gdNd"></b></div></div><div id="gdStep"></div>';
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
  var S=STEPS[i];
  $('gdStep').innerHTML='<div class="gd-card gd-st"><div class="gd-sh"><span class="gd-ic2">'+S.ic+'</span><h3>'+esc(S.t)+'</h3><span class="gd-pn">'+ar(i+1)+' / ٨</span></div><div class="gd-hint">'+esc(S.h)+'</div>'+
   body(i)+'</div><div class="gd-nav"><button type="button" class="gd-btn" data-a="prev"'+(i?'':' disabled')+'>→ السابق</button><button type="button" class="gd-btn gd-pri" data-a="next">'+(i===7?'إنهاء الخلوة ✓':'التالي ←')+'</button></div>';
  if(S.k==='jp2') arShow();
  startTimer(); needle(); try{window.scrollTo(0,0)}catch(e){}
}
function arShow(){ var a=P.it.ar, n=a.length; $('gdArrow').innerHTML='<span class="gd-pre">يا ربي يسوع المسيح</span> <b class="gd-text">'+esc(GD.ar[a[arI]])+'</b>'; $('gdArC').textContent=ar(arI+1)+' / '+ar(n); }
function startTimer(){ try{if(navigator.wakeLock&&!wake) navigator.wakeLock.request('screen').then(function(w){wake=w;w.addEventListener('release',function(){wake=null})},function(){})}catch(e){} }
function stopTimer(keepWake){ if(!keepWake&&wake){ try{wake.release()}catch(e){} wake=null } }
function save(){ if(P) wr(SK,JSON.stringify({dur:P.dur,secs:P.secs,i:P.i,ts:P.ts,it:P.it,el:Math.round(P.el||0),done:!!P.done})); }
function finish(){
  stopTimer(); tickStop(); P.done=true; wr(SK,''); var mins=Math.max(1,Math.round((P.el||0)/60));
  root.innerHTML='<div class="gd-hero"><div class="gd-ic">🕯</div><h2>بارك الله خلوتك</h2><p>قضيت وقتًا مع الله. خلّي كلمة واحدة من اللي قريتها تفضل معاك النهاردة.</p></div><div class="gd-card"><ol class="gd-plan">'+STEPS.map(function(x){return '<li><span class="gd-pi">✓</span><span class="gd-pt">'+esc(x.t)+'</span></li>'}).join('')+'</ol></div><label class="gd-lab" for="gdNote">إيه اللي لمسك النهاردة؟ <small>(اختياري)</small></label><textarea id="gdNote" class="gd-ta" rows="3" maxlength="400" placeholder="سطر بكلامك إنت…"></textarea><div class="gd-row"><button type="button" class="gd-btn gd-pri gd-big" data-a="done">حفظ والعودة</button></div>';
  P.mins=mins;
}
function logIt(note){ var a=jr(LK,[]); a.unshift({ts:Date.now(),dur:P.dur,mins:P.mins||P.dur,note:note||'',items:{ps:P.it.ps&&P.it.ps.h,fp:GD.fp[P.it.fp]&&GD.fp[P.it.fp].title}}); wr(LK,JSON.stringify(a.slice(0,60))); }
function load(){ var s=saved(); if(!s) return; bible().then(function(){ P=s; step(P.i) },function(){toast('تعذّر تحميل نص الكتاب')}); }
function click(e){
  var d=e.target.closest('[data-d]'); if(d&&root.contains(d)){ var n=+d.getAttribute('data-d'); root.querySelectorAll('.gd-dur').forEach(function(b){var on=b===d;b.classList.toggle('on',on);b.setAttribute('aria-checked',on)}); root.setAttribute('data-sel',n); prev(n); return; }
  var b=e.target.closest('[data-a]'); if(!b||!root.contains(b)) return; var a=b.getAttribute('data-a');
  if(a==='start'){ var dur=+root.getAttribute('data-sel')||20; b.disabled=true; b.textContent='لحظة…'; build(dur).then(function(p){P=p;step(0)},function(){toast('تعذّر تحميل نص الكتاب');b.disabled=false;b.textContent='ابدأ الخلوة'}); }
  else if(a==='resume') load();
  else if(a==='drop'){ wr(SK,''); setup(+root.getAttribute('data-sel')||20); }
  else if(a==='next'){ if(P.i>=7) finish(); else step(P.i+1); }
  else if(a==='prev'){ if(P.i>0) step(P.i-1); }
  else if(a==='exit'){ save(); tickStop(); P=null; setup(); }
  else if(a==='pause'){ paused=!paused; lastT=Date.now(); paintClock(); }
  else if(a==='cnt'){ cnt++; $('gdCn').textContent=ar(cnt); try{navigator.vibrate&&navigator.vibrate(8)}catch(e){} }
  else if(a==='arn'){ if(arI<P.it.ar.length-1){arI++;arShow()} else toast('وصلت لآخر طلبة ✓') }
  else if(a==='arp'){ if(arI>0){arI--;arShow()} }
  else if(a==='done'){ var t=$('gdNote'); logIt(t&&t.value.trim()); P=null; setup(); toast('✓ تم حفظ خلوتك'); }
}
function boot(){ ensureDom(); if(!root) return; root.addEventListener('click',click); }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
window.__gd={plan:plan,lxx:lxx};
})();
