/* v2.97: (1) إبقاء الشاشة مضاءة أثناء الصلاة  (2) زر «قرأت اليوم» في القراءات */
(function(){
  'use strict';
  var F=function(){return window.__F;};
  function $(i){return document.getElementById(i);}
  /* ---------- 1) Wake Lock ---------- */
  var WK='rafeeq_wake_v1', lock=null, pending=false;
  function wakeOn(){ try{ return localStorage.getItem(WK)!=='0'; }catch(e){ return true; } }
  function supported(){ return !!(navigator.wakeLock && navigator.wakeLock.request); }
  function pageOn(){ var p=$('page-pray'); return !!(p&&p.classList.contains('on')); }
  function paint(){
    var b=$('wakeChip'); if(!b) return;
    var on=wakeOn();
    b.setAttribute('aria-pressed',on?'true':'false');
    b.classList.toggle('off',!on);
    b.querySelector('span').textContent=on?(lock?'الشاشة تبقى مضاءة أثناء الصلاة':'إبقاء الشاشة مضاءة'):'الشاشة تنطفئ كالمعتاد';
    b.querySelector('i').textContent=on?'☀':'☾';
  }
  function acquire(){
    if(lock||pending||!supported()||!wakeOn()||!pageOn()||document.visibilityState!=='visible') return;
    pending=true;
    try{
      navigator.wakeLock.request('screen').then(function(l){
        pending=false; lock=l; l.addEventListener('release',function(){ if(lock===l){ lock=null; paint(); } }); paint();
        if(!pageOn()||!wakeOn()) release();
      }).catch(function(){ pending=false; lock=null; paint(); });
    }catch(e){ pending=false; }
  }
  function release(){ var l=lock; lock=null; if(l){ try{ l.release(); }catch(e){} } paint(); }
  function sync(){ if(pageOn()&&wakeOn()) acquire(); else release(); }
  function mountChip(){
    if(!supported()||$('wakeChip')) return;
    var p=$('page-pray'); if(!p) return;
    var b=document.createElement('button'); b.type='button'; b.id='wakeChip'; b.className='wake-chip';
    b.innerHTML='<i aria-hidden="true">☀</i><span></span>';
    b.addEventListener('click',function(){
      var nv=!wakeOn(); try{ localStorage.setItem(WK,nv?'1':'0'); }catch(e){}
      sync(); paint();
      try{ F()&&F().toast(nv?'الشاشة ستبقى مضاءة أثناء الصلاة':'عادت الشاشة للانطفاء كالمعتاد'); }catch(e){}
    });
    p.insertBefore(b,p.firstChild); paint();
  }
  function initWake(){
    mountChip();
    var p=$('page-pray'); if(p&&window.MutationObserver) new MutationObserver(sync).observe(p,{attributes:true,attributeFilter:['class']});
    document.addEventListener('visibilitychange',sync);
    window.addEventListener('pagehide',release);
    sync();
  }
  /* ---------- 2) قرأت اليوم ---------- */
  function iso(d){ var m=d.getMonth()+1, dd=d.getDate(); return d.getFullYear()+'-'+(m<10?'0':'')+m+'-'+(dd<10?'0':'')+dd; }
  function viewed(){ var di=$('dateIn'); var v=di&&di.value; if(v&&/^\d{4}-\d\d-\d\d$/.test(v)){ var q=v.split('-'); return new Date(+q[0],+q[1]-1,+q[2]); } return new Date(); }
  function paintRead(){
    var bar=$('readDoneBar'); if(!bar||!F()||!F().readDone) return;
    var d=viewed(), today=iso(new Date()), k=iso(d), fut=k>today;
    bar.hidden=fut; if(fut) return;
    var done=!!F().readDone(k), btn=bar.querySelector('button');
    bar.classList.toggle('done',done);
    btn.setAttribute('aria-pressed',done?'true':'false');
    btn.querySelector('b').textContent=done?'✓':'○';
    btn.querySelector('span').textContent=(k===today)?(done?'قرأتُ قراءات اليوم':'قرأتُ قراءات اليوم'):(done?'قرأتُ قراءات هذا اليوم':'قرأتُ قراءات هذا اليوم');
    var hint=bar.querySelector('small'); hint.textContent=done?'سُجّلت في «رحلتي» — اضغط للتراجع':'اضغط ليُسجَّل في «رحلتي» وتتقدّم سلسلة الأيام';
  }
  function mountRead(){
    if($('readDoneBar')) return;
    var host=$('readingHost'); if(!host||!host.parentNode) return;
    var bar=document.createElement('div'); bar.id='readDoneBar'; bar.className='read-done-bar';
    bar.innerHTML='<button type="button"><b aria-hidden="true">○</b><span></span></button><small></small>';
    bar.querySelector('button').addEventListener('click',function(){
      var f=F(); if(!f||!f.setDay) return; var k=iso(viewed()), now=!f.readDone(k);
      f.setDay(k,function(d){ if(now) d.read=1; else delete d.read; });
      paintRead();
      try{ f.toast(now?'تم تسجيل القراءات ✓':'أُلغي التسجيل'); }catch(e){}
      try{ if(window.__navSync) window.__navSync(); }catch(e){}
    });
    host.parentNode.insertBefore(bar,host); paintRead();
    if(window.MutationObserver) new MutationObserver(paintRead).observe(host,{childList:true});
    var di=$('dateIn'); if(di) di.addEventListener('change',function(){ setTimeout(paintRead,60); });
  }

  /* =====================================================================
     مشترك
     ===================================================================== */
  function esc(t){ return String(t==null?'':t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function R(){ return window.__rafeeq; }
  function bible(){ var f=F(); return f&&f.bible; }
  function nrm(t){ var f=F(); return f&&f.norm?f.norm(String(t||'')):String(t||''); }
  function jget(k,d){ try{ var v=JSON.parse(localStorage.getItem(k)); return v==null?d:v; }catch(e){ return d; } }
  function jset(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
  function toast(m){ try{ F()&&F().toast(m); }catch(e){} }
  var LATN='ar-EG-u-nu-latn';
  function dateLabel(d){ try{ return d.toLocaleDateString(LATN,{day:'numeric',month:'long',year:'numeric'}); }catch(e){ return iso(d); } }
  function wdLabel(d){ try{ return d.toLocaleDateString(LATN,{weekday:'long'}); }catch(e){ return ''; } }
  function whenBible(fn){ var B=bible(); if(!B) return; if(B.data) fn(B); else B.load().then(function(){ fn(B); }).catch(function(){}); }

  /* =====================================================================
     تعميم «صورة الحفظ»: أي نص يتحول لنفس بطاقة الخلوة
     ===================================================================== */
  function shot(d){
    var now=new Date();
    var o={date:dateLabel(now),weekday:wdLabel(now),topic:'',title2:'',ref:'',verse:'',reflect:'',prayer:'',deep:'',kind:'',verseLabel:'',weekTitle:'',source:''};
    for(var k in d) o[k]=d[k];
    if(typeof window.__shotFrom!=='function'){ toast('الصورة غير متاحة هنا'); return; }
    var pp=$('page-pray'), ov=$('shotOverlay');
    if(pp&&!pp.classList.contains('on')){
      document.body.classList.add('v297-shotting');
      if(ov&&!ov._v297){ ov._v297=1; new MutationObserver(function(){ if(!ov.classList.contains('open')) document.body.classList.remove('v297-shotting'); }).observe(ov,{attributes:true,attributeFilter:['class']}); }
    }
    window.__shotFrom(o);
  }
  function fatherShot(x){
    var A=window.__fathers;
    shot({noTopic:true,fillTags:x.g||[],kind:'',topic:'من أقوال الآباء',title2:x.f,verse:x.t,ref:x.f+' — '+(A&&A.cite?A.cite(x):''),verseLabel:'قول من الآباء',
      source:'المصدر: كتاب «أقوال الآباء الشيوخ» — منشورات النور، ١٩٩٠'+(A&&A.cite?' · '+A.cite(x):'')});
  }
  function verseShot(text,ref,topic){
    shot({noTopic:true,kind:'',topic:topic||'كلمة الله',title2:ref,verse:String(text).replace(/[«»"]/g,'').trim(),ref:ref,verseLabel:'آية من الكتاب المقدس',source:'النص: الكتاب المقدس (فان دايك)'});
  }

  /* =====================================================================
     فهرس الخلوة (٣٦٦ يومًا) وفهرس أقوال الآباء بالمراجع
     ===================================================================== */
  var KIDX=null, FIDX=null;
  function eachDay(fn){ var Y=window.__khalwaYear; if(!Y||!Y.ready) return; for(var m=0;m<12;m++){ var n=new Date(2024,m+1,0).getDate(); for(var d=1;d<=n;d++){ var e=Y.entry(new Date(2024,m,d)); if(e&&e.m) fn(m+1,d,e); } } }
  function kIndex(B){
    if(KIDX) return KIDX; KIDX={};
    eachDay(function(m,d,e){
      e.m.forEach(function(M,i){ if(i===2||!M.ref) return; var p=null; try{ p=B.parseRef(String(M.ref).split('—')[0]); }catch(x){} if(p&&p.bi!=null&&p.ch){ var k=p.bi+':'+p.ch; (KIDX[k]=KIDX[k]||[]).push({m:m,d:d,i:i,v:p.v1||0}); } });
    });
    return KIDX;
  }
  function fIndex(B){
    if(FIDX) return FIDX; FIDX={}; var A=window.__fathers; if(!A||!A.items) return FIDX;
    A.items.forEach(function(x){
      var re=/\(([^()]{3,48})\)/g, mm, seen={};
      while((mm=re.exec(x.t))){ var p=null; try{ p=B.parseRef(mm[1]); }catch(e){} if(p&&p.bi!=null&&p.ch){ var k=p.bi+':'+p.ch; if(!seen[k]){ seen[k]=1; (FIDX[k]=FIDX[k]||[]).push(x.i); } } }
    });
    return FIDX;
  }
  function dayCard(m,d,i){
    var Y=window.__khalwaYear, now=new Date(); var yr=now.getFullYear(); if(m===2&&d===29&&new Date(yr,1,29).getDate()!==29) d=28;
    var dt=new Date(yr,m-1,d), e=Y.entry(dt); if(!e) return null;
    var v=Y.toVariants(e,dateLabel(dt),wdLabel(dt),d,dt); return v[i+1];
  }

  /* =====================================================================
     «يومي» + الوقت والموسم
     ===================================================================== */
  function yomiItems(){
    var f=F(); if(!f||!f.todayItems) return [];
    var k=f.realKey?f.realKey():iso(new Date()), items=f.todayItems(k).slice(), K=window.__k;
    items.forEach(function(it){ if(it.type==='hour'){ var g=f.groupById(it.gid); it.key=g&&g.keys[0]; } });
    try{
      var key=K&&K.getSuggestedHourKey(new Date()), g=key&&f.groupOf(key);
      if(g&&!items.some(function(it){return it.gid===g.id})) items.unshift({id:'h:'+g.id,type:'hour',gid:g.id,key:key,label:'صلاة '+g.label,done:f.hourDone(k,g.id),sug:true});
    }catch(e){}
    try{ var due=f.dueVerses?f.dueVerses().length:0; if(due) items.splice(Math.max(0,items.length-1),0,{id:'memo',type:'memo',label:'مراجعة آيات الحفظ ('+due+')',done:false}); }catch(e){}
    return items;
  }
  function yomiNext(items){
    var late=new Date().getHours()>=18, und=items.filter(function(i){return !i.done;});
    if(!und.length) return null;
    if(late){ var ex=und.filter(function(i){return i.type==='exam';})[0]; var hoursLeft=und.some(function(i){return i.type==='hour'&&i.sug;}); if(ex&&!hoursLeft) return ex; }
    return und.filter(function(i){return i.type!=='exam';})[0]||und[0];
  }
  function seasonText(){ try{ var c=window.__copCal; if(c&&c.label){ var o=c.label(new Date()); return (o&&o.text)||''; } }catch(e){} return ''; }
  function paintYomi(){
    var host=$('v297Yomi'); if(!host) return;
    var items=yomiItems(); if(!items.length){ host.hidden=true; return; } host.hidden=false;
    var done=items.filter(function(i){return i.done;}).length, nx=yomiNext(items), se=seasonText();
    var h='<div class="y-head"><b>يومي</b><span class="y-prog">'+done+' / '+items.length+'</span></div>';
    if(se) h+='<div class="y-season">'+esc(se)+'</div>';
    h+=nx?'<button type="button" class="y-next" data-y="'+esc(nx.id)+'"><small>الخطوة التالية</small><b>'+esc(nx.label)+'</b><i>‹</i></button>':'<div class="y-all">أكملتَ كل خطوات اليوم ✓ — الرب يبارك يومك</div>';
host.innerHTML=h; host._items=items;
  }
  function yomiGo(it){
    var r=R(); if(!r||!it) return;
    if(it.type==='hour'){ r.act('hour',{dataset:{key:it.key}}); }
    else if(it.type==='read'){ r.act('read'); }
    else if(it.type==='med'){ r.act('meditation'); }
    else if(it.type==='exam'){ r.act('exam'); }
    else if(it.type==='memo'){ r.act('memo'); }
  }
  function mountYomi(){
    if($('v297Yomi')) return; var home=$('page-home'); if(!home) return;
    var grid=home.querySelector('#hExtra')||home.querySelector('.h-grid'); if(!grid) return;
    var d=document.createElement('section'); d.id='v297Yomi'; d.className='v297-yomi'; d.setAttribute('aria-label','يومي');
    grid.parentNode.insertBefore(d,grid);
    d.addEventListener('click',function(e){ var b=e.target.closest('[data-y]'); if(!b) return; var id=b.getAttribute('data-y'); var it=(d._items||[]).filter(function(x){return x.id===id;})[0]; yomiGo(it); });
    paintYomi();
  }

  /* =====================================================================
     روابط متبادلة: القراءات ← الآباء والخلوة (وصوت الله ← تأمل مرتبط)
     ===================================================================== */
  function readingRefs(date){
    var out=[]; try{
      var o=window.__rfResolve&&window.__rfResolve(date), rs=o&&o.res&&o.res.readings||[];
      rs.forEach(function(r){ [r.gospelRef,r.shortRef].forEach(function(x){ if(x) out.push(String(x)); }); });
    }catch(e){} return out;
  }
  function linksFor(B,refs){
    var ki=kIndex(B), fi=fIndex(B), A=window.__fathers, seenK={}, seenF={}, kd=[], fa=[], chs=[];
    refs.forEach(function(r){ var p=null; try{ p=B.parseRef(r); }catch(e){} if(!p||p.bi==null||!p.ch) return; var k=p.bi+':'+p.ch;
      if(!chs.some(function(c){return c.k===k;})) chs.push({k:k,bi:p.bi,ch:p.ch,v:p.v1||'',label:B.label(p.bi,p.ch)});
      (ki[k]||[]).forEach(function(x){ var id=x.m+'-'+x.d+'-'+x.i; if(!seenK[id]){ seenK[id]=1; kd.push(x); } });
      (fi[k]||[]).forEach(function(i){ if(!seenF[i]&&A.byId[i]){ seenF[i]=1; fa.push(A.byId[i]); } });
    });
    return {chs:chs,kd:kd.slice(0,3),fa:fa.slice(0,3)};
  }
  function paintLinks(){
    var host=$('v297Links'); if(!host) return;
    var d=viewed(); var refs=readingRefs(d);
    if(!refs.length){ host.hidden=true; host.innerHTML=''; return; }
    whenBible(function(B){
      var L=linksFor(B,refs), h='';
      if(!L.chs.length&&!L.kd.length&&!L.fa.length){ host.hidden=true; return; }
      h+='<div class="l-head">مرتبط بقراءات اليوم</div>';
      if(L.fa.length){ h+='<div class="l-sec">قيل عن هذا الفصل</div>'+L.fa.map(function(x){ return '<article class="l-fat"><p>«'+esc(x.t)+'»</p><div class="l-m"><b>'+esc(x.f)+'</b><span>'+esc(window.__fathers.cite(x))+'</span><button type="button" data-v297fshot="'+x.i+'">🖼 صورة</button></div></article>'; }).join(''); }
      if(L.kd.length){ h+='<div class="l-sec">تأمل مرتبط في الخلوة</div><div class="l-row">'+L.kd.map(function(x){ var c=dayCard(x.m,x.d,x.i); return c?'<button type="button" class="l-btn" data-v297day="'+x.m+'-'+x.d+'-'+x.i+'"><b>'+esc(c.title2)+'</b><small>'+esc(c.ref)+'</small></button>':''; }).join('')+'</div>'; }
      if(L.chs.length){ h+='<div class="l-sec">افتح الفصل كاملًا</div><div class="l-row">'+L.chs.slice(0,4).map(function(c){ return '<button type="button" class="l-btn l-ch" data-v297ch="'+c.bi+':'+c.ch+':'+c.v+'">'+esc(c.label)+'</button>'; }).join('')+'</div>'; }
      host.innerHTML=h; host.hidden=false;
    });
  }
  function mountLinks(){
    if($('v297Links')) return; var host=$('readingHost'); if(!host||!host.parentNode) return;
    var d=document.createElement('section'); d.id='v297Links'; d.className='v297-links'; d.hidden=true;
    host.parentNode.insertBefore(d,host.nextSibling);
    if(window.MutationObserver){ var t; new MutationObserver(function(){ clearTimeout(t); t=setTimeout(paintLinks,150); }).observe(host,{childList:true}); }
    var di=$('dateIn'); if(di) di.addEventListener('change',function(){ setTimeout(paintLinks,200); });
    paintLinks();
  }

  /* =====================================================================
     صوت الله: «ده مش اللي قصدته» + تصدير، «تأمل مرتبط»، «صورة»
     ===================================================================== */
  var MISS='rafeeq_talk_miss_v1';
  function missList(){ var a=jget(MISS,[]); return Array.isArray(a)?a:[]; }
  function talkPass(){
    var host=$('talkBody'); if(!host) return;
    var hist=jget('rafeeq_talk_v1',[]);
    Array.prototype.forEach.call(host.querySelectorAll('.tk-re'),function(re){
      var close=re.querySelector('.tk-close'); if(close&&!re.querySelector('.v297-miss')){
        var me=re.previousElementSibling, sentence=me&&me.classList.contains('tk-me')?me.textContent:'';
        if(sentence){ var w=document.createElement('div'); w.className='v297-miss'; w.innerHTML='<button type="button" data-v297miss="'+esc(sentence)+'">✎ ده مش اللي قصدته</button>'; close.appendChild(w); }
      }
    });
    var B=bible();
    Array.prototype.forEach.call(host.querySelectorAll('.tk-v'),function(card){
      if(card.querySelector('.v297-act')) return;
      var a=card.querySelector('.tk-a')||card.querySelector('.tk-m'); if(!a) return;
      var wrap=document.createElement('span'); wrap.className='v297-act';
      var h='<button type="button" data-v297vshot="1">🖼 صورة</button>';
      var o=card.querySelector('[data-tko]');
      if(o&&B&&B.data){ var q=o.getAttribute('data-tko').split(':'); var k=q[0]+':'+q[1], ki=kIndex(B)[k]; if(ki&&ki.length){ var best=ki.filter(function(x){return x.i===1;})[0]||ki[0]; h='<button type="button" data-v297day="'+best.m+'-'+best.d+'-'+best.i+'">تأمل مرتبط</button>'+h; } }
      wrap.innerHTML=h; a.appendChild(wrap);
    });
    if(!host.querySelector('.v297-exp')){
      var n=missList().length; if(n){ var ex=document.createElement('div'); ex.className='v297-exp'; ex.innerHTML='<button type="button" data-v297exp="1">⬇ تصدير الجمل التي لم تُفهم ('+n+')</button>'; host.appendChild(ex); }
    }
  }
  function mountTalk(){
    var host=$('talkBody'); if(!host||host._v297) return; host._v297=1;
    if(window.MutationObserver){ var t; new MutationObserver(function(){ clearTimeout(t); t=setTimeout(talkPass,120); }).observe(host,{childList:true,subtree:true}); }
    talkPass();
  }
  function exportMiss(){
    var items=missList(); if(!items.length){ toast('لا توجد جمل محفوظة'); return; }
    var txt=JSON.stringify({app:'الرفيق الروحي — صوت الله',note:'جمل كتبها المستخدم ولم يفهمها صوت الله؛ تُضاف كمرادفات',exported:new Date().toISOString(),items:items},null,1);
    try{ var bl=new Blob([txt],{type:'application/json'}), u=URL.createObjectURL(bl), a=document.createElement('a'); a.href=u; a.download='sawt-allah-missed-'+iso(new Date())+'.json'; document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(u); a.remove(); },500); toast('تم تصدير '+items.length+' جملة'); }
    catch(e){ try{ navigator.clipboard.writeText(txt); toast('نُسخت الجمل — الصقها في ملف'); }catch(x){ toast('تعذّر التصدير'); } }
  }

  /* =====================================================================
     أقوال الآباء: زر «صورة» على كل قول
     ===================================================================== */
  function fatPass(){
    var host=$('fatList'); if(!host) return;
    Array.prototype.forEach.call(host.querySelectorAll('.fat-card'),function(c){ if(c.querySelector('[data-v297fshot]')) return; var b=document.createElement('button'); b.type='button'; b.className='fat-copy v297-shotb'; b.setAttribute('data-v297fshot',c.getAttribute('data-i')); b.textContent='🖼 صورة'; c.appendChild(document.createTextNode(' ')); c.appendChild(b); });
  }
  function mountFat(){
    var host=$('fatBody'); if(!host||host._v297) return; host._v297=1;
    if(window.MutationObserver){ var t; new MutationObserver(function(){ clearTimeout(t); t=setTimeout(fatPass,80); }).observe(host,{childList:true,subtree:true}); }
    fatPass();
  }

  /* =====================================================================
     بحث موحّد: إضافة الآباء والخلوة والأجبية إلى البحث الشامل
     ===================================================================== */
  function searchRows(q){
    var nq=nrm(q.trim()); if(nq.length<2) return '';
    var out='', A=window.__fathers, rows=[];
    function snip(t){ var n=nrm(t), i=n.indexOf(nq.split(/\s+/)[0]); if(i<0) i=0; var a=Math.max(0,i-30); return esc((a?'…':'')+String(t).slice(a,a+110)+(String(t).length>a+110?'…':'')); }
    function row(attr,t,s){ return '<button type="button" class="so-row" '+attr+'><b>'+t+'</b>'+(s?'<span>'+s+'</span>':'')+'</button>'; }
    if(A&&A.items){ A.items.forEach(function(x){ if(rows.length<8&&nrm(x.t+' '+x.f+' '+(x.g||[]).join(' ')).indexOf(nq)>-1) rows.push(row('data-v297s="f:'+x.i+'"',esc(x.f),snip(x.t))); }); }
    if(rows.length) out+='<div class="so-sec">أقوال الآباء</div>'+rows.join(''); rows=[];
    eachDay(function(m,d,e){ e.m.forEach(function(M,i){ if(rows.length>=8) return; var hay=nrm([M.t,e.th,M.ref,M.v,M.r].join(' ')); if(hay.indexOf(nq)>-1) rows.push(row('data-v297s="k:'+m+'-'+d+'-'+i+'"',esc(M.t||e.th),esc(d+'/'+m+' — '+(['الأجبية','الكتاب المقدس','أقوال الآباء'][i])+' — '+(M.ref||'')))); }); });
    if(rows.length) out+='<div class="so-sec">الخلوة اليومية (تأملات السنة)</div>'+rows.join(''); rows=[];
    var K=window.__k; if(K&&K.HOURS){
      Object.keys(K.HOURS).forEach(function(hk){ var h=K.HOURS[hk], seen=new Set(); (function walk(o,dep){ if(!o||typeof o!=='object'||dep>7||seen.has(o)||rows.length>=8) return; seen.add(o); var arr=Array.isArray(o.text)?o.text:(Array.isArray(o.lines)?o.lines:null); if(arr&&o.title&&typeof arr[0]==='string'){ var txt=arr.join(' ').replace(/<[^>]*>/g,' '); if(nrm(o.title+' '+txt).indexOf(nq)>-1) rows.push(row('data-v297s="a:'+hk+'"',esc(o.title),esc('الأجبية — '+(h.label||''))+' — '+snip(txt))); } Object.keys(o).forEach(function(k){ walk(o[k],dep+1); }); })(h,0); });
    }
    if(rows.length) out+='<div class="so-sec">نصوص الأجبية</div>'+rows.join('');
    return out;
  }
  function mountSearch(){
    var inp=$('uSearchIn'), res=$('uSearchRes'), ov=$('uSearchOv'); if(!inp||!res||inp._v297) return; inp._v297=1;
    var tm=null;
    function append(){ var q=inp.value; if(!q||q.trim().length<2){ return; } if(res.querySelector('#v297Srch')) return; var html=''; try{ html=searchRows(q); }catch(e){ html=''; } var d=document.createElement('div'); d.id='v297Srch'; d.innerHTML=html; res.appendChild(d); }
    inp.addEventListener('input',function(){ clearTimeout(tm); tm=setTimeout(append,520); });
    if(window.MutationObserver){ var t2; new MutationObserver(function(){ if(res.querySelector('#v297Srch')) return; clearTimeout(t2); t2=setTimeout(append,150); }).observe(res,{childList:true}); }
    res.addEventListener('click',function(e){
      var b=e.target.closest('[data-v297s]'); if(!b) return; var a=b.getAttribute('data-v297s').split(':'), t=a[0], v=a[1];
      var x=$('uSearchX'); if(x) x.click();
      if(t==='f'){ var it=window.__fathers.byId[v]; if(it) fatherShot(it); }
      else if(t==='k'){ var q=v.split('-'); var c=dayCard(+q[0],+q[1],+q[2]); if(c) shot(c); }
      else if(t==='a'){ R().act('hour',{dataset:{key:v}}); }
    });
  }

  /* =====================================================================
     أحداث عامة (تفويض)
     ===================================================================== */
  document.addEventListener('click',function(e){
    var t=e.target; if(!t||!t.closest) return;
    var b;
    if((b=t.closest('[data-v297fshot]'))){ e.preventDefault(); var it=window.__fathers&&window.__fathers.byId[b.getAttribute('data-v297fshot')]; if(it) fatherShot(it); return; }
    if((b=t.closest('[data-v297day]'))){ e.preventDefault(); var q=b.getAttribute('data-v297day').split('-'); var c=dayCard(+q[0],+q[1],+q[2]); if(c) shot(c); return; }
    if((b=t.closest('[data-v297ch]'))){ e.preventDefault(); var a=b.getAttribute('data-v297ch').split(':'); F().openBible(+a[0],+a[1],a[2]?+a[2]:null); return; }
    if((b=t.closest('[data-v297vshot]'))){ e.preventDefault(); var card=b.closest('.tk-v'); if(!card) return; var f=card.classList.contains('tk-f');
      var txt=(card.querySelector('.tk-t')||{}).textContent||'', lab=(card.querySelector('.tk-m b')||{}).textContent||'';
      if(f){ var fs=(card.querySelector('.tk-fs')||{}).textContent||''; var vt=txt.replace(/^\s*«|»\s*$/g,''), fx=(window.__fathers.items||[]).filter(function(z){return z.t===vt;})[0]; shot({noTopic:true,fillTags:fx?fx.g:[],kind:'',topic:'صوت الله — من أقوال الآباء',title2:lab,verse:vt,ref:lab+' — '+fs,verseLabel:'قول من الآباء',source:'المصدر: كتاب «أقوال الآباء الشيوخ» — منشورات النور، ١٩٩٠ · '+fs}); }
      else verseShot(txt,lab,'صوت الله');
      return; }
    if((b=t.closest('[data-v297miss]'))){ e.preventDefault(); var s=b.getAttribute('data-v297miss'), L=missList(); if(!L.some(function(x){return x.t===s;})){ var h=jget('rafeeq_talk_v1',[]), en=h.filter(function(x){return x.t===s;})[0]||{}; L.push({t:s,themes:en.themes||[],refs:(en.refs||[]).map(function(r){return r[0];}),ts:Date.now()}); jset(MISS,L.slice(-200)); }
      b.textContent='✓ اتسجّلت — هتتحسّن بيها المطابقة'; b.disabled=true; talkPass(); return; }
    if((b=t.closest('[data-v297exp]'))){ e.preventDefault(); exportMiss(); return; }
  });

  /* ---------- تشغيل ---------- */
  function boot(){
    initWake(); mountRead(); mountYomi(); mountSearch();
    var f=F();
    if(f&&!f.__v297){ f.__v297=1; var old=f.afterShow;
      f.afterShow=function(n,p){
        try{ if(old) old.apply(this,arguments); }catch(e){}
        try{
          if(n==='read'){ mountRead(); paintRead(); mountLinks(); }
          if(n==='home'){ mountYomi(); paintYomi(); }
          if(n==='talk'){ mountTalk(); }
          if(n==='fat'){ mountFat(); }
          if(n==='pray'||p==='pray') sync();
        }catch(e){}
      };
    }
    setInterval(function(){ if(!document.hidden&&$('page-home')&&$('page-home').classList.contains('on')) paintYomi(); },15000);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){ setTimeout(boot,0); }); else setTimeout(boot,0);
})();
