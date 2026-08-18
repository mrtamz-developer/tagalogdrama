# TagalogDrama QA matrix

| Area | Test | Expected |
|---|---|---|
| Navigation | Open every main nav link | Correct page loads |
| Catalog | Open a series | Episode list loads |
| Favorites | Save/remove a series | State persists locally |
| Progress | Open episode and refresh | Local progress remains when implemented by page |
| PWA | Install/open as PWA | Manifest and service worker load |
| Offline | Disable network after first visit | Cached content or offline page appears |
| Plans | Select a plan | No payment is attempted while payments are disabled |
| Ads | Trigger ad unlock flow | No real ad request while provider is unset |
| Security | Inspect public files | No secrets or credentials are exposed |
| Rights | Review catalog | Only verified/licensed production media is published |
| Mobile | Test narrow viewport | Layout remains usable without horizontal overflow |

## Release gate

A failed security, licensing, navigation, or production-service test blocks release.
