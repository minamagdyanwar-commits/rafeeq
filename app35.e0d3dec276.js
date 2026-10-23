/* v7.0 — السنكسار: بطاقة «سنكسار اليوم» في الرئيسية + شاشة تصفّح الأيام والبحث.
   البيانات في syn-mNN.js (شهر قبطي لكل ملف) وتُحمَّل عند الحاجة؛ النص مستخرج آليًا ويحتاج مراجعة. */
(function(){
  var CM=['توت','بابه','هاتور','كيهك','طوبة','أمشير','برمهات','برمودة','بشنس','بؤونة','أبيب','مسرى'];
  var AR='٠١٢٣٤٥٦٧٨٩'; function ard(n){ return String(n).replace(/\d/g,function(d){return AR[d]}); }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function coptic(dt){
    var y=dt.getFullYear(),m=dt.getMonth()+1,dd=dt.getDate();
    var leap=(y%4===0&&y%100!==0)||y%400===0, corr=m<=2?0:(leap?-1:-2);
    var rd=365*(y-1)+Math.floor((y-1)/4)-Math.floor((y-1)/100)+Math.floor((y-1)/400)+Math.floor((367*m-362)/12)+corr+dd;
    var E=103605; function fc(yy,mm,d2){return E-1+365*(yy-1)+Math.floor(yy/4)+30*(mm-1)+d2}
    var yr=Math.floor((4*(rd-E)+1463)/1461), mo=Math.floor((rd-fc(yr,1,1))/30)+1;
    return {y:yr,m:mo,d:rd-fc(yr,mo,1)+1};
  }
  var cache={}, pend={};
  function loadMonth(m,cb){           /* m: 1..12 */
    if(cache[m]){ cb(cache[m]); return; }
    if(m>12){ cb(null); return; }
    if(pend[m]){ pend[m].push(cb); return; }
    pend[m]=[cb];
    var s=document.createElement('script'), ver=(window.__RF_VER||'');
    function done(v){ cache[m]=v; var a=pend[m]; delete pend[m]; a.forEach(function(f){ f(v); }); }
    window.__SYN=window.__SYN||{};
    s.src='syn-m'+(m<10?'0':'')+m+'.js?v='+encodeURIComponent(ver);
    s.onload=function(){ done((window.__SYN&&window.__SYN[m])||[]); };
    s.onerror=function(){ done([]); };
    document.head.appendChild(s);
  }
  function dayOf(list,d){ for(var i=0;i<list.length;i++) if(list[i].d===d) return list[i]; return null; }
  function today(){ var c=coptic(new Date()); return c.m>12?{m:12,d:30}:{m:c.m,d:c.d}; }

  /* ---------- بطاقة الرئيسية ---------- */
  function paintCard(){
    var home=document.getElementById('page-home'); if(!home) return;
    var wrap=home.querySelector('.u-wrap'); if(!wrap) return;
    var card=document.getElementById('hmSyn');
    if(!card){
      card=document.createElement('section'); card.id='hmSyn'; card.className='hm-card hm-syn'; card.setAttribute('aria-label','سنكسار اليوم');
      var prog=wrap.querySelector('.hm-prog'); if(prog&&prog.parentNode) prog.parentNode.insertBefore(card,prog.nextSibling); else wrap.appendChild(card);
      card.addEventListener('click',function(e){ if(e.target.closest('[data-syn]')) openSyn(); });
    }
    var t=today();
    loadMonth(t.m,function(list){
      var x=dayOf(list||[],t.d), h='<div class="hm-h"><b>سنكسار اليوم</b><span>'+ard(t.d)+' '+CM[t.m-1]+'</span></div>';
      if(x&&x.t&&x.t.length) h+='<ul class="syn-ti">'+x.t.slice(0,4).map(function(s){ return '<li>'+esc(s)+'</li>'; }).join('')+'</ul>';
      else if(x) h+='<p class="syn-none">اقرأ سيرة قديسي اليوم.</p>';
      else h+='<p class="syn-none">سنكسار هذا اليوم لم يُضَف بعد.</p>';
      h+='<button type="button" class="syn-open" data-syn="open">📖 السنكسار</button>';
      if(card.__h!==h){ card.__h=h; card.innerHTML=h; }
    });
  }

  /* ---------- الشاشة ---------- */
  var S={m:1,d:1,root:null};
  function render(){
    var r=S.root; if(!r) return;
    var sel=r.querySelector('#synMon'); if(sel&&+sel.value!==S.m) sel.value=S.m;
    r.querySelector('#synDate').textContent=ard(S.d)+' '+CM[S.m-1];
    var days=r.querySelector('#synDays'); if(!days.__m||days.__m!==S.m){ days.__m=S.m; var h=''; for(var i=1;i<=30;i++) h+='<button type="button" data-d="'+i+'">'+ard(i)+'</button>'; days.innerHTML=h; }
    [].forEach.call(days.children,function(b){ b.classList.toggle('on',+b.dataset.d===S.d); });
    var on=days.querySelector('.on'); if(on&&on.scrollIntoView) on.scrollIntoView({inline:'center',block:'nearest'});
    var body=r.querySelector('#synBody'); body.innerHTML='<p class="syn-none">جارٍ التحميل…</p>';
    var m=S.m,d=S.d;
    loadMonth(m,function(list){
      if(S.m!==m||S.d!==d) return;
      var x=dayOf(list||[],d), h='';
      if(!x){ body.innerHTML='<p class="syn-none">سنكسار هذا اليوم غير متاح في النسخة الحالية.</p>'; return; }
      if(x.t&&x.t.length) h+='<h3>تذكارات اليوم</h3><ol class="syn-tl">'+x.t.map(function(s){ return '<li>'+esc(s)+'</li>'; }).join('')+'</ol>';
      h+=x.b.split('\n').map(function(p){ return '<p>'+esc(p)+'</p>'; }).join('');
      h+='<div class="syn-src">المصدر: كتاب السنكسار، إعداد اللجنة المجمعية للطقوس — مكتبة دير السيدة العذراء السريان ٢٠١٢. النص مستخرج آليًا من نسخة ممسوحة ضوئيًا وقد يحتوي أخطاء؛ يُراجَع على الكتاب المطبوع.</div>';
      body.innerHTML=h; body.scrollTop=0;
    });
  }
  function go(m,d){ S.m=m; S.d=d; render(); }
  function step(n){ var m=S.m,d=S.d+n; if(d<1){ m=m>1?m-1:12; d=30; } else if(d>30){ m=m<12?m+1:1; d=1; } go(m,d); }
  function openSyn(m,d){
    if(S.root) closeSyn();
    var t=today(); S.m=m||t.m; S.d=d||t.d;
    var r=document.createElement('div'); r.id='synRoot'; r.className='syn'; r.setAttribute('dir','rtl'); r.setAttribute('role','dialog'); r.setAttribute('aria-label','السنكسار');
    r.innerHTML='<div class="syn-top"><button type="button" class="syn-x" id="synX" aria-label="إغلاق">✕</button><h2>السنكسار <small class="syn-beta">نسخة تجريبية</small></h2><button type="button" class="syn-sb" id="synSB" aria-label="بحث">🔍</button></div>'
      +'<div class="syn-search" id="synSearch" hidden><input type="search" id="synQ" placeholder="ابحث باسم القديس أو بكلمة…" autocomplete="off"><div id="synRes"></div></div>'
      +'<div class="syn-nav"><button type="button" id="synPrev" aria-label="اليوم التالي">›</button><div class="syn-date" id="synDate"></div><button type="button" id="synNext" aria-label="اليوم السابق">‹</button><select id="synMon" aria-label="الشهر">'
      +CM.map(function(n,i){ return '<option value="'+(i+1)+'">'+n+'</option>'; }).join('')+'</select><button type="button" id="synToday" class="syn-td">اليوم</button></div>'
      +'<div class="syn-days" id="synDays"></div><div class="syn-body" id="synBody"></div>';
    document.body.appendChild(r); document.body.classList.add('syn-open'); S.root=r;
    r.querySelector('#synX').onclick=closeSyn;
    r.querySelector('#synPrev').onclick=function(){ step(1); };     /* RTL: السهم الأيمن = التالي */
    r.querySelector('#synNext').onclick=function(){ step(-1); };
    r.querySelector('#synMon').onchange=function(e){ go(+e.target.value,1); };
    r.querySelector('#synToday').onclick=function(){ var t=today(); go(t.m,t.d); };
    r.querySelector('#synDays').onclick=function(e){ var b=e.target.closest('button[data-d]'); if(b) go(S.m,+b.dataset.d); };
    r.querySelector('#synSB').onclick=function(){ var s=r.querySelector('#synSearch'); s.hidden=!s.hidden; if(!s.hidden) r.querySelector('#synQ').focus(); };
    r.querySelector('#synQ').oninput=search;
    r.querySelector('#synRes').onclick=function(e){ var b=e.target.closest('button[data-m]'); if(b){ r.querySelector('#synSearch').hidden=true; go(+b.dataset.m,+b.dataset.d); } };
    render();
  }
  function closeSyn(){ if(S.root){ S.root.remove(); S.root=null; } document.body.classList.remove('syn-open'); }
  function norm(s){ return String(s).replace(/[ً-ٰٟ]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه'); }
  var qt=0;
  function search(){
    clearTimeout(qt); qt=setTimeout(function(){
      var q=norm(S.root.querySelector('#synQ').value.trim()), out=S.root.querySelector('#synRes');
      if(q.length<2){ out.innerHTML=''; return; }
      out.innerHTML='<p class="syn-none">جارٍ البحث…</p>';
      var left=12, hits=[];
      for(var m=1;m<=12;m++) (function(m){ loadMonth(m,function(list){
        (list||[]).forEach(function(x){
          var ti=(x.t||[]).filter(function(t){ return norm(t).indexOf(q)>=0; });
          if(ti.length) hits.push({m:m,d:x.d,s:ti[0],w:0});
          else { var i=norm(x.b).indexOf(q); if(i>=0) hits.push({m:m,d:x.d,s:'…'+x.b.substr(Math.max(0,i-30),90)+'…',w:1}); }
        });
        if(--left===0){
          hits.sort(function(a,b){ return a.w-b.w||a.m-b.m||a.d-b.d; });
          out.innerHTML=hits.length?hits.slice(0,40).map(function(h){ return '<button type="button" data-m="'+h.m+'" data-d="'+h.d+'"><b>'+ard(h.d)+' '+CM[h.m-1]+'</b><span>'+esc(h.s)+'</span></button>'; }).join(''):'<p class="syn-none">لا نتائج.</p>';
        }
      }); })(m);
    },250);
  }
  window.__synOpen=openSyn;

  /* ---------- «المزيد»: إضافة زر السنكسار ---------- */
  function hookMore(){
    var more=document.querySelector('#uSheet .v14-more'); if(!more||more.querySelector('[data-syn]')) return;
    var hs=more.querySelectorAll('h4'), anchor=null;
    [].forEach.call(hs,function(h){ if(/الآباء/.test(h.textContent)) anchor=h; });
    var b=document.createElement('button'); b.type='button'; b.setAttribute('data-syn','open'); b.innerHTML='السنكسار<small>سيرة قديسي اليوم وتصفّح الأيام</small>';
    b.addEventListener('click',function(e){ e.stopPropagation(); openSyn(); });
    var after=anchor&&anchor.nextElementSibling; if(after&&after.tagName==='BUTTON') after.insertAdjacentElement('afterend',b); else more.appendChild(b);
  }

  /* ---------- «القراءات»: خانة التذكار تعرض كل قديسي اليوم وتفتح السنكسار ---------- */
  function nm(x){ return String(x).replace(/[ًٌٍَُِّْ]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ى/g,'ي'); }
  function readCoptic(){
    var t=document.getElementById('copticOut'); if(!t) return null;
    var s=(t.textContent||'').replace(/[٠-٩]/g,function(d){ return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); });
    var m=s.match(/(\d+)\s+([^\s\d]+)/); if(!m) return null;
    var name=nm(m[2]), idx=-1;
    CM.forEach(function(c,i){ if(nm(c)===name) idx=i; });
    return idx<0?null:{m:idx+1,d:+m[1]};
  }
  var guard=false, last=null;
  function paintCommem(){
    var box=document.getElementById('commemText'), c=readCoptic(); if(!box||!c) return;
    last=c;
    loadMonth(c.m,function(list){
      var x=dayOf(list||[],c.d); if(!x||!x.t||!x.t.length) return;
      var cur=readCoptic(); if(!cur||cur.m!==c.m||cur.d!==c.d) return;
      var h='<b>تذكار اليوم — '+ard(c.d)+' '+CM[c.m-1]+'</b><ul class="commem-list">'+x.t.map(function(t){ return '<li>'+esc(t)+'</li>'; }).join('')+'</ul><small class="commem-go">اضغط لقراءة السنكسار ←</small>';
      if(box.__syn===h&&box.innerHTML===h) return;
      guard=true; box.__syn=h; box.innerHTML=h; guard=false;
      var cm=box.closest('.commem'); if(cm) cm.classList.add('commem-syn');
    });
  }
  function hookCommem(){
    var box=document.getElementById('commemText'); if(!box||box.__hk) return; box.__hk=1;
    var cm=box.closest('.commem'); if(cm){ cm.setAttribute('role','button'); cm.tabIndex=0;
      var go=function(){ var c=readCoptic(); if(c) openSyn(c.m,c.d); };
      cm.addEventListener('click',go); cm.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(); } }); }
    var t=0, q=function(){ if(guard) return; clearTimeout(t); t=setTimeout(paintCommem,60); };
    if(window.MutationObserver){
      new MutationObserver(q).observe(box,{childList:true,subtree:true,characterData:true});
      var co=document.getElementById('copticOut'); if(co) new MutationObserver(q).observe(co,{childList:true,subtree:true,characterData:true});
    }
    paintCommem();
  }
  function start(){
    hookCommem();
    paintCard();
    var home=document.getElementById('page-home');
    if(home&&window.MutationObserver){ var t=0; new MutationObserver(function(){ clearTimeout(t); t=setTimeout(paintCard,150); }).observe(home,{childList:true,subtree:true}); }
    if(window.MutationObserver) new MutationObserver(function(){ hookMore(); hookCommem(); }).observe(document.body,{childList:true,subtree:true});
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeSyn(); });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
