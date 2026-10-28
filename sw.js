/* الرفيق الروحي — service worker (يُولَّد تلقائيًا من tools/build.mjs؛ لا تعدّله يدويًا)
   اسم الكاش = rafeeq-vX.Y-<هاش كل الملفات> فلا يمكن نسيان رفع اللاحقة.
   عند التثبيت: الملف الذي لم يتغيّر (نفس الاسم المهشَّش) يُنسخ من الكاش القديم بدل تنزيله. */
const VER='rafeeq-v6.8.116-76c0e9189b';
const FILES=["./","./app1.fd40aa14de.css","./app10.5e406585a9.js","./app11.75c77e52b7.js","./app12.059022be0e.css","./app13.5d5e99c1dc.js","./app14.799996e446.js","./app15.5ae393fccc.css","./app16.c676e7643e.js","./app17.6e75c5b621.js","./app18.00b8e1fb1d.css","./app19.484d289ffc.js","./app2.76d8b890c0.css","./app20.8a7cab97dc.css","./app21.07560bf97c.js","./app22.fbb1d14ecd.css","./app23.23eec79e39.js","./app24.1801abd1f5.css","./app25.94b23f8a96.js","./app26.c97f6892b6.css","./app27.84ecfe7972.js","./app28.e824aca6ed.css","./app29.5fd8780923.js","./app3.b2925e71bd.css","./app30.ce40c4f5d4.css","./app31.204408aea6.js","./app31.7e75fbdad5.css","./app32.08a5f74f79.css","./app33.7266e275e0.css","./app34.30f33ec62d.css","./app35.d890b75435.js","./app35.e5b7a954ef.css","./app36.0de4a53779.css","./app36.5801f3c4a1.js","./app37.19723ef28f.js","./app38.62eab1b385.js","./app39.332e2576e2.css","./app39.4e709d29e3.js","./app4.805072e5ab.css","./app45.e57caa64c3.js","./app46.329b0a57e1.css","./app46.b88aeebb17.js","./app47.783c1b8a81.js","./app49.ce7f9dc0ab.css","./app5.b40b15aadc.js","./app50.3ff9a101fd.js","./app50.b53132cdb8.css","./app6.26d9be8435.js","./app7.dff7520e62.css","./app8.7fd92ebc24.js","./app9.b1bfacff52.css","./apple-touch-icon.png","./bg-bearer.jpg","./bg-crown.jpg","./bg-glory.jpg","./bg-holy.jpg","./bg-lamp.jpg","./bg-royal.jpg","./bg-shroud.jpg","./data-bgData.8b050226a6.js","./data-bibleData.74b20dd144.js","./data-ervData.7063836d9e.js","./data-ervHeads.6e154af5e5.js","./data-fathersData.26285256f1.js","./data-hymns.6910333a50.js","./data-journeys.1aa5c43d8a.js","./data-khalwaYear.3ff769bdec.js","./data-synData.3c9e0cb56a.js","./data-xrData.00d7e71032.js","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./index.html","./manifest.webmanifest","./store-core.95117b743b.js","./store.c26dc1c66d.js"];
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
