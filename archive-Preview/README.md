# gabsgj.github.io

> Minimal, calm "coming soon" surface for Gabriel James — live at [gabrieljames.me](https://gabrieljames.me).

## Overview

This repo powers the holding page for Gabriel's portfolio + studio. It is a single handcrafted `index.html` with subtle WebGL blue waves, a focused hero, and just enough context + contact to feel finished while the full site ships.

## Highlights

- **Subtle WebGL background** — soft right-to-left blue waves that gently react to cursor movement.
- **Typewriter hero line** — short rotating phrases about calm intelligence, applied AI, and copilots for real ops.
- **Ultra-minimal content** — name, one-line story, "Coming Soon" pill, and direct links to email, GitHub, and LinkedIn.
- **Accessibility-aware motion** — respects `prefers-reduced-motion` and falls back to a static gradient.
- **Zero dependencies** — just HTML/CSS/JS for instant deploys.

## Local development

```powershell
# clone + navigate
git clone https://github.com/gabsgj/gabsgj.github.io.git
cd gabsgj.github.io

# open the page locally
start index.html
```

For live reload you can optionally run a tiny static server (for example `npx serve .`), but it's not required.

## Deployment

- The site is published through GitHub Pages and pointed to **gabrieljames.me** via the `CNAME` file.
- Any push to `main` redeploys automatically. Keep assets lightweight for fast Time-To-First-Paint.

Favicon and touch icon files are expected at the repo root as:

- `favicon.png` (32×32)
- `favicon-16.png` (16×16)
- `apple-touch-icon.png` (180×180+)

## Contact

Questions or collaboration ideas? Email [gabriel22dec@gmail.com](mailto:gabriel22dec@gmail.com).