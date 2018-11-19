function showMsg(e,t){t||(t=""),-1!==window.location.href.indexOf("alt=y")?window.alert(e+" - "+t):console.log(e,t)}var b=!0;if("serviceWorker"in navigator&&b)navigator.serviceWorker.register("sw.js").then(function(e){showMsg("ServiceWorker registration successful with scope: ",e.scope),e.installing?showMsg("Service worker installing"):e.waiting?showMsg("Service worker installed"):e.active&&showMsg("Service worker active")}).catch(function(e){showMsg("ServiceWorker registration failed: ",e)}),navigator.serviceWorker.addEventListener("controllerchange",function(){navigator.serviceWorker.controller.addEventListener("statechange",function(){"activated"===this.state&&window.location.reload(!0)})});else if("applicationCache"in window){var iframe=document.createElement("iframe"),onUpdateReady=function(){window.location.reload(!0)};iframe.style.display="none",iframe.src="load-appcache.html",document.body.appendChild(iframe),showMsg("Iframe loaded for AppCache management "),window.applicationCache.addEventListener("updateready",onUpdateReady),window.applicationCache.status===window.applicationCache.UPDATEREADY&&onUpdateReady()}else showMsg("no service worker - no appCache");var $n={settings:{lang:(navigator.language||navigator.userLanguage||"en").substr(0,2),fontSize:1.2,filters:!0},version:"2018-11-19T05:30",start:function(){this.consoleLog("language: ",$n.settings.lang),labels[$n.settings.lang]||($n.settings.lang="en"),document.querySelectorAll(".toTranslate").forEach(function(e){e.innerHTML=labels[$n.settings.lang][e.innerHTML]}),-1!==location.search.indexOf("googleInt")&&document.querySelector(".googleSync").classList.remove("_h"),this.idbMgr.openDB().then(function(){$n.consoleLog("start - idb open SUCCESS. "),$n.srvMgr.showList()},function(e){$n.consoleLog("start - opening DB ERROR: ",e.message)}),this.consoleLog("start - completed"),_idb.setLog(this.consoleLog),window.setTimeout(function(){(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', 'UA-103383911-1', 'auto');ga('send', 'pageview');},1e3)},checkNewVersion:function(){if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").then(function(e){e.update(),caches&&caches.keys().then(function(e){return Promise.all(e.map(function(e){return caches.delete(e)}))})}).catch(function(e){$n.consoleLog("ServiceWorker registration failed: ",e)});else if("applicationCache"in window){var e=new XMLHttpRequest;e.open("GET","offline.appcache?ts="+(new Date).getTime()),e.responseType="text",e.onload=function(){if(200===this.status){var e=this.responseText.split("\n")[2].split("V")[1];$n.version!==e&&window.location.reload(!0)}},e.send()}},checkPattern:function(e,t){var n,i="",a=t.split(" ");for(n=0;n<a.length;n++)i+=a[n]?a[n]+".*":"";return new RegExp(i).exec(e)},consoleLog:function(){console.log((new Date).getTime(),arguments);var e,t,n="",i=document.querySelector(".debugging .messages");for(t=0;t<arguments.length;t++)n+=arguments[t]?arguments[t].toString()+" - ":"";n=(new Date).getTime()+": "+n,console.log(n),e=document.createElement("p"),e.appendChild(document.createTextNode(n)),i.insertBefore(e,i.firstChild),i.childNodes.length>500&&i.removeChild(i.lastChild)},eventMgr:{zoom:function(e){$n.settings.fontSize+=parseInt(e/100)/10,$n.settings.fontSize=Math.min(2,$n.settings.fontSize),$n.settings.fontSize=Math.max(1,$n.settings.fontSize),document.styleSheets[2].cssRules[document.styleSheets[2].cssRules.length-1].style.fontSize=$n.settings.fontSize+"rem"}},errorMgr:{display:function(e){window.alert(e.title||" - "+e.text)}},gestureMgr:{scaling:{0:{x1:0,y1:0,x2:0,y2:0},1:{x1:0,y1:0,x2:0,y2:0}},oteHandler:function(e){var t,n=$n.gestureMgr.scaling;n[1].x1&&(n[e.changedTouches[0].identifier].x2=e.changedTouches[0].pageX,n[e.changedTouches[0].identifier].y2=e.changedTouches[0].pageY,e.touches.length||(t=Math.abs(n[1].y2-n[0].y2)-Math.abs(n[1].y1-n[0].y1),$n.eventMgr.zoom(t),n={0:{x1:0,y1:0,x2:0,y2:0},1:{x1:0,y1:0,x2:0,y2:0}}))},otsHandler:function(e){2===e.touches.length&&($n.gestureMgr.scaling[0].x1=e.touches[0].pageX,$n.gestureMgr.scaling[0].y1=e.touches[0].pageY,$n.gestureMgr.scaling[1].x1=e.touches[1].pageX,$n.gestureMgr.scaling[1].y1=e.touches[1].pageY)}},idbMgr:{openDB:function(e,t){try{return new Promise(function(n,i){window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;$n.consoleLog("iDB - openDB. "),e||(e="Tsilio"),t||(t=1);var a=_idb.indexedDB.open(e,t);a.onerror=function(n){$n.consoleLog("IndexedDB cannot be opened: ",n.target.error.name),i({error:n.target.error,dbName:e,dbVersion:t})},a.onsuccess=function(e){$n.consoleLog("indexedDB available: ",e.target.result.name),_idb.db=e.target.result,n()},a.onupgradeneeded=function(e){var t=e.target.result;$n.consoleLog("onupgradeneeded: ",e);try{t.deleteObjectStore("items")}catch(e){$n.consoleLog("ObjectStore items not available for deletion: ",e.name)}try{t.deleteObjectStore("tags")}catch(e){$n.consoleLog("ObjectStore tags not available for deletion: ",e.name)}try{t.deleteObjectStore("settings")}catch(e){$n.consoleLog("ObjectStore settings not available for deletion: ",e.name)}objStoreItems=t.createObjectStore("items",{keyPath:"id"}),objStoreTags=t.createObjectStore("tags",{keyPath:"id"}),objStoreUser=t.createObjectStore("user",{keyPath:"type"}),objStoreItems.transaction.oncomplete=function(e){$n.consoleLog("ObjectStore items succesfully created: ",e)},objStoreItems.transaction.onerror=function(e){console.error("Error creating items object store: ",e.target)},objStoreTags.transaction.oncomplete=function(e){$n.consoleLog("ObjectStore tags succesfully created: ",e)},objStoreTags.transaction.onerror=function(e){console.error("Error creating tags object store: ",e.target)},objStoreUser.transaction.oncomplete=function(e){$n.consoleLog("ObjectStore user succesfully created: ",e)},objStoreUser.transaction.onerror=function(e){console.error("Error creating user object store: ",e.target)}},a.onblocked=function(e){$n.consoleLog("IndexedDB cannot be opened: ",e.target.error.name),i(e)}})}catch(e){$n.consoleLog("iDB - openBR - ERROR caught: ",e.message)}}},langMgr:{getLabel:function(e,t){var n,i,a=e.split("."),i=t?labels[$n.settings.lang][t]:labels[$n.settings.lang];for(n=0;n<a.length-1;n++)i=i[a[n]];return e=a[a.length-1],i&&i[e]||labels[$n.settings.lang].missingLabel}},normalize:function(e){return String(e).toLowerCase().replace(/\s/g,"").replace(/[^\w]/g,"")},srvMgr:{param:{item:{},anyFilter:!1,touchTriggerTime:300},andOrToggle:function(e){e.innerHTML=this.param.anyFilter?$n.langMgr.getLabel("allFilters","main"):$n.langMgr.getLabel("anyFilter","main"),this.param.anyFilter=!this.param.anyFilter,$n.srvMgr.filterRefresh()},checkItemID:function(){this.param.item.id||this.saveItem()},closeDetail:function(e){$n.srvMgr.saveItem().then(function(){$n.srvMgr.tagAdd(),document.querySelector(".detail").classList.add("_h"),document.querySelector(".detail").innerHTML="",document.querySelector(".versionControl").classList.remove("_h"),e.preventDefault(),window.setTimeout(function(){$n.srvMgr.filterRefresh()},200)})},deleteItem:function(e){document.querySelector(".detail").innerHTML="",_idb.saveItemToIDB(this.param.item.id,"items",!0),e.preventDefault(),window.setTimeout(function(){$n.srvMgr.filterRefresh()},200)},doNothing:function(){},filterAdd:function(e,t){if(!t||!t.inputType){_idb.getItemPromise("tags",$n.normalize(e.value)).then(function(t){if(e.value="",!Object.keys(t).length)return void $n.errorMgr.display({text:"Filter does not exist"});$n.srvMgr.filterRefresh(t.id),e.focus()})}},filterDelete:function(e,t){document.querySelector(".main .tag[data-tid="+t+" ]").remove(),this.filterRefresh()},filterRefresh:function(e){var t,n,i,a=this,o={},r=[];this.param.anyFilter;for(t=document.querySelectorAll(".main .tags .mdl-chip"),n=0;n<t.length;n++)r.push(t[n].getAttribute("data-tid"));if(e&&r.push(e),r.sort(),!r.length)return void this.refresh();_idb.getItemsById("tags",r).then(function(e){var t=[];for(n=0;n<e.length;n++)for(i=0;i<e[n].items.length;i++)o[e[n].items[i]]=o[e[n].items[i]]+1||1;t=a.param.anyFilter?Object.keys(o):JSON.stringify(o).match(new RegExp('\\d{13}(?=":'+e.length+")","g"))||[],t=t.map(parseFloat),_idb.getItemsById("items",t).then(function(t){var n=$n.srvMgr.param.anyFilter?{anyFilter:!0}:{};$p(".templates .t_main .main").compile(directives.main);n.elems=t.length?t:[{id:0}],document.querySelector(".main").innerHTML="",document.querySelector(".main").innerHTML=$p(".templates .t_main .main").compile(directives.main)(n),document.querySelector(".main .tags").innerHTML=$p(".templates .t_tags").compile(directives.tags)({tags:e,action:"filterDelete"})})})},itemSelected:function(e,t){var n=this,i=this.param.item.tags?this.param.item.tags.map(function(e){return e=e.id}):[],a=e&&e.parentElement&&e.closest(".mdl-chip")||e.parentElement;t&&t.stopPropagation();var o=this.param.item=a?a.getAttribute("data-item")?JSON.parse(a.getAttribute("data-item")):{}:JSON.parse(e);document.querySelector(".detail").classList.remove("_h"),document.querySelector(".versionControl").classList.add("_h"),document.querySelector(".detail").innerHTML="",document.querySelector(".detail").innerHTML=$p(".templates .t_detail").compile(directives.detail)(this.param.item),_idb.getListPromise("tags").then(function(e){o.tags=e.filter(function(e){return e.items.includes(o.id)}),document.querySelector(".detail .tags").innerHTML=$p(".templates .t_tags").compile(directives.tags)(o),1===Object.keys(o).length&&window.setTimeout(function(){document.querySelector("#name").focus()},100),!o.id&&i.length&&n.saveItem().then(function(){var e=function(){i.length&&(document.querySelector(".detail #tagSearch").value=i[0],$n.srvMgr.tagAdd(e),i.shift())};e()})})},itemToggled:function(e){var t=JSON.parse(e.getAttribute("data-item")),n=".elems .pending";t.done?e.querySelector(".mdl-chip__text").style.textDecoration="none":(n=".elems .done",e.classList.add("done"),e.style.marginTop="5px"),window.setTimeout(function(){e.classList.remove("done"),e.parentElement.removeChild(e),t.done=!t.done,t.ts=(new Date).getTime(),e.setAttribute("data-item",JSON.stringify(t)),document.body.querySelector(n).appendChild(e),_idb.saveItemToIDB(t,"items")},500)},refresh:function(){var e=this,t=document.querySelector(".main");_idb.getListPromise("items").then(function(n){var i={elems:n,anyFilter:e.param.anyFilter};$p(".templates .t_main .main").compile(directives.main),document.querySelector(".main .t_tags");t.innerHTML="",t.innerHTML=$p(".templates .t_main .main").compile(directives.main)(i),n.length&&$n.onBoarding.show(t.querySelector(".pending .material-icons"),"itemDetails",!1)})},saveItem:function(){var e=this;return new Promise(function(t,n){var i,a=document.querySelector("#name"),o=document.querySelector("#quantity"),r=document.querySelectorAll(".matchingItems li");for(i2s={},i=0;i<r.length;i++)$n.normalize(r[i].dataset.tid)===$n.normalize(a.value)&&(e.param.item=JSON.parse(r[i].dataset.item));e.param.item.name=a.value||$n.langMgr.getLabel("noName","detail"),e.param.item.ts=e.param.item.ts||(new Date).getTime(),e.param.item.q=o.value||e.param.item.q||1,e.param.item.index=$n.normalize(e.param.item.name),e.param.item.id=e.param.item.id||e.param.item.ts,delete e.param.item.done,i2s=Object.assign({},e.param.item),delete i2s.tags,_idb.saveItemToIDB(i2s,"items"),t()})},showList:function(){document.querySelector(".inProgress").classList.add("_h"),document.querySelector(".main").classList.remove("_h"),document.querySelector("main").addEventListener("touchend",$n.gestureMgr.oteHandler),document.querySelector("main").addEventListener("touchstart",$n.gestureMgr.otsHandler),this.refresh()},matchingItemsHide:function(e){var t,n=document.querySelector("#name"),i=document.querySelectorAll(".matchingItems li");for(t=0;t<i.length;t++)if($n.normalize(i[t].dataset.tid)===$n.normalize(n.value))return void $n.srvMgr.itemSelected(i[t].dataset.item);window.setTimeout(function(){document.querySelector(".matchingItems").innerHTML=""},320)},matchingItemsShow:function(e){var t,n={elems:[]};_idb.getListPromise("items").then(function(i){for(t=0;t<i.length;t++)$n.checkPattern(i[t].index,$n.normalize(e.value))&&n.elems.push(i[t]);document.querySelector(".matchingItems").innerHTML="",document.querySelector(".matchingItems").innerHTML=$p(".templates .t_matchingItems").compile(directives.matchingItems)(n)})},matchingTagsHide:function(e){e=e||"main",el=document.querySelector("."+e+" .matchingTags"),el&&(el.innerHTML="")},matchingTagsShow:function(e,t){var n,i={tags:[]},t=t||"main";_idb.getListPromise("tags").then(function(a){for(n=0;n<a.length;n++)a[n].items.length&&$n.checkPattern(a[n].id,$n.normalize(e.value))&&i.tags.push(a[n]);i.tags.length||i.tags.push({id:"noTagsFound"}),document.querySelector("."+t+" .matchingTags").innerHTML="",document.querySelector("."+t+" .matchingTags").innerHTML=$p(".templates .t_matchingTags").compile(directives["matchingTags_"+t])(i)})},tagAdd:function(e){var t=this,n=document.querySelector(".detail #tagSearch");n.value.length&&(this.matchingTagsHide("detail"),_idb.getListPromise("tags").then(function(i){var a=$n.normalize(n.value),o=i.filter(function(e){return e.id===a}),r={id:a,items:[]},s=document.querySelector(".detail .tags");o.length&&(r=o[0]),r.ts=(new Date).getTime(),r.items.push(t.param.item.id),_idb.saveItemToIDB(r,"tags"),o=t.param.item.tags.filter(function(e){return e.id===r.id}),o.length||t.param.item.tags.push(r),s&&(n.value="",s.innerHTML="",s.innerHTML=$p(".templates .t_tags").compile(directives.tags)(t.param.item)),"function"==typeof e&&e(),n.focus()}))},tagDelete:function(e,t){var n=this;_idb.getItemPromise("tags",t).then(function(i){if(Object.keys(i).length){var a=i.items.indexOf(e);a>-1&&(i.items.splice(a,1),_idb.saveItemToIDB(i,"tags"),document.querySelector(".detail .tag[data-tid="+i.id+" ]").remove(),n.param.item.tags=n.param.item.tags.filter(function(e){return e.id!==t}))}})},tagDetailSelected:function(e){document.querySelector(".detail #tagSearch").value=e;this.matchingTagsHide("detail"),this.param.item.id?this.tagAdd():this.saveItem().then(function(){$n.srvMgr.tagAdd()})},tagDetailKeyd:function(e){e.value.length?document.querySelector(".detail .addTag").classList.remove("_h"):document.querySelector(".detail .addTag").classList.add("_h")},tagDetailBlured:function(){document.querySelector(".detail .addTag").classList.add("_h"),window.setTimeout(function(){$n.srvMgr.matchingTagsHide("detail")},200)},tagToggle:function(e){$n.settings.filters=!$n.settings.filters,document.querySelectorAll(".collapsingFilter")[0].classList.toggle("_h"),document.querySelectorAll(".collapsingFilter")[1].classList.toggle("_h"),document.querySelector(".tagsCheck .label").innerHTML=e?$n.langMgr.getLabel("tagDisable","main"):$n.langMgr.getLabel("tagEnable","main"),document.querySelector(".tagsCheck label").classList.toggle("is-checked")}},onBoarding:{container:document.querySelector(".onBoarding"),forgotten:localStorage.getItem("onBoarding")?JSON.parse(localStorage.getItem("onBoarding")):{},focusElm:null,hide:function(e){var t=this.container.querySelector(".onbBlock");this.forgotten=localStorage.getItem("onBoarding")?JSON.parse(localStorage.getItem("onBoarding")):{},e&&(this.forgotten[t.dataset.onb]=!0,localStorage.setItem("onBoarding",JSON.stringify(this.forgotten))),this.container.classList.add("_h"),this.container.innerHTML="",this.focusElm&&this.focusElm.focus(),this.focusElm=null},reset:function(){this.forgotten={},localStorage.removeItem("onBoarding"),document.querySelector(".mdl-layout").MaterialLayout.toggleDrawer()},show:function(e,t,n){if(!this.forgotten[t]){var i,a=e.closest(".onbBlock"),o=a.cloneNode(!0),r=o.querySelectorAll("input");if(newEl=document.createElement("div"),canvas=document.createElement("div"),newEl.classList.add("instructions"),canvas.classList.add("canvas"),newEl.innerHTML=$p(".templates .t_onBoarding").compile(directives.onBoarding)({name:t}),this.container.appendChild(newEl),this.container.appendChild(canvas),n)for(e.blur(),this.focusElm=e,i=0;i<r.length;i++)r[i].readOnly=!0;o.dataset.onb=t,o.style.top=canvas.style.top=a.getBoundingClientRect().y-parseInt(window.getComputedStyle(a).marginTop.replace(/px/g,""))+"px",o.style.left=canvas.style.left=a.getBoundingClientRect().x+"px",o.style.width=canvas.style.width=a.getBoundingClientRect().width+"px",canvas.style.height=a.getBoundingClientRect().height+"px",this.container.classList.remove("_h"),this.container.appendChild(o)}}}};