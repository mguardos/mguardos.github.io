// Create service worker
if ( 'serviceWorker' in navigator ) {
  // $$$$$ Change path and location for sw.js to propefly cache common files from the root
  navigator.serviceWorker.register( 'sw.js' ).then( function( registration ) {
    // Registration was successful
    console.log( 'ServiceWorker registration successful with scope: ', registration.scope );
    if ( registration.installing ) {
      console.log( 'Service worker installing' );
    } else if ( registration.waiting ) {
      console.log( 'Service worker installed' );
    } else if ( registration.active ) {
      console.log( 'Service worker active' );
    }
  } ).catch( function( err ) {
    // registration failed :(
    console.log( 'ServiceWorker registration failed: ', err );
  } )

  // AppCache management
} else {

};

function saveLocalStorage( ) {
  var data = {
    hours: document.querySelector("input[name=numericField1]").value,
    date: document.querySelector("input[name=dateField1]").value,
    comment: document.querySelector("input[name=textField1]").value,
  }
  // it would be possible to find a unique id for object to be saved
  // user + project + day or something like that
  // then replace "data" by the object key.
  // We may need a method to clean up deprecated stored items though
  localStorage.setItem( "dataLS", JSON.stringify(data));
}

function retrieveLocalStorage( ) {
  var data = JSON.parse(localStorage.getItem("dataLS"));
  document.querySelector("input[name=numericField1]").value = data.hours;
  document.querySelector("input[name=dateField1]").value = data.date;
  document.querySelector("input[name=textField1]").value = data.comment;
}

function saveIdb( ) {
  console.log("Within saveOffline: ", this);
  var data = {
    id: "1",
    hours: document.querySelector("input[name=numericField1]").value,
    date: document.querySelector("input[name=dateField1]").value,
    comment: document.querySelector("input[name=textField1]").value,
  }
  Storage.prototype.setObject( "data", data);
}
