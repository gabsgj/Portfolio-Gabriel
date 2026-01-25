# Portfolio — Gabriel James

Personal portfolio site: [gabrieljames.me](https://gabrieljames.me/)

Static site, no frameworks. Content driven by JSON files, rendered client-side with vanilla JS.

## Structure

```
portfolio/
├── assets/
│   ├── logos/          # Certificate issuer logos (WebP)
│   ├── projects/       # Project screenshots by folder
│   ├── styles.css      # Custom styles, animations
│   ├── favicon.webp
│   └── profile-bg.webp
├── data/
│   ├── profile.json    # Bio, stats, socials, certificates
│   ├── projects.json   # Project details, architecture, metrics
│   ├── experience.json # Timeline entries
│   ├── skills.json     # Skill categories and items
│   └── lab.json        # Lab experiment entries
├── js/
│   ├── core.js         # Shared utilities, JSON loader
│   ├── render-dashboard.js
│   ├── render-projects.js
│   ├── render-skills.js
│   ├── render-experience.js
│   ├── render-lab.js
│   ├── admin-mode.js   # Dev tools overlay
│   ├── stars.js        # Background animation
│   └── tailwind-config.js
├── pages/
│   ├── index.html      # Redirects to dashboard
│   ├── dashboard.html  # Main landing page
│   ├── projects.html   # Project list + detail view
│   ├── skills.html     # Skills grid
│   ├── experience.html # Timeline
│   ├── certificates.html
│   ├── lab.html        # Experiments section
│   ├── resume.html
│   └── contact.html
├── lab-notes/          # Markdown files for lab entries
└── resume/             # Resume PDF
```

## Local Development

Any static file server works. The site loads JSON via fetch, so file:// won't work.

```bash
# Python
cd portfolio
python -m http.server 5500

# Node
npx serve portfolio -l 5500

# VS Code
# Install Live Server extension, open pages/index.html, click "Go Live"
```

Open `http://localhost:5500/pages/index.html`

## Build

The build script flattens `pages/*.html` to root level and rewrites relative paths from `../` to `./`:

```bash
mkdir -p dist && \
cp -r assets data js lab-notes resume dist/ && \
cp pages/*.html dist/ && \
find dist -maxdepth 1 -name "*.html" -exec sed -i 's|="\.\./|="./|g' {} + && \
find dist -maxdepth 1 -name "*.html" -exec sed -i "s|'\.\./|'./|g" {} +
```

Output in `dist/` is ready for deployment to any static host (Netlify, Vercel, GitHub Pages, S3, etc).

## Content

All site content lives in `data/*.json`. Edit these to update the site.

### profile.json

Personal info, status, stats, social links, and the full certificates array.

```json
{
  "name": "...",
  "title": "...",
  "bio": "...",
  "stats": { "projects": 10, "hackathonsWon": 4 },
  "certificates": [...]
}
```

### projects.json

Array of project objects. Each project has:

- `id`, `title`, `status` (DEPLOYED, EXPERIMENT, ARCHIVED)
- `summary`, `problem` — short and long descriptions
- `architecture` — array of steps explaining the system
- `tech` — technology tags
- `metrics` — key results with labels and values
- `screenshots` — folder path under `assets/` (e.g., `"projects/xenia"`)
- `links` — `code` and `demo` URLs

### experience.json

Timeline entries with types: `work`, `achievement`, `certification`, `opensource`.

### skills.json

Skill categories with different display types: `list`, `tags`, `grid`, `inline`.

## Screenshots

Screenshots load automatically from `assets/projects/<folder>/`. Name files as `1.webp`, `2.webp`, etc.

The renderer checks for files 1-20 in parallel, so missing numbers are fine. It also looks for `logo.webp` if present.

All images are WebP for faster loading (~87% smaller than PNG).

## Pages

| Page | Description |
|------|-------------|
| dashboard | Landing page with profile card, focus areas, terminal widget |
| projects | Split view: project list sidebar + detail panel with screenshots |
| skills | Grid of skill cards with different layouts per category |
| experience | Vertical timeline with work, achievements, certifications |
| certificates | Grid of certificate cards with issuer logos |
| lab | Experiment entries with linked markdown notes |
| resume | Embedded PDF viewer |
| contact | Contact form and social links |

## Styling

- Tailwind CSS via CDN (no build needed)
- Custom properties in `styles.css` for colors
- Space Grotesk for headings, JetBrains Mono for code/labels
- Material Symbols for icons
- Dark theme with terminal aesthetic

## Notes

- No build tooling required for development
- ES modules used throughout (`type="module"` in script tags)
- Mobile responsive with hamburger nav
- Project detail view uses lightbox for screenshot gallery
- Keyboard navigation in lightbox (arrows, escape)


