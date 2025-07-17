"use client";

import React from "react";
import { products } from "./mock-data";
import { SsgoiTransition } from "@meursyphus/ssgoi-react";
import { useDemoRouter } from "../router-provider";

export default function ProductsDemo() {
  const router = useDemoRouter();
  return (
    <SsgoiTransition id="/demo/products">
      <div className="min-h-screen bg-gray-950 px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Shop</h1>
          <p className="text-gray-400">Discover our curated collection</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <article
              key={product.id}
              onClick={() => {
                // Navigate to product detail
                router.goto(`/demo/products/${product.id}`);
              }}
              className="bg-gray-900 rounded-xl overflow-hidden transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-xl border border-gray-800 cursor-pointer"
            >
              {/* Product Image */}
              <div className="relative aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover bg-gray-800"
                />
                {product.badge && (
                  <span
                    className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-semibold uppercase ${
                      product.badge === 'new'
                        ? 'bg-teal-500 text-white'
                        : product.badge === 'sale'
                        ? 'bg-red-500 text-white'
                        : 'bg-yellow-400 text-gray-900'
                    }`}
                  >
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3 sm:p-4">
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  {product.category}
                </span>
                <h3 className="text-sm sm:text-base font-semibold text-white mt-1 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                <p className="hidden sm:block text-xs text-gray-400 line-clamp-2 mb-3">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 text-xs mb-3">
                  <span className="text-yellow-400">★★★★★</span>
                  <span className="font-semibold text-white">
                    {product.rating}
                  </span>
                  <span className="text-gray-500">({product.reviews})</span>
                </div>

                {/* Price Section */}
                <div className="flex justify-between items-center">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-white">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  {!product.inStock && (
                    <span className="text-xs text-gray-500 font-medium">
                      Out of stock
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