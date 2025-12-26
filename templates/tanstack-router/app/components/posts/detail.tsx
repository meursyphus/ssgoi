import React from "react";
import { Link } from "@tanstack/react-router";
import { SsgoiTransition } from "@ssgoi/react";
import { getPost, getRelatedPosts } from "./mock-data";

interface PostDetailProps {
  postId: string;
}

export default function PostDetail({ postId }: PostDetailProps) {
  const post = getPost(postId);
  const relatedPosts = getRelatedPosts(postId, 3);

  if (!post) {
    return (
      <SsgoiTransition id={`/posts/${postId}`}>
        <div className="min-h-screen bg-[#121212] px-4 py-8">
          <p className="text-gray-400">Post not found</p>
        </div>
      </SsgoiTransition>
    );
  }

  return (
    <SsgoiTransition id={`/posts/${postId}`}>
      <div className="min-h-screen bg-[#121212]">
        {/* Back button */}
        <div className="px-4 py-4">
          <Link
            to="/posts"
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
        <article className="px-4 py-6">
          <div className="prose prose-invert max-w-none">
            {post.content.split("\n\n").map((paragraph, idx) => {
              if (paragraph.startsWith("# ")) {
                return (
                  <h1
                    key={idx}
                    className="text-lg font-medium text-white mb-4 mt-6"
                  >
                    {paragraph.substring(2)}
                  </h1>
                );
              } else if (paragraph.startsWith("## ")) {
                return (
                  <h2
                    key={idx}
                    className="text-base font-medium text-white mb-3 mt-5"
                  >
                    {paragraph.substring(3)}
                  </h2>
                );
              } else if (paragraph.startsWith("### ")) {
                return (
                  <h3
                    key={idx}
                    className="text-sm font-medium text-white mb-2 mt-4"
                  >
                    {paragraph.substring(4)}
                  </h3>
                );
              } else if (paragraph.startsWith("- ")) {
                const items = paragraph
                  .split("\n- ")
                  .map((item) => item.replace(/^- /, ""));
                return (
                  <ul
                    key={idx}
                    className="list-disc list-inside text-neutral-300 mb-4 space-y-1 pl-3 text-xs"
                  >
                    {items.map((item, i) => (
                      <li key={i} className="text-neutral-300 text-xs">
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              } else {
                return (
                  <p
                    key={idx}
                    className="text-xs text-neutral-300 mb-4 leading-relaxed"
                  >
                    {paragraph}
                  </p>
                );
              }
            })}
          </div>
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
            <h3 className="text-sm font-medium text-white mb-3">More to Read</h3>
            <div className="space-y-2">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to="/posts/$postId"
                  params={{ postId: relatedPost.id }}
                  className="flex gap-3 p-2 border border-white/5 rounded hover:border-white/10 transition-colors"
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
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </SsgoiTransition>
  );
}
