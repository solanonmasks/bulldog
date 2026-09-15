# Bulldog Bag Ltd. — website

A single-page marketing site built from the design handoff in
`Bulldog Bag modernization.zip`.

It's plain HTML, CSS and JavaScript. **There is no build step and no
`npm install`** — the files you edit are the files that get served.

---

## Preview it locally

The quickest way:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser.

> You *can* also just double-click `index.html`, but a local server is
> closer to how it will behave once it's live.

To stop the server, press `Ctrl+C` in the terminal.

---

## What's in here

| File | What it does |
|---|---|
| `index.html` | All the page content and structure. **Edit this to change wording.** |
| `styles.css` | All the styling. Organised top-to-bottom in the same order as the page. |
| `main.js` | The handful of behaviours that need JavaScript (see below). |
| `assets/` | Images, logo and favicon. |
| `Bulldog Bag modernization.zip` | The original design handoff, kept for reference. |

### Where to change things

- **Wording** → `index.html`. Each section is marked with a big comment banner
  (`HERO`, `PRODUCTS`, `SERVICES` …) so you can scroll to the one you want.
- **Colours, fonts, spacing** → the `:root` block at the top of `styles.css`.
  Change `--accent` in one place and every lime element on the page follows.
- **Behaviour** → `main.js`. It's numbered 1–7 with a comment above each part.

### A note on the CSS

The design handoff used inline styles on every element (a quirk of how the
prototype was produced). Those have all been converted into classes here, which
is why editing one rule in `styles.css` now updates every element that uses it.

---

## What JavaScript is responsible for

Only these, and nothing else:

1. Shrinking the header once you scroll past 40px
2. Fading sections in as they scroll into view
3. Counting the four hero stats up (1965 · 10-colour · 21 · 6)
4. Opening the mega menu under the desktop nav
5. Opening the full-screen mobile menu
6. The quote form's scope chips and confirmation message
7. The newsletter confirmation

Everything else — every hover state, the headline animation, the scrolling lime
ticker, and the switch to the mobile nav at 1080px — is pure CSS. **If
JavaScript fails to load, the page still reads correctly and every link still
works.** Please keep it that way.

The site also respects the "reduce motion" accessibility setting: animations
are switched off for anyone who has it turned on.

---

## Deploying

Because there's no build step, any static host works. Upload the whole folder
(or point the host at this repo) and you're done. Options that need no
configuration at all:

- **GitHub Pages** — repo *Settings → Pages → Deploy from a branch*
- **Netlify** or **Vercel** — drag the folder in, or connect the repo and leave
  the build command blank

---

## Before this goes live

These need a person, not code. They come from the designer's handoff notes plus
what turned up while building:

1. **Real photography.** Every image in `assets/` is AI-generated placeholder
   art supplied for layout purposes. Swap in real photos of the plant, product
   and family before launch.
2. **A real logo file.** `assets/logo-bulldog.png` was extracted from a
   screenshot of the live site. Ask the client for the original vector or PNG.
   (Note: `--ink` in `styles.css` must stay exactly `#080807` — the logo has a
   matching black field that blends into the header.)
3. **Self-host the hero video.** `index.html` currently hotlinks
   `bulldogbag.com/.../bulldog_banner.mp4`. Download it, compress it, add a
   WebM version alongside the MP4, and put both in `assets/`. It could not be
   downloaded during the build because the network blocked that domain.
4. **Wire up the two forms.** Both the quote form and the newsletter signup
   currently show an optimistic confirmation without sending anything. In
   `index.html` add an `action=` to each `<form>`, then remove the matching
   `event.preventDefault()` block in `main.js` (sections 6 and 7 — both are
   commented).
5. **Confirm the placeholder content.** The two article cards under "What we're
   watching" and the article dates are from the design mockup — replace them
   with real posts.
6. **Analytics**, and update the `og:image` / `canonical` URLs in the `<head>`
   of `index.html` if the site lives anywhere other than `www.bulldogbag.com`.

### Already handled

- Photography was converted from PNG to WebP, taking the page's images from
  ~16 MB down to ~1 MB. The original PNGs are still in the handoff zip.
- Page title, meta description, Open Graph tags and a favicon.
- Keyboard focus outlines, a skip link, `aria` states on the menu and form
  chips, and Escape-to-close on both menus — the prototype specified none of
  these.
- Anchor links account for the fixed header, so jumping to a section no longer
  hides its heading behind the nav.
