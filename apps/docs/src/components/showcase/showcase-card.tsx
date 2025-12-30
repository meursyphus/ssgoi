"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import type { ShowcaseItem } from "./showcase-data";

interface ShowcaseCardProps {
  item: ShowcaseItem;
  index: number;
  onClick: () => void;
}

export function ShowcaseCard({ item, index, onClick }: ShowcaseCardProps) {
  const {
    title,
    description,
    thumbnail,
    tags = [],
    framework,
    featured,
  } = item;

  return (
    <button
      onClick={onClick}
      className="group relative block w-full text-left overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] focus:outline-none focus:ring-2 focus:ring-white/20"
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded text-[9px] uppercase tracking-wider text-white/80">
          Featured
        </div>
      )}

      {/* Index Number */}
      <div className="absolute top-3 right-3 z-10 text-[10px] font-mono text-white/30">
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized={thumbnail.endsWith(".gif")}
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
            <div className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full text-xs font-medium">
              <Play className="w-3 h-3 fill-current" />
              View Project
            </div>
          </div>
        </div>

        {/* GIF Indicator */}
        {thumbnail.endsWith(".gif") && (
          <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[9px] uppercase tracking-wider text-white/70">
            GIF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title & Framework */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-medium text-white group-hover:text-neutral-200 transition-colors truncate">
            {title}
          </h3>
          {framework && (
            <span className="shrink-0 text-[10px] text-neutral-500 bg-white/5 px-2 py-0.5 rounded">
              {framework}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-neutral-500 line-clamp-2 mb-3">
          {description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-0.5 text-[10px] text-neutral-400 bg-white/5 border border-white/5 rounded"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="inline-block px-2 py-0.5 text-[10px] text-neutral-500">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
