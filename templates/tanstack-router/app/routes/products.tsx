import { useMemo } from "react";
import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { Ssgoi } from "@ssgoi/react";
import { slide } from "@ssgoi/react/view-transitions";
import { SsgoiTransitionBoundary } from "../components/ssgoi-transition-boundary";
const categories = [
  {
    id: "all",
    label: "All",
    path: "/products/all",
  },
  {
    id: "electronics",
    label: "Tech",
    path: "/products/electronics",
  },
  {
    id: "fashion",
    label: "Fashion",
    path: "/products/fashion",
  },
  {
    id: "home",
    label: "Home",
    path: "/products/home",
  },
  {
    id: "beauty",
    label: "Beauty",
    path: "/products/beauty",
  },
];
function ProductsLayout() {
  const location = useRouterState({
    select: (s) => s.location,
  });
  const pathname = location.pathname;
  const config = useMemo(
    () => ({
      transitions: [
        {
          ordered: categories.map((category) => category.path),
          transition: slide(),
        },
      ],
    }),
    [],
  );
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      {/* Header - Fixed */}
      <div className="px-4 pt-6 pb-3 flex-shrink-0">
        <h1 className="text-sm font-medium text-white mb-1">Shop</h1>
        <p className="text-xs text-neutral-500">
          Discover our curated collection
        </p>
      </div>

      {/* Category Tabs - Fixed */}
      <div className="px-4 mb-4 flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.path}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${pathname === cat.path ? "bg-white text-black" : "bg-white/10 text-neutral-400 hover:bg-white/15"}`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Tab Content - Slide transitions here */}
      <div className="flex-1 overflow-hidden relative">
        <Ssgoi config={config}>
          <SsgoiTransitionBoundary className="min-h-full bg-[#121212]">
            <Outlet />
          </SsgoiTransitionBoundary>
        </Ssgoi>
      </div>
    </div>
  );
}
export const Route = createFileRoute("/products")({
  component: ProductsLayout,
});
