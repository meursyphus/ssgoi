# Next.js Integration Guide

## Flash Prevention (Recommended)

When using SSGOI with Next.js, you might notice a brief flash where the incoming page appears at its final position before the transition animation starts. This happens because React's mount lifecycle can occur after the browser paint.

To prevent this flash, pass `getPathname` to the `Ssgoi` component:

### App Router (Next.js 13+)

```tsx
// app/providers.tsx
"use client";

import { usePathname } from "next/navigation";
import { useRef, useCallback } from "react";
import { Ssgoi } from "@ssgoi/react";
import { fade } from "@ssgoi/react/view-transitions";
import type { SsgoiConfig } from "@ssgoi/react";

const config: SsgoiConfig = {
  defaultTransition: fade(),
  transitions: [
    // your transitions...
  ],
};

// Stable function reference that always returns latest pathname
function useEventCallback<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef(fn);
  ref.current = fn;
  return useCallback((...args: any[]) => ref.current(...args), []) as T;
}

export function SsgoiProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const getPathname = useEventCallback(() => pathname);

  return (
    <Ssgoi config={config} getPathname={getPathname}>
      <div style={{ position: "relative", minHeight: "100vh" }}>
        {children}
      </div>
    </Ssgoi>
  );
}
```

```tsx
// app/layout.tsx
import { SsgoiProvider } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <SsgoiProvider>{children}</SsgoiProvider>
      </body>
    </html>
  );
}
```

### How It Works

1. When `getPathname` is provided, SSGOI tracks pathname changes
2. Elements that will animate start with `visibility: hidden`
3. When the transition animation begins (`onStart`), visibility is restored to `visible`
4. This prevents the flash because the element is hidden until the animation positions it correctly

### Without Flash Prevention

If you don't need flash prevention (e.g., simpler transitions where flash isn't noticeable), you can omit `getPathname`:

```tsx
<Ssgoi config={config}>
  {children}
</Ssgoi>
```

## Pages Router

For the Pages Router, use `useRouter` from `next/router`:

```tsx
// pages/_app.tsx
import { useRouter } from "next/router";
import { useRef, useCallback } from "react";
import { Ssgoi } from "@ssgoi/react";
import { fade } from "@ssgoi/react/view-transitions";

const config = {
  defaultTransition: fade(),
};

// Stable function reference that always returns latest pathname
function useEventCallback<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef(fn);
  ref.current = fn;
  return useCallback((...args: any[]) => ref.current(...args), []) as T;
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const getPathname = useEventCallback(() => router.pathname);

  return (
    <Ssgoi config={config} getPathname={getPathname}>
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <Component {...pageProps} />
      </div>
    </Ssgoi>
  );
}
```

## Complete Example

```tsx
// app/providers.tsx
"use client";

import { usePathname } from "next/navigation";
import { useRef, useCallback } from "react";
import { Ssgoi } from "@ssgoi/react";
import { fade, scroll, drill } from "@ssgoi/react/view-transitions";
import type { SsgoiConfig } from "@ssgoi/react";

const config: SsgoiConfig = {
  defaultTransition: fade(),
  transitions: [
    {
      from: "/",
      to: "/about",
      transition: scroll({ direction: "up" }),
      symmetric: true,
    },
    {
      from: "/products",
      to: "/products/*",
      transition: drill({ direction: "enter" }),
      symmetric: true,
    },
  ],
};

// Stable function reference that always returns latest pathname
function useEventCallback<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef(fn);
  ref.current = fn;
  return useCallback((...args: any[]) => ref.current(...args), []) as T;
}

export function SsgoiProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const getPathname = useEventCallback(() => pathname);

  return (
    <Ssgoi config={config} getPathname={getPathname}>
      <div style={{ position: "relative", minHeight: "100vh" }}>
        {children}
      </div>
    </Ssgoi>
  );
}
```

```tsx
// app/page.tsx
import { SsgoiTransition } from "@ssgoi/react";

export default function HomePage() {
  return (
    <SsgoiTransition id="/">
      <main>
        <h1>Home</h1>
      </main>
    </SsgoiTransition>
  );
}
```

```tsx
// app/about/page.tsx
import { SsgoiTransition } from "@ssgoi/react";

export default function AboutPage() {
  return (
    <SsgoiTransition id="/about">
      <main>
        <h1>About</h1>
      </main>
    </SsgoiTransition>
  );
}
```
