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
    lead: "Use SSGOI with React independently of your router. Tell the provider how to read your router’s route through framework, and SsgoiLayoutBoundary connects it to a page lifetime.",
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
        heading: "Transition state",
        body: "A page that scrolls itself on arrival, such as an anchor jump or scrollIntoView, fights the animation. Read the provider's transition state and act once it is idle. The status is idle or transitioning; while transitioning it also carries from, to and direction. It flips as soon as the navigation is paired, one microtask after the DOM changed, and returns to idle when the run releases, the same span the scroll-input lock covers.",
        code: `import { useEffect } from "react";
import { useSsgoiTransition } from "@ssgoi/react";

export function Comments({ anchor }: { anchor: string }) {
  const { status } = useSsgoiTransition();
  useEffect(() => {
    if (status !== "idle") return;
    document.getElementById(anchor)?.scrollIntoView();
  }, [status, anchor]);
  return null;
}`,
      },
      {
        heading: "Connect a router",
        body: "Pass framework to <Ssgoi>, then wrap routed children in SsgoiLayoutBoundary from @ssgoi/react. framework.useRoute is a hook you write with your router’s own hooks: it returns the current route ({ pathname, ...anything }) or null while the router is not ready, which renders fallback. The function form of the boundary prop receives that route object as-is. Keep the object at module scope so it stays stable. SsgoiLayoutBoundary throws if the nearest <Ssgoi> has no framework.",
        code: `import { Ssgoi, SsgoiLayoutBoundary, type SsgoiFramework } from "@ssgoi/react";

const framework: SsgoiFramework = {
  useRoute: () => ({ pathname: useYourRouterPathname() }),
};

<Ssgoi config={config} framework={framework}>
  <SsgoiLayoutBoundary>{children}</SsgoiLayoutBoundary>
</Ssgoi>`,
      },
      {
        heading: "Using another router",
        body: "Any router works without a dedicated integration: return its committed pathname from useRoute, read in the same render as its children. You can also skip framework and render a keyed DOM boundary yourself. The Route boundaries guide explains the general pattern.",
      },
    ],
    routers: [
      {
        slug: "nextjs",
        name: "Next.js",
        lead: "Read the App Router’s pathname and selected segments in framework.useRoute. SsgoiLayoutBoundary keys by the committed pathname, handles URL-hook suspension, and marks the routed region.",
        experimental: false,
        sections: [
          {
            heading: "Connect the App Router",
            body: 'Place the common provider and config in app/ssgoi-provider.tsx, add "use client", and build framework.useRoute from usePathname and useSelectedLayoutSegments in next/navigation. The provider is a client component, so passing a function is fine. A null pathname (mixed app/pages projects) returns null, so no guessed route is registered.',
            code: `// app/ssgoi-provider.tsx
"use client";

import type { ReactNode } from "react";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { Ssgoi, type SsgoiFramework } from "@ssgoi/react";
import { drill } from "@ssgoi/react/view-transitions";

const config = {
  transitions: [{ on: "/**", except: "/", transition: drill() }],
};

const framework: SsgoiFramework = {
  useRoute: ({ parallelRoutesKey = "children" }) => {
    const pathname = usePathname();
    const selectedSegments = useSelectedLayoutSegments(parallelRoutesKey) ?? [];
    return pathname == null ? null : { pathname, selectedSegments };
  },
};

export function SsgoiProvider({ children }: { children: ReactNode }) {
  return (
    <Ssgoi config={config} framework={framework}>
      {children}
    </Ssgoi>
  );
}`,
          },
          {
            heading: "Root layout",
            body: "Place both pieces inside the layout shell; no local router wrapper is needed. The wrapper supplies the containing block, stacking context, and horizontal clipping needed by the leaving page.",
            code: `// app/layout.tsx
import { type ReactNode } from "react";
import { SsgoiLayoutBoundary } from "@ssgoi/react";
import { SsgoiProvider } from "./ssgoi-provider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="relative z-0 min-h-dvh overflow-x-clip">
          <SsgoiProvider>
            <SsgoiLayoutBoundary>{children}</SsgoiLayoutBoundary>
          </SsgoiProvider>
        </main>
      </body>
    </html>
  );
}`,
          },
          {
            heading: "Persistent layouts",
            body: 'A layout-owned fixed key, boundary="products-layout", preserves the header while the inner boundary replaces the changing content. Keep the provider above these section layouts, without a full-path boundary remounting every section from above.',
            code: `// app/products/layout.tsx
import type { ReactNode } from "react";
import { SsgoiLayoutBoundary } from "@ssgoi/react";

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return (
    <SsgoiLayoutBoundary boundary="products-layout">
      <header>Products</header>
      <SsgoiLayoutBoundary>{children}</SsgoiLayoutBoundary>
    </SsgoiLayoutBoundary>
  );
}`,
          },
          {
            heading: "Parallel slots and interception",
            body: "Pass a function as boundary for slot-specific ids and keys; it receives the { pathname, selectedSegments } that useRoute returned, as-is, and returns a key string or { id?, key? }. Annotate its parameter. parallelRoutesKey is passed to useRoute to read a named slot. Function props belong in a client component. Join selectedSegments under the layout’s base path, dropping route groups, to get the owned slot’s route; an empty slot is its index route, even when the browser URL points at a modal. Interception also needs the app’s route/slot files and compatible middleware or proxy rules. Verify soft navigation, back, and direct entry; the boundary includes URL-hook Suspense and accepts a fallback for Cache Components.",
          },
        ],
        templateUrl:
          "https://github.com/meursyphus/ssgoi/tree/HEAD/templates/nextjs",
        llmsUrl: "https://ssgoi.dev/llms/frameworks/nextjs.txt",
      },
      {
        slug: "remix",
        name: "Remix",
        lead: "Return Remix 2’s location from framework.useRoute. It reads Remix’s own router context, so it does not depend on a separately installed React Router version.",
        experimental: true,
        sections: [
          {
            heading: "Pass the framework",
            body: "In root.tsx, give the common provider a useRoute that returns Remix’s location. Keep the object at module scope so it stays stable. SsgoiLayoutBoundary throws if <Ssgoi> has no framework.",
            code: `import { Outlet, useLocation } from "@remix-run/react";
import { Ssgoi, type SsgoiFramework } from "@ssgoi/react";
import { config } from "./ssgoi-config";

const framework: SsgoiFramework = { useRoute: () => useLocation() };

export default function App() {
  return (
    <Ssgoi config={config} framework={framework}>
      <Outlet />
    </Ssgoi>
  );
}`,
          },
          {
            heading: "Wrap a layout outlet",
            body: "Place the boundary in a route layout. Follow Remix 2’s own React 18 dependency requirements. React Router 7 framework mode returns React Router’s location instead.",
            code: `import { Outlet } from "@remix-run/react";
import { SsgoiLayoutBoundary } from "@ssgoi/react";

export default function Layout() {
  return <SsgoiLayoutBoundary><Outlet /></SsgoiLayoutBoundary>;
}`,
          },
          {
            heading: "Persistent route families",
            body: 'Use a fixed key such as boundary="shell" for a persistent shell and a separate inner boundary for changing content. The function form of boundary receives Remix’s location as useRoute returned it and returns a key string or { id?, key? }; keys are computed during render.',
          },
        ],
        llmsUrl: "https://ssgoi.dev/llms/frameworks/remix.txt",
      },
      {
        slug: "react-router",
        name: "React Router",
        lead: "Return React Router 6 or 7’s location from framework.useRoute. The boundary follows the committed location; query-only navigation preserves it.",
        experimental: true,
        sections: [
          {
            heading: "Pass the framework",
            body: "In app/root.tsx, give the common provider a useRoute that returns React Router’s location. The function form of boundary receives that location as-is.",
            code: `import { Outlet, useLocation } from "react-router";
import { Ssgoi, type SsgoiFramework } from "@ssgoi/react";

const framework: SsgoiFramework = { useRoute: () => useLocation() };

export default function App() {
  return (
    <Ssgoi config={config} framework={framework}>
      <Outlet />
    </Ssgoi>
  );
}`,
          },
          {
            heading: "Wrap the outlet",
            body: "Put this pathless layout inside the common provider. Register the layout around the pages that should transition.",
            code: `import { Outlet } from "react-router";
import { SsgoiLayoutBoundary } from "@ssgoi/react";

export default function PageBoundaryLayout() {
  return <SsgoiLayoutBoundary><Outlet /></SsgoiLayoutBoundary>;
}`,
          },
          {
            heading: "Route registration",
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
        lead: "Return TanStack Router 1’s rendered pathname from framework.useRoute, including React applications built with TanStack Start. Both use the same router context.",
        experimental: true,
        sections: [
          {
            heading: "Wrap the root outlet",
            body: "useRoute reads the leaf match the outlet is rendering rather than location, which TanStack moves before pending matches render. For persistent sections, put boundaries in the owning route layouts instead.",
            code: `import { Outlet, useRouterState } from "@tanstack/react-router";
import {
  Ssgoi,
  SsgoiLayoutBoundary,
  type SsgoiFramework,
} from "@ssgoi/react";

// Key by the leaf match the outlet renders, not location: location moves
// before pending matches render, and index routes match "/parent/".
const framework: SsgoiFramework = {
  useRoute: () => ({
    pathname: useRouterState({
      select: (state) => {
        const location = state.location.pathname;
        const leaf = state.matches.at(-1)?.pathname;
        if (!leaf) return location;
        return leaf.length > 1 && leaf.endsWith("/") && !location.endsWith("/")
          ? leaf.slice(0, -1)
          : leaf;
      },
    }),
  }),
};

<Ssgoi config={config} framework={framework}>
  <SsgoiLayoutBoundary><Outlet /></SsgoiLayoutBoundary>
</Ssgoi>`,
          },
          {
            heading: "Beyond the basics",
            body: "For a persistent section, keep the root as one <Ssgoi framework={framework}><Outlet /></Ssgoi>, then let the section route own a stable outer shell boundary and a pathname-keyed inner boundary around <Outlet />. Holding only the outer boundary constant preserves state but produces no child transition.",
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
    lead: "The Svelte package provides the common provider, transition API, and layout boundary. Pass a SvelteKit route getter and onNavigate as framework when Kit owns navigation.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/svelte.txt",
    sections: [
      {
        heading: "Common setup",
        body: "Install @ssgoi/svelte and keep one Ssgoi provider above the changing page region. Transition factories and route rules are shared with the other web packages.",
        code: `import { Ssgoi } from "@ssgoi/svelte";
import { drill } from "@ssgoi/svelte/view-transitions";`,
        language: "ts",
      },
      {
        heading: "Transition state",
        body: "A page that scrolls itself on arrival, such as an anchor jump or scrollIntoView, fights the animation. Read the provider's transition state and act once it is idle. The status is idle or transitioning; while transitioning it also carries from, to and direction. It flips as soon as the navigation is paired, one microtask after the DOM changed, and returns to idle when the run releases, the same span the scroll-input lock covers. getSsgoiTransition returns a readable store; call it during component initialisation.",
        language: "svelte",
        code: `<script lang="ts">
  import { getSsgoiTransition } from "@ssgoi/svelte";

  const transition = getSsgoiTransition();

  $effect(() => {
    if ($transition.status !== "idle") return;
    document.getElementById("comments")?.scrollIntoView();
  });
</script>`,
      },
    ],
    routers: [
      {
        slug: "sveltekit",
        name: "SvelteKit",
        lead: "Pass a getRoute that returns { pathname, url } from page.url, plus onNavigate, as framework. The function form of boundary receives that route as-is. The boundary uses onNavigate to detach outgoing content before SvelteKit updates its live children snippet; a key around that snippet alone is not sufficient.",
        experimental: true,
        sections: [
          {
            heading: "Setup",
            language: "xml",
            code: `<!-- src/routes/+layout.svelte -->
<script>
  import { page } from "$app/state";
  import { onNavigate } from "$app/navigation";
  import { Ssgoi, SsgoiLayoutBoundary } from "@ssgoi/svelte";
  import { config } from "$lib/ssgoi-config";

  let { children } = $props();

  const framework = {
    getRoute: () => ({ pathname: page.url.pathname, url: page.url }),
    onNavigate,
  };
</script>

<main class="relative z-0 min-h-dvh overflow-x-clip">
  <Ssgoi {config} {framework}>
    <SsgoiLayoutBoundary class="min-h-full">
      {@render children()}
    </SsgoiLayoutBoundary>
  </Ssgoi>
</main>`,
          },
          {
            heading: "SvelteKit before 2.12",
            body: "Without $app/state, read the page store instead. SsgoiLayoutBoundary throws if <Ssgoi> has no framework.",
            language: "ts",
            code: `import { get } from "svelte/store";
import { page } from "$app/stores";
import { onNavigate } from "$app/navigation";

const framework = {
  getRoute: () => ({ pathname: get(page).url.pathname, url: get(page).url }),
  onNavigate,
};`,
          },
          {
            heading: "Why a boundary component",
            body: "The root layout wrapper stays mounted while the live children snippet updates, so a marker on that wrapper has no OUT node. The component detaches the old routed region first — the lifecycle is included in @ssgoi/svelte; no copied component is needed.",
            language: "text",
            code: `plain {@render children()} : route change mutates DOM in place → no OUT node

boundary component         : onNavigate → unmount old route   (OUT captured)
                             → SvelteKit updates the route
                             → remount under the new id       (IN animates)`,
          },
          {
            heading: "Beyond the basics",
            body: 'For a persistent /products shell, return "/products" from the root boundary’s function form (a returned string is the key; the id keeps the full pathname), then put a second default pathname boundary only around the child content in routes/products/+layout.svelte. The stable outer key preserves header/tabs; the inner boundary produces tab transitions.',
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
    lead: "Use the Vue package for the provider, effects, and layout boundary. Pass a reactive getRoute for the router already installed in your app as framework.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/vue.txt",
    sections: [
      {
        heading: "Common setup",
        body: "Install @ssgoi/vue and keep one Ssgoi provider above RouterView or NuxtPage. It receives the shared route configuration.",
        code: `import { Ssgoi } from "@ssgoi/vue";
import { drill } from "@ssgoi/vue/view-transitions";`,
        language: "ts",
      },
      {
        heading: "Transition state",
        body: "A page that scrolls itself on arrival, such as an anchor jump or scrollIntoView, fights the animation. Read the provider's transition state and act once it is idle. The status is idle or transitioning; while transitioning it also carries from, to and direction. It flips as soon as the navigation is paired, one microtask after the DOM changed, and returns to idle when the run releases, the same span the scroll-input lock covers. useSsgoiTransition returns a readonly ref; call it in setup.",
        language: "vue",
        code: `<script setup lang="ts">
import { watch } from "vue";
import { useSsgoiTransition } from "@ssgoi/vue";

const transition = useSsgoiTransition();

watch(
  () => transition.value.status,
  (status) => {
    if (status !== "idle") return;
    document.getElementById("comments")?.scrollIntoView();
  },
  { immediate: true },
);
</script>`,
      },
    ],
    routers: [
      {
        slug: "vue-router",
        name: "Vue Router",
        lead: "Return Vue Router 4’s current path from framework.getRoute on the common Vue provider.",
        experimental: true,
        sections: [
          {
            heading: "Wrap the routed region",
            body: "The boundary follows the committed router path and replaces its DOM root when the route key changes. SsgoiLayoutBoundary throws if <Ssgoi> has no framework.",
            code: `<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import { Ssgoi, SsgoiLayoutBoundary } from "@ssgoi/vue";
import { config } from "./ssgoi-config";

const router = useRouter();
const framework = {
  getRoute: () => ({ pathname: router.currentRoute.value.path }),
};
</script>

<template>
  <Ssgoi :config="config" :framework="framework">
    <SsgoiLayoutBoundary><RouterView /></SsgoiLayoutBoundary>
  </Ssgoi>
</template>`,
            language: "vue",
          },
          {
            heading: "Persistent shells",
            body: 'Use a fixed key such as boundary="shell" for the outer shell and a changing inner boundary for the page. The function form of boundary receives the route getRoute returned, here { pathname }, as-is and returns a key string or { id?, key? }.',
          },
        ],
        llmsUrl: "https://ssgoi.dev/llms/frameworks/vue-router.txt",
      },
      {
        slug: "nuxt",
        name: "Nuxt",
        lead: "Return Nuxt’s router state from framework.getRoute on the common Vue provider. Read router.currentRoute, the committed state, rather than Nuxt’s delayed useRoute value.",
        experimental: true,
        sections: [
          {
            heading: "Wrap NuxtPage",
            body: "Keep the provider in app.vue, above the layout and page. Do not add a provider for every page. useRouter is Nuxt’s auto-import.",
            code: `<script setup lang="ts">
import { Ssgoi, SsgoiLayoutBoundary } from "@ssgoi/vue";
import { config } from "~/utils/ssgoi-config";

const router = useRouter();
const framework = {
  getRoute: () => ({ pathname: router.currentRoute.value.path }),
};
</script>

<template>
  <Ssgoi :config="config" :framework="framework">
    <SsgoiLayoutBoundary><NuxtPage /></SsgoiLayoutBoundary>
  </Ssgoi>
</template>`,
            language: "vue",
          },
          {
            heading: "Beyond the basics",
            body: 'For a persistent /products shell, return "/products" from the root boundary’s function form (a returned string is the key; the id keeps the full pathname), then put a second default pathname boundary only around the nested <NuxtPage />. The stable outer key preserves header/tabs; the inner boundary produces child transitions.',
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
    lead: "Use the Solid package for common rendering, effects, and the layout boundary. Solid Router and SolidStart pass the same getRoute as framework.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/solid.txt",
    sections: [
      {
        heading: "Common setup",
        body: "Install @ssgoi/solid and keep one Ssgoi provider above the routed children. The provider is independent of Solid Router.",
        code: `import { Ssgoi } from "@ssgoi/solid";
import { drill } from "@ssgoi/solid/view-transitions";`,
        language: "ts",
      },
      {
        heading: "Transition state",
        body: "A page that scrolls itself on arrival, such as an anchor jump or scrollIntoView, fights the animation. Read the provider's transition state and act once it is idle. The status is idle or transitioning; while transitioning it also carries from, to and direction. It flips as soon as the navigation is paired, one microtask after the DOM changed, and returns to idle when the run releases, the same span the scroll-input lock covers. useSsgoiTransition returns a signal accessor.",
        code: `import { createEffect } from "solid-js";
import { useSsgoiTransition } from "@ssgoi/solid";

export function Comments() {
  const transition = useSsgoiTransition();
  createEffect(() => {
    if (transition().status !== "idle") return;
    document.getElementById("comments")?.scrollIntoView();
  });
  return null;
}`,
      },
    ],
    routers: [
      {
        slug: "solid-router",
        name: "Solid Router",
        lead: "Return Solid Router’s location pathname from framework.getRoute on the common provider. SolidStart uses this same setup.",
        experimental: true,
        sections: [
          {
            heading: "Wrap the routed children",
            body: "Render the provider inside <Router> so useLocation works. The keyed boundary recreates the changing region while a fixed boundary key can preserve an outer shell. SsgoiLayoutBoundary throws if <Ssgoi> has no framework.",
            code: `import { Router, useLocation, type RouteSectionProps } from "@solidjs/router";
import { Ssgoi, SsgoiLayoutBoundary } from "@ssgoi/solid";
import { config } from "./ssgoi-config";

function Root(props: RouteSectionProps) {
  const location = useLocation();
  return (
    <Ssgoi config={config} framework={{ getRoute: () => ({ pathname: location.pathname }) }}>
      <SsgoiLayoutBoundary>{props.children}</SsgoiLayoutBoundary>
    </Ssgoi>
  );
}

<Router root={Root}>{/* routes */}</Router>`,
          },
          {
            heading: "Route lifetime",
            body: "The default key follows the pathname. The function form of boundary receives the route getRoute returned, as-is, and can return separate id and key values; use a stable shell key only around content that should remain mounted.",
          },
        ],
        llmsUrl: "https://ssgoi.dev/llms/frameworks/solid-router.txt",
      },
      {
        slug: "solidstart",
        name: "SolidStart",
        lead: "Return Solid Router’s location pathname from framework.getRoute in the SolidStart router root.",
        experimental: true,
        sections: [
          {
            heading: "Setup",
            code: `// src/app.tsx
import { Router, useLocation, type RouteSectionProps } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { Ssgoi, SsgoiLayoutBoundary } from "@ssgoi/solid";
import { drill } from "@ssgoi/solid/view-transitions";

const config = {
  transitions: [{ on: "/**", except: "/", transition: drill() }],
};

function Root(props: RouteSectionProps) {
  const location = useLocation();
  return (
    <main class="relative z-0 min-h-dvh overflow-x-clip">
      <Ssgoi config={config} framework={{ getRoute: () => ({ pathname: location.pathname }) }}>
        <Suspense>
          <SsgoiLayoutBoundary>{props.children}</SsgoiLayoutBoundary>
        </Suspense>
      </Ssgoi>
    </main>
  );
}

export default function App() {
  return (
    <Router root={Root}>
      <FileRoutes />
    </Router>
  );
}`,
          },
          {
            heading: "Beyond the basics",
            body: 'For a persistent /products shell, return "/products" from the root boundary’s function form (a returned string is the key; the id keeps the full pathname), then put a second default pathname boundary only around props.children in routes/products.tsx. The stable outer key preserves header/tabs; the inner boundary produces child transitions.',
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
import { useLocation } from "@builder.io/qwik-city";
import { useSsgoi } from "@ssgoi/qwik";
import { config$ } from "../lib/ssgoi-config";

export default component$(() => {
  const root = useSignal<HTMLElement>();
  useSsgoi(root, { config$, framework: { location: useLocation() } });

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
        heading: "Transition state",
        body: "A page that scrolls itself on arrival, such as an anchor jump or scrollIntoView, fights the animation. Read the provider's transition state and act once it is idle. The status is idle or transitioning; while transitioning it also carries from, to and direction. It flips as soon as the navigation is paired, one microtask after the DOM changed, and returns to idle when the run releases, the same span the scroll-input lock covers. useSsgoiTransition returns a serialisable store provided by useSsgoi, so call it in a component below the layout that attached SSGOI.",
        code: `import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { useSsgoiTransition } from "@ssgoi/qwik";

export const Comments = component$(() => {
  const transition = useSsgoiTransition();
  useVisibleTask$(({ track }) => {
    if (track(() => transition.status) !== "idle") return;
    document.getElementById("comments")?.scrollIntoView();
  });
  return null;
});`,
      },
    ],
    routers: [
      {
        slug: "qwik-city",
        name: "Qwik City",
        lead: "Pass Qwik City’s location store as framework where SSGOI is attached. The computed boundary hook reads it; the page keeps ownership of its DOM and slots and applies the returned id and key to its own root.",
        experimental: true,
        sections: [
          {
            heading: "Mark the page root",
            body: "Call the hook in a Qwik City page or layout below the layout that attached SSGOI, not root.tsx. An explicit key replaces the page root when a parameterized route is reused. Query and hash changes keep the same key. useSsgoiLayoutBoundary throws if SSGOI was attached without framework.",
            code: `import { component$ } from "@builder.io/qwik";
import { useSsgoiLayoutBoundary } from "@ssgoi/qwik";

export default component$(() => {
  const boundary = useSsgoiLayoutBoundary();
  return (
    <article key={boundary.value.key} data-ssgoi-transition={boundary.value.id}>
      {/* Page content */}
    </article>
  );
});`,
          },
          {
            heading: "Persistent layouts",
            body: 'Pass a fixed key, useSsgoiLayoutBoundary("shell"), for an outer shell, or { id?, key? } to fix the id too, and retain separately keyed page roots below it. The hook does not wrap or move Slot content.',
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
    lead: "Use the common ssgoi directive above the changing page region and give it an ssgoiFramework that reads Angular Router. The layout boundary directive supplies each page’s boundary.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/angular.txt",
    sections: [
      {
        heading: "Setup",
        language: "ts",
        code: `import { Component, signal } from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
  createUrlTreeFromSnapshot,
} from "@angular/router";
import { Ssgoi, type SsgoiConfig, type SsgoiFramework } from "@ssgoi/angular";
import { drill } from "@ssgoi/angular/view-transitions";

// Called with each boundary's own Injector, so ActivatedRoute resolves at its position.
const framework: SsgoiFramework = {
  getRoute: (injector) => {
    const route = injector.get(ActivatedRoute).snapshot;
    const router = injector.get(Router);
    return {
      pathname: router.serializeUrl(createUrlTreeFromSnapshot(route, [], null, null)),
      route,
    };
  },
  onNavigate: (injector, callback) => {
    const subscription = injector.get(Router).events.subscribe((event) => {
      if (event instanceof NavigationEnd) callback();
    });
    return () => subscription.unsubscribe();
  },
};

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, Ssgoi],
  template: \`
    <main
      ssgoi
      [config]="config()"
      [ssgoiFramework]="framework"
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
  protected readonly framework = framework;
}`,
      },
      {
        heading: "Transition state",
        body: "A page that scrolls itself on arrival, such as an anchor jump or scrollIntoView, fights the animation. Read the provider's transition state and act once it is idle. The status is idle or transitioning; while transitioning it also carries from, to and direction. It flips as soon as the navigation is paired, one microtask after the DOM changed, and returns to idle when the run releases, the same span the scroll-input lock covers. injectSsgoiTransition returns a readonly signal and stays idle during SSR.",
        language: "ts",
        code: `import { Component, effect } from "@angular/core";
import { injectSsgoiTransition } from "@ssgoi/angular";

@Component({ selector: "app-comments", standalone: true, template: "" })
export class CommentsComponent {
  private readonly transition = injectSsgoiTransition();

  constructor() {
    effect(() => {
      if (this.transition().status !== "idle") return;
      document.getElementById("comments")?.scrollIntoView();
    });
  }
}`,
      },
    ],
    routers: [
      {
        slug: "angular-router",
        name: "Angular Router",
        lead: "Bind a framework with getRoute(injector) and onNavigate(injector, callback) to [ssgoiFramework] on the ssgoi element; the Setup above has the complete object. A structural directive then marks a page’s real DOM root and recreates its embedded view when its route key changes. The application keeps its RouterOutlet.",
        experimental: true,
        sections: [
          {
            heading: "Connect a routed page",
            body: "Import the standalone directive from @ssgoi/angular in the routed component. The template must have exactly one DOM root. This also handles parameter changes that reuse the same route component. It throws if the ssgoi element has no ssgoiFramework.",
            code: `import { Component } from "@angular/core";
import { SsgoiLayoutBoundary } from "@ssgoi/angular";

@Component({
  standalone: true,
  imports: [SsgoiLayoutBoundary],
  template: \`
    <article *ssgoiLayoutBoundary="let boundary">
      {{ boundary.id }}
    </article>
  \`,
})
export class PageComponent {}`,
            language: "ts",
          },
          {
            heading: "Persistent shells",
            body: "Use *ssgoiLayoutBoundary=\"'shell'\" (a fixed key) to preserve the embedded view. The directive's input also takes { id?, key? } or a function that receives the route getRoute returned, here { pathname, route }, as-is and returns a key string or { id?, key? }. Query-only and cancelled navigation preserve the default view. This directive does not coordinate custom RouteReuseStrategy caches, detached outlets, or auxiliary outlet transitions.",
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
        lead: "Pass Expo Router’s StackRouter and unstable_integrateWithRouter as framework. The file-based boundary discovers screens and retains outgoing native views until playback completes. It replaces the Stack in that layout.",
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
            body: "Create page files normally and keep using Expo Link and router.push/replace/back. Keep framework at module scope so the navigator is built once; SsgoiLayoutBoundary throws if <Ssgoi> has no framework. The boundary supplies one native surface per screen and retains outgoing instances until animation completion. It replaces the layout navigator; do not wrap an existing Stack or Slot inside it. The app supplies safe areas and screen backgrounds.",
            code: `// app/_layout.tsx
import { StackRouter, unstable_integrateWithRouter } from "expo-router";
import {
  Ssgoi,
  SsgoiLayoutBoundary,
  type SsgoiConfig,
} from "@ssgoi/react-native";
import { slide } from "@ssgoi/react-native/view-transitions";

const config = {
  transitions: [{ from: "/posts", to: "/posts/*", transition: slide() }],
} satisfies SsgoiConfig;

const framework = { StackRouter, unstable_integrateWithRouter };

export default function Layout() {
  return (
    <Ssgoi config={config} framework={framework}>
      <SsgoiLayoutBoundary />
    </Ssgoi>
  );
}`,
          },
          {
            heading: "Configuration and scope",
            body: "Route rules and middleware share the web semantics. The native provider selects Reanimated playback automatically. The boundary option uses each screen's own route and keeps pushed instances separate. Mounted screens preserve input and scroll state. Explicit scroll restoration is rejected. The preview targets one iOS/Android stack with fade/slide; headers, modal presentation, interactive gestures, shared elements, nested navigator coordination, and Expo Web are follow-up work.",
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
