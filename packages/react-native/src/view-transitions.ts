import type { NativeTransition, PhysicsOptions } from "./types.js";

export interface FadeOptions {
  physics?: PhysicsOptions;
}
export interface SlideOptions {
  physics?: PhysicsOptions;
}

export function fade({ physics }: FadeOptions = {}): NativeTransition {
  return { platform: "ssgoi-native", kind: "fade", physics };
}
export function slide({ physics }: SlideOptions = {}): NativeTransition {
  return { platform: "ssgoi-native", kind: "slide", physics };
}
