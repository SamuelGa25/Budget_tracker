//defining
const APP_PREFIX = 'BudgetTracker';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

//the files to the cache
const FILES_TO_CACHE =[
    "./index.html",
    "./css/styles.css",
    "./js/index.js",
    "./js/idb.js",
    "./manifest.json",
    "./icons/icon-72x72.png",
    "./icons/icon-96x96.png",
    "./icons/icon-128x128.png",
    "./icons/icon-144x144.png",
    "./icons/icon-152x152.png",
    "./icons/icon-192x192.png",
    "./icons/icon-384x384.png",
    "./icons/icon-512x512.png",

]
//install the service worker
self.addEventListener('install', function(e){
    e.waitUntil(
        caches.open("CACHE_NAME").then(function(cache){
            console.log('installing the CACHE:'+ CACHE_NAME);
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

//fetch request
self.addEventListener("fetch", function(e){
    console.log("fetch request:"+ e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (request){
            if (request){
                //if cache is available
                console.log("responding to cache:" + e.request.url);
                return request;
            }else{
                console.log("file is not cached" + e.request.url);
                return fetch(e.request);
            }

        })
    );
});



//activating the service worker and removind old data.
self.addEventListener("activate", function(e){
    e.waitUntil(
        caches.keys().then(function(keylist){
            let cacheKeeplist = keylist.filter(function(key){
                return key.indexof(APP_PREFIX);
    
            });
            cacheKeeplist.push(CACHE_NAME);

            return Promise.all(
                keylist.map(function(key,i){
                    if (cacheKeeplist.indexOf(key)===-1){
                        console.log("deleting cache: " +keylist[i]);
                        return caches.delete(keylist[i]);
                    }
                })
            );
        })
    );
});



