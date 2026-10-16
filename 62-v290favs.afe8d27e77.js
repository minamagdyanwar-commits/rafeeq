/* v2.90: (1) مفضلة الأقوال الآبائية (صوت الله + صفحة الأقوال)  (2) صفحة «المفضلات» العامة في «المزيد» تجمع مفضلات كل الأقسام */
(function(){
'use strict';
var F=window.__F; if(!F) return;
var esc=F.esc, ard=F.ard||function(n){return String(n)};
function $(i){return document.getElementById(i)}
function rd(k){try{return localStorage.getItem(k)}catch(e){return null}}
function wr(k,v){try{ if(v==null) localStorage.removeItem(k); else localStorage.setItem(k,v); }catch(e){}}
function jp(k,d){try{var v=JSON.parse(rd(k)); return v==null?d:v}catch(e){return d}}
function js(k,v){wr(k,JSON.stringify(v))}
function plain(h){var d=document.createElement('div'); d.innerHTML=String(h==null?'':h); return (d.textContent||'').replace(/[ \t\r\f\v]+/g,' ').trim()}
function fold(s){ return F.norm?F.norm(s):String(s||'').toLowerCase(); }

/* ===== مفضلة الأقوال الآبائية ===== */
var FK='rafeeq_fatfav_v1';
function fList(){var a=jp(FK,[]); return Array.isArray(a)?a:[]}
function fHas(i){i=+i; return fList().some(function(x){return x.i===i})}
function fToggle(i){
  i=+i; var a=fList(), k=-1; a.forEach(function(x,n){ if(x.i===i) k=n; });
  if(k>=0) a.splice(k,1); else a.unshift({i:i,ts:Date.now()});
  js(FK,a); return k<0;
}
function fBtn(i){
  var on=fHas(i);
  return '<button type="button" class="fv-star'+(on?' on':'')+'" data-fvf="'+(+i)+'" aria-pressed="'+(on?'true':'false')+'">'+(on?'★ في المفضلة':'☆ مفضلة')+'</button>';
}
function fSync(i){
  var on=fHas(i);
  Array.prototype.forEach.call(document.querySelectorAll('[data-fvf="'+(+i)+'"]'),function(b){
    b.classList.toggle('on',on); b.setAttribute('aria-pressed',on?'true':'false'); b.textContent=on?'★ في المفضلة':'☆ مفضلة';
  });
}
window.__fatFav={has:fHas,toggle:fToggle,btn:fBtn,list:fList};

function favsOn(){var p=$('page-favs'); return p&&p.classList.contains('on')}
document.addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('[data-fvf]'); if(!b) return;
  e.preventDefault(); e.stopPropagation();
  var i=+b.getAttribute('data-fvf'), on=fToggle(i); fSync(i);
  if(on) F.toast('أُضيف القول إلى المفضلة ★');
  else F.toast('أُزيل القول من المفضلة',{undo:function(){ fToggle(i); fSync(i); if(favsOn()) paintList(); }});
  if(favsOn()) paintList();
},true);

/* ===== مصادر المفضلات (كلٌّ بمفتاحه في localStorage) ===== */
var ME='rafeeq_me_v1', VK='rafeeq_verses_v1', MK='rafeeq_msgfav_v1', DK='khalwa_med_favs_v1', PK='khalwa_pb_favorites_v1', BK='dr_bookmarks_v1';
function dtxt(ts){ try{ return new Date(ts).toLocaleDateString('ar-EG',{day:'numeric',month:'long',year:'numeric'}) }catch(e){ return '' } }
function msgText(f){ var out=[]; (f.blocks||[]).forEach(function(b){ if(b&&b.h) out.push(plain(b.h)); else if(b&&b.t&&typeof b.t==='string'&&b.t.length>2) out.push(plain(b.t)); }); return out.filter(Boolean).join('\n\n'); }

