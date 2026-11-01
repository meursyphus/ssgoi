import { $ } from "@builder.io/qwik";
import { drill, fade, slide, zoom } from "@ssgoi/qwik/view-transitions";

export const PRODUCT_CATEGORIES = [
  { id: "all", label: "All", path: "/products/all" },
  { id: "electronics", label: "Tech", path: "/products/electronics" },
  { id: "fashion", label: "Fashion", path: "/products/fashion" },
  { id: "home", label: "Home", path: "/products/home" },
  { id: "beauty", label: "Beauty", path: "/products/beauty" },
];

// Pages under the bottom nav. `/products/**` (not `/products/*`) keeps every
// category in one scope: a `*` segment would make each category its own
// instance. Exported so the `$()` factory below can capture it.
export const TOP_LEVEL = ["/posts", "/products/**", "/pinterest", "/profile"];

export const ssgoiConfig$ = $(() => ({
  // Mirrors routes/: the (top-level) and (detail) groups, plus the products
  // layout nested inside (top-level).
  layouts: [
    { paths: TOP_LEVEL, layouts: [{ paths: "/products/**" }] },
    { paths: "/**", except: TOP_LEVEL },
  ],
  transitions: [
    { from: TOP_LEVEL, to: TOP_LEVEL, transition: fade() },
    {
      from: "/pinterest",
      to: "/pinterest/*",
      transition: zoom({ type: "expand" as const }),
    },
    { on: "/posts/**", except: "/posts", transition: drill() },
    {
      from: "/profile",
      to: "/profile/*",
      transition: zoom({ type: "static" as const }),
    },
    {
      ordered: [
        "/products/all",
        "/products/electronics",
        "/products/fashion",
        "/products/home",
        "/products/beauty",
      ],
      transition: slide(),
    },
  ],
}));
