"use client";

import React, { useEffect } from "react";
import { products } from "./mock-data";
import { SsgoiTransition } from "@ssgoi/react";
import { useDemoRouter } from "../router-provider";

export default function ProductsDemo() {
  const router = useDemoRouter();

  // Prefetch all product detail pages on mount
  useEffect(() => {
    products.forEach((product) => {
      router.prefetch(`/demo/products/${product.id}`);
    });
  }, [router]);
  return (
    <SsgoiTransition id="/demo/products">
      <div className="min-h-screen bg-[#121212] px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-sm font-medium text-white mb-1">Shop</h1>
          <p className="text-xs text-neutral-500">
            Discover our curated collection
          </p>
        </div>

        {/* Products List */}
        <div className="space-y-3">
          {products.map((product) => (
            <article
              key={product.id}
              onClick={() => {
                // Navigate to product detail
                router.goto(`/demo/products/${product.id}`);
              }}
              className="border border-white/5 rounded-lg transition-all duration-200 hover:border-white/10 cursor-pointer"
            >
              {/* Product Image */}
              <div
                data-hero-key={product.id}
                className="relative aspect-[4/3] rounded-t-lg overflow-hidden"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover bg-[#111]"
                />
                {product.badge && (
                  <span
                    className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium uppercase ${
                      product.badge === "new"
                        ? "bg-white/10 text-white"
                        : product.badge === "sale"
                          ? "bg-white/10 text-white"
                          : "bg-white/10 text-white"
                    }`}
                  >
                    {product.badge}
                  </span>
                )}
                {/* Price overlay */}
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-medium text-white">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-neutral-400 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3 rounded-b-lg">
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex-1">
                    <span className="text-xs text-neutral-500 uppercase tracking-wide">
                      {product.category}
                    </span>
                    <h3 className="text-sm font-medium text-white mt-0.5 line-clamp-1">
                      {product.name}
                    </h3>
                  </div>
                  {/* Rating */}
                  <div className="flex items-center gap-0.5 text-xs">
                    <span className="text-neutral-400">★</span>
                    <span className="font-medium text-neutral-300">
                      {product.rating}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 line-clamp-2 mb-2">
                  {product.description}
                </p>

                {/* Stock status */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">
                    {product.reviews} reviews
                  </span>
                  {!product.inStock && (
                    <span className="text-xs text-neutral-400">
                      Out of stock
                    </span>
                  )}
                  {product.inStock && (
                    <span className="text-xs text-neutral-400">In stock</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SsgoiTransition>
  );
}
