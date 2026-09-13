export type FrameworkSection = {
  heading: string;
  body?: string;
  code?: string;
  language?: string;
};

export type FrameworkDoc = {
  slug: string;
  name: string;
  pkg: string;
  lead: string;
  llmsUrl?: string;
  templateUrl?: string;
  experimental?: boolean;
  sections: FrameworkSection[];
};

const TEMPLATES = "https://github.com/meursyphus/ssgoi/tree/HEAD/templates";

export const FRAMEWORK_DOCS: FrameworkDoc[] = [
  {
    slug: "nextjs",
    name: "React / Next.js",
    pkg: "@ssgoi/nextjs",
    lead: "One provider file and one layout edit. Install @ssgoi/nextjs for the common React API and the ready-made Next.js boundary.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/nextjs.txt",
    templateUrl: `${TEMPLATES}/nextjs`,
    sections: [
      {
        heading: "1. Provider and config",
        body: "Start with one visible rule so the first verification is unambiguous. The config can grow without changing the provider.",
        code: `// app/ssgoi-provider.tsx
"use client";

import { type ReactNode } from "react";
import { Ssgoi } from "@ssgoi/nextjs";
import { drill } from "@ssgoi/nextjs/view-transitions";

const config = {
  transitions: [{ on: "/**", except: "/", transition: drill() }],
};

export function SsgoiProvider({ children }: { children: ReactNode }) {
  return <Ssgoi config={config}>{children}</Ssgoi>;
}`,
      },
      {
        heading: "2. Route boundary",
        body: "Import the boundary directly. It resolves pathname and key together and includes Suspense for unresolved URL data. Pass fallback for a prerender placeholder.",
        code: `import { SsgoiRouteBoundary } from "@ssgoi/nextjs";

<SsgoiRouteBoundary>{children}</SsgoiRouteBoundary>`,
      },
      {
        heading: "3. Root layout",
        body: "Place both pieces inside the layout shell. The wrapper supplies the containing block, stacking context, and horizontal clipping needed by the leaving page.",
        code: `// app/layout.tsx
import { type ReactNode } from "react";
import { SsgoiProvider } from "./ssgoi-provider";
import { SsgoiRouteBoundary } from "@ssgoi/nextjs";

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
import { SsgoiRouteBoundary } from "@ssgoi/nextjs";

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
  },
  {
    slug: "expo",
    name: "React Native / Expo (experimental)",
    pkg: "@ssgoi/expo-router",
    experimental: true,
    lead: "Experimental native fade/slide transitions and file-based Expo Router boundaries, published in lockstep with the web packages. Start with the workspace template for the supported dependency baseline and device checks.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/expo.txt",
    templateUrl: `${TEMPLATES}/expo`,
    sections: [
      {
        heading: "Run the source example",
        body: "The template pins Expo 56.0.21, Expo Router 56.2.20, React Native 0.85.3, React 19.2.3, Reanimated 4.3.1 and Worklets 0.8.3. The Expo standard navigator API is alpha. Use a matching Expo Go build or development build.",
        language: "bash",
        code: "pnpm install\npnpm --filter @ssgoi/expo-router... build\npnpm --filter ssgoi-expo-template start",
      },
      {
        heading: "Provider and file-based route boundary",
        body: "Create page files normally and keep using Expo Link and router.push/replace/back. The boundary supplies one native surface per screen and retains outgoing instances until animation completion. It replaces the layout navigator; do not wrap an existing Stack or Slot inside it. The app supplies safe areas and screen backgrounds.",
        code: `// app/_layout.tsx
import { Ssgoi, type SsgoiConfig } from "@ssgoi/expo-router";
import { SsgoiRouteBoundary } from "@ssgoi/expo-router";
import { slide } from "@ssgoi/expo-router/view-transitions";

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
  },
  {
    slug: "react-router",
    name: "React Router",
    pkg: "@ssgoi/react-router",
    lead: "Install @ssgoi/react-router for the common React API and a boundary that follows React Router 6 or 7.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/react-router.txt",
    templateUrl: `${TEMPLATES}/react-router`,
    sections: [
      {
        heading: "1. Provider and config",
        body: "One <Ssgoi> and the shell classes in the root; the boundary keys on the pathname and wraps every page via a pathless layout route.",
        code: `// app/root.tsx — the App component
import { Outlet } from "react-router";
import { Ssgoi } from "@ssgoi/react-router";
import { drill } from "@ssgoi/react-router/view-transitions";

const config = {
  transitions: [{ on: "/**", except: "/", transition: drill() }],
};

export default function App() {
  return (
    <main className="relative z-0 min-h-dvh overflow-x-clip">
      <Ssgoi config={config}><Outlet /></Ssgoi>
    </main>
  );
}`,
      },
      {
        heading: "2. Route boundary",
        code: `// app/routes/page-boundary.layout.tsx
import { Outlet } from "react-router";
import { SsgoiRouteBoundary } from "@ssgoi/react-router";

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
  },
  {
    slug: "tanstack-router",
    name: "TanStack Router",
    pkg: "@ssgoi/tanstack-router",
    lead: "Install @ssgoi/tanstack-router for the common React API and a boundary around the root outlet.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/tanstack-router.txt",
    templateUrl: `${TEMPLATES}/tanstack-router`,
    sections: [
      {
        heading: "Setup",
        code: `// app/routes/__root.tsx
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Ssgoi } from "@ssgoi/tanstack-router";
import { SsgoiRouteBoundary } from "@ssgoi/tanstack-router";
import { drill } from "@ssgoi/tanstack-router/view-transitions";

const config = {
  transitions: [{ on: "/**", except: "/", transition: drill() }],
};

export const Route = createRootRoute({
  component: () => (
    <main className="relative z-0 min-h-dvh overflow-x-clip">
      <Ssgoi config={config}>
        <SsgoiRouteBoundary>
          <Outlet />
        </SsgoiRouteBoundary>
      </Ssgoi>
    </main>
  ),
});`,
      },
      {
        heading: "Beyond the basics",
        body: "For a persistent section, keep the root as one <Ssgoi><Outlet /></Ssgoi>, then let the section route own a stable outer shell boundary and a pathname-keyed inner boundary around <Outlet />. Holding only the outer boundary constant preserves state but produces no child transition.",
      },
    ],
  },
  {
    slug: "sveltekit",
    name: "SvelteKit",
    pkg: "@ssgoi/svelte",
    lead: "SvelteKit keeps the root layout wrapper while its live children snippet updates, so that wrapper does not provide an OUT boundary. The shipped @ssgoi/svelte/sveltekit boundary detaches the old routed region first.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/sveltekit.txt",
    templateUrl: `${TEMPLATES}/sveltekit`,
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
  },
  {
    slug: "nuxt",
    name: "Vue / Nuxt",
    pkg: "@ssgoi/vue",
    lead: "A changed :key remounts the routed subtree. Nuxt can wrap <NuxtPage />; plain Vue Router uses the same boundary around the component from <RouterView>.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/nuxt.txt",
    templateUrl: `${TEMPLATES}/nuxt`,
    sections: [
      {
        heading: "Setup",
        language: "xml",
        code: `<!-- app.vue -->
<script setup lang="ts">
import { Ssgoi } from "@ssgoi/vue";
import { SsgoiRouteBoundary } from "@ssgoi/vue/nuxt";
import { config } from "~/utils/ssgoi-config";
</script>

<template>
  <main class="relative z-0 min-h-dvh overflow-x-clip">
    <Ssgoi :config="config">
      <SsgoiRouteBoundary>
        <NuxtPage />
      </SsgoiRouteBoundary>
    </Ssgoi>
  </main>
</template>`,
      },
      {
        heading: "Plain Vue Router",
        body: "Import the Vue Router entry and wrap the current RouterView component.",
        language: "xml",
        code: `<!-- App.vue -->
<script setup lang="ts">
import { RouterView } from "vue-router";
import { Ssgoi } from "@ssgoi/vue";
import { SsgoiRouteBoundary } from "@ssgoi/vue/vue-router";
import { config } from "./ssgoi-config";

</script>

<template>
  <main class="relative z-0 min-h-dvh overflow-x-clip">
    <Ssgoi :config="config">
      <RouterView v-slot="{ Component }">
        <SsgoiRouteBoundary>
          <component :is="Component" />
        </SsgoiRouteBoundary>
      </RouterView>
    </Ssgoi>
  </main>
</template>`,
      },
      {
        heading: "Beyond the basics",
        body: "For a persistent /products shell, return the full pathname as id and /products as key from the root boundary's resolve, then put a second default pathname boundary only around the nested <NuxtPage />. The stable outer key preserves header/tabs; the inner boundary produces child transitions.",
      },
    ],
  },
  {
    slug: "solidstart",
    name: "SolidStart",
    pkg: "@ssgoi/solid",
    lead: "Import @ssgoi/solid/solidstart at the router root. Its boundary reads the router location and owns the keyed DOM lifetime.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/solidstart.txt",
    templateUrl: `${TEMPLATES}/solidstart`,
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
  },
  {
    slug: "qwik",
    name: "Qwik City",
    pkg: "@ssgoi/qwik",
    lead: "Qwik serializes component state and configs contain functions — so the config is a QRL factory, and SSGOI attaches to the element that owns <Slot />.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/qwik.txt",
    templateUrl: `${TEMPLATES}/qwik`,
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
      {
        heading: "Beyond the basics",
        body: "Persistent layout: a route layout owns an outer marker around its <Slot />; child pages keep theirs. Never add a second SSGOI root.",
      },
    ],
  },
  {
    slug: "angular",
    name: "Angular",
    pkg: "@ssgoi/angular",
    lead: "One ssgoi directive above the router outlet, and a marker on each routed component root.",
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
      {
        heading: "Route markers",
        body: "Mark each routed component root with data-ssgoi-transition — the id must match your config's route patterns. Angular may reuse one component instance when only route params change; attribute changes alone do not create OUT/IN, so param-to-param transitions need a keyed or conditional DOM boundary that forces a remount.",
        language: "xml",
        code: `<article data-ssgoi-transition="/posts/42">
  <!-- page -->
</article>`,
      },
    ],
  },
];

export function getFrameworkDoc(slug: string): FrameworkDoc | undefined {
  return FRAMEWORK_DOCS.find((f) => f.slug === slug);
}
