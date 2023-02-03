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

importScripts("workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v4.3.1"});

workbox.core.setCacheNameDetails({prefix: "gatsby-plugin-offline"});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "0ba5e9ea-d86a947ce6288f66805d.js"
  },
  {
    "url": "2566fabb64b37b482136287ee59d396bf84a98d2-928b8c099f539eb5aaa9.js"
  },
  {
    "url": "484-b8ac94552e8a9302027a.js"
  },
  {
    "url": "app-f992fe6a4d70289720a8.js"
  },
  {
    "url": "bc20878feb926b69e680a129e911e2e0d3ec87cd-31d86642f9b49bfd0fb8.js"
  },
  {
    "url": "component---cache-caches-gatsby-plugin-offline-app-shell-js-2c3a910610ddcde470c0.js"
  },
  {
    "url": "component---gatsby-theme-oi-wiki-src-pages-404-tsx-850b03bd2a49a3b6fb7e.js"
  },
  {
    "url": "component---gatsby-theme-oi-wiki-src-pages-pages-tsx-c522073d0de487f345ca.js"
  },
  {
    "url": "component---gatsby-theme-oi-wiki-src-pages-play-tsx-93018cda867fbb8a3d9d.js"
  },
  {
    "url": "component---gatsby-theme-oi-wiki-src-pages-settings-tsx-f4d72678bacd0f8cf079.js"
  },
  {
    "url": "component---gatsby-theme-oi-wiki-src-pages-tags-tsx-1c172d26aec11ea5c1b9.js"
  },
  {
    "url": "component---gatsby-theme-oi-wiki-src-templates-changelog-js-5225809d58dc398cfec5.js"
  },
  {
    "url": "component---gatsby-theme-oi-wiki-src-templates-doc-js-a7e6381045e96e01370f.js"
  },
  {
    "url": "component---gatsby-theme-oi-wiki-src-templates-tags-js-87bfe8abe59861290607.js"
  },
  {
    "url": "framework-ca28869ca221715cfc7a.js"
  },
  {
    "url": "idb-keyval-3.2.0-iife.min.js"
  },
  {
    "url": "polyfill-cc7bd835411e1a9d6b4f.js"
  },
  {
    "url": "script.js"
  },
  {
    "url": "webpack-runtime-fa78c8424a4e6c03ea97.js"
  },
  {
    "url": "styles.f06fd491fe81462dc435.css"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "cae3005ce62ffc57573b35755e47c200"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "67049a60e3b67c28db901d7ce440468a"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/(\.js$|\.css$)/, new workbox.strategies.CacheFirst(), 'GET');
workbox.routing.registerRoute(/^https?:.*\.(json)$/, new workbox.strategies.NetworkFirst(), 'GET');
workbox.routing.registerRoute(/^https?:.*\.(woff|woff2)$/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff)$/, new workbox.strategies.NetworkOnly(), 'GET');

/* global importScripts, workbox, idbKeyval */
importScripts(`idb-keyval-3.2.0-iife.min.js`)

const { NavigationRoute } = workbox.routing

let lastNavigationRequest = null
let offlineShellEnabled = true

// prefer standard object syntax to support more browsers
const MessageAPI = {
  setPathResources: (event, { path, resources }) => {
    event.waitUntil(idbKeyval.set(`resources:${path}`, resources))
  },

  clearPathResources: event => {
    event.waitUntil(idbKeyval.clear())
  },

  enableOfflineShell: () => {
    offlineShellEnabled = true
  },

  disableOfflineShell: () => {
    offlineShellEnabled = false
  },
}

self.addEventListener(`message`, event => {
  const { gatsbyApi: api } = event.data
  if (api) MessageAPI[api](event, event.data)
})

function handleAPIRequest({ event }) {
  const { pathname } = new URL(event.request.url)

  const params = pathname.match(/:(.+)/)[1]
  const data = {}

  if (params.includes(`=`)) {
    params.split(`&`).forEach(param => {
      const [key, val] = param.split(`=`)
      data[key] = val
    })
  } else {
    data.api = params
  }

  if (MessageAPI[data.api] !== undefined) {
    MessageAPI[data.api]()
  }

  if (!data.redirect) {
    return new Response()
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: lastNavigationRequest,
    },
  })
}

const navigationRoute = new NavigationRoute(async ({ event }) => {
  // handle API requests separately to normal navigation requests, so do this
  // check first
  if (event.request.url.match(/\/.gatsby-plugin-offline:.+/)) {
    return handleAPIRequest({ event })
  }

  if (!offlineShellEnabled) {
    return await fetch(event.request)
  }

  lastNavigationRequest = event.request.url

  let { pathname } = new URL(event.request.url)
  pathname = pathname.replace(new RegExp(`^`), ``)

  // Check for resources + the app bundle
  // The latter may not exist if the SW is updating to a new version
  const resources = await idbKeyval.get(`resources:${pathname}`)
  if (!resources || !(await caches.match(`/app-f992fe6a4d70289720a8.js`))) {
    return await fetch(event.request)
  }

  for (const resource of resources) {
    // As soon as we detect a failed resource, fetch the entire page from
    // network - that way we won't risk being in an inconsistent state with
    // some parts of the page failing.
    if (!(await caches.match(resource))) {
      return await fetch(event.request)
    }
  }

  const offlineShell = `/offline-plugin-app-shell-fallback/index.html`
  const offlineShellWithKey = workbox.precaching.getCacheKeyForURL(offlineShell)
  return await caches.match(offlineShellWithKey)
})

workbox.routing.registerRoute(navigationRoute)

// this route is used when performing a non-navigation request (e.g. fetch)
workbox.routing.registerRoute(/\/.gatsby-plugin-offline:.+/, handleAPIRequest)
