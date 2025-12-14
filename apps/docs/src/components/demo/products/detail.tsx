"use client";

import React, { useState } from "react";
import { SsgoiTransition } from "@ssgoi/react";
import { getProduct } from "./mock-data";
import { useDemoRouter } from "../router-provider";

interface ProductDetailProps {
  onBack?: () => void;
}

export default function ProductDetail({ onBack }: ProductDetailProps) {
  const router = useDemoRouter();
  const currentPath = router.currentPath || "";
  // Extract productId from path: /demo/products/[id]
  const productId = currentPath.split("/").pop() || "";

  const product = getProduct(productId);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <SsgoiTransition id={`/demo/products/${productId}`}>
        <div className="min-h-screen bg-[#121212] px-4 py-8">
          <p className="text-gray-400">Product not found</p>
        </div>
      </SsgoiTransition>
    );
  }

  const discountPercentage = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <SsgoiTransition id={`/demo/products/${productId}`}>
      <div className="min-h-screen bg-[#121212]">
        {/* Back button */}
        <div className="px-4 py-4">
          <button
            onClick={onBack || (() => router.goto("/demo/products"))}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-xs"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
        </div>

        {/* Product content */}
        <div className="px-4 pb-6">
          {/* Product image with hero transition */}
          <div
            data-hero-key={product.id}
            className="relative aspect-square rounded-lg overflow-hidden mb-4"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover bg-[#111]"
            />
            {product.badge && (
              <span
                className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium uppercase bg-white/10 text-white`}
              >
                {product.badge}
              </span>
            )}
          </div>

          {/* Product info */}
          <div>
            <span className="text-xs text-neutral-500 uppercase tracking-wide">
              {product.category}
            </span>
            <h1 className="text-base font-medium text-white mt-1 mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-neutral-400 text-xs">★★★★★</span>
              <span className="text-xs font-medium text-white">
                {product.rating}
              </span>
              <span className="text-neutral-500 text-xs">
                ({product.reviews} reviews)
              </span>
            </div>

            <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
              {product.description}
            </p>

            {/* Price section */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-white">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-sm text-neutral-500 line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="bg-white/10 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                      -{discountPercentage}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Features */}
            {product.features && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white mb-2">
                  Key Features
                </h3>
                <ul className="space-y-1">
                  {product.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-neutral-300 text-xs"
                    >
                      <span className="text-neutral-500 mt-0.5">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Purchase section */}
            <div className="space-y-3">
              {product.inStock ? (
                <>
                  {/* Quantity selector */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-400">Quantity:</span>
                    <div className="flex items-center border border-white/10 rounded">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-xs font-medium text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/5 transition-colors text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <button className="w-full py-2.5 border border-white/10 text-white rounded text-xs font-medium hover:bg-white/5 transition-colors">
                    Add to Cart
                  </button>
                  <button className="w-full py-2.5 bg-white text-black rounded text-xs font-medium hover:bg-neutral-200 transition-colors">
                    Buy Now
                  </button>
                </>
              ) : (
                <>
                  <p className="text-center text-neutral-500 text-xs mb-3">
                    Out of Stock
                  </p>
                  <button className="w-full py-2.5 bg-white/5 text-neutral-300 rounded text-xs font-medium hover:bg-white/10 transition-colors">
                    Notify When Available
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </SsgoiTransition>
  );
}
