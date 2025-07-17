"use client";

import React, { useState } from "react";
import { SsgoiTransition } from "@meursyphus/ssgoi-react";
import { getProduct } from "./mock-data";
import { useDemoRouter } from "../router-provider";

interface ProductDetailProps {
  onBack?: () => void;
}

export default function ProductDetail({ onBack }: ProductDetailProps) {
  const router = useDemoRouter();
  const currentPath = router.currentPath || '';
  // Extract productId from path: /demo/products/[id]
  const productId = currentPath.split('/').pop() || '';
  
  const product = getProduct(productId);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <SsgoiTransition id={`/demo/products/${productId}`}>
        <div className="min-h-screen bg-gray-950 px-4 py-8">
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
      <div className="min-h-screen bg-gray-950">
        {/* Back button */}
        <div className="px-4 py-4">
          <button
            onClick={onBack || (() => router.goto('/demo/products'))}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Back</span>
          </button>
        </div>

        {/* Product content */}
        <div className="px-4 pb-8">
          {/* Product image with hero transition */}
          <div data-hero-key={product.id} className="relative aspect-square rounded-xl overflow-hidden mb-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover bg-gray-800"
            />
            {product.badge && (
              <span
                className={`absolute top-4 left-4 px-3 py-1.5 rounded-md text-sm font-semibold uppercase ${
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

          {/* Product info */}
          <div>
            <span className="text-sm text-gray-500 uppercase tracking-wider">
              {product.category}
            </span>
            <h1 className="text-2xl font-bold text-white mt-2 mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-400 text-lg">★★★★★</span>
              <span className="font-semibold text-white">{product.rating}</span>
              <span className="text-gray-500 text-sm">({product.reviews} reviews)</span>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">{product.description}</p>

            {/* Price section */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-white">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                      -{discountPercentage}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Features */}
            {product.features && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="text-teal-400 mt-0.5">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Purchase section */}
            <div className="space-y-4">
              {product.inStock ? (
                <>
                  {/* Quantity selector */}
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400">Quantity:</span>
                    <div className="flex items-center border border-gray-700 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <button className="w-full py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-black transition-colors">
                    Add to Cart
                  </button>
                  <button className="w-full py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors">
                    Buy Now
                  </button>
                </>
              ) : (
                <>
                  <p className="text-center text-gray-500 font-medium mb-4">Out of Stock</p>
                  <button className="w-full py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
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