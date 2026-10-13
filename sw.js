/* الرفيق الروحي — service worker (يُولَّد تلقائيًا من tools/build.mjs؛ لا تعدّله يدويًا)
   اسم الكاش = rafeeq-v71-<هاش كل الملفات> فلا يمكن نسيان رفع اللاحقة.
   عند التثبيت: الملف الذي لم يتغيّر (نفس الاسم المهشَّش) يُنسخ من الكاش القديم بدل تنزيله. */
const VER='rafeeq-v2.82-30da47560b';
const FILES=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./apple-touch-icon.png","./01-css-fonts.527f42d0bd.css","./03-css-k.2e37f90ea1.css","./04-css-r.189bec221e.css","./05-css-m.d91d476135.css","./06-css-unify.cdfae846a4.css","./07-css-feat.80e3a8cfbf.css","./08-css-v14.04f056a1cc.css","./09-css-v17.3b9fe0e0ff.css","./10-css-v21.889ef9b890.css","./11-css-v22.f2aeba00f7.css","./13-v30css.10e10bfc5c.css","./14-v36iso.60598b288d.css","./15-v32dual.cb06703be0.css","./16-v34fix.d81c449e80.css","./17-v33set.ec17b34f1d.css","./18-v40k.d1098e972f.css","./27-v55m.f2cf65572d.css","./29-anon.e58a5eaaec.js","./30-anon.4ef9de7a19.js","./31-anon.cdd5a50b71.js","./data-bibleData.e64361f795.js","./data-bgData.fcf82ceaa4.js","./34-anon.e47481277b.js","./35-anon.d04d83c9f5.js","./36-anon.50e112df49.js","./37-anon.c94ab4bc84.js","./38-anon.5ed3a3ba72.js","./39-anon.2e7212d271.js","./40-js-v14.600632bf98.js","./41-v55m-js.07a58e4c61.js","./42-v57-inst.1cb8a1f579.js","./45-v62nav.16d6ade3ea.css","./46-v62nav-js.3a5b5ad697.js","./47-v64ux.e2060c873e.css","./48-v64ux-js.cc1e9ef072.js","./50-v67ux-js.52283884ab.js","./51-v68mo.f62ad7db90.css","./52-v68mo-js.191d9563a4.js","./54-v69st-js.1edeb162dd.js","./55-v70me.863e3c58ef.css","./56-v70me-js.96e2cdb39d.js","./data-khalwaYear.e48cf2af84.js","./data-fathersData.7400e6846b.js","./data-xrData.850db9ab44.js","./58-v81gloss.1a5f045ff9.js","./70-v81xref.2394639e7e.css","./60-v281talk.f0f3eb5cb6.js","./71-v281talk.f5cd5f9098.css","./store.78b63c1c4e.js"];
self.addEventListener('install',e=>{e.waitUntil((async()=>{
  const c=await caches.open(VER);
  const olds=(await caches.keys()).filter(k=>k.startsWith('rafeeq-')&&k!==VER);
  await Promise.all(FILES.map(async f=>{
    try{
      for(const o of olds){ const h=await (await caches.open(o)).match(f,{ignoreSearch:true}); if(h&&/\.[0-9a-f]{10}\./.test(f)){ await c.put(f,h); return } }
      const r=await fetch(f,{cache:'reload'}); if(r&&r.ok) await c.put(f,r);
    }catch(x){}
  }));
  await self.skipWaiting();
})())});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('rafeeq-')&&x!==VER).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  const page=e.request.mode==='navigate'||/\/(index\.html|manifest\.webmanifest)?$/.test(u.pathname)||u.pathname.endsWith('manifest.webmanifest');
  if(page&&u.origin===location.origin){
    /* الصفحة والملف التعريفي: الشبكة أولًا (لتظهر النسخة الجديدة فورًا) ثم الذاكرة دون إنترنت */
    e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{ if(r&&r.ok){const cp=r.clone();caches.open(VER).then(c=>c.put(e.request.mode==='navigate'?'./index.html':e.request,cp))} return r })
      .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(h=>h||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{
    if(hit) return hit;
    return fetch(e.request).then(r=>{ if(r&&r.ok&&u.origin===location.origin){const cp=r.clone();caches.open(VER).then(c=>c.put(e.request,cp))} return r })
      .catch(()=>e.request.mode==='navigate'?caches.match('./index.html'):undefined);
  }));
});

/* ===== التنبيه اليومي (v75): خطة ١٤ يومًا تصل من الصفحة وتُحفظ في كاش منفصل (لا يُحذف عند تحديث النسخة) ===== */
const NPLAN='nplan-rafeeq';
self.addEventListener('message',e=>{
  const d=e.data; if(!d||d.type!=='rafeeq-notify-plan') return;
  e.waitUntil(caches.open(NPLAN).then(c=>c.put('plan',new Response(JSON.stringify({plan:d.plan||[]})))));
});
async function dueNotify(){
  const c=await caches.open(NPLAN), r=await c.match('plan'); if(!r) return;
  let st={plan:[],shown:[]}; try{ st=Object.assign(st,await r.json()); }catch(x){}
  const now=Date.now();
  const due=(st.plan||[]).filter(p=>p.at<=now&&now-p.at<18*3600*1000&&!(st.shown||[]).includes(p.tag)).sort((a,b)=>b.at-a.at)[0];
  if(!due) return;
  await self.registration.showNotification(due.title,{body:due.body,tag:due.tag,lang:'ar',dir:'rtl',icon:'icon-192.png',data:{url:'./'}});
  st.shown=(st.shown||[]).concat(due.tag).slice(-30);
  await c.put('plan',new Response(JSON.stringify(st)));
}
self.addEventListener('periodicsync',e=>{ if(e.tag==='rafeeq-daily') e.waitUntil(dueNotify()); });
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{ for(const c of cs){ if('focus' in c) return c.focus(); } return self.clients.openWindow((e.notification.data&&e.notification.data.url)||'./'); }));
});
