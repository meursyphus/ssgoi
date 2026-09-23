"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SsgoiRouteBoundary } from "@ssgoi/react/nextjs";
import { PRODUCT_CATEGORIES } from "@/components/ssgoi-config";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SsgoiRouteBoundary
      routeKey="products-layout"
      className="min-h-screen bg-[#121212] flex flex-col"
    >
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
          {PRODUCT_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.path}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${pathname === cat.path ? "bg-white text-black" : "bg-white/10 text-neutral-400 hover:bg-white/15"}`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Tab Content - Slide transitions here */}
      <div className="flex-1 overflow-hidden relative">
        <SsgoiRouteBoundary className="min-h-full bg-[#121212]">
          {children}
        </SsgoiRouteBoundary>
      </div>
    </SsgoiRouteBoundary>
  );
}
