"use client";

import { ShowcaseCard } from "./showcase-card";
import { showcaseData, type ShowcaseItem } from "./showcase-data";
import { GitPullRequest } from "lucide-react";
import Link from "next/link";

export function ShowcaseGrid() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-100">
          Showcase
        </h1>
        <p className="mb-6 text-lg text-gray-400">
          Discover amazing websites built with SSGOI
        </p>
        
        <div className="mx-auto max-w-2xl rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <GitPullRequest className="h-5 w-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-gray-100">
              Add Your Site
            </h3>
          </div>
          <p className="mb-4 text-sm text-gray-400">
            Have you built something amazing with SSGOI? We'd love to feature it here!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="https://github.com/meursyphus/ssgoi/blob/main/apps/docs/src/components/showcase/showcase-data.ts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
            >
              Submit Your Site via PR
            </Link>
            <span className="text-sm text-gray-500">
              Edit showcase-data.ts
            </span>
          </div>
        </div>
      </div>

      {showcaseData.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 p-12 text-center">
          <p className="mb-2 text-lg font-medium text-gray-300">
            No sites yet
          </p>
          <p className="text-sm text-gray-500">
            Be the first to showcase your site built with SSGOI!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {showcaseData.map((item: ShowcaseItem) => (
            <ShowcaseCard
              key={item.id}
              title={item.title}
              description={item.description}
              url={item.url}
              thumbnail={item.thumbnail}
              tags={item.tags}
            />
          ))}
        </div>
      )}
    </div>
  );
}