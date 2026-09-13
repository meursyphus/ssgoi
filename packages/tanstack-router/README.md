# @ssgoi/tanstack-router

SSGOI transitions for TanStack Router. Install this package in an existing TanStack Router app:

```sh
npm install @ssgoi/tanstack-router
```

```tsx
import {
  Ssgoi,
  SsgoiRouteBoundary,
  type SsgoiConfig,
} from "@ssgoi/tanstack-router";
import { drill } from "@ssgoi/tanstack-router/view-transitions";
```

The package re-exports the public `@ssgoi/react` runtime API and adds the router
boundary. `@ssgoi/react` is installed as an implementation dependency; applications
using these imports do not need to install it separately. React, React DOM, and
TanStack Router 1.93 or newer within major 1 are required peers.

`/types`, `/view-transitions`, and `/unplugin` (including its bundler subpaths)
forward the corresponding React entry points without bundling another copy.
Framework-independent shared libraries should continue to use `@ssgoi/react`.

See the [setup guide](https://ssgoi.dev/llms/frameworks/tanstack-router.txt) and
[runnable template](../../templates/tanstack-router/README.md).

```sh
pnpm --filter @ssgoi/tanstack-router... build
pnpm --filter @ssgoi/tanstack-router test:run
```

Migration: replace `@ssgoi/react/tanstack-router` with `@ssgoi/tanstack-router` and use the
same package for providers, types, and transitions. This import change belongs
to the next major release; all SSGOI packages are released in lockstep.
