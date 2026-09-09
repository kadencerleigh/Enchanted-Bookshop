const CACHE="enchanted-bookshop-v4-23-bookshop-atmospheres";
const CORE=[
 "./",
 "./index.html",
 "./styles.css?v=4.27.15",
 "./app.js?v=4.27.15",
 "./manifest.json?v=4.27.15",
 "./icon-192.png?v=4.27.15",
 "./icon-512.png"
];

self.addEventListener("install",e=>{
 self.skipWaiting();
 e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));
});

self.addEventListener("activate",e=>{
 e.waitUntil(
  caches.keys()
   .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
   .then(()=>self.clients.claim())
 );
});

self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET") return;
 const u=new URL(e.request.url);
 if(u.origin!==location.origin) return;

 // For page navigations, prefer the newest network response, fall back offline.
 if(e.request.mode==="navigate"){
  e.respondWith(
   fetch(e.request)
    .then(r=>{
      const cp=r.clone();
      caches.open(CACHE).then(c=>c.put("./index.html",cp));
      return r;
    })
    .catch(()=>caches.match("./index.html"))
  );
  return;
 }

 // Versioned assets are safe to cache-first.
 e.respondWith(
  caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{
   const cp=r.clone();
   caches.open(CACHE).then(c=>c.put(e.request,cp));
   return r;
  }))
 );
});
