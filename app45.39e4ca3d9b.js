/* وضع القيادة للكتاب المقدس: قراءة صوتية للفصل الحالي وما بعده، بنفس واجهة وضع القيادة للصلاة */
(function(){
"use strict";
function F(){return window.__F||{}}
function q(s,r){return (r||document).querySelector(s)}
function seqFrom(){var B=F().bible;if(!B||!B.state||!B.data||!B.verses)return null;
  var b=B.state.b,c0=B.state.c,bk=B.data[b];if(!bk||!bk.c)return null;
  var last=Math.min(bk.c.length,c0+19),seq=[];
  for(var ch=c0;ch<=last;ch++){var vs=B.verses(b,ch)||[];if(!vs.length)continue;var paras=[];
    for(var i=0;i<vs.length;i+=2)paras.push(vs.slice(i,i+2).join(' '));
    seq.push({title:B.label(b,ch),ref:B.label(b,ch),paras:paras})}
  return seq.length?{seq:seq,name:bk.n||''}:null}
function open(){var f=F();
  if(!window.__dmOpenSeq||!('speechSynthesis' in window)){f.toast&&f.toast('القراءة الصوتية غير متاحة في هذا المتصفح');return}
  var B=f.bible;var go=function(){var r=seqFrom();if(!r){f.toast&&f.toast('افتح فصلًا من الكتاب المقدس أولًا');return}
    window.__dmOpenSeq(r.seq,'الكتاب المقدس'+(r.name?' · '+r.name:''),null,0);
    setTimeout(function(){var pb=document.getElementById('dmPlay');pb&&pb.click()},60)};
  if(B&&B.load)B.load().then(go,go);else go()}
function inReader(){return !!q('#page-trk.on .bible-text')}
function mount(){var host=q('#trkBody');if(!host||q('.rd-drive',host))return;var anchor=q('.xr-bar',host)||q('.rd-head',host);if(!anchor||!q('.bible-text',host))return;
  var b=document.createElement('button');b.type='button';b.className='rd-drive';b.setAttribute('data-bdrive','1');b.innerHTML='🚗 وضع القيادة <small>اسمع هذا الفصل وما بعده</small>';anchor.after(b)}
new MutationObserver(mount).observe(document.body,{childList:true,subtree:true});
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-bdrive]');if(!t)return;e.preventDefault();e.stopPropagation();open()},true);
function wrap(){var d=window.__driveOpen;if(typeof d==='function'&&!d.__bd){var w=function(){if(inReader())return open();return d.apply(this,arguments)};w.__bd=1;window.__driveOpen=w}
  var u=document.getElementById('uDrive');if(u&&!u.hidden){var s=q('small',u);var want=inReader()?'قراءة صوتية للكتاب المقدس':'قراءة صوتية للصلاة';if(s&&s.textContent!==want)s.textContent=want}}
setInterval(wrap,400);wrap();
})();
