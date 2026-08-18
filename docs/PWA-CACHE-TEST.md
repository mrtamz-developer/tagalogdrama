# PWA cache verification

1. Open the deployed TagalogDrama site once while online.
2. Open browser DevTools → Application → Service Workers.
3. Confirm `service-worker.js` is the active worker.
4. Confirm the cache name begins with `tagalogdrama-v2`.
5. Reload once while online so the current assets are cached.
6. Switch the browser to Offline mode and reload.
7. Confirm a previously cached page opens.
8. Visit an uncached route while offline and confirm `offline.html` appears.
9. Restore the network and reload.
10. After a future cache-version update, confirm old `tagalogdrama-*` caches are removed during activation.
