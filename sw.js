// The files we want to cache
// Version 1

var CACHE_NAME = 'protCache';
var urlsToCache = [
  'indexSW.html',
  'prot.js',
  'offline.jpg'
];

// Set the callback for the install step
self.addEventListener( 'install', function( event ){
    // Perform install steps
    event.waitUntil(
    caches.open( CACHE_NAME )
      .then( function( cache ) {
        console.log( 'Opened cache: ', CACHE_NAME );
        return cache.addAll( urlsToCache );
      })
      // The following call will activate the new Service Worker immediately
      // This seems obvious because if a new SW is available, it means there is connectivity and old cached files can be replaced
      .then( function( ){
        self.skipWaiting( );
      })
      .catch( function( ){
        console.log("Error skipWaiting");
      })
  );        
});

self.addEventListener('fetch', function(event) {
  console.log("fetched request: ", event.request);    
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
      	console.log("caching match: ", response);
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request)
          .catch(function(){
            return caches.match('offline.jpg');
            }
          );
          // .then(
          //   function(response){
          //     // Do something
          //   }
          // );
      }
    )
  );
});

self.addEventListener( 'activate', function( event ){
  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys( )
      .then( function( keyList ){
      return Promise.all( keyList.map( function( key ){
        if ( cacheWhitelist.indexOf( key ) === -1 ){
          console.log( "Deleting cache: ", CACHE_NAME, key );
          return caches.delete(key);
        }
      }));
    })
  );
});

//self.addEventListener('push', function(event) {
//  console.log('Push message received', event);
  // TODO
//});