# Portfolio — Gabriel James

AI & ML developer. This is my portfolio — built it to showcase projects and keep things simple.

**Live site:** [gabrieljames.me](https://gabrieljames.me/)

Static site, no frameworks. All content lives in JSON files and gets rendered client-side with vanilla JS. Wanted something fast, easy to update, and with a terminal/dev aesthetic.

## What's in here

```
portfolio/
├── assets/
│   ├── logos/          # Certificate issuer logos
│   ├── projects/       # Project screenshots by folder
│   ├── styles.css
│   └── favicon.png
├── data/
│   ├── profile.json    # Bio, stats, socials, certificates
│   ├── projects.json   # Project details, architecture, metrics
│   ├── experience.json # Timeline entries
│   ├── skills.json     # Skill categories
│   └── lab.json        # Lab experiment entries
├── js/
│   ├── core.js         # Shared utilities, JSON loader
│   ├── render-*.js     # Page-specific renderers
│   ├── admin-mode.js   # Dev tools overlay
│   ├── stars.js        # Background animation
│   └── tailwind-config.js
├── pages/
│   ├── index.html      # Boot screen
│   ├── dashboard.html  # Main landing page
│   ├── projects.html   # Project list + detail view
│   ├── skills.html
│   ├── experience.html # Timeline
│   ├── certificates.html
│   ├── lab.html
│   ├── resume.html
│   └── contact.html
├── lab-notes/          # Markdown files for lab entries
└── resume/
```

## Features

- Terminal-inspired dark UI with that dev aesthetic
- Animated boot screen on first load
- Interactive star field background (try moving your mouse)
- Project pages with architecture breakdowns and metrics
- Lightbox gallery with keyboard nav (arrows to browse, esc to close)
- Timeline view for experience/achievements
- Lab section for experiments and side projects
- Fully responsive, hamburger nav on mobile

## Running locally

Any static server works. Uses fetch for JSON, so `file://` won't work.

```bash
# Python
cd portfolio && python -m http.server 5500

# Node
npx serve portfolio -l 5500

# Or just use VS Code Live Server
```

Then open `http://localhost:5500/pages/index.html`

## Build

Flattens pages to root and rewrites paths:

```bash
mkdir -p dist && \
cp -r assets data js lab-notes resume dist/ && \
cp pages/*.html dist/ && \
find dist -maxdepth 1 -name "*.html" -exec sed -i 's|="\.\./|="./|g' {} + && \
find dist -maxdepth 1 -name "*.html" -exec sed -i "s|'\.\./|'./|g" {} +
```

Deploy `dist/` to Netlify, Vercel, GitHub Pages, wherever.

## Editing content

Everything lives in `data/*.json`. Edit those to update the site.

**profile.json** — name, title, bio, stats, social links, certificates

**projects.json** — each project has id, title, status, summary, architecture steps, tech tags, metrics, screenshot folder, links

**experience.json** — timeline entries (work, achievements, hackathons, open source)

**skills.json** — skill categories with different display types

## Screenshots

Put project screenshots in `assets/projects/<folder>/` named `1.webp`, `2.webp`, etc. The renderer checks 1-20 in parallel, gaps are fine. Add `logo.webp` for a project logo.

WebP format keeps things fast.

## Pages

| Page | What it does |
|------|--------------|
| dashboard | Landing page, profile card, terminal widget |
| projects | Split view with sidebar and detail panel |
| skills | Grid layout, different styles per category |
| experience | Vertical timeline |
| certificates | Grid of certs with issuer logos |
| lab | Experiment entries with markdown notes |
| resume | PDF viewer |
| contact | Form and social links |

## Tech

- Tailwind via CDN (no build step)
- Space Grotesk + JetBrains Mono
- Material Symbols icons
- ES modules throughout
- Dark theme, terminal aesthetic

## Why no framework?

Honestly, for a portfolio this size, React/Vue/whatever would be overkill. The JSON + vanilla JS approach means:
- Zero build time
- Easy to update content (just edit JSON)
- Loads fast
- No dependency hell
- Anyone can fork and understand it

## Notes

No build tooling needed for dev. Mobile responsive with hamburger nav. Lightbox for screenshots with keyboard nav (arrows, esc). The ping button on the experience page is a fun little easter egg.
