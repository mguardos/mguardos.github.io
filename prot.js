// Create service worker
if ('serviceWorker' in navigator) {
	// $$$$$ Change path and location for sw.js to propefly cache common files from the root
	navigator.serviceWorker.register('sw.js').then(function(registration) {
      // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
    if(registration.installing) {
      console.log('Service worker installing');
    } else if(registration.waiting) {
      console.log('Service worker installed');
    } else if(registration.active) {
      console.log('Service worker active');
    }
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  })

// AppCache management
} else {
  	
};
