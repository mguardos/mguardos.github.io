const dbName = "bbTestDB",
  dbVersion = 3,
  dbStore = "projects";

// Prototype variables
var iDBprjData = [];

function initializeSelect(){
	var prjData = getProjectsData();
	if (!prjData || !prjData.length) {
		prjData[0] = { id: 0, text: "Not possible to retrieve information" };
	}
	updateSelect(prjData);
};

function updateSelect( arrayProjects ) {
  var selElement = document.querySelector( "#projectSel" );
  selElement.innerHTML = "";
  for ( item of arrayProjects ) {
    var opt = document.createElement( "option" );
    opt.value = item.id;
    opt.innerHTML = item.text; // whatever property it has

    // then append it to the select element
    selElement.appendChild( opt );
  }
};

// Clean indexDB projects store
function deleteIndexDB( ) {
  var transaction = db.transaction( dbStore, "readwrite" );
  var objectStore = transaction.objectStore( dbStore );
  var request = objectStore.clear( );
  request.onsuccess = function( event ) {
    console.log( "objectStore cleared" );
  }

  transaction.oncomplete = function( event ){
  	console.log("deleteIndexDB completed successfully");
  };

  transaction.onerror = function( event ){
  	console.error("deleteIndexDB error: ", event.target);
  };
};


// Update content into indexedDB
function updateIndexDB( projectData ){

  var transaction = db.transaction( dbStore, "readwrite" );
  var objectStore = transaction.objectStore( dbStore );

	// remove all entries from the store. This can be optimized if possible to handle deltas
  var request = objectStore.clear( );
  request.onsuccess = function( event ) {
	  for ( var i in projectData ) {
	    objectStore.add( projectData[ i ] );
	  }
  };
  
  transaction.oncomplete = function( event ){
  	console.log("updateIndexDB completed successfully");
  };

  transaction.onerror = function( event ){
  	console.error("updateIndexDB error: ", event.target);
  };
}


// Retrieves content for the projects select
function getProjectsData( ) {
  // Check if access to online information - simulated by a text file on the github server
  if ( (typeof(projectData) !== "undefined") && projectData ){
    // If available online, update IndexedDB
    updateIndexDB( projectData );
    return projectData;
  }


  else {
	  // otherwise, check if it already exists in IndexDB
	  // var fromIdbProjects = [ ];
	  // var transaction = db.transaction( [ dbStore ] );
	  // var objStore = transaction.objectStore( dbStore );

	  // var request = objStore.getAll( );
	  // objStore.openCursor( ).onsuccess = function( event ) {
	  //   var cursor = event.target.result;
	  //   if ( cursor ) {
	  //     fromIdbProjects.push( cursor.value );
	  //     cursor.continue( );
	  //   } else {
	  //     console.log( "IndexDB read completed" );
	  //     return( fromIdbProjects );
	  //   }
	  // };
	  // objStore.openCursor( ).onerror = function( event ) {
	  // 	return [];
	  // }
	  // transaction.oncomplete = function( event ) {
	  //   console.log( "getProjectsData completed" );
	  // };

	  // transaction.onerror = function( event ) {
	  //   console.error( "Error creating list of projects", event.target );
	  // };

	  	return iDBprjData;
	}
}

// Make sure indexedDB can be referenced for any supporting browser
// In the following line, you should include the prefixes of implementations you want to test.
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// DON'T use "var indexedDB = ..." if you're not in a function.
// Moreover, you may need references to some window.IDB* objects:
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || { READ_WRITE: "readwrite" }; // This line should only be needed if it is needed to support the object's constants for older browsers
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if ( !window.indexedDB ) {
  console.log( "This browser doesn't support a stable version of IndexedDB. Offline features will not be available." );
}

// Define variables to be used for the prototype
var db;
var request = window.indexedDB.open( dbName, dbVersion );

request.onerror = function( event ) {
  console.log( "Error creating the database: ", event.target );
};
request.onsuccess = function( event ) {
  db = event.target.result;
  // Retrieve information to store in database
  var transaction = db.transaction( [ dbStore ], "readwrite" );
  // Note: Older experimental implementations use the deprecated constant IDBTransaction.READ_WRITE instead of "readwrite".
  // In case you want to support such an implementation, you can write: 
  // var transaction = db.transaction([dbStore], IDBTransaction.READ_WRITE);
  var objectStore = transaction.objectStore( dbStore );
  iDBprjData = [];
  // Update application from database entries - if no connection
  objectStore.openCursor( ).onsuccess = function( event ) {
    var cursor = event.target.result;
    if ( cursor ) {
      iDBprjData.push( cursor.value );
      cursor.continue( );
    } else {
      console.log( "No more entries!" );
    }
  };

  // Do something when all the data is added to the database.
  transaction.oncomplete = function( event ) {
    //updateSelect( fromIdbProjects );
    console.log( "DB store successfully read", event.target );
  };

  transaction.onerror = function( event ) {
    console.error( "Error creating list of projects", event.target );
  };

};

// This event is called when necessary to adjust the db structure
// First time the DB is created and each time version is updated
request.onupgradeneeded = function( event ) {
  db = event.target.result;

  // Create an objectStore to hold information about our projects. We're
  // going to use "id" as our key path because it's guaranteed to be
  // unique - or at least that's what I was told during the kickoff meeting.

  // Delete existing store if previously created
  if ( event.oldVersion )
    db.deleteObjectStore( dbStore );

  var objectStore = db.createObjectStore( dbStore, { keyPath: "id" } );

  // Create an index to search projects by text. We may have duplicates
  // so we can't use a unique index.
  objectStore.createIndex( "text", "text", { unique: false } );

  // Use transaction oncomplete to make sure the objectStore creation is 
  // finished before adding data into it.
  objectStore.transaction.oncomplete = function( event ) {
    console.log( "new IndexexDB succesfully created" );
  };

  objectStore.transaction.onerror = function( event ) {
    console.error( "Error creating list of projects", event.target );
  };
};
