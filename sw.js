/** Build substitutes a content-derived version and the complete local asset list. */
const VERSION="0b6f71715bfea2b56fff";
const FILES=["./app.mjs", "./app.webmanifest", "./core.mjs", "./engine-worker.mjs", "./geometry.mjs", "./icon.svg", "./index.html", "./models/global.onnx", "./models/global5.onnx", "./models/global5x6.onnx", "./models/global5x7.onnx", "./models/global5x8.onnx", "./models/global6.onnx", "./models/global6x5.onnx", "./models/global6x7.onnx", "./models/global6x8.onnx", "./models/global7.onnx", "./models/global7x5.onnx", "./models/global7x6.onnx", "./models/global7x8.onnx", "./models/global8x5.onnx", "./models/global8x6.onnx", "./models/global8x7.onnx", "./models/opponent.onnx", "./models/play.onnx", "./search-budget.mjs", "./search.wasm", "./star-points.mjs", "./style.css", "./vendor/ONNX-RUNTIME-LICENSE", "./vendor/ONNX-RUNTIME-ThirdPartyNotices.txt", "./vendor/ort-wasm-simd-threaded.mjs", "./vendor/ort-wasm-simd-threaded.wasm", "./vendor/ort.wasm.min.mjs", "./assets.json"];
const SCOPE=self.registration.scope;
const PREFIX='must5-browser-'+encodeURIComponent(SCOPE)+'-';
const CACHE=PREFIX+VERSION;
self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  try{await cache.addAll(FILES);}catch(error){await caches.delete(CACHE);throw error;}
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  for(const key of await caches.keys()){
    if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);
    // Migrate an old unscoped cache only when every entry belongs to this app.
    if(/^must5-browser-[0-9a-f]{20}$/.test(key)){
      const entries=await (await caches.open(key)).keys();
      if(entries.length&&entries.every(request=>request.url.startsWith(SCOPE)))await caches.delete(key);
    }
  }
  await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||!event.request.url.startsWith(SCOPE))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);let response=await cache.match(event.request,{ignoreSearch:true});
    if(!response&&event.request.mode==='navigate')response=await cache.match('./index.html');
    return response||fetch(event.request);
  })());
});
self.addEventListener('message',event=>{
  if(event.data?.type!=='cache-status')return;
  event.waitUntil((async()=>{const cache=await caches.open(CACHE);
    const ready=(await Promise.all(FILES.map(file=>cache.match(file)))).every(Boolean);
    event.ports[0]?.postMessage({ready,version:VERSION});})());
});
