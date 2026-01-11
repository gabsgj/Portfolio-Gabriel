# Gabriel James — Portfolio

Deployed personal portfolio website:
- https://gabrieljames.me/

## Project structure
- `portfolio/` — main site (pages, data, assets, JS)
- `archive-Preview/` — archived/preview version

## Run locally
This is a static site.

Option A (VS Code Live Server):
1. Open `portfolio/pages/index.html`
2. Use the Live Server extension to serve it

Option B (Python simple server):
```bash
cd portfolio
python -m http.server 5500
```
Then open:
- http://localhost:5500/pages/index.html

## Update content
Most content is driven by JSON in:
- `portfolio/data/`

Common files:
- `portfolio/data/profile.json`
- `portfolio/data/projects.json`
- `portfolio/data/experience.json`
- `portfolio/data/skills.json`