var SEC=[
 {id:'fat',ic:'✝️',t:'أقوال الآباء',hint:'من «صوت الله» أو صفحة «أقوال الآباء» اضغط ☆ مفضلة تحت القول.',key:FK,
  items:function(){ var A=window.__fathers; return fList().map(function(r){ var x=A&&A.byId&&A.byId[r.i]; if(!x) return null;
      return {id:String(r.i),head:x.f,sub:(A.cite?A.cite(x):''),text:'«'+x.t+'»',ts:r.ts}; }).filter(Boolean); },
  rm:function(id){ js(FK,fList().filter(function(x){return String(x.i)!==id})); }},
 {id:'mine',ic:'🤍',t:'آياتي',hint:'في رسالة «حالك النهارده» اضغط «♡ هذه الآية لي».',key:ME,
  items:function(){ var o=jp(ME,{}); return (o.verses||[]).map(function(x){ return {id:x.id,head:x.ref,sub:dtxt(x.ts),text:x.text,ts:x.ts}; }); },
  rm:function(id){ var o=jp(ME,{}); o.verses=(o.verses||[]).filter(function(x){return x.id!==id}); js(ME,o); }},
 {id:'memo',ic:'📖',t:'آيات الحفظ',hint:'في «صوت الله» أو «الكتاب» اضغط «حفظ» على أي آية.',key:VK,
  items:function(){ var k=F.realKey?F.realKey():''; var a=jp(VK,[]); return (Array.isArray(a)?a:[]).map(function(x){ return {id:x.id,head:x.ref,sub:(x.due&&x.due<=k)?'مستحقة للمراجعة':'في قائمة المراجعة',text:x.text,ts:0,go:'memo'}; }); },
  rm:function(id){ var a=jp(VK,[]); js(VK,(Array.isArray(a)?a:[]).filter(function(x){return x.id!==id})); }},
 {id:'msg',ic:'✉️',t:'رسائل يسوع المحفوظة',hint:'في «رسالة من يسوع» اضغط «☆ حفظ في المفضلة».',key:MK,
  items:function(){ var a=jp(MK,[]); return (Array.isArray(a)?a:[]).map(function(f){ var d=f.date||{};
      return {id:String(f.id),head:'رسالة '+(d.greg||d.coptic||f.id),sub:[d.coptic&&d.greg?d.coptic:'',d.feast||'',f.themeLabel||''].filter(Boolean).join(' · '),text:msgText(f),ts:f.savedAt,go:'msg'}; }); },
  rm:function(id){ var a=jp(MK,[]); js(MK,(Array.isArray(a)?a:[]).filter(function(f){return String(f.id)!==id})); }},
 {id:'med',ic:'🕯️',t:'تأملات الخلوة',hint:'في «الخلوة» اضغط «☆ أضف للمفضلة» على أي تأمل.',key:DK,
  items:function(){ var o=jp(DK,{}); return Object.keys(o).sort(function(a,b){return (o[b].savedAt||0)-(o[a].savedAt||0)}).map(function(id){ var f=o[id], m=f.med||{};
      var txt=[]; if(m.verse) txt.push('«'+plain(m.verse)+'»'+(m.ref?' ('+plain(m.ref)+')':'')); if(m.reflect) txt.push(plain(m.reflect)); if(m.quote) txt.push('— '+plain(m.father||'')+': '+plain(m.quote));
      return {id:id,head:(m.date?plain(m.date)+' — ':'')+'تأمل '+(f.variant||m.variant||''),sub:[m.topic,m.title2].filter(Boolean).map(plain).join(' · '),text:txt.join('\n\n'),ts:f.savedAt}; }); },
  rm:function(id){ var o=jp(DK,{}); delete o[id]; js(DK,o); }},
 {id:'pray',ic:'🙏',t:'صلوات الخلوة المفضلة',hint:'في «الصلاة» ← «صلوات للمناسبات» اضغط ⭐ جنب أي صلاة.',key:PK,
  items:function(){ var api=window.__favApi; if(!api) return []; return api.prayers().map(function(p){
      return {id:p.key,head:p.title,sub:[p.topic,p.author].filter(Boolean).join(' — '),text:p.text.map(plain).join('\n\n'),ts:0}; }); },
  rm:function(id){ var api=window.__favApi; if(api) api.unPrayer(id); }},
 {id:'lines',ic:'✨',t:'جمل لمستني (الأجبية)',hint:'في «الأجبية» اضغط مطوّلًا على أي سطر ليُحفظ هنا مع ملاحظتك.',key:'rafeeq_lines_v1',
  items:function(){ var a=jp('rafeeq_lines_v1',[]); return (Array.isArray(a)?a:[]).map(function(x){ return {id:x.id,head:'«'+x.t+'»',sub:[x.h&&('صلاة '+x.h),x.c].filter(Boolean).join(' · ')+(x.ts?' — '+dtxt(x.ts):''),text:x.n?('✎ '+x.n):'',ts:x.ts}; }); },
  rm:function(id){ var a=jp('rafeeq_lines_v1',[]); js('rafeeq_lines_v1',(Array.isArray(a)?a:[]).filter(function(x){return x.id!==id})); }},
 {id:'read',ic:'📅',t:'أيام القراءات المحفوظة',hint:'في «القراءات» اضغط أيقونة العلامة 🔖 أعلى الصفحة.',key:BK,
  items:function(){ var a=jp(BK,[]); return (Array.isArray(a)?a:[]).map(function(b){ return {id:b.iso,head:plain(b.label||b.iso),sub:b.iso,text:'',ts:0,go:'read'}; }); },
  rm:function(id){ var a=jp(BK,[]); js(BK,(Array.isArray(a)?a:[]).filter(function(b){return b.iso!==id})); }}
];
var BYID={}; SEC.forEach(function(s){BYID[s.id]=s});

