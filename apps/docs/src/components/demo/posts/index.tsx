"use client";

import React from "react";
import { getAllPosts } from "./mock-data";
import { SsgoiTransition } from "@meursyphus/ssgoi-react";
import { useDemoRouter } from "../router-provider";

export default function PostsDemo() {
  const posts = getAllPosts();
  const router = useDemoRouter();

  return (
    <SsgoiTransition id="/demo/posts">
      <div className="min-h-screen bg-gray-950 px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Latest Posts</h1>
          <p className="text-gray-400">
            Insights on Svelte, Flutter, and web development
          </p>
        </div>

        {/* Posts Grid */}
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={() => {
                // Navigate to post detail
                router.goto(`/demo/posts/${post.id}`);
              }}
              className="bg-gray-900 rounded-xl overflow-hidden transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-xl border border-gray-800 cursor-pointer"
            >
              {/* Post Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
              </div>

              {/* Post Content */}
              <div className="p-6">
                {/* Meta Information */}
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full font-medium">
                    {post.category}
                  </span>
                  <span className="text-gray-500">{post.readTime} min read</span>
                </div>

                {/* Title and Excerpt */}
                <h2 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-400 line-clamp-3 mb-6">
                  {post.excerpt}
                </p>

                {/* Author Information */}
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {post.author.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
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