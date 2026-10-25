import m from "mithril";
import type { SsgoiConfig, SsgoiTransitionState } from "@ssgoi/core";
import {
  createSggoiTransitionContext,
  observeSsgoiTransitions,
  IDLE_TRANSITION_STATE,
} from "@ssgoi/core/internal";

const EMPTY_CONFIG: SsgoiConfig = Object.freeze({});

/** One explicit controller per mounted provider; no process-wide context. */
class Controller {
  private root?: HTMLElement;
  private config?: SsgoiConfig;
  private stop?: () => void;
  private state: SsgoiTransitionState = IDLE_TRANSITION_STATE;
  private listeners = new Set<(state: SsgoiTransitionState) => void>();

  getTransitionState = (): SsgoiTransitionState => this.state;

  subscribe = (
    listener: (state: SsgoiTransitionState) => void,
  ): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private publish = (state: SsgoiTransitionState): void => {
    if (state === this.state) return;
    this.state = state;
    for (const listener of this.listeners) listener(state);
  };

  /** Advanced: connect a stable, connected light-DOM provider root. */
  attach(root: HTMLElement, config: SsgoiConfig = EMPTY_CONFIG): void {
    if (this.root && this.root !== root) {
      throw new Error(
        "Each mounted Ssgoi provider requires its own controller",
      );
    }
    if (this.root === root && this.config === config) return;
    this.detach();
    this.root = root;
    this.config = config;
    const context = createSggoiTransitionContext(config);
    const unsubscribe = context.subscribe(this.publish);
    const stopObserving = observeSsgoiTransitions(root, context);
    this.stop = () => {
      unsubscribe();
      stopObserving();
    };
  }

  /** Advanced: cancel active work and release DOM observers/subscriptions. */
  detach(): void {
    this.stop?.();
    this.stop = undefined;
    this.root = undefined;
    this.config = undefined;
    this.publish(IDLE_TRANSITION_STATE);
  }
}

export type SsgoiController = Controller;

/** Safe during SSR: the DOM is only accessed when the provider mounts. */
export function createSsgoi(): SsgoiController {
  return new Controller();
}

export interface SsgoiAttrs {
  config?: SsgoiConfig;
  /** Pass explicitly to read state in descendants via normal vnode attrs. */
  controller?: SsgoiController;
}

/** Keep this component outside the keyed page boundary. */
export const Ssgoi: m.ClosureComponent<SsgoiAttrs> = () => {
  const fallback = createSsgoi();
  let controller: SsgoiController | undefined;
  let unsubscribe: (() => void) | undefined;

  const connect = (vnode: m.VnodeDOM<SsgoiAttrs>) => {
    const next = vnode.attrs.controller ?? fallback;
    if (next !== controller) {
      unsubscribe?.();
      controller?.detach();
      controller = next;
      unsubscribe = controller.subscribe(() => m.redraw());
    }
    controller.attach(vnode.dom as HTMLElement, vnode.attrs.config);
  };

  return {
    oncreate: connect,
    onupdate: connect,
    onremove() {
      unsubscribe?.();
      controller?.detach();
    },
    view: ({ children }) =>
      m(
        "div",
        { "data-ssgoi-root": "", style: { display: "contents" } },
        children,
      ),
  };
};
