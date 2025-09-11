"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface ShowcaseCardProps {
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  tags?: string[];
}

export function ShowcaseCard({
  title,
  description,
  url,
  thumbnail,
  tags = [],
}: ShowcaseCardProps) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 transition-all hover:border-zinc-700 hover:shadow-xl hover:shadow-black/20"
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-zinc-800">
        <Image
          src={thumbnail}
          alt={title}
          width={800}
          height={500}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <div className="p-6">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-100 group-hover:text-orange-400 transition-colors">
            {title}
          </h3>
          <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        
        <p className="mb-4 text-sm text-gray-400 line-clamp-2">
          {description}
        </p>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-block rounded-full bg-zinc-800 px-3 py-1 text-xs text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
    </Link>
  );
}