# website

pawngrubber's website.

Being built live on stream at [twitch.tv/pawngrubber](https://twitch.tv/pawngrubber).

Architecture is still being decided (frontend-only vs. frontend + backend) — this repo starts minimal and grows as decisions land. Design and build conversations are tracked in the issues, so the history of what was built and why is readable there.

## how it deploys

- `site/` is the deployed content — whatever is in it on `main` is the live site
- serving: GitHub Pages at [pawngrubber.com](https://pawngrubber.com) (DNS at Squarespace points there; HTTPS via Let's Encrypt, automatic)
- `.github/workflows/ci.yml`: every PR gets HTML validation and link checking
- `.github/workflows/deploy.yml`: every merge to `main` deploys, live in ~1 minute

No build step yet — `site/` is served as-is. If a static site generator lands later, its build goes in `deploy.yml` between checkout and upload.

## structure

`site/` is the real website, not a mockup — it is what pawngrubber.com serves. Plain static HTML, CSS and JavaScript, no framework and no build step, by deliberate choice. The design-stage mockup is the `design/base` branch, which is reference material and never merges.

- `site/index.html` — home / intro surface
- `site/about.html` — about surface
- `site/work.html` — work surface
- `site/css/tokens.css` — design tokens only: palette, dark/light themes, type stacks, spacing
- `site/css/base.css` — shared reset, header, footer, buttons, responsive primitives
- `site/css/home.css`, `site/css/about.css`, `site/css/work.css` — per-surface stylesheets
- `site/js/site.js` — theme toggle and mobile nav
- `site/assets/` — images, media, downloadable assets

Everything outside `site/` is repo machinery — workflows, this README, the CNAME — and is not published.

### if we pivot to a framework

Tokens are isolated in `site/css/tokens.css` precisely so a React/TypeScript move is a copy rather than a refactor: import that one file globally and everything else becomes components. The deploy is one line — `path: site` becomes `path: dist` in `deploy.yml`. Nothing in the CSS is coupled to document nesting, so the markup can be re-cut into components without touching the design rules.
