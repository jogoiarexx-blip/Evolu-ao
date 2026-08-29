const VERSION = "evolucao-1.2.1-smart-notifications";
const CACHE = VERSION;
const CORE = ["./","./index.html","./css/style.css","./js/app.js","./js/build-info.js","./js/migrations.js","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png"];
self.addEventListener("install", event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE))); });
self.addEventListener("activate", event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });

// HTML: rede primeiro. Assets estáticos: cache primeiro com atualização em segundo plano.
self.addEventListener("fetch", event => {
  if(event.request.method!=="GET")return; const url=new URL(event.request.url); if(url.origin!==self.location.origin)return;
  const isDoc=event.request.mode==="navigate"||url.pathname.endsWith("/")||url.pathname.endsWith(".html");
  if(isDoc){event.respondWith(fetch(event.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(event.request,copy)).catch(()=>{});return r;}).catch(()=>caches.match(event.request).then(hit=>hit||caches.match("./index.html"))));return;}
  event.respondWith(caches.match(event.request).then(hit=>{const net=fetch(event.request).then(r=>{if(r&&r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(event.request,copy)).catch(()=>{});}return r;}).catch(()=>hit);return hit||net;}));
});
self.addEventListener("message", event => { if(event.data&&event.data.type==="SKIP_WAITING")self.skipWaiting(); });

self.addEventListener("notificationclick", event => {
  const action=event.action||"",data=event.notification.data||{};event.notification.close();
  if(action==="later")return;
  let target=data.url||"./index.html";
  if(action==="add-water")target="./index.html?action=water&quick=250";
  else if(action==="workout")target="./index.html?action=workout";
  else if(action==="nutrition")target="./index.html?action=nutrition";
  event.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{for(const c of list){if("navigate" in c)return c.navigate(target).then(()=>c.focus());}if(clients.openWindow)return clients.openWindow(target);}));
});
self.addEventListener("push", event => {let data={};try{data=event.data?event.data.json():{};}catch(e){data={body:event.data?event.data.text():"Hora de conferir sua evolução."};}event.waitUntil(self.registration.showNotification(data.title||"EVOLUÇÃO",{body:data.body||"Você tem uma atualização.",icon:"icons/icon-192.png",badge:"icons/icon-192.png",tag:data.tag||"evolucao-push",renotify:false,data:{url:data.url||"./index.html"},actions:data.actions||[]}));});