/* ===== العرض ===== */
var ST={q:'',open:{},more:{}}, CACHE={};
function secData(s){ var q=fold(ST.q.trim()); var all=[]; try{ all=s.items(); }catch(e){ all=[]; }
  var shown=q?all.filter(function(x){return fold(x.head+' '+x.sub+' '+x.text).indexOf(q)>-1}):all;
  CACHE[s.id]={};
  shown.forEach(function(x){CACHE[s.id][x.id]=x});
  return {all:all,shown:shown};
}
function itemHtml(s,x){
  var long=(x.text||'').length>150, open=ST.more[s.id+'|'+x.id];
  return '<article class="fv-it" data-s="'+s.id+'" data-id="'+esc(x.id)+'"><div class="fv-h"><b>'+esc(x.head)+'</b>'+(x.sub?'<small>'+esc(x.sub)+'</small>':'')+'</div>'+
    (x.text?'<p class="fv-t'+(open?' open':'')+'">'+esc(x.text)+'</p>':'')+
    '<div class="fv-a">'+(long?'<button type="button" data-fv="more">'+(open?'إخفاء':'عرض الكل')+'</button>':'')+
    (x.text?'<button type="button" data-fv="copy">نسخ</button>':'')+
    (x.go?'<button type="button" data-fv="go">'+(x.go==='memo'?'تدرّب':'افتح')+'</button>':'')+
    '<button type="button" class="fv-rm" data-fv="rm">إزالة من المفضلة</button></div></article>';
}
function paintList(){
  var host=$('fvList'); if(!host) return;
  var tot=0, nsec=0, html='';
  SEC.forEach(function(s){
    var d=secData(s); tot+=d.all.length; if(d.all.length) nsec++;
    var isOpen=ST.open[s.id]; if(isOpen===undefined) isOpen=d.all.length>0;
    if(ST.q.trim()){ if(!d.shown.length) return; isOpen=true; }
    html+='<details class="u-card fv-sec'+(d.all.length?'':' empty')+'" data-sec="'+s.id+'"'+(isOpen?' open':'')+'><summary><span class="fv-ic" aria-hidden="true">'+s.ic+'</span><b>'+esc(s.t)+'</b><span class="fv-n">'+ard(d.all.length)+'</span></summary>'+
      (d.shown.length?'<div class="fv-sa"><button type="button" data-fvs="copy:'+s.id+'">نسخ القسم</button><button type="button" data-fvs="clear:'+s.id+'" class="fv-rm">إفراغ القسم</button></div>'+d.shown.map(function(x){return itemHtml(s,x)}).join(''):'<p class="fv-empty">'+esc(s.hint)+'</p>')+'</details>';
  });
  if(!html) html='<div class="u-card pad c">'+(ST.q.trim()?'لا توجد نتائج مطابقة.':'لا توجد مفضلات بعد.')+'</div>';
  host.innerHTML=html;
  var sm=$('fvSum'); if(sm) sm.textContent=tot?(ard(tot)+(tot===1?' عنصر':' عنصرًا')+' في '+ard(nsec)+(nsec===1?' قسم':' أقسام')):'لم تحفظ شيئًا في المفضلة بعد';
}
function render(){
  var h=$('favsBody'); if(!h) return;
  h.innerHTML='<div class="u-card fv-head"><h3 class="u-h3">★ كل مفضلاتي</h3><div class="u-sub" id="fvSum"></div>'+
    '<input id="fvQ" class="u-in" type="search" placeholder="ابحث في كل المفضلات" value="'+esc(ST.q)+'" aria-label="بحث في المفضلات">'+
    '<div class="row-gap"><button type="button" class="u-btn" data-fvs="copyall">نسخ الكل</button><button type="button" class="u-btn" data-fvs="download">تنزيل كملف نصي</button></div>'+
    '<div class="u-sub fv-note">كل ما حفظته في أي قسم يظهر هنا مرتبًا. «إزالة» هنا تُزيله من القسم الأصلي أيضًا، ويمكنك التراجع منها فورًا.</div></div><div id="fvList"></div>';
  var q=$('fvQ'); if(q) q.oninput=function(){ ST.q=q.value; paintList(); };
  paintList();
}
window.__favsInit=render;

