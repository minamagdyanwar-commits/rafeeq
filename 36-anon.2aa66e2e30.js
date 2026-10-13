
/* ===================== رحلتي: المتابعة · الخطة · الكتاب · ملاحظاتي · الحفظ + الرئيسية ===================== */
(function(){
'use strict';
var F=window.__F,$=F.$,B=F.bible,esc=F.esc,ard=F.ard;
var TABS=[['track','المتابعة'],['plan','الخطة'],['dash','إنجازي'],['bible','الكتاب'],['notes','ملاحظاتي'],['memo','الحفظ']];
var T={tab:'track',planDay:null,memo:{mode:'list',ids:[],i:0,reveal:false},noteQ:''};
function host(){return $('trkBody')}
F.setTrkTab=function(t){ if(t) T.tab=t; paint(); if(window.__navSync) window.__navSync(); };
F.trkTab=function(){return T.tab};
function paint(){
  var tb=$('trkTabs'); if(!tb) return;
  tb.innerHTML=TABS.map(function(x){return '<button type="button" data-ttab="'+x[0]+'" class="'+(T.tab===x[0]?'on':'')+'">'+x[1]+'</button>'}).join('');
  render();
}
function render(){
  var h=host(); if(!h) return;
  if(T.tab==='track') track(h); else if(T.tab==='plan') plan(h); else if(T.tab==='dash') dash(h);
  else if(T.tab==='bible') B.render(h); else if(T.tab==='notes') notes(h); else memo(h);
}
F.renderTrk=render;
function trkOn(){var p=$('page-trk');return p&&p.classList.contains('on')}
function refreshAll(){ if(trkOn()) render(); if(F.refreshHome) F.refreshHome(); }

/* ---------- المتابعة ---------- */
function sc(n){return 's'+Math.min(4,Math.max(0,n))}
function dayOrderCard(){
  var d=F.dayOrder(), lab={}; F.DAYSEQ_DEFAULT.forEach(function(x){lab[x[0]]=x[1]});
  return '<div class="u-card" id="dordCard"><h3 class="u-h3">ترتيب «يومك» في الرئيسية</h3><div class="u-sub">رتّب العناصر بالأسهم، واضغط العين لإخفاء ما لا تحتاجه.</div><ol class="dord">'+
    d.o.map(function(id,i){ var off=d.x.indexOf(id)>-1;
      return '<li class="'+(off?'off':'')+'"><span class="dn">'+ard(i+1)+'</span><b>'+esc(lab[id])+'</b><span class="dbtns">'+
        '<button type="button" data-dord="up:'+id+'"'+(i===0?' disabled':'')+' aria-label="تحريك '+esc(lab[id])+' لأعلى">▲</button>'+
        '<button type="button" data-dord="dn:'+id+'"'+(i===d.o.length-1?' disabled':'')+' aria-label="تحريك '+esc(lab[id])+' لأسفل">▼</button>'+
        '<button type="button" data-dord="eye:'+id+'" aria-pressed="'+(off?'true':'false')+'" aria-label="'+(off?'إظهار ':'إخفاء ')+esc(lab[id])+'">'+(off?'🚫':'👁')+'</button></span></li>'; }).join('')+
    '</ol><button type="button" class="chip" data-dord="reset">إعادة الترتيب الافتراضي</button></div>';
}
function track(h){
  var key=F.dkey(), p=F.prefs(), t=new Date(), st=F.streak(), html='';
  html+='<div class="u-card"><div class="row-between"><h3 class="u-h3">'+esc(F.dayLabel(key))+(key===F.realKey()?' (اليوم)':'')+'</h3><span class="u-pill">'+(st?'متتالية '+ard(st)+(st===1?' يوم':' أيام'):'ابدأ اليوم')+'</span></div>'+
    '<div class="u-sub">صلواتي اليوم — اضغط لتعليم ما صلّيته</div><div class="chips">'+
    F.GROUPS.map(function(g){var on=F.hourDone(key,g.id);return '<button type="button" class="chip'+(on?' on':'')+'" data-th="'+g.id+'">'+(on?'✓ ':'')+g.label+'</button>'}).join('')+'</div>'+
    '<div class="u-sub">باقي الأنشطة</div><div class="chips">'+
    '<button type="button" class="chip'+(F.readDone(key)?' on':'')+'" data-tdo="read">'+(F.readDone(key)?'✓ ':'')+'قراءات اليوم</button>'+
    '<button type="button" class="chip'+(F.medDone(key)?' on':'')+'" data-tdo="med">'+(F.medDone(key)?'✓ ':'')+'الخلوة</button>'+
    '<button type="button" class="chip'+(F.examDone(key)?' on':'')+'" data-tdo="exam">'+(F.examDone(key)?'✓ ':'')+'محاسبة النفس</button></div></div>';
  /* خريطة آخر ١٢ أسبوعًا */
  var start=F.addDays(t,-t.getDay()-77), cells='';
  for(var w=0;w<12;w++) for(var d=0;d<7;d++){
    var dt=F.addDays(start,w*7+d);
    if(dt>t){cells+='<i class="hm future"></i>';continue}
    var k=F.dkey(dt), n=F.dayScore(k);
    cells+='<i class="hm '+sc(n)+(k===key?' today':'')+'" title="'+k+' — '+n+'"></i>';
  }
  html+='<div class="u-card"><h3 class="u-h3">آخر ١٢ أسبوعًا</h3><div class="heat" aria-label="خريطة المواظبة">'+cells+'</div>'+
    '<div class="legend"><span>أقل</span><i class="hm s0"></i><i class="hm s1"></i><i class="hm s2"></i><i class="hm s3"></i><i class="hm s4"></i><span>أكثر</span></div></div>';
  html+=dayOrderCard();
  /* قاعدة الصلاة */
  html+='<div class="u-card"><h3 class="u-h3">قاعدتي اليومية للصلاة</h3><div class="u-sub">اختر الساعات التي تلتزم بها يوميًا؛ تظهر في قائمة «يومك» بالرئيسية.</div><div class="chips">'+
    F.GROUPS.map(function(g){var on=p.rule.indexOf(g.id)>-1;return '<button type="button" class="chip'+(on?' on':'')+'" data-trule="'+g.id+'">'+g.label+'</button>'}).join('')+'</div>'+
    '<div class="u-sub" style="margin-top:12px">تنبيه محاسبة المساء يظهر في الرئيسية بعد الساعة</div><select id="evSel" class="u-in" style="max-width:160px">'+
    [18,19,20,21,22,23].map(function(x){return '<option value="'+x+'"'+(p.evening===x?' selected':'')+'>'+ard(x)+':٠٠</option>'}).join('')+'</select></div>';
  /* ملخص شهري */
  var ym=F.dkey().slice(0,7);
  html+='<div class="u-card"><h3 class="u-h3">ملخص شهري</h3><div class="u-sub">أرقام فقط — لا يتضمن شيئًا من محاسبتك أو ملاحظاتك.</div><div class="row-gap"><input type="month" id="sumM" class="u-in" value="'+ym+'" style="max-width:190px"><button type="button" class="u-btn" data-tsum="1">عرض الملخص</button></div></div>';
  h.innerHTML=html;
}
function monthSummary(ym){
  var y=+ym.slice(0,4), m=+ym.slice(5,7), last=new Date(y,m,0).getDate(), now=F.dkey();
  var hours={}, read=0, med=0, exam=0, active=0, perfect=0, best=0, run=0, total=0;
  F.GROUPS.forEach(function(g){hours[g.id]=0});
  for(var d=1;d<=last;d++){
    var k=ym+'-'+(d<10?'0':'')+d; if(k>now) break; total++;
    var dd=F.day(k), any=0;
    if(dd.h) Object.keys(dd.h).forEach(function(g){if(hours[g]!=null){hours[g]++;any=1}});
    if(F.readDone(k)){read++;any=1} if(F.medDone(k)){med++;any=1} if(F.examDone(k)){exam++;any=1}
    if(any){active++;run++;if(run>best)best=run}else run=0;
    if(F.dayScore(k)>=4) perfect++;
  }
  return {ym:ym,total:total,hours:hours,read:read,med:med,exam:exam,active:active,perfect:perfect,best:best};
}
function summaryText(s){
  var mn=F.MONTHS[+s.ym.slice(5,7)-1]+' '+s.ym.slice(0,4), L=['ملخصي الروحي — '+mn,'عدد الأيام المحسوبة: '+s.total,'أيام فيها نشاط: '+s.active+' · أطول متتالية: '+s.best+' · أيام مكتملة (٤ أنشطة فأكثر): '+s.perfect,'','الصلوات:'];
  F.GROUPS.forEach(function(g){ if(s.hours[g.id]) L.push('  • '+g.label+': '+s.hours[g.id]+' يوم'); });
  L.push('','قراءات اليوم: '+s.read+' يوم','الخلوة: '+s.med+' يوم','محاسبة النفس: '+s.exam+' يوم');
  return L.join('\n');
}


function p151i(){for(var i=0;i<B.data.length;i++) if(B.data[i].n==='المزمور ١٥١') return i; return -1}
function hasItem(list,bi){return list.some(function(x){return x[0]===bi})}
function chOptsFor(bi,list){
  var n=B.data[bi]?B.data[bi].c.length:1, o='', q=p151i();
  for(var i=1;i<=n;i++) o+='<option value="'+i+'">الإصحاح '+ard(B.chNum(bi,i))+'</option>';
  if(B.data[bi]&&B.data[bi].n==='المزامير'&&q>=0&&hasItem(list,q)) o+='<option value="p151">المزمور ١٥١</option>';
  return o;
}
function dropP(bs){var q=p151i(); return bs.indexOf(q)>-1&&bs.some(function(b){return B.data[b].n==='المزامير'})?bs.filter(function(b){return b!==q}):bs}
function resolvePos(bi,cv){ return cv==='p151'?[p151i(),1]:[bi,+cv] }
function posToUi(it){ var q=p151i(); return it[0]===q?{b:B.data.findIndex(function(b){return b.n==='المزامير'}),c:'p151'}:{b:it[0],c:String(it[1])} }
/* ---------- الخطط ---------- */
var SCOPES=[['nt','العهد الجديد'],['ot','العهد القديم'],['bible','الكتاب المقدس (بدون القانونية الثانية)'],['all','الكتاب المقدس كاملًا مع القانونية الثانية'],['gospels','الأناجيل الأربعة'],['psalms','المزامير'],['book','سفر واحد']];
var PRESETS=[{id:'nt90',name:'العهد الجديد في ٩٠ يومًا',scope:'nt',days:90},{id:'ps30',name:'المزامير في ٣٠ يومًا',scope:'psalms',days:30},{id:'gos30',name:'الأناجيل الأربعة في ٣٠ يومًا',scope:'gospels',days:30},{id:'bible365',name:'الكتاب المقدس كاملًا في سنة (مع القانونية الثانية)',scope:'all',days:365},{id:'custom',name:'خطة مخصّصة (أنا أحدد النطاق والمدة)',scope:'nt',days:60}];
function scopeBooks(sc,book){
  var out=[]; B.data.forEach(function(b,bi){
    var ok= sc==='nt'?b.t==='NT': sc==='ot'?b.t==='OT': sc==='bible'?b.t!=='DC': sc==='all'?true:
      sc==='gospels'?['متى','مرقس','لوقا','يوحنا'].indexOf(b.n)>-1: sc==='psalms'?(b.n==='المزامير'||b.n==='المزمور ١٥١'): sc==='book'?bi===+book:false;
    if(ok) out.push(bi);
  }); return out;
}
function scopeAll(sc,book){var o=[]; scopeBooks(sc,book).forEach(function(bi){for(var c=1;c<=B.data[bi].c.length;c++)o.push([bi,c])}); return o}
function curPlan(){
  var p=F.prefs(); if(!p.plan||!p.plan.scope||!B.data) return null;
  var q=p.plan, full=scopeAll(q.scope,q.book), all=full.slice(q.from||0);
  if(!all.length) return null;
  return {q:q,all:all,days:q.days,name:q.name||'خطة قراءة'};
}
function planDayItems(pl,day){
  var N=pl.all.length, a=Math.floor((day-1)*N/pl.days), z=Math.floor(day*N/pl.days);
  return pl.all.slice(a,z);
}
function itemsLabel(items){
  if(!items.length) return '—';
  var out=[],cur=null;
  items.forEach(function(x){
    if(cur&&cur.bi===x[0]&&cur.z===x[1]-1) cur.z=x[1]; else {cur={bi:x[0],a:x[1],z:x[1]};out.push(cur)}
  });
  return out.map(function(r){if(B.data[r.bi].n==='المزمور ١٥١')return B.data[r.bi].n; return B.data[r.bi].n+' '+ard(B.chNum(r.bi,r.a))+(r.z>r.a?'–'+ard(B.chNum(r.bi,r.z)):'')}).join('، ');
}
function dayDone(pl,day){
  var it=planDayItems(pl,day); return it.length>0&&it.every(function(x){return B.isRead(x[0],x[1])});
}
function todayNo(pl){return Math.min(pl.days,Math.max(1,F.daysBetween(pl.q.start,F.dkey())+1))}
function plan(h){
  if(!B.data){ h.innerHTML='<div class="u-card pad c">جارٍ تجهيز الكتاب المقدس…</div>'; B.load().then(function(){if(T.tab==='plan')plan(h)}); return; }
  var pl=curPlan(), mc=multiCard();
  if(!pl){
    var html=mc+'<div class="u-card"><h3 class="u-h3">أو اختر خطة بمدة محددة</h3><div class="u-sub">يمكنك تحديد النطاق والمدة، <b>وتحديد المكان الذي وصلتَ إليه</b> لتكمل من هناك بدل أن تبدأ من الأول. الإصحاحات السابقة تُعلَّم كمقروءة تلقائيًا إن أردت.</div></div>';
    html+=PRESETS.map(function(x){
      return '<button type="button" class="h-row plan-pick" data-tplan="'+x.id+'"><span class="tx"><b>'+x.name+'</b><span>اضغط للضبط وتحديد موضعك</span></span><span class="ar"><i class=chv>‹</i></span></button>';
    }).join('');
    h.innerHTML=html; return;
  }
  var today=todayNo(pl), view=T.planDay||today; if(view<1)view=1; if(view>pl.days)view=pl.days;
  var done=0; pl.all.forEach(function(x){ if(B.isRead(x[0],x[1])) done++; });
  var behind=0, firstMiss=0; for(var d=1;d<today;d++){ if(!dayDone(pl,d)){behind++; if(!firstMiss)firstMiss=d;} }
  var pct=Math.round(100*done/pl.all.length), items=planDayItems(pl,view);
  var html=mc+'<div class="u-card"><div class="row-between"><h3 class="u-h3">'+esc(pl.name)+'</h3><span class="u-pill">'+ard(pct)+'٪</span></div>'+
    '<div class="bar"><i style="width:'+pct+'%"></i></div>'+
    '<div class="u-sub">قرأتَ '+ard(done)+' من '+ard(pl.all.length)+' إصحاحًا · اليوم '+ard(today)+' من '+ard(pl.days)+'</div>'+
    (behind?'<button type="button" class="u-wide warn" data-tpd="'+firstMiss+'">متأخر '+ard(behind)+(behind===1?' يوم':' أيام')+' — اذهب لأول يوم لم يكتمل</button>':
      (today>1?'<div class="u-note ok">أنت ملتزم بالخطة حتى اليوم ✓</div>':''))+
    '<div class="row-gap"><button type="button" class="u-btn" data-tpos="1">📍 حدّد موضعي (أنا وصلت إلى…)</button></div></div>';
  html+='<div class="u-card"><div class="rd-head"><button type="button" data-tpd="'+(view-1)+'" '+(view<=1?'disabled':'')+' aria-label="اليوم السابق"><i class=chv>›</i></button><span class="rd-title" style="cursor:default">اليوم '+ard(view)+(view===today?' (اليوم)':'')+'</span><button type="button" data-tpd="'+(view+1)+'" '+(view>=pl.days?'disabled':'')+' aria-label="اليوم التالي"><i class=chv>‹</i></button></div>';
  html+=items.map(function(x){
    var r=B.isRead(x[0],x[1]);
    return '<button type="button" class="h-row" data-tgo="'+x[0]+':'+x[1]+'"><span class="tx"><b>'+esc(B.label(x[0],x[1]))+'</b><span>'+(r?'✓ قُرئ':'اضغط للقراءة')+'</span></span><span class="ar"><i class=chv>‹</i></span></button>';
  }).join('')+'<button type="button" class="u-wide '+(dayDone(pl,view)?'on':'')+'" data-tpdone="'+view+'">'+(dayDone(pl,view)?'✓ اكتمل هذا اليوم':'علّم قراءة هذا اليوم كاملة')+'</button></div>';
  html+='<button type="button" class="u-link" data-tplanx="1">تغيير الخطة أو إلغاؤها</button>';
  h.innerHTML=html;
}
F.todayPlan=function(){
  var pl=curPlan(); if(!pl) return null;
  var day=todayNo(pl), it=planDayItems(pl,day); return {name:pl.name,day:day,label:itemsLabel(it),done:dayDone(pl,day)};
};

/* ---------- الخطة اليومية: عدد الإصحاحات + التقسيم (عهد قديم / مزامير / عهد جديد) + موضعي في كل قسم ---------- */
var MT=[['ot','العهد القديم'],['ps','المزامير'],['nt','العهد الجديد']];
function mpGet(){var p=F.prefs(); return p.mplan&&p.mplan.tr?p.mplan:null}
function mpList(k,dc){
  var o=[]; B.data.forEach(function(b,bi){
    var ok= k==='nt'?b.t==='NT': k==='ps'?(b.n==='المزامير'||b.n==='المزمور ١٥١'): (b.n!=='المزامير'&&b.n!=='المزمور ١٥١'&&(b.t==='OT'||(dc&&b.t==='DC')));
    if(ok) for(var c=1;c<=b.c.length;c++) o.push([bi,c]);
  }); return o;
}
function mpInfo(m,k){
  var t=m.tr[k]; if(!t||!(t.n>0)) return null;
  var list=mpList(k,!!m.dc), adv=((m.log||{})[F.dkey()]||{})[k]||0, base=Math.max(0,(t.pos||0)-adv);
  var items=list.slice(base,base+t.n);
  return {k:k,n:t.n,list:list,base:base,adv:adv,items:items,done:adv>0,left:Math.max(0,list.length-(t.pos||0)),finished:base>=list.length};
}
F.todayMulti=function(){
  var m=mpGet(); if(!m||!B.data) return null;
  var parts=[],all=true,any=false;
  MT.forEach(function(x){ var i=mpInfo(m,x[0]); if(!i) return; any=true;
    if(i.items.length) parts.push(x[1]+': '+itemsLabel(i.items)); if(!i.done&&!i.finished) all=false; });
  return any?{label:parts.join(' · ')||'أتممتَ كل الأقسام ✓',done:all}:null;
};
F.multiToday=function(){
  var m=mpGet(); if(!m||!B.data) return null; var out=[];
  MT.forEach(function(x){ var i=mpInfo(m,x[0]); if(!i) return; out.push({k:x[0],name:x[1],items:i.items,done:i.done,finished:i.finished}); });
  return out.length?out:null;
};
function multiCard(){
  var m=mpGet();
  if(!m) return '<div class="u-card"><h3 class="u-h3">خطة يومية بالإصحاحات</h3><div class="u-sub">حدّد كم إصحاحًا تقرأ كل يوم، وتقسيمها بين العهد القديم والمزامير والعهد الجديد، وحدّد أين وصلتَ في كل قسم لتكمل من عنده. لا يُعلَّم شيء إلا بضغطتك.</div><div class="row-gap"><button type="button" class="u-btn on" data-tmp="edit">+ إنشاء خطتي اليومية</button></div></div>';
  var h='<div class="u-card"><div class="row-between"><h3 class="u-h3">قراءة اليوم</h3><button type="button" class="u-btn sm" data-tmp="edit">تعديل التقسيم / موضعي</button></div>';
  MT.forEach(function(x){
    var i=mpInfo(m,x[0]); if(!i) return;
    h+='<div class="mp-sec"><div class="row-between"><b>'+x[1]+'</b><span class="u-sub">'+ard(i.n)+' يوميًا · المتبقي '+ard(i.left)+' إصحاحًا'+(i.n?' (~'+ard(Math.ceil(i.left/i.n))+' يوم)':'')+'</span></div>';
    if(i.finished) h+='<div class="u-note ok">أنهيتَ هذا القسم ✓ — يمكنك تغيير موضعك من «تعديل».</div>';
    else {
      h+=i.items.map(function(it){ var r=B.isRead(it[0],it[1]);
        return '<button type="button" class="h-row" data-tgo="'+it[0]+':'+it[1]+'"><span class="tx"><b>'+esc(B.label(it[0],it[1]))+'</b><span>'+(r?'✓ قُرئ':'اضغط للقراءة')+'</span></span><span class="ar"><i class=chv>‹</i></span></button>'}).join('');
      h+='<button type="button" class="u-wide '+(i.done?'on':'')+'" data-tmpdone="'+x[0]+'">'+(i.done?'✓ قرأتُ '+x[1]+' اليوم (اضغط للتراجع)':'علّم: قرأتُ '+x[1]+' اليوم')+'</button>';
    }
    h+='</div>';
  });
  return h+'<div class="u-sub">الموضع يتقدّم فقط عندما تضغط «قرأتُ»؛ وإن لم تقرأ اليوم تبقى القراءة كما هي غدًا.</div></div>';
}
function multiDialog(){
  var m=mpGet()||{tr:{ot:{n:1,pos:0},ps:{n:1,pos:0},nt:{n:1,pos:0}},dc:true}, f='<h3 class="u-h3">خطتي اليومية</h3><div class="u-note">اختر عدد الإصحاحات لكل قسم (اكتب ٠ لإيقاف القسم)، ثم حدّد أين وصلتَ لتكمل من هناك.</div>';
  f+='<label class="u-sub" style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="mpDc"'+(m.dc?' checked':'')+'> أشمل الأسفار القانونية الثانية في العهد القديم (طوبيا، يهوديت، الحكمة، سيراخ، باروخ، المكابيين، تتمّتا أستير ودانيال)</label>';
  MT.forEach(function(x){ var k=x[0], t=m.tr[k]||{n:0,pos:0};
    f+='<div class="mp-sec"><b>'+x[1]+'</b><label class="u-sub">عدد الإصحاحات يوميًا</label><input class="u-in" type="number" min="0" max="30" inputmode="numeric" id="mpN_'+k+'" value="'+(t.n||0)+'">'+
       '<label class="u-sub">📍 وصلتُ إلى (سأكمل من هذا الإصحاح)</label><select class="u-in" id="mpB_'+k+'"></select><select class="u-in" id="mpC_'+k+'"></select></div>'; });
  f+='<label class="u-sub" style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="mpMark"> علّم الإصحاحات السابقة لموضعي كمقروءة (اختياري)</label><div class="u-note" id="mpMsg"></div>'+
     '<div class="row-gap"><button type="button" class="u-btn on" id="mpGo">حفظ الخطة</button>'+(mpGet()?'<button type="button" class="u-btn danger" id="mpDel">إلغاء الخطة</button>':'')+'<button type="button" class="u-btn" data-sheetclose="1">إغلاق</button></div>';
  F.sheet(f);
  function books(k){ var seen=[],o=''; dropP(mpList(k,$('mpDc').checked).map(function(x){return x[0]})).forEach(function(b){ if(seen.indexOf(b)<0){seen.push(b);o+='<option value="'+b+'">'+esc(B.data[b].n)+'</option>'} }); return o; }
  function chs(k){ $('mpC_'+k).innerHTML=chOptsFor(+$('mpB_'+k).value,mpList(k,$('mpDc').checked)); }
  function fill(k,keep){
    var t=m.tr[k]||{pos:0}, cur=null, sel=$('mpB_'+k), prev=sel.value;
    sel.innerHTML=books(k); var list=mpList(k,$('mpDc').checked);
    if(keep&&prev&&sel.querySelector('option[value="'+prev+'"]')) sel.value=prev;
    else { cur=list[Math.min(t.pos||0,list.length-1)]; if(cur){ cur=posToUi(cur); sel.value=String(cur.b); } }
    chs(k); if(!keep&&cur) $('mpC_'+k).value=cur.c;
  }
  MT.forEach(function(x){ var k=x[0]; fill(k,false); $('mpB_'+k).onchange=function(){chs(k)}; });
  $('mpDc').onchange=function(){ MT.forEach(function(x){fill(x[0],true)}) };
  if($('mpDel')) $('mpDel').onclick=function(){ var p=F.prefs(); delete p.mplan; F.savePrefs(p); F.closeSheet(); F.toast('أُلغيت الخطة اليومية'); refreshAll(); };
  $('mpGo').onclick=function(){
    var dc=$('mpDc').checked, tr={}, any=false, old=mpGet(), log=old?(old.log||{}):{}, today=F.dkey();
    MT.forEach(function(x){ var k=x[0], n=Math.max(0,Math.min(30,Math.floor(+$('mpN_'+k).value||0))), list=mpList(k,dc), rp=resolvePos(+$('mpB_'+k).value,$('mpC_'+k).value), bi=rp[0], c=rp[1], pos=0;
      for(var i=0;i<list.length;i++) if(list[i][0]===bi&&list[i][1]===c){pos=i;break}
      if($('mpMark').checked) for(var j=0;j<pos;j++) B.setRead(list[j][0],list[j][1],true,'سابق');
      tr[k]={n:n,pos:pos}; if(n>0) any=true; });
    if(!any){ $('mpMsg').textContent='حدّد عددًا واحدًا على الأقل أكبر من صفر.'; return; }
    delete log[today];
    var p=F.prefs(); p.mplan={tr:tr,dc:dc,log:log,start:(old&&old.start)||today}; F.savePrefs(p); F.closeSheet(); F.toast('حُفظت خطتك — ستكمل من حيث وصلت'); refreshAll();
  };
}
function multiDone(k){
  var m=mpGet(), i=mpInfo(m,k), p=F.prefs(), t=p.mplan.tr[k], key=F.dkey(); p.mplan.log=p.mplan.log||{}; var L=p.mplan.log[key]=p.mplan.log[key]||{};
  if(i.done){ i.items.forEach(function(x){B.setRead(x[0],x[1],false)}); t.pos=Math.max(0,t.pos-i.adv); delete L[k]; }
  else { i.items.forEach(function(x){B.setRead(x[0],x[1],true)}); L[k]=i.items.length; t.pos=t.pos+i.items.length; }
  F.savePrefs(p); refreshAll();
}
/* نافذة ضبط الخطة: النطاق + المدة + موضعي */
function planDialog(presetId,reposition){
  var pre=PRESETS.filter(function(x){return x.id===presetId})[0]||PRESETS[4], cp=reposition?curPlan():null;
  var q=cp?cp.q:{scope:pre.scope,days:pre.days,book:0,name:pre.id==='custom'?'':pre.name};
  var remain=cp?Math.max(1,cp.days-todayNo(cp)+1):q.days;
  var h='<h3 class="u-h3">'+(reposition?'أين وصلتَ في الخطة؟':'ضبط الخطة')+'</h3>';
  if(!reposition){
    h+='<label class="u-sub">النطاق</label><select id="pdScope" class="u-in">'+SCOPES.map(function(x){return '<option value="'+x[0]+'"'+(q.scope===x[0]?' selected':'')+'>'+x[1]+'</option>'}).join('')+'</select>'+
       '<select id="pdBook" class="u-in" style="display:none">'+B.data.map(function(b,i){return '<option value="'+i+'">'+esc(b.n)+'</option>'}).join('')+'</select>'+
       '<label class="u-sub">المدة بالأيام</label><input id="pdDays" class="u-in" type="number" min="1" max="1500" value="'+q.days+'" inputmode="numeric">';
  } else h+='<div class="u-note">سيُعاد توزيع المتبقي على الأيام الباقية ('+ard(remain)+' يوم) من تاريخ نهاية خطتك نفسه. يمكنك تغيير عدد الأيام.</div><label class="u-sub">الأيام المتبقية</label><input id="pdDays" class="u-in" type="number" min="1" max="1500" value="'+remain+'" inputmode="numeric">';
  h+='<label class="u-sub">📍 أنا الآن وصلت إلى (ستكمل من هذا الإصحاح)</label><select id="pdPosB" class="u-in"></select><select id="pdPosC" class="u-in"></select>'+
     '<label class="u-sub" style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="pdMark"> علّم الإصحاحات السابقة له كمقروءة (اختياري — الخطة تكمل من موضعك في كل الأحوال)</label>'+
     '<div class="u-note" id="pdMsg"></div><div class="row-gap"><button type="button" class="u-btn on" id="pdGo">'+(reposition?'تحديث موضعي':'ابدأ الخطة')+'</button><button type="button" class="u-btn" data-sheetclose="1">إلغاء</button></div>';
  F.sheet(h);
  var scopeSel=$('pdScope'), bookSel=$('pdBook'), pb=$('pdPosB'), pc=$('pdPosC');
  function cur(){return reposition?{sc:q.scope,bk:q.book}:{sc:scopeSel.value,bk:bookSel.value}}
  function fillBooks(){
    var c=cur(); if(!reposition) bookSel.style.display=c.sc==='book'?'':'none';
    var bs=dropP(scopeBooks(c.sc,c.bk));
    pb.innerHTML=bs.map(function(bi){return '<option value="'+bi+'">'+esc(B.data[bi].n)+'</option>'}).join(''); fillCh();
  }
  function fillCh(){
    var c=cur(); pc.innerHTML=chOptsFor(+pb.value||0,scopeAll(c.sc,c.bk));
  }
  if(!reposition){scopeSel.onchange=fillBooks;bookSel.onchange=fillBooks;}
  pb.onchange=fillCh; fillBooks();
  if(reposition&&cp){ var di=planDayItems(cp,todayNo(cp))[0]||cp.all[0]; if(di){ var u=posToUi(di); pb.value=String(u.b); fillCh(); pc.value=u.c; } }
  $('pdGo').onclick=function(){
    var c=cur(), days=Math.max(1,Math.min(1500,+$('pdDays').value||0)), msg=$('pdMsg');
    if(!days){msg.textContent='أدخل عدد الأيام.';return}
    var full=scopeAll(c.sc,c.bk), pos=-1, rp=resolvePos(+pb.value,pc.value), pbv=rp[0], pcv=rp[1];
    for(var i=0;i<full.length;i++) if(full[i][0]===pbv&&full[i][1]===pcv){pos=i;break}
    if(pos<0){msg.textContent='حدّد موضعًا داخل نطاق الخطة.';return}
    if(full.length-pos<1){msg.textContent='لا إصحاحات متبقية.';return}
    if($('pdMark').checked) for(var j=0;j<pos;j++) B.setRead(full[j][0],full[j][1],true,'سابق');
    var p=F.prefs(), nm=q.name||(SCOPES.filter(function(x){return x[0]===c.sc})[0]||[0,'خطة'])[1]+' — '+ard(days)+' يومًا';
    if(c.sc==='book') nm=B.data[+c.bk].n+' — '+ard(days)+' يومًا';
    p.plan={scope:c.sc,book:c.bk,days:days,from:pos,start:F.dkey(),name:nm}; F.savePrefs(p);
    T.planDay=null; F.closeSheet(); F.toast(pos?'ستكمل من '+B.label(pbv,pcv):'بدأت الخطة'); refreshAll();
  };
}

/* ---------- إنجازي: إنفوجرافيك الموضع والتقدّم والالتزام ---------- */
function readHist(){
  var m=B.readMap(), c={}; Object.keys(m).forEach(function(k){ var d=m[k]; if(/^\d{4}-\d\d-\d\d$/.test(d)) c[d]=(c[d]||0)+1; }); return c;
}
function fdate(d){ try{return d.toLocaleDateString('ar-EG',{day:'numeric',month:'long',year:'numeric'})}catch(e){return F.dkey(d)} }
function dring(p,label,sub){
  var r=44,C=2*Math.PI*r,off=C*(1-p/100);
  return '<svg viewBox="0 0 110 110" class="rg" role="img" aria-label="'+label+'"><circle cx="55" cy="55" r="'+r+'" fill="none" stroke="rgba(127,127,127,.22)" stroke-width="10"/><circle cx="55" cy="55" r="'+r+'" fill="none" stroke="var(--f-on-bg)" stroke-width="10" stroke-linecap="round" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'" transform="rotate(-90 55 55)"/><text x="55" y="55" text-anchor="middle" dominant-baseline="central" class="rg-t">'+ard(Math.round(p))+'٪</text></svg>';
}
function dash(h){
  if(!B.data){ h.innerHTML='<div class="u-card pad c">جارٍ تجهيز الكتاب المقدس…</div>'; B.load().then(function(){if(T.tab==='dash')dash(h)}); return; }
  var today=F.realKey(), now=new Date(), hist=readHist(), html='';
  /* ١) الصورة الكبيرة */
  var secs=[['ot','العهد القديم'],['ps','المزامير'],['nt','العهد الجديد']], tot=0, rd=0, rows='';
  secs.forEach(function(x){
    var L=mpList(x[0],true), r=L.filter(function(i){return B.isRead(i[0],i[1])}).length; tot+=L.length; rd+=r;
    var p=L.length?100*r/L.length:0;
    rows+='<div class="ds-row"><div class="row-between"><b>'+x[1]+'</b><span class="u-sub">'+ard(r)+' / '+ard(L.length)+' · '+ard(Math.round(p))+'٪</span></div><div class="bar"><i style="width:'+p+'%"></i></div></div>';
  });
  var pall=tot?100*rd/tot:0;
  html+='<div class="u-card"><h3 class="u-h3">الكتاب المقدس كله</h3><div class="ds-top">'+dring(pall,"نسبة المقروء")+'<div class="ds-side"><div class="ds-big">'+ard(rd)+'</div><div class="u-sub">إصحاحًا مقروءًا من '+ard(tot)+'</div><div class="u-sub">تبقّى '+ard(tot-rd)+' إصحاحًا</div></div></div>'+rows+'</div>';
  /* ٢) أين أنا: خريطة الأسفار */
  var m=mpGet(), here={}, hereL=[];
  if(m) MT.forEach(function(x){ var i=mpInfo(m,x[0]); if(i&&i.items.length){ var it=i.items[0]; here[it[0]]=1; hereL.push(x[1]+': '+itemsLabel(i.items)); } });
  var pl=curPlan(); if(pl){ var di=planDayItems(pl,todayNo(pl)); if(di.length){ here[di[0][0]]=1; hereL.push(esc(pl.name)+': '+itemsLabel(di)); } }
  function bookMap(title,types){
    var out='';
    B.data.forEach(function(b,bi){
      if(types.indexOf(b.t)<0) return;
      var n=b.c.length, r=0; for(var c=1;c<=n;c++) if(B.isRead(bi,c)) r++;
      var p=100*r/n, full=r===n;
      out+='<button type="button" class="bm'+(b.t==='DC'?' dcb':'')+(full?' full':'')+(here[bi]?' here':'')+'" style="flex:'+n+' 1 '+(46+Math.min(n,60)*1.2)+'px;--p:'+p.toFixed(1)+'%" data-bmap="'+bi+'" title="'+esc(b.n)+' — '+r+'/'+n+'">'+(here[bi]?'<span class="pin">📍</span>':'')+'<span class="bn">'+esc(b.n)+'</span><span class="bc">'+ard(r)+'/'+ard(n)+'</span></button>';
    });
    return '<div class="u-sub" style="margin-top:12px"><b>'+title+'</b></div><div class="bmap">'+out+'</div>';
  }
  html+='<div class="u-card"><h3 class="u-h3">أين أنا من الكتاب؟</h3>'+bookMap('العهد القديم (والقانونية الثانية بحدود منقّطة)',['OT','DC'])+bookMap('العهد الجديد',['NT'])+
    '<div class="legend lg2"><span class="sw"></span> مقروء <span class="sw e"></span> لم يُقرأ <span>📍 موضع قراءتك اليوم</span></div>'+
    (hereL.length?'<div class="u-note">📍 '+hereL.join(' · ')+'</div>':'<div class="u-note">أنشئ خطة من تبويب «الخطة» ليظهر موضعك هنا. اضغط على أي سفر لفتحه.</div>')+'</div>';
  /* ٣) الخطة: متى أنتهي */
  var fin='', any=false;
  if(m){
    var worst=0;
    MT.forEach(function(x){ var i=mpInfo(m,x[0]); if(!i) return; any=true;
      var left=i.left, days=i.n?Math.ceil(left/i.n):0, dt=F.addDays(now,days), p=i.list.length?100*Math.min(i.list.length,m.tr[x[0]].pos||0)/i.list.length:0; if(days>worst)worst=days;
      fin+='<div class="ds-row"><div class="row-between"><b>'+x[1]+'</b><span class="u-sub">'+ard(i.n)+' يوميًا</span></div><div class="bar"><i style="width:'+p+'%"></i></div><div class="u-sub">'+(left?'يتبقى '+ard(left)+' إصحاحًا · ~'+ard(days)+' يومًا · أنتهي تقريبًا '+fdate(dt):'أنهيتَ هذا القسم ✓')+'</div></div>'; });
    if(any) fin='<div class="ds-fin">'+(worst?'بهذه الخطة تنهي كل الأقسام في نحو <b>'+ard(worst)+'</b> يومًا — <b>'+fdate(F.addDays(now,worst))+'</b>':'أنهيتَ كل أقسام خطتك ✓')+'</div>'+fin;
  }
  if(pl){
    any=true; var td=todayNo(pl), beh=0; for(var d2=1;d2<td;d2++) if(!dayDone(pl,d2)) beh++;
    var endD=F.addDays(F.parseKey(pl.q.start),pl.days-1), dleft=Math.max(0,pl.days-td), pp=Math.round(100*(td-1)/pl.days);
    fin+='<div class="ds-row"><div class="row-between"><b>'+esc(pl.name)+'</b><span class="u-sub">اليوم '+ard(td)+' من '+ard(pl.days)+'</span></div><div class="bar"><i style="width:'+pp+'%"></i></div><div class="u-sub">'+(beh?'متأخر '+ard(beh)+(beh===1?' يوم':' أيام')+' · ':'في الموعد · ')+'تنتهي '+fdate(endD)+' (باقي '+ard(dleft)+' يومًا)</div></div>';
  }
  if(!any) fin='<div class="u-note">لم تُنشأ خطة بعد. من تبويب «الخطة» اختر عدد الإصحاحات اليومية وموضعك لتظهر هنا توقعات الانتهاء.</div>';
  /* وتيرتي الفعلية */
  var keys=Object.keys(hist).sort(), last30=0, i30; for(i30=0;i30<30;i30++){ last30+=hist[F.dkey(F.addDays(now,-i30))]||0 }
  var span=keys.length?Math.max(7,Math.min(30,F.daysBetween(keys[0],today)+1)):30, pace=last30/span, remain=tot-rd;
  var paceL= last30&&remain>0? 'وتيرتك الفعلية ('+ard(pace.toFixed(1))+' إصحاح/يوم) تنهي الكتاب كله في نحو '+ard(Math.ceil(remain/pace))+' يومًا — '+fdate(F.addDays(now,Math.ceil(remain/pace))): (remain<=0?'أنهيتَ الكتاب كله 🎉':'ابدأ القراءة لنحسب وتيرتك الفعلية.');
  html+='<div class="u-card"><h3 class="u-h3">متى أنتهي؟</h3>'+fin+'<div class="u-note">'+paceL+'</div></div>';
  /* ٤) الالتزام */
  var days30=0,i; for(i=0;i<30;i++) if(hist[F.dkey(F.addDays(now,-i))]) days30++;
  var wk=0; for(i=0;i<7;i++) wk+=hist[F.dkey(F.addDays(now,-i))]||0;
  var st=0, d3=now; if(!hist[today]) d3=F.addDays(d3,-1); while(hist[F.dkey(d3)]&&st<3650){st++;d3=F.addDays(d3,-1)}
  var best=0,run=0; keys.forEach(function(k,ix){ if(ix&&F.daysBetween(keys[ix-1],k)===1) run++; else run=1; if(run>best)best=run; });
  var tiles='<div class="tiles"><div class="tile"><b>'+ard(st)+'</b><span>أيام متتالية</span></div><div class="tile"><b>'+ard(days30)+'/'+ard(30)+'</b><span>أيام قرأتُ فيها</span></div><div class="tile"><b>'+ard(wk)+'</b><span>إصحاحًا هذا الأسبوع</span></div><div class="tile"><b>'+ard(best)+'</b><span>أفضل سلسلة</span></div></div>';
  var adh='';
  if(m){
    var sd=m.start||Object.keys(m.log||{}).sort()[0]||today, win=Math.max(1,Math.min(30,F.daysBetween(sd,today)+1)), act=MT.filter(function(x){return m.tr[x[0]]&&m.tr[x[0]].n>0});
    var full=0, per={}; act.forEach(function(x){per[x[0]]=0});
    for(i=0;i<win;i++){ var L=(m.log||{})[F.dkey(F.addDays(now,-i))]||{}, all=act.length>0; act.forEach(function(x){ if(L[x[0]]>0) per[x[0]]++; else all=false; }); if(all) full++; }
    var ap=Math.round(100*full/win);
    adh='<div class="ds-fin">التزامك بخطتك اليومية (آخر '+ard(win)+(win===1?' يوم':' يومًا')+'): <b>'+ard(ap)+'٪</b> — أتممتَ كل الأقسام في '+ard(full)+' يومًا</div><div class="bar"><i style="width:'+ap+'%"></i></div>'+
      act.map(function(x){var pp2=Math.round(100*per[x[0]]/win);return '<div class="ds-row"><div class="row-between"><span>'+x[1]+'</span><span class="u-sub">'+ard(per[x[0]])+' من '+ard(win)+' يومًا · '+ard(pp2)+'٪</span></div><div class="bar sm"><i style="width:'+pp2+'%"></i></div></div>'}).join('');
  }
  var cells='', start=F.addDays(now,-83); while(start.getDay()!==6) start=F.addDays(start,-1);
  for(var dd=new Date(start); dd<=F.addDays(now,6-((now.getDay()+1)%7)); dd=F.addDays(dd,1)){
    var k2=F.dkey(dd), n2=hist[k2]||0, fut=dd>now, lv=n2>=6?4:n2>=3?3:n2>=2?2:n2>=1?1:0;
    cells+='<i class="hm'+(fut?' future':lv?' s'+lv:'')+(k2===today?' today':'')+'" title="'+k2+(n2?' — '+n2+' إصحاح':'')+'"></i>';
  }
  html+='<div class="u-card"><h3 class="u-h3">التزامي بالقراءة</h3>'+tiles+adh+'<div class="u-sub" style="margin-top:12px">عدد الإصحاحات المقروءة كل يوم (آخر ١٢ أسبوعًا)</div><div class="heat">'+cells+'</div><div class="legend"><span>أقل</span><i class="hm"></i><i class="hm s1"></i><i class="hm s2"></i><i class="hm s3"></i><i class="hm s4"></i><span>أكثر</span></div><div class="u-note">يُحسب فقط ما علّمتَه أنت كمقروء. الإصحاحات التي علّمتَها «سابقة» عند ضبط موضعك لا تُحسب في الالتزام.</div></div>';
  h.innerHTML=html;
}
/* ---------- الملاحظات ---------- */
var NK='rafeeq_notes_v1';
function notesGet(){var n=F.jget(NK,[]);return Array.isArray(n)?n:[]}
function notes(h){
  var list=notesGet().slice().sort(function(a,b){return (b.at||'')<(a.at||'')?-1:1}), q=F.norm(T.noteQ||'');
  if(q) list=list.filter(function(n){return F.norm((n.body||'')+' '+(n.src||'')).indexOf(q)>-1});
  var html='<div class="u-card"><div class="row-gap"><input id="noteQ" class="u-in" type="search" placeholder="ابحث في ملاحظاتي" value="'+esc(T.noteQ||'')+'"><button type="button" class="u-btn" data-tnote="new">+ ملاحظة</button></div></div>';
  if(!list.length) html+='<div class="u-card pad c">'+(q?'لا توجد نتائج.':'لا توجد ملاحظات بعد. اكتب ما تأملته من آية أو قراءة أو صلاة؛ يمكنك أيضًا الضغط على ✎ في أي صفحة.')+'</div>';
  list.forEach(function(n){
    html+='<div class="u-card note"><div class="row-between"><b>'+esc(n.src||'ملاحظة')+'</b><span class="u-sub">'+esc((n.at||'').slice(0,10))+'</span></div><div class="nb">'+esc(n.body||'')+'</div>'+
      '<div class="row-gap"><button type="button" class="u-btn sm" data-tnote="edit:'+n.id+'">تعديل</button><button type="button" class="u-btn sm" data-tnote="copy:'+n.id+'">نسخ</button><button type="button" class="u-btn sm danger" data-tnote="del:'+n.id+'">حذف</button></div></div>';
  });
  if(list.length) html+='<button type="button" class="u-link" data-tnote="export">تنزيل كل الملاحظات كملف نصي</button>';
  h.innerHTML=html;
  var qi=$('noteQ'); if(qi) qi.oninput=function(){T.noteQ=qi.value; var pos=qi.selectionStart; notes(h); var n=$('noteQ'); n.focus(); try{n.setSelectionRange(pos,pos)}catch(e){}};
}
F.noteDialog=function(o){
  o=o||{}; var ex=o.id?notesGet().filter(function(n){return n.id===o.id})[0]:null;
  F.sheet('<h3 class="u-h3">'+(ex?'تعديل الملاحظة':'ملاحظة جديدة')+'</h3><input id="ndSrc" class="u-in" placeholder="المرجع أو العنوان (اختياري)" value="'+esc(ex?ex.src:(o.src||''))+'"><textarea id="ndBody" class="u-in" rows="8" placeholder="اكتب هنا…">'+esc(ex?ex.body:(o.body||''))+'</textarea><div class="row-gap"><button type="button" class="u-btn on" id="ndSave">حفظ</button><button type="button" class="u-btn" data-sheetclose="1">إلغاء</button></div>');
  setTimeout(function(){var b=$('ndBody'); if(b){b.focus(); b.setSelectionRange(b.value.length,b.value.length)}},60);
  $('ndSave').onclick=function(){
    var body=$('ndBody').value.trim(), src=$('ndSrc').value.trim(); if(!body){F.toast('اكتب شيئًا أولًا');return}
    var all=notesGet();
    if(ex){ex.body=body;ex.src=src;ex.at=new Date().toISOString()}
    else all.push({id:'n'+Date.now().toString(36),body:body,src:src,at:new Date().toISOString()});
    F.jset(NK,all); F.closeSheet(); F.toast('تم حفظ الملاحظة'); refreshAll();
  };
};
F.notesAll=notesGet;

/* ---------- الحفظ ---------- */
var VK='rafeeq_verses_v1', IV=[1,2,4,8,16,32];
function vGet(){var v=F.jget(VK,[]);return Array.isArray(v)?v:[]}
function vSave(v){F.jset(VK,v)}
F.addVerse=function(o){
  var v=vGet(); if(v.some(function(x){return x.ref===o.ref})){F.toast('هذه الآية في قائمة الحفظ بالفعل');return}
  v.push({id:'v'+Date.now().toString(36),ref:o.ref,text:o.text,ok:0,due:F.realKey(),added:F.realKey()}); vSave(v);
  F.toast('أُضيفت إلى قائمة الحفظ'); refreshAll();
};
F.versesAll=vGet;
F.dueVerses=function(){var k=F.realKey();return vGet().filter(function(x){return x.due<=k})};
function memo(h){
  var m=T.memo, list=vGet();
  if(m.mode==='prac'){ prac(h); return; }
  var due=F.dueVerses();
  var html='<div class="u-card"><h3 class="u-h3">آيات الحفظ</h3><div class="u-sub">كل آية تُراجَع بفواصل متزايدة (يوم، يومان، ٤، ٨…). كلما نجحتَ زادت الكلمات المخفية.</div><div class="row-gap">'+
    '<button type="button" class="u-btn on" data-tmemo="start" '+(due.length?'':'disabled')+'>راجع المستحق ('+ard(due.length)+')</button><button type="button" class="u-btn" data-tmemo="add">+ أضف آية</button></div></div>';
  if(!list.length) html+='<div class="u-card pad c">لم تضف آيات بعد. افتح أي إصحاح في «الكتاب» وحدّد آية ثم «حفظ»، أو أضفها هنا بمرجعها.</div>';
  list.slice().sort(function(a,b){return a.due<b.due?-1:1}).forEach(function(x){
    var isDue=x.due<=F.realKey();
    html+='<div class="u-card note"><div class="row-between"><b>'+esc(x.ref)+'</b><span class="u-pill'+(isDue?' warn':'')+'">'+(isDue?'مستحقة':'بعد '+ard(F.daysBetween(F.dkey(),x.due))+' يوم')+'</span></div><div class="nb vt">'+esc(x.text)+'</div>'+
      '<div class="row-gap"><button type="button" class="u-btn sm" data-tmemo="one:'+x.id+'">تدرّب</button><button type="button" class="u-btn sm" data-tmemo="copy:'+x.id+'">نسخ</button><button type="button" class="u-btn sm danger" data-tmemo="del:'+x.id+'">حذف</button></div></div>';
  });
  h.innerHTML=html;
}
function maskHtml(text,lvl){
  var ws=text.split(/\s+/), frac=[0,.4,.75,1][Math.min(3,lvl)];
  return ws.map(function(w,i){
    var hide=frac>=1||((i*7+3)%10)/10<frac&&frac>0;
    if(frac===0) hide=false;
    return hide?'<span class="mk">'+esc(w.charAt(0))+'<u>'+'&nbsp;'.repeat(Math.max(1,Math.min(6,w.length-1)))+'</u></span>':esc(w);
  }).join(' ');
}
function prac(h){
  var m=T.memo, all=vGet(), id=m.ids[m.i], x=all.filter(function(v){return v.id===id})[0];
  if(!x){ m.mode='list'; F.toast(m.ids.length?'أحسنت! انتهت المراجعة':'لا توجد آيات'); memo(h); return; }
  var lvl=m.reveal?0:x.ok;
  h.innerHTML='<div class="u-card"><div class="row-between"><b>'+esc(x.ref)+'</b><span class="u-sub">'+ard(m.i+1)+' / '+ard(m.ids.length)+'</span></div>'+
    '<div class="prac">'+maskHtml(x.text,lvl)+'</div>'+
    '<div class="row-gap"><button type="button" class="u-btn" data-tmemo="reveal">'+(m.reveal?'أخفِ':'أظهر الآية')+'</button></div>'+
    '<div class="row-gap"><button type="button" class="u-btn on" data-tmemo="got">✓ حفظتها</button><button type="button" class="u-btn" data-tmemo="miss">أعدها لاحقًا</button></div>'+
    '<button type="button" class="u-link" data-tmemo="stop">إنهاء المراجعة</button></div>';
}
function addVerseDialog(){
  F.sheet('<h3 class="u-h3">أضف آية للحفظ</h3><input id="avRef" class="u-in" placeholder="المرجع، مثال: يوحنا ٣: ١٦" autocomplete="off"><button type="button" class="u-btn" id="avFetch">جلب النص من الكتاب</button><textarea id="avText" class="u-in" rows="5" placeholder="نص الآية"></textarea><div class="row-gap"><button type="button" class="u-btn on" id="avSave">حفظ</button><button type="button" class="u-btn" data-sheetclose="1">إلغاء</button></div><div class="u-note" id="avMsg"></div>');
  $('avFetch').onclick=function(){
    B.load().then(function(){
      var r=B.parseRef($('avRef').value);
      if(!r){$('avMsg').textContent='تعذّر فهم المرجع. اكتب اسم السفر ثم رقم الإصحاح والآية.';return}
      $('avRef').value=B.label(r.bi,r.ch,r.v1,r.v2);
      $('avText').value=B.verses(r.bi,r.ch,r.v1,r.v2).join(' '); $('avMsg').textContent='';
    },function(){$('avMsg').textContent='تعذّر فتح الكتاب المقدس.'});
  };
  $('avSave').onclick=function(){
    var ref=$('avRef').value.trim(), text=$('avText').value.trim(); if(!ref||!text){$('avMsg').textContent='أدخل المرجع والنص.';return}
    F.closeSheet(); F.addVerse({ref:ref,text:text});
  };
}

/* ---------- أحداث الصفحة ---------- */
document.addEventListener('click',function(e){
  var t=e.target, el;
  if((el=t.closest('[data-sheetclose]'))){F.closeSheet();return}
  var pg=$('page-trk'); if(!pg||!pg.contains(t)) return;
  if((el=t.closest('[data-ttab]'))){T.tab=el.dataset.ttab; if(T.tab==='bible'&&B.state.view==='read'){} paint(); window.scrollTo(0,0); return}
  var key=F.dkey();
  if((el=t.closest('[data-th]'))){var g=el.dataset.th; F.setHour(key,g,!F.hourDone(key,g)); refreshAll(); return}
  if((el=t.closest('[data-tdo]'))){
    var w=el.dataset.tdo;
    if(w==='read'||w==='med'||w==='exam'){ F.setDay(key,function(d){ if(d[w])delete d[w]; else d[w]=1; }); refreshAll(); }
    return;
  }
  if((el=t.closest('[data-dord]'))){
    var dk=el.dataset.dord, dc=dk.indexOf(':'), da=[dc>-1?dk.slice(0,dc):dk, dc>-1?dk.slice(dc+1):''], dd=F.dayOrder(), di=dd.o.indexOf(da[1]);
    if(da[0]==='up'&&di>0){ dd.o.splice(di-1,0,dd.o.splice(di,1)[0]); }
    else if(da[0]==='dn'&&di>-1&&di<dd.o.length-1){ dd.o.splice(di+1,0,dd.o.splice(di,1)[0]); }
    else if(da[0]==='eye'){ var xi=dd.x.indexOf(da[1]); if(xi>-1) dd.x.splice(xi,1); else if(dd.x.length<dd.o.length-1) dd.x.push(da[1]); else F.toast('أبقِ عنصرًا واحدًا على الأقل'); }
    else if(da[0]==='reset'){ dd={o:F.DAYSEQ_DEFAULT.map(function(x){return x[0]}),x:[]}; }
    F.saveDayOrder(dd); refreshAll(); return; }
  if((el=t.closest('[data-trule]'))){var p=F.prefs(),g2=el.dataset.trule,i=p.rule.indexOf(g2); if(i>-1)p.rule.splice(i,1); else p.rule.push(g2); F.savePrefs(p); refreshAll(); return}
  if((el=t.closest('[data-tsum]'))){
    var ym=($('sumM').value||F.dkey().slice(0,7)), s=monthSummary(ym), txt=summaryText(s);
    F.sheet('<h3 class="u-h3">ملخص '+esc(F.MONTHS[+ym.slice(5,7)-1]+' '+ym.slice(0,4))+'</h3><pre class="sum">'+esc(txt)+'</pre><div class="row-gap"><button type="button" class="u-btn" id="smCopy">نسخ</button><button type="button" class="u-btn" id="smDl">تنزيل صفحة</button><button type="button" class="u-btn" data-sheetclose="1">إغلاق</button></div>');
    $('smCopy').onclick=function(){F.copy(txt)};
    $('smDl').onclick=function(){F.download('ملخص-'+ym+'.html','<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><title>ملخص '+ym+'</title><body style="font-family:Tahoma,Arial,sans-serif;max-width:560px;margin:30px auto;line-height:2;padding:0 16px"><pre style="white-space:pre-wrap;font:inherit">'+esc(txt)+'</pre></body></html>','text/html;charset=utf-8')};
    return;
  }
  if((el=t.closest('[data-bmap]'))){ B.open(+el.dataset.bmap,1); T.tab='bible'; paint(); window.scrollTo(0,0); return }
  /* الخطط */
  if((el=t.closest('[data-tmp]'))){ if(!B.data){B.load().then(multiDialog)} else multiDialog(); return }
  if((el=t.closest('[data-tmpdone]'))){ multiDone(el.dataset.tmpdone); return }
  if((el=t.closest('[data-tplan]'))){ if(!B.data){B.load().then(function(){planDialog(el.dataset.tplan)});} else planDialog(el.dataset.tplan); return }
  if((el=t.closest('[data-tpos]'))){ planDialog(null,true); return }
  if((el=t.closest('[data-tpd]'))){T.planDay=+el.dataset.tpd;render();return}
  if((el=t.closest('[data-tgo]'))){var q=el.dataset.tgo.split(':');B.open(+q[0],+q[1]);T.tab='bible';paint();window.scrollTo(0,0);return}
  if((el=t.closest('[data-tpdone]'))){
    var pl=curPlan(),dn=+el.dataset.tpdone,it=planDayItems(pl,dn),was=dayDone(pl,dn);
    it.forEach(function(x){B.setRead(x[0],x[1],!was)}); refreshAll(); return;
  }
  if((el=t.closest('[data-tplanx]'))){var p4=F.prefs();p4.plan=null;F.savePrefs(p4);T.planDay=null;refreshAll();return}
  /* ملاحظات */
  if((el=t.closest('[data-tnote]'))){
    var a=el.dataset.tnote.split(':'), act=a[0], id=a[1], all2=notesGet();
    if(act==='new') F.noteDialog({});
    else if(act==='edit') F.noteDialog({id:id});
    else if(act==='copy'){var n=all2.filter(function(x){return x.id===id})[0]; if(n)F.copy((n.src?n.src+'\n':'')+n.body)}
    else if(act==='del'){
      if(el.dataset.arm){F.jset(NK,all2.filter(function(x){return x.id!==id}));refreshAll();}
      else {el.dataset.arm='1';el.textContent='تأكيد الحذف؟';setTimeout(function(){delete el.dataset.arm;el.textContent='حذف'},3000);}
    }
    else if(act==='export'){F.download('ملاحظاتي.txt',all2.map(function(n){return (n.src||'ملاحظة')+' — '+(n.at||'').slice(0,10)+'\n'+n.body}).join('\n\n———\n\n'))}
    return;
  }
  /* حفظ */
  if((el=t.closest('[data-tmemo]'))){
    var b=el.dataset.tmemo.split(':'), act2=b[0], vid=b[1], m=T.memo, vs=vGet();
    if(act2==='add'){addVerseDialog();return}
    if(act2==='start'){m.mode='prac';m.ids=F.dueVerses().map(function(x){return x.id});m.i=0;m.reveal=false;render();return}
    if(act2==='one'){m.mode='prac';m.ids=[vid];m.i=0;m.reveal=false;render();return}
    if(act2==='copy'){var v=vs.filter(function(x){return x.id===vid})[0];if(v)F.copy('«'+v.text+'»\n('+v.ref+')');return}
    if(act2==='del'){
      if(el.dataset.arm){vSave(vs.filter(function(x){return x.id!==vid}));refreshAll()}
      else {el.dataset.arm='1';el.textContent='تأكيد؟';setTimeout(function(){delete el.dataset.arm;el.textContent='حذف'},3000)}
      return;
    }
    if(act2==='reveal'){m.reveal=!m.reveal;render();return}
    if(act2==='stop'){m.mode='list';m.reveal=false;render();return}
    if(act2==='got'||act2==='miss'){
      var cur=vs.filter(function(x){return x.id===m.ids[m.i]})[0];
      if(cur){ if(act2==='got'){cur.ok=(cur.ok||0)+1;cur.due=F.dkey(F.addDays(new Date(),IV[Math.min(IV.length-1,cur.ok)]))} else {cur.ok=0;cur.due=F.dkey(F.addDays(new Date(),1))} vSave(vs); }
      m.i++; m.reveal=false; render(); if(F.refreshHome)F.refreshHome(); return;
    }
  }
});
document.addEventListener('change',function(e){
  if(e.target.id==='evSel'){var p=F.prefs();p.evening=+e.target.value;F.savePrefs(p);F.toast('تم الحفظ');if(F.refreshHome)F.refreshHome()}
});

/* ---------- الرئيسية: لوحة «يومك» ---------- */
function ring(done,total){
  var r=26,c=2*Math.PI*r,off=c*(1-(total?done/total:0));
  return '<svg class="ring" viewBox="0 0 64 64"><circle cx="32" cy="32" r="'+r+'" class="rg-bg"/><circle cx="32" cy="32" r="'+r+'" class="rg-fg" stroke-dasharray="'+c.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'" transform="rotate(-90 32 32)"/><text x="32" y="37" text-anchor="middle">'+ard(done)+'/'+ard(total)+'</text></svg>';
}
function bibleBlock(){
  var mt=F.multiToday&&F.multiToday(), last=F.jget('rafeeq_blast_v1',null), h='<div class="hb-blk"><div class="hb-t"><b>📖 الكتاب المقدس اليوم</b><button type="button" class="ck-open" data-act="plan">خطتي <i class=chv>‹</i></button></div>';
  if(mt){
    mt.forEach(function(s){
      if(s.finished){ h+='<div class="u-sub">'+esc(s.name)+': أنهيتَ القسم ✓</div>'; return; }
      h+='<div class="hb-sec"><span class="u-sub">'+esc(s.name)+(s.done?' ✓':'')+'</span><div class="hb-ch">'+s.items.map(function(it){var r=B.isRead(it[0],it[1]);return '<button type="button" class="hb-b'+(r?' on':'')+'" data-hbgo="'+it[0]+':'+it[1]+'">'+(r?'✓ ':'')+esc(B.label(it[0],it[1]))+'</button>'}).join('')+'</div></div>';
    });
  } else if(F.prefs().mplan) h+='<div class="u-sub">جارٍ تحميل الكتاب…</div>';
  else h+='<div class="u-sub">لم تضع خطة يومية بعد.</div><div class="hb-ch"><button type="button" class="hb-b" data-act="plan">ابدأ خطة قراءة</button></div>';
  var cont='';
  if(last&&B.data&&B.data[last.b]) cont='<button type="button" class="hb-b" data-hbgo="'+last.b+':'+last.c+'">تابع من '+esc(B.label(last.b,last.c))+'</button>';
  h+='<div class="hb-ch" style="margin-top:6px">'+cont+'<button type="button" class="hb-b" data-act="bible">فتح الكتاب المقدس</button></div></div>';
  return h;
}
F.refreshHome=function(){
  var box=$('hExtra'); if(!box) return;
  var key=F.dkey(), now=new Date(), p=F.prefs(), items=F.todayItems(key), done=items.filter(function(i){return i.done}).length, html='';
  /* لافتات */
  var ban='';
  if(key!==F.realKey()) ban+='<div class="h-banner warn" style="cursor:default"><b>تدوّن الآن ليوم '+esc(F.dayLabel(key))+'</b><span>اليوم الفعلي '+esc(F.dayLabel(F.realKey()))+' <button type="button" class="u-btn sm" data-dayfix="1">انتقل لليوم الفعلي</button> <button type="button" class="u-btn sm" id="hDayB" onclick="__F.dayDialog()">تغيير التاريخ</button></span></div>';
  var conf=F.jget('rafeeq_conf_v1',null);
  if(conf&&conf.next){
    var dl=F.daysBetween(key,conf.next);
    if(dl<=7&&dl>=0) ban+='<button type="button" class="h-banner" data-act="conf"><b>'+(dl===0?'موعد اعترافك اليوم':'اعترافك بعد '+ard(dl)+(dl===1?' يوم':' أيام'))+'</b><span>جهّز ورقة الاعتراف <i class=chv>‹</i></span></button>';
    else if(dl<0) ban+='<button type="button" class="h-banner warn" data-act="conf"><b>تجاوزتَ موعد اعترافك بـ '+ard(-dl)+(-dl===1?' يوم':' أيام')+'</b><span>جهّز ورقتك <i class=chv>‹</i></span></button>';
  }
  if(now.getHours()>=p.evening&&!F.examDone(key)&&!(F.locked&&F.locked())) ban+='<button type="button" class="h-banner" data-act="exam"><b>حان وقت محاسبة المساء</b><span>دقائق قبل النوم <i class=chv>‹</i></span></button>';
  html+=ban;
  /* تقدّم اليوم */
  html+='<div class="u-card day-card"><div class="dc-top">'+ring(done,items.length)+'<div><h3 class="u-h3">يومك</h3><div class="u-sub">'+(done===items.length?'أتممتَ كل ما تقرّر اليوم. المجد لله.':'تبقّى '+ard(items.length-done)+' من '+ard(items.length))+'</div>'+(F.streak()?'<div class="u-pill">متتالية '+ard(F.streak())+(F.streak()===1?' يوم':' أيام')+'</div>':'')+'</div></div><div class="checks">'+
    items.map(function(i){return '<div class="ckrow"><button type="button" class="ck'+(i.done?' on':'')+'" data-hk="'+i.id+'"><span class="bx">'+(i.done?'✓':'')+'</span>'+esc(i.label)+'</button>'+(i.type!=='hour'?'<button type="button" class="ck-open" data-hopen="'+i.id+'">افتح <i class=chv>‹</i></button>':'')+'</div>'}).join('')+'</div>'+bibleBlock()+'</div>';
  if(!B.data&&!B.loading&&p.mplan) B.load().then(function(){F.refreshHome()},function(){});
  /* شريط الأسبوع */
  var sun=F.addDays(now,-now.getDay()), wk='';
  for(var d=0;d<7;d++){var dt=F.addDays(sun,d),k=F.dkey(dt),n=dt>now?-1:F.dayScore(k);wk+='<div class="wd'+(k===key?' today':'')+'"><span>'+F.WD[d].slice(0,3)+'</span><i class="hm '+(n<0?'future':sc(n))+'"></i></div>'}
  html+='<div class="u-card"><div class="week">'+wk+'</div></div>';
  html+='<button type="button" class="u-card talk-card" data-act="talk"><div class="u-sub">صوت الله</div><div class="vt">اكتب ما تشعر به الآن، فيأتيك الجواب من كلمته</div></button>';
  /* التقويم القبطي: الموسم/العيد/الصوم */
  try{ var CC=window.__copCal; if(CC){ var cl=CC.label(now), cd=CC.coptic(now); html+='<button type="button" class="u-card cal-day" data-act="cal"><div class="u-sub">'+cd.d+' '+CC.CM[cd.m-1]+' '+cd.y+' — التقويم القبطي</div><div class="vt">'+esc(cl.text||'يوم عادي من السنة القبطية')+'</div></button>'; } }catch(e){}
  /* آية اليوم */
  var vt=document.querySelector('#view-meditation .verse-text'), vr=document.querySelector('#view-meditation .verse-ref');
  if(vt&&vt.textContent.trim()) html+='<div class="u-card votd"><div class="u-sub">آية اليوم</div><div class="vt">'+esc(vt.textContent.trim())+'</div><div class="u-sub">'+esc(vr?vr.textContent.trim():'')+'</div></div>';
  try{ var fx=window.__fatherOfDay&&window.__fatherOfDay(now); if(fx) html+='<button type="button" class="u-card votd fat-day" data-act="fat"><div class="u-sub">قول اليوم من الآباء</div><div class="vt">«'+esc(fx.t)+'»</div><div class="u-sub">'+esc(fx.f)+' — '+esc(window.__fathers.cite(fx))+'</div></button>'; }catch(er){}
  /* خطة اليوم + حفظ */
  var tp=F.todayPlan&&F.todayPlan();
  if(tp) html+='<button type="button" class="h-row" data-act="plan"><span class="tx"><b>خطة القراءة — اليوم '+ard(tp.day)+(tp.done?' ✓':'')+'</b><span>'+esc(tp.label)+'</span></span><span class="ar"><i class=chv>‹</i></span></button>';
  var dv=F.dueVerses?F.dueVerses().length:0;
  if(dv) html+='<button type="button" class="h-row" data-act="memo"><span class="tx"><b>آيات للمراجعة</b><span>'+ard(dv)+(dv===1?' آية مستحقة':' آيات مستحقة')+' اليوم</span></span><span class="ar"><i class=chv>‹</i></span></button>';
  box.innerHTML=html;
};

/* ---------- تاريخ التدوين (يدوي) ---------- */
function dlong(k){ try{return F.parseKey(k).toLocaleDateString('ar-EG',{weekday:'long',day:'numeric',month:'long'})}catch(e){return k} }
function dshort(k){ try{return F.parseKey(k).toLocaleDateString('ar-EG',{day:'numeric',month:'short'})}catch(e){return k} }
F.dayLabel=dlong;
F.paintDay=function(){
  var b=$('uDay'); if(!b) return; var k=F.dkey(), real=F.realKey(), off=k!==real;
  b.className='dchip'+(off?' off':''); b.innerHTML='<span class="dc-i">📅</span><span class="dc-t">'+esc(dshort(k))+'</span>';
  b.title='تاريخ التدوين: '+dlong(k)+(off?' (ليس اليوم الفعلي)':'');
};
function dayDialog(){
  var k=F.dkey(), real=F.realKey(), auto=F.entryAuto();
  var h='<h3 class="u-h3">تاريخ التدوين</h3><div class="u-note">كل ما تعلّمه (صلوات، قراءات، إصحاحات، محاسبة) يُسجَّل في هذا التاريخ. لا يتغيّر وحده عند منتصف الليل — أنت تحدده.</div>'+
    '<div class="rd-head"><button type="button" data-dd="-1" aria-label="اليوم السابق"><i class=chv>›</i></button><span class="rd-title" id="ddLbl" style="cursor:default">'+esc(dlong(k))+'</span><button type="button" data-dd="1" aria-label="اليوم التالي"><i class=chv>‹</i></button></div>'+
    '<input type="date" id="ddIn" class="u-in" value="'+k+'" max="'+F.dkey(F.addDays(new Date(),1))+'">'+
    '<div class="u-sub" id="ddInfo"></div>'+
    '<div class="row-gap"><button type="button" class="u-btn on" id="ddReal">انتقل إلى اليوم الفعلي ('+esc(dshort(real))+')</button></div>'+
    '<label class="u-sub" style="display:flex;gap:8px;align-items:center;margin-top:12px"><input type="checkbox" id="ddAuto"'+(auto?' checked':'')+'> اجعل التاريخ يتبع اليوم الفعلي تلقائيًا (غير مُوصى به إن كنتَ تقرأ بعد منتصف الليل)</label>'+
    '<div class="row-gap"><button type="button" class="u-btn" data-sheetclose="1">تم</button></div>';
  F.sheet(h);
  function info(){ var kk=F.dkey(), d=F.daysBetween(kk,real); $('ddLbl').textContent=dlong(kk); $('ddIn').value=kk;
    $('ddInfo').textContent= d===0?'هذا هو اليوم الفعلي.': d>0?'أنت تدوّن لتاريخ سابق بـ '+ard(d)+(d===1?' يوم':' أيام')+'.':'أنت تدوّن لتاريخ لاحق بـ '+ard(-d)+(-d===1?' يوم':' أيام')+'.'; }
  function go(nk){ F.setEntry(nk,false); $('ddAuto').checked=false; info(); }
  info();
  document.querySelectorAll('[data-dd]').forEach(function(bt){ bt.onclick=function(){ go(F.dkey(F.addDays(F.parseKey(F.dkey()),+bt.dataset.dd))) } });
  $('ddIn').onchange=function(){ if(this.value) go(this.value) };
  $('ddReal').onclick=function(){ go(real) };
  $('ddAuto').onchange=function(){ if(this.checked){ F.setEntry(null,true) } else { F.setEntry(F.realKey(),false) } info(); };
}
F.dayDialog=dayDialog;
document.addEventListener('click',function(e){ if(e.target.closest('#uDay')) dayDialog(); if(e.target.closest('[data-dayfix]')){ F.setEntry(F.realKey(),false) } });
F.paintDay();
document.addEventListener('click',function(e){
  var hb=e.target.closest('[data-hbgo]');
  if(hb){ var q=hb.dataset.hbgo.split(':'); F.openBible(+q[0],+q[1]); return; }
  var o=e.target.closest('[data-hopen]');
  if(o){ var id=o.dataset.hopen; window.__rafeeq.act(id==='med'?'meditation':id); return; }
  var el=e.target.closest('[data-hk]'); if(!el) return;
  var id2=el.dataset.hk, key=F.dkey();
  if(id2.indexOf('h:')===0){var g=id2.slice(2);F.setHour(key,g,!F.hourDone(key,g));}
  else { F.setDay(key,function(d){ if(d[id2])delete d[id2]; else d[id2]=1; }); }
  F.refreshHome(); if(trkOn())render();
});
})();

