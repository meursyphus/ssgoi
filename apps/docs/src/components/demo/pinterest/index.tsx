"use client";

import React from "react";
import { pinterestItems } from "./mock-data";
import { SsgoiTransition } from "@meursyphus/ssgoi-react";

export default function PinterestDemo() {
  // Split items into two columns for masonry effect
  const leftColumnItems = pinterestItems.filter((_, index) => index % 2 === 0);
  const rightColumnItems = pinterestItems.filter((_, index) => index % 2 === 1);

  return (
    <SsgoiTransition id="/demo/pinterest">
      <div className="min-h-screen bg-gray-950 px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Gallery</h1>
          <p className="text-gray-400">Explore inspiring ideas and creativity</p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Left Column */}
          <div className="flex flex-col gap-3">
            {leftColumnItems.map((item) => (
              <PinCard key={item.id} item={item} />
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-3">
            {rightColumnItems.map((item) => (
              <PinCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </SsgoiTransition>
  );
}

interface PinCardProps {
  item: any;
}

function PinCard({ item }: PinCardProps) {
  return (
    <article 
      onClick={() => {
        // Navigate to pin detail
        window.location.href = `/demo/pinterest/${item.id}`;
      }}
      className="bg-gray-900 rounded-xl overflow-hidden transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-xl border border-gray-800 group cursor-pointer">
      {/* Image with dynamic aspect ratio */}
      <div className="relative" style={{ aspectRatio: item.aspectRatio }}>
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover bg-gray-800"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        
        {/* Save button */}
        <button className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700">
          Save
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2">
          {item.title}
        </h3>
        
        {/* Author info */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src={item.author.avatar}
            alt={item.author.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-xs text-gray-400">{item.author.name}</span>
        </div>

        {/* Stats and Category */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">{item.saves.toLocaleString()} saves</span>
          <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded-full">
            {item.category}
          </span>
        </div>
      </div>
    </article>
  );
}