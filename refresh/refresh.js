// Version to debug cache issues :: V1

// Debugging message to display messages during multi-browser testing
function showMsg(message, dyn){
  if (!dyn)
      dyn = '';
  // Check whether to display messages via console or window alert
  if ((document.querySelector('input[name=popupAlerts]').checked) || 
    (localStorage.getItem('alerts')))
    window.alert(message + ' - ' + dyn);
  else
    console.log(message, dyn);
}

// Create service worker
if ( 'serviceWorker' in navigator ) {
  // $$$$$ Change path and location for sw.js to propefly cache common files from the root
  navigator.serviceWorker.register( 'sw-refresh.js' ).then( function( registration ) {
    // Registration was successful
    showMsg( 'ServiceWorker registration successful with scope: ', registration.scope );
    if ( registration.installing ) {
      showMsg( 'Service worker installing' );
    } else if ( registration.waiting ) {
      showMsg( 'Service worker installed' );
    } else if ( registration.active ) {
      showMsg( 'Service worker active' );
    }
  } ).catch( function( err ) {
    // registration failed :(
    showMsg( 'ServiceWorker registration failed: ', err );
  } );
    // Handler for messages coming from the service worker
  navigator.serviceWorker.addEventListener('message', function(event){
    // newVersion flag will be set true for each new SW activation
    if (event.data.newVersion)
      reloadPage('SW');
  });


// Check browser storage abuser $$$$
// demo.agektmr.com/storage

  // AppCache management
} else if ('applicationCache' in window) {
  // Load iframe with appCache
  // As suggested by both Jake Archibald and Patrick Kettner
  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'load-appcache.html'
  document.body.appendChild(iframe);
  showMsg('Iframe loaded for AppCache management');

  // // Check if a new cache is available on page load.
  // window.addEventListener('load', function(e) {

  //   window.applicationCache.addEventListener('updateready', function(e) {
  //     if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
  //       // Browser downloaded a new app cache.
  //       if (confirm('A new version of this site is available. Load it?')) {
  //         window.location.reload();
  //       }
  //     } else {
  //       // Manifest didn't changed. Nothing new to server.
  //     }
  //   }, false);

  // }, false);

} else {
  showMsg('no service worker - no appCache');
}

  // Upon SW update, the application refreshes twice:
  // First one to update SW file and read other files, second to push new files to browser
  // We want to clean variables only after the final refresh
// Update interrupted inputs in case of a forced update
if (localStorage.getItem('updExample')) {
  document.querySelector('input[name=updExample]').value = localStorage.getItem('updExample');
}


function reloadPage(label){
  showMsg('about to reload page...');
  top.location.reload();
}


function checkUpdates(){
  showMsg('Checking updates ...');
  // This logic would be called whenever an update service returns that the current version is outdated
  // simulated by the screen input
  if (document.querySelector('#updatedApp').checked) {
    window.alert('There is a new version of the application. It will be reloaded and your changes will be saved');
    saveEntriesTemp();    
    reloadPage();
  }

}

function showMsgFlag(){
  if (document.querySelector('input[name=popupAlerts]').checked) 
    localStorage.setItem('alerts', true);
  else
    localStorage.removeItem('alerts');
}

function saveEntriesTemp(){
  localStorage.setItem('updExample', document.querySelector('input[name=updExample]').value);
}