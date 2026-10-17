/* v3.0 — «تخصيص المظهر»: قسم واحد في الإعدادات يضم الثيمات والألوان والخطوط (عناوين/محتوى/واجهة) والنص والشكل */
(function(){
'use strict';
var LK='rafeeq_look_v1', TK='khalwa_typo_v1', H=document.documentElement;
function $(i){return document.getElementById(i)}
function q(s,r){return (r||document).querySelector(s)}
function ls(k){try{return localStorage.getItem(k)}catch(e){return null}}
function ws(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function jp(k){try{return JSON.parse(ls(k)||'null')}catch(e){return null}}
var S={hf:'',uf:'',shape:'soft',orn:0}, st=jp(LK); if(st&&typeof st==='object'){ for(var k in S) if(st[k]!=null) S[k]=st[k]; }
function save(){ ws(LK,JSON.stringify(S)); }

/* ---------- كتالوج الخطوط ---------- */
var FONTS={
 aref:['عارف رقعة',"'Aref Ruqaa',serif"], amiri:['أميري',"'Amiri',serif"], naskh:['نسخ',"'Noto Naskh Arabic',serif"],
 sheh:['شهرزاد',"'Scheherazade New',serif"], markazi:['مركزي',"'Markazi Text',serif"], cairo:['القاهرة',"'Cairo',sans-serif"],
 tajawal:['تجوّل',"'Tajawal',sans-serif"], elm:['المسيري',"'El Messiri',serif"], reem:['ريم كوفي',"'Reem Kufi',sans-serif"],
 plex:['IBM Plex',"'IBM Plex Sans Arabic',sans-serif"], almarai:['المرعي',"'Almarai',sans-serif"], readex:['ريدكس',"'Readex Pro',sans-serif"],
 kufi:['كوفي',"'Noto Kufi Arabic',sans-serif"], lateef:['لطيف',"'Lateef',serif"], mirza:['ميرزا',"'Mirza',serif"], katibeh:['كاتبة',"'Katibeh',serif"]
};
var HEAD_IDS=['aref','amiri','elm','reem','kufi','katibeh','lateef','naskh'];
var UI_IDS=['cairo','tajawal','plex','almarai','readex'];

/* ---------- توليد قواعد الأدوار من أوراق الأنماط (مرة واحدة، عند أول اختيار) ---------- */
var built=false;
function splitSel(s){ var out=[],d=0,cur='',c; for(var i=0;i<s.length;i++){ c=s[i]; if(c==='('||c==='[') d++; else if(c===')'||c===']') d--; if(c===','&&d===0){ out.push(cur.trim()); cur=''; } else cur+=c; } if(cur.trim()) out.push(cur.trim()); return out; }
function prim(ff){ return String(ff||'').split(',')[0].replace(/["'\s]/g,''); }
function scoped(sel,attr,extraNot,pe){
  if(/^(html|:root)\b/.test(sel)) sel=sel.replace(/^(html|:root)/,'html['+attr+']:not(#_)'); else sel='html['+attr+']:not(#_) '+sel;
  if(!pe) sel+=extraNot; return sel;
}
function build(){
  if(built) return; built=true;
  var heads={},uis={},conts={},rad=[]; var HEXTRA=['h1','h2','h3','h4','h5','.u-h3'], UEXTRA=['button','input','select','textarea','label'];
  HEXTRA.forEach(function(s){heads[s]=1}); UEXTRA.forEach(function(s){uis[s]=1});
  function walk(rules,own){
    for(var i=0;i<rules.length;i++){ var r=rules[i];
      if(r.type===1){
        var sty=r.style, ff=sty.getPropertyValue('font-family'), br=sty.getPropertyValue('border-radius');
        var sels=null;
        if(ff){ var p=prim(ff), role=p==='ArefRuqaa'?heads:(p==='Cairo'||p==='Tajawal')?uis:(p==='Amiri'||p==='ScheherazadeNew'||p==='NotoNaskhArabic'||p==='MarkaziText')?conts:null;
          if(role){ sels=splitSel(r.selectorText); sels.forEach(function(s){ if(s.indexOf('@')<0) role[s]=1; }); } }
        if(br&&/px/.test(br)&&br.indexOf('/')<0&&br.indexOf('%')<0&&br.indexOf('var(')<0){
          sels=sels||splitSel(r.selectorText); rad.push([sels,br]); }
      } else if(r.cssRules&&r.type!==5){ walk(r.cssRules); }
    }
  }
  for(var i=0;i<document.styleSheets.length;i++){ var sh=document.styleSheets[i]; if(sh.ownerNode&&sh.ownerNode.id==='v300Gen') continue; try{ walk(sh.cssRules); }catch(e){} }
  var NOTF=':not([style*="font-family"])', NOTR=':not([style*="border-radius"])', css='';
  function emit(map,attr,decl,skipHead){
    var arr=[]; Object.keys(map).forEach(function(s){
      if(skipHead&&/(^|[\s>+~])(h[1-6]|\.u-h3)(?![\w-])/.test(s)) return;
      var pe=/::|:(before|after)\b/.test(s); arr.push(scoped(s,attr,NOTF,pe)); });
    for(var i=0;i<arr.length;i+=200) css+=arr.slice(i,i+200).join(',')+'{'+decl+'}\n';
  }
  emit(uis,'data-uf','font-family:var(--rf-uf)!important');
  emit(conts,'data-cf','font-family:var(--read-font)!important',true);
  emit(heads,'data-hf','font-family:var(--rf-hf)!important');
  function scale(v,mode){ return v.replace(/(-?\d*\.?\d+)px/g,function(m,n){ n=parseFloat(n); if(n<8||n>=100) return m; return (mode==='sharp'?Math.min(n,5):Math.min(Math.round(n*1.4),44))+'px'; }); }
  ['sharp','round'].forEach(function(mode){
    var seen={};
    rad.forEach(function(x){ var nv=scale(x[1],mode); if(nv===x[1].trim()) return;
      var arr=x[0].map(function(s){ var pe=/::|:(before|after)\b/.test(s); return scoped(s,'data-shape="'+mode+'"',NOTR,pe); });
      css+=arr.join(',')+'{border-radius:'+nv+'!important}\n'; });
  });
  var el=document.createElement('style'); el.id='v300Gen'; el.textContent=css; document.head.appendChild(el);
}
function needBuild(){ return !!(S.hf||S.uf||H.getAttribute('data-cf')||S.shape!=='soft'); }
/* ---------- التطبيق ---------- */
function typoFF(){ var t=jp(TK); return (t&&t.ff)||''; }
function apply(){
  var cf=typoFF();
  H.setAttribute('data-hf',''); if(S.hf&&FONTS[S.hf]){ H.setAttribute('data-hf',S.hf); H.style.setProperty('--rf-hf',FONTS[S.hf][1]); } else { H.removeAttribute('data-hf'); H.style.removeProperty('--rf-hf'); }
  if(S.uf&&FONTS[S.uf]){ H.setAttribute('data-uf',S.uf); H.style.setProperty('--rf-uf',FONTS[S.uf][1]); } else { H.removeAttribute('data-uf'); H.style.removeProperty('--rf-uf'); }
  if(cf){ H.setAttribute('data-cf','1'); } else H.removeAttribute('data-cf');
  if(S.shape==='sharp'||S.shape==='round') H.setAttribute('data-shape',S.shape); else H.removeAttribute('data-shape');
  if(S.orn) H.setAttribute('data-orn','1'); else H.removeAttribute('data-orn');
  if(needBuild()) build();
  paintUI();
}
/* ---------- واجهة القسم ---------- */
function btn(label,attrs,fam,on){
  var b=document.createElement('button'); b.type='button'; b.className='settings-mbtn'+(on?' active':''); b.textContent=label;
  Object.keys(attrs||{}).forEach(function(k){b.setAttribute(k,attrs[k])}); if(fam) b.style.fontFamily=fam; return b;
}
function fontRow(id,ids,cur,key){
  var row=document.createElement('div'); row.className='settings-fontfam v300-ffrow'; row.id=id;
  row.appendChild(btn('الافتراضي',{'data-v300':key,'data-id':''},null,!cur));
  ids.forEach(function(i){ row.appendChild(btn(FONTS[i][0],{'data-v300':key,'data-id':i},FONTS[i][1],cur===i)); });
  return row;
}
function sub(t){var d=document.createElement('div'); d.className='settings-subhead v300-sub'; d.textContent=t; return d}
function note(t){var d=document.createElement('div'); d.className='settings-reminder-note'; d.textContent=t; return d}
function seg(id,items,cur,key){
  var r=document.createElement('div'); r.className='settings-moderow'; r.id=id;
  items.forEach(function(it){ r.appendChild(btn(it[1],{'data-v300':key,'data-id':it[0]},null,String(cur)===String(it[0]))); }); return r;
}
function paintUI(){
  var sec=$('v300Look'); if(!sec) return;
  [['hf','v300H'],['uf','v300U'],['shape','v300Shape'],['orn','v300Orn']].forEach(function(p){
    var r=$(p[1]); if(!r) return; Array.prototype.forEach.call(r.querySelectorAll('[data-v300]'),function(b){ b.classList.toggle('active',String(S[p[0]])===b.getAttribute('data-id')||(p[0]==='orn'&&String(S.orn?1:0)===b.getAttribute('data-id'))); });
  });
}
function mv(parent,node){ if(node&&parent) parent.appendChild(node); }
function build_ui(){
  var panel=$('settingsPanel'); if(!panel||$('v300Look')) return true;
  var need=['v14LaySec','themesSection','fontFamSection','lineSpacingSection','fontSizeSection','themeAutoBtn','themesBox','ffRow','lhRow','v14Tash','v14Dimrow','v14Lay'];
  for(var i=0;i<need.length;i++) if(!$(need[i])) return false;
  var sec=document.createElement('div'); sec.className='settings-section'; sec.id='v300Look';
  var lab=document.createElement('div'); lab.className='settings-label v32-h'; lab.setAttribute('role','button'); lab.tabIndex=0; lab.setAttribute('aria-expanded','false'); lab.textContent='🎨 تخصيص المظهر';
  var body=document.createElement('div'); body.className='v32-body'; sec.appendChild(lab); sec.appendChild(body);
  function tg(){ var o=!sec.classList.contains('v32-open'); sec.classList.toggle('v32-open',o); lab.setAttribute('aria-expanded',o?'true':'false'); }
  lab.addEventListener('click',tg); lab.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); tg(); } });
  /* معاينة حيّة */
  var pv=document.createElement('div'); pv.className='v300-prev';
  pv.innerHTML='<h3 class="u-h3">معاينة المظهر</h3><p class="v300-pt" style="font-family:var(--read-font,\'Amiri\',serif)">ارحمني يا الله كعظيم رحمتك، ومثل كثرة رأفتك امحُ مآثمي.</p><div class="v300-pb"><button type="button" class="chip">زر</button><span class="u-pill">وسم</span></div>';
  body.appendChild(pv);
  /* التخطيط والوضع */
  body.appendChild(sub('🧭 التخطيط والوضع'));
  mv(body,$('v14Lay'));
  var modeBody=$('themeAutoBtn').closest('.v32-body')||$('themeAutoBtn').closest('.settings-section');
  Array.prototype.slice.call(modeBody.children).forEach(function(c){ body.appendChild(c); });
  /* الثيمات والألوان */
  body.appendChild(sub('🎨 الثيمات والألوان'));
  mv(body,$('themesBox'));
  /* الخطوط */
  body.appendChild(sub('🔤 الخطوط'));
  var l1=document.createElement('div'); l1.className='v300-lbl'; l1.textContent='خط العناوين'; body.appendChild(l1);
  body.appendChild(fontRow('v300H',HEAD_IDS,S.hf,'hf'));
  var l2=document.createElement('div'); l2.className='v300-lbl'; l2.textContent='خط المحتوى (الصلوات والقراءات والأقوال)'; body.appendChild(l2);
  mv(body,$('ffRow'));
  var l3=document.createElement('div'); l3.className='v300-lbl'; l3.textContent='خط الواجهة (الأزرار والقوائم)'; body.appendChild(l3);
  body.appendChild(fontRow('v300U',UI_IDS,S.uf,'uf'));
  /* النص */
  body.appendChild(sub('🔠 حجم النص وتباعده'));
  var l0=document.createElement('div'); l0.className='v300-lbl'; l0.textContent='حجم الخط'; body.appendChild(l0); var fsb=q('.settings-fontrow',$('fontSizeSection')); mv(body,fsb);
  var l4=document.createElement('div'); l4.className='v300-lbl'; l4.textContent='المسافة بين الأسطر'; body.appendChild(l4); mv(body,$('lhRow'));
  mv(body,$('v14Tash').closest('.v14-row'));
  /* الشكل والتفاصيل */
  body.appendChild(sub('✨ الشكل والتفاصيل'));
  var l5=document.createElement('div'); l5.className='v300-lbl'; l5.textContent='شكل الحواف والبطاقات'; body.appendChild(l5);
  body.appendChild(seg('v300Shape',[['sharp','حادة'],['soft','ناعمة'],['round','دايرية']],S.shape,'shape'));
  var l6=document.createElement('div'); l6.className='v300-lbl'; l6.textContent='الفواصل المزخرفة بين أقسام الصلاة'; body.appendChild(l6);
  body.appendChild(seg('v300Orn',[['0','عادية'],['1','مزخرفة ✥']],S.orn?1:0,'orn'));
  var dimLab=$('v14Dimrow').previousElementSibling; if(dimLab&&dimLab.classList.contains('v14-row')) body.appendChild(dimLab); mv(body,$('v14Dimrow'));
  var em=$('uTkEmojiOn')&&$('uTkEmojiOn').closest('.v32-body'); if(em){ var l7=document.createElement('div'); l7.className='v300-lbl'; l7.textContent='إيموجي ردود «صوت الله»'; body.appendChild(l7); Array.prototype.slice.call(em.children).forEach(function(c){ if(!c.classList.contains('settings-reminder-note')) body.appendChild(c); }); }
  /* إعادة الضبط */
  var rs=document.createElement('button'); rs.type='button'; rs.className='settings-reset v300-reset'; rs.textContent='إعادة ضبط المظهر (الثيم والخطوط والشكل)'; body.appendChild(rs);
  rs.addEventListener('click',resetLook);
  /* تقسيم إلى مجموعات بخطوط فاصلة */
  (function(){ var kids=Array.prototype.slice.call(body.children), g=null, first=true;
    kids.forEach(function(c){
      if(c===pv||c.classList.contains('v300-reset')) return;
      if(c.classList.contains('v300-sub')){ g=document.createElement('div'); g.className='v300-grp'; body.insertBefore(g,c); g.appendChild(c); first=true; return; }
      if(!g) return;
      if(c.classList.contains('v300-lbl')||c.classList.contains('v14-row')){ if(!first||g.querySelectorAll('.v300-lbl,.v14-row').length) c.classList.add('v300-it'); }
      g.appendChild(c); first=false;
    });
  })();
  /* أقسام فرعية قابلة للطي (واحد مفتوح في كل مرة) */
  (function(){ var gs=Array.prototype.slice.call(body.querySelectorAll('.v300-grp'));
    gs.forEach(function(g){ var h=g.querySelector('.v300-sub'); var gb=document.createElement('div'); gb.className='v300-gb';
      Array.prototype.slice.call(g.children).forEach(function(c){ if(c!==h) gb.appendChild(c); }); g.appendChild(gb);
      h.setAttribute('role','button'); h.tabIndex=0; h.setAttribute('aria-expanded','false');
      function tg(){ var o=!g.classList.contains('v300-open'); gs.forEach(function(x){ x.classList.remove('v300-open'); var hh=x.querySelector('.v300-sub'); if(hh) hh.setAttribute('aria-expanded','false'); });
        if(o){ g.classList.add('v300-open'); h.setAttribute('aria-expanded','true'); setTimeout(function(){ try{ g.scrollIntoView({block:'start',behavior:'smooth'}); }catch(e){} },60); } }
      h.addEventListener('click',tg); h.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); tg(); } });
    }); })();
  /* التحريك داخل الإعدادات: أول قسم بعد الرأس */
  var head=q('.settings-head',panel); if(head&&head.nextSibling) panel.insertBefore(sec,head.nextSibling); else panel.appendChild(sec);
  /* إزالة الأقسام القديمة الفارغة */
  ['v14LaySec','themesSection','fontFamSection','lineSpacingSection','fontSizeSection'].forEach(function(id){ var e=$(id); if(e&&e.parentNode) e.parentNode.removeChild(e); });
  var ms=modeBody&&modeBody.closest('.settings-section'); if(ms&&ms.parentNode&&ms.id!=='v300Look') ms.parentNode.removeChild(ms);
  if(em){ var es=em.closest('.settings-section'); if(es&&!es.querySelector('button')) es.parentNode.removeChild(es); }
  /* أحداث الأدوار الجديدة */
  body.addEventListener('click',function(e){
    var b=e.target.closest('[data-v300]'); if(!b) return; var k=b.getAttribute('data-v300'), id=b.getAttribute('data-id');
    if(k==='hf') S.hf=id; else if(k==='uf') S.uf=id; else if(k==='shape') S.shape=id; else if(k==='orn') S.orn=id==='1'?1:0;
    save(); apply();
  });
  $('ffRow').addEventListener('click',function(){ setTimeout(function(){ apply(); },30); });
  paintUI(); setTimeout(accordion,0);
  return true;
}
/* أكورديون: فتح قسم يقفل الباقي، والكل مقفول افتراضيًا */
function accordion(){
  var panel=$('settingsPanel'); if(!panel||panel.__v300acc) return; panel.__v300acc=1;
  var prev=[];
  function secs(){return Array.prototype.slice.call(panel.querySelectorAll('.settings-section'));}
  function closeSec(x){ x.classList.remove('v32-open'); var l=x.querySelector(':scope>.v32-h'); if(l) l.setAttribute('aria-expanded','false'); }
  secs().forEach(closeSec);
  var busy=false;
  new MutationObserver(function(){
    if(busy) return; var open=secs().filter(function(x){return x.classList.contains('v32-open')});
    if(open.length>1){ var keep=open.filter(function(x){return prev.indexOf(x)<0}); var k=keep.length?keep[keep.length-1]:open[open.length-1];
      busy=true; open.forEach(function(x){ if(x!==k) closeSec(x); }); busy=false; open=[k]; }
    prev=open;
  }).observe(panel,{attributes:true,attributeFilter:['class'],subtree:true});
  new MutationObserver(function(){ if(!panel.classList.contains('open')){ busy=true; secs().forEach(closeSec); busy=false; prev=[]; } }).observe(panel,{attributes:true,attributeFilter:['class']});
}

