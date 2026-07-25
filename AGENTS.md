# SSGOI

## Releasing

Every package under `packages/*` is versioned in lockstep by
`scripts/bump-version.mjs`; `pnpm release` builds and publishes them together.

**A version bump is not finished until `apps/docs/public/llms.txt` says the new
version.** Update the `Current version:` line near the top of that file in the
same change as the bump.

That file is not a generated artifact — it is the URL the docs quick start
hands to coding agents as the whole setup guide. A stale version there is the
version that gets installed, in every project that asks an agent to add SSGOI,
until someone notices by hand.
