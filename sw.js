/* الرفيق الروحي — service worker (يُولَّد تلقائيًا من tools/build.mjs؛ لا تعدّله يدويًا)
   اسم الكاش = rafeeq-vX.Y-<هاش كل الملفات> فلا يمكن نسيان رفع اللاحقة.
   عند التثبيت: الملف الذي لم يتغيّر (نفس الاسم المهشَّش) يُنسخ من الكاش القديم بدل تنزيله. */
const VER='rafeeq-v6.8.74-d78e0c5eb9';
const FILES=["./","./app1.273564b62b.css","./app10.5e406585a9.js","./app11.75c77e52b7.js","./app12.0434c2ed8f.css","./app13.ce80f870a6.js","./app14.23395232b1.js","./app15.3e2fb4ee01.css","./app16.9334cc5660.js","./app17.6e75c5b621.js","./app18.75199c1167.css","./app19.0e1f4da5b0.js","./app2.dfb0ece651.css","./app20.8ea0d00654.css","./app21.5998120ffc.js","./app22.f34314b220.css","./app23.ec33dd919a.js","./app24.64bef61b35.css","./app25.1752584444.js","./app26.3b3bdec96d.css","./app27.7f5462b78d.js","./app28.1728c18c2a.css","./app29.b8cd161884.js","./app3.cde401c68b.css","./app30.512836eef0.css","./app31.92fac631a1.js","./app31.b6b8b4229d.css","./app32.90acad379c.css","./app33.70be288242.css","./app34.58b7be6547.css","./app35.7e20d9294f.js","./app35.9456d7a138.css","./app36.233547b5db.js","./app36.99a57698d4.css","./app37.db08da9dd5.js","./app38.be23a91ba4.js","./app39.bedf0ad186.css","./app39.f2671cc888.js","./app4.f185187a9b.css","./app40.d6b34b9a64.js","./app41.6215b978cc.js","./app42.8082d748a2.js","./app43.1cd9a17c69.js","./app44.3bf00c0847.js","./app45.441e0f6e5a.js","./app5.832e65c323.js","./app6.5ac9dae8c1.js","./app7.87be3efc9e.css","./app8.7fd92ebc24.js","./app9.2eaed645e4.css","./apple-touch-icon.png","./bg-bearer.jpg","./bg-crown.jpg","./bg-glory.jpg","./bg-holy.jpg","./bg-lamp.jpg","./bg-royal.jpg","./bg-shroud.jpg","./data-bgData.8b050226a6.js","./data-bibleData.74b20dd144.js","./data-ervData.7063836d9e.js","./data-ervHeads.6e154af5e5.js","./data-fathersData.26285256f1.js","./data-khalwaYear.3ff769bdec.js","./data-synData.3c9e0cb56a.js","./data-xrData.00d7e71032.js","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./index.html","./manifest.webmanifest","./store-core.30504cf0d6.js","./store.9a7e36b062.js"];
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
