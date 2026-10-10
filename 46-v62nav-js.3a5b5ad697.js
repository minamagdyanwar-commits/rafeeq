(function(){var K='rafeeq_navmin_v62',b=document.body,t=null;
function rd(){try{return localStorage.getItem(K)==='1'}catch(e){return false}}
function wr(v){try{localStorage.setItem(K,v?'1':'0')}catch(e){}}
function mk(){if(t)return;t=document.createElement('button');t.id='v62Tog';t.type='button';t.addEventListener('click',function(){var m=!b.classList.contains('v62-min');b.classList.toggle('v62-min',m);wr(m);sync()});b.appendChild(t)}
function sync(){mk();ovl();var kh=b.classList.contains('v14-khalwa'),nav=document.getElementById('uNav'),min=b.classList.contains('v62-min'),h=0,vis=false;
if(kh&&nav&&!min){var r=nav.getBoundingClientRect(),cs=getComputedStyle(nav);if(cs.display!=='none'&&cs.visibility!=='hidden'&&r.height>0&&r.top<innerHeight-4){h=Math.max(0,innerHeight-r.top);vis=true}}
/* الزر يظهر لو الشريط ظاهر أو مطوي بواسطتنا */
var show=kh&&(vis||min);b.classList.toggle('v62-tog',show);
b.style.setProperty('--v62nh',(min?0:Math.round(h))+'px');
t.textContent=min?'▴':'▾';t.setAttribute('aria-label',min?'إظهار شريط التنقل':'طيّ شريط التنقل');}
var OV='#uSheet.on,#settingsPanel.open,#uSearchOv:not([hidden]),#uLock:not([hidden]),.hours-drawer.open,.settings-backdrop.open';
function ovl(){var o=!!document.querySelector(OV);b.classList.toggle('v62-ovl',o)}
b.classList.toggle('v62-min',rd());
new MutationObserver(ovl).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class','hidden']});ovl();
new MutationObserver(sync).observe(b,{attributes:true,attributeFilter:['class']});
window.addEventListener('resize',sync);window.addEventListener('orientationchange',sync);
document.addEventListener('rafeeq:layout',function(){setTimeout(sync,80)});
setInterval(sync,700);sync();})();