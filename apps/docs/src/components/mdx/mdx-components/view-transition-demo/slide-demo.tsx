"use client";

import React, { useState, useLayoutEffect, useRef } from "react";
import { slide } from "@ssgoi/react/view-transitions";
import { motion } from "framer-motion";
import {
  BrowserMockup,
  DemoPage,
  DemoLink,
  useBrowserNavigation,
} from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";

// Clothing Page
function ClothingPage() {
  const products = [
    { id: 1, name: "Classic White Tee", price: "$29", image: "👔" },
    { id: 2, name: "Denim Jacket", price: "$79", image: "🧥" },
    { id: 3, name: "Summer Dress", price: "$59", image: "👗" },
    { id: 4, name: "Wool Sweater", price: "$89", image: "🧶" },
    { id: 5, name: "Casual Shirt", price: "$45", image: "👔" },
    { id: 6, name: "Winter Coat", price: "$199", image: "🧥" },
  ];

  return (
    <DemoPage path="/clothing">
      <div className="h-full bg-white">
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Clothing</h2>
            <span className="text-sm text-gray-500">{products.length} items</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-shadow">
                <div className="bg-blue-50 rounded-lg h-24 md:h-32 flex items-center justify-center mb-3">
                  <span className="text-3xl md:text-4xl">{product.image}</span>
                </div>
                <h3 className="font-medium text-sm text-gray-900 mb-1">{product.name}</h3>
                <p className="text-lg font-bold text-gray-900">{product.price}</p>
                <button className="mt-2 w-full bg-blue-600 text-white text-sm py-1.5 rounded hover:bg-blue-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Shoes Page
function ShoesPage() {
  const products = [
    { id: 1, name: "Running Sneakers", price: "$89", image: "👟", tag: "New" },
    { id: 2, name: "Canvas Sneakers", price: "$59", image: "👟" },
    { id: 3, name: "Leather Boots", price: "$159", image: "👢" },
    { id: 4, name: "High Heels", price: "$99", image: "👠" },
    { id: 5, name: "Sandals", price: "$39", image: "👡" },
    { id: 6, name: "Loafers", price: "$79", image: "👞" },
  ];

  return (
    <DemoPage path="/shoes">
      <div className="h-full bg-white">
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Shoes</h2>
            <span className="text-sm text-gray-500">{products.length} items</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-shadow relative">
                {product.tag && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    {product.tag}
                  </span>
                )}
                <div className="bg-green-50 rounded-lg h-24 md:h-32 flex items-center justify-center mb-3">
                  <span className="text-3xl md:text-4xl">{product.image}</span>
                </div>
                <h3 className="font-medium text-sm text-gray-900 mb-1">{product.name}</h3>
                <p className="text-lg font-bold text-gray-900">{product.price}</p>
                <button className="mt-2 w-full bg-green-600 text-white text-sm py-1.5 rounded hover:bg-green-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Accessories Page
function AccessoriesPage() {
  const products = [
    { id: 1, name: "Smart Watch", price: "$299", image: "⌚", tag: "Hot" },
    { id: 2, name: "Sunglasses", price: "$149", image: "🕶️" },
    { id: 3, name: "Baseball Cap", price: "$29", image: "🧢" },
    { id: 4, name: "Leather Belt", price: "$59", image: "👔" },
    { id: 5, name: "Scarf", price: "$39", image: "🧣" },
    { id: 6, name: "Necklace", price: "$89", image: "📿" },
    { id: 7, name: "Leather Backpack", price: "$159", image: "🎒" },
    { id: 8, name: "Crossbody Bag", price: "$89", image: "👜" },
  ];

  return (
    <DemoPage path="/accessories">
      <div className="h-full bg-white">
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Accessories</h2>
            <span className="text-sm text-gray-500">{products.length} items</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-shadow relative">
                {product.tag && (
                  <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    {product.tag}
                  </span>
                )}
                <div className="bg-orange-50 rounded-lg h-24 md:h-32 flex items-center justify-center mb-3">
                  <span className="text-3xl md:text-4xl">{product.image}</span>
                </div>
                <h3 className="font-medium text-sm text-gray-900 mb-1">{product.name}</h3>
                <p className="text-lg font-bold text-gray-900">{product.price}</p>
                <button className="mt-2 w-full bg-orange-600 text-white text-sm py-1.5 rounded hover:bg-orange-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Route configuration with tab navigation
const slideRoutes: RouteConfig[] = [
  { path: "/clothing", component: ClothingPage, label: "Clothing" },
  { path: "/shoes", component: ShoesPage, label: "Shoes" },
  { path: "/accessories", component: AccessoriesPage, label: "Accessories" },
];

// Custom layout with tab navigation
function SlideLayout({ children }: { children: React.ReactNode }) {
  const { currentPath, navigate } = useBrowserNavigation();

  return (
    <div className="h-full bg-gray-100 p-4 md:p-6">
      {/* App Container */}
      <div className="h-full max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        {/* App Header */}
        <div className="bg-white px-4 py-3 md:px-6 md:py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 text-lg md:text-xl font-bold">
                Shop Collection
              </h1>
              <p className="text-gray-500 text-xs md:text-sm mt-0.5">
                2024 Summer Collection
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation inside the app */}
        <div className="bg-gray-50 border-b border-gray-200">
          <nav className="flex">
            <div className="flex w-full">
              {slideRoutes.map((route, index) => {
                const isActive = currentPath === route.path;
                return (
                  <div key={route.path} className="relative flex-1">
                    <button
                      onClick={() => navigate(route.path)}
                      className={`
                        w-full py-3 md:py-3.5 text-sm md:text-base font-medium
                        transition-colors duration-200
                        ${
                          isActive
                            ? "text-blue-600"
                            : "text-gray-600 hover:text-gray-900"
                        }
                      `}
                    >
                      <span className="relative z-10">{route.label}</span>
                    </button>
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                        layoutId="tabUnderline"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Content Area with relative positioning for transitions */}
        <div
          className="flex-1 overflow-hidden bg-gray-50"
          style={{ height: "calc(100% - 140px)" }}
        >
          <div className="relative h-full z-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function SlideDemo() {
  // Create middleware to determine slide direction based on route order
  const createSlideMiddleware = () => {
    const routeOrder = slideRoutes.map((r) => r.path);

    return (from: string, to: string) => {
      const fromIndex = routeOrder.indexOf(from);
      const toIndex = routeOrder.indexOf(to);

      if (fromIndex !== -1 && toIndex !== -1) {
        if (fromIndex < toIndex) {
          // Going right (forward in tab order)
          return { from: "/nav/left", to: "/nav/right" };
        } else {
          // Going left (backward in tab order)
          return { from: "/nav/right", to: "/nav/left" };
        }
      }

      return { from, to };
    };
  };

  const config = {
    transitions: [
      {
        from: "/nav/left",
        to: "/nav/right",
        transition: slide({
          direction: "left",
        }),
      },
      {
        from: "/nav/right",
        to: "/nav/left",
        transition: slide({
          direction: "right",
        }),
      },
    ],
    middleware: createSlideMiddleware(),
  };

  return (
    <BrowserMockup routes={slideRoutes} config={config} layout={SlideLayout} />
  );
}
