# Convert a regular website into a PWA

To convert a website into a PWA, you will have to add a `manifest.json` and register a service worker `sw.js` which includes the assets you want to cache (html pages, images, scripts...etc)

I included a link to the `manifest.json` file in every html page

```html
<link rel="manifest" href="manifest.json" />
```

I also included this script to register the service worker as well

```html
<script src="/test-pwa/app.js"></script>
```

## Helpful resources

https://www.youtube.com/watch?v=-GlB2HETq74
https://www.youtube.com/watch?v=sg-Oqb3ZvKg
https://www.youtube.com/watch?v=W51AKwhAfWA
