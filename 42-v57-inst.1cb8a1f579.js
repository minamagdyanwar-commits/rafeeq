
/* ===== تثبيت التطبيق: زر + تشخيص ===== */
(function(){
function $(i){return document.getElementById(i)}
function ok(b){return b?'✅':'❌'}
function build(){
  var panel=$('settingsPanel'); if(!panel||$('v57Inst')) return false;
  var sec=document.createElement('div'); sec.className='settings-section'; sec.id='v57Inst';
  sec.innerHTML='<div class="settings-label">تثبيت التطبيق على الهاتف</div><div id="v57Body" class="u-sub">جارٍ الفحص…</div><div class="settings-moderow"><button class="settings-mbtn" id="v57Btn" type="button" style="display:none">📲 تثبيت الآن</button><button class="settings-mbtn" id="v57Re" type="button">🔄 إعادة الفحص</button></div>';
  var anchor=$('v14Feat'); if(anchor&&anchor.parentNode===panel) panel.insertBefore(sec,anchor); else panel.appendChild(sec);
  $('v57Btn').onclick=function(){ var e=window.__bip; if(!e) return; e.prompt(); e.userChoice.then(function(){window.__bip=null;check()},function(){}); };
  $('v57Re').onclick=check;
  check(); return true;
}
function check(){
  var body=$('v57Body'); if(!body) return;
  var secure=location.protocol==='https:'||location.hostname==='localhost';
  var standalone=(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;
  var link=document.querySelector('link[rel="manifest"]');
  var rows=[];
  function paint(man,sw){
    var ready=secure&&man&&sw;
    var h='<div>'+ok(secure)+' اتصال آمن (https)</div><div>'+ok(!!link)+' رابط ملف التثبيت في الصفحة</div><div>'+ok(man)+' ملف التثبيت (manifest) يُفتح</div><div>'+ok(sw)+' العمل بدون إنترنت (service worker)</div>';
    if(standalone) h+='<p>✅ التطبيق مفتوح الآن كتطبيق مثبّت.</p>';
    else if(window.__bip) h+='<p>جاهز للتثبيت: اضغط الزر أدناه.</p>';
    else if(ready) h+='<p>كل الشروط سليمة. إن لم يُعرض زر التثبيت فغالبًا هو مثبّت بالفعل (ابحث عن أيقونته في شاشة الهاتف)، أو افتح قائمة المتصفح ⋮ ثم اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية». وقد يتأخر Chrome قليلًا؛ أغلق الصفحة وافتحها مرة أخرى.</p>';
    else h+='<p>هناك شرط ناقص (❌). المطلوب أن يكون كل ملف الحزمة (index.html وmanifest.webmanifest وsw.js والأيقونات) مرفوعًا في نفس المجلد على رابط https، ثم افتح الصفحة وحدّثها مرتين.</p>';
    body.innerHTML=h; var b=$('v57Btn'); if(b) b.style.display=(window.__bip&&!standalone)?'':'none';
  }
  var man=false,sw=false,done=0;
  function fin(){ if(++done===2) paint(man,sw) }
  if(link){ fetch(link.href,{cache:'no-cache'}).then(function(r){man=r.ok}).catch(function(){}).then(fin) } else fin();
  if('serviceWorker' in navigator){ navigator.serviceWorker.getRegistration().then(function(r){sw=!!r}).catch(function(){}).then(fin) } else fin();
}
window.__v57check=check;
window.addEventListener('appinstalled',function(){window.__bip=null;check()});
window.addEventListener('beforeinstallprompt',function(){ setTimeout(check,50) });
var n=0,iv=setInterval(function(){ if(build()||++n>60) clearInterval(iv) },500);
document.addEventListener('click',function(e){ if(e.target.closest&&e.target.closest('#uGear')) setTimeout(check,300) });
})();

