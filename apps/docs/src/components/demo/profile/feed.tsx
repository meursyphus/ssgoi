"use client";

import React, { useEffect } from "react";
import { posts } from "./mock-data";
import { useDemoRouter } from "../router-provider";

export function Feed() {
  const router = useDemoRouter();

  // Split items into three columns for masonry effect
  const column1Items = posts.filter((_, index) => index % 3 === 0);
  const column2Items = posts.filter((_, index) => index % 3 === 1);
  const column3Items = posts.filter((_, index) => index % 3 === 2);

  // Prefetch all post detail pages on mount
  useEffect(() => {
    posts.forEach((post) => {
      router.prefetch(`/demo/profile/${post.id}`);
    });
  }, [router]);

  return (
    <div className=" bg-gray-950 p-1">
      {/* Header */}
      <div className="mb-3 px-3 pt-3">
        <h2 className="text-xl font-bold text-white mb-1">Posts</h2>
        <p className="text-gray-400 text-xs">Tap any post to view details</p>
      </div>

      {/* Instagram 3-Column Masonry Grid */}
      <div className="grid grid-cols-3 gap-1">
        {/* Column 1 */}
        <div className="flex flex-col gap-1">
          {column1Items.map((post) => (
            <PostCard key={post.id} post={post} router={router} />
          ))}
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-1">
          {column2Items.map((post) => (
            <PostCard key={post.id} post={post} router={router} />
          ))}
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-1">
          {column3Items.map((post) => (
            <PostCard key={post.id} post={post} router={router} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface PostCardProps {
  post: (typeof posts)[0];
  router: ReturnType<typeof useDemoRouter>;
}

function PostCard({ post, router }: PostCardProps) {
  return (
    <article
      onClick={() => router.goto(`/demo/profile/${post.id}`)}
      className="cursor-pointer group"
    >
      <div className="relative">
        <img
          src={post.coverImage.url}
          alt={post.title}
          style={{
            aspectRatio: post.coverImage.aspectRatio,
          }}
          data-instagram-gallery-key={post.id}
          className="w-full object-cover transition-transform duration-200"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white text-xs font-semibold line-clamp-2 mb-1">
              {post.title}
            </h3>
            <div className="flex items-center gap-3 text-white text-xs">
              <span className="flex items-center gap-1">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {post.likes}
              </span>
              <span className="flex items-center gap-1">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                {post.comments}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
