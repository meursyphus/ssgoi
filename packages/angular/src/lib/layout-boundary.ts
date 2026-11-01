import {
  Directive,
  InjectionToken,
  Injector,
  Input,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  inject,
  type EmbeddedViewRef,
  type OnChanges,
  type OnDestroy,
  type OnInit,
  type Signal,
} from "@angular/core";

/**
 * Router logic for `SsgoiLayoutBoundary`, passed to `[ssgoiFramework]` on
 * `[ssgoi]`. Both members receive the boundary directive's own `Injector`, so
 * route tokens resolve at its position.
 */
export interface SsgoiFramework {
  getRoute: (injector: Injector) => { pathname: string };
  /** Subscribe to committed navigations; return an unsubscribe function. */
  onNavigate: (injector: Injector, callback: () => void) => () => void;
}

type BoundaryResult = { id?: string; key?: string | number };

/**
 * A fixed key (string), a fixed id and/or key, or a function of the route
 * `getRoute` returns. Defaults: id = pathname, key = id. Method shorthand keeps
 * a function that annotates the route's extra fields (e.g.
 * `route: ActivatedRouteSnapshot`) assignable.
 */
type BoundaryInput =
  | string
  | BoundaryResult
  | {
      resolve(route: { pathname: string }): string | BoundaryResult;
    }["resolve"];

/** `[ssgoiFramework]` of the nearest `[ssgoi]`, provided on every platform. */
export const SSGOI_FRAMEWORK = new InjectionToken<
  Signal<SsgoiFramework | undefined>
>("ssgoi-framework");

type BoundaryState = { id: string; key: string | number };
type BoundaryContext = { $implicit: BoundaryState };

function resolveBoundary(
  input: BoundaryInput | undefined,
  route: { pathname: string },
): BoundaryState {
  const resolver = typeof input === "function" ? input : () => input;
  const result = resolver(route);
  const normalized =
    typeof result === "string" ? { key: result } : (result ?? {});
  const id = normalized.id ?? route.pathname;
  return { id, key: normalized.key ?? id };
}

/**
 * @internal Renders a layout boundary's embedded view. Shared by
 * `SsgoiLayoutBoundary` and the deprecated `SsgoiRouteBoundary`; create it in
 * the directive's injection context.
 */
export class ɵLayoutBoundaryView {
  private readonly injector = inject(Injector);
  private readonly template = inject<TemplateRef<BoundaryContext>>(TemplateRef);
  private readonly container = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);
  private framework?: SsgoiFramework;
  private view?: EmbeddedViewRef<BoundaryContext>;
  private element?: HTMLElement;
  private key?: string | number;
  private unsubscribe?: () => void;

  constructor(
    private readonly name: string,
    private readonly input: () => BoundaryInput | undefined,
  ) {}

  start(framework: SsgoiFramework): void {
    this.framework = framework;
    this.render();
    this.unsubscribe = framework.onNavigate(this.injector, () => this.render());
  }

  stop(): void {
    this.unsubscribe?.();
  }

  render(): void {
    if (!this.framework) return;

    const boundary = resolveBoundary(
      this.input(),
      this.framework.getRoute(this.injector),
    );

    if (!this.view || boundary.key !== this.key) {
      this.container.clear();
      this.view = this.container.createEmbeddedView(this.template, {
        $implicit: boundary,
      });
      const roots = this.view.rootNodes.filter((node) => node.nodeType === 1);
      if (roots.length !== 1) {
        this.container.clear();
        this.view = undefined;
        throw new Error(`SSGOI: ${this.name} requires exactly one DOM root.`);
      }
      this.element = roots[0];
      this.key = boundary.key;
    } else {
      this.view.context.$implicit = boundary;
    }
    this.renderer.setAttribute(
      this.element,
      "data-ssgoi-transition",
      boundary.id,
    );
    this.view.markForCheck();
  }
}

/**
 * Use on a routed page's single DOM root, e.g. <article *ssgoiLayoutBoundary>
 * or <section *ssgoiLayoutBoundary="'products-layout'">, under `[ssgoi]` with
 * `[ssgoiFramework]`. Recreates the embedded view when
 * its route key changes, including reused parameterized routes. It does not
 * replace RouterOutlet or a RouteReuseStrategy.
 */
@Directive({ selector: "[ssgoiLayoutBoundary]", standalone: true })
export class SsgoiLayoutBoundary implements OnInit, OnChanges, OnDestroy {
  /** The boundary; `""` (bare `*ssgoiLayoutBoundary`) uses the defaults. */
  @Input() ssgoiLayoutBoundary?: BoundaryInput | "";

  private readonly framework = inject(SSGOI_FRAMEWORK, { optional: true });
  private readonly boundary = new ɵLayoutBoundaryView(
    "*ssgoiLayoutBoundary",
    () => this.ssgoiLayoutBoundary || undefined,
  );

  ngOnInit(): void {
    // Read here rather than at construction: `[ssgoi]` inputs in the same
    // template are bound by now.
    const framework = this.framework?.();
    if (!framework) {
      throw new Error(
        'SSGOI: SsgoiLayoutBoundary requires a framework. Pass it to [ssgoi] with [ssgoiFramework]="framework", where framework = { getRoute: (injector) => ({ pathname }), onNavigate: (injector, callback) => unsubscribe }.',
      );
    }
    this.boundary.start(framework);
  }

  ngOnChanges(): void {
    this.boundary.render();
  }

  ngOnDestroy(): void {
    this.boundary.stop();
  }

  static ngTemplateContextGuard(
    _directive: SsgoiLayoutBoundary,
    context: unknown,
  ): context is BoundaryContext {
    return true;
  }
}