/* ===== نسخ/تنزيل ===== */
function secText(s,onlyShown){
  var d=secData(s), L=d.shown; if(!L.length) return '';
  return '【 '+s.t+' — '+L.length+' 】\n\n'+L.map(function(x){ return x.head+(x.sub?' ('+x.sub+')':'')+(x.text?'\n'+x.text:''); }).join('\n\n––––\n\n');
}
function allText(){ return SEC.map(function(s){return secText(s)}).filter(Boolean).join('\n\n\n'); }
function copy(t,msg){ if(!t){ F.toast('لا يوجد شيء للنسخ'); return; } Promise.resolve(F.copy?F.copy(t):null).then(function(){ F.toast(msg||'تم النسخ'); },function(){ F.toast(msg||'تم النسخ'); }); }
function download(t,name){
  try{ var b=new Blob(['﻿'+t],{type:'text/plain;charset=utf-8'}), a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=name; document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },500); }catch(e){ F.toast('تعذّر التنزيل'); }
}

/* ===== الإجراءات ===== */
function undoable(s,msg,fn){
  var raw=rd(s.key); fn();
  F.toast(msg,{undo:function(){ wr(s.key,raw); if(favsOn()) paintList(); }});
  paintList();
}
function goTo(s,x){
  var R=window.__rafeeq; if(!R) return;
  if(x.go==='memo'){ R.show('trk',{top:1}); F.setTrkTab('memo'); }
  else if(x.go==='msg'){ R.show('msg',{top:1}); setTimeout(function(){ var b=document.querySelector('#page-msg [data-mg="favs"]'); if(b) b.click(); },250); }
  else if(x.go==='read'){ R.show('read',{top:1}); setTimeout(function(){ if(window.__rfReadGo) window.__rfReadGo(x.id); },250); }
}
document.addEventListener('click',function(e){
  var host=$('favsBody'); if(!host||!host.contains(e.target)) return;
  var b=e.target.closest('[data-fv]'), c=e.target.closest('[data-fvs]');
  if(b){
    var it=b.closest('.fv-it'), s=BYID[it.dataset.s], x=CACHE[s.id]&&CACHE[s.id][it.dataset.id]; if(!x) return;
    var a=b.getAttribute('data-fv');
    if(a==='more'){ var k=s.id+'|'+x.id; ST.more[k]=!ST.more[k]; var t=it.querySelector('.fv-t'); if(t) t.classList.toggle('open',!!ST.more[k]); b.textContent=ST.more[k]?'إخفاء':'عرض الكل'; }
    else if(a==='copy') copy(x.head+(x.sub?' ('+x.sub+')':'')+'\n'+x.text);
    else if(a==='go') goTo(s,x);
    else if(a==='rm') undoable(s,'أُزيلت من المفضلة',function(){ s.rm(x.id); });
    return;
  }
  if(c){
    var p=c.getAttribute('data-fvs').split(':'), act=p[0], sid=p[1];
    if(act==='copyall') copy(allText(),'تم نسخ كل المفضلات');
    else if(act==='download') { var t2=allText(); if(!t2){ F.toast('لا يوجد شيء للتنزيل'); return; } download('مفضلاتي — الرفيق الروحي\n'+new Date().toLocaleDateString('ar-EG')+'\n\n'+t2,'مفضلاتي-الرفيق-الروحي.txt'); }
    else if(act==='copy'){ copy(secText(BYID[sid]),'تم نسخ القسم'); }
    else if(act==='clear'){ var s2=BYID[sid]; var n=s2.items().length; if(!n) return; undoable(s2,'أُفرغ قسم «'+s2.t+'»',function(){ s2.items().forEach(function(x){ s2.rm(x.id); }); }); }
  }
});
document.addEventListener('toggle',function(e){
  var d=e.target; if(d&&d.classList&&d.classList.contains('fv-sec')) ST.open[d.dataset.sec]=d.open;
},true);
})();
