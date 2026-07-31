# website

The source for [pawngrubber.com](https://pawngrubber.com) — a small personal site written as plain HTML, CSS and JavaScript, with no framework, no build step and no dependencies. Everything under `site/` is what the domain serves, byte for byte; the rest of the repo is machinery that never reaches the web.

It is being built in the open at [twitch.tv/pawngrubber](https://www.twitch.tv/pawngrubber), and the [issues](https://github.com/pawngrubber/website/issues) carry the reasoning behind most of what is here.

## running it locally

There is nothing to install. Serve `site/` over HTTP:

```sh
python3 -m http.server 8000 --directory site
```

Then open <http://localhost:8000>. Any static server works — the directory has no server-side requirements.

Every internal link is document-relative, so the pages also open straight from disk, but a local server is closer to what production does.

## deploying

Merging to `main` publishes. `.github/workflows/deploy.yml` uploads `site/` as the Pages artifact and deploys it; the domain updates in about a minute. There is no build step between checkout and upload.

Two details worth knowing before touching any of it:

- **The Pages source is "GitHub Actions", not "deploy from a branch."** With the branch setting, Pages builds the repo *root* with Jekyll and ignores the uploaded artifact entirely. That was the state for a while, and the symptom was subtle: the domain returned 200, the deploy workflow reported success, and what was actually served was Jekyll's rendering of this README — with the real site sitting one level too deep at `/site/index.html`. The fix was a settings change, not a code change ([issue #14](https://github.com/pawngrubber/website/issues/14)).
- **`CNAME` lives at the repo root, outside the published artifact.** The custom domain is held by the Pages settings rather than by that file. If a deploy ever drops the domain, the fix is to move `CNAME` into the published directory.

HTTPS is Let's Encrypt via Pages, renewed automatically.

## layout

```
site/                  the published root — this directory is the website
  index.html           home
  about.html           about
  work.html            work
  css/tokens.css       design tokens only: palette, both themes, type stacks, spacing
  css/base.css         reset, header, footer, buttons, focus states, responsive primitives
  css/home.css         per-page stylesheets, one per surface
  css/about.css
  css/work.css
  js/site.js           theme toggle and mobile nav — the only JavaScript on the site
  assets/              images, media, downloads
.github/workflows/
  ci.yml               pull-request checks
  deploy.yml           publish on merge to main
CNAME                  custom domain
README.md
```

The three pages share a header, a footer, a theme toggle that remembers its choice, and a nav that collapses under 680px. Page content is being built one surface at a time in open pull requests, so the surfaces themselves are currently thin.

## decisions

**Plain HTML and CSS, no framework.** A three-page site with one theme toggle and one nav button does not need a build step, and a build step is not free — it is a dependency tree, a lockfile, and a class of failure sitting between the source and the served bytes. The cost of the choice is markup duplicated across three files; the benefit is that what is in the repo is exactly what ships, and a reader can hold the whole site in their head at once.

**`site/` is the publish root, not the repo root.** The scaffold was first built at the repo root, on the reasoning that Pages serves from root. By the time it was reviewed the CI and deploy workflows had already landed, and both were written against `site/` — `deploy.yml` uploads `path: site`, `ci.yml` globs `find site -name '*.html'`. So a root layout would have been neither published nor checked, and the giveaway was the CI badge itself: the scaffold PR was green because the validator's glob had matched exactly one file, a placeholder, and had never looked at the work. A green check that inspects nothing is worse than a red one. The layout moved under `site/`, and because every internal link was already document-relative that was a `git mv` with no edit to any file's contents. The publish boundary also keeps repo metadata — this README, the workflows — off the public site.

**The design mockup is a branch, not a directory.** The design-stage artifact lives on `design/base` and never merges. Keeping it off `main` means there is exactly one website in the repo, and no recurring argument about which files are the real ones.

**A framework pivot is kept cheap, not pre-built.** If this ever becomes React and TypeScript, the intent is that it is a port rather than a rewrite. Design tokens are isolated in `site/css/tokens.css` so they become a single global import. The CSS is class-based with shallow specificity — no `!important`, no styling by ID, nothing coupled to document nesting — so the markup can be re-cut into components without touching the design rules. The JavaScript injects no markup and holds no global state. The duplicated header is the seam a component pivot collapses, and leaving it duplicated is cheaper than a hand-rolled partial system built to avoid it. The deploy change is one line: `path: site` becomes `path: dist`.

## quality gates

`.github/workflows/ci.yml` runs on every pull request and gates it:

- **HTML validation** over every page in `site/`.
- **Link checking** with [lychee](https://github.com/lycheeverse/lychee), including in-page fragments — so a link to an anchor that no longer exists fails the build, not just a dead external URL.

Neither step is allowed to soften: no `|| true`, no `continue-on-error`, no blanket exit-code tolerance.

The validator is currently HTML Tidy 5.6, which is what the runner's package repository ships and which predates `aria-current` reaching ARIA 1.1. The nav marks the active page with `aria-current="page"` — which is what an accessible active-page indicator requires — so the gate reports a false positive on correct markup, and because it fails first it short-circuits the link check behind it. Tidy did not gain per-message suppression until 5.8, so on 5.6 there is no narrow workaround; loosening the step to tolerate warnings was tried and reverted, because Tidy also reports missing `alt`, unclosed elements and mis-nested tags as warnings, and those are exactly what the gate exists to catch. Replacing it with a validator that understands current HTML is [issue #11](https://github.com/pawngrubber/website/issues/11), and is in flight.

There are no unit tests. For a site this size the two checks above are the coverage, and claiming more would be an overstatement.
