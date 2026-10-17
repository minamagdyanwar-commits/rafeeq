
(function(){
  var PAGES={home:'الرئيسية',pray:'الصلاة',read:'القراءات',msg:'رسالة من يسوع',exam:'محاسبة النفس',trk:'رحلتي',fat:'أقوال الآباء',cal:'التقويم القبطي',talk:'صوت الله',favs:'المفضلات'};
  var TITLES={home:'الرفيق الروحي',pray:'الصلاة',read:'القراءات اليومية',msg:'رسالة من يسوع',exam:'محاسبة النفس',trk:'رحلتي',fat:'أقوال الآباء',cal:'التقويم القبطي',talk:'صوت الله',favs:'المفضلات'};
  var rInit=false, scrollPos={}, cur='home';
  function $(id){return document.getElementById(id)}
  function ls(k,v){try{return v===undefined?localStorage.getItem(k):localStorage.setItem(k,v)}catch(e){return null}}

  window.__navSync=function(){
    var bib=cur==='trk'&&window.__F&&__F.trkTab&&__F.trkTab()==='bible';
    var bb=document.getElementById('uNavBible'), tb=document.querySelector('#uNav [data-go="trk"]');
    if(bb){bb.classList.toggle('on',bib)}
    if(tb&&cur==='trk'){tb.classList.toggle('on',!bib);tb.setAttribute('aria-current',bib?'false':'page')}
  };
  function show(name,opts){
    opts=opts||{};
    if(!PAGES[name]) name='home';
    scrollPos[cur]=window.pageYOffset;
    var prev=cur;
    cur=name;
    ['home','pray','read','msg','exam','trk','fat','cal','talk','favs'].forEach(function(p){
      $('page-'+p).classList.toggle('on',p===name);
      var b=document.querySelector('#uNav [data-go="'+p+'"]'); if(b){b.classList.toggle('on',p===name); b.setAttribute('aria-current',p===name?'page':'false');}
    });
    $('uTitle').textContent=TITLES[name];
    $('uSub').textContent=name==='home'?'':'الرفيق الروحي';
    if((name==='read'||name==='msg')&&!rInit&&window.__initReadings){rInit=true;window.__initReadings();}
    if(name==='msg'&&window.__msgOpen) window.__msgOpen();
    if(name==='fat'&&window.__fatInit) window.__fatInit();
    if(name==='cal'&&window.__calInit) window.__calInit();
    if(name==='talk'&&window.__talkInit) window.__talkInit();     if(name==='favs'&&window.__favsInit) window.__favsInit();
    if(name==='home') refreshHome();
    if(name==='trk'&&window.__F) window.__F.setTrkTab();
    if(window.__F){ if(window.__F.afterShow) window.__F.afterShow(name,prev); if(window.__F.updatePrayBar) window.__F.updatePrayBar(); }
    document.body.classList.toggle('has-bar',name==='pray'&&!$('prayBar').hidden);
    window.scrollTo(0,opts.top?0:(scrollPos[name]||0));
    if(window.__bars) window.__bars.reset();
    window.__navSync&&window.__navSync();
    ls('rafeeq_last',name);
    if(location.hash!=='#'+name){ if(opts.replace) history.replaceState(null,'','#'+name); else history.pushState(null,'','#'+name); }
  }

  /* ----- الرئيسية ----- */
  var AR_DIG='٠١٢٣٤٥٦٧٨٩';
  function ard(n){return String(n).replace(/\d/g,function(d){return AR_DIG[d]})}
  var COPTIC=["توت","بابه","هاتور","كيهك","طوبة","أمشير","برمهات","برمودة","بشنس","بؤونة","أبيب","مسرى","النسيء"];
  function copticOf(d){
    var y=d.getFullYear(),m=d.getMonth()+1,dd=d.getDate();
    var leap=(y%4===0&&y%100!==0)||y%400===0, corr=m<=2?0:(leap?-1:-2);
    var rd=365*(y-1)+Math.floor((y-1)/4)-Math.floor((y-1)/100)+Math.floor((y-1)/400)+Math.floor((367*m-362)/12)+corr+dd;
    var E=103605;
    function fc(yy,mm,d2){return E-1+365*(yy-1)+Math.floor(yy/4)+30*(mm-1)+d2}
    var yr=Math.floor((4*(rd-E)+1463)/1461);
    var mo=Math.floor((rd-fc(yr,1,1))/30)+1;
    return {y:yr,m:mo,d:rd-fc(yr,mo,1)+1};
  }
  function refreshHome(){
    var now=new Date();
    var g=now.toLocaleDateString('ar-EG',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    var c=copticOf(now);
    $('hDate').innerHTML=g+' · <b>'+ard(c.d)+' '+COPTIC[c.m-1]+' '+ard(c.y)+' ش.</b>';
    var K=window.__k;
    if(K){
      try{
        var key=K.getSuggestedHourKey(now), h=K.HOURS[key];
        $('hHour').textContent='صلاة '+h.label;
        $('hHourSub').textContent=K.HOUR_TIME[key]||'';
        $('hHour').parentNode.dataset.key=key;
      }catch(e){}
    }
    var mh=$('khalwaHeader'); 
    if(mh&&mh.textContent.indexOf('موضوع اليوم')>-1){ $('hMed').textContent=mh.textContent.split('موضوع اليوم:')[1].trim(); }
    try{
      var st=JSON.parse(ls('mohasba_v1')||'{"days":{}}'), dk=(window.__F?window.__F.dkey():new Date().toISOString().slice(0,10)), d=st.days[dk]||{}, n=0;
      Object.keys(d).forEach(function(k){ if(k.charAt(0)!=='_'&&d[k]) n++; });
      var other=(d._other||'').trim();
      $('hExam').textContent= (window.__F&&window.__F.locked&&window.__F.locked())?'محمية برمز القفل':(n||other)? ('سجّلتَ اليوم '+ard(n)+(n===1?' بندًا':' بنود')+(other?' + ملاحظة':'')) : 'لم تبدأ محاسبة اليوم بعد';
    }catch(e){}
    $('hRead').textContent=ard(c.d)+' '+COPTIC[c.m-1]+' — قراءات اليوم والتأمل';
    if(window.__F&&window.__F.refreshHome) window.__F.refreshHome();
  }

  /* ----- إجراءات ----- */
  var ACT={
    fat:function(el){ show("fat"); try{ var id=el&&el.dataset&&el.dataset.fid; if(id&&window.__fatFocus) window.__fatFocus(id); }catch(e){} window.scrollTo(0,0); },
    cal:function(){ show("cal"); window.scrollTo(0,0); },
    talk:function(){ show("talk"); window.scrollTo(0,0); },     favs:function(){ show("favs"); window.scrollTo(0,0); },
    hour:function(el){ show('pray',{top:1}); window.switchApp&&window.switchApp('agpeya'); var k=el&&el.dataset.key; if(k&&window.__k) window.__k.selectHour(k); window.scrollTo(0,0); },
    agpeya:function(){ show('pray',{top:1}); window.switchApp('agpeya'); },
    meditation:function(){ show('pray',{top:1}); window.switchApp('meditation'); },
    read:function(){ show('read',{top:1}); var t=$('todayBtn'); if(t) t.click(); },
    exam:function(){ show('exam',{top:1}); var t=$('tabToday'); if(t) t.click(); },
    hist:function(){ show('exam',{top:1}); var t=$('tabHist'); if(t) t.click(); },
    conf:function(){ show('exam',{top:1}); var t=$('tabConf'); if(t) t.click(); },
    plan:function(){ show('trk',{top:1}); window.__F.setTrkTab('plan'); },
    memo:function(){ show('trk',{top:1}); window.__F.setTrkTab('memo'); },
    trk:function(){ show('trk',{top:1}); window.__F.setTrkTab('track'); },
    bible:function(){ show('trk',{top:1}); window.__F.setTrkTab('bible'); }
  };
  document.addEventListener('click',function(e){
    var n=e.target.closest('#uNav [data-go]'); if(n){ if(n.dataset.go==='trk') ACT.trk(); else show(n.dataset.go); return; }
    var a=e.target.closest('[data-act]'); if(a&&ACT[a.dataset.act]){ ACT[a.dataset.act](a); }
  });


  /* ----- شريطا الأعلى والأسفل: تصغير تلقائي أثناء القراءة + مقبضان للضغط ----- */
  (function(){
    var b=document.body, mt=false, mn=false, ly=window.pageYOffset, acc=0;
    function mk(id,fn){var e=document.createElement('button');e.id=id;e.className='u-hd';e.type='button';e.addEventListener('click',fn);b.appendChild(e);return e}
    var HT=mk('uHT',function(){set(!mt,mn)}), HB=mk('uHB',function(){set(mt,!mn)});
    function set(t,n){
      mt=t;mn=n;b.classList.toggle('min-top',t);b.classList.toggle('min-nav',n);
      HT.textContent=t?'▾':'▴';HT.setAttribute('aria-label',t?'إظهار الشريط العلوي':'تصغير الشريط العلوي');
      HB.textContent=n?'▴':'▾';HB.setAttribute('aria-label',n?'إظهار شريط التنقل':'تصغير شريط التنقل');
    }
    set(false,false);
    window.__bars={reset:function(){acc=0;ly=window.pageYOffset;set(false,false)},set:set};
    window.addEventListener('scroll',function(){
      var y=window.pageYOffset, d=y-ly; ly=y;
      if(cur==='home'||document.body.classList.contains('u-focus')){ if(mt||mn) set(false,false); return; }
      if(y<30){ acc=0; if(mt||mn) set(false,false); return; }
      if((d>0)!==(acc>0)) acc=0; acc+=d;
      if(acc>40&&y>80&&!(mt&&mn)) set(true,true);
      else if(acc<-40&&(mt||mn)) set(false,false);
    },{passive:true});
  })();
  /* ----- الإعدادات ----- */
  function setPanel(open){ $('settingsPanel').classList.toggle('open',open); $('settingsBackdrop').classList.toggle('open',open); }
  $('uGear').addEventListener('click',function(){ setPanel(true); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') setPanel(false); });

  /* مزامنة اسم المظهر مع قسم القراءات + لون شريط المتصفح */
  function syncTheme(){
    var d=document.documentElement.getAttribute('data-design');
    document.documentElement.setAttribute('data-theme',d==='1'?'dark':'light');
    var meta=document.querySelector('meta[name=theme-color]');
    if(meta) meta.content= d==='1' ? '#071530' : (document.documentElement.style.getPropertyValue('--bg')||'#4A1420');
  }
  new MutationObserver(syncTheme).observe(document.documentElement,{attributes:true,attributeFilter:['data-design','style']});
  syncTheme();

  /* ----- نسخة احتياطية ----- */
  var PRE=['khalwa_','dr_','mohasba_','rafeeq_'], msg=$('uBkMsg');
  function mine(k){return PRE.some(function(p){return k.indexOf(p)===0})}
  $('uBkExport').onclick=function(){
    try{
      var d={_app:'rafeeq-ruhi',_v:2,_at:new Date().toISOString(),data:{}};
      for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i); if(mine(k)) d.data[k]=localStorage.getItem(k);}
      var a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([JSON.stringify(d)],{type:'application/json'}));
      a.download='rafeeq-ruhi-backup-'+new Date().toISOString().slice(0,10)+'.json'; document.body.appendChild(a); a.click(); a.remove();
      msg.textContent='تم حفظ النسخة ('+Object.keys(d.data).length+' عنصر).';
    }catch(e){ msg.textContent='تعذّر حفظ النسخة.'; }
  };
  $('uBkImport').onclick=function(){ $('uBkFile').click(); };
  $('uBkFile').onchange=function(){
    var f=this.files[0]; if(!f) return; var r=new FileReader(), inp=this;
    r.onload=function(){ try{
      var d=JSON.parse(r.result); if(d._app!=='rafeeq-ruhi'||!d.data) throw 0;
      var n=0; Object.keys(d.data).forEach(function(k){ if(mine(k)){ localStorage.setItem(k,d.data[k]); n++; } });
      msg.textContent='تمت استعادة '+n+' عنصر… جارٍ إعادة التحميل.'; setTimeout(function(){location.reload()},900);
    }catch(e){ msg.textContent='الملف غير صالح.'; } };
    r.readAsText(f); inp.value='';
  };

  /* ----- البداية ----- */
  function paintStart(){ var v=ls('rafeeq_start')||'home'; $('uStartHome').classList.toggle('active',v==='home'); $('uStartLast').classList.toggle('active',v==='last'); }
  $('uStartHome').onclick=function(){ ls('rafeeq_start','home'); paintStart(); };
  $('uStartLast').onclick=function(){ ls('rafeeq_start','last'); paintStart(); };
  paintStart();
  /* v2.85: التأملات مفتوحة/مطويّة افتراضيًا (إعداد واحد للأجبية والقراءات والكتاب المقدس) */
  function paintMed(){ var o=ls('rafeeq_meddef')==='open'; $('uMedOpen').classList.toggle('active',o); $('uMedClosed').classList.toggle('active',!o); }
  function setMed(v){ ls('rafeeq_meddef',v); paintMed(); document.querySelectorAll('details.med-collapsible,details.merged-meditation-toggle,details.bg-card').forEach(function(d){ d.open=(v==='open'); }); }
  $('uMedOpen').onclick=function(){ setMed('open'); };
  $('uMedClosed').onclick=function(){ setMed('closed'); };
  paintMed();
  function paintEmo(){ var on=ls('rafeeq_talk_emoji')!=='0'; $('uTkEmojiOn').classList.toggle('active',on); $('uTkEmojiOff').classList.toggle('active',!on); }
  $('uTkEmojiOn').onclick=function(){ ls('rafeeq_talk_emoji','1'); paintEmo(); };
  $('uTkEmojiOff').onclick=function(){ ls('rafeeq_talk_emoji','0'); paintEmo(); };
  paintEmo();
  var start=location.hash.slice(1);
  if(!PAGES[start]) start=(ls('rafeeq_start')==='last')?ls('rafeeq_last'):'home';
  show(PAGES[start]?start:'home',{top:1,replace:true});
  window.addEventListener('hashchange',function(){ var h=location.hash.slice(1); if(PAGES[h]&&h!==cur) show(h,{top:1,replace:true}); });
  window.__rafeeq={show:show,act:function(n,el){ if(ACT[n]) ACT[n](el); }};
})();

