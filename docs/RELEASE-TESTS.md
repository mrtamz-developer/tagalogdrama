# Release smoke tests

Run these checks on the deployed site before publishing a production release.

- [ ] Home page loads without console-blocking errors.
- [ ] Series page opens and each series routes to its episode list.
- [ ] Favorite can be added, removed, and persists after refresh.
- [ ] Episode page displays the selected series and episode number.
- [ ] Watch-progress state survives a page refresh.
- [ ] Search, Library, Account, Privacy, Terms, and Status links resolve.
- [ ] Offline fallback appears when the network is unavailable after service-worker installation.
- [ ] No secret keys or payment credentials appear in page source or public data files.
- [ ] Placeholder/demo media is not presented as licensed production content.
- [ ] Subscription and rewarded-ad controls remain disabled until their production services are configured.
