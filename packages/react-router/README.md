# @ssgoi/react-router

SSGOI transitions for React Router. Install this package in an existing React Router app:

```sh
npm install @ssgoi/react-router
```

```tsx
import {
  Ssgoi,
  SsgoiRouteBoundary,
  type SsgoiConfig,
} from "@ssgoi/react-router";
import { drill } from "@ssgoi/react-router/view-transitions";
```

The package re-exports the public `@ssgoi/react` runtime API and adds the router
boundary. `@ssgoi/react` is installed as an implementation dependency; applications
using these imports do not need to install it separately. React, React DOM, and
React Router 6 or 7 are required peers.

`/types`, `/view-transitions`, and `/unplugin` (including its bundler subpaths)
forward the corresponding React entry points without bundling another copy.
Framework-independent shared libraries should continue to use `@ssgoi/react`.

See the [setup guide](https://ssgoi.dev/llms/frameworks/react-router.txt) and
[runnable template](../../templates/react-router/README.md).

```sh
pnpm --filter @ssgoi/react-router... build
pnpm --filter @ssgoi/react-router test:run
```

Migration: replace `@ssgoi/react/react-router` with `@ssgoi/react-router` and use the
same package for providers, types, and transitions. This import change belongs
to the next major release; all SSGOI packages are released in lockstep.
