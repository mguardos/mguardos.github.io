// The files we want to cache
const version = '19';

var CACHE_NAME = 'protCache';
var urlsToCache = [
  'index.html',
  'combined.js',
  'offline.jpg',
  'indexDB.js'
];

// Set the callback for the install step
self.addEventListener( 'install', function( event ){
    // Perform install steps
    event.waitUntil(
    caches.open( CACHE_NAME )
      .then( function( cache ) {
        showMsg( 'Opened cache: ', CACHE_NAME );
        return cache.addAll( urlsToCache );
      })
      // The following call will activate the new Service Worker immediately
      // This seems obvious because if a new SW is available, it means there is connectivity and old cached files can be replaced
      .then( function( ){
        self.skipWaiting( );
      })
      .catch( function( ){
        showMsg("Error skipWaiting");
      })
  );        
});

self.addEventListener('fetch', function(event) {
  showMsg("fetched request: ", event.request);    
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
      	showMsg("caching match: ", response);
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
            showMsg( "Deleting cache: ", CACHE_NAME, key );
            return caches.delete(key);
          }
        }));
      })
      .then( function( ){
        // Commented line is suppoed to 'activate' all pages cached by the SW but did not seem to work
        self.clients.claim( );
        // Below line does not work either. Pending to identify how to refresh the page or make sure
        // that all resources are properly up to date after updating the SW $$$$
        //window.location.reload( true );
      })
      .catch( function( ){
        showMsg("error during activation");
      })
  );
});

//self.addEventListener('push', function(event) {
//  showMsg('Push message received', event);
  // TODO
//});