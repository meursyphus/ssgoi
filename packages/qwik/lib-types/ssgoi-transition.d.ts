type SsgoiTransitionProps = {
  id: string;
  class?: string;
};
/**
 * Page-level transition wrapper that gets transition config from Ssgoi context.
 * Passes context signal directly to Transition for reactive updates.
 */
export declare const SsgoiTransition: import("@builder.io/qwik").Component<SsgoiTransitionProps>;
export {};