function resetLook(){
  S={hf:'',uf:'',shape:'soft',orn:0}; save();
  var d=q('#ffRow [data-ff=""]'); if(d) d.click();
  var l=q('#lhRow [data-lh="0"]'); if(l) l.click();
  if(window.__rfTheme) window.__rfTheme.reset();
  apply();
}

/* ---------- ضمان قراءة النص: يفحص تباين كل نص في الإعدادات ويصلحه تلقائيًا في أي ثيم/تصميم ---------- */
function pc(c){var m=c.match(/-?[\d.]+(?:e-?\d+)?/g).map(Number);if(c.indexOf('color(')===0)return [m[0]*255,m[1]*255,m[2]*255,m[3]==null?1:m[3]];return [m[0],m[1],m[2],m[3]==null?1:m[3]];}
function LL(r,g,b){var f=function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(r)+.7152*f(g)+.0722*f(b);}
function CR(a,b){return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);}
function effBg(e){var layers=[],x=e;while(x){var cs=getComputedStyle(x),c=pc(cs.backgroundColor);
  if(c[3]>0)layers.push(c); if(c[3]>=1)break;
  if(/gradient/.test(cs.backgroundImage)){var m=cs.backgroundImage.match(/(?:rgba?|color)\([^)]+\)/g);if(m){var q=pc(m[0]);q[3]=1;layers.push(q);break;}}
  x=x.parentElement;}
  var r=255,g=255,b=255; layers.reverse();
  layers.forEach(function(l){r=l[0]*l[3]+r*(1-l[3]);g=l[1]*l[3]+g*(1-l[3]);b=l[2]*l[3]+b*(1-l[3]);});
  return [r,g,b];}
