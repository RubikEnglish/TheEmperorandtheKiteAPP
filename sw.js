// imports
importScripts('js/sw-utils.js');


const STATIC_CACHE    = 'static-v4';
const DYNAMIC_CACHE   = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v1';


const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/news1.jpg',
    'img/news2.jpg',
    'img/news3.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400&display=swap',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js',
    'styles.css'
];



self.addEventListener('install', e => {


    const cacheStatic = caches.open( STATIC_CACHE ).then(cache => 
        cache.addAll( APP_SHELL ));

    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache => 
        cache.addAll( APP_SHELL_INMUTABLE ));



    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ])  );

});


self.addEventListener('activate', e => {

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

            if (  key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil( respuesta );

});




self.addEventListener( 'fetch', e => {


    const respuesta = caches.match( e.request ).then( res => {

        if ( res ) {
            return res;
        } else {

            return fetch( e.request ).then( newRes => {

                return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );

            });

        }

    });



    e.respondWith( respuesta );

});


