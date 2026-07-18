---
name: verify
description: Build/launch/drive recipe for verifying apps/docs changes at runtime (demos, docs pages, llms.txt).
---

# Verify apps/docs

## Launch

```bash
cd apps/docs && pnpm dev   # Next.js + Turbopack, ready in <1s on :3000
```

Wait for `Ready in` in the log. Port 3000; kill with `lsof -ti:3000 | xargs kill`.

## Drive

Playwright is installed globally (asdf node), not in the repo. From a scratch
dir, symlink the global modules so `import { chromium } from "playwright"`
resolves:

```bash
ln -sfn "$(npm root -g)" <scratchdir>/node_modules
```

Use a 1280x960 viewport — the mobile demos render a centered phone frame on
desktop widths. Key surfaces:

- Mobile demos: `/demo/<app>` (e.g. `/demo/google-photos`). Transitions are the
  product — capture mid-transition frames with `waitForURL` + ~120ms delay,
  and let animations settle ~1200ms before asserting final state.
- Remount checks: tag a DOM node (`el.__tag = "x"`) before navigating, re-read
  after — survives ⇔ no remount (used for the bottom-nav/nested-boundary shell).
- Docs pages: `/docs/...`; llms files are static from `public/` (`/llms.txt`,
  `/llms/*.txt`).

## Gotchas

- google-photos "Collage" entry is a `<button>` with `router.push`, not a link.
- Dev console shows a pre-existing CORS error for `unpkg.com/react-grab` — noise.
- Stale `.next/types` validator errors after moving route files — ignore;
  regenerated on next dev/build.
