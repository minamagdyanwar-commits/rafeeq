(function(){
var KEY='v64upd_dismissed',last=0;
function pv(v){var m=String(v||'').match(/(\d+)(?:\.(\d+))?/);return m?(+m[1])*1000+(+(m[2]||0)):0}
function num(v){return parseInt(String(v||'').replace(/\D/g,''),10)||0}
function bar(){var e=document.getElementById('v64Upd');if(e)return e;e=document.createElement('div');e.id='v64Upd';e.setAttribute('role','status');e.setAttribute('aria-live','polite');
 e.innerHTML='<span id="v64UpdT"></span><button type="button" class="go" id="v64UpdGo">تحديث الآن</button><button type="button" id="v64UpdLater">لاحقًا</button>';document.body.appendChild(e);
 e.querySelector('#v64UpdLater').addEventListener('click',function(){e.classList.remove('on');try{sessionStorage.setItem(KEY,e.dataset.v)}catch(x){}});
 e.querySelector('#v64UpdGo').addEventListener('click',function(){var done=function(){location.reload()};
  var p=[];try{if(window.caches)p.push(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){return caches.delete(k)}))}))}catch(x){}
  try{if(navigator.serviceWorker)p.push(navigator.serviceWorker.getRegistrations().then(function(rs){return Promise.all(rs.map(function(r){return r.unregister()}))}))}catch(x){}
  Promise.all(p).then(done,done);setTimeout(done,2500)});return e}
function show(v){var d='';try{d=sessionStorage.getItem(KEY)||''}catch(x){}if(d===v)return;var e=bar();e.dataset.v=v;document.getElementById('v64UpdT').textContent='نسخة جديدة '+v+' متاحة';e.classList.add('on')}
function check(){if(!/^https?:$/.test(location.protocol))return;last=Date.now();
 fetch('sw.js?_='+last,{cache:'no-store'}).then(function(r){return r.ok?r.text():''}).then(function(t){var m=t.match(/const VER='rafeeq-v(\d+)(?:\.(\d+))?-/);if(m){var nv=(+m[1])*1000+(+(m[2]||0)),cv=pv(window.__RF_VER);if(cv&&nv>cv)show('v'+m[1]+(m[2]!=null?'.'+m[2]:''))}}).catch(function(){})}
window.__v64check=check;
window.addEventListener('load',function(){setTimeout(check,4000)});
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'&&Date.now()-last>10*60*1000)check()});
window.addEventListener('online',function(){check()});
try{if(navigator.serviceWorker){var had=!!navigator.serviceWorker.controller;navigator.serviceWorker.addEventListener('controllerchange',function(){if(had)check();had=true})}}catch(x){}
/* نقرة نجمة المفضلة */
document.addEventListener('click',function(ev){var t=ev.target&&ev.target.closest&&ev.target.closest('[data-mg=fav]');if(!t)return;
 setTimeout(function(){var b=document.querySelector('.mg-favbtn.on');if(!b)return;b.classList.add('v64pop');b.addEventListener('animationend',function(){b.classList.remove('v64pop')},{once:true});try{navigator.vibrate&&navigator.vibrate(15)}catch(x){}},30)});
})();