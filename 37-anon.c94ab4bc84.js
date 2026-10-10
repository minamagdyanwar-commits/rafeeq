
/* ===================== الاعتراف + الخصوصية (رمز القفل، مسح، نسخة مشفّرة) ===================== */
(function(){
'use strict';
var F=window.__F,$=F.$,esc=F.esc,ard=F.ard;
var CK='rafeeq_conf_v1', LKEY='rafeeq_lock_v1';

/* ---------- تبويب «ورقة الاعتراف» داخل المحاسبة ---------- */
var top=document.querySelector('#mod-m .top > div'), vh=$('viewHist');
if(!top||!vh) return;
var tab=document.createElement('button'); tab.className='pill'; tab.id='tabConf'; tab.type='button'; tab.textContent='📜 ورقة الاعتراف';
top.appendChild(tab);
var vc=document.createElement('div'); vc.id='viewConf'; vc.className='hidden'; vh.parentNode.insertBefore(vc,vh.nextSibling);
function others(){ ['tabToday','tabHist'].forEach(function(id){var b=$(id);if(b)b.classList.remove('on')}); }
tab.addEventListener('click',function(){
  $('viewToday').classList.add('hidden'); vh.classList.add('hidden'); vc.classList.remove('hidden');
  others(); tab.classList.add('on'); renderConf();
});
['tabToday','tabHist'].forEach(function(id){ var b=$(id); if(b) b.addEventListener('click',function(){ vc.classList.add('hidden'); tab.classList.remove('on'); }); });

var C={range:'auto'};
function cstate(){return F.jget(CK,{})||{}}
function csave(s){F.jset(CK,s)}
function store(){return window.__m&&window.__m.getStore?window.__m.getStore():{days:{}}}
function fromKey(cs){
  var today=F.realKey();
  if(C.range==='auto') return cs.last?cs.last:F.dkey(F.addDays(new Date(),-30));
  return F.dkey(F.addDays(new Date(),-(+C.range)));
}
function collect(from,to){
  var st=store(), CATS=(window.__m&&window.__m.CATS)||[], out=[], oth=[];
  var days=Object.keys(st.days||{}).filter(function(k){return k>=from&&k<=to}).sort();
  CATS.forEach(function(c){
    var items=[];
    c.sins.forEach(function(s,i){
      var ds=[],notes=[];
      days.forEach(function(k){var d=st.days[k]; if(d&&d[c.id+i]){ds.push(k); var n=((d._notes||{})[c.id+i]||'').trim(); if(n)notes.push({d:k,t:n});}});
      if(ds.length) items.push({sin:s[0],days:ds,notes:notes});
    });
    if(items.length) out.push({cat:c.name,ico:c.ico,items:items});
  });
  days.forEach(function(k){var t=((st.days[k]||{})._other||'').trim(); if(t) oth.push({d:k,t:t});});
  return {cats:out,other:oth,ndays:days.length};
}
function paperText(r,from,to){
  var L=['ورقة الاعتراف — من '+from+' إلى '+to,'(للتحضير فقط، وتُقدَّم لأب الاعتراف)',''];
  r.cats.forEach(function(c){
    L.push(c.ico+' '+c.cat);
    c.items.forEach(function(i){
      L.push('  • '+i.sin+' — '+i.days.length+(i.days.length===1?' مرة':' مرات')+' (آخرها '+i.days[i.days.length-1]+')');
      i.notes.forEach(function(n){L.push('      ↳ ['+n.d+'] '+n.t.replace(/\n/g,' '))});
    });
    L.push('');
  });
  if(r.other.length){L.push('✍️ خطايا أخرى كتبتُها');r.other.forEach(function(o){L.push('  ['+o.d+'] '+o.t.replace(/\n/g,' '))});L.push('')}
  if(!r.cats.length&&!r.other.length) L.push('لا توجد بنود مسجّلة في هذه الفترة.');
  return L.join('\n');
}
function fd(k){ try{return F.parseKey(k).toLocaleDateString('ar-EG',{day:'numeric',month:'long'})}catch(e){return k} }
function fdy(k){ try{return F.parseKey(k).toLocaleDateString('ar-EG',{day:'numeric',month:'long',year:'numeric'})}catch(e){return k} }
function times(n){return n===1?'مرة واحدة':(n===2?'مرتان':ard(n)+(n<11?' مرات':' مرة'))}
function renderConf(){
  var cs=cstate(), today=F.realKey(), from=fromKey(cs), r=collect(from,today), flat=[], total=0;
  r.cats.forEach(function(c){c.items.forEach(function(i){flat.push({sin:i.sin,cat:c.cat,n:i.days.length}); total++})});
  flat.sort(function(a,b){return b.n-a.n});
  var mx=flat.length?flat[0].n:1;
  var dl=cs.next?F.daysBetween(today,cs.next):null;
  var stTxt,stCls='';
  if(dl==null){stTxt='لم تحدّد الموعد القادم';stCls='idle'}
  else if(dl===2){stTxt='بعد يومين'}
  else if(dl>2){stTxt='بعد '+ard(dl)+(dl<=10?' أيام':' يومًا')}
  else if(dl===1){stTxt='غدًا'}
  else if(dl===0){stTxt='اليوم';stCls='now'}
  else {stTxt='تأخّر '+ard(-dl)+(-dl===1?' يوم':' أيام');stCls='late'}
  var h='<div class="cf-intro"><h2>📜 ورقة الاعتراف</h2><p>تجمع ما سجّلتَه في المحاسبة لتحمله إلى أب اعترافك.</p></div>';
  /* 1) الموعد */
  h+='<section class="u-card cf-card"><h3 class="cf-h">📅 موعد الاعتراف</h3>'+
    '<div class="cf-status '+stCls+'"><b>'+stTxt+'</b><span>'+(cs.next?esc(fdy(cs.next)):'')+'</span></div>'+
    '<div class="cf-sub">'+(cs.last?'آخر اعتراف: '+esc(fdy(cs.last)):'لم تسجّل اعترافًا بعد')+'</div>'+
    '<div class="cf-grid"><label class="cf-f"><span>الموعد القادم</span><input type="date" id="cfNext" class="u-in" value="'+esc(cs.next||'')+'"></label>'+
    '<label class="cf-f"><span>التكرار</span><select id="cfPer" class="u-in">'+[7,14,21,30,45,60].map(function(x){return '<option value="'+x+'"'+((cs.period||30)===x?' selected':'')+'>كل '+ard(x)+' يومًا</option>'}).join('')+'</select></label></div>'+
    '<div class="cf-acts"><button type="button" class="u-btn" id="cfSave">حفظ الموعد</button><button type="button" class="u-btn on" id="cfDone">اعترفتُ اليوم ✓</button></div>'+
    '<div class="cf-hint">«اعترفتُ اليوم» تبدأ فترة جديدة وتحسب الموعد القادم تلقائيًا.</div></section>';
  /* 2) الملخص */
  h+='<section class="u-card cf-card"><h3 class="cf-h">📋 ما أحمله إلى أب الاعتراف</h3>'+
    '<label class="cf-f cf-range"><span>الفترة</span><select id="cfRange" class="u-in">'+
    '<option value="auto"'+(C.range==='auto'?' selected':'')+'>'+(cs.last?'منذ آخر اعتراف':'آخر ٣٠ يومًا')+'</option>'+[7,14,30,60,90,180].map(function(x){return '<option value="'+x+'"'+(String(C.range)===String(x)?' selected':'')+'>آخر '+ard(x)+' يومًا</option>'}).join('')+'</select></label>'+
    '<div class="cf-range-t">من '+esc(fd(from))+' إلى '+esc(fd(today))+'</div>'+
    '<div class="cf-stats"><div><b>'+ard(total)+'</b><span>بند</span></div><div><b>'+ard(r.ndays)+'</b><span>يوم مسجّل</span></div><div><b>'+ard(r.other.length)+'</b><span>مكتوب بيدك</span></div></div>';
  if(!r.cats.length&&!r.other.length){
    h+='<div class="cf-empty">لا توجد بنود مسجّلة في هذه الفترة. سجّل محاسبتك اليومية وستظهر هنا.</div>';
  } else {
    if(flat.length){
      h+='<h4 class="cf-h2">الأكثر تكرارًا</h4><ul class="cf-bars">'+flat.slice(0,6).map(function(x){return '<li><div class="cf-bl"><span>'+esc(x.sin)+'</span><b>'+ard(x.n)+'×</b></div><i style="width:'+Math.max(8,Math.round(x.n/mx*100))+'%"></i></li>'}).join('')+'</ul>';
    }
    h+='<h4 class="cf-h2">التفصيل حسب المجال</h4>';
    r.cats.forEach(function(c){
      h+='<details class="cf-cat"><summary><span>'+esc(c.ico)+' '+esc(c.cat)+'</span><em>'+ard(c.items.length)+'</em></summary><ul>'+c.items.map(function(i){
        return '<li><div class="cf-il"><span>'+esc(i.sin)+'</span><b>'+times(i.days.length)+'</b></div><div class="cf-last">آخرها '+esc(fd(i.days[i.days.length-1]))+'</div>'+
          i.notes.map(function(n){return '<div class="cf-note"><span>'+esc(fd(n.d))+'</span> '+esc(n.t)+'</div>'}).join('')+'</li>'}).join('')+'</ul></details>';
    });
    if(r.other.length) h+='<details class="cf-cat"><summary><span>✍️ خطايا أخرى كتبتُها</span><em>'+ard(r.other.length)+'</em></summary><ul>'+r.other.map(function(o){return '<li><div class="cf-note"><span>'+esc(fd(o.d))+'</span> '+esc(o.t)+'</div></li>'}).join('')+'</ul></details>';
  }
  h+='<details class="cf-cat cf-raw"><summary><span>عرض النص الكامل</span></summary><pre id="cfPaper">'+esc(paperText(r,from,today))+'</pre></details>'+
    '<div class="cf-acts three"><button type="button" class="u-btn" id="cfCopy">نسخ</button><button type="button" class="u-btn" id="cfDl">تنزيل</button><button type="button" class="u-btn" id="cfPrint">طباعة</button></div>'+
    '<p class="cf-foot">للمساعدة على التذكّر فقط؛ لا تغني عن سر الاعتراف ولا عن الحل الكهنوتي. تُحفظ على جهازك فقط.</p></section>';
  vc.innerHTML=h;
  $('cfRange').onchange=function(){C.range=this.value;renderConf()};
  $('cfSave').onclick=function(){var s=cstate();s.next=$('cfNext').value||null;s.period=+$('cfPer').value;csave(s);F.toast('تم حفظ الموعد');renderConf();if(F.refreshHome)F.refreshHome()};
  $('cfDone').onclick=function(){var s=cstate();s.last=today;s.period=+$('cfPer').value||30;s.next=F.dkey(F.addDays(new Date(),s.period));csave(s);C.range='auto';F.toast('بُورِكتَ. بدأت فترة جديدة');renderConf();if(F.refreshHome)F.refreshHome()};
  var txt=paperText(r,from,today);
  $('cfCopy').onclick=function(){F.copy(txt)};
  $('cfDl').onclick=function(){F.download('ورقة-الاعتراف-'+today+'.txt',txt)};
  $('cfPrint').onclick=function(){
    var w=window.open('','_blank'); if(!w){F.toast('اسمح بالنوافذ المنبثقة للطباعة');return}
    w.document.write('<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><title>ورقة الاعتراف</title><body style="font-family:Tahoma,Arial,sans-serif;line-height:2;padding:20px"><pre style="white-space:pre-wrap;font:inherit">'+esc(txt)+'</pre></body></html>'); w.document.close(); w.focus(); w.print();
  };
}
F.confState=cstate;

/* ---------- القفل برمز ---------- */
var L={open:false};
function enc(s){return new TextEncoder().encode(s)}
function hex(b){return Array.prototype.map.call(new Uint8Array(b),function(x){return ('0'+x.toString(16)).slice(-2)}).join('')}
function fb(s){var h1=0xdeadbeef,h2=0x41c6ce57;for(var i=0;i<s.length;i++){var c=s.charCodeAt(i);h1=Math.imul(h1^c,2654435761);h2=Math.imul(h2^c,1597334677)}h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);return (4294967296*(2097151&h2)+(h1>>>0)).toString(16)}
function sha(s){
  if(window.crypto&&crypto.subtle) return crypto.subtle.digest('SHA-256',enc(s)).then(hex).catch(function(){return fb(s)});
  return Promise.resolve(fb(s));
}
function lock(){return F.jget(LKEY,null)}
F.locked=function(){var l=lock();return !!(l&&l.hash)&&!L.open};
function showLock(){
  var ov=$('uLock'); if(!ov) return;
  var on=F.locked()&&$('page-exam').classList.contains('on');
  ov.hidden=!on; if(on){ $('uPin').value=''; $('uPinMsg').textContent=''; setTimeout(function(){$('uPin').focus()},50); }
}
F.applyLock=showLock;
F.relock=function(){ if(L.open){L.open=false;} showLock(); if(F.refreshHome) F.refreshHome(); };
F.afterShow=function(name,prev){
  if(prev==='exam'&&name!=='exam'){ L.open=false; }
  showLock();
};
document.addEventListener('visibilitychange',function(){ if(document.hidden&&lock()&&lock().hash){L.open=false; showLock();} });
function tryPin(){
  var l=lock(); if(!l) return; var v=$('uPin').value;
  sha(l.salt+':'+v).then(function(h){
    if(h===l.hash){L.open=true;showLock();if(F.refreshHome)F.refreshHome()}
    else{$('uPinMsg').textContent='الرمز غير صحيح.';$('uPin').value=''}
  });
}
if($('uPinGo')){
  $('uPinGo').onclick=tryPin;
  $('uPin').addEventListener('keydown',function(e){if(e.key==='Enter')tryPin()});
  $('uPinForgot').onclick=function(){
    F.sheet('<h3 class="u-h3">نسيتُ الرمز</h3><p class="u-note">لحماية خصوصيتك لا يمكن استرجاع الرمز. الحل الوحيد هو <b>مسح بيانات المحاسبة</b> (البنود والملاحظات والسجل) وإزالة القفل. باقي بياناتك (الصلاة والقراءة والملاحظات والحفظ) لا تتأثر.</p><div class="row-gap"><button type="button" class="u-btn danger" id="pfGo">امسح وأزل القفل</button><button type="button" class="u-btn" data-sheetclose="1">إلغاء</button></div>');
    $('pfGo').onclick=function(){ wipeExam(true); };
  };
}
function wipeExam(removeLock){
  try{localStorage.removeItem('mohasba_v1');localStorage.removeItem(CK)}catch(e){}
  if(removeLock){try{localStorage.removeItem(LKEY)}catch(e){}}
  F.closeSheet(); F.toast('تم مسح بيانات المحاسبة'); setTimeout(function(){location.reload()},700);
}
function pinDialog(change){
  var has=!!lock();
  F.sheet('<h3 class="u-h3">'+(has?'تغيير الرمز':'تعيين رمز قفل')+'</h3><p class="u-note">يحمي صفحة «محاسبة النفس» فقط. الرمز مخزّن على جهازك بصيغة مجزّأة (hash) ولا يُرسَل لأي مكان.</p>'+
    (has?'<input id="pnOld" class="u-in" type="password" inputmode="numeric" placeholder="الرمز الحالي" autocomplete="off">':'')+
    '<input id="pnNew" class="u-in" type="password" inputmode="numeric" placeholder="رمز جديد (٤ أرقام فأكثر)" autocomplete="off"><input id="pnNew2" class="u-in" type="password" inputmode="numeric" placeholder="أعد كتابة الرمز" autocomplete="off"><div class="u-note" id="pnMsg"></div><div class="row-gap"><button type="button" class="u-btn on" id="pnSave">حفظ</button><button type="button" class="u-btn" data-sheetclose="1">إلغاء</button></div>');
  $('pnSave').onclick=function(){
    var n=$('pnNew').value, n2=$('pnNew2').value, msg=$('pnMsg');
    if(n.length<4){msg.textContent='الرمز لا يقل عن ٤ خانات.';return}
    if(n!==n2){msg.textContent='الرمزان غير متطابقين.';return}
    function setNew(){
      var salt=Math.random().toString(36).slice(2)+Date.now().toString(36);
      sha(salt+':'+n).then(function(h){F.jset(LKEY,{salt:salt,hash:h});L.open=true;F.closeSheet();F.toast('تم تفعيل القفل');syncPriv();showLock()});
    }
    if(has){var l=lock();sha(l.salt+':'+$('pnOld').value).then(function(h){if(h!==l.hash){msg.textContent='الرمز الحالي غير صحيح.';return}setNew()})}
    else setNew();
  };
}
function syncPriv(){
  var has=!!lock(), a=$('uLockSet'), b=$('uLockOff'); if(!a) return;
  a.textContent=has?'تغيير الرمز':'تعيين رمز'; b.style.display=has?'':'none';
  $('uPrivMsg').textContent=has?'القفل مفعّل على صفحة المحاسبة.':'';
}
function bindPriv(){
  if(!$('uLockSet')) return;
  $('uLockSet').onclick=function(){ if(lock()&&!L.open){F.toast('افتح صفحة المحاسبة أولًا لتغيير الرمز');return} pinDialog(); };
  $('uLockOff').onclick=function(){
    var l=lock(); if(!l) return;
    F.sheet('<h3 class="u-h3">إزالة القفل</h3><input id="rmPin" class="u-in" type="password" inputmode="numeric" placeholder="الرمز الحالي" autocomplete="off"><div class="u-note" id="rmMsg"></div><div class="row-gap"><button type="button" class="u-btn on" id="rmGo">إزالة</button><button type="button" class="u-btn" data-sheetclose="1">إلغاء</button></div>');
    $('rmGo').onclick=function(){sha(l.salt+':'+$('rmPin').value).then(function(h){if(h!==l.hash){$('rmMsg').textContent='الرمز غير صحيح.';return}try{localStorage.removeItem(LKEY)}catch(e){}L.open=false;F.closeSheet();F.toast('أُزيل القفل');syncPriv();showLock();if(F.refreshHome)F.refreshHome()})};
  };
  $('uWipe').onclick=function(){
    F.sheet('<h3 class="u-h3">مسح بيانات المحاسبة</h3><p class="u-note">سيُحذف كل ما سجلته في «محاسبة النفس» (البنود، الملاحظات، السجل) وموعد الاعتراف، ولا يمكن التراجع. يُنصح بحفظ نسخة قبل ذلك.</p><div class="row-gap"><button type="button" class="u-btn danger" id="wpGo">امسح نهائيًا</button><button type="button" class="u-btn" data-sheetclose="1">إلغاء</button></div>');
    $('wpGo').onclick=function(){wipeExam(false)};
  };
  syncPriv();
}
bindPriv();

/* ---------- نسخة احتياطية مشفّرة ---------- */
var PRE=['khalwa_','dr_','mohasba_','rafeeq_'];
function mine(k){return PRE.some(function(p){return k.indexOf(p)===0})}
function b64(buf){var s='',u=new Uint8Array(buf);for(var i=0;i<u.length;i++)s+=String.fromCharCode(u[i]);return btoa(s)}
function ub64(s){var b=atob(s),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
function keyFrom(pw,salt){
  return crypto.subtle.importKey('raw',enc(pw),'PBKDF2',false,['deriveKey']).then(function(k){
    return crypto.subtle.deriveKey({name:'PBKDF2',salt:salt,iterations:150000,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
  });
}
function pwDialog(title,go){
  F.sheet('<h3 class="u-h3">'+title+'</h3><input id="pwIn" class="u-in" type="password" placeholder="كلمة سر النسخة" autocomplete="off"><div class="u-note" id="pwMsg"></div><div class="row-gap"><button type="button" class="u-btn on" id="pwGo">متابعة</button><button type="button" class="u-btn" data-sheetclose="1">إلغاء</button></div>');
  $('pwGo').onclick=function(){var v=$('pwIn').value;if(v.length<4){$('pwMsg').textContent='٤ خانات على الأقل.';return}go(v,$('pwMsg'))};
}
if($('uEncExp')){
  $('uEncExp').onclick=function(){
    if(!(window.crypto&&crypto.subtle)){F.toast('التشفير غير مدعوم في هذا المتصفح/السياق');return}
    pwDialog('نسخة مشفّرة',function(pw,msg){
      var d={}; for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(mine(k)&&k!==LKEY)d[k]=localStorage.getItem(k)}
      var salt=crypto.getRandomValues(new Uint8Array(16)), iv=crypto.getRandomValues(new Uint8Array(12));
      keyFrom(pw,salt).then(function(key){return crypto.subtle.encrypt({name:'AES-GCM',iv:iv},key,enc(JSON.stringify(d)))}).then(function(ct){
        F.download('rafeeq-encrypted-'+F.realKey()+'.json',JSON.stringify({_app:'rafeeq-ruhi',_enc:1,salt:b64(salt),iv:b64(iv),data:b64(ct)}),'application/json');
        F.closeSheet();F.toast('تم حفظ النسخة المشفّرة');
      }).catch(function(){msg.textContent='تعذّر التشفير.'});
    });
  };
  $('uEncImp').onclick=function(){$('uEncFile').click()};
  $('uEncFile').onchange=function(){
    var f=this.files[0],inp=this; if(!f) return;
    var rd=new FileReader(); rd.onload=function(){
      var j; try{j=JSON.parse(rd.result);if(j._app!=='rafeeq-ruhi'||!j._enc)throw 0}catch(e){F.toast('الملف غير صالح');return}
      pwDialog('استعادة نسخة مشفّرة',function(pw,msg){
        keyFrom(pw,ub64(j.salt)).then(function(key){return crypto.subtle.decrypt({name:'AES-GCM',iv:ub64(j.iv)},key,ub64(j.data))}).then(function(pt){
          var d=JSON.parse(new TextDecoder().decode(pt)),n=0;
          Object.keys(d).forEach(function(k){if(mine(k)&&k!==LKEY){localStorage.setItem(k,d[k]);n++}});
          F.closeSheet();F.toast('تمت استعادة '+n+' عنصرًا');setTimeout(function(){location.reload()},800);
        }).catch(function(){msg.textContent='كلمة السر غير صحيحة أو الملف تالف.'});
      });
    }; rd.readAsText(f); inp.value='';
  };
}
})();

