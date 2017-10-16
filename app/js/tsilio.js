function showMsg(e,t){t||(t=""),-1!==window.location.href.indexOf("alt=y")?window.alert(e+" - "+t):console.log(e,t)}var b=!0;if("serviceWorker"in navigator&&b)navigator.serviceWorker.register("sw.js").then(function(e){showMsg("ServiceWorker registration successful with scope: ",e.scope),e.installing?showMsg("Service worker installing"):e.waiting?showMsg("Service worker installed"):e.active&&showMsg("Service worker active")}).catch(function(e){showMsg("ServiceWorker registration failed: ",e)}),navigator.serviceWorker.addEventListener("controllerchange",function(){navigator.serviceWorker.controller.addEventListener("statechange",function(){"activated"===this.state&&window.location.reload(!0)})});else if("applicationCache"in window){var iframe=document.createElement("iframe"),onUpdateReady=function(){window.location.reload(!0)};iframe.style.display="none",iframe.src="load-appcache.html",document.body.appendChild(iframe),showMsg("Iframe loaded for AppCache management "),window.applicationCache.addEventListener("updateready",onUpdateReady),window.applicationCache.status===window.applicationCache.UPDATEREADY&&onUpdateReady()}else showMsg("no service worker - no appCache");var $n={settings:{lang:(navigator.language||navigator.userLanguage||"en").substr(0,2),fontSize:1.2,filters:!0},version:"2017-10-16T04:32",start:function(){this.consoleLog("language: ",$n.settings.lang),labels[$n.settings.lang]||($n.settings.lang="en"),document.querySelectorAll(".toTranslate").forEach(function(e){e.innerHTML=labels[$n.settings.lang][e.innerHTML]}),this.idbMgr.openDB().then(function(){$n.consoleLog("start - idb open SUCCESS. "),$n.srvMgr.showList()},function(e){$n.consoleLog("start - opening DB ERROR: ",e.message)}),this.consoleLog("start - completed"),_idb.setLog(this.consoleLog),window.setTimeout(function(){(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', 'UA-103383911-1', 'auto');ga('send', 'pageview');},1e3)},checkNewVersion:function(){if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").then(function(e){e.update(),caches&&caches.keys().then(function(e){return Promise.all(e.map(function(e){return caches.delete(e)}))})}).catch(function(e){$n.consoleLog("ServiceWorker registration failed: ",e)});else if("applicationCache"in window){var e=new XMLHttpRequest;e.open("GET","offline.appcache?ts="+(new Date).getTime()),e.responseType="text",e.onload=function(){if(200===this.status){var e=this.responseText.split("\n")[2].split("V")[1];$n.version!==e&&window.location.reload(!0)}},e.send()}},checkPattern:function(e,t){var n,i="",o=t.split(" ");for(n=0;n<o.length;n++)i+=o[n]?o[n]+".*":"";return new RegExp(i).exec(e)},consoleLog:function(){console.log((new Date).getTime(),arguments);var e,t,n="",i=document.querySelector(".debugging .messages");for(t=0;t<arguments.length;t++)n+=arguments[t]?arguments[t].toString()+" - ":"";n=(new Date).getTime()+": "+n,console.log(n),e=document.createElement("p"),e.appendChild(document.createTextNode(n)),i.insertBefore(e,i.firstChild),i.childNodes.length>500&&i.removeChild(i.lastChild)},eventMgr:{zoom:function(e){$n.settings.fontSize+=parseInt(e/100)/10,$n.settings.fontSize=Math.min(2,$n.settings.fontSize),$n.settings.fontSize=Math.max(1,$n.settings.fontSize),document.styleSheets[2].cssRules[document.styleSheets[2].cssRules.length-1].style.fontSize=$n.settings.fontSize+"rem"}},errorMgr:{display:function(e){window.alert(e.title||" - "+e.text)}},gestureMgr:{scaling:{0:{x1:0,y1:0,x2:0,y2:0},1:{x1:0,y1:0,x2:0,y2:0}},oteHandler:function(e){var t,n=$n.gestureMgr.scaling;n[1].x1&&(n[e.changedTouches[0].identifier].x2=e.changedTouches[0].pageX,n[e.changedTouches[0].identifier].y2=e.changedTouches[0].pageY,e.touches.length||(t=Math.abs(n[1].y2-n[0].y2)-Math.abs(n[1].y1-n[0].y1),$n.eventMgr.zoom(t),n={0:{x1:0,y1:0,x2:0,y2:0},1:{x1:0,y1:0,x2:0,y2:0}}))},otsHandler:function(e){2===e.touches.length&&($n.gestureMgr.scaling[0].x1=e.touches[0].pageX,$n.gestureMgr.scaling[0].y1=e.touches[0].pageY,$n.gestureMgr.scaling[1].x1=e.touches[1].pageX,$n.gestureMgr.scaling[1].y1=e.touches[1].pageY)}},idbMgr:{openDB:function(e,t){try{return new Promise(function(n,i){window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;$n.consoleLog("iDB - openDB. "),e||(e="Tsilio"),t||(t=1);var o=_idb.indexedDB.open(e,t);o.onerror=function(n){$n.consoleLog("IndexedDB cannot be opened: ",n.target.error.name),i({error:n.target.error,dbName:e,dbVersion:t})},o.onsuccess=function(e){$n.consoleLog("indexedDB available: ",e.target.result.name),_idb.db=e.target.result,n()},o.onupgradeneeded=function(e){var t=e.target.result;$n.consoleLog("onupgradeneeded: ",e);try{t.deleteObjectStore("items")}catch(e){$n.consoleLog("ObjectStore items not available for deletion: ",e.name)}try{t.deleteObjectStore("tags")}catch(e){$n.consoleLog("ObjectStore tags not available for deletion: ",e.name)}try{t.deleteObjectStore("settings")}catch(e){$n.consoleLog("ObjectStore settings not available for deletion: ",e.name)}objStoreItems=t.createObjectStore("items",{keyPath:"id"}),objStoreTags=t.createObjectStore("tags",{keyPath:"id"}),objStoreUser=t.createObjectStore("user",{keyPath:"type"}),objStoreItems.transaction.oncomplete=function(e){$n.consoleLog("ObjectStore items succesfully created: ",e)},objStoreItems.transaction.onerror=function(e){console.error("Error creating items object store: ",e.target)},objStoreTags.transaction.oncomplete=function(e){$n.consoleLog("ObjectStore tags succesfully created: ",e)},objStoreTags.transaction.onerror=function(e){console.error("Error creating tags object store: ",e.target)},objStoreUser.transaction.oncomplete=function(e){$n.consoleLog("ObjectStore user succesfully created: ",e)},objStoreUser.transaction.onerror=function(e){console.error("Error creating user object store: ",e.target)}},o.onblocked=function(e){$n.consoleLog("IndexedDB cannot be opened: ",e.target.error.name),i(e)}})}catch(e){$n.consoleLog("iDB - openBR - ERROR caught: ",e.message)}}},langMgr:{getLabel:function(e,t){var n=t?labels[$n.settings.lang][t]:labels[$n.settings.lang];return n&&n[e]||labels[$n.settings.lang].missingLabel}},normalize:function(e){return String(e).toLowerCase().replace(/\s/g,"").replace(/[^\w]/g,"")},srvMgr:{param:{item:{},touchTriggerTime:300},closeDetail:function(e){document.querySelector(".detail").classList.add("_h"),document.querySelector(".detail").innerHTML="",document.querySelector(".versionControl").classList.remove("_h"),e.preventDefault(),window.setTimeout(function(){$n.srvMgr.filterRefresh()},200)},deleteItem:function(e){document.querySelector(".detail").innerHTML="",_idb.saveItemToIDB(this.param.item.id,"items",!0),e.preventDefault(),window.setTimeout(function(){$n.srvMgr.filterRefresh()},200)},doNothing:function(){},filterAdd:function(e,t){if(!t||!t.inputType){_idb.getItemPromise("tags",$n.normalize(e.value)).then(function(t){if(e.value="",!Object.keys(t).length)return void $n.errorMgr.display({text:"Filter does not exist"});$n.srvMgr.filterRefresh(t.id),e.focus()})}},filterDelete:function(e,t){document.querySelector(".main .tag[data-tid="+t+" ]").remove(),this.filterRefresh()},filterRefresh:function(e,t){var n,i,o,r={},a=[];for(t=t||"AND",n=document.querySelectorAll(".main .tags .mdl-chip"),i=0;i<n.length;i++)a.push(n[i].getAttribute("data-tid"));if(e&&a.push(e),a.sort(),!a.length)return void this.refresh();_idb.getItemsById("tags",a).then(function(e){var n=[];for(i=0;i<e.length;i++)for(o=0;o<e[i].items.length;o++)r[e[i].items[o]]=r[e[i].items[o]]+1||1;n="OR"===t?r.keys():JSON.stringify(r).match(new RegExp('\\d{13}(?=":'+e.length+")","g")).map(parseFloat),_idb.getItemsById("items",n).then(function(t){var n={elems:t};$p(".templates .t_main .main").compile(directives.main);document.querySelector(".main").innerHTML="",document.querySelector(".main").innerHTML=$p(".templates .t_main .main").compile(directives.main)(n),document.querySelector(".main .tags").innerHTML=$p(".templates .t_tags").compile(directives.tags)({tags:e,action:"filterDelete"})})})},itemSelected:function(e,t){t.stopPropagation();var n=this.param.item=e.parentElement.getAttribute("data-item")?JSON.parse(e.parentElement.getAttribute("data-item")):{};document.querySelector(".detail").classList.remove("_h"),document.querySelector(".versionControl").classList.add("_h"),document.querySelector(".detail").innerHTML="",document.querySelector(".detail").innerHTML=$p(".templates .t_detail").compile(directives.detail)(this.param.item),_idb.getListPromise("tags").then(function(e){n.tags=e.filter(function(e){return e.items.includes(n.id)}),document.querySelector(".detail .tags").innerHTML=$p(".templates .t_tags").compile(directives.tags)(n),1===Object.keys(n).length&&document.querySelector("#name").focus()})},itemToggled:function(e){var t=JSON.parse(e.getAttribute("data-item")),n=".elems .pending";t.done?e.querySelector(".mdl-chip__text").style.textDecoration="none":(n=".elems .done",e.classList.add("done"),e.style.marginTop="5px"),window.setTimeout(function(){e.classList.remove("done"),e.parentElement.removeChild(e),t.done=!t.done,t.ts=(new Date).getTime(),e.setAttribute("data-item",JSON.stringify(t)),document.body.querySelector(n).appendChild(e),_idb.saveItemToIDB(t,"items")},500)},refresh:function(){$n.consoleLog("refresh: "),_idb.getListPromise("items").then(function(e){var t={elems:e};$p(".templates .t_main .main").compile(directives.main),document.querySelector(".main .t_tags");document.querySelector(".main").innerHTML="",document.querySelector(".main").innerHTML=$p(".templates .t_main .main").compile(directives.main)(t)})},saveItem:function(){var e=document.querySelector("#name"),t=document.querySelector("#quantity"),n={};this.param.item.name=e.value||this.getLabel("noName","detail"),this.param.item.ts=this.param.item.ts||(new Date).getTime(),this.param.item.q=t.value||1,this.param.item.index=$n.normalize(this.param.item.name),this.param.item.id=this.param.item.id||this.param.item.ts,n=Object.assign({},this.param.item),delete n.tags,_idb.saveItemToIDB(n,"items")},showList:function(){document.querySelector(".inProgress").classList.add("_h"),document.querySelector(".main").classList.remove("_h"),document.querySelector("main").addEventListener("touchend",$n.gestureMgr.oteHandler),document.querySelector("main").addEventListener("touchstart",$n.gestureMgr.otsHandler),this.refresh()},matchingTagsHide:function(e){document.querySelector(".matchingTags").innerHTML=""},matchingTagsShow:function(e){var t,n={tags:[]};_idb.getListPromise("tags").then(function(i){for(t=0;t<i.length;t++)i[t].items.length&&$n.checkPattern(i[t].id,$n.normalize(e.value))&&n.tags.push(i[t]);n.tags.length||n.tags.push({id:"noTagsFound"}),document.querySelector(".matchingTags").innerHTML="",document.querySelector(".matchingTags").innerHTML=$p(".templates .t_matchingTags").compile(directives.matchingTags)(n)})},tagAdd:function(e,t){if(!t||!t.inputType){var n=this;_idb.getListPromise("tags").then(function(t){var i=$n.normalize(e.value),o=t.filter(function(e){return e.id===i}),r={id:i,items:[]},a=document.querySelector(".detail .tags");o.length&&(r=o[0]),r.ts=(new Date).getTime(),r.items.push(n.param.item.id),_idb.saveItemToIDB(r,"tags"),o=n.param.item.tags.filter(function(e){return e.id===r.id}),o.length||n.param.item.tags.push(r),a&&(e.value="",a.innerHTML="",a.innerHTML=$p(".templates .t_tags").compile(directives.tags)(n.param.item)),e.focus()})}},tagDelete:function(e,t){var n=this;_idb.getItemPromise("tags",t).then(function(i){if(Object.keys(i).length){var o=i.items.indexOf(e);o>-1&&(i.items.splice(o,1),_idb.saveItemToIDB(i,"tags"),document.querySelector(".detail .tag[data-tid="+i.id+" ]").remove(),n.param.item.tags=n.param.item.tags.filter(function(e){return e.id!==t}))}})},tagToggle:function(e){$n.settings.filters=!$n.settings.filters,document.querySelectorAll(".collapsingFilter")[0].classList.toggle("_h"),document.querySelectorAll(".collapsingFilter")[1].classList.toggle("_h"),document.querySelector(".tagsCheck .label").innerHTML=e?$n.langMgr.getLabel("tagDisable","main"):$n.langMgr.getLabel("tagEnable","main"),document.querySelector(".tagsCheck label").classList.toggle("is-checked")}}};