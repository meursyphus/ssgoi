# @ssgoi/nextjs

SSGOI transitions for Next.js. Install this package in an existing Next.js app:

```sh
npm install @ssgoi/nextjs
```

```tsx
import { Ssgoi, SsgoiRouteBoundary, type SsgoiConfig } from "@ssgoi/nextjs";
import { drill } from "@ssgoi/nextjs/view-transitions";
```

The package re-exports the public `@ssgoi/react` runtime API and adds the router
boundary. `@ssgoi/react` is installed as an implementation dependency; applications
using these imports do not need to install it separately. React, React DOM, and
Next.js App Router 13.4–16 are required peers.

`/types`, `/view-transitions`, and `/unplugin` (including its bundler subpaths)
forward the corresponding React entry points without bundling another copy.
Framework-independent shared libraries should continue to use `@ssgoi/react`.

See the [setup guide](https://ssgoi.dev/llms/frameworks/nextjs.txt) and
[runnable template](../../templates/nextjs/README.md).

```sh
pnpm --filter @ssgoi/nextjs... build
pnpm --filter @ssgoi/nextjs test:run
```

Migration: replace `@ssgoi/react/nextjs` with `@ssgoi/nextjs` and use the
same package for providers, types, and transitions. This import change belongs
to the next major release; all SSGOI packages are released in lockstep.
