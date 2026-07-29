## Ryan Lewis Portfolio

## Features

- Styled with EmotionJS💅🏾
- Written in TypeScript ⚛
- Project and Book content types 🖊

## Mobile performance budget

Run a production build, then check the deterministic homepage JavaScript
budget:

```sh
npm run build
npm run performance:check
```

The check reads Next.js's production build manifest and caps initial homepage
JavaScript at 185 KiB gzip across at most nine requests, with no initial chunk
larger than 65 KiB gzip. These limits protect mobile transfer and parse costs
without using a Lighthouse score as a flaky CI gate.

The chat launcher remains in the initial page, while its interactive
implementation downloads on first activation. Google Analytics remains loaded
asynchronously, Vercel Analytics remains enabled, and Prism's third-party theme
stylesheet remains in place; the budget detects future growth without removing
site telemetry or syntax highlighting.
