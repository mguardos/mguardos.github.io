var FILES_CACHE="tsilio",version="V2017-09-08T17:11",urlsToCache=[".","index.html","../favicon.ico","../tsilio.css","../material/MaterialIcons-Regular.woff","../material/material.min.css","../material/material.min.js","js/idb.js","js/labels.js","js/tsilio.js","js/pure.js","manifest.json"];self.addEventListener("install",function(){return self.skipWaiting()}),self.addEventListener("activate",function(e){e.waitUntil(caches.open(FILES_CACHE).then(function(e){return console.log("caching 1 "),e.addAll(urlsToCache)}).then(function(){return console.log("caching 2"),self.clients.claim()}).catch(function(e){console.log("Error handling cache",e)}))}),self.addEventListener("fetch",function(e){console.log("SW - fetch listener: ",e.request.url),e.respondWith(caches.match(e.request).then(function(n){return n||fetch(e.request).then(function(e){return e})}).catch(function(e){console.log("SW - Error fetching static resource from cache: ",e.message)}))});