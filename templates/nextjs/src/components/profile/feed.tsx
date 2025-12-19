"use client";

import React from "react";
import Link from "next/link";
import { posts, Post } from "./mock-data";

export function Feed() {
  return (
    <div className="bg-[#121212] p-1">
      {/* Header */}
      <div className="mb-2 px-3 pt-2">
        <h2 className="text-sm font-medium text-white mb-0.5">Posts</h2>
        <p className="text-neutral-500 text-xs">Tap any post to view details</p>
      </div>

      {/* Instagram 3-Column Masonry Grid */}
      <div className="columns-3 gap-1">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/profile/${post.id}`}
      className="cursor-pointer group break-inside-avoid block mb-1"
    >
      <div className="relative">
        <img
          src={post.coverImage.url}
          alt={post.title}
          className="w-full h-auto object-cover transition-transform duration-200"
          data-instagram-gallery-key={post.id}
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <h3 className="text-white text-xs font-medium line-clamp-2 mb-1">
              {post.title}
            </h3>
            <div className="flex items-center gap-2 text-white text-xs">
              <span className="flex items-center gap-0.5">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {post.likes}
              </span>
              <span className="flex items-center gap-0.5">
                <svg
                  width="10"
                  height="10"
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
    </Link>
  );
}
