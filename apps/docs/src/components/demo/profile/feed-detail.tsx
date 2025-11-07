"use client";

import React, { useEffect } from "react";
import { SsgoiTransition } from "@ssgoi/react";
import { getPost } from "./mock-data";
import { useDemoRouter } from "../router-provider";

interface FeedDetailProps {
  onBack?: () => void;
}

export default function FeedDetail({ onBack }: FeedDetailProps) {
  const router = useDemoRouter();
  const currentPath = router.currentPath || "";
  // Extract postId from path: /demo/profile/[id]
  const postId = currentPath.split("/").pop() || "";

  const post = getPost(postId);

  // Add keyboard navigation (ESC to go back)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (onBack) {
          onBack();
        } else {
          router.goto("/demo/profile");
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onBack, router]);

  if (!post) {
    return (
      <SsgoiTransition id={`/demo/profile/${postId}`}>
        <div className=" bg-gray-950 px-4 py-8">
          <p className="text-gray-400">Post not found</p>
        </div>
      </SsgoiTransition>
    );
  }

  return (
    <SsgoiTransition id={`/demo/profile/${postId}`}>
      <div className="bg-gray-950">
        {/* Content */}
        <div>
          {/* Image with overlays */}
          <div className="relative">
            <img
              src={post.coverImage.url}
              alt={post.title}
              className="w-full h-auto"
              data-instagram-detail-key={post.id}
            />

            {/* Back button overlay */}
            <button
              onClick={onBack || (() => router.goto("/demo/profile"))}
              className="absolute top-3 left-3 p-2 bg-black/60 backdrop-blur-sm hover:bg-black/80 rounded-full transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Details below image */}
          <div className="p-4">
            {/* Like section */}
            <div className="flex items-center gap-3 mb-3">
              <button className="text-white hover:text-gray-300 transition-colors">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
              <button className="text-white hover:text-gray-300 transition-colors">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </button>
              <button className="text-white hover:text-gray-300 transition-colors">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>

            <p className="text-white font-semibold text-sm mb-2">
              {post.likes.toLocaleString()} likes
            </p>

            {/* Caption */}
            <div className="mb-3">
              <p className="text-white text-sm">
                <span className="font-semibold">alexchen</span> {post.title}
              </p>
              <p className="text-gray-400 text-sm mt-1">{post.excerpt}</p>
            </div>

            {/* Comments */}
            <div className="space-y-2 mb-4">
              <p className="text-gray-400 text-xs">
                View all {post.comments} comments
              </p>
              <div className="space-y-1.5">
                <p className="text-white text-sm">
                  <span className="font-semibold">user1</span> Amazing! 😍
                </p>
                <p className="text-white text-sm">
                  <span className="font-semibold">user2</span> Love this!
                </p>
              </div>
            </div>

            {/* Time */}
            <p className="text-gray-500 text-xs uppercase">
              {post.publishedAt}
            </p>

            {/* Comment input */}
            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-3">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
              />
              <button className="text-blue-500 text-sm font-semibold">
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </SsgoiTransition>
  );
}
