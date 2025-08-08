"use client";

import React, { useEffect } from "react";
import { products } from "./mock-data";
import { SsgoiTransition } from "@ssgoi/react";
import { useDemoRouter } from "../router-provider";

export default function ProductsDemo() {
  const router = useDemoRouter();

  // Prefetch all product detail pages on mount
  useEffect(() => {
    products.forEach(product => {
      router.prefetch(`/demo/products/${product.id}`);
    });
  }, []);
  return (
    <SsgoiTransition id="/demo/products">
      <div className="min-h-screen bg-gray-950 px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Shop</h1>
          <p className="text-gray-400">Discover our curated collection</p>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {products.map((product) => (
            <article
              key={product.id}
              onClick={() => {
                // Navigate to product detail
                router.goto(`/demo/products/${product.id}`);
              }}
              className="bg-gray-900 rounded-xl transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-xl cursor-pointer"
            >
              {/* Product Image */}
              <div data-hero-key={product.id} className="relative aspect-[4/3] rounded-t-xl overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover bg-gray-800"
                />
                {product.badge && (
                  <span
                    className={`absolute top-4 left-4 px-3 py-1.5 rounded-md text-sm font-semibold uppercase ${
                      product.badge === "new"
                        ? "bg-teal-500 text-white"
                        : product.badge === "sale"
                          ? "bg-red-500 text-white"
                          : "bg-yellow-400 text-gray-900"
                    }`}
                  >
                    {product.badge}
                  </span>
                )}
                {/* Price overlay */}
                <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-white">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 rounded-b-xl">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <h3 className="text-lg font-semibold text-white mt-1 line-clamp-1">
                      {product.name}
                    </h3>
                  </div>
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-yellow-400">★</span>
                    <span className="font-semibold text-white">
                      {product.rating}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                  {product.description}
                </p>

                {/* Stock status */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {product.reviews} reviews
                  </span>
                  {!product.inStock && (
                    <span className="text-xs text-red-400 font-medium">
                      Out of stock
                    </span>
                  )}
                  {product.inStock && (
                    <span className="text-xs text-teal-400 font-medium">
                      In stock
                    </span>
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
