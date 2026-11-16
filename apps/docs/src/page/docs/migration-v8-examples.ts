/**
 * Before/after snippets for the 7.x → 8.0 migration guide.
 *
 * "Before" snippets show the 7.x interface that 8.0 removed and do not compile
 * against 8.0. "After" snippets follow the framework guides and templates.
 */

export type MigrationExample = {
  id: string;
  title: string;
  /** Short note under the heading: what differs for this stack. */
  note?: string;
  language?: string;
  before: string;
  after: string;
};

export const FIND_USAGES = `grep -rnE --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist '@ssgoi/[a-z-]+/(nextjs|remix|react-router|tanstack-router|sveltekit|vue-router|nuxt|solid-router|solidstart|qwik-city|router|expo-router|unplugin)|(^|[^A-Za-z])SsgoiTransition\\b|SsgoiRouteBoundary|ssgoiRouteBoundary|ssgoiTransition|routeKey|parallelRoutesKey|feel:|"crossfade"|background-scale|fade: true|data-hero-key|data-hero-aspect-ratio|data-hero-radius|data-zoom-radius|fromSpring|TrackPatch|SsgoiTransitionsOption' .

# Patterns too generic for one search; review these hits by hand:
grep -rnE --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist '["'"'"']\\*["'"'"']|\\.set\\(["'"'"']' .`;

/* -------------------------------------------------------------------------- */
/* Router subpaths → <Ssgoi framework> + SsgoiLayoutBoundary                  */
/* -------------------------------------------------------------------------- */

