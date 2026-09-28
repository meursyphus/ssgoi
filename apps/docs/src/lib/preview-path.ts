/**
 * How showcase preview paths are compared: pathname + search, no hash, no
 * trailing slash. Shared by the frame bridge (inside the iframe) and the
 * preview scheduler/tours (the embedding page).
 */
export function framePath(path: string): string {
  const q = path.search(/[?#]/);
  const pathname = q < 0 ? path : path.slice(0, q);
  const rest = q < 0 ? "" : path.slice(q).replace(/#.*$/, "");
  const trimmed =
    pathname.length > 1 ? pathname.replace(/\/+$/, "") || "/" : pathname;
  return canonical(trimmed) + (rest === "?" ? "" : canonical(rest));
}

/** One spelling per URL: "/search/여자" and "/search/%EC%97%AC%EC%9E%90" agree. */
function canonical(part: string) {
  try {
    return encodeURI(decodeURI(part));
  } catch {
    return part;
  }
}

export function samePath(
  a: string | null | undefined,
  b: string | null | undefined,
) {
  if (a == null || b == null) return false;
  return framePath(a) === framePath(b);
}

/** True when `path` is `origin` itself or below it. */
export function isUnderOrigin(path: string, origin: string): boolean {
  const p = framePath(path);
  const o = framePath(origin);
  if (o === "/") return p.startsWith("/");
  return p === o || p.startsWith(`${o}/`) || p.startsWith(`${o}?`);
}
