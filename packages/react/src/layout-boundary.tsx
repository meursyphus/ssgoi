"use client";

import {
  createContext,
  Suspense,
  useContext,
  useMemo,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";
import type { SsgoiLayoutScope } from "@ssgoi/core/types";
import { resolveLayoutChain } from "@ssgoi/core/internal";

/**
 * How `<Ssgoi>` reads the router, passed to `<Ssgoi framework>`. Keep the
 * object stable.
 */
export interface SsgoiFramework {
  /**
   * A hook returning the current route, or `null` while the router isn't
   * ready. `renderedPath` is the path the routed region actually shows when it
   * differs from the URL (a soft-intercepted Next.js route); boundaries key by
   * it instead of `pathname`.
   */
  useRoute: () => { pathname: string; renderedPath?: string } | null;
}

type FrameworkSetup = {
  framework: SsgoiFramework;
  layouts: readonly SsgoiLayoutScope[] | undefined;
};

/** What a boundary passes to the boundaries inside it. */
type LayoutState = {
  routePath: string;
  chain: readonly string[];
  depth: number;
};

const frameworkContext = createContext<FrameworkSetup | null>(null);
const layoutContext = createContext<LayoutState | null>(null);

/** @internal `<Ssgoi>`'s framework and layout tree, for the first boundary. */
export function SsgoiFrameworkProvider({
  framework,
  layouts,
  children,
}: {
  framework: SsgoiFramework | undefined;
  layouts: readonly SsgoiLayoutScope[] | undefined;
  children: ReactNode;
}) {
  const setup = useMemo(
    () => (framework ? { framework, layouts } : null),
    [framework, layouts],
  );
  return (
    <frameworkContext.Provider value={setup}>
      {children}
    </frameworkContext.Provider>
  );
}

export type SsgoiLayoutBoundaryProps<T extends ElementType = "div"> = {
  children?: ReactNode;
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

/**
 * A keyed route boundary for the layout that renders it. Its depth is the
 * number of boundaries above it; it stays mounted while navigation stays in
 * the same `config.layouts` scope at that depth, and otherwise keys by the
 * route. The first boundary reads the route for the ones inside it.
 */
export function SsgoiLayoutBoundary<T extends ElementType = "div">(
  props: SsgoiLayoutBoundaryProps<T>,
) {
  const setup = useContext(frameworkContext);
  const parent = useContext(layoutContext);
  if (parent) return <KeyedBoundary {...props} state={parent} />;
  if (!setup) {
    throw new Error(
      "SSGOI: SsgoiLayoutBoundary requires a framework. Pass it to <Ssgoi framework={{ useRoute }}>.",
    );
  }
  return (
    // Catches URL suspension (Next.js Cache Components) outside the hook.
    <Suspense fallback={null}>
      <RootBoundary {...props} setup={setup} />
    </Suspense>
  );
}

type BoundaryProps = SsgoiLayoutBoundaryProps<ElementType>;

function RootBoundary({
  setup: { framework, layouts },
  ...props
}: BoundaryProps & { setup: FrameworkSetup }) {
  const route = framework.useRoute();
  const routePath = route && (route.renderedPath ?? route.pathname);
  const state = useMemo(
    () =>
      routePath == null
        ? null
        : {
            routePath,
            chain: resolveLayoutChain(layouts, routePath),
            depth: 0,
          },
    [layouts, routePath],
  );

  // In a mixed app/pages project Next may not have initialized the router yet.
  // Never register an empty or invented route with SSGOI.
  if (!state) return null;
  return <KeyedBoundary {...props} state={state} />;
}

function KeyedBoundary({
  state,
  as,
  children,
  ...rest
}: BoundaryProps & { state: LayoutState }) {
  const inner = useMemo(() => ({ ...state, depth: state.depth + 1 }), [state]);
  const { routePath, chain, depth } = state;
  const Component: ElementType = as ?? "div";
  return (
    <Component
      {...rest}
      key={chain[depth] ?? routePath}
      data-ssgoi-transition={routePath}
    >
      <layoutContext.Provider value={inner}>{children}</layoutContext.Provider>
    </Component>
  );
}
