
/* ===================== الكتاب المقدس (دون إنترنت) ===================== */
(function(){
'use strict';
var F=window.__F, $=F.$, B=F.bible={data:null,loading:null,flat:null};

B.load=function(){
  if(B.data) return Promise.resolve(B.data);
  if(B.loading) return B.loading;
  function dec(id,raw){
    var el=$(id); if(!el) return Promise.resolve(null);
    var bin=atob(el.textContent.trim()), u=new Uint8Array(bin.length);
    for(var i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i);
    if(typeof DecompressionStream==='undefined') return Promise.reject(new Error('nodecomp'));
    var stream=new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Response(stream).text().then(function(t){var o=JSON.parse(t);return raw?o:o.books});
  }
  B.loading=dec('bibleData').then(function(all){B.data=all;
    return dec('bgData',1).then(function(g){B.bg={};(g||[]).forEach(function(e){B.bg[e.i]=e});return all},function(){B.bg={};return all});});
  B.loading.catch(function(){B.loading=null});
  return B.loading;
};
/* ترتيب القراءة: العهد القديم، ثم الأسفار القانونية الثانية (إن وُجدت)، ثم العهد الجديد */
B.order=function(){return B.data.map(function(_,i){return i})};
B.chNum=function(bi,ci){var b=B.data[bi];return b.cn?b.cn[ci-1]:ci};
B.vNum=function(bi,ci,vi){var b=B.data[bi];return vi+(b.vn?b.vn[ci-1]:1)-1};
B.chPos=function(bi,num){var b=B.data[bi];if(!b.cn)return (num>=1&&num<=b.c.length)?num:0;var i=b.cn.indexOf(num);return i<0?0:i+1};
B.label=function(bi,ch,v1,v2){
  var s=B.data[bi].n+(B.data[bi].n==='المزمور ١٥١'?'':' '+F.ard(B.chNum(bi,ch)));
  if(v1){var a=B.vNum(bi,ch,v1),z=v2&&v2!==v1?B.vNum(bi,ch,v2):0; s+=': '+F.ard(a)+(z?'–'+F.ard(z):'');}
  return s;
};
B.verses=function(bi,ch,v1,v2){
  var c=B.data[bi].c[ch-1]; if(!c) return [];
  v1=v1||1; v2=v2||c.length; return c.slice(v1-1,v2);
};
var AD={'٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9'};
B.parseRef=function(q){
  q=String(q).replace(/[٠-٩]/g,function(d){return AD[d]}).replace(/[،,؛]/g,':').trim();
  var m=q.match(/^(.*?)\s*(\d+)\s*(?::|\s)\s*(\d+)?\s*(?:[-–—]\s*(\d+))?$/); if(!m) return null;
  var name=F.norm(m[1]).replace(/\s+/g,' ').trim(); if(!name) return null;
  var best=-1;
  B.data.forEach(function(b,i){ if(F.norm(b.n).replace(/\s+/g,' ')===name) best=i; });
  if(best<0){ var cands=[]; B.data.forEach(function(b,i){ if(F.norm(b.n).indexOf(name)===0) cands.push(i); }); if(cands.length===1) best=cands[0]; }
  if(best<0) return null;
  var b=B.data[best], ch=B.chPos(best,+m[2]); if(!ch) return null;
  var off=(b.vn?b.vn[ch-1]:1)-1, n=b.c[ch-1].length;
  var v1=m[3]?+m[3]-off:null, v2=m[4]?+m[4]-off:v1;
  if(v1&&(v1<1||v1>n)) return null; if(v2&&v2>n) v2=n;
  return {bi:best,ch:ch,v1:v1,v2:v2};
};
B.buildFlat=function(){
  if(B.flat) return B.flat;
  var f=[]; B.data.forEach(function(b,bi){b.c.forEach(function(c,ci){c.forEach(function(t,vi){f.push({bi:bi,ch:ci+1,v:vi+1,n:F.norm(t)})})})});
  B.flat=f; return f;
};
B.search=function(q,limit){
  var toks=F.norm(q).split(/\s+/).filter(function(t){return t.length>0}); if(!toks.length) return [];
  var flat=B.buildFlat(), out=[];
  for(var i=0;i<flat.length&&out.length<(toks.length>1?4000:(limit||40));i++){
    var s=flat[i].n, ok=true; for(var k=0;k<toks.length;k++){ if(s.indexOf(toks[k])<0){ok=false;break} }
    if(ok) out.push(flat[i]);
  }
  var ph=F.norm(q).trim();
  if(toks.length>1) out.sort(function(a,b){return (b.n.indexOf(ph)>-1)-(a.n.indexOf(ph)>-1)});
  return out.slice(0,limit||40);
};

/* ---------- حالة القارئ ---------- */
var RK='rafeeq_bread_v1', LK='rafeeq_blast_v1';
B.readMap=function(){return F.jget(RK,{})};
B.isRead=function(bi,ch){return !!B.readMap()[bi+':'+ch]};
B.setRead=function(bi,ch,on,tag){var m=B.readMap();if(on)m[bi+':'+ch]=tag||F.dkey();else delete m[bi+':'+ch];F.jset(RK,m)};
var R={view:'books',b:0,c:1,sel:{}};
B.state=R;

function bookGroups(){
  var g=[{t:['OT','DC'],n:'العهد القديم (يشمل القانونية الثانية، بحسب ترتيب الكنيسة)'},{t:['NT'],n:'العهد الجديد'}];
  return g.map(function(x){return {n:x.n,idx:B.data.map(function(b,i){return x.t.indexOf(b.t)>-1?i:-1}).filter(function(i){return i>=0})}}).filter(function(x){return x.idx.length});
}

B.render=function(host){
  host=host||$('trkBody');
  if(!B.data){
    host.innerHTML='<div class="u-card pad c">جارٍ تجهيز الكتاب المقدس…</div>';
    B.load().then(function(){B.render(host)},function(){host.innerHTML='<div class="u-card pad c">تعذّر فتح الكتاب المقدس على هذا المتصفح. حدّث المتصفح وجرّب مرة أخرى.</div>'});
    return;
  }
  if(R.view==='books') renderBooks(host);
  else if(R.view==='chapters') renderChapters(host);
  else renderRead(host);
};
function renderBooks(host){
  var last=F.jget(LK,null);
  var h='<div class="u-card pad"><input id="bibleQ" class="u-in" type="search" placeholder="ابحث بكلمة أو بمرجع (مثال: يوحنا ٣: ١٦)" autocomplete="off"><div id="bibleRes"></div></div>';
  if(last&&B.data[last.b]) h+='<button class="u-wide" data-bgo="'+last.b+':'+last.c+'">متابعة من حيث توقفت — '+F.esc(B.label(last.b,last.c))+'</button>';
  bookGroups().forEach(function(g){
    h+='<h3 class="u-h3">'+g.n+'</h3><div class="bk-grid">'+g.idx.map(function(i){return '<button data-bk="'+i+'"'+(B.data[i].t==='DC'?' class="dcb" title="من الأسفار القانونية الثانية"':'')+'>'+F.esc(B.data[i].n)+'</button>'}).join('')+'</div>';
  });
  h+='<p class="u-note">النص: الكتاب المقدس — النسخة المراجَعة (موقع الأنبا تكلا هيمانوت، الكنيسة القبطية الأرثوذكسية)، بدون تشكيل. يشمل الأسفار القانونية الثانية. المرجع: st-takla.org</p>';
  host.innerHTML=h;
  var q=$('bibleQ'), res=$('bibleRes'), tm;
  q.addEventListener('input',function(){
    clearTimeout(tm); tm=setTimeout(function(){
      var v=q.value.trim(); if(!v){res.innerHTML='';return}
      var ref=B.parseRef(v), html='';
      if(ref){ html+='<button class="u-res" data-bgo="'+ref.bi+':'+ref.ch+':'+(ref.v1||'')+'"><b>'+F.esc(B.label(ref.bi,ref.ch,ref.v1,ref.v2))+'</b><span>'+F.esc(B.verses(ref.bi,ref.ch,ref.v1,ref.v2).slice(0,2).join(' '))+'</span></button>'; }
      var r=B.search(v,40);
      html+=r.map(function(x){var t=B.data[x.bi].c[x.ch-1][x.v-1];return '<button class="u-res" data-bgo="'+x.bi+':'+x.ch+':'+x.v+'"><b>'+F.esc(B.label(x.bi,x.ch,x.v))+'</b><span>'+F.esc(t)+'</span></button>'}).join('');
      if(!html) html='<div class="u-note">لا توجد نتائج.</div>';
      res.innerHTML=html;
    },180);
  });
}
function introHtml(bi,open){
  var g=B.bg&&B.bg[bi]; if(!g||!g.intro) return '';
  var t=g.intro, rows=[['الكاتب',t.author],['زمن الكتابة',t.date],['مكان الكتابة',t.place],['المخاطَبون',t.audience],['الموضوع',t.theme]].filter(function(r){return r[1]});
  var h='<details class="bg-card bg-intro"'+(open?' open':'')+'><summary>مقدمة '+F.esc(B.data[bi].n)+'</summary><div class="bg-body">';
  rows.forEach(function(r){h+='<p><b>'+r[0]+':</b> '+F.esc(r[1])+'</p>'});
  if(t.outline&&t.outline.length){h+='<p><b>المحتوى:</b></p><ul>'+t.outline.map(function(x){return '<li>'+F.esc(x)+'</li>'}).join('')+'</ul>'}
  if(t.note) h+='<p class="bg-note">'+F.esc(t.note)+'</p>';
  h+=refsHtml(g)+'</div></details>';
  return h;
}
function refsHtml(g){
  if(!g.refs||!g.refs.length) return '';
  return '<div class="bg-refs"><b>المراجع:</b> '+g.refs.map(function(r,i){return '<a href="'+F.esc(r.u)+'" target="_blank" rel="noopener">['+F.ard(i+1)+'] '+F.esc(r.t)+'</a>'}).join('')+'<br><span>الروابط تحتاج إنترنت. هذه المقدمة والخلفية للشرح والدراسة، وتلخّص ما ورد في المراجع المذكورة؛ يُنصح بمراجعتها قبل الاعتماد عليها في التدريس.</span></div>';
}
function chBgHtml(bi,ch){
  var g=B.bg&&B.bg[bi]; if(!g||!g.ch) return '';
  var c=g.ch[ch-1]; if(!c||(!c.s&&!c.b)) return '';
  var h='<details class="bg-card bg-ch" open><summary>خلفية وتوضيح</summary><div class="bg-body">';
  if(c.s) h+='<p><b>الخلاصة:</b> '+F.esc(c.s)+'</p>';
  if(c.b) h+='<p><b>للفهم:</b> '+F.esc(c.b)+'</p>';
  return h+refsHtml(g)+'</div></details>';
}
function renderChapters(host){
  var b=B.data[R.b], h='<button class="u-back" data-bback="books"><i class=chv>›</i> الأسفار</button><h2 class="u-h2">'+F.esc(b.n)+'</h2>'+introHtml(R.b,true)+'<div class="ch-grid">';
  for(var i=1;i<=b.c.length;i++) h+='<button data-bgo="'+R.b+':'+i+'" class="'+(B.isRead(R.b,i)?'done':'')+'">'+F.ard(B.chNum(R.b,i))+'</button>';
  host.innerHTML=h+'</div>';
}
function renderRead(host){
  var b=B.data[R.b], n=b.c.length, vs=b.c[R.c-1];
  var h='<div class="rd-head"><button data-bnav="-1" '+(isFirst()?'disabled':'')+' aria-label="السابق"><i class=chv>›</i></button>'+
        '<button class="rd-title" data-bback="chapters">'+F.esc(b.n)+(b.n==='المزمور ١٥١'?'':' '+F.ard(B.chNum(R.b,R.c)))+'</button>'+
        '<button data-bnav="1" '+(isLast()?'disabled':'')+' aria-label="التالي"><i class=chv>‹</i></button></div>';
  h+='<div class="u-card pad bible-text" id="bibleText">'+vs.map(function(t,i){
    var v=i+1; return '<p class="bv'+(R.sel[v]?' sel':'')+(R.hl===v?' hl':'')+'" data-v="'+v+'"><sup>'+F.ard(B.vNum(R.b,R.c,v))+'</sup> '+F.esc(t)+'</p>';}).join('')+'</div>';
  if(R.c===1) h=h.replace('<div class="u-card pad bible-text"',introHtml(R.b,false)+'<div class="u-card pad bible-text"');
  h+=chBgHtml(R.b,R.c);
  h+='<div class="rd-foot"><button class="u-wide '+(B.isRead(R.b,R.c)?'on':'')+'" data-bread="1">'+(B.isRead(R.b,R.c)?'✓ قرأتُ هذا الإصحاح':'علّم الإصحاح كمقروء')+'</button></div>';
  h+='<div class="sel-bar" id="selBar" hidden><span id="selCount" aria-live="polite" aria-atomic="true"></span><button data-bact="copy">نسخ</button><button data-bact="save">حفظ</button><button data-bact="mine">لي ♡</button><button data-bact="note">ملاحظة</button><button data-bact="clear">إلغاء</button></div>';
  host.innerHTML=h; updSel();
  F.jset(LK,{b:R.b,c:R.c});
  if(R.hl){ var el=host.querySelector('.bv.hl'); if(el) setTimeout(function(){el.scrollIntoView({block:'center'})},50); }
}
function orderPos(){var o=B.order();return {o:o,p:o.indexOf(R.b)}}
function isFirst(){var x=orderPos();return x.p===0&&R.c===1}
function isLast(){var x=orderPos();return x.p===x.o.length-1&&R.c===B.data[R.b].c.length}
function selList(){return Object.keys(R.sel).map(Number).sort(function(a,b){return a-b})}
function updSel(){
  var bar=$('selBar'); if(!bar) return; var s=selList(); bar.hidden=!s.length;
  $('selCount').textContent=s.length?F.ard(s.length)+' آية':'';
}
function selText(){
  var s=selList(), vs=B.data[R.b].c[R.c-1];
  var ref=B.label(R.b,R.c,s[0],s[s.length-1]);
  return {ref:ref,text:s.map(function(v){return vs[v-1]}).join(' '),s:s};
}
B.open=function(bi,ch,v){R.b=bi;R.c=ch;R.view='read';R.sel={};R.hl=v||null;};
F.openBible=function(bi,ch,v){
  B.load().then(function(){ B.open(bi,ch,v); window.__rafeeq.show('trk',{top:1}); F.setTrkTab('bible'); });
};

document.addEventListener('click',function(e){
  var t=e.target, host=$('trkBody'); if(!host||!host.contains(t)) return;
  var el;
  if((el=t.closest('[data-bk]'))){R.b=+el.dataset.bk;R.view='chapters';B.render();return}
  if((el=t.closest('[data-bgo]'))){var p=el.dataset.bgo.split(':');R.b=+p[0];R.c=+p[1];R.hl=p[2]?+p[2]:null;R.view='read';R.sel={};B.render();window.scrollTo(0,0);return}
  if((el=t.closest('[data-bback]'))){R.view=el.dataset.bback;R.hl=null;B.render();return}
  if((el=t.closest('[data-bnav]'))){
    var d=+el.dataset.bnav, x=orderPos(), nc=R.c+d;
    if(nc>=1&&nc<=B.data[R.b].c.length){R.c=nc}
    else{ var np=x.p+d; if(np>=0&&np<x.o.length){R.b=x.o[np];R.c=d>0?1:B.data[R.b].c.length} }
    R.sel={};R.hl=null;B.render();window.scrollTo(0,0);return;
  }
  if((el=t.closest('[data-bread]'))){B.setRead(R.b,R.c,!B.isRead(R.b,R.c));B.render();F.toast(B.isRead(R.b,R.c)?'تم التعليم كمقروء':'أُلغي التعليم');return}
  if((el=t.closest('.bv'))){var v=+el.dataset.v; if(R.sel[v]) delete R.sel[v]; else R.sel[v]=1; el.classList.toggle('sel'); updSel(); return}
  if((el=t.closest('[data-bact]'))){
    var a=el.dataset.bact; if(a==='clear'){R.sel={};B.render();return}
    var st=selText();
    if(a==='copy'){F.copy('«'+st.text+'»\n('+st.ref+')')}
    if(a==='save'){F.addVerse({ref:st.ref,text:st.text});} if(a==='mine'){ window.__rfMine&&window.__rfMine(st.ref,st.text); }
    if(a==='note'){F.noteDialog({src:st.ref,body:'«'+st.text+'»\n('+st.ref+')\n\n'});}
    return;
  }
});
})();

