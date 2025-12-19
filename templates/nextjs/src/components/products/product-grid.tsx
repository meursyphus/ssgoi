"use client";

import React from "react";
import { SsgoiTransition } from "@ssgoi/react";
import { Product } from "./mock-data";

interface ProductGridProps {
  products: Product[];
  category: string;
}

export default function ProductGrid({ products, category }: ProductGridProps) {
  return (
    <SsgoiTransition id={`/products/${category}`}>
      <div className="px-4 pb-6 h-full overflow-y-auto">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500 text-sm">
              No products in this category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </SsgoiTransition>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="block bg-white/5 rounded-xl overflow-hidden">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.badge && (
          <span
            className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
              product.badge === "sale"
                ? "bg-red-500/90 text-white"
                : product.badge === "new"
                ? "bg-blue-500/90 text-white"
                : "bg-amber-500/90 text-black"
            }`}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        <span className="text-[10px] text-neutral-500 uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="text-xs font-medium text-white mt-0.5 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-sm font-semibold text-white">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-[10px] text-neutral-500 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1.5 text-[10px] text-neutral-400">
          <span className="text-amber-400">★</span>
          <span>{product.rating}</span>
          <span className="text-neutral-600">·</span>
          <span>{product.reviews} reviews</span>
        </div>
      </div>
    </div>
  );
}
