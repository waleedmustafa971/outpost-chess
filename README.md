# Outpost Chess

A clean, responsive landing page for Outpost, the offline Android chess companion created by Waleed.

## The app

Play against the computer, solve rated puzzles, study 80 lessons, explore 3,865 opening lines, review games and practise your mistakes. Import public Chess.com/Lichess games or PGN/FEN, customise the board, and back up your progress.

The standalone signed APK is published in [GitHub Releases](https://github.com/waleedmustafa971/outpost-chess/releases/latest). It requires Android 10+ on ARM64. The release includes a SHA-256 checksum and a third-party source/licence bundle. This repository contains the landing page; Android development remains in the original Outpost workspace.

## Develop

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4187. The site is static HTML, CSS and JavaScript in `public/`, with no build step or production dependencies.

```sh
npx playwright install chromium
npm test
```

The test uses an existing local Chromium if available, otherwise Playwright's browser. Set `SITE_URL` to test a deployed version. Checks cover desktop/mobile widths, feature tabs, opening tabs, keyboard navigation, FAQs, assets, download metadata and reduced motion.

## Deploy

Vercel serves `public/` using `vercel.json`. Connect this repository with the Other framework preset, no build command, output directory `public`. The APK lives in GitHub Releases rather than the website deployment.

## Assets and privacy

Original Outpost artwork and logo; Chessnut piece images by Alexis Luengas (Apache 2.0). See `public/credits.html` and the bundled licence. DM Sans and Manrope load through Google Fonts. No analytics, account system or tracking cookies are included. Vercel, GitHub and Google Fonts handle their ordinary network requests.

Download metadata is in `public/release.json`. Publish the matching APK release before changing download URLs. Signing keys, credentials, device screenshots and private game data are never part of this repository.
