# Publishing @meursyphus/ssgoi-react

## Development Setup

During development, the package.json points to `src/lib/index.ts` directly, allowing for hot module replacement and easier development.

## Publishing Process

When you run `pnpm publish`, the following happens automatically:

1. **prepublishOnly**: 
   - Builds the library (`pnpm run build`)
   - Runs `scripts/prepare-publish.js` which modifies package.json to point to dist files

2. **publish**: 
   - NPM publishes the package with the modified package.json

3. **postpublish**: 
   - Runs `scripts/restore-package.js` which restores package.json back to development configuration

## Manual Publishing

If you need to publish manually:

```bash
# Build the library
pnpm run build

# Prepare for publishing
node scripts/prepare-publish.js

# Publish to npm
npm publish

# Restore development package.json
node scripts/restore-package.js
```

## Important Notes

- Never commit the modified package.json (the one pointing to dist)
- The scripts automatically handle the package.json switching
- Make sure to test the build before publishing