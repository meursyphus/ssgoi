import type { SsgoiConfig } from "@ssgoi/react";
import { drill, fade, slide, zoom } from "@ssgoi/react/view-transitions";

export const PRODUCT_CATEGORIES = [
  { id: "all", label: "All", path: "/shop" },
  { id: "electronics", label: "Tech", path: "/shop/electronics" },
  { id: "fashion", label: "Fashion", path: "/shop/fashion" },
  { id: "home", label: "Home", path: "/shop/home" },
  { id: "beauty", label: "Beauty", path: "/shop/beauty" },
] as const;

// Bottom-nav tabs, including every product category.
const TOP_LEVEL = ["/posts", "/shop/**", "/pinterest", "/profile"];

export const ssgoiConfig = {
  // Mirrors the route groups: depth 0 picks top level vs detail, depth 1 is
  // the boundary inside each group, and the shop scope gives its
  // category tabs their own depth-2 boundary.
  layouts: [
    { paths: TOP_LEVEL, layouts: [{ paths: "/shop/**" }] },
    { paths: "/**", except: TOP_LEVEL },
  ],
  transitions: [
    {
      from: "/pinterest",
      to: "/pinterest/*",
      transition: zoom({ type: "expand" }),
    },
    {
      on: "/posts/**",
      except: "/posts",
      transition: drill(),
    },
    {
      from: "/profile",
      to: "/profile/*",
      transition: zoom({ type: "static" }),
    },
    {
      ordered: PRODUCT_CATEGORIES.map((category) => category.path),
      transition: slide(),
    },
    // Tab <-> tab: only the depth-1 content fades; the bottom nav stays.
    // The exact category paths above outrank `/shop/**` here.
    {
      from: TOP_LEVEL,
      to: TOP_LEVEL,
      transition: fade(),
    },
  ],
} satisfies SsgoiConfig;
