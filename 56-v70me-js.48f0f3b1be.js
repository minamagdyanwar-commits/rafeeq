
(function(){
'use strict';
var F=window.__F; if(!F) return;
function $(i){return document.getElementById(i)}
var esc=F.esc;
var KEY='rafeeq_me_v1';
function load(){ try{ var o=JSON.parse(localStorage.getItem(KEY)||'{}')||{}; o.reqs=o.reqs||[]; o.verses=o.verses||[]; return o }catch(e){ return {reqs:[],verses:[]} } }
function save(o){ try{ localStorage.setItem(KEY,JSON.stringify(o)) }catch(e){} }
function getName(){ return ((window.__rfPrefs&&window.__rfPrefs.name)||'').trim() }
function setName(n){ var p=window.__rfPrefs; if(!p) return; p.name=String(n||'').trim().slice(0,30); try{ localStorage.setItem('rafeeq_msg_v1',JSON.stringify(p)) }catch(e){} }
function hash(s){ var h=0; for(var i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0; return h }
function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,6) }
function dlabel(ts){ try{ return new Date(ts).toLocaleDateString('ar-EG',{day:'numeric',month:'long'}) }catch(e){ return '' } }

/* ===== الأحوال (آيات حرفية من الكتاب المقدس + تأمل بشري) ===== */
var MOODS=[
 {k:'tired',e:'😮‍💨',l:'متعب',ref:'متى ١١: ٢٨',v:'تَعَالَوْا إِلَيَّ يَا جَمِيعَ الْمُتْعَبِينَ وَالثَّقِيلِي الأَحْمَالِ وَأَنَا أُرِيحُكُمْ.',refl:'مش مطلوب منك تتجمّل أو تشرح. تعالَ زي ما إنت، والتعب نفسه يبقى صلاة لما تسيبه عند قدميه.',go:'pray',gl:'صلِّ الآن'},
 {k:'anxious',e:'😟',l:'قلقان',ref:'١ بطرس ٥: ٧',v:'مُلْقِينَ كُلَّ هَمِّكُمْ عَلَيْهِ لأَنَّهُ هُوَ يَعْتَنِي بِكُمْ.',refl:'اكتب اللي شاغلك في «طلباتي» وسيبه هناك. مش لازم تحله الليلة، المهم تحطه في إيد اللي بيعتني بيك.',go:'reqs',gl:'اكتب ما يقلقك'},
 {k:'grateful',e:'🙏',l:'شاكر',ref:'مزمور ١٠٢ (١٠٣): ٢',v:'بَارِكِي يَا نَفْسِي الرَّبَّ، وَلاَ تَنْسَيْ كُلَّ حَسَنَاتِهِ.',refl:'الشكر بيفتح العين. خد لحظة وافتكر حاجة واحدة صغيرة النهارده كانت من إيده.',go:'reqs',gl:'سجّل شكرك'},
 {k:'longing',e:'🕊',l:'مشتاق',ref:'مزمور ٤١ (٤٢): ١',v:'كَمَا يَشْتَاقُ الأَيِّلُ إِلَى جَدَاوِلِ الْمِيَاهِ، هكَذَا تَشْتَاقُ نَفْسِي إِلَيْكَ يَا اَللهُ.',refl:'الاشتياق ده نفسه هدية، معناه إن قلبك بيدوّر عليه. اقعد معاه بكلمته النهارده.',go:'bible',gl:'افتح الكتاب'},
 {k:'guilty',e:'😔',l:'مثقل بخطية',ref:'١ يوحنا ١: ٩',v:'إِنِ اعْتَرَفْنَا بِخَطَايَانَا فَهُوَ أَمِينٌ وَعَادِلٌ، حَتَّى يَغْفِرَ لَنَا خَطَايَانَا وَيُطَهِّرَنَا مِنْ كُلِّ إِثْمٍ.',refl:'الثقل ده مش آخر الكلام. الاعتراف بداية الراحة، ومحاسبة هادية الليلة ممكن تكون أول خطوة.',go:'exam',gl:'المحاسبة'}
];
var MOOD={}; MOODS.forEach(function(m){MOOD[m.k]=m});
window.__v70moods=MOODS;
function curMood(){ var me=load(); return me.mood&&me.mood.d===F.dkey()?me.mood.m:null }

/* ===== بناء البطاقات ===== */
function moodHtml(){
  var cur=curMood(), nm=getName();
  var h='<h3 class="u-h3">إيه حالك النهارده'+(nm?' يا '+esc(nm):'')+'؟</h3><div class="v70chips" role="group" aria-label="حالك اليوم">'+
   MOODS.map(function(m){ return '<button type="button" class="v70chip'+(cur===m.k?' on':'')+'" data-v70="mood:'+m.k+'" aria-pressed="'+(cur===m.k)+'"><span aria-hidden="true">'+m.e+'</span>'+m.l+'</button>' }).join('')+'</div>';
  if(cur){ var m=MOOD[cur];
    h+='<div class="v70word"><div class="v70call">كلمة الله لك'+(nm?' يا '+esc(nm):'')+':</div><blockquote>'+esc(m.v)+'<cite>'+esc(m.ref)+'</cite></blockquote><p>'+esc(m.refl)+'</p><div class="v70acts"><button type="button" data-v70="mine:'+m.k+'">♡ هذه الآية لي</button><button type="button" class="p" data-v70="go:'+m.k+'">'+esc(m.gl)+'</button></div><small>الآية نص الكتاب المقدس، والتأمل بعدها تأمّل بشري.</small></div>';
  } else if(!nm){ h+='<button type="button" class="v70link" data-v70="name">أضف اسمك ليخاطبك البرنامج به</button>'; }
  return h;
}
function reqCounts(){ var r=load().reqs; var a=r.filter(function(x){return !x.done}).length; return {open:a,done:r.length-a} }
function reqHtml(){
  var c=reqCounts(); var t=(c.open||c.done)?(c.open+' تنتظر · '+c.done+' استُجيبت'):'اكتب أول طلبة أو شكر';
  return '<div><small>طلباتي</small><b>'+t+'</b></div><button type="button" class="o" data-v70="reqs">فتح</button>';
}
function echoPick(){
  var v=load().verses.filter(function(x){return Date.now()-x.ts>6*86400000}); if(!v.length) return null;
  return v[hash(F.dkey())%v.length];
}
function ensure(id,cls,parent,before){
  var e=$(id); if(e) return e; e=document.createElement('div'); e.id=id; e.className=cls; parent.insertBefore(e,before||null); return e;
}
function setIf(e,html){ if(e.getAttribute('data-h')!==html){ e.innerHTML=html; e.setAttribute('data-h',html) } }
function renderAll(){
  var w=document.querySelector('#page-home .u-wrap');
  if(w){
    var ex=$('hExtra'), res=$('v69res'), anchor=ex;
    var m=ensure('v70mood-h','u-card v70mood',w,anchor); setIf(m,moodHtml());
    var q=ensure('v70req-h','u-card v70req',w,anchor); setIf(q,reqHtml());
    var ec=echoPick(), e=$('v70echo-h');
    if(ec){ e=ensure('v70echo-h','u-card v70echo',w,q.nextSibling); setIf(e,'<div><small>آية أخذتَها لنفسك في '+esc(dlabel(ec.ts))+'</small><q>'+esc(ec.text)+'</q><cite>'+esc(ec.ref)+'</cite></div>'); }
    else if(e) e.remove();
    var seq=[res,m,q,$('v70echo-h')].filter(Boolean), ok=true;
    for(var i=0;i<seq.length-1;i++){ if(seq[i].nextElementSibling!==seq[i+1]) ok=false }
    if(!ok||(ex&&seq[seq.length-1].nextElementSibling!==ex)) seq.forEach(function(el){ w.insertBefore(el,ex) });
  }
  var gm=$('godMessageArea');
  if(gm){
    var pm=ensure('v70mood-p','u-card v70mood',gm.parentNode,gm); setIf(pm,moodHtml()); pm.hidden=!gm.firstElementChild;
    /* الاسم في رسالة الله */
    var card=gm.querySelector('.god-message-card'), nm=getName();
    if(card&&nm&&!card.querySelector('.v70gcall')){ var d=document.createElement('div'); d.className='v70gcall'; d.textContent='يا '+nm+'،'; var t=card.querySelector('.god-message-title'); if(t) t.after(d); }
  }
  renderPray();
}
/* بطاقة «من أجلي» داخل ساعة الصلاة */
function renderPray(){
  var cl=$('closingArea'); if(!cl) return;
  var on=!!(cl.firstElementChild||($('openingArea')&&$('openingArea').firstElementChild));
  var c=$('v70pray'); if(!on){ if(c) c.remove(); return }
  if(!c){ c=document.createElement('div'); c.id='v70pray'; c.className='u-card v70pray'; cl.parentNode.insertBefore(c,cl); }
  var nm=getName(), open=load().reqs.filter(function(x){return !x.done}).slice(0,5);
  var h='<h4>من أجلي ومن أجل من أحب</h4><p>يا رب، أنا '+(nm?esc(nm):'ابنك')+' واقف أمامك، وأضع بين يديك:</p>';
  if(open.length) h+='<ul class="v70list">'+open.map(function(x){ return '<li><span class="t">'+esc(x.t)+'</span><button type="button" class="ok" data-v70="ans:'+x.id+'">✓ استُجيبت</button></li>' }).join('')+'</ul>';
  else h+='<p style="opacity:.7">لسه ما كتبتش طلبات. اكتب أول طلبة وهتظهر هنا في كل صلاة.</p>';
  var mc=curMood(); if(mc&&MOOD[mc]) h+='<p style="opacity:.8">حالي اليوم: '+MOOD[mc].e+' '+esc(MOOD[mc].l)+' — «'+esc(MOOD[mc].ref)+'»</p>';
  h+='<div class="v70acts"><button type="button" data-v70="reqs">＋ طلباتي</button></div>';
  setIf(c,h);
}
/* ===== نافذة طلباتي وآياتي ===== */
function listHtml(){
  var me=load(), open=me.reqs.filter(function(x){return !x.done}), done=me.reqs.filter(function(x){return x.done});
  var h='<h4>أصلّي من أجل ('+open.length+')</h4>';
  h+=open.length?'<ul class="v70list">'+open.map(function(x){return '<li><span class="t">'+esc(x.t)+'<small>'+esc(dlabel(x.ts))+'</small></span><button type="button" class="ok" data-v70="ans:'+x.id+'">✓ استُجيبت</button><button type="button" data-v70="del:'+x.id+'" aria-label="حذف">🗑</button></li>'}).join('')+'</ul>':'<p style="opacity:.7">لا توجد طلبات بعد.</p>';
  if(done.length){ h+='<h4>استُجيبت — شكرًا يا رب ('+done.length+')</h4><ul class="v70list">'+done.map(function(x){return '<li><span class="t">'+esc(x.t)+'<small>استُجيبت '+esc(dlabel(x.done))+'</small></span><button type="button" data-v70="del:'+x.id+'" aria-label="حذف">🗑</button></li>'}).join('')+'</ul>'; }
  if(me.verses.length){ h+='<h4>آياتي ('+me.verses.length+')</h4><ul class="v70list">'+me.verses.map(function(x){return '<li><span class="t">«'+esc(x.text)+'»<small>'+esc(x.ref)+' · '+esc(dlabel(x.ts))+'</small></span><button type="button" data-v70="vdel:'+x.id+'" aria-label="حذف">🗑</button></li>'}).join('')+'</ul>'; }
  return h;
}
function openReqs(){
  F.sheet('<div class="v70sh"><h3 class="u-h3">طلباتي وشكري</h3><div class="v70add"><input id="v70in" class="u-in" maxlength="120" placeholder="اكتب طلبتك أو شكرك…" aria-label="طلبة جديدة"><button type="button" class="u-btn on" data-v70="add">إضافة</button></div><div id="v70lst">'+listHtml()+'</div><div class="row-gap" style="margin-top:12px"><button type="button" class="u-btn" onclick="__F.closeSheet()">إغلاق</button></div></div>');
  var i=$('v70in'); if(i) i.addEventListener('keydown',function(e){ if(e.key==='Enter'){ e.preventDefault(); act('add') } });
}
function paintList(){ var l=$('v70lst'); if(l) l.innerHTML=listHtml(); renderAll(); }
function openName(){
  F.sheet('<div class="v70sh"><h3 class="u-h3">ما اسمك؟</h3><p style="opacity:.8">سيخاطبك به البرنامج في الرسائل والآيات والصلاة.</p><input id="v70nm" class="u-in" maxlength="30" value="'+esc(getName())+'" placeholder="اسمك"><div class="row-gap" style="margin-top:10px"><button type="button" class="u-btn on" data-v70="namesave">حفظ</button></div></div>');
}
/* ===== الإجراءات ===== */
function mine(ref,text){
  var me=load();
  if(me.verses.some(function(x){return x.ref===ref&&x.text===text})){ F.toast('هذه الآية عندك بالفعل في «آياتي»'); return }
  var v={id:uid(),ref:ref,text:text,ts:Date.now()}; me.verses.unshift(v); save(me); renderAll();
  F.toast('حُفظت في «آياتي»',{undo:function(){ var m=load(); m.verses=m.verses.filter(function(x){return x.id!==v.id}); save(m); renderAll(); }});
}
window.__rfMine=mine;
function act(a){
  var p=a.split(':'), k=p[0], id=p.slice(1).join(':');
  var me=load();
  if(k==='mood'){ if(me.mood&&me.mood.d===F.dkey()&&me.mood.m===id) delete me.mood; else me.mood={d:F.dkey(),m:id}; save(me); renderAll(); }
  else if(k==='mine'){ var m=MOOD[id]; if(m) mine(m.ref,m.v); }
  else if(k==='go'){ var g=MOOD[id]&&MOOD[id].go;
    try{
      if(g==='pray') window.__rafeeq.act('hour',{dataset:{key:window.__k.getSuggestedHourKey()}});
      else if(g==='reqs') openReqs();
      else if(g==='bible'){ window.__rafeeq.show('trk',{top:1}); F.setTrkTab('bible'); }
      else if(g==='exam') window.__rafeeq.show('exam',{top:1});
    }catch(e){}
  }
  else if(k==='reqs') openReqs();
  else if(k==='name') openName();
  else if(k==='namesave'){ var n=$('v70nm'); setName(n?n.value:''); F.closeSheet(); renderAll(); F.toast('تشرّفنا يا '+(getName()||'حبيبي')); }
  else if(k==='add'||a==='add'){ var i=$('v70in'), t=i?i.value.trim():''; if(!t) return; me.reqs.unshift({id:uid(),t:t.slice(0,120),ts:Date.now(),done:0}); save(me); i.value=''; paintList(); i.focus(); }
  else if(k==='ans'){ me.reqs.forEach(function(x){ if(x.id===id) x.done=Date.now() }); save(me); paintList(); F.toast('شكرًا يا رب ✓',{undo:function(){ var m=load(); m.reqs.forEach(function(x){ if(x.id===id) x.done=0 }); save(m); paintList(); }}); }
  else if(k==='del'){ var ix=-1,rm=null; me.reqs.forEach(function(x,i){ if(x.id===id){ix=i;rm=x} }); if(!rm) return; me.reqs.splice(ix,1); save(me); paintList();
    F.toast('حُذفت',{undo:function(){ var m=load(); m.reqs.splice(Math.min(ix,m.reqs.length),0,rm); save(m); paintList(); }}); }
  else if(k==='vdel'){ var vi=-1,vr=null; me.verses.forEach(function(x,i){ if(x.id===id){vi=i;vr=x} }); if(!vr) return; me.verses.splice(vi,1); save(me); paintList();
    F.toast('حُذفت',{undo:function(){ var m=load(); m.verses.splice(Math.min(vi,m.verses.length),0,vr); save(m); paintList(); }}); }
}
document.addEventListener('click',function(e){ var b=e.target.closest&&e.target.closest('[data-v70]'); if(b){ e.preventDefault(); act(b.getAttribute('data-v70')) } });

/* ===== ذاكرة الأيام للرسالة ===== */
window.__rfMemory=function(key,isToday,A){
  if(!isToday) return '';
  var out=[], t=F.track(), d0=F.parseKey(key), me=load();
  function dayOf(n){ return F.dkey(F.addDays(d0,-n)) }
  var y=t.days[dayOf(1)]||{}, hs=Object.keys(y.h||{}).filter(function(g){return y.h[g]});
  var labels=hs.map(function(g){ var o=F.groupById&&F.groupById(g); return o&&o.label }).filter(Boolean).slice(0,3);
  var parts=[];
  if(labels.length) parts.push('صلّيت '+labels.join(' و'));
  if(y.read) parts.push('قريت قراءات اليوم');
  if(y.med) parts.push('قعدت معايا في الخلوة');
  if(parts.length) out.push('وافتكر إنك امبارح '+parts.join('، و')+'. كل ده محفوظ عندي.');
  else{
    var gap=0, last=-1; for(var n=1;n<=60;n++){ if(F.dayScore(dayOf(n))>0){ last=n; break } }
    if(last>=2){ out.push('بقالك '+F.ard(last)+' أيام ما قابلتنيش، ومش زعلان منك. أنا مستنيك زي ما أنا، وكل مرة بترجع فيها كأنها أول مرة.'); }
  }
  var open=me.reqs.filter(function(x){return !x.done});
  if(open.length){ var r=open[hash(key)%open.length]; out.push('وفاكر طلبتك: «'+r.t.slice(0,60)+'»، وأنا سامعك وماسكها معاك.'); }
  var rec=me.reqs.filter(function(x){return x.done&&Date.now()-x.done<3*86400000}); if(rec.length) out.push('وفرحت معاك إن «'+rec[0].t.slice(0,60)+'» استُجيبت، فاكر تشكرني؟');
  var md=curMood(), MM={tired:'وعارف إنك النهارده تعبان؛ سيب عنك الحِمل شوية، أنا شايله معاك.',anxious:'وحاسس إن قلبك قلقان النهارده؛ اسمع: أنا معاك، ومفيش حاجة خارج إيدي.',grateful:'وشايف قلبك شاكر النهارده، وده بيفرحني أكتر مما تتخيل.',longing:'وعارف إنك مشتاق لي النهارده، وأنا أشتاق ليك أكتر.',guilty:'وعارف إن في حاجة تقيلة على قلبك النهارده. تعالَ من غير خوف؛ بابي مفتوح، وأنا بغفر.'};
  if(md&&MM[md]) out.push(MM[md]);
  return out.join(' ');
};

/* ===== المراقبة والتحديث ===== */
var gm=$('godMessageArea'); if(gm) new MutationObserver(function(){ renderAll() }).observe(gm,{childList:true});
['openingArea','closingArea'].forEach(function(i){ var e=$(i); if(e) new MutationObserver(renderPray).observe(e,{childList:true}) });
['page-home','page-pray'].forEach(function(i){ var e=$(i); if(e) new MutationObserver(renderAll).observe(e,{attributes:true,attributeFilter:['class']}) });
document.addEventListener('visibilitychange',function(){ if(!document.hidden) renderAll() });
setTimeout(renderAll,200); setTimeout(renderAll,1500);
})();