export const ROUTER_EXAMPLES: MigrationExample[] = [
  {
    id: "nextjs",
    title: "Next.js App Router",
    note: "useRoute returns the pathname and the path the children slot renders, so an intercepted modal keeps its background mounted.",
    before: `// app/ssgoi-provider.tsx
"use client";
import { Ssgoi } from "@ssgoi/react";

export function SsgoiProvider({ children }: { children: ReactNode }) {
  return <Ssgoi config={config}>{children}</Ssgoi>;
}

// app/layout.tsx
import { SsgoiRouteBoundary } from "@ssgoi/react/nextjs";

<SsgoiProvider>
  <SsgoiRouteBoundary>{children}</SsgoiRouteBoundary>
</SsgoiProvider>`,
    after: `// app/ssgoi-provider.tsx
"use client";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { Ssgoi, type SsgoiFramework } from "@ssgoi/react";

const INTERCEPTION_PREFIX = /^(?:\\(\\.\\.\\.\\)|\\(\\.\\.\\)|\\(\\.\\))+/;

const framework: SsgoiFramework = {
  useRoute: () => {
    const pathname = usePathname();
    const segments = useSelectedLayoutSegments();
    if (pathname == null) return null;
    const renderedPath = \`/\${segments
      .filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")))
      .map((segment) => segment.replace(INTERCEPTION_PREFIX, ""))
      .filter(Boolean)
      .join("/")}\`;
    return { pathname, renderedPath };
  },
};

export function SsgoiProvider({ children }: { children: ReactNode }) {
  return (
    <Ssgoi config={config} framework={framework}>
      {children}
    </Ssgoi>
  );
}

// app/layout.tsx
import { SsgoiLayoutBoundary } from "@ssgoi/react";

<SsgoiProvider>
  <SsgoiLayoutBoundary>{children}</SsgoiLayoutBoundary>
</SsgoiProvider>`,
  },
  {
    id: "remix-react-router",
    title: "Remix and React Router",
    note: "Both return their own location. Import useLocation from @remix-run/react in Remix 2 and from react-router in React Router 6 or 7.",
    before: `// app/root.tsx
import { Ssgoi } from "@ssgoi/react";

<Ssgoi config={config}>
  <Outlet />
</Ssgoi>

// app/routes/page-boundary.layout.tsx
import { SsgoiRouteBoundary } from "@ssgoi/react/react-router"; // or "@ssgoi/react/remix"

<SsgoiRouteBoundary>
  <Outlet />
</SsgoiRouteBoundary>`,
    after: `// app/root.tsx
import { Outlet, useLocation } from "react-router"; // or "@remix-run/react"
import { Ssgoi, type SsgoiFramework } from "@ssgoi/react";

const framework: SsgoiFramework = { useRoute: () => useLocation() };

<Ssgoi config={config} framework={framework}>
  <Outlet />
</Ssgoi>

// app/routes/page-boundary.layout.tsx
import { SsgoiLayoutBoundary } from "@ssgoi/react";

<SsgoiLayoutBoundary>
  <Outlet />
</SsgoiLayoutBoundary>`,
  },
  {
    id: "tanstack-router",
    title: "TanStack Router",
    note: "Return the path of the leaf match the outlet renders, not location: TanStack moves location before pending matches render.",
    before: `// app/routes/__root.tsx
import { Ssgoi } from "@ssgoi/react";
import { SsgoiRouteBoundary } from "@ssgoi/react/tanstack-router";

<Ssgoi config={config}>
  <SsgoiRouteBoundary>
    <Outlet />
  </SsgoiRouteBoundary>
</Ssgoi>`,
    after: `// app/routes/__root.tsx
import { Outlet, useRouterState } from "@tanstack/react-router";
import { Ssgoi, SsgoiLayoutBoundary, type SsgoiFramework } from "@ssgoi/react";

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
  <SsgoiLayoutBoundary>
    <Outlet />
  </SsgoiLayoutBoundary>
</Ssgoi>`,
  },
  {
    id: "sveltekit",
    title: "SvelteKit",
    note: "Pass a route getter and SvelteKit's onNavigate. SvelteKit before 2.12 reads get(page).url from $app/stores instead of $app/state.",
    language: "html",
    before: `<!-- src/routes/+layout.svelte -->
<script>
  import { Ssgoi } from "@ssgoi/svelte";
  import { SsgoiRouteBoundary } from "@ssgoi/svelte/sveltekit";
  let { children } = $props();
</script>

<Ssgoi {config}>
  <SsgoiRouteBoundary>
    {@render children()}
  </SsgoiRouteBoundary>
</Ssgoi>`,
    after: `<!-- src/routes/+layout.svelte -->
<script>
  import { page } from "$app/state";
  import { onNavigate } from "$app/navigation";
  import { Ssgoi, SsgoiLayoutBoundary } from "@ssgoi/svelte";
  let { children } = $props();

  const framework = {
    getRoute: () => ({ pathname: page.url.pathname }),
    onNavigate,
  };
</script>

<Ssgoi {config} {framework}>
  <SsgoiLayoutBoundary>
    {@render children()}
  </SsgoiLayoutBoundary>
</Ssgoi>`,
  },
  {
    id: "nuxt-vue-router",
    title: "Nuxt and Vue Router",
    note: "Read router.currentRoute, the committed router state. In Nuxt useRouter is auto-imported; with plain Vue Router import it from vue-router and wrap the RouterView component instead of NuxtPage.",
    language: "html",
    before: `<!-- app.vue -->
<script setup>
import { Ssgoi } from "@ssgoi/vue";
import { SsgoiRouteBoundary } from "@ssgoi/vue/nuxt"; // or "@ssgoi/vue/vue-router"
</script>

<template>
  <Ssgoi :config="config">
    <SsgoiRouteBoundary>
      <NuxtPage />
    </SsgoiRouteBoundary>
  </Ssgoi>
</template>`,
    after: `<!-- app.vue -->
<script setup>
import { Ssgoi, SsgoiLayoutBoundary } from "@ssgoi/vue";

const router = useRouter();
const framework = {
  getRoute: () => ({ pathname: router.currentRoute.value.path }),
};
</script>

<template>
  <Ssgoi :config="config" :framework="framework">
    <SsgoiLayoutBoundary>
      <NuxtPage />
    </SsgoiLayoutBoundary>
  </Ssgoi>
</template>`,
  },
  {
    id: "solid",
    title: "Solid Router and SolidStart",
    note: "Render the provider inside <Router> so useLocation works. SolidStart uses the same setup in its router root.",
    before: `import { Ssgoi } from "@ssgoi/solid";
import { SsgoiRouteBoundary } from "@ssgoi/solid/solid-router"; // or "@ssgoi/solid/solidstart"

function Root(props: RouteSectionProps) {
  return (
    <Ssgoi config={config}>
      <SsgoiRouteBoundary>{props.children}</SsgoiRouteBoundary>
    </Ssgoi>
  );
}`,
    after: `import { useLocation, type RouteSectionProps } from "@solidjs/router";
import { Ssgoi, SsgoiLayoutBoundary } from "@ssgoi/solid";

function Root(props: RouteSectionProps) {
  const location = useLocation();
  return (
    <Ssgoi
      config={config}
      framework={{ getRoute: () => ({ pathname: location.pathname }) }}
    >
      <SsgoiLayoutBoundary>{props.children}</SsgoiLayoutBoundary>
    </Ssgoi>
  );
}`,
  },
  {
    id: "qwik-city",
    title: "Qwik City",
    note: "Pass Qwik City's location store where SSGOI is attached. useSsgoiLayoutBoundary takes no arguments; a stable key for a shell comes from config.layouts.",
    before: `// src/routes/layout.tsx
useSsgoi(root, { config$ });

// a page or group layout
import { useSsgoiRouteBoundary } from "@ssgoi/qwik/qwik-city";

const boundary = useSsgoiRouteBoundary();
<article key={boundary.value.key} data-ssgoi-transition={boundary.value.id}>`,
    after: `// src/routes/layout.tsx
import { useLocation } from "@builder.io/qwik-city";
useSsgoi(root, { config$, framework: { location: useLocation() } });

// a page or group layout
import { useSsgoiLayoutBoundary } from "@ssgoi/qwik";

const boundary = useSsgoiLayoutBoundary();
<article key={boundary.value.key} data-ssgoi-transition={boundary.value.id}>`,
  },
  {
    id: "angular",
    title: "Angular Router",
    note: "Bind an ssgoiFramework on the [ssgoi] element; the routed pages switch from *ssgoiRouteBoundary to *ssgoiLayoutBoundary, which takes no input.",
    language: "ts",
    before: `// app.component.ts
template: \`<main ssgoi [config]="config()"><router-outlet /></main>\`

// page.component.ts
import { SsgoiRouteBoundary } from "@ssgoi/angular/router";

@Component({
  standalone: true,
  imports: [SsgoiRouteBoundary],
  template: \`<article *ssgoiRouteBoundary="let boundary">…</article>\`,
})
export class PageComponent {}`,
    after: `// app.component.ts
import { NavigationEnd, Router, UrlTree } from "@angular/router";
import { Ssgoi, type SsgoiFramework } from "@ssgoi/angular";

const framework: SsgoiFramework = {
  getRoute: (injector) => {
    const router = injector.get(Router);
    const { root } = router.parseUrl(router.url);
    return { pathname: router.serializeUrl(new UrlTree(root)) };
  },
  onNavigate: (injector, callback) => {
    const subscription = injector.get(Router).events.subscribe((event) => {
      if (event instanceof NavigationEnd) callback();
    });
    return () => subscription.unsubscribe();
  },
};

template: \`
  <main ssgoi [config]="config()" [ssgoiFramework]="framework">
    <router-outlet />
  </main>
\`

// page.component.ts
import { SsgoiLayoutBoundary } from "@ssgoi/angular";

@Component({
  standalone: true,
  imports: [SsgoiLayoutBoundary],
  template: \`<article *ssgoiLayoutBoundary="let boundary">…</article>\`,
})
export class PageComponent {}`,
  },
  {
    id: "expo-router",
    title: "Expo Router",
    note: "Pass Expo Router's StackRouter and unstable_integrateWithRouter as framework, at module scope so the navigator is built once.",
    before: `// app/_layout.tsx
import { Ssgoi } from "@ssgoi/react-native";
import { SsgoiRouteBoundary } from "@ssgoi/react-native/expo-router";

export default function Layout() {
  return (
    <Ssgoi config={config}>
      <SsgoiRouteBoundary />
    </Ssgoi>
  );
}`,
    after: `// app/_layout.tsx
import { StackRouter, unstable_integrateWithRouter } from "expo-router";
import { Ssgoi, SsgoiLayoutBoundary } from "@ssgoi/react-native";

const framework = { StackRouter, unstable_integrateWithRouter };

export default function Layout() {
  return (
    <Ssgoi config={config} framework={framework}>
      <SsgoiLayoutBoundary />
    </Ssgoi>
  );
}`,
  },
];

