type SsgoiTransitionProps = {
  id: string;
  class?: string;
};
/**
 * Page-level transition wrapper that gets transition config from Ssgoi context.
 * Uses Transition component internally with noSerialize functions.
 */
export declare const SsgoiTransition: import("@builder.io/qwik").Component<SsgoiTransitionProps>;
export {};
