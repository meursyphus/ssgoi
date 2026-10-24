import type { ReactiveController, ReactiveControllerHost } from "lit";
import {
  createSggoiTransitionContext,
  IDLE_TRANSITION_STATE,
  observeSsgoiTransitions,
} from "@ssgoi/core/internal";
import type { HostAnimation } from "@ssgoi/core/internal";
import type { SsgoiConfig, SsgoiTransitionState } from "@ssgoi/core";

export interface SsgoiControllerOptions {
  /** Optional playback host shared across consecutive page transitions. */
  host?: HostAnimation;
}

/** A Lit lifecycle owner for one persistent light-DOM page transition root. */
export class SsgoiController implements ReactiveController {
  private readonly owner: ReactiveControllerHost;
  private config: SsgoiConfig;
  private options: SsgoiControllerOptions;
  private root: Element | undefined;
  private observedRoot: Element | undefined;
  private stopObserving: (() => void) | undefined;
  private unsubscribe: (() => void) | undefined;
  private connected = false;
  private snapshot: SsgoiTransitionState = IDLE_TRANSITION_STATE;

  constructor(
    owner: ReactiveControllerHost,
    config: SsgoiConfig,
    options: SsgoiControllerOptions = {},
  ) {
    this.owner = owner;
    this.config = config;
    this.options = options;
    owner.addController(this);
  }

  /** Pass to Lit's ref directive: <main ${ref(this.ssgoi.ref)}>…</main>. */
  readonly ref = (element: Element | undefined): void => {
    if (element === this.root) return;
    this.stop();
    this.root = element;
    // The hostUpdated callback starts observation after Lit commits its children.
  };

  /** Reactive snapshot. Reading this in render() updates with navigation. */
  get state(): SsgoiTransitionState {
    return this.snapshot;
  }

  /** Replace immutable config/options and reconnect the existing root. */
  setConfig(
    config: SsgoiConfig,
    options: SsgoiControllerOptions = this.options,
  ): void {
    if (config === this.config && options.host === this.options.host) return;
    this.stop();
    this.config = config;
    this.options = options;
    this.owner.requestUpdate();
  }

  hostConnected(): void {
    this.connected = true;
    this.owner.requestUpdate();
  }

  hostUpdated(): void {
    const root = this.root;
    if (!this.connected || !root?.isConnected || this.observedRoot === root)
      return;
    // The core's shared removal observer watches document.body. Shadow-root
    // removals cannot reach it, so reject them rather than silently losing OUT.
    if (root.getRootNode().nodeType !== 9) {
      throw new Error(
        "SsgoiController requires a light-DOM root. Override createRenderRoot() to return this; page transitions inside shadow roots are unsupported.",
      );
    }
    const context = createSggoiTransitionContext(this.config, this.options);
    this.unsubscribe = context.subscribe((state) => {
      this.snapshot = state;
      this.owner.requestUpdate();
    });
    try {
      this.stopObserving = observeSsgoiTransitions(root, context);
      this.observedRoot = root;
    } catch (error) {
      this.unsubscribe?.();
      this.unsubscribe = undefined;
      context.disconnect?.();
      throw error;
    }
  }

  hostDisconnected(): void {
    this.connected = false;
    this.stop();
  }

  private stop(): void {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    this.stopObserving?.();
    this.stopObserving = undefined;
    this.observedRoot = undefined;
    if (this.snapshot !== IDLE_TRANSITION_STATE) {
      this.snapshot = IDLE_TRANSITION_STATE;
      this.owner.requestUpdate();
    }
  }
}
