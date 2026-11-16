# Octonia website

Landing page for **Octonia**, an interactive science workbook app for kids, with a sign-up form for testing sessions.

**Live site: https://octonia.app**

These addresses all redirect permanently to it:

- `www.octonia.app`
- `octovia.app` and `www.octovia.app`
- `funscience.vercel.app` (the old address)

## Pages

| Address | File | What it is |
|---|---|---|
| `/` | `index.html` | The main landing page |
| `/lighttheme` | `lighttheme/index.html` + `lighttheme/light.css` | A light-colored version of the main page, kept for comparison |
| `/privacy` | `privacy.html` | Privacy Policy |
| `/terms` | `terms.html` | Terms of Use |
| `/logotest` | `logotest/` | Test: the header with the mark alone, without the icon square |

Every page footer links to Privacy and Terms of Use. Keep those links when adding a page.

## Other files

| File | What it is |
|---|---|
| `styles.css` | Shared styling and the phone/tablet layout |
| `hero-planet.css` | The hero section (octopus and glow) |
| `face.css`, `face.js` | The octopus face animation in the hero |
| `script.js` | The testing sign-up form and page interactions |
| `fonts.css`, `fonts/` | Self-hosted fonts (DM Sans, Fraunces) with their licenses |
| `images/`, `audio/` | Pictures and the sample question recordings |
| `brand-kit/` | Logo files: the app icon and the question-mark mark in purple, black and white, as SVG and 1024px PNG. `octonia-icon-purple.svg` is the source; the site's favicons and header icon are made from it |
| `vercel.json` | Clean URLs, security headers, and the `funscience.vercel.app` redirect |

It's a plain static site. There is no build step and nothing to install.

## Making a change

1. Edit the files.
2. Commit and push to `main`.
3. Vercel publishes the new version automatically in about a minute.

To preview locally, open `index.html` in a browser.

To try a design idea, make a temporary folder (for example `test1/`), which becomes a page at `/test1`. Delete it once the idea is merged into the main page or dropped.

## Hosting and domains

- **Hosting:** Vercel. It deploys from this repo's `main` branch.
- **Domains:** octonia.app and octovia.app point to Vercel. `www.octonia.app` and both octovia addresses are set up as redirects in the Vercel project's domain settings. The `funscience.vercel.app` redirect lives in `vercel.json`.

## What not to put in this repo

This repository is public. Do not commit:

- personal email addresses, names or phone numbers (the site's own `hello@` and `privacy@` addresses are fine — they are shown on the pages);
- sign-up data, exports of the sign-up sheet, or anything about testers and their children;
- passwords, API keys, tokens, or account details for hosting, domains or email.

## Privacy

The app keeps children's data on the device. Keep `privacy.html` and `terms.html` accurate whenever the site changes.
