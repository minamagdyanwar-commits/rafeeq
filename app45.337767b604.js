/* وضع القيادة للكتاب المقدس: قراءة صوتية للفصل الحالي وما بعده، بنفس واجهة وضع القيادة للصلاة */
(function(){
"use strict";
function F(){return window.__F||{}}
function q(s,r){return (r||document).querySelector(s)}
function startPoint(){var B=F().bible,S=B.state;
  if(S.view==='read')return {b:S.b,c:S.c,msg:''};
  var rm=B.readMap?B.readMap():{};
  if(S.view==='chapters'){var n=B.data[S.b].c.length;for(var c=1;c<=n;c++){if(!rm[S.b+':'+c])return {b:S.b,c:c,msg:c>1?'بدأ من أول إصحاح لم تقرأه':''}}return {b:S.b,c:1,msg:''}}
  var best=null;for(var k in rm){var p=k.split(':').map(Number),d=String(rm[k]);if(!best||d>best.d||(d===best.d&&(p[0]*1000+p[1])>(best.b*1000+best.c)))best={b:p[0],c:p[1],d:d}}
  if(best){var tot=B.data[best.b]&&B.data[best.b].c.length;return {b:best.b,c:(tot&&best.c<tot)?best.c+1:best.c,msg:'أكمل من حيث توقفت'}}
  return {b:0,c:1,msg:'بدأ من بداية الكتاب'}}
function seqFrom(){var B=F().bible;if(!B||!B.state||!B.data||!B.verses)return null;
  var sp=startPoint(),b=sp.b,c0=sp.c,bk=B.data[b];if(!bk||!bk.c)return null;
  var last=Math.min(bk.c.length,c0+19),seq=[];
  for(var ch=c0;ch<=last;ch++){var vs=B.verses(b,ch)||[];if(!vs.length)continue;var paras=[];
    for(var i=0;i<vs.length;i+=2)paras.push(vs.slice(i,i+2).join(' '));
    seq.push({title:B.label(b,ch),ref:B.label(b,ch),paras:paras})}
  return seq.length?{seq:seq,name:bk.n||'',msg:sp.msg,first:B.label(b,c0)}:null}
function open(){var f=F();
  if(!window.__dmOpenSeq||!('speechSynthesis' in window)){f.toast&&f.toast('القراءة الصوتية غير متاحة في هذا المتصفح');return}
  var B=f.bible;var go=function(){var r=seqFrom();if(!r){f.toast&&f.toast('تعذر تجهيز القراءة');return}
    window.__dmOpenSeq(r.seq,'الكتاب المقدس'+(r.name?' · '+r.name:''),null,0);
    if(r.msg)setTimeout(function(){f.toast&&f.toast('🚗 '+r.msg+' — «'+r.first+'»')},350);
    setTimeout(function(){var pb=document.getElementById('dmPlay');pb&&pb.click()},60)};
  if(B&&B.load)B.load().then(go,go);else go()}
function inReader(){var f=F();try{return !!q('#page-trk.on')&&!!(f.isBibleTab&&f.trkTab&&f.isBibleTab(f.trkTab()))}catch(e){return !!q('#page-trk.on .bible-text')}}
function mount(){var host=q('#trkBody');if(!host||q('.rd-drive',host))return;var anchor=q('.xr-bar',host)||q('.rd-head',host);if(!anchor||!q('.bible-text',host))return;
  var b=document.createElement('button');b.type='button';b.className='rd-drive';b.setAttribute('data-bdrive','1');b.innerHTML='🚗 وضع القيادة <small>اسمع هذا الفصل وما بعده</small>';anchor.after(b)}
new MutationObserver(mount).observe(document.body,{childList:true,subtree:true});
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-bdrive]');if(!t)return;e.preventDefault();e.stopPropagation();open()},true);
function wrap(){var d=window.__driveOpen;if(typeof d==='function'&&!d.__bd){var w=function(){if(inReader())return open();return d.apply(this,arguments)};w.__bd=1;window.__driveOpen=w}
  var u=document.getElementById('uDrive');if(u&&!u.hidden){var s=q('small',u);var want=inReader()?'قراءة صوتية للكتاب المقدس':'قراءة صوتية للصلاة';if(s&&s.textContent!==want)s.textContent=want}}
setInterval(wrap,400);wrap();
})();
