export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  category: string;
  readTime: number;
  publishedAt: string;
  tags: string[];
  coverImage: string;
}

export const posts: Post[] = [
  {
    id: "svelte-5-runes",
    title: "Understanding Svelte 5 Runes: The Future of Reactivity",
    excerpt:
      "Dive deep into Svelte 5's new rune system and discover how it revolutionizes state management and reactivity.",
    content: `# Understanding Svelte 5 Runes: The Future of Reactivity

Svelte 5 introduces a groundbreaking new feature called **runes** that fundamentally changes how we think about reactivity in Svelte applications.

## What Are Runes?

Runes are Svelte's new primitives for controlling reactivity. They replace the implicit reactivity model of Svelte 3 and 4 with an explicit, function-based approach.

## Why Runes?

The introduction of runes addresses several limitations of Svelte's previous reactivity model:

### 1. **Explicit Reactivity**
With runes, reactivity is explicit and predictable. You know exactly what's reactive and what isn't.

### 2. **Better TypeScript Support**
Runes provide superior TypeScript integration, making it easier to build type-safe applications.

### 3. **Improved Performance**
The explicit nature of runes allows for better optimization and smaller bundle sizes.`,
    author: {
      name: "Sarah Chen",
      avatar: "/demo/posts/avatar-5.jpg",
      role: "Senior Frontend Developer",
    },
    category: "Svelte",
    readTime: 12,
    publishedAt: "2024-01-25",
    tags: ["Svelte 5", "Runes", "Reactivity", "JavaScript", "Web Development"],
    coverImage: "/demo/posts/0-400x300.jpg",
  },
  {
    id: "flutter-animations",
    title: "Mastering Flutter Animations: From Basics to Advanced",
    excerpt:
      "Learn how to create beautiful, performant animations in Flutter that bring your mobile apps to life.",
    content: `# Mastering Flutter Animations

Flutter's animation system is one of its most powerful features, enabling developers to create smooth, beautiful animations that run at 60fps.

## Understanding Flutter's Animation Architecture

At its core, Flutter's animation system is built on a few key concepts:
- **Animation Controller**: Controls the animation's lifecycle
- **Animation**: Represents a value that changes over time
- **Tween**: Defines the range of values
- **Curves**: Controls the rate of change`,
    author: {
      name: "Michael Park",
      avatar: "/demo/posts/avatar-8.jpg",
      role: "Mobile App Developer",
    },
    category: "Flutter",
    readTime: 15,
    publishedAt: "2024-01-22",
    tags: ["Flutter", "Animations", "Mobile Development", "Dart", "UI/UX"],
    coverImage: "/demo/posts/48-400x300.jpg",
  },
  {
    id: "sveltekit-architecture",
    title: "Building Scalable Applications with SvelteKit",
    excerpt:
      "A comprehensive guide to architecting large-scale applications with SvelteKit.",
    content: `# Building Scalable Applications with SvelteKit

SvelteKit has emerged as a powerful framework for building modern web applications. Its combination of Svelte's reactive components and full-stack framework capabilities makes it an excellent choice.

## Understanding SvelteKit's Architecture

SvelteKit is built on several core principles:
- **File-based routing**: Your file structure defines your routes
- **Server-side rendering (SSR)**: First-class support for SSR
- **API routes**: Build your backend API alongside your frontend`,
    author: {
      name: "Emma Wilson",
      avatar: "/demo/posts/avatar-9.jpg",
      role: "Full-stack Developer",
    },
    category: "SvelteKit",
    readTime: 18,
    publishedAt: "2024-01-20",
    tags: ["SvelteKit", "Architecture", "Scalability", "Web Development"],
    coverImage: "/demo/posts/180-400x300.jpg",
  },
  {
    id: "react-server-components",
    title: "React Server Components: A Deep Dive",
    excerpt:
      "Understanding the revolutionary React Server Components and how they change the way we build React applications.",
    content: `# React Server Components: A Deep Dive

React Server Components (RSC) represent a paradigm shift in how we build React applications.

## What Are React Server Components?

React Server Components are components that render exclusively on the server. They never re-render on the client and don't add to your JavaScript bundle size.

## Key Benefits

### 1. Zero Bundle Size Impact
Server Components don't send any JavaScript to the client.

### 2. Direct Backend Access
Access databases, file systems, and internal services directly without building APIs.`,
    author: {
      name: "Alex Johnson",
      avatar: "/demo/posts/avatar-3.jpg",
      role: "React Core Team Alumni",
    },
    category: "React",
    readTime: 10,
    publishedAt: "2024-01-18",
    tags: ["React", "Server Components", "Next.js", "Performance"],
    coverImage: "/demo/posts/225-400x300.jpg",
  },
  {
    id: "modern-css-techniques",
    title: "Modern CSS Techniques You Should Know in 2024",
    excerpt:
      "Explore the latest CSS features including Container Queries, Cascade Layers, and the :has() selector.",
    content: `# Modern CSS Techniques You Should Know in 2024

CSS has evolved dramatically over the past few years. Features that once required JavaScript are now possible with pure CSS.

## Container Queries: The Game Changer

Container Queries allow elements to respond to their container's size rather than the viewport.

## The Powerful :has() Selector

The :has() pseudo-class lets you style parent elements based on their children.`,
    author: {
      name: "Maria Garcia",
      avatar: "/demo/posts/avatar-1.jpg",
      role: "CSS Specialist",
    },
    category: "CSS",
    readTime: 8,
    publishedAt: "2024-01-16",
    tags: ["CSS", "Web Design", "Frontend", "Modern CSS"],
    coverImage: "/demo/posts/104-400x300.jpg",
  },
  {
    id: "web-performance-2024",
    title: "Web Performance Optimization: A Comprehensive Guide",
    excerpt:
      "Master the art of web performance with modern techniques including Core Web Vitals optimization.",
    content: `# Web Performance Optimization

Web performance is no longer optional—it's a critical factor for user experience, SEO, and business success.

## Understanding Core Web Vitals

### Largest Contentful Paint (LCP)
Measures loading performance. Aim for LCP within 2.5 seconds.

### First Input Delay (FID)
Measures interactivity.

### Cumulative Layout Shift (CLS)
Measures visual stability. Aim for CLS less than 0.1.`,
    author: {
      name: "David Kim",
      avatar: "/demo/posts/avatar-12.jpg",
      role: "Performance Engineer",
    },
    category: "Performance",
    readTime: 14,
    publishedAt: "2024-01-14",
    tags: ["Performance", "Web Vitals", "Optimization", "JavaScript"],
    coverImage: "/demo/posts/367-400x300.jpg",
  },
  {
    id: "typescript-advanced-patterns",
    title: "Advanced TypeScript Patterns for Production",
    excerpt:
      "Level up your TypeScript skills with advanced patterns including type guards and conditional types.",
    content: `# Advanced TypeScript Patterns for Production

TypeScript has evolved from a simple type checker to a powerful type system that can express complex relationships in your code.

## Type Guards and Narrowing

### Custom Type Guards

Type guards help TypeScript narrow down types within conditional blocks.

## Advanced Generic Patterns

### Conditional Types

Conditional types enable you to create types that depend on other types.`,
    author: {
      name: "James Chen",
      avatar: "/demo/posts/avatar-7.jpg",
      role: "TypeScript Expert",
    },
    category: "TypeScript",
    readTime: 12,
    publishedAt: "2024-01-12",
    tags: ["TypeScript", "Advanced Patterns", "Type Safety", "JavaScript"],
    coverImage: "/demo/posts/160-400x300.jpg",
  },
];

export function getPost(id: string): Post | undefined {
  return posts.find((post) => post.id === id);
}

export function getAllPosts(): Post[] {
  return posts;
}

export function getRelatedPosts(currentId: string, limit: number = 3): Post[] {
  const currentPost = getPost(currentId);
  if (!currentPost) return [];

  const sameCategoryPosts = posts.filter(
    (p) => p.id !== currentId && p.category === currentPost.category
  );

  const otherPosts = posts.filter(
    (p) => p.id !== currentId && p.category !== currentPost.category
  );

  return [...sameCategoryPosts, ...otherPosts].slice(0, limit);
}
