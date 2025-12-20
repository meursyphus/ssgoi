/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { drill } from "@ssgoi/react/view-transitions";
import {
  BrowserMockup,
  DemoPage,
  DemoLink,
  useBrowserNavigation,
} from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";

// Mock data for posts (similar to posts demo but with drill-specific styling)
const blogPosts = [
  {
    id: "drill-1",
    title: "Building Modern Web Applications with Next.js 14",
    excerpt:
      "Explore the latest features and best practices for creating performant web apps with Next.js 14's new app router.",
    coverImage:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
    author: {
      name: "Alex Johnson",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    },
    category: "Development",
    readTime: 8,
    date: "2024-01-15",
    content: `
      Next.js 14 brings revolutionary changes to how we build web applications. 
      The new app router provides better performance and developer experience.
      
      Key features include:
      - Server Components by default
      - Improved data fetching patterns
      - Better TypeScript support
      - Enhanced developer tools
      
      Let's dive deep into these features and understand how they can improve our applications...
    `,
  },
  {
    id: "drill-2",
    title: "Understanding Spring-based Animations in Web",
    excerpt:
      "Learn how physics-based animations create more natural and delightful user experiences.",
    coverImage:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop",
    author: {
      name: "Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    category: "Animation",
    readTime: 6,
    date: "2024-01-12",
    content: `
      Spring animations have become the gold standard for creating smooth, natural-feeling motion in user interfaces.
      
      Unlike traditional CSS animations that follow pre-defined curves, spring physics simulate real-world motion:
      - Natural acceleration and deceleration
      - Realistic bounce and overshoot
      - Smooth interruption handling
      - Velocity preservation
      
      This creates a more engaging and responsive user experience...
    `,
  },
  {
    id: "drill-3",
    title: "The Future of Page Transitions on the Web",
    excerpt:
      "How modern libraries are bringing native app-like transitions to web applications.",
    coverImage:
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600&fit=crop",
    author: {
      name: "Mike Davis",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    category: "UX Design",
    readTime: 10,
    date: "2024-01-10",
    content: `
      Page transitions have evolved from simple fades to complex, choreographed animations that guide users through our applications.
      
      Modern approaches include:
      - View Transitions API (Chrome only)
      - Library-based solutions (SSGOI, Framer Motion)
      - State preservation during transitions
      - Gesture-based navigation
      
      The web is finally catching up to native mobile experiences...
    `,
  },
  {
    id: "drill-4",
    title: "Mastering TypeScript Generics",
    excerpt:
      "A comprehensive guide to understanding and using TypeScript generics effectively.",
    coverImage:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop",
    author: {
      name: "Emily Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    category: "TypeScript",
    readTime: 12,
    date: "2024-01-08",
    content: `
      Generics are one of the most powerful features in TypeScript, allowing us to write flexible, reusable code.
      
      Topics we'll cover:
      - Generic functions and classes
      - Constraints and conditional types
      - Utility types
      - Real-world use cases
      
      By the end of this guide, you'll be comfortable using generics in your TypeScript projects...
    `,
  },
  {
    id: "drill-5",
    title: "Performance Optimization Techniques for React",
    excerpt:
      "Best practices and strategies to optimize React application performance.",
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    author: {
      name: "James Wilson",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
    category: "React",
    readTime: 9,
    date: "2024-01-05",
    content: `
      React performance optimization is crucial for creating smooth, responsive applications.
      
      Key techniques include:
      - Memoization with useMemo and useCallback
      - Code splitting and lazy loading
      - Virtual scrolling for large lists
      - Optimizing re-renders
      
      Let's explore each technique with practical examples...
    `,
  },
  {
    id: "drill-6",
    title: "CSS Grid vs Flexbox: When to Use Which",
    excerpt:
      "A detailed comparison of CSS Grid and Flexbox to help you choose the right layout tool.",
    coverImage:
      "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=600&fit=crop",
    author: {
      name: "Lisa Park",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    },
    category: "CSS",
    readTime: 7,
    date: "2024-01-03",
    content: `
      CSS Grid and Flexbox are both powerful layout tools, but they excel in different scenarios.
      
      Grid is best for:
      - Two-dimensional layouts
      - Complex page structures
      - Precise control over rows and columns
      
      Flexbox excels at:
      - One-dimensional layouts
      - Component-level layouts
      - Flexible, content-driven sizing
      
      Understanding when to use each will make you a more effective CSS developer...
    `,
  },
];

// Posts List Page Component
function PostsListPage() {
  return (
    <DemoPage path="/posts">
      <div className="min-h-screen bg-[#121212] p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-neutral-100 mb-2">
            Blog Posts
          </h1>
          <p className="text-neutral-400">
            Experience the drill transition effect when navigating between posts
          </p>
        </div>

        {/* Posts Grid */}
        <div className="max-w-4xl mx-auto space-y-4">
          {blogPosts.map((post) => (
            <DemoLink
              key={post.id}
              to={`/posts/${post.id}`}
              className="block no-underline"
            >
              <article className="bg-white/[0.02] border border-white/5 rounded-lg p-4 transition-all duration-300 hover:bg-white/5 cursor-pointer">
                <div className="flex gap-4">
                  {/* Cover Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">
                        {post.category}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {post.date}
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold text-neutral-100 mb-2 line-clamp-1">
                      {post.title}
                    </h2>

                    <p className="text-neutral-400 text-sm mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="text-xs text-neutral-300">
                          {post.author.name}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-500">•</span>
                      <span className="text-xs text-neutral-500">
                        {post.readTime} min read
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </DemoLink>
          ))}
        </div>
      </div>
    </DemoPage>
  );
}

// Post Detail Page Component
function PostDetailPage({ post }: { post: (typeof blogPosts)[0] }) {
  const { navigate } = useBrowserNavigation();

  // Add keyboard navigation (ESC to go back)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/posts");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate]);

  return (
    <DemoPage path={`/posts/${post.id}`}>
      <div className="min-h-screen bg-[#121212]">
        {/* Header with Back Button */}
        <div className="sticky top-0 z-10 bg-[#121212]/80 backdrop-blur-md border-b border-white/5">
          <div className="max-w-4xl mx-auto p-4">
            <DemoLink
              to="/drill/posts"
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-300 transition-colors no-underline"
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
              <span>Back to Posts</span>
            </DemoLink>
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto p-6">
          {/* Cover Image */}
          <div className="relative aspect-[21/9] mb-8 rounded-xl overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/20 to-transparent" />
          </div>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-neutral-400 font-medium uppercase tracking-wider">
                {post.category}
              </span>
              <span className="text-sm text-neutral-500">•</span>
              <span className="text-sm text-neutral-500">{post.date}</span>
              <span className="text-sm text-neutral-500">•</span>
              <span className="text-sm text-neutral-500">
                {post.readTime} min read
              </span>
            </div>

            <h1 className="text-4xl font-bold text-neutral-100 mb-6">
              {post.title}
            </h1>

            <p className="text-xl text-neutral-400 mb-6">{post.excerpt}</p>

            {/* Author Info */}
            <div className="flex items-center gap-4 pb-6 border-b border-white/5">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="text-neutral-100 font-medium">
                  {post.author.name}
                </p>
                <p className="text-sm text-neutral-500">Author</p>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-invert max-w-none">
            <div className="text-neutral-300 leading-relaxed whitespace-pre-line">
              {post.content}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-white/5">
            <DemoLink
              to="/drill/posts"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.02] border border-white/5 hover:bg-white/5 rounded-lg text-neutral-100 transition-colors no-underline"
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
              <span>Back to All Posts</span>
            </DemoLink>
          </footer>
        </article>
      </div>
    </DemoPage>
  );
}

// Create route configuration for detail pages
const detailPages = blogPosts.map((post) => ({
  path: `/posts/${post.id}`,
  component: () => <PostDetailPage post={post} />,
  label: post.title,
}));

// Route configuration
const drillRoutes: RouteConfig[] = [
  { path: "/posts", component: PostsListPage, label: "Posts" },
  ...detailPages,
];

// Custom layout for Drill demo
function DrillLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#121212] min-h-full">
      {/* Constrain width at layout level */}
      <div className="max-w-md mx-auto overflow-hidden">
        {/* Critical: relative z-0 wrapper for proper transition layering */}
        <div className="relative z-0 w-full">{children}</div>
      </div>
    </div>
  );
}

// Main Drill Demo Component
export function DrillDemo() {
  const config = {
    transitions: [
      {
        from: "/posts",
        to: "/posts/*",
        transition: drill({ direction: "enter" }),
      },
      {
        from: "/posts/*",
        to: "/posts",
        transition: drill({ direction: "exit" }),
      },
    ],
  };

  return (
    <BrowserMockup
      routes={drillRoutes}
      config={config}
      layout={DrillLayout}
      initialPath="/posts"
      deviceType="mobile"
    />
  );
}
