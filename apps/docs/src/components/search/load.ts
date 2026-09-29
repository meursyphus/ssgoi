/*
 * The palette is a lazy chunk. It is preloaded on idle and whenever a trigger
 * shows intent (hover, focus, pointerdown), so by the time a tap lands the
 * dialog can mount and focus its input inside the same user gesture — iOS
 * only opens the keyboard for a focus() that happens within the gesture.
 */
type DialogModule = typeof import("./search-dialog");

let dialog: Promise<DialogModule> | null = null;
let loaded = false;

export function loadSearchDialog(): Promise<DialogModule> {
  dialog ??= import("./search-dialog").then(
    (mod) => {
      loaded = true;
      return mod;
    },
    (error: unknown) => {
      dialog = null;
      throw error;
    },
  );
  return dialog;
}

export function isSearchDialogLoaded() {
  return loaded;
}

/** Intent: fetch the chunk and the index. */
export function preloadSearch() {
  loadSearchDialog()
    .then((mod) => mod.preloadSearchIndex())
    .catch(() => {});
}

/**
 * The chunk is not there yet: park focus in an off-screen input during the
 * tap so iOS raises the keyboard, and let the palette input take it over.
 */
export function holdKeyboard() {
  const proxy = document.createElement("input");
  proxy.setAttribute("aria-hidden", "true");
  proxy.tabIndex = -1;
  proxy.style.cssText =
    "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px;pointer-events:none;";
  document.body.appendChild(proxy);
  proxy.focus({ preventScroll: true });
  const remove = () => proxy.remove();
  proxy.addEventListener("blur", remove, { once: true });
  window.setTimeout(remove, 4000);
}

let opener: HTMLElement | null = null;

/**
 * Every control that opens the palette records itself here (the hotkeys
 * record whatever had focus), and the palette hands focus back to it when it
 * closes. `document.activeElement` alone can't say: Safari doesn't focus a
 * button it clicks.
 */
export function setOpener(element: Element | null) {
  opener =
    element instanceof HTMLElement && element !== document.body
      ? element
      : null;
}

export function getOpener() {
  return opener;
}
