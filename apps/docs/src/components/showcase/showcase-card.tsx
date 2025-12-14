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
      className="group block overflow-hidden rounded-lg border border-white/5 bg-white/[0.02] transition-all hover:border-white/10"
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-900">
        <Image
          src={thumbnail}
          alt={title}
          width={800}
          height={500}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-sm font-medium text-white group-hover:text-neutral-300 transition-colors">
            {title}
          </h3>
          <ExternalLink className="h-3.5 w-3.5 text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        <p className="mb-3 text-xs text-neutral-500 line-clamp-2">
          {description}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-block rounded px-2 py-0.5 text-[10px] text-neutral-400 bg-white/5 border border-white/5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
