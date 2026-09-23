import { onDestroy } from "svelte";
import { writable } from "svelte/store";

export const page = writable({
  url: new URL("https://example.test/projects/42"),
});
export const content = writable("Overview");
type Navigation = { to: { url: URL } | null };
const callbacks = new Set<(navigation: Navigation) => void | (() => void)>();

export function onNavigate(
  callback: (navigation: Navigation) => void | (() => void),
) {
  callbacks.add(callback);
  onDestroy(() => callbacks.delete(callback));
}

export function startNavigation(pathname: string) {
  const url = new URL(pathname, "https://example.test");
  const finish = [...callbacks].map((callback) => callback({ to: { url } }));
  return () => {
    page.set({ url });
    for (const callback of finish) callback?.();
  };
}
