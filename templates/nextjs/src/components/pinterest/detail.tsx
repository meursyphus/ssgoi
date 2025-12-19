"use client";

import React from "react";
import Link from "next/link";
import { SsgoiTransition } from "@ssgoi/react";
import { getPinterestItem } from "./mock-data";

interface PinterestDetailProps {
  pinId: string;
}

export default function PinterestDetail({ pinId }: PinterestDetailProps) {
  const item = getPinterestItem(pinId);

  if (!item) {
    return (
      <SsgoiTransition id={`/pinterest/${pinId}`}>
        <div className="min-h-screen bg-[#121212] px-4 py-8">
          <p className="text-gray-400">Pin not found</p>
        </div>
      </SsgoiTransition>
    );
  }

  return (
    <SsgoiTransition id={`/pinterest/${pinId}`}>
      <div className="min-h-screen bg-[#121212]">
        {/* Back button */}
        <div className="px-4 py-4">
          <Link
            href="/pinterest"
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
          </Link>
        </div>

        {/* Pin content */}
        <div className="px-4 pb-6">
          {/* Pin image with hero transition */}
          <img
            className="w-full rounded-lg mb-4"
            src={item.image}
            alt={item.title}
            style={{ aspectRatio: item.aspectRatio }}
            data-pinterest-detail-key={item.id}
          />

          <div>
            <h1 className="text-base font-medium text-white mb-3">
              {item.title}
            </h1>
            <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
              {item.content}
            </p>

            {/* Category and saves */}
            <div className="flex justify-between items-center mb-3">
              <span className="px-2 py-0.5 bg-white/5 text-neutral-400 rounded text-xs">
                {item.category}
              </span>
              <span className="text-neutral-500 text-xs">
                {item.saves.toLocaleString()} saves
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-neutral-400 bg-white/5 px-2 py-0.5 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Ingredients/Materials/Steps */}
            {item.ingredients && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white mb-2">
                  Ingredients
                </h3>
                <ul className="space-y-1">
                  {item.ingredients.map((ingredient, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-neutral-300 text-xs"
                    >
                      <span className="text-neutral-500 mt-0.5">•</span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.materials && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white mb-2">
                  Materials
                </h3>
                <ul className="space-y-1">
                  {item.materials.map((material, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-neutral-300 text-xs"
                    >
                      <span className="text-neutral-500 mt-0.5">•</span>
                      <span>{material}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.steps && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white mb-2">Steps</h3>
                <ol className="space-y-2">
                  {item.steps.map((step, index) => (
                    <li
                      key={index}
                      className="flex gap-2 text-neutral-300 text-xs"
                    >
                      <span className="flex-shrink-0 w-5 h-5 bg-white/10 text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Author info */}
            <div className="flex items-center gap-3 p-3 border border-white/5 rounded-lg">
              <img
                src={item.author.avatar}
                alt={item.author.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="text-xs font-medium text-white">
                  {item.author.name}
                </div>
                <div className="text-xs text-neutral-400 mb-0.5">
                  {item.author.bio}
                </div>
                <div className="text-xs text-neutral-500">
                  {item.author.followers.toLocaleString()} followers
                </div>
              </div>
              <button className="px-3 py-1.5 bg-white text-black rounded-full text-xs font-medium hover:bg-neutral-200 transition-colors">
                Follow
              </button>
            </div>
          </div>
        </div>
      </div>
    </SsgoiTransition>
  );
}
