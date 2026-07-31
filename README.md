# website

pawngrubber's website.

Being built live on stream at [twitch.tv/pawngrubber](https://twitch.tv/pawngrubber).

Architecture is still being decided (frontend-only vs. frontend + backend) — this repo starts minimal and grows as decisions land. Design and build conversations are tracked in the issues, so the history of what was built and why is readable there.

## Structure

This is the live site, served directly from the repository root as plain static HTML, CSS, and JavaScript by deliberate choice.

- `index.html` — Home / intro surface shell.
- `about.html` — About surface shell.
- `work.html` — Work / portfolio surface shell.
- `css/tokens.css` — Design system custom properties (color palette, dark/light themes, typography, spacing).
- `css/base.css` — Shared reset, layout, header, footer, buttons, and responsive primitives.
- `css/home.css`, `css/about.css`, `css/work.css` — Surface-specific stylesheets.
- `js/site.js` — Theme toggle state and mobile navigation drawer script.
- `assets/` — Directory for images, media, and downloadable static assets.
- `.nojekyll` — Bypasses Jekyll processing for GitHub Pages hosting.

### Future Framework / TypeScript Pivot
If the project pivots to a framework build (e.g., React with Vite and TypeScript), the root `index.html` serves as the entry point alongside a new `package.json` and `src/` directory, while `css/tokens.css` is imported directly into the application layout without requiring design token refactoring.
