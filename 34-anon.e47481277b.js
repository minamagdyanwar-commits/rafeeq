
/* ===================== الرفيق الروحي — الإضافات (دون إنترنت) ===================== */
(function(){
'use strict';
var F=window.__F={};
var $=function(id){return document.getElementById(id)};
F.$=$;
function jget(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}}
function jset(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
F.jget=jget; F.jset=jset;
var DIG='٠١٢٣٤٥٦٧٨٩';
F.ard=function(n){return String(n).replace(/\d/g,function(d){return DIG[d]})};
function fk(d){var m=d.getMonth()+1,dd=d.getDate();return d.getFullYear()+'-'+(m<10?'0':'')+m+'-'+(dd<10?'0':'')+dd}
F.realKey=function(){return fk(new Date())};
/* بلا وسيط: تاريخ التدوين الذي يحدده المستخدم (يدويًا). مع وسيط: تنسيق ذلك التاريخ */
F.dkey=function(d){return d?fk(d):(window.__rfEntry?window.__rfEntry():fk(new Date()))};
F.entryAuto=function(){var e=(jget(PK,{})||{}).entry;return !!(e&&e.auto)};
F.setEntry=function(key,auto){var p=jget(PK,{})||{};p.entry={auto:!!auto,date:auto?F.realKey():key};jset(PK,p);
  if(window.__m&&window.__m.setDate) window.__m.setDate(F.dkey());
  if(F.paintDay) F.paintDay(); if(F.refreshHome) F.refreshHome(); if(F.renderTrk) F.renderTrk(); if(F.updatePrayBar) F.updatePrayBar();
  if(F.bible&&F.bible.state&&document.getElementById('page-trk').classList.contains('on')&&F.bible.render) {}
};
F.parseKey=function(k){var p=k.split('-');return new Date(+p[0],+p[1]-1,+p[2])};
F.addDays=function(d,n){return new Date(d.getFullYear(),d.getMonth(),d.getDate()+n)};
F.daysBetween=function(a,b){return Math.round((F.parseKey(b)-F.parseKey(a))/86400000)};
var ESC={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};
F.esc=function(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return ESC[c]})};
F.norm=function(s){
  return String(s).replace(/[ً-ٰٟۖ-ۭـ]/g,'')
    .replace(/[ٱآأإ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه')
    .replace(/ؤ/g,'و').replace(/ئ/g,'ي').toLowerCase();
};
F.MONTHS=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
F.WD=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];

/* ---------- التخزين ---------- */
var TK='rafeeq_track_v1', PK='rafeeq_prefs_v1';
F.track=function(){var t=jget(TK,null);return (t&&t.days)?t:{days:{}}};
F.day=function(key){return F.track().days[key]||{}};
F.setDay=function(key,fn){var t=F.track();var d=t.days[key]||(t.days[key]={});fn(d);jset(TK,t)};
F.prefs=function(){
  var p=jget(PK,{})||{};
  if(!Array.isArray(p.rule)) p.rule=['bakr','noum'];
  if(!p.planDone) p.planDone={};
  if(!p.plan) p.plan=null;
  if(p.evening==null) p.evening=21;
  if(p.focus==null) p.focus=false;
  return p;
};
F.savePrefs=function(p){jset(PK,p)};

/* ---------- ساعات الصلاة (سبع) ---------- */
F.GROUPS=[
  {id:'bakr',label:'باكر',keys:['bakr']},
  {id:'thalitha',label:'الثالثة',keys:['thalitha']},
  {id:'sadisa',label:'السادسة',keys:['sadisa']},
  {id:'tasi3a',label:'التاسعة',keys:['tasi3a']},
  {id:'ghouroub',label:'الغروب',keys:['ghouroub']},
  {id:'noum',label:'النوم',keys:['noum']},
  {id:'midnight',label:'نصف الليل',keys:['nos_layl_1','nos_layl_2','nos_layl_3']},
  {id:'setar',label:'الستار',keys:['setar']}
];
F.groupOf=function(key){
  for(var i=0;i<F.GROUPS.length;i++) if(F.GROUPS[i].keys.indexOf(key)>-1) return F.GROUPS[i];
  return null;
};
F.groupById=function(id){for(var i=0;i<F.GROUPS.length;i++) if(F.GROUPS[i].id===id) return F.GROUPS[i]; return null};
F.hourDone=function(key,gid){var d=F.day(key);return !!(d.h&&d.h[gid])};
F.setHour=function(key,gid,on){F.setDay(key,function(d){d.h=d.h||{};if(on)d.h[gid]=1;else delete d.h[gid]})};

F.examHasEntries=function(key){
  var st=jget('mohasba_v1',{days:{}})||{days:{}};var d=(st.days||{})[key]||{};
  return Object.keys(d).some(function(k){return k.charAt(0)!=='_'&&d[k]})||!!(d._other&&String(d._other).trim());
};
/* كل التعليمات يدوية: لا شيء يُعلَّم تلقائيًا */
F.examDone=function(key){return !!F.day(key).exam};
F.readDone=function(key){return !!F.day(key).read};
F.medDone=function(key){return !!F.day(key).med};


/* v41: ترتيب وإخفاء عناصر «يومك» في الرئيسية */
F.DAYSEQ_DEFAULT=[['h:bakr','باكر'],['h:thalitha','الثالثة'],['h:sadisa','السادسة'],['h:tasi3a','التاسعة'],['read','قراءات اليوم'],['med','خلوة اليوم'],['h:ghouroub','الغروب'],['exam','محاسبة المساء'],['h:noum','النوم'],['h:midnight','نصف الليل'],['h:setar','الستار']];
F.dayOrder=function(){
  var r=null; try{ r=JSON.parse(localStorage.getItem('rafeeq_dayorder')||'null'); }catch(e){} r=r||{};
  var ids=F.DAYSEQ_DEFAULT.map(function(x){return x[0]});
  var o=(r.o||[]).filter(function(i){return ids.indexOf(i)>-1});
  ids.forEach(function(i){ if(o.indexOf(i)<0) o.push(i); });
  return {o:o,x:(r.x||[]).filter(function(i){return ids.indexOf(i)>-1})};
};
F.saveDayOrder=function(d){ try{ localStorage.setItem('rafeeq_dayorder',JSON.stringify(d)); }catch(e){} };
F.arrangeSeq=function(seq){
  var d=F.dayOrder(), m={}; seq.forEach(function(x){m[x.id]=x});
  var out=d.o.filter(function(i){return m[i]&&d.x.indexOf(i)<0}).map(function(i){return m[i]});
  return out.length?out:seq;
};

/* مهام اليوم: ساعات القاعدة + القراءة + الخلوة + المحاسبة */
F.todayItems=function(key){
  key=key||F.dkey(); var p=F.prefs(), items=[];
  p.rule.forEach(function(gid){var g=F.groupById(gid); if(g) items.push({id:'h:'+gid,type:'hour',gid:gid,label:'صلاة '+g.label,done:F.hourDone(key,gid)});});
  items.push({id:'read',type:'read',label:'قراءات اليوم',done:F.readDone(key)});
  items.push({id:'med',type:'med',label:'خلوة اليوم',done:F.medDone(key)});
  items.push({id:'exam',type:'exam',label:'محاسبة المساء',done:F.examDone(key)});
  return items;
};
F.dayScore=function(key){
  var d=F.day(key), n=0;
  if(d.h) n+=Object.keys(d.h).length;
  if(F.readDone(key)) n++; if(F.medDone(key)) n++; if(F.examDone(key)) n++;
  return n;
};
F.streak=function(){
  var s=0, d=F.parseKey(F.dkey()); if(F.dayScore(F.dkey(d))===0) d=F.addDays(d,-1);
  while(F.dayScore(F.dkey(d))>0 && s<3650){ s++; d=F.addDays(d,-1); }
  return s;
};

/* ---------- واجهة مساعدة ---------- */
var toastT;
F.toast=function(msg){
  var t=$('uToast'); if(!t) return; t.textContent=msg; t.classList.add('on');
  clearTimeout(toastT); toastT=setTimeout(function(){t.classList.remove('on')},2400);
};
F.download=function(name,text,type){
  var a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([text],{type:type||'text/plain;charset=utf-8'}));
  a.download=name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function(){URL.revokeObjectURL(a.href)},4000);
};
F.copy=function(text){
  var done=function(){F.toast('تم النسخ')};
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(done,function(){fallback()})}
  else fallback();
  function fallback(){var ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');done()}catch(e){F.toast('تعذّر النسخ')}ta.remove();}
};
F.sheet=function(html,cls){
  var o=$('uSheet'); $('uSheetBody').innerHTML=html; o.className='on '+(cls||'');
  o.querySelector('.u-sheet-card').scrollTop=0;
  return $('uSheetBody');
};
F.closeSheet=function(){ $('uSheet').className=''; $('uSheetBody').innerHTML=''; };
})();