/* -------------------------------------------------------------------------- */
/* routeKey → config.layouts                                                  */
/* -------------------------------------------------------------------------- */

export const ROUTE_KEY_BEFORE = `// app/shop/layout.tsx — 7.x
<SsgoiRouteBoundary routeKey="shop">
  <ShopTabs />
  <SsgoiRouteBoundary>{children}</SsgoiRouteBoundary>
</SsgoiRouteBoundary>`;

export const ROUTE_KEY_AFTER = `// ssgoi config — 8.0: declare the section once
const config = {
  layouts: [{ paths: "/shop/**" }],
  transitions: [/* unchanged */],
};

// app/shop/layout.tsx — the root boundary (depth 0) keeps one key for every
// /shop route, so the tabs stay; this boundary (depth 1) keys by the path.
<>
  <ShopTabs />
  <SsgoiLayoutBoundary>{children}</SsgoiLayoutBoundary>
</>`;

/* -------------------------------------------------------------------------- */
/* SsgoiTransition → data-ssgoi-transition                                    */
/* -------------------------------------------------------------------------- */

export const SSGOI_TRANSITION_BEFORE = `// React, Solid, Qwik
<SsgoiTransition id="/posts">…</SsgoiTransition>

<!-- Svelte -->
<SsgoiTransition id="/posts">…</SsgoiTransition>

<!-- Vue -->
<SsgoiTransition :id="route.path">…</SsgoiTransition>

<!-- Angular (imports: [SsgoiTransition]) -->
<section ssgoiTransition="/posts">…</section>`;

