//defining
const APP_PREFIX = 'BudgetTracker';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;
const DATA_CACHE_NAME = `data-cache-${VERSION}`;


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
        caches.open(CACHE_NAME).then(function(cache){
            console.log('installing the CACHE:'+ CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    );
});


//activating the service worker and removind old data.
self.addEventListener("activate", function(e){
    e.waitUntil(
        caches.keys().then(function(keylist){
            let cacheKeeplist = keylist.filter(function(key){
                return key.indexOf(APP_PREFIX);
    
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


// fetch request
// self.addEventListener("fetch", function(e){
//     console.log("fetch request:"+ e.request.url);
//     e.respondWith(
//         caches.match(e.request).then(function (request){
//             if (request){
//                 //if cache is available
//                 console.log("responding to cache: " + e.request.url);
//                 return request;
//             }else{
//                 console.log("file is not cached, " + e.request.url);
//                 return fetch(e.request);
//             }

//         })
//     );
// });



//FROM THE MIAMI BOOTCAMP IN CLASS ACTIVITY #5
//It all worked out with the code from activity 5#

//it makes disappears the data when OFFLINE, but it comes back when it updates on reload

// Intercept fetch requests
self.addEventListener('fetch', function(e) {
    if (e.request.url.includes('/api/')) {
      e.respondWith(
        caches
          .open(DATA_CACHE_NAME)
          .then(cache => {
            return fetch(e.request)
              .then(response => {
                // If the response was good, clone it and store it in the cache.
                if (response.status === 200) {
                  cache.put(e.request.url, response.clone());
                }
  
                return response;
              })
              .catch(err => {
                // Network request failed, try to get it from the cache.
                return cache.match(e.request);
              });
          })
          .catch(err => console.log(err))
      );
  
      return;
    }
  
    e.respondWith(
      fetch(e.request).catch(function() {
        return caches.match(e.request).then(function(response) {
          if (response) {
            return response;
          } else if (e.request.headers.get('accept').includes('text/html')) {
            // return the cached home page for all requests for html pages
            return caches.match('/');
          }
        });
      })
    );
  });
  




