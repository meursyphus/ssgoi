const opacities = new WeakMap<
  HTMLElement,
  {
    value: string;
    priority: string;
    opacity: number;
    users: Set<{ value?: number }>;
  }
>();

/** Replacement transitions can claim an image before the old run cleans up. */
export function retainOpacity(element: HTMLElement): {
  opacity: number;
  set: (value: number) => void;
  restore: () => void;
} {
  const state = opacities.get(element) ?? {
    value: element.style.getPropertyValue("opacity"),
    priority: element.style.getPropertyPriority("opacity"),
    opacity:
      typeof getComputedStyle === "function"
        ? Number.parseFloat(getComputedStyle(element).opacity)
        : Number.NaN,
    users: new Set<{ value?: number }>(),
  };
  const lease: { value?: number } = {};
  state.users.add(lease);
  opacities.set(element, state);
  let released = false;
  return {
    opacity: Number.isFinite(state.opacity) ? state.opacity : 1,
    set: (value) => {
      lease.value = value;
      element.style.opacity = String(value);
    },
    restore: () => {
      if (released) return;
      released = true;
      state.users.delete(lease);
      if (state.users.size > 0) {
        // complete() can write an old track's final opacity after a replacement
        // has staged its first frame. Reassert the newest owner's staged value.
        const owners = Array.from(state.users);
        const latest = owners[owners.length - 1];
        if (latest?.value !== undefined)
          element.style.opacity = String(latest.value);
        return;
      }
      if (state.value)
        element.style.setProperty("opacity", state.value, state.priority);
      else element.style.removeProperty("opacity");
      opacities.delete(element);
    },
  };
}
