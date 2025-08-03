"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useImagePrefetch } from "@/lib/use-image-prefetch";

interface BlogPost {
  slug: string;
  title: string;
  description?: string;
  thumbnail?: string;
  date?: string;
  author?: string;
  tags?: string[];
}

interface BlogListProps {
  posts: BlogPost[];
  lang: string;
  translations: {
    noPostsYet: string;
  };
}

export function BlogList({ posts, lang, translations }: BlogListProps) {
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);

  // Prefetch all blog post thumbnails
  const thumbnailUrls = posts
    .map((post) => post.thumbnail)
    .filter((url): url is string => !!url);

  useImagePrefetch(thumbnailUrls);

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">{translations.noPostsYet}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/${lang}/blog/${post.slug}`}
          className="group block"
          onMouseEnter={() => setHoveredPost(post.slug)}
          onMouseLeave={() => setHoveredPost(null)}
        >
          <article className="bg-gray-900 rounded-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl">
            {post.thumbnail && (
              <div
                data-hero-key={`/${lang}/blog/${post.slug}`}
                className="relative aspect-video bg-gray-800 overflow-hidden rounded-t-lg"
              >
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </div>
            )}

            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
                {post.title}
              </h2>

              {post.description && (
                <p className="text-gray-400 mb-4 line-clamp-2">
                  {post.description}
                </p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                {post.date && (
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString(lang, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                )}

                {post.author && <span>{post.author}</span>}
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
