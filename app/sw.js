var FILES_CACHE="files-v0.6.5",urlsToCache=["index.html",".","../favicon.ico","../tsilio.css","js/idb.js","js/labels.js","js/tsilio.js","js/pure.js","manifest.json"],corsUrls=["https://fonts.googleapis.com/icon?family=Material+Icons","https://code.getmdl.io/1.3.0/material.teal-green.min.css","https://code.getmdl.io/1.3.0/material.min.js","https://fonts.gstatic.com/s/materialicons/v24/2fcrYFNaTjcS6g4U3t-Y5UEw0lE80llgEseQY3FEmqw.woff2"];self.addEventListener("install",function(){return self.skipWaiting()}),self.addEventListener("activate",function(e){e.waitUntil(caches.open(FILES_CACHE).then(function(e){return console.log("caching 1 "),e.addAll(urlsToCache)}).then(function(){return console.log("caching 2"),self.clients.claim()}).catch(function(e){console.log("Error handling cache",e)}))}),self.addEventListener("fetch",function(e){console.log("SW - fetch listener: ",e.request.url),e.respondWith(caches.match(e.request).then(function(t){return console.log("caching match: ",t),t||(console.log("SW - no cache match - calling network: ",e.request.url),fetch(e.request).then(function(t){return console.log("SW - static resource non previously cached",t.url),caches.open(FILES_CACHE).then(function(c){return console.log("SW - static resource non previously cached (now added to cache)",t.url),-1!==corsUrls.indexOf(e.request.url)&&c.put(e.request,t.clone()),t})}))}).catch(function(e){console.log("SW - Error fetching static resource from cache: ",e.message)}))});