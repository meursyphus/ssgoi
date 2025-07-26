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
        <div className="min-h-screen bg-gray-950 px-4 py-8">
          <p className="text-gray-400">Post not found</p>
        </div>
      </SsgoiTransition>
    );
  }

  // Markdown components with dark theme styles
  const markdownComponents = {
    h1: ({ children }: any) => <h1 className="text-3xl font-bold text-white mb-6 mt-8">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold text-white mb-4 mt-6">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold text-white mb-3 mt-4">{children}</h3>,
    p: ({ children }: any) => <p className="text-gray-300 mb-6 leading-relaxed">{children}</p>,
    ul: ({ children }: any) => <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2 pl-4">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal list-inside text-gray-300 mb-6 space-y-2 pl-4">{children}</ol>,
    li: ({ children }: any) => <li className="text-gray-300">{children}</li>,
    pre: ({ children }: any) => <pre className="bg-gray-800 text-gray-300 p-4 rounded-lg overflow-x-auto mb-6">{children}</pre>,
    code: ({ node, inline, className, children, ...props }: any) => {
      // Inline code vs code block
      if (!inline && className) {
        return <code className="text-gray-300" {...props}>{children}</code>;
      }
      return <code className="bg-gray-800 text-red-400 px-1.5 py-0.5 rounded text-sm" {...props}>{children}</code>;
    },
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-600 pl-4 my-6 text-gray-400 italic">{children}</blockquote>
    ),
    strong: ({ children }: any) => <strong className="font-bold text-white">{children}</strong>,
    em: ({ children }: any) => <em className="italic text-gray-300">{children}</em>,
    hr: () => <hr className="border-gray-700 my-8" />,
  };

  return (
    <SsgoiTransition id={`/demo/posts/${postId}`}>
      <div className="min-h-screen bg-gray-950">
        {/* Back button */}
        <div className="px-4 py-4">
          <button
            onClick={onBack || (() => router.goto("/demo/posts"))}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg
              width="20"
              height="20"
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
          <div className="flex items-center gap-4 mb-4 text-sm">
            <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full font-medium">
              {post.category}
            </span>
            <span className="text-gray-500">{post.readTime} min read</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
          <p className="text-lg text-gray-400 mb-6">{post.excerpt}</p>

          {/* Author info */}
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="font-medium text-white">{post.author.name}</div>
              <div className="text-sm text-gray-400">{post.author.role}</div>
              <div className="text-xs text-gray-500">
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
        <article className="px-4 py-8 prose prose-invert max-w-none">
          <Markdown 
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {post.content}
          </Markdown>
        </article>

        {/* Tags */}
        <div className="px-4 pb-8">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-gray-800 px-4 py-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              More to Read
            </h3>
            <div className="space-y-3">
              {relatedPosts.map((relatedPost) => (
                <button
                  key={relatedPost.id}
                  onClick={() => {
                    // Handle navigation to related post
                    router.goto(`/demo/posts/${relatedPost.id}`);
                  }}
                  className="w-full flex gap-3 p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors text-left"
                >
                  <img
                    src={relatedPost.coverImage}
                    alt={relatedPost.title}
                    className="w-16 h-16 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-white line-clamp-2">
                      {relatedPost.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
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
