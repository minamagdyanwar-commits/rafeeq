/* الرفيق الروحي — service worker (يُولَّد تلقائيًا من tools/build.mjs؛ لا تعدّله يدويًا)
   اسم الكاش = rafeeq-vX.Y-<هاش كل الملفات> فلا يمكن نسيان رفع اللاحقة.
   عند التثبيت: الملف الذي لم يتغيّر (نفس الاسم المهشَّش) يُنسخ من الكاش القديم بدل تنزيله. */
const VER='rafeeq-v4.3-eb63055d0b';
const FILES=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./apple-touch-icon.png","./01-css-fonts.527f42d0bd.css","./03-css-k.2e37f90ea1.css","./04-css-r.189bec221e.css","./05-css-m.d91d476135.css","./06-css-unify.cdfae846a4.css","./07-css-feat.80e3a8cfbf.css","./08-css-v14.04f056a1cc.css","./09-css-v17.3b9fe0e0ff.css","./10-css-v21.889ef9b890.css","./11-css-v22.f2aeba00f7.css","./13-v30css.10e10bfc5c.css","./14-v36iso.60598b288d.css","./15-v32dual.cb06703be0.css","./16-v34fix.d81c449e80.css","./17-v33set.ec17b34f1d.css","./18-v40k.d1098e972f.css","./27-v55m.f2cf65572d.css","./29-anon.207f946737.js","./30-anon.55b6b89bfb.js","./31-anon.43d6ed651a.js","./data-bibleData.35f8d6cb7a.js","./data-bgData.fcf82ceaa4.js","./34-anon.fb49a0d6ea.js","./35-anon.47d9b0f6d2.js","./36-anon.aad79c27c5.js","./37-anon.c94ab4bc84.js","./38-anon.5ed3a3ba72.js","./39-anon.68b6778e0f.js","./40-js-v14.b5cd6d4940.js","./41-v55m-js.c542792cc1.js","./42-v57-inst.1cb8a1f579.js","./45-v62nav.16d6ade3ea.css","./46-v62nav-js.3a5b5ad697.js","./47-v64ux.e2060c873e.css","./48-v64ux-js.bdae6404ca.js","./50-v67ux-js.52283884ab.js","./51-v68mo.f62ad7db90.css","./52-v68mo-js.191d9563a4.js","./54-v69st-js.1edeb162dd.js","./55-v70me.863e3c58ef.css","./56-v70me-js.96e2cdb39d.js","./data-khalwaYear.35d79692aa.js","./data-fathersData.f6d567765e.js","./data-xrData.850db9ab44.js","./58-v81gloss.1a5f045ff9.js","./70-v81xref.681a7e41b3.css","./60-v281talk.6ae1d1152b.js","./71-v281talk.69a77a798e.css","./61-v282meaning.a6c3e16684.js","./62-v290favs.04fd0c16b0.js","./63-v297link.3983ec635d.js","./64-v298fix.feb7b49bf2.js","./75-v298fix.c547b89fea.css","./65-v299lines.319797afd6.js","./76-v299lines.3c51da61b8.css","./77-fontsx.7dab705ba2.css","./78-v300look.bdf8358c5c.css","./66-v300look.95edc2121f.js","./80-guideddata.21f17c7eee.js","./81-v330guided.c8547377de.js","./83-v370letter.794f693c12.js","./82-v330guided.7a8db888a8.css","./74-v297link.6f4b983142.css","./72-v290favs.84fe4fbcf5.css","./73-v296size.2a037c2b2d.css","./data-ervHeads.92f1ee6f1b.js","./data-ervData.c4d9b8e355.js","./store.78b63c1c4e.js"];
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
