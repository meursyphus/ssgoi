"use client";

import React from "react";
import { SsgoiTransition } from "@meursyphus/ssgoi-react";
import { getPinterestItem } from "./mock-data";
import { useDemoRouter } from "../router-provider";

interface PinterestDetailProps {
  onBack?: () => void;
}

export default function PinterestDetail({ onBack }: PinterestDetailProps) {
  const router = useDemoRouter();
  const currentPath = router.currentPath || '';
  // Extract pinId from path: /demo/pinterest/[id]
  const pinId = currentPath.split('/').pop() || '';
  
  const item = getPinterestItem(pinId);

  if (!item) {
    return (
      <SsgoiTransition id={`/demo/pinterest/${pinId}`}>
        <div className="min-h-screen bg-gray-950 px-4 py-8">
          <p className="text-gray-400">Pin not found</p>
        </div>
      </SsgoiTransition>
    );
  }

  return (
    <SsgoiTransition id={`/demo/pinterest/${pinId}`}>
      <div className="min-h-screen bg-gray-950">
        {/* Back button */}
        <div className="px-4 py-4">
          <button
            onClick={onBack || (() => router.goto('/demo/pinterest'))}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Back</span>
          </button>
        </div>

        {/* Pin content */}
        <div className="px-4 pb-8">
          {/* Pin image with hero transition */}
          <img
            className="w-full rounded-xl mb-6 shadow-lg"
            src={item.image}
            alt={item.title}
            style={{ aspectRatio: item.aspectRatio }}
            data-pinterest-detail-key={item.id}
          />
          
          <div>
            <h1 className="text-2xl font-bold text-white mb-4">{item.title}</h1>
            <p className="text-gray-300 mb-6 leading-relaxed">{item.content}</p>
            
            {/* Category and saves */}
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm font-medium">
                {item.category}
              </span>
              <span className="text-gray-400 text-sm font-medium">
                {item.saves.toLocaleString()} saves
              </span>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm text-red-400 bg-red-900/20 px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
            
            {/* Ingredients/Materials/Steps */}
            {item.ingredients && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-3">Ingredients</h3>
                <ul className="space-y-2">
                  {item.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="text-red-400 mt-0.5">•</span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {item.materials && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-3">Materials</h3>
                <ul className="space-y-2">
                  {item.materials.map((material, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="text-red-400 mt-0.5">•</span>
                      <span>{material}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {item.steps && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-3">Steps</h3>
                <ol className="space-y-3">
                  {item.steps.map((step, index) => (
                    <li key={index} className="flex gap-3 text-gray-300">
                      <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            
            {/* Author info */}
            <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl">
              <img
                src={item.author.avatar}
                alt={item.author.name}
                className="w-14 h-14 rounded-full"
              />
              <div className="flex-1">
                <div className="font-semibold text-white">{item.author.name}</div>
                <div className="text-sm text-gray-400 mb-1">{item.author.bio}</div>
                <div className="text-xs text-gray-500">
                  {item.author.followers.toLocaleString()} followers
                </div>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-colors">
                Follow
              </button>
            </div>
          </div>
        </div>
      </div>
    </SsgoiTransition>
  );
}