export const SSGOI_TRANSITION_AFTER = `// React, Solid, Qwik
<div data-ssgoi-transition="/posts">…</div>

<!-- Svelte -->
<div data-ssgoi-transition="/posts">…</div>

<!-- Vue -->
<div :data-ssgoi-transition="route.path">…</div>

<!-- Angular -->
<section data-ssgoi-transition="/posts">…</section>
<section [attr.data-ssgoi-transition]="path">…</section>`;

/* -------------------------------------------------------------------------- */
/* @ssgoi/react/unplugin                                                      */
/* -------------------------------------------------------------------------- */

export const UNPLUGIN_BEFORE = `// vite.config.ts
import react from "@vitejs/plugin-react";
import ssgoiAutoKey from "@ssgoi/react/unplugin/vite";

export default defineConfig({
  plugins: [react(), ssgoiAutoKey()],
});`;

export const UNPLUGIN_AFTER = `// vite.config.ts
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});`;

/* -------------------------------------------------------------------------- */
/* Preset options                                                             */
/* -------------------------------------------------------------------------- */

export const PRESET_OPTIONS_BEFORE = `axis({ feel: "snappy" });
axis({ feel: "fluid" });
drill({ type: "crossfade" });
sheet({ type: "background-scale" });
zoom({ type: "blur", fade: true });`;

export const PRESET_OPTIONS_AFTER = `axis({ variant: "snappy" });
axis();
drill({ type: "slide" });
sheet({ type: "scale" });
zoom({ type: "blur", variant: "fade" });`;

/* -------------------------------------------------------------------------- */
/* Hero and zoom markup                                                       */
/* -------------------------------------------------------------------------- */

export const HERO_KEY_BEFORE = `// list page
<img data-hero-key={item.id} src={item.thumbnail} />

// detail page
<img data-hero-key={item.id} src={item.full} />`;

export const HERO_KEY_AFTER = `// list page: the side you leave from
<img data-hero-exit-key={item.id} src={item.thumbnail} />

// detail page: the side you arrive at
<img data-hero-enter-key={item.id} src={item.full} />`;

export const MEDIA_HINTS_BEFORE = `<div
  data-hero-exit-key={item.id}
  data-hero-aspect-ratio="4/3"
  data-hero-radius="12"
>
  <img src={item.thumbnail} />
</div>

<img data-zoom-exit-key={photo.id} data-zoom-radius="16" src={photo.thumbnail} />`;

export const MEDIA_HINTS_AFTER = `<div
  data-hero-exit-key={item.id}
  style={{ borderRadius: 12, overflow: "hidden" }}
>
  <img
    src={item.thumbnail}
    width={800}
    height={600}
    style={{ width: "100%", height: "100%", objectFit: "cover" }}
  />
</div>

<img
  data-zoom-exit-key={photo.id}
  src={photo.thumbnail}
  style={{ borderRadius: 16 }}
/>`;

/* -------------------------------------------------------------------------- */
/* Route patterns                                                             */
/* -------------------------------------------------------------------------- */

export const STAR_PATTERN_BEFORE = `const config = {
  transitions: [{ on: "*", transition: fade() }],
};`;

export const STAR_PATTERN_AFTER = `const config = {
  transitions: [{ on: "/**", transition: fade() }],
};`;

/* -------------------------------------------------------------------------- */
/* Motion APIs                                                                */
/* -------------------------------------------------------------------------- */

export const MOTION_BEFORE = `import { IntegratorProvider } from "@ssgoi/core";

export const integrator = IntegratorProvider.fromSpring({ stiffness: 300, damping: 30 });

drill({}, {
  override: {
    forward({ animation }) {
      animation.set("in", {
        integrator: { spring: { stiffness: 300, damping: 30 } },
      });
    },
  },
});`;

export const MOTION_AFTER = `import { IntegratorProvider, drill, spring } from "@ssgoi/core";

export const integrator = IntegratorProvider.from({
  spring: { stiffness: 300, damping: 30 },
});

export const tunedDrill = drill(
  {},
  {
    override: {
      forward({ animation }) {
        animation.select("in").set({
          integrator: spring({ stiffness: 300, damping: 30 }),
        });
      },
    },
  },
);`;
