/**
 * Public option shapes for the fade preset. Default `type` is
 * `"fade-through"`: a quick fade-out, then a fade-in that starts once the
 * outgoing page is nearly gone.
 */

export type FadeType = "fade-through";

export type FadeVariant = "default";

export type FadeOptions = Record<string, never>;
