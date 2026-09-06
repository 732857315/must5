/** Build substitutes a content-derived version and the complete local asset list. */
const VERSION="524ed5d1199b38a531d3";
const FILES=["./index.html", "./style.css", "./app.mjs", "./core.mjs", "./geometry.mjs", "./star-points.mjs", "./search-budget.mjs", "./engine-worker.mjs", "./app.webmanifest", "./icon.svg", "./search.wasm", "./models/global.onnx", "./models/global5.onnx", "./models/global5x6.onnx", "./models/global5x7.onnx", "./models/global5x8.onnx", "./models/global6.onnx", "./models/global6x5.onnx", "./models/global6x7.onnx", "./models/global6x8.onnx", "./models/global7.onnx", "./models/global7x5.onnx", "./models/global7x6.onnx", "./models/global7x8.onnx", "./models/global8x5.onnx", "./models/global8x6.onnx", "./models/global8x7.onnx", "./models/opponent.onnx", "./models/play.onnx", "./vendor/ONNX-RUNTIME-LICENSE", "./vendor/ONNX-RUNTIME-ThirdPartyNotices.txt", "./vendor/ort-wasm-simd-threaded.mjs", "./vendor/ort-wasm-simd-threaded.wasm", "./vendor/ort.wasm.min.mjs", "./assets.json"];
const CACHE='must5-browser-'+VERSION;
self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  try{await cache.addAll(FILES);}catch(error){await caches.delete(CACHE);throw error;}
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  for(const key of await caches.keys())if(key.startsWith('must5-browser-')&&key!==CACHE)await caches.delete(key);
  await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);let response=await cache.match(event.request,{ignoreSearch:true});
    if(!response&&event.request.mode==='navigate')response=await cache.match('./index.html');
    return response||fetch(event.request);
  })());
});
self.addEventListener('message',event=>{
  if(event.data?.type!=='cache-status')return;
  event.waitUntil((async()=>{const cache=await caches.open(CACHE);let ready=true;
    for(const file of FILES)if(!await cache.match(file)){ready=false;break;}
    event.ports[0]?.postMessage({ready,version:VERSION});})());
});
