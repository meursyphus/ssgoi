export type FrameworkSection = {
  heading: string;
  body?: string;
  code?: string;
  language?: string;
};

export type RouterGuide = {
  slug: string;
  name: string;
  lead: string;
  experimental: boolean;
  llmsUrl?: string;
  templateUrl?: string;
  sections: FrameworkSection[];
};

export type FrameworkDoc = {
  slug: string;
  name: string;
  pkg: string;
  lead: string;
  llmsUrl?: string;
  native?: boolean;
  sections: FrameworkSection[];
  routers: RouterGuide[];
};

export const FRAMEWORK_DOCS: FrameworkDoc[] = [
  {
    slug: "react",
    name: "React",
    pkg: "@ssgoi/react",
    lead: "Use SSGOI with React independently of your router. Router helpers are optional conveniences that connect a pathname and a page lifetime to the same React implementation.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/react.txt",
    sections: [
      {
        heading: "Common setup",
        body: "Install @ssgoi/react. Keep one provider and a stable config above routed content. The surrounding layout supplies position: relative, z-index: 0, min-height: 100dvh, and overflow-x: clip.",
        code: `import type { ReactNode } from "react";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { drill } from "@ssgoi/react/view-transitions";

const config: SsgoiConfig = {
  transitions: [{ on: "/**", except: "/", transition: drill() }],
};

export function SsgoiProvider({ children }: { children: ReactNode }) {
  return <Ssgoi config={config}>{children}</Ssgoi>;
}`,
      },
      {
        heading: "Using another router",
        body: "A dedicated helper is not required. Connect your router’s committed pathname to a keyed DOM boundary in the same render as its children. The Route boundaries guide explains the general pattern.",
      },
    ],
    routers: [
      {
        slug: "nextjs",
        name: "Next.js",
        lead: "Use the App Router helper to read the committed pathname, handle URL-hook suspension, and mark the routed region. It is included in @ssgoi/react.",
        experimental: false,
        sections: [
          {
            heading: "Connect the App Router",
            body: 'Place the common provider and config in app/ssgoi-provider.tsx, add "use client", and export it as SsgoiProvider. Import the ready-made boundary in your layout; no local router wrapper is needed.',
            code: `import { SsgoiRouteBoundary } from "@ssgoi/react/nextjs";

// Inside your provider, around the layout's changing children:
<SsgoiRouteBoundary>{children}</SsgoiRouteBoundary>`,
          },
          {
            heading: "3. Root layout",
            body: "Place both pieces inside the layout shell. The wrapper supplies the containing block, stacking context, and horizontal clipping needed by the leaving page.",
            code: `// app/layout.tsx
import { type ReactNode } from "react";
import { SsgoiProvider } from "./ssgoi-provider";
import { SsgoiRouteBoundary } from "@ssgoi/react/nextjs";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="relative z-0 min-h-dvh overflow-x-clip">
          <SsgoiProvider>
            <SsgoiRouteBoundary>{children}</SsgoiRouteBoundary>
          </SsgoiProvider>
        </main>
      </body>
    </html>
  );
}`,
          },
          {
            heading: "Persistent layouts",
            body: "A layout-owned routeKey preserves the header while the inner boundary replaces the changing content. Keep the provider above these section layouts, without a full-path boundary remounting every section from above.",
            code: `// app/products/layout.tsx
import type { ReactNode } from "react";
import { SsgoiRouteBoundary } from "@ssgoi/react/nextjs";

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return (
    <SsgoiRouteBoundary routeKey="products-layout">
      <header>Products</header>
      <SsgoiRouteBoundary>{children}</SsgoiRouteBoundary>
    </SsgoiRouteBoundary>
  );
}`,
          },
          {
            heading: "Parallel slots and interception",
            body: "Use resolve({ pathname, selectedSegments }) for slot-specific ids and keys. Function props belong in a client component. selectedSegmentsToPath(selectedSegments, basePath) resolves the owned slot beneath its layout; an empty slot is its index route, even when the browser URL points at a modal. Interception also needs the app’s route/slot files and compatible middleware or proxy rules. Verify soft navigation, back, and direct entry; the boundary includes URL-hook Suspense and accepts a fallback for Cache Components.",
          },
        ],
        templateUrl:
          "https://github.com/meursyphus/ssgoi/tree/HEAD/templates/nextjs",
        llmsUrl: "https://ssgoi.dev/llms/frameworks/nextjs.txt",
      },
      {
        slug: "remix",
        name: "Remix",
        lead: "Use the Remix 2 entry with @remix-run/react. It reads Remix’s own router context, so it does not depend on a separately installed React Router version.",
        experimental: true,
        sections: [
          {
            heading: "Wrap a layout outlet",
            body: "Keep the common provider in root.tsx and place this boundary in a route layout. Follow Remix 2’s own React 18 dependency requirements. React Router 7 framework mode uses the React Router helper instead.",
            code: `import { Outlet } from "@remix-run/react";
import { SsgoiRouteBoundary } from "@ssgoi/react/remix";

export default function Layout() {
  return <SsgoiRouteBoundary><Outlet /></SsgoiRouteBoundary>;
}`,
          },
          {
            heading: "Persistent route families",
            body: "Use routeKey for a persistent shell and a separate inner boundary for changing content. resolve receives Remix’s location and returns { id, key? }; keys are resolved during render.",
          },
        ],
        llmsUrl: "https://ssgoi.dev/llms/frameworks/remix.txt",
      },
      {
        slug: "react-router",
        name: "React Router",
        lead: "Use the helper inside React Router 6 or 7. It follows the committed location; query-only navigation preserves the boundary.",
        experimental: true,
        sections: [
          {
            heading: "Wrap the outlet",
            body: "Put this pathless layout inside the common provider. Register the layout around the pages that should transition.",
            code: `import { Outlet } from "react-router";
import { SsgoiRouteBoundary } from "@ssgoi/react/react-router";

export default function PageBoundaryLayout() {
  return <SsgoiRouteBoundary><Outlet /></SsgoiRouteBoundary>;
}`,
          },
          {
            heading: "3. Route registration",
            body: "In framework mode, put existing page routes under the boundary layout. Keep the document Layout and other root exports from your React Router app.",
            code: `// app/routes.ts
import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/page-boundary.layout.tsx", [
    index("routes/home.tsx"),
    route("posts/:postId", "routes/posts.$postId.tsx"),
  ]),
] satisfies RouteConfig;`,
          },
          {
            heading: "Beyond the basics",
            body: "A persistent shell needs two lifetimes: a stable outer key around the header/tabs and a pathname-keyed inner boundary around <Outlet />. Holding one boundary constant preserves the shell but produces no child OUT/IN. Mount that route family under its own layout instead of the global pathless page boundary; the complete pattern is in the agent guide and template.",
          },
        ],
        templateUrl:
          "https://github.com/meursyphus/ssgoi/tree/HEAD/templates/react-router",
        llmsUrl: "https://ssgoi.dev/llms/frameworks/react-router.txt",
      },
      {
        slug: "tanstack-router",
        name: "TanStack Router",
        lead: "Use this entry for TanStack Router 1, including React applications built with TanStack Start. Both use the same router context.",
        experimental: true,
        sections: [
          {
            heading: "Wrap the root outlet",
            body: "Keep the common provider outside this boundary. For persistent sections, put boundaries in the owning route layouts instead.",
            code: `import { Outlet } from "@tanstack/react-router";
import { SsgoiRouteBoundary } from "@ssgoi/react/tanstack-router";

<SsgoiRouteBoundary><Outlet /></SsgoiRouteBoundary>`,
          },
          {
            heading: "Beyond the basics",
            body: "For a persistent section, keep the root as one <Ssgoi><Outlet /></Ssgoi>, then let the section route own a stable outer shell boundary and a pathname-keyed inner boundary around <Outlet />. Holding only the outer boundary constant preserves state but produces no child transition.",
          },
        ],
        templateUrl:
          "https://github.com/meursyphus/ssgoi/tree/HEAD/templates/tanstack-router",
        llmsUrl: "https://ssgoi.dev/llms/frameworks/tanstack-router.txt",
      },
    ],
  },
  {
    slug: "svelte",
    name: "Svelte",
    pkg: "@ssgoi/svelte",
    lead: "The Svelte package provides the common provider and transition API. Add the SvelteKit helper when Kit owns navigation.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/svelte.txt",
    sections: [
      {
        heading: "Common setup",
        body: "Install @ssgoi/svelte and keep one Ssgoi provider above the changing page region. Transition factories and route rules are shared with the other web packages.",
        code: `import { Ssgoi } from "@ssgoi/svelte";
import { drill } from "@ssgoi/svelte/view-transitions";`,
        language: "ts",
      },
    ],
    routers: [
      {
        slug: "sveltekit",
        name: "SvelteKit",
        lead: "Use onNavigate to detach outgoing content before SvelteKit updates its live children snippet. A key around that snippet alone is not sufficient.",
        experimental: true,
        sections: [
          {
            heading: "Setup",
            language: "xml",
            code: `<!-- src/routes/+layout.svelte -->
<script>
  import { Ssgoi } from "@ssgoi/svelte";
  import { config } from "$lib/ssgoi-config";
  import { SsgoiRouteBoundary } from "@ssgoi/svelte/sveltekit";

  let { children } = $props();
</script>

<main class="relative z-0 min-h-dvh overflow-x-clip">
  <Ssgoi {config}>
    <SsgoiRouteBoundary class="min-h-full">
      {@render children()}
    </SsgoiRouteBoundary>
  </Ssgoi>
</main>`,
          },
          {
            heading: "Why a boundary component",
            body: "The root layout wrapper stays mounted while the live children snippet updates, so a marker on that wrapper has no OUT node. The component detaches the old routed region first — the lifecycle is included in the package; no copied component is needed.",
            language: "text",
            code: `plain {@render children()} : route change mutates DOM in place → no OUT node

boundary component         : onNavigate → unmount old route   (OUT captured)
                             → SvelteKit updates the route
                             → remount under the new id       (IN animates)`,
          },
          {
            heading: "Beyond the basics",
            body: "For a persistent /products shell, return the full pathname as id and /products as key from resolve, then put a second default pathname boundary only around the child content in routes/products/+layout.svelte. The stable outer key preserves header/tabs; the inner boundary produces tab transitions.",
          },
        ],
        templateUrl:
          "https://github.com/meursyphus/ssgoi/tree/HEAD/templates/sveltekit",
        llmsUrl: "https://ssgoi.dev/llms/frameworks/sveltekit.txt",
      },
    ],
  },
  {
    slug: "vue",
    name: "Vue",
    pkg: "@ssgoi/vue",
    lead: "Use the Vue package for the provider and effects. Choose the helper for the router already installed in your app.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/vue.txt",
    sections: [
      {
        heading: "Common setup",
        body: "Install @ssgoi/vue and keep one Ssgoi provider above RouterView or NuxtPage. It receives the shared route configuration.",
        code: `import { Ssgoi } from "@ssgoi/vue";
import { drill } from "@ssgoi/vue/view-transitions";`,
        language: "ts",
      },
    ],
    routers: [
      {
        slug: "vue-router",
        name: "Vue Router",
        lead: "Use the helper with Vue Router 4 inside the common Vue provider.",
        experimental: true,
        sections: [
          {
            heading: "Wrap the routed region",
            body: "The boundary follows the committed router path and replaces its DOM root when the route key changes.",
            code: `<script setup lang="ts">
import { RouterView } from "vue-router";
import { SsgoiRouteBoundary } from "@ssgoi/vue/vue-router";
</script>

<template>
  <SsgoiRouteBoundary><RouterView /></SsgoiRouteBoundary>
</template>`,
            language: "vue",
          },
          {
            heading: "Persistent shells",
            body: "Use routeKey for the outer shell and a changing inner boundary for the page. resolve receives { pathname } and returns { id, key? }.",
          },
        ],
        llmsUrl: "https://ssgoi.dev/llms/frameworks/vue-router.txt",
      },
      {
        slug: "nuxt",
        name: "Nuxt",
        lead: "Use the Nuxt-specific entry inside the common Vue provider. It observes the committed router state rather than Nuxt’s delayed useRoute value.",
        experimental: true,
        sections: [
          {
            heading: "Wrap NuxtPage",
            body: "Keep the provider above the layout and page. Do not add a provider for every page.",
            code: `<script setup lang="ts">
import { SsgoiRouteBoundary } from "@ssgoi/vue/nuxt";
</script>

<template>
  <SsgoiRouteBoundary><NuxtPage /></SsgoiRouteBoundary>
</template>`,
            language: "vue",
          },
          {
            heading: "Beyond the basics",
            body: "For a persistent /products shell, return the full pathname as id and /products as key from the root boundary's resolve, then put a second default pathname boundary only around the nested <NuxtPage />. The stable outer key preserves header/tabs; the inner boundary produces child transitions.",
          },
        ],
        templateUrl:
          "https://github.com/meursyphus/ssgoi/tree/HEAD/templates/nuxt",
        llmsUrl: "https://ssgoi.dev/llms/frameworks/nuxt.txt",
      },
    ],
  },
  {
    slug: "solid",
    name: "Solid",
    pkg: "@ssgoi/solid",
    lead: "Use the Solid package for common rendering and effects. Solid Router and SolidStart share the same boundary implementation.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/solid.txt",
    sections: [
      {
        heading: "Common setup",
        body: "Install @ssgoi/solid and keep one Ssgoi provider above the routed children. The provider is independent of Solid Router.",
        code: `import { Ssgoi } from "@ssgoi/solid";
import { drill } from "@ssgoi/solid/view-transitions";`,
        language: "ts",
      },
    ],
    routers: [
      {
        slug: "solid-router",
        name: "Solid Router",
        lead: "Use the Solid Router entry for Solid applications. SolidStart’s existing entry uses this same implementation.",
        experimental: true,
        sections: [
          {
            heading: "Wrap the routed children",
            body: "The keyed boundary recreates the changing region while routeKey can preserve an outer shell.",
            code: `import { SsgoiRouteBoundary } from "@ssgoi/solid/solid-router";

<SsgoiRouteBoundary>{props.children}</SsgoiRouteBoundary>`,
          },
          {
            heading: "Route lifetime",
            body: "The default key follows the pathname. resolve can return separate id and key values; use a stable shell key only around content that should remain mounted.",
          },
        ],
        llmsUrl: "https://ssgoi.dev/llms/frameworks/solid-router.txt",
      },
      {
        slug: "solidstart",
        name: "SolidStart",
        lead: "Use the same Solid Router boundary through the SolidStart entry.",
        experimental: true,
        sections: [
          {
            heading: "Setup",
            code: `// src/app.tsx
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { Ssgoi } from "@ssgoi/solid";
import { SsgoiRouteBoundary } from "@ssgoi/solid/solidstart";
import { drill } from "@ssgoi/solid/view-transitions";

const config = {
  transitions: [{ on: "/**", except: "/", transition: drill() }],
};

export default function App() {
  return (
    <Router root={(props) => (
      <main class="relative z-0 min-h-dvh overflow-x-clip">
        <Ssgoi config={config}>
          <Suspense>
            <SsgoiRouteBoundary>{props.children}</SsgoiRouteBoundary>
          </Suspense>
        </Ssgoi>
      </main>
    )}>
      <FileRoutes />
    </Router>
  );
}`,
          },
          {
            heading: "Beyond the basics",
            body: "For a persistent /products shell, return the full pathname as id and /products as key from the root boundary's resolve, then put a second default pathname boundary only around props.children in routes/products.tsx. The stable outer key preserves header/tabs; the inner boundary produces child transitions.",
          },
        ],
        templateUrl:
          "https://github.com/meursyphus/ssgoi/tree/HEAD/templates/solidstart",
        llmsUrl: "https://ssgoi.dev/llms/frameworks/solidstart.txt",
      },
    ],
  },
  {
    slug: "qwik",
    name: "Qwik",
    pkg: "@ssgoi/qwik",
    lead: "Qwik keeps ownership of projected content and serializes state. Supply transition functions through a QRL factory and attach SSGOI to the layout that owns the routed slot.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/qwik.txt",
    sections: [
      {
        heading: "Setup",
        body: "Don't wrap the route <Slot /> in another component — forwarding it can keep routed content out of the live DOM during navigation.",
        code: `// src/lib/ssgoi-config.ts
import { $ } from "@builder.io/qwik";
import { drill } from "@ssgoi/qwik/view-transitions";

export const config$ = $(() => ({
  transitions: [{ on: "/posts/**", except: "/posts", transition: drill() }],
}));

// src/routes/layout.tsx
import { Slot, component$, useSignal } from "@builder.io/qwik";
import { useSsgoi } from "@ssgoi/qwik";
import { config$ } from "../lib/ssgoi-config";

export default component$(() => {
  const root = useSignal<HTMLElement>();
  useSsgoi(root, { config$ });

  return (
    <main ref={root} class="relative z-0 min-h-dvh overflow-x-clip">
      <Slot />
    </main>
  );
});

// src/routes/posts/index.tsx — each routed page marks its own root
import { component$ } from "@builder.io/qwik";

export default component$(() => (
  <article data-ssgoi-transition="/posts">{/* page */}</article>
));`,
      },
    ],
    routers: [
      {
        slug: "qwik-city",
        name: "Qwik City",
        lead: "The computed boundary helper reads Qwik City’s location. The page keeps ownership of its DOM and slots; apply the returned id and key to its own root.",
        experimental: true,
        sections: [
          {
            heading: "Mark the page root",
            body: "Call the hook in a Qwik City page or layout, not root.tsx. An explicit key replaces the page root when a parameterized route is reused. Query and hash changes keep the same key.",
            code: `import { component$ } from "@builder.io/qwik";
import { useSsgoiRouteBoundary } from "@ssgoi/qwik/qwik-city";

export default component$(() => {
  const boundary = useSsgoiRouteBoundary();
  return (
    <article key={boundary.value.key} data-ssgoi-transition={boundary.value.id}>
      {/* Page content */}
    </article>
  );
});`,
          },
          {
            heading: "Persistent layouts",
            body: 'Pass a stable route key to useSsgoiRouteBoundary("shell") for an outer shell, and retain separately keyed page roots below it. The helper does not wrap or move Slot content.',
          },
        ],
        templateUrl:
          "https://github.com/meursyphus/ssgoi/tree/HEAD/templates/qwik",
        llmsUrl: "https://ssgoi.dev/llms/frameworks/qwik.txt",
      },
    ],
  },
  {
    slug: "angular",
    name: "Angular",
    pkg: "@ssgoi/angular",
    lead: "Use the common ssgoi directive above the changing page region. The optional Angular Router directive supplies each page’s boundary.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/angular.txt",
    sections: [
      {
        heading: "Setup",
        language: "ts",
        code: `import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/angular";
import { drill } from "@ssgoi/angular/view-transitions";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, Ssgoi],
  template: \`
    <main
      ssgoi
      [config]="config()"
      style="position:relative;z-index:0;min-height:100dvh;overflow-x:clip"
    >
      <router-outlet />
    </main>
  \`,
})
export class AppComponent {
  protected readonly config = signal<SsgoiConfig>({
    transitions: [
      { on: "/posts/**", except: "/posts", transition: drill() },
    ],
  });
}`,
      },
    ],
    routers: [
      {
        slug: "angular-router",
        name: "Angular Router",
        lead: "A structural directive marks a page’s real DOM root and recreates its embedded view when its route key changes. The application keeps its RouterOutlet.",
        experimental: true,
        sections: [
          {
            heading: "Connect a routed page",
            body: "Import the standalone directive in the routed component. The template must have exactly one DOM root. This also handles parameter changes that reuse the same route component.",
            code: `import { Component } from "@angular/core";
import { SsgoiRouteBoundary } from "@ssgoi/angular/router";

@Component({
  standalone: true,
  imports: [SsgoiRouteBoundary],
  template: \`
    <article *ssgoiRouteBoundary="let boundary">
      {{ boundary.id }}
    </article>
  \`,
})
export class PageComponent {}`,
            language: "ts",
          },
          {
            heading: "Persistent shells",
            body: "Use *ssgoiRouteBoundary=\"let boundary; key: 'shell'\" to preserve the embedded view. A resolver can return { id, key? }. Query-only and cancelled navigation preserve the default view. This helper does not coordinate custom RouteReuseStrategy caches, detached outlets, or auxiliary outlet transitions.",
          },
        ],
        llmsUrl: "https://ssgoi.dev/llms/frameworks/angular.txt",
      },
    ],
  },
  {
    slug: "react-native",
    name: "React Native",
    pkg: "@ssgoi/react-native",
    lead: "Native rendering and UI-thread playback use the same matching and physics concepts, with native fade/slide presets. This native integration remains experimental.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/react-native.txt",
    sections: [
      {
        heading: "Common setup",
        body: "Use @ssgoi/react-native for the provider and native presets. Web transition presets and DOM attributes do not apply to native views.",
        code: `import { Ssgoi, type SsgoiConfig } from "@ssgoi/react-native";
import { slide } from "@ssgoi/react-native/view-transitions";`,
        language: "ts",
      },
    ],
    routers: [
      {
        slug: "expo-router",
        name: "Expo Router",
        lead: "The file-based boundary discovers screens and retains outgoing native views until playback completes. It replaces the Stack in that layout.",
        experimental: true,
        sections: [
          {
            heading: "Run the source example",
            body: "The template pins Expo 56.0.21, Expo Router 56.2.20, React Native 0.85.3, React 19.2.3, Reanimated 4.3.1 and Worklets 0.8.3. The Expo standard navigator API is alpha. Use a matching Expo Go build or development build.",
            language: "bash",
            code: `pnpm install
pnpm --filter @ssgoi/core build
pnpm --filter @ssgoi/react-native build
pnpm --filter ssgoi-expo-template start`,
          },
          {
            heading: "Provider and file-based route boundary",
            body: "Create page files normally and keep using Expo Link and router.push/replace/back. The boundary supplies one native surface per screen and retains outgoing instances until animation completion. It replaces the layout navigator; do not wrap an existing Stack or Slot inside it. The app supplies safe areas and screen backgrounds.",
            code: `// app/_layout.tsx
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react-native";
import { SsgoiRouteBoundary } from "@ssgoi/react-native/expo-router";
import { slide } from "@ssgoi/react-native/view-transitions";

const config = {
  transitions: [{ from: "/posts", to: "/posts/*", transition: slide() }],
} satisfies SsgoiConfig;

export default function Layout() {
  return <Ssgoi config={config}><SsgoiRouteBoundary /></Ssgoi>;
}`,
          },
          {
            heading: "Configuration and scope",
            body: "Route rules and middleware share the web semantics. The native provider selects Reanimated playback automatically. resolve and routeKey use each screen's own route and keep pushed instances separate. Mounted screens preserve input and scroll state. Explicit scroll restoration is rejected. The preview targets one iOS/Android stack with fade/slide; headers, modal presentation, interactive gestures, shared elements, nested navigator coordination, and Expo Web are follow-up work.",
          },
          {
            heading: "Verify on devices",
            body: "The tests use real Expo Router with native mocks and a controlled frame clock. Type checks and Hermes exports validate integration and building, not pixels or UI-thread performance. Check list/detail/back, retained inputs and scroll, replace, system reduced motion, rotation and background recovery on iOS and Android before production use.",
          },
        ],
        templateUrl:
          "https://github.com/meursyphus/ssgoi/tree/HEAD/templates/expo",
        llmsUrl: "https://ssgoi.dev/llms/frameworks/expo.txt",
      },
    ],
    native: true,
  },
];

export const LEGACY_FRAMEWORK_PATHS: Record<string, string> = {
  nextjs: "/docs/frameworks/react#nextjs",
  remix: "/docs/frameworks/react#remix",
  "react-router": "/docs/frameworks/react#react-router",
  "tanstack-router": "/docs/frameworks/react#tanstack-router",
  sveltekit: "/docs/frameworks/svelte#sveltekit",
  nuxt: "/docs/frameworks/vue#nuxt",
  "vue-router": "/docs/frameworks/vue#vue-router",
  solidstart: "/docs/frameworks/solid#solidstart",
  "solid-router": "/docs/frameworks/solid#solid-router",
  expo: "/docs/frameworks/react-native#expo-router",
};

export function getFrameworkDoc(slug: string) {
  return FRAMEWORK_DOCS.find((doc) => doc.slug === slug);
}

export function getLegacyFrameworkPath(slug: string): string | undefined {
  return Object.hasOwn(LEGACY_FRAMEWORK_PATHS, slug)
    ? LEGACY_FRAMEWORK_PATHS[slug]
    : undefined;
}
