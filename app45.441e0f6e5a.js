/* وضع القيادة للكتاب المقدس: قراءة صوتية للفصل الحالي وما بعده، بنفس واجهة وضع القيادة للصلاة */
(function(){
"use strict";
function F(){return window.__F||{}}
function q(s,r){return (r||document).querySelector(s)}
/* نقطة البداية: داخل فصل = هذا الفصل ويقرأ فورًا · قائمة إصحاحات سفر = أول السفر ويقرأ فورًا · قائمة الأسفار = سفر افتراضي بلا تشغيل تلقائي ليختار المستخدم */
function lastReadBook(B){var rm=B.readMap?B.readMap():{},best=null;for(var k in rm){var p=k.split(':').map(Number),d=String(rm[k]);if(!best||d>best.d)best={b:p[0],d:d}}return best?best.b:0}
function startPoint(){var B=F().bible,S=B.state;
  if(S.view==='read')return {b:S.b,c:S.c,auto:true};
  if(S.view==='chapters')return {b:S.b,c:1,auto:true};
  return {b:lastReadBook(B),c:1,auto:false,hint:'اختر السفر من القائمة العليا، والإصحاحات من «الأقسام»، ثم اضغط تشغيل'}}
function seqOf(b){var B=F().bible,bk=B.data[b],seq=[];if(!bk||!bk.c)return seq;
  for(var ch=1;ch<=bk.c.length;ch++){var vs=B.verses(b,ch)||[];if(!vs.length)continue;var paras=[];
    for(var i=0;i<vs.length;i+=2)paras.push(vs.slice(i,i+2).join(' '));
    seq.push({title:B.label(b,ch),ref:B.label(b,ch),paras:paras})}
  return seq}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function openAt(b,ch,auto,hint){var f=F(),B=f.bible;var seq=seqOf(b);if(!seq.length){f.toast&&f.toast('تعذر تجهيز القراءة');return}
  var name=B.data[b].n||'';
  window.__dmOpenSeq(seq,'الكتاب المقدس · '+name,null,Math.max(0,Math.min(seq.length-1,ch-1)));
  var jump=document.getElementById('dmJump');var row=jump&&jump.closest('.dm-sel');
  if(row&&!document.getElementById('dmBook')){var r=document.createElement('div');r.className='dm-sel';r.id='dmBkRow';
    var sel=document.createElement('select');sel.id='dmBook';sel.setAttribute('aria-label','اختر السفر');sel.style.flex='1';
    var h='';for(var i=0;i<B.data.length;i++){if(B.data[i]&&B.data[i].c&&B.data[i].c.length)h+='<option value="'+i+'"'+(i===b?' selected':'')+'>'+esc(B.data[i].n||('سفر '+i))+'</option>'}
    sel.innerHTML=h;sel.onchange=function(){openAt(+sel.value,1,false,'')};r.appendChild(sel);row.parentNode.insertBefore(r,row)}
  if(hint)setTimeout(function(){f.toast&&f.toast('🚗 '+hint)},350);
  if(auto)setTimeout(function(){var pb=document.getElementById('dmPlay');pb&&pb.click()},60)}
function open(){var f=F();
  if(!window.__dmOpenSeq||!('speechSynthesis' in window)){f.toast&&f.toast('القراءة الصوتية غير متاحة في هذا المتصفح');return}
  var B=f.bible;var go=function(){var sp=startPoint();openAt(sp.b,sp.c,sp.auto,sp.hint||'')};
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
