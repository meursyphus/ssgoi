# SSGOI

Native app-like page transitions for the web.

**[Try it live →](https://ssgoi.dev)**

![SSGOI Demo](./ssgoi.gif)

---

## AI-Assisted Setup

Using Claude, Cursor, ChatGPT, or other AI assistants? Let them set it up for you.

**Add this to your AI's context:**

```
https://ssgoi.dev/llms.txt
```

Contains complete setup guides, all transition types, troubleshooting, and API docs.

---

## Why SSGOI?

Web pages don't transition—they just swap. SSGOI changes that.

|                    | View Transition API | Other Libraries | SSGOI |
| ------------------ | :-----------------: | :-------------: | :---: |
| All browsers       |   ❌ Chrome only    |       ✅        |  ✅   |
| SSR support        |     ⚠️ Limited      |    ⚠️ Varies    |  ✅   |
| Spring physics     |         ❌          |     ⚠️ Some     |  ✅   |
| Router agnostic    |         ❌          |       ❌        |  ✅   |
| Back/forward state |         ❌          |       ❌        |  ✅   |

**60fps guaranteed** — Spring physics pre-computed to Web Animation API keyframes. GPU-accelerated, main thread free.

---

## Quick Start

```bash
npm install @ssgoi/react
```

### 1. Wrap your app (layout.tsx)

```tsx
"use client";

import { Ssgoi } from "@ssgoi/react";
import { drill, fade } from "@ssgoi/react/view-transitions";

const config = {
  transitions: [
    // iOS-style drill-in when entering a post, ease back out
    drill({ enter: "/post/*", exit: "*" }),
    // Calm cross-fade between top-level pages
    fade({ paths: ["/", "/about"] }),
  ],
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Ssgoi config={config}>
          {/* relative + z-0: the outgoing page is cloned with position:absolute */}
          <div className="relative z-0">{children}</div>
        </Ssgoi>
      </body>
    </html>
  );
}
```

### 2. Mark your pages

```tsx
// app/page.tsx
export default function HomePage() {
  return (
    <main data-ssgoi-transition="/">
      <h1>Home</h1>
    </main>
  );
}

// app/post/[id]/page.tsx
export default function PostPage({ params }) {
  return (
    <main data-ssgoi-transition={`/post/${params.id}`}>
      <h1>Post Detail</h1>
    </main>
  );
}
```

**That's it.** Your pages now transition like a native app.

---

## Transitions

Each transition is a factory you drop into `config.transitions`. They return path-transition groups, so nested arrays are flattened automatically.

```tsx
import {
  fade,
  drill,
  slide,
  scroll,
  axis,
  sheet,
  hero,
  zoom,
} from "@ssgoi/react/view-transitions";

// Symmetric — every pair animates the same ({ paths })
fade({ paths: ["/", "/about"] });
hero({ paths: ["/products", "/products/*"] }); // shared element
zoom({ paths: ["/gallery", "/photo/*"], type: "expand" }); // card → detail

// Directional — enter / exit get different physics ({ enter, exit })
drill({ enter: "/post/*", exit: "*" }); // iOS list → detail
sheet({ enter: "/compose", exit: "*" }); // bottom sheet

// Ordered — path order decides forward / back ({ paths })
slide({ paths: ["/tabs/a", "/tabs/b"] }); // horizontal tabs
scroll({ paths: ["/step-1", "/step-2"] }); // vertical onboarding
axis({ paths: ["/feed", "/profile"] }); // Material shared axis
```

**All built-in transitions:** `fade` · `drill` · `slide` · `scroll` · `axis` · `sheet` · `hero` · `zoom` · `strip` · `blind` · `film` · `rotate` · `jaemin`.

See them all live at [ssgoi.dev](https://ssgoi.dev) or in [llms.txt](https://ssgoi.dev/llms.txt).

---

## Packages

| Package          | Framework          |
| ---------------- | ------------------ |
| `@ssgoi/react`   | React, Next.js     |
| `@ssgoi/svelte`  | Svelte, SvelteKit  |
| `@ssgoi/vue`     | Vue, Nuxt          |
| `@ssgoi/solid`   | Solid, SolidStart  |
| `@ssgoi/angular` | Angular            |
| `@ssgoi/core`    | Framework-agnostic engine |

---

## Documentation

**[ssgoi.dev](https://ssgoi.dev)** — Full docs, interactive examples, and API reference.
**[ssgoi.dev/llms.txt](https://ssgoi.dev/llms.txt)** — Plain-text setup guide for AI assistants.

---

## License

MIT © [MeurSyphus](https://github.com/meursyphus)
