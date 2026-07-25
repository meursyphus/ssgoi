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
  sections: FrameworkSection[];
};

const TEMPLATES = "https://github.com/meursyphus/ssgoi/tree/HEAD/templates";

export const FRAMEWORK_DOCS: FrameworkDoc[] = [
  {
    slug: "nextjs",
    name: "React / Next.js",
    pkg: "@ssgoi/react",
    lead: "Keep one provider above routed content and put the pathname boundary in its own client component. The common case changes only 2–3 files.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/nextjs.txt",
    templateUrl: `${TEMPLATES}/nextjs`,
    sections: [
      {
        heading: "1. Provider and config",
        body: "Start with one visible rule so the first verification is unambiguous. The config can grow without changing the provider.",
        code: `// app/ssgoi-provider.tsx
"use client";

import { type ReactNode } from "react";
import { Ssgoi } from "@ssgoi/react";
import { drill } from "@ssgoi/react/view-transitions";

const config = {
  transitions: [{ on: "/**", except: "/", transition: drill() }],
};

export function SsgoiProvider({ children }: { children: ReactNode }) {
  return <Ssgoi config={config}>{children}</Ssgoi>;
}`,
      },
      {
        heading: "2. Route boundary",
        body: "Keep the boundary separate from the provider. For a simple app, the pathname is both the React key that causes a remount and the transition id matched by config.",
        code: `// app/ssgoi-route-boundary.tsx
"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function SsgoiRouteBoundary({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} data-ssgoi-transition={pathname}>
      {children}
    </div>
  );
}`,
      },
      {
        heading: "3. Root layout",
        body: "Place both pieces inside the layout shell. The wrapper supplies the containing block, stacking context, and horizontal clipping needed by the leaving page.",
        code: `// app/layout.tsx
import { type ReactNode } from "react";
import { SsgoiProvider } from "./ssgoi-provider";
import { SsgoiRouteBoundary } from "./ssgoi-route-boundary";

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
        heading: "When the pathname boundary is not enough",
        body: "Persistent layouts, parallel routes, and intercepting routes need scoped keys based on the region each boundary owns. Keep one provider and add layout boundaries only where ownership changes.",
      },
    ],
  },
  {
    slug: "react-router",
    name: "React Router",
    pkg: "@ssgoi/react",
    lead: "Same package as Next.js — only the pathname source changes. Boundary on useLocation(), wired once with a pathless layout route.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/react-router.txt",
    templateUrl: `${TEMPLATES}/react-router`,
    sections: [
      {
        heading: "Setup",
        body: "One <Ssgoi> and the shell classes in the root; the boundary keys on the pathname and wraps every page via a pathless layout route.",
        code: `// app/root.tsx — the App component
<main className="relative z-0 min-h-dvh overflow-x-clip">
  <Ssgoi config={config}>
    <Outlet />
  </Ssgoi>
</main>

// app/components/ssgoi-route-boundary.tsx
import { type ReactNode } from "react";
import { useLocation } from "react-router";

export function SsgoiRouteBoundary({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div key={pathname} data-ssgoi-transition={pathname}>
      {children}
    </div>
  );
}

// app/routes.ts — wrap your pages with the boundary layout
layout("routes/page-boundary.layout.tsx", [
  index("routes/home.tsx"),
  route("posts/:postId", "routes/posts.$postId.tsx"),
]),`,
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
    pkg: "@ssgoi/react",
    lead: "Same package as Next.js — the boundary selects the pathname from router state, and everything wires in the root route.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/tanstack-router.txt",
    templateUrl: `${TEMPLATES}/tanstack-router`,
    sections: [
      {
        heading: "Setup",
        code: `// app/routes/__root.tsx
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
});

// app/components/ssgoi-route-boundary.tsx
import { type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";

export function SsgoiRouteBoundary({ children }: { children: ReactNode }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <div key={pathname} data-ssgoi-transition={pathname}>
      {children}
    </div>
  );
}`,
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
    lead: "SvelteKit keeps the root layout wrapper while its live children snippet updates, so that wrapper does not provide an OUT boundary. A small onNavigate boundary detaches the old routed region first.",
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
  import SsgoiTransitionBoundary from "$lib/components/ssgoi-transition-boundary.svelte";

  let { children } = $props();
</script>

<main class="relative z-0 min-h-dvh overflow-x-clip">
  <Ssgoi {config}>
    <SsgoiTransitionBoundary class="min-h-full">
      {@render children()}
    </SsgoiTransitionBoundary>
  </Ssgoi>
</main>`,
      },
      {
        heading: "Why a boundary component",
        body: "The root layout wrapper stays mounted while the live children snippet updates, so a marker on that wrapper has no OUT node. The component detaches the old routed region first — full source in the agent guide and template above.",
        language: "text",
        code: `plain {@render children()} : route change mutates DOM in place → no OUT node

boundary component         : onNavigate → unmount old route   (OUT captured)
                             → SvelteKit updates the route
                             → remount under the new id       (IN animates)`,
      },
      {
        heading: "Beyond the basics",
        body: "For a persistent /products shell, pass a root getId that collapses /products/** to /products, then put a second default pathname boundary only around the child content in routes/products/+layout.svelte. The stable outer id preserves header/tabs; the inner boundary produces tab transitions.",
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
import { config } from "~/utils/ssgoi-config";
</script>

<template>
  <main class="relative z-0 min-h-dvh overflow-x-clip">
    <Ssgoi :config="config">
      <SsgoiTransitionBoundary>
        <NuxtPage />
      </SsgoiTransitionBoundary>
    </Ssgoi>
  </main>
</template>

<!-- components/ssgoi-transition-boundary.vue (auto-imported) -->
<template>
  <component :is="as" :key="transitionId" :data-ssgoi-transition="transitionId">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const props = withDefaults(defineProps<{
  as?: keyof HTMLElementTagNameMap;
  getId?: (pathname: string) => string;
}>(), {
  as: "div",
  getId: (pathname: string) => pathname,
});

const route = useRoute();
const transitionId = computed(() => props.getId(route.path));
</script>`,
      },
      {
        heading: "Plain Vue Router",
        body: "Without Nuxt auto-imports, import the components explicitly and key a wrapper around RouterView's current component.",
        language: "xml",
        code: `<!-- App.vue -->
<script setup lang="ts">
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";
import { Ssgoi } from "@ssgoi/vue";
import { config } from "./ssgoi-config";

const route = useRoute();
const transitionId = computed(() => route.path);
</script>

<template>
  <main class="relative z-0 min-h-dvh overflow-x-clip">
    <Ssgoi :config="config">
      <RouterView v-slot="{ Component }">
        <div
          :key="transitionId"
          :data-ssgoi-transition="transitionId"
        >
          <component :is="Component" />
        </div>
      </RouterView>
    </Ssgoi>
  </main>
</template>`,
      },
      {
        heading: "Beyond the basics",
        body: "For a persistent /products shell, collapse /products/** to /products in the root boundary's getId, then put a second default pathname boundary only around the nested <NuxtPage />. The stable outer id preserves header/tabs; the inner boundary produces child transitions.",
      },
    ],
  },
  {
    slug: "solidstart",
    name: "SolidStart",
    pkg: "@ssgoi/solid",
    lead: "A keyed <Show> recreates its child when the id changes. Wire the boundary once at the router root.",
    llmsUrl: "https://ssgoi.dev/llms/frameworks/solidstart.txt",
    templateUrl: `${TEMPLATES}/solidstart`,
    sections: [
      {
        heading: "Setup",
        code: `// src/app.tsx
<Router
  root={(props) => (
    <main class="relative z-0 min-h-dvh overflow-x-clip">
      <Ssgoi config={config}>
        <SsgoiTransitionBoundary>{props.children}</SsgoiTransitionBoundary>
      </Ssgoi>
    </main>
  )}
>
  <FileRoutes />
</Router>

// src/components/ssgoi-transition-boundary.tsx
import { useLocation } from "@solidjs/router";
import { Show, splitProps, type JSX } from "solid-js";

type BoundaryProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: JSX.Element;
  getId?: (pathname: string) => string;
};

export function SsgoiTransitionBoundary(props: BoundaryProps) {
  const location = useLocation();
  const [local, rest] = splitProps(props, ["children", "getId"]);
  const transitionId = () =>
    (local.getId ?? ((p: string) => p))(location.pathname);

  return (
    <Show when={transitionId()} keyed>
      {(id) => (
        <div {...rest} data-ssgoi-transition={id}>
          {local.children}
        </div>
      )}
    </Show>
  );
}`,
      },
      {
        heading: "Beyond the basics",
        body: "For a persistent /products shell, collapse /products/** to /products in the root boundary's getId, then put a second default pathname boundary only around props.children in routes/products.tsx. The stable outer id preserves header/tabs; the inner boundary produces child transitions.",
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
