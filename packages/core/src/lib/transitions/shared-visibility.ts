const hiddenPreviews = new WeakMap<
  HTMLElement,
  { opacity: string; users: number }
>();

export function hideSharedElement(preview: HTMLElement): () => void {
  const state = hiddenPreviews.get(preview) ?? {
    opacity: preview.style.opacity,
    users: 0,
  };
  state.users++;
  hiddenPreviews.set(preview, state);
  preview.style.opacity = "0";

  // A replacement transition is created before the previous run completes.
  // Share the original opacity so that old cleanup neither reveals a preview
  // still in use nor leaves a reused/cached card permanently transparent.
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--state.users > 0) return;
    if (preview.style.opacity === "0") preview.style.opacity = state.opacity;
    hiddenPreviews.delete(preview);
  };
}
