/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { SsgoiTransition } from "@ssgoi/react";
import { getPost, getRelatedPosts } from "./mock-data";
import { useDemoRouter } from "../router-provider";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PostDetailProps {
  onBack?: () => void;
}

export default function PostDetail({ onBack }: PostDetailProps) {
  const router = useDemoRouter();
  const currentPath = router.currentPath || "";
  // Extract postId from path: /demo/posts/[id]
  const postId = currentPath.split("/").pop() || "";

  const post = getPost(postId);
  const relatedPosts = getRelatedPosts(postId, 3);

  if (!post) {
    return (
      <SsgoiTransition id={`/demo/posts/${postId}`}>
        <div className="min-h-screen bg-[#121212] px-4 py-8">
          <p className="text-gray-400">Post not found</p>
        </div>
      </SsgoiTransition>
    );
  }

  // Markdown components with dark theme styles
  const markdownComponents = {
    h1: ({ children }: any) => (
      <h1 className="text-lg font-medium text-white mb-4 mt-6">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-base font-medium text-white mb-3 mt-5">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-sm font-medium text-white mb-2 mt-4">{children}</h3>
    ),
    p: ({ children }: any) => (
      <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc list-inside text-neutral-300 mb-4 space-y-1 pl-3 text-xs">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal list-inside text-neutral-300 mb-4 space-y-1 pl-3 text-xs">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="text-neutral-300 text-xs">{children}</li>
    ),
    pre: ({ children }: any) => (
      <pre className="bg-white/5 text-neutral-300 p-3 rounded overflow-x-auto mb-4 text-xs">
        {children}
      </pre>
    ),
    code: ({ inline, className, children, ...props }: any) => {
      // Inline code vs code block
      if (!inline && className) {
        return (
          <code className="text-neutral-300 text-xs" {...props}>
            {children}
          </code>
        );
      }
      return (
        <code
          className="bg-white/5 text-neutral-300 px-1.5 py-0.5 rounded text-xs"
          {...props}
        >
          {children}
        </code>
      );
    },
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-2 border-white/10 pl-3 my-4 text-neutral-400 italic text-xs">
        {children}
      </blockquote>
    ),
    strong: ({ children }: any) => (
      <strong className="font-medium text-white">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-neutral-300">{children}</em>
    ),
    hr: () => <hr className="border-white/5 my-6" />,
  };

  return (
    <SsgoiTransition id={`/demo/posts/${postId}`}>
      <div className="min-h-screen bg-[#121212]">
        {/* Back button */}
        <div className="px-4 py-4">
          <button
            onClick={onBack || (() => router.goto("/demo/posts"))}
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
          </button>
        </div>

        {/* Post header */}
        <div className="px-4 pb-6">
          <div className="flex items-center gap-3 mb-4 text-xs">
            <span className="px-2 py-0.5 bg-white/5 text-neutral-400 rounded">
              {post.category}
            </span>
            <span className="text-neutral-500">{post.readTime} min read</span>
          </div>

          <h1 className="text-xl font-medium text-white mb-3">{post.title}</h1>
          <p className="text-sm text-neutral-400 mb-6">{post.excerpt}</p>

          {/* Author info */}
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="text-xs font-medium text-white">
                {post.author.name}
              </div>
              <div className="text-xs text-neutral-500">{post.author.role}</div>
              <div className="text-xs text-neutral-600">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Hero image */}
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-48 object-cover"
        />

        {/* Post content */}
        <article className="px-4 py-6 prose prose-invert max-w-none">
          <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {post.content}
          </Markdown>
        </article>

        {/* Tags */}
        <div className="px-4 pb-6">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-neutral-400 bg-white/5 px-2 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-white/5 px-4 py-6">
            <h3 className="text-sm font-medium text-white mb-3">
              More to Read
            </h3>
            <div className="space-y-2">
              {relatedPosts.map((relatedPost) => (
                <button
                  key={relatedPost.id}
                  onClick={() => {
                    // Handle navigation to related post
                    router.goto(`/demo/posts/${relatedPost.id}`);
                  }}
                  className="w-full flex gap-3 p-2 border border-white/5 rounded hover:border-white/10 transition-colors text-left"
                >
                  <img
                    src={relatedPost.coverImage}
                    alt={relatedPost.title}
                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="text-xs font-medium text-white line-clamp-2">
                      {relatedPost.title}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {relatedPost.readTime} min read
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </SsgoiTransition>
  );
}
