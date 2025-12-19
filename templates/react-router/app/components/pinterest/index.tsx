import React from "react";
import { Link } from "react-router";
import { pinterestItems, PinterestItem } from "./mock-data";
import { SsgoiTransition } from "@ssgoi/react";

export default function PinterestDemo() {
  // Split items into two columns for masonry effect
  const leftColumnItems = pinterestItems.filter((_, index) => index % 2 === 0);
  const rightColumnItems = pinterestItems.filter((_, index) => index % 2 === 1);

  return (
    <SsgoiTransition id="/pinterest">
      <div className="min-h-screen bg-[#121212] px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-sm font-medium text-white mb-1">Gallery</h1>
          <p className="text-xs text-neutral-500">
            Explore inspiring ideas and creativity
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Left Column */}
          <div className="flex flex-col gap-2">
            {leftColumnItems.map((item) => (
              <PinCard key={item.id} item={item} />
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-2">
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
  item: PinterestItem;
}

function PinCard({ item }: PinCardProps) {
  return (
    <Link
      to={`/pinterest/${item.id}`}
      className="block border border-white/5 rounded-lg overflow-hidden transition-all duration-200 hover:border-white/10 group"
    >
      {/* Image with dynamic aspect ratio */}
      <div className="relative" style={{ aspectRatio: item.aspectRatio }}>
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover bg-[#111]"
          data-pinterest-gallery-key={item.id}
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        {/* Save button */}
        <button className="absolute top-2 right-2 bg-white/10 text-white px-2 py-0.5 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/20">
          Save
        </button>
      </div>

      {/* Content */}
      <div className="p-2.5">
        <h3 className="font-medium text-white text-xs mb-1.5 line-clamp-2">
          {item.title}
        </h3>

        {/* Author info */}
        <div className="flex items-center gap-1.5 mb-2">
          <img
            src={item.author.avatar}
            alt={item.author.name}
            className="w-4 h-4 rounded-full"
          />
          <span className="text-xs text-neutral-400">{item.author.name}</span>
        </div>

        {/* Stats and Category */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-500">
            {item.saves.toLocaleString()} saves
          </span>
          <span className="px-1.5 py-0.5 bg-white/5 text-neutral-400 rounded">
            {item.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
