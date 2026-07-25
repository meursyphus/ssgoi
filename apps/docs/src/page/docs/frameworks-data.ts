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

const TEMPLATES = "https://github.com/meursyphus/ssgoi/tree/main/templates";

export const FRAMEWORK_DOCS: FrameworkDoc[] = [
  {
    slug: "react-router",
    name: "React Router",
    pkg: "@ssgoi/react",
    lead: "Same package as Next.js — only the pathname source changes. Boundary on useLocation(), wired once with a pathless layout route.",
    llmsUrl: "https://ssgoi.dev/llms/react-router.txt",
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
import { useLocation } from "react-router";

export function SsgoiRouteBoundary({ children }) {
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
        body: "Persistent shell (a tab header that stays while inner pages change): keep the boundary id as the real route, hold the React key constant while routes share the shell — a name prop plus one key branch. The key-scope idea is the Route boundaries page.",
      },
    ],
  },
  {
    slug: "tanstack-router",
    name: "TanStack Router",
    pkg: "@ssgoi/react",
    lead: "Same package as Next.js — the boundary selects the pathname from router state, and everything wires in the root route.",
    llmsUrl: "https://ssgoi.dev/llms/tanstack-router.txt",
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
import { useRouterState } from "@tanstack/react-router";

export function SsgoiRouteBoundary({ children }) {
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
        body: "Persistent shell: a section layout route owns its own boundary around its <Outlet /> — id stays the real route, key stays constant while routes share the shell. See Route boundaries for the key-scope idea.",
      },
    ],
  },
  {
    slug: "sveltekit",
    name: "SvelteKit",
    pkg: "@ssgoi/svelte",
    lead: "SvelteKit updates route DOM in place — no unmount, so nothing to animate out. A small boundary component fixes that with onNavigate. Wire it in the root layout and you're done.",
    llmsUrl: "https://ssgoi.dev/llms/svelte.txt",
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
        body: "SvelteKit swaps route content inside a live snippet, so the old page never detaches and SSGOI has no OUT node. The component detaches it first — full source in the agent guide and template above.",
        language: "text",
        code: `plain {@render children()} : route change mutates DOM in place → no OUT node

boundary component         : onNavigate → unmount old route   (OUT captured)
                             → SvelteKit updates the route
                             → remount under the new id       (IN animates)`,
      },
      {
        heading: "Beyond the basics",
        body: "Persistent layout: the route layout puts data-ssgoi-transition on its own root above the children; child pages keep theirs — the outer changed boundary wins when both leave. Grouping several routes under one id: pass getId.",
      },
    ],
  },
  {
    slug: "nuxt",
    name: "Nuxt",
    pkg: "@ssgoi/vue",
    lead: "A changed :key remounts the subtree — key and marker both come from route.path. Wire the boundary around <NuxtPage /> once.",
    llmsUrl: "https://ssgoi.dev/llms/vue.txt",
    templateUrl: `${TEMPLATES}/nuxt`,
    sections: [
      {
        heading: "Setup",
        language: "xml",
        code: `<!-- app.vue -->
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
        heading: "Beyond the basics",
        body: "Persistent layout: a parent page puts the marker on its own root and renders <NuxtPage /> for children; child pages keep their boundaries — the outer changed boundary wins when both leave. Grouping several routes under one id: pass getId.",
      },
    ],
  },
  {
    slug: "solidstart",
    name: "SolidStart",
    pkg: "@ssgoi/solid",
    lead: "A keyed <Show> recreates its child when the id changes. Wire the boundary once at the router root.",
    llmsUrl: "https://ssgoi.dev/llms/solid.txt",
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

export function SsgoiTransitionBoundary(props) {
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
        body: "Persistent layout: the route layout puts the marker on its own root above props.children; child pages keep theirs — the outer changed boundary wins when both leave. Grouping several routes under one id: pass getId.",
      },
    ],
  },
  {
    slug: "qwik",
    name: "Qwik City",
    pkg: "@ssgoi/qwik",
    lead: "Qwik serializes component state and configs contain functions — so the config is a QRL factory, and SSGOI attaches to the element that owns <Slot />.",
    llmsUrl: "https://ssgoi.dev/llms/qwik.txt",
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
export default component$(() => {
  const root = useSignal<HTMLElement>();
  useSsgoi(root, { config$ });

  return (
    <main ref={root} class="relative z-0 min-h-dvh overflow-x-clip">
      <Slot />
    </main>
  );
});

// each routed page marks its own root
<article data-ssgoi-transition={location.url.pathname}>{/* page */}</article>`,
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
    llmsUrl: "https://ssgoi.dev/llms/angular.txt",
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
      style="position:relative;z-index:0;overflow-x:clip"
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
        body: "Mark each routed component root with data-ssgoi-transition — the id must match your config's route patterns.",
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
