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
