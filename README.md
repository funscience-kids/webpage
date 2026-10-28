# Octovia website

Landing page and waitlist for **Octovia**, an interactive science workbook app for kids.

**Live site: https://octonia.app**

These addresses all redirect permanently to it:

- `www.octonia.app`
- `octovia.app` and `www.octovia.app`
- `funscience.vercel.app` (the old address)

## Files

| File | What it is |
|---|---|
| `index.html` | The landing page: sections, navigation, and the waitlist pop-up questions |
| `styles.css` | All styling and the phone/tablet layout |
| `script.js` | Sign-up form, pop-up survey, scroll animations, active nav link |
| `privacy.html` | Privacy policy page |
| `images/` | Illustrations (the hero picture is `hero-fox-pond-tail-fixed.png`) |
| `vercel.json` | Redirects the old `funscience.vercel.app` address to octonia.app |

It's a plain static site. There is no build step and nothing to install.

## Making a change

1. Edit the files.
2. Commit and push to `main`.
3. Vercel publishes the new version automatically in about a minute.

To preview locally, open `index.html` in a browser.

## Hosting and domains

- **Hosting:** Vercel project `fun-science-s-projects/webpages`. It deploys from this repo's `main` branch.
- **Domains:** octonia.app and octovia.app are registered at Porkbun. Their DNS records point to Vercel:

  | Type | Host | Value |
  |---|---|---|
  | A | (blank) | `216.198.79.1` |
  | CNAME | www | `285bcf096f9ee686.vercel-dns-017.com` |

- **Redirects:** `www.octonia.app` and both octovia addresses are set up as redirects under Vercel → Project → Settings → Domains. The `funscience.vercel.app` redirect lives in `vercel.json`.

## Privacy

The app keeps children's data on the device. Keep `privacy.html` accurate whenever the site changes.
