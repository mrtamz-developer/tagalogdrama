# Video delivery plan

## Production target

Production episodes should be delivered through a storage/CDN architecture that keeps the origin private and issues short-lived playback authorization.

## Required controls

- [ ] Private origin/storage bucket
- [ ] Authenticated playback authorization
- [ ] Short-lived signed URL/token
- [ ] Server-side entitlement check for premium content
- [ ] Referrer/origin controls where appropriate
- [ ] Rate limiting and abuse monitoring
- [ ] CDN configured for the intended territories
- [ ] Media transcoding and mobile-compatible formats
- [ ] Subtitle/caption support where required
- [ ] Playback error monitoring

Do not place permanent private media URLs or storage credentials in frontend JavaScript.
