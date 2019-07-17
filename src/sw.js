/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
    {
        "url": "android-chrome-192x192.05339df4.png",
        "revision": "9bf9178717271af284d5762e89e8171e"
    },
    {
        "url": "android-chrome-512x512.e33271ec.png",
        "revision": "00a945f4b89d063147e1f026ac93965f"
    },
    {
        "url": "apple-touch-icon.b5b277d1.png",
        "revision": "c51576610b7a016d44b42e09a6b07e0e"
    },
    {
        "url": "categories.81ff020a.png",
        "revision": "8bae74d6528b53ae48a0d11e0adac16c"
    },
    {
        "url": "edit.d5dc5615.png",
        "revision": "c888f43fe0afca59de530b821fb32eba"
    },
    {
        "url": "favicon-16x16.22fefefa.png",
        "revision": "405d7a83858dcb0f90cfc5b90741e965"
    },
    {
        "url": "favicon-32x32.fe18f7ff.png",
        "revision": "5424d0d63cf58643e463e6345cb02bb0"
    },
    {
        "url": "favicon.4e2ccd9b.ico",
        "revision": "9cfae4e943fa284172a1b5fd4bc75bda"
    },
    {
        "url": "index.html",
        "revision": "61b13243c99ad4c4073aa5e3e3efb77f"
    },
    {
        "url": "tracks.82aeb3dc.png",
        "revision": "cc5e3bb0d3ec602799ce3e03fd8b63aa"
    },
    {
        "url": "ts.841fc46b.js",
        "revision": "baf91ce20aeb1135c03622fa05c8f106"
    }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
