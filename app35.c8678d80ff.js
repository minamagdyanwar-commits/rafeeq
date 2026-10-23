/* السنكسار: يعرض سنكسار اليوم القبطي من synData (نص مُستخرج بالـOCR من كتاب السنكسار). */
(function(){
  var AR='٠١٢٣٤٥٦٧٨٩';
  function ard(n){return String(n).replace(/\d/g,function(d){return AR[d]})}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
  var CM=['توت','بابه','هاتور','كيهك','طوبة','أمشير','برمهات','برمودة','بشنس','بؤونة','أبيب','مسرى','النسيء'];
  var GM=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  var D=null,st={m:0,d:1,mov:0,q:''},idx=null;
  function load(){
    if(D)return D;
    var el=document.getElementById('synData');
    try{D=JSON.parse(el.textContent)}catch(e){D=null}
    return D;
  }
  function coptic(dt){
    var y=dt.getFullYear(),m=dt.getMonth()+1,dd=dt.getDate();
    var leap=(y%4===0&&y%100!==0)||y%400===0,corr=m<=2?0:(leap?-1:-2);
    var rd=365*(y-1)+Math.floor((y-1)/4)-Math.floor((y-1)/100)+Math.floor((y-1)/400)+Math.floor((367*m-362)/12)+corr+dd;
    var E=103605;
    function fc(yy,mm,d2){return E-1+365*(yy-1)+Math.floor(yy/4)+30*(mm-1)+d2}
    var yr=Math.floor((4*(rd-E)+1463)/1461),mo=Math.floor((rd-fc(yr,1,1))/30)+1;
    return {y:yr,m:mo,d:rd-fc(yr,mo,1)+1};
  }
  function today(){var c=coptic(new Date());st.m=c.m-1;st.d=c.d;st.mov=0;st.q='';}
  function maxDay(m){return D.m[m].d.length}
  function step(n){
    st.mov=0;st.d+=n;
    if(st.d>maxDay(st.m)){st.m=(st.m+1)%13;st.d=1}
    else if(st.d<1){st.m=(st.m+12)%13;st.d=maxDay(st.m)}
  }
  function norm(s){return String(s).replace(/[ً-ْـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه')}
  function build(){
    idx=[];
    D.m.forEach(function(mo,mi){mo.d.forEach(function(x,di){idx.push({m:mi,d:di+1,t:norm((x.h||[]).join(' ')+' '+(x.p||[]).join(' '))})})});
  }
  function search(q){
    if(!idx)build();
    var n=norm(q).trim();if(n.length<2)return [];
    var out=[];
    for(var i=0;i<idx.length&&out.length<40;i++){
      var p=idx[i].t.indexOf(n);
      if(p>=0)out.push({m:idx[i].m,d:idx[i].d,s:idx[i].t.substr(Math.max(0,p-40),n.length+100),q:n});
    }
    return out;
  }
  function render(){
    var box=document.getElementById('synBody');if(!box)return;
    if(!load()){box.innerHTML='<p class="syn-note">تعذّر تحميل بيانات السنكسار.</p>';return}
    var h='',pick='<div class="syn-pick"><select data-sy="m" aria-label="الشهر القبطي">';
    CM.forEach(function(n,i){pick+='<option value="'+i+'"'+(i===st.m&&!st.mov?' selected':'')+'>'+n+'</option>'});
    pick+='</select><select data-sy="d" aria-label="اليوم">';
    for(var i=1;i<=maxDay(st.m);i++)pick+='<option value="'+i+'"'+(i===st.d?' selected':'')+'>'+ard(i)+'</option>';
    pick+='</select><button type="button" data-sy="today">اليوم</button><button type="button" data-sy="mov"'+(st.mov?' class="on"':'')+'>الأعياد المتنقلة</button></div>';
    h+='<input class="syn-q" type="search" data-sy="q" placeholder="ابحث في السنكسار (اسم قديس، مناسبة…)" value="'+esc(st.q)+'">';
    if(st.q.trim().length>=2){
      var r=search(st.q);
      h+=r.length?'':'<p class="syn-note">لا نتائج.</p>';
      r.forEach(function(x){h+='<button type="button" class="syn-res" data-m="'+x.m+'" data-d="'+x.d+'"><b>'+ard(x.d)+' '+CM[x.m]+'</b>'+esc(x.s)+'…</button>'});
      box.innerHTML=h;wire(box);return;
    }
    h+=pick;
    if(st.mov){
      h+='<div class="syn-nav"><span></span><div class="syn-ttl"><b>الأعياد المتنقلة</b></div><span></span></div><div class="syn-card">'+(D.mov||[]).map(function(p){return '<p>'+esc(p)+'</p>'}).join('')+'</div>';
    }else{
      var x=D.m[st.m].d[st.d-1]||{h:[],p:[]};
      var c=coptic(new Date()),isT=c.m-1===st.m&&c.d===st.d;
      h+='<div class="syn-nav"><button type="button" data-sy="next" aria-label="اليوم التالي">›</button><div class="syn-ttl"><b>'+ard(st.d)+' '+CM[st.m]+'</b><small>'+(isT?'اليوم · ':'')+'السنكسار</small></div><button type="button" data-sy="prev" aria-label="اليوم السابق">‹</button></div>';
      if(x.h&&x.h.length)h+='<div class="syn-card"><h3>تذكارات اليوم</h3><ul>'+x.h.map(function(t){return '<li>'+esc(t)+'</li>'}).join('')+'</ul></div>';
      h+='<div class="syn-card">'+(x.p&&x.p.length?x.p.map(function(p){return '<p>'+esc(p)+'</p>'}).join(''):'<p>لا يوجد نص لهذا اليوم.</p>')+'</div>';
    }
    h+='<p class="syn-note">'+esc((D.src&&D.src.title||'')+' — '+(D.src&&D.src.pub||''))+'<br>'+esc(D.src&&D.src.note||'')+'</p>';
    box.innerHTML=h;wire(box);
  }
  function wire(box){
    box.onclick=function(e){
      var t=e.target.closest?e.target.closest('[data-sy],.syn-res'):null;if(!t)return;
      if(t.className==='syn-res'||(t.classList&&t.classList.contains('syn-res'))){st.m=+t.getAttribute('data-m');st.d=+t.getAttribute('data-d');st.mov=0;st.q='';render();window.scrollTo(0,0);return}
      var a=t.getAttribute('data-sy');
      if(a==='next')step(1);else if(a==='prev')step(-1);else if(a==='today')today();else if(a==='mov')st.mov=st.mov?0:1;else return;
      render();window.scrollTo(0,0);
    };
    box.onchange=function(e){
      var t=e.target,a=t.getAttribute&&t.getAttribute('data-sy');
      if(a==='m'){st.m=+t.value;st.d=Math.min(st.d,maxDay(st.m));st.mov=0}
      else if(a==='d'){st.d=+t.value;st.mov=0}else return;
      render();
    };
    var q=box.querySelector('.syn-q');
    if(q)q.oninput=function(){
      st.q=q.value;clearTimeout(q._t);
      q._t=setTimeout(function(){var p=q.selectionStart;render();var n=box.querySelector('.syn-q');if(n){n.focus();try{n.setSelectionRange(p,p)}catch(_){}}},250);
    };
  }
  window.__synInit=function(){if(!load()){render();return}if(!st._init){today();st._init=1}render()};

  var KW=/^(?:[\d\u0660-\u0669]+\s*[-\u2013]\s*)?(استشهاد|استشهان|نياحة|نياحه|تذكار|نقل|ظهور|عيد|تكريس|تدشين|رئاسة|شفاء|معجزة|بشارة|ميلاد|اجتماع|مجمع|إصعاد|اصعاد|قيامة|وفاة|رقاد|تجلي|ثاني|ثالث|رابع|دخول|ختان|عماد|دفن|اكتشاف|استعلان|إعلان|اعلان|ذكرى|تقديم|صوم)/;
  function cleanHead(t){
    t=String(t).replace(/[\u00a0\u200f\u200e]/g,' ').replace(/\s+/g,' ').trim();
    t=t.replace(/[\s\d\u0660-\u0669٠]+$/,'').replace(/[\s\u064d\u064c!|\u0345]+$/,'').trim();
    if(t.length<8||t.length>110||!KW.test(t)||/في مثل هذا/.test(t))return '';
    t=t.replace(/استشهان/g,'استشهاد');
    var ar=(t.match(/[\u0600-\u06ff]/g)||[]).length;
    return ar/t.length>0.8?t:'';
  }
  function sameT(a,b){
    var x=norm(a).split(/\s+/).filter(function(w){return w.length>2}),y=norm(b);
    if(!x.length)return false;var h=x.filter(function(w){return y.indexOf(w)>=0}).length;return h/x.length>=0.6;
  }
  window.__synC=function(el,m,d){
    if(!el||!load())return;
    var x=(D.m[m-1]&&D.m[m-1].d[d-1])||{},box=el.closest?el.closest('.commem'):el.parentNode;
    if(!box)return;
    var bb=el.querySelector('b'),base=bb?bb.textContent.trim():'';
    var list=[];if(base&&base!=='-- --')list.push(base);
    (x.h||[]).forEach(function(t){t=cleanHead(t);if(t&&!list.some(function(u){return sameT(t,u)||sameT(u,t)}))list.push(t)});
    if(!list.length)return;
    var more=list.length>6?list.length-6:0;list=list.slice(0,6).map(function(t){return t.length>90?t.slice(0,88).replace(/\s+\S*$/,'')+'…':t});if(more)list.push('+ '+ard(more)+' تذكارات أخرى');
    el.innerHTML=list.map(function(t){return '<span class="syn-cm">'+esc(t)+'</span>'}).join('')+'<small class="syn-cm-go">افتح السنكسار ‹</small>';
    box.classList.add('syn-link');box.setAttribute('role','button');box.setAttribute('tabindex','0');
    box.setAttribute('aria-label','تذكارات اليوم — افتح السنكسار');
    box.onclick=function(){st.m=m-1;st.d=d;st.mov=0;st.q='';st._init=1;if(window.__rafeeq)window.__rafeeq.show('syn',{top:1})};
    box.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();box.onclick()}};
  };
  if(window.__rdDay)window.__synC(document.getElementById('commemText'),window.__rdDay[0],window.__rdDay[1]);
})();
