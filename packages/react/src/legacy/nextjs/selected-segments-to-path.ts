// TODO(8.0.0): remove this entry (deprecated in 7.5.0).

const INTERCEPTION_PREFIX = /^(?:\(\.\.\.\)|\(\.\.\)|\(\.\))+/;

/**
 * Turn a layout's selected slot into a route id. Pass the owning layout's
 * absolute base path for nested layouts. Interception markers are stripped;
 * this does not reconstruct an intercepted destination's relative ancestry.
 *
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from
 * "@ssgoi/react" with `<Ssgoi framework={...}>` instead.
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
