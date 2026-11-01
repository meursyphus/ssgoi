import type { SsgoiConfig } from "@ssgoi/react";
import { drill, fade, slide, zoom } from "@ssgoi/react/view-transitions";

export const PRODUCT_CATEGORIES = [
  { id: "all", label: "All", path: "/products/all" },
  { id: "electronics", label: "Tech", path: "/products/electronics" },
  { id: "fashion", label: "Fashion", path: "/products/fashion" },
  { id: "home", label: "Home", path: "/products/home" },
  { id: "beauty", label: "Beauty", path: "/products/beauty" },
] as const;

// Bottom-nav tabs, including every product category.
const TOP_LEVEL = ["/posts", "/products/**", "/pinterest", "/profile"];

export const ssgoiConfig = {
  // Mirrors the pathless layout routes: depth 0 picks top level vs detail, depth 1 is
  // the boundary inside each group, and the products scope gives its
  // category tabs their own depth-2 boundary.
  layouts: [
    { paths: TOP_LEVEL, layouts: [{ paths: "/products/**" }] },
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
    // The exact category paths above outrank `/products/**` here.
    {
      from: TOP_LEVEL,
      to: TOP_LEVEL,
      transition: fade(),
    },
  ],
} satisfies SsgoiConfig;
