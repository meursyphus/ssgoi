"use client";

import React, { useEffect } from "react";
import { getAllPosts } from "./mock-data";
import { SsgoiTransition } from "@ssgoi/react";
import { useDemoRouter } from "../router-provider";

export default function PostsDemo() {
  const posts = getAllPosts();
  const router = useDemoRouter();

  // Prefetch all post detail pages on mount
  useEffect(() => {
    posts.forEach((post) => {
      router.prefetch(`/demo/posts/${post.id}`);
    });
  }, [posts, router]);

  return (
    <SsgoiTransition id="/demo/posts">
      <div className="min-h-full bg-gray-950 px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Latest Posts</h1>
          <p className="text-gray-400">
            Insights on Svelte, Flutter, and web development
          </p>
        </div>

        {/* Posts List */}
        <div className="space-y-3">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={() => {
                // Navigate to post detail
                router.goto(`/demo/posts/${post.id}`);
              }}
              className="bg-gray-900 rounded-lg overflow-hidden transition-all duration-200 hover:bg-gray-800 cursor-pointer"
            >
              <div className="flex gap-3 p-3">
                {/* Left: Cover Image */}
                <div className="flex-shrink-0">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-20 h-20 rounded-md object-cover bg-gray-800"
                  />
                </div>

                {/* Right: Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  {/* Title and excerpt */}
                  <div>
                    <h2 className="text-base font-semibold text-white mb-1 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Author and meta info */}
                  <div className="flex items-center gap-2 mt-2">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-4 h-4 rounded-full"
                    />
                    <span className="text-xs text-gray-300">
                      {post.author.name}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">
                      {post.readTime}m
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full ml-auto">
                      {post.category}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SsgoiTransition>
  );
}
