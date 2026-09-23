const INTERCEPTION_PREFIX = /^(?:\(\.\.\.\)|\(\.\.\)|\(\.\))+/;

/**
 * Turn a layout's selected slot into a route id. Pass the owning layout's
 * absolute base path for nested layouts. Interception markers are stripped;
 * this does not reconstruct an intercepted destination's relative ancestry.
 */
export function selectedSegmentsToPath(
  segments: readonly string[],
  basePath = "/",
): string {
  const path = segments
    .filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")))
    .map((segment) => segment.replace(INTERCEPTION_PREFIX, ""))
    .filter(Boolean)
    .join("/");
  return `${basePath.replace(/\/$/, "")}/${path}`.replace(/\/$/, "") || "/";
}