function effOp(e){var o=1,x=e;while(x&&x!==document.body){o*=parseFloat(getComputedStyle(x).opacity);x=x.parentElement;}return o;}
var fixT=0;
function fixInk(){
  var root=$('settingsPanel'); if(!root||!root.classList.contains('open')) return;
  var marked=root.querySelectorAll('[data-v300c]');
  Array.prototype.forEach.call(marked,function(e){e.style.removeProperty('color');if(e.getAttribute('data-v300c')==='o')e.style.removeProperty('opacity');e.removeAttribute('data-v300c');});
  var all=root.querySelectorAll('*');
  Array.prototype.forEach.call(all,function(e){
    var has=false;for(var i=0;i<e.childNodes.length;i++){var n=e.childNodes[i];if(n.nodeType===3&&n.textContent.trim()){has=true;break;}}
    if(!has) return; var r=e.getBoundingClientRect(); if(!r.width||!r.height) return;
    var cs=getComputedStyle(e); if(cs.visibility==='hidden') return;
    var fg=pc(cs.color), bg=effBg(e), op=effOp(e)*fg[3];
    var f=[0,1,2].map(function(i){return fg[i]*op+bg[i]*(1-op)});
    var bl=LL(bg[0],bg[1],bg[2]);
    if(CR(LL(f[0],f[1],f[2]),bl)>=4.5) return;
    var dark=CR(LL(20,14,8),bl), light=CR(LL(250,244,232),bl);
    e.style.setProperty('color',dark>=light?'#14100A':'#FAF4E8','important'); var o=1;
    if(parseFloat(cs.opacity)<1){e.style.setProperty('opacity','1','important');o='o';}
    e.setAttribute('data-v300c',o===1?'1':'o');
  });
}
function qfix(){ clearTimeout(fixT); fixT=setTimeout(fixInk,70); }
function watchInk(){
  var p=$('settingsPanel'); if(!p) return;
  new MutationObserver(qfix).observe(p,{attributes:true,attributeFilter:['class']});
  new MutationObserver(qfix).observe(H,{attributes:true,attributeFilter:['style','data-theme','data-design','data-layout','data-hf','data-uf','data-shape']});
  p.addEventListener('click',function(){setTimeout(fixInk,120);setTimeout(fixInk,500);},true);
}

function boot(){
  apply(); watchInk();
  var tries=0; (function go(){ if(build_ui()) return; if(++tries<40) setTimeout(go,150); })();
  var gr=$('settingsReset'); if(gr) gr.addEventListener('click',function(){ setTimeout(function(){ S={hf:'',uf:'',shape:'soft',orn:0}; save(); apply(); },50); });
}
window.__look={state:function(){return S},apply:apply,fonts:FONTS};
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
