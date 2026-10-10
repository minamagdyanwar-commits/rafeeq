/* الرفيق الروحي — service worker (يُولَّد تلقائيًا من tools/build.mjs؛ لا تعدّله يدويًا)
   اسم الكاش = rafeeq-v71-<هاش كل الملفات> فلا يمكن نسيان رفع اللاحقة.
   عند التثبيت: الملف الذي لم يتغيّر (نفس الاسم المهشَّش) يُنسخ من الكاش القديم بدل تنزيله. */
const VER='rafeeq-v71-0dd7bc1aa9';
const FILES=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./apple-touch-icon.png","./01-css-fonts.527f42d0bd.css","./03-css-k.38123114eb.css","./04-css-r.1933e247ea.css","./05-css-m.8ec38eb61c.css","./06-css-unify.b6f54b7d23.css","./07-css-feat.c481e6c838.css","./08-css-v14.aa45c7244d.css","./09-css-v17.6fe5bdbde7.css","./10-css-v21.3dfd93b6e3.css","./11-css-v22.bf12c2bf13.css","./13-v30css.b2d3164fdf.css","./14-v36iso.7f951ee29d.css","./15-v32dual.ac6ea1f96a.css","./16-v34fix.0873d7fd55.css","./17-v33set.ec17b34f1d.css","./18-v40k.d1098e972f.css","./27-v55m.f2cf65572d.css","./29-anon.c09780845a.js","./30-anon.4ef9de7a19.js","./31-anon.cdd5a50b71.js","./data-bibleData.e64361f795.js","./data-bgData.fcf82ceaa4.js","./34-anon.e47481277b.js","./35-anon.fb5e9f9a6c.js","./36-anon.7e388a1226.js","./37-anon.c94ab4bc84.js","./38-anon.5ed3a3ba72.js","./39-anon.000150e219.js","./40-js-v14.abcd182294.js","./41-v55m-js.6032ecfee5.js","./42-v57-inst.1cb8a1f579.js","./45-v62nav.96c482aa62.css","./46-v62nav-js.3a5b5ad697.js","./47-v64ux.334245fe4e.css","./48-v64ux-js.cc1e9ef072.js","./50-v67ux-js.52283884ab.js","./51-v68mo.f62ad7db90.css","./52-v68mo-js.191d9563a4.js","./54-v69st-js.1edeb162dd.js","./55-v70me.c08611b82d.css","./56-v70me-js.48f0f3b1be.js","./store.78b63c1c4e.js"];
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
