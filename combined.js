// Version to debug cache issues :: V1
// Hack to handle messages in console when possible and in browser when testing elsewhere
// Detect whether Chrome dev tools is open
// var element = new Image();
// var consoleOpen = false;
// Object.defineProperty(element, 'id', {
//   get: function () {
//     consoleOpen = true;
//   }
// });
// console.log('%cHello', element);

// Debuggin message to display messages during multi-browser testing
function showMsg(message, dyn){
  if (!dyn)
      dyn = '';
  // Check whether to display messages via console or window alert
  if (!document.querySelector("input[name=popupAlerts]").checked)
    console.log(message, dyn);
  else
    window.alert(message + ' - ' + dyn);
}
// End of browser testing hack

// Create service worker
if ( 'serviceWorker' in navigator ) {
  // $$$$$ Change path and location for sw.js to propefly cache common files from the root
  navigator.serviceWorker.register( 'sw.js' ).then( function( registration ) {
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
  } )


// Check browser storage abuser $$$$
// demo.agektmr.com/storage

  // AppCache management
} else if ('applicationCache' in window) {
  // Load iframe with appCache
  // As suggested by both Jake Archibald and Patrick Kettner
  let iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'load-appcache.html'
  document.body.appendChild(iframe);
  showMsg("Iframe loaded for AppCache management");

} else {
  showMsg("no service worker - no appCache");
}


function saveLocalStorage( ) {
  var data = {
    hours: document.querySelector("input[name=numericField1]").value,
    date: document.querySelector("input[name=dateField1]").value,
    comment: document.querySelector("input[name=textField1]").value,
    popupAlerts: document.querySelector("input[name=popupAlerts]").checked
  }
  // it would be possible to find a unique id for object to be saved
  // user + project + day or something like that
  // then replace "data" by the object key.
  // We may need a method to clean up deprecated stored items though
  localStorage.setItem( "dataLS", JSON.stringify(data));
}

function retrieveLocalStorage( ) {
  var data = JSON.parse(localStorage.getItem("dataLS"));
  if (data){
    document.querySelector("input[name=numericField1]").value = data.hours || "0";
    document.querySelector("input[name=dateField1]").value = data.date;
    document.querySelector("input[name=textField1]").value = data.comment || "";
    document.querySelector("input[name=popupAlerts]").checked = Boolean(data.popupAlerts) || false;
  }
}

