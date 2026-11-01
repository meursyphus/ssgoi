import { $ } from "@builder.io/qwik";
import { drill, fade, slide, zoom } from "@ssgoi/qwik/view-transitions";

export const SHOP_CATEGORIES = [
  { id: "all", label: "All", path: "/shop" },
  { id: "electronics", label: "Tech", path: "/shop/electronics" },
  { id: "fashion", label: "Fashion", path: "/shop/fashion" },
  { id: "home", label: "Home", path: "/shop/home" },
  { id: "beauty", label: "Beauty", path: "/shop/beauty" },
];

// Pages under the bottom nav. `/shop/**` (not `/shop/*`) keeps every
// category in one scope: a `*` segment would make each category its own
// instance. Exported so the `$()` factory below can capture it.
export const TOP_LEVEL = ["/posts", "/shop/**", "/pinterest", "/profile"];

export const ssgoiConfig$ = $(() => ({
  // Mirrors routes/: the (top-level) and (detail) groups, plus the shop layout
  // nested inside (top-level).
  layouts: [
    { paths: TOP_LEVEL, layouts: [{ paths: "/shop/**" }] },
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
        "/shop",
        "/shop/electronics",
        "/shop/fashion",
        "/shop/home",
        "/shop/beauty",
      ],
      transition: slide(),
    },
  ],
}));
