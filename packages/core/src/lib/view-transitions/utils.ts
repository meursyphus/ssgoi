import type { GetTransitionConfig } from "../types";

/**
 * Applies common styles for outgoing page elements
 * Makes the element absolute positioned to allow the incoming page to take its place
 */
export const applyOutgoingStyles = (element: HTMLElement): void => {
  element.style.position = "absolute";
  element.style.width = "100%";
  element.style.top = "0";
  element.style.left = "0";
};

/**
 * Wraps a transition config to automatically apply outgoing styles
 */
export const withOutgoingStyles = (
  getConfig: GetTransitionConfig
): GetTransitionConfig => {
  return (element) => {
    applyOutgoingStyles(element);
    return getConfig(element);
  };
};
