# ClearMend — Certified Mold Remediation Website

ClearMend is a certified mold remediation and indoor-air restoration company serving homes and businesses across Northeastern Pennsylvania. This repository contains the full source for clearmend.com — a modern, SPA-powered marketing site with an integrated Decap CMS for blog management, GSAP-driven motion, and canvas-based visuals.

## Stack

- **Tailwind CSS 3** — utility-first styling with a custom ClearMend brand theme
- **Vanilla JavaScript SPA** — no framework, no build-step for app code; `js/app.js` handles routing
- **GSAP + ScrollTrigger** — scroll-linked and timeline animations in the hero and throughout
- **HTML Canvas** — 2D particle / spore field behind the hero, DPR-scaled for retina
- **Decap CMS** (formerly Netlify CMS) — Git-backed editorial workflow for the Insights blog
- **Netlify** — hosting, form handling, Netlify Identity + Git Gateway for the CMS
- **Node.js build scripts** — `scripts/build-blog.js` compiles `content/blog/*.md` into `data/posts.json`

## Project structure

```
mold/
├── admin/              # Decap CMS configuration and entry point
│   ├── config.yml
│   └── index.html
├── content/
│   ├── blog/           # Blog posts as Markdown + front matter
│   └── pages/          # Editable page content
├── css/
│   ├── input.css       # Tailwind source — design tokens, components, utilities
│   └── styles.css      # Compiled output (generated)
├── data/
│   └── posts.json      # Generated blog index (from scripts/build-blog.js)
├── images/             # Branded imagery, logo, service photos, backups
├── js/
│   ├── config.js       # Central brand + content config (services, testimonials, navigation, SEO)
│   ├── components.js   # Header / footer / logo / icon library
│   └── app.js          # SPA router, page initializers, GSAP, hero canvas
├── scripts/
│   ├── build-blog.js   # Builds data/posts.json from content/blog
│   ├── dev-server.js   # Local SPA dev server with routing fallback
│   └── dev-start.js    # npm run dev orchestrator
├── index.html          # SPA shell with all page <template> fragments
├── netlify.toml        # Netlify build + redirect configuration
├── tailwind.config.js  # ClearMend brand theme (colors, type, animations)
└── package.json
```

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Build CSS and blog index, then run the dev server

```bash
npm run dev
```

This runs:

1. `npm run build:css` — compiles Tailwind to `css/styles.css`
2. `npm run build:blog` — generates `data/posts.json`
3. `node scripts/dev-start.js` — starts both the Tailwind watcher and the Node dev server concurrently

The site will be available at `http://localhost:3000`.

### 3. Watch mode (separate terminals)

If you prefer to run pieces independently:

```bash
npm run dev:css    # Tailwind --watch
npm run serve      # Plain SPA dev server
npm run cms        # Optional — local Decap server for CMS development
```

## Working with content

### Editing the brand

All brand-specific copy — company name, phone, services, testimonials, FAQ, process steps, SEO — lives in `js/config.js`. Updating that file rebrands the entire site in-place.

### Adding a blog post

Two ways:

- **Via the CMS (recommended for non-developers):**
  Visit `/admin/` after deploying to Netlify (or locally with `npm run cms` and `local_backend: true` enabled in `admin/config.yml`). Fill in the form, upload an image, publish.
- **Manually:**
  Create a new file in `content/blog/` using this front-matter format:

  ```markdown
  ---
  title: "Your Article Title"
  date: 2026-04-21
  slug: your-article-slug
  description: "Short SEO description."
  image: "/images/service-mold-inspection.jpg"
  category: "Mold Prevention"
  tags:
    - mold
    - prevention
  ---

  Your article body in Markdown.
  ```

  Then run `npm run build:blog` to regenerate `data/posts.json`.

### Updating services, testimonials, FAQ, etc.

Edit the corresponding arrays in `js/config.js`. No rebuild needed for config changes — just refresh.

## Design system

The ClearMend brand theme is defined in `tailwind.config.js` and `css/input.css`:

- **Primary** — teal/cyan gradient (#22d3ee → #06b6d4) for CTAs and accents
- **Accent** — fresh emerald/mint (#10b981) for success, health, air
- **Ink** — deep oceanic navy (#111a2b) for text and premium dark surfaces
- **Typography** — Inter (body), Space Grotesk (display), JetBrains Mono
- **Components** — `.btn-primary`, `.btn-accent`, `.btn-ghost`, `.btn-outline`, `.card`, `.glass`, `.glass-light`, `.heading-xl/lg/md`, `.eyebrow`, `.prose-blog`
- **Utilities** — `.bg-grid-dark`, `.bg-grid-light`, `.bg-dots`, `.mask-fade-b`, `.mask-fade-edges`, `.animate-shine`, `.marquee`
- **Animations** — `float`, `blob`, `shimmer`, `spin-slow`, `marquee`, plus GSAP scroll-triggered reveals

## Deployment (Netlify)

1. Connect this repo to a new Netlify site.
2. Build command: `npm run build`
3. Publish directory: `.`
4. Enable **Netlify Identity** and **Git Gateway** (Identity → Services → enable Git Gateway) so the CMS at `/admin/` can authenticate editors.
5. Add a contact form submission notification under Forms.

`netlify.toml` already contains the correct redirects (admin bypass, legacy `.html` 301s, SPA fallback).

## Accessibility & performance notes

- Semantic HTML, skipped links on every CTA, ARIA labels on icon buttons
- Canvas hero respects reduced motion via CSS `@media (prefers-reduced-motion)` (fallbacks via GSAP reduce-motion handling can be extended further)
- Images are lazy-loaded; the hero image is `fetchpriority="high"`
- Fonts are preconnected and use `display=swap`

## License

Proprietary — all rights reserved by ClearMend.
