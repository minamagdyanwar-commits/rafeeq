/* v6.10 — أدوات «صوت الله»: صيغة المخاطبة (مذكر/مؤنث) · إدخال صوتي · حفظ المحادثات · الردود المفضلة · تذكير لطيف.
   كل شيء على جهازك فقط. */
(function(){
"use strict";
var HK='rafeeq_talk_v1',AK='rafeeq_talk_archive_v1',FK='rafeeq_talk_favs_v1',RK='rafeeq_talk_remind_v1',GK='rafeeq_talk_gender';
function F(){return window.__F||{}}
function q(s,r){return (r||document).querySelector(s)}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function jget(k,d){try{var v=JSON.parse(localStorage.getItem(k)||'null');return v==null?d:v}catch(e){return d}}
function jset(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
var AR='٠١٢٣٤٥٦٧٨٩';function ar(n){return String(n).replace(/\d/g,function(d){return AR[d]})}
function toast(m){var f=F();f.toast?f.toast(m):0}
function V(){return window.__talkVoice||{}}
function hist(){var h=jget(HK,[]);return Array.isArray(h)?h:[]}
function fmtDate(ts){try{return new Date(ts).toLocaleDateString('ar-EG',{day:'numeric',month:'long',hour:'numeric',minute:'2-digit'})}catch(e){return ''}}
/* ---------- عرض رد أو محادثة كنص ---------- */
function verseHtml(raw){var b=F().bible;try{var ref=String(raw).replace(/\*$/,''),p=b.parseRef(ref);if(!p)return '';
  return '<div class="tkx-v"><p>'+esc(b.verses(p.bi,p.ch,p.v1,p.v2).join(' '))+'</p><b>'+esc(b.label(p.bi,p.ch,p.v1,p.v2))+'</b></div>'}catch(e){return ''}}
function entryHtml(en){var h='<div class="tkx-me">'+esc(en.t)+'</div>',s=en.say||{},L=(s.list&&s.list.length?s.list:(s.a?[s.a]:[]));
  L.forEach(function(x){h+='<div class="tkx-say">'+esc(x)+'</div>'});
  (en.refs||[]).forEach(function(r){h+=verseHtml(r[0])});
  if(s.c)h+='<div class="tkx-say">'+esc(s.c)+'</div>';
  return h}
function entryText(en){var s=en.say||{},L=(s.list&&s.list.length?s.list:(s.a?[s.a]:[])),t=[en.t].concat(L);(en.refs||[]).forEach(function(r){var b=F().bible;try{var p=b.parseRef(String(r[0]).replace(/\*$/,''));t.push('«'+b.verses(p.bi,p.ch,p.v1,p.v2).join(' ')+'» — '+b.label(p.bi,p.ch,p.v1,p.v2))}catch(e){}});if(s.c)t.push(s.c);return t.join('\n')}
/* ---------- لوحة أدوات الصفحة ---------- */
function decorate(){
  var body=document.getElementById('talkBody');if(!body)return;
  var intro=q('.tk-intro',body);
  if(intro&&!q('.tkx-bar',body)){
    var g=V().gnd?V().gnd():'m',bar=document.createElement('div');bar.className='tkx-bar';
    bar.innerHTML='<div class="tkx-g" role="group" aria-label="صيغة المخاطبة"><span>خاطبني بصيغة:</span><button type="button" data-tkxg="m" class="'+(g==='m'?'on':'')+'" aria-pressed="'+(g==='m')+'">مذكر</button><button type="button" data-tkxg="f" class="'+(g==='f'?'on':'')+'" aria-pressed="'+(g==='f')+'">مؤنث</button></div>'+
      '<div class="tkx-t"><button type="button" data-tkxa="saved">💾 محادثاتي</button><button type="button" data-tkxa="favs">⭐ ردودي</button><button type="button" data-tkxa="remind">🔔 تذكير</button></div>';
    intro.insertAdjacentElement('afterend',bar)}
  /* زر الميكروفون */
  var send=q('#tkSend',body);
  if(send&&!q('#tkxMic',body)){var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(SR){var m=document.createElement('button');m.type='button';m.id='tkxMic';m.className='tk-emob';m.setAttribute('aria-label','إدخال صوتي');m.setAttribute('aria-pressed','false');m.textContent='🎤';send.parentNode.insertBefore(m,q('#tkEmoBtn',body)||send)}}
  /* نجمة المفضلة على كل رد */
  var res=body.querySelectorAll('#tkLog .tk-re'),h=hist(),favs=jget(FK,[]);
  if(res.length===h.length)res.forEach(function(r,i){
    if(r.id==='tkPlay'||q('.tkx-fav',r))return;
    var en=h[i];if(!en||(!en.say&&!en.refs))return;
    var on=favs.some(function(f){return f.ts===en.ts});
    var b=document.createElement('button');b.type='button';b.className='tkx-fav'+(on?' on':'');b.setAttribute('data-tkxf',i);b.setAttribute('aria-label','حفظ الرد في المفضلة');b.setAttribute('aria-pressed',on?'true':'false');b.textContent=on?'★ محفوظ':'☆ حفظ الرد';
    r.appendChild(b)})
}
new MutationObserver(function(){if(document.getElementById('talkBody'))decorate()}).observe(document.body,{childList:true,subtree:true});
/* ---------- صوت ---------- */
var rec=null,recOn=false;
function mic(btn){
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return;
  var ta=document.getElementById('tkText');if(!ta)return;
  if(recOn&&rec){try{rec.stop()}catch(e){}return}
  rec=new SR();rec.lang='ar-EG';rec.interimResults=true;rec.continuous=false;var base=ta.value?ta.value+' ':'';
  rec.onstart=function(){recOn=true;btn.classList.add('on');btn.setAttribute('aria-pressed','true');toast('اتكلّم، أنا سامعك…')};
  rec.onresult=function(e){var t='';for(var i=0;i<e.results.length;i++)t+=e.results[i][0].transcript;ta.value=(base+t).slice(0,400);ta.dispatchEvent(new Event('input',{bubbles:true}))};
  rec.onerror=function(e){recOn=false;btn.classList.remove('on');btn.setAttribute('aria-pressed','false');toast(e&&e.error==='not-allowed'?'اسمح للمتصفح باستخدام الميكروفون':'تعذّر التسجيل الصوتي')};
  rec.onend=function(){recOn=false;btn.classList.remove('on');btn.setAttribute('aria-pressed','false');ta.focus()};
  try{rec.start()}catch(e){toast('تعذّر تشغيل الميكروفون')}}
/* ---------- المحادثات المحفوظة والمفضلة ---------- */
function archiveNow(){var h=hist();if(!h.length)return;var a=jget(AK,[]);if(!Array.isArray(a))a=[];
  if(a.length&&a[0].ts===h[0].ts)a.shift();                  // نفس المحادثة حُفظت قبل كده
  a.unshift({ts:h[0].ts,end:h[h.length-1].ts,n:h.length,entries:h});jset(AK,a.slice(0,30))}
function listSaved(){var a=jget(AK,[]),f=F();
  var rows=a.length?a.map(function(c,i){var first=(c.entries[0]||{}).t||'';return '<div class="tkx-row"><div><b>'+esc(first.slice(0,60))+'</b><small>'+esc(fmtDate(c.ts))+' · '+ar(c.n)+' رسالة</small></div><div class="tkx-ra"><button type="button" data-tkxv="'+i+'">عرض</button><button type="button" data-tkxr="'+i+'">استرجاع</button><button type="button" data-tkxd="'+i+'" aria-label="حذف">🗑</button></div></div>'}).join(''):'<p class="u-sub">مفيش محادثات محفوظة لسه. لما تضغط «محادثة جديدة» بتتحفظ المحادثة الحالية هنا.</p>';
  f.sheet('<h3 class="u-h3">محادثاتي المحفوظة</h3><div class="tkx-list">'+rows+'</div><div class="row-gap"><button type="button" class="u-btn" id="tkxSaveNow">حفظ المحادثة الحالية</button></div>');
  var sn=document.getElementById('tkxSaveNow');if(sn)sn.onclick=function(){if(!hist().length){toast('مفيش محادثة حالية');return}archiveNow();toast('اتحفظت المحادثة');listSaved()}}
function showConv(i){var a=jget(AK,[]),c=a[i],f=F();if(!c)return;f.sheet('<h3 class="u-h3">'+esc(fmtDate(c.ts))+'</h3><div class="tkx-conv">'+c.entries.map(entryHtml).join('<hr>')+'</div><div class="row-gap"><button type="button" class="u-btn" id="tkxBack">رجوع</button></div>');var b=document.getElementById('tkxBack');if(b)b.onclick=listSaved}
function restoreConv(i){var a=jget(AK,[]),c=a[i];if(!c)return;archiveNow();jset(HK,c.entries);F().closeSheet();if(window.__talkInit)window.__talkInit();toast('رجعت المحادثة')}
function listFavs(){var fv=jget(FK,[]),f=F();
  var rows=fv.length?fv.map(function(x,i){return '<div class="tkx-fv">'+entryHtml(x)+'<div class="tkx-ra"><button type="button" data-tkxc="'+i+'">نسخ</button><button type="button" data-tkxx="'+i+'">حذف</button></div></div>'}).join(''):'<p class="u-sub">اضغط «☆ حفظ الرد» تحت أي رد علشان يتحفظ هنا.</p>';
  f.sheet('<h3 class="u-h3">ردودي المفضلة</h3><div class="tkx-list">'+rows+'</div>')}
/* ---------- التذكير ---------- */
function pad(n){return (n<10?'0':'')+n}
function rget(){var r=jget(RK,{});return {on:!!r.on,time:r.time||'21:00',last:r.last||''}}
function remindUI(){var r=rget(),f=F(),supp=('Notification' in window);
  f.sheet('<h3 class="u-h3">تذكير لطيف من الرب</h3><p class="u-sub">يوصلك كل يوم في الوقت اللي تحدده: «أخبارك إيه؟ تعالى نتكلم».</p><label class="nh-ck"><input type="checkbox" id="tkxOn"'+(r.on?' checked':'')+'><span>تفعيل التذكير اليومي</span></label><label class="nh-ck"><span>الوقت</span><input type="time" id="tkxTm" value="'+esc(r.time)+'"></label><p class="u-sub">'+(supp?'التذكير بيظهر لما التطبيق يكون مفتوح أو لما تفتحه بعد الميعاد. لإشعارات النظام اسمح بالإشعارات من المتصفح.':'متصفحك مش بيدعم إشعارات النظام، فالتذكير هيظهر جوه التطبيق بس.')+'</p><div class="row-gap"><button type="button" class="u-btn on" id="tkxRs">حفظ</button><button type="button" class="u-btn" id="tkxRt">جرّبه الآن</button></div>');
  var s=document.getElementById('tkxRs'),t=document.getElementById('tkxRt');
  if(s)s.onclick=function(){var on=document.getElementById('tkxOn').checked,tm=document.getElementById('tkxTm').value||'21:00';jset(RK,{on:on,time:tm,last:''});
    if(on&&supp&&Notification.permission==='default'){try{Notification.requestPermission()}catch(e){}}
    f.closeSheet();toast(on?'هفكّرك الساعة '+tm:'اتقفل التذكير')};
  if(t)t.onclick=function(){f.closeSheet();fire(true)}}
var MSG=['وحشتني… تعالى نتكلم شوية. 🤍','أخبارك إيه {v}؟ أنا هنا لو عايز تحكي لي.','فاضي دقيقتين؟ قول لي أخبار قلبك.','أنا مستنيك يا {v}. مفيش حاجة صغيرة عندي.','يومك عامل إيه؟ سيب لي حِمل منه.'];
function fire(manual){var r=rget(),t=new Date(),v=V().voc?V().voc():'يا حبيبي',txt=MSG[Math.floor(Math.random()*MSG.length)].replace(/\{v\}/g,v.replace(/^يا /,''));
  if(V().gen)txt=V().gen(txt);
  if(!manual){r.last=t.getFullYear()+'-'+pad(t.getMonth()+1)+'-'+pad(t.getDate());jset(RK,{on:r.on,time:r.time,last:r.last})}
  banner(txt);
  try{if('Notification' in window&&Notification.permission==='granted'&&document.hidden){var o={body:txt,icon:'icon-192.png',tag:'rf-talk'};
    if(navigator.serviceWorker&&navigator.serviceWorker.ready)navigator.serviceWorker.ready.then(function(sw){sw.showNotification('الرفيق الروحي',o)}).catch(function(){new Notification('الرفيق الروحي',o)});else new Notification('الرفيق الروحي',o)}}catch(e){}}
function banner(txt){var b=document.getElementById('tkxBanner');if(b)b.remove();b=document.createElement('div');b.id='tkxBanner';b.setAttribute('role','status');
  b.innerHTML='<button type="button" class="bx-go"><i>🕊</i><span>'+esc(txt)+'</span><small>اضغط لتتكلم معاه</small></button><button type="button" class="bx-x" aria-label="إغلاق">✕</button>';document.body.appendChild(b);
  b.querySelector('.bx-go').onclick=function(){b.remove();var n=q('#uNav [data-go="talk"]');if(n)n.click()};b.querySelector('.bx-x').onclick=function(){b.remove()};
  setTimeout(function(){if(b.parentNode)b.remove()},20000)}
function check(){var r=rget();if(!r.on)return;var t=new Date(),today=t.getFullYear()+'-'+pad(t.getMonth()+1)+'-'+pad(t.getDate());if(r.last===today)return;
  var now=pad(t.getHours())+':'+pad(t.getMinutes());if(now<r.time)return;
  var p=r.time.split(':'),diff=(t.getHours()*60+t.getMinutes())-(+p[0]*60+ +p[1]);if(diff>240)return;  // لا نزعج بعد 4 ساعات من الميعاد
  fire(false)}
setInterval(check,30000);document.addEventListener('visibilitychange',function(){if(!document.hidden)check()});setTimeout(check,4000);
/* ---------- الأحداث ---------- */
document.addEventListener('click',function(e){
  var t=e.target,b;
  if(b=t.closest&&t.closest('[data-tkxg]')){var g=b.getAttribute('data-tkxg');try{localStorage.setItem(GK,g)}catch(x){};document.querySelectorAll('[data-tkxg]').forEach(function(x){var on=x.getAttribute('data-tkxg')===g;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});toast(g==='f'?'هخاطبك بصيغة المؤنث':'هخاطبك بصيغة المذكر');return}
  if(b=t.closest&&t.closest('[data-tkxa]')){var k=b.getAttribute('data-tkxa');if(k==='saved')listSaved();else if(k==='favs')listFavs();else if(k==='remind')remindUI();return}
  if(b=t.closest&&t.closest('#tkxMic')){mic(b);return}
  if(t.closest&&t.closest('#tkClear')){archiveNow();return}
  if(b=t.closest&&t.closest('[data-tkxf]')){var i=+b.getAttribute('data-tkxf'),h=hist(),en=h[i];if(!en)return;var fv=jget(FK,[]),ix=fv.findIndex(function(f){return f.ts===en.ts});
    if(ix>=0){fv.splice(ix,1);b.classList.remove('on');b.textContent='☆ حفظ الرد';b.setAttribute('aria-pressed','false')}else{fv.unshift({ts:en.ts,t:en.t,say:en.say,refs:en.refs,themes:en.themes});b.classList.add('on');b.textContent='★ محفوظ';b.setAttribute('aria-pressed','true');toast('اتحفظ في ردودي')}
    jset(FK,fv.slice(0,100));return}
  if(b=t.closest&&t.closest('[data-tkxv]')){showConv(+b.getAttribute('data-tkxv'));return}
  if(b=t.closest&&t.closest('[data-tkxr]')){restoreConv(+b.getAttribute('data-tkxr'));return}
  if(b=t.closest&&t.closest('[data-tkxd]')){var a=jget(AK,[]);a.splice(+b.getAttribute('data-tkxd'),1);jset(AK,a);listSaved();return}
  if(b=t.closest&&t.closest('[data-tkxc]')){var fv2=jget(FK,[]),x=fv2[+b.getAttribute('data-tkxc')];if(x){var txt=entryText(x);try{navigator.clipboard.writeText(txt).then(function(){toast('اتنسخ الرد')},function(){toast('تعذّر النسخ')})}catch(er){toast('تعذّر النسخ')}}return}
  if(b=t.closest&&t.closest('[data-tkxx]')){var fv3=jget(FK,[]);fv3.splice(+b.getAttribute('data-tkxx'),1);jset(FK,fv3);listFavs();return}
},true);
window.__talkTools={archive:archiveNow,check:check,fire:fire};
})();
