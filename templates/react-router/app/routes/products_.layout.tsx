import React, { useMemo } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { Ssgoi } from "@ssgoi/react";
import { slide } from "@ssgoi/react/view-transitions";

const categories = [
  { id: "all", label: "All", path: "/products/all" },
  { id: "electronics", label: "Tech", path: "/products/electronics" },
  { id: "fashion", label: "Fashion", path: "/products/fashion" },
  { id: "home", label: "Home", path: "/products/home" },
  { id: "beauty", label: "Beauty", path: "/products/beauty" },
];

export default function ProductsLayout() {
  const location = useLocation();
  const pathname = location.pathname;

  const config = useMemo(
    () => ({
      transitions: [
        {
          from: "/products/tab/left",
          to: "/products/tab/right",
          transition: slide({ direction: "left" }),
        },
        {
          from: "/products/tab/right",
          to: "/products/tab/left",
          transition: slide({ direction: "right" }),
        },
      ],
      middleware: (from: string, to: string) => {
        const fromIndex = categories.findIndex((c) => c.path === from);
        const toIndex = categories.findIndex((c) => c.path === to);

        if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
          if (fromIndex < toIndex) {
            return { from: "/products/tab/left", to: "/products/tab/right" };
          } else {
            return { from: "/products/tab/right", to: "/products/tab/left" };
          }
        }

        return { from, to };
      },
    }),
    []
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
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                pathname === cat.path
                  ? "bg-white text-black"
                  : "bg-white/10 text-neutral-400 hover:bg-white/15"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Tab Content - Slide transitions here */}
      <div className="flex-1 overflow-hidden relative">
        <Ssgoi config={config}>
          <Outlet />
        </Ssgoi>
      </div>
    </div>
  );
}
