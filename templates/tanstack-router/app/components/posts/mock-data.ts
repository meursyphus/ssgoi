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
      avatar: "https://picsum.photos/seed/avatar5/100/100",
      role: "Senior Frontend Developer",
    },
    category: "Svelte",
    readTime: 12,
    publishedAt: "2024-01-25",
    tags: ["Svelte 5", "Runes", "Reactivity", "JavaScript", "Web Development"],
    coverImage: "https://picsum.photos/seed/post0/400/300",
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
      avatar: "https://picsum.photos/seed/avatar8/100/100",
      role: "Mobile App Developer",
    },
    category: "Flutter",
    readTime: 15,
    publishedAt: "2024-01-22",
    tags: ["Flutter", "Animations", "Mobile Development", "Dart", "UI/UX"],
    coverImage: "https://picsum.photos/seed/post1/400/300",
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
      avatar: "https://picsum.photos/seed/avatar9/100/100",
      role: "Full-stack Developer",
    },
    category: "SvelteKit",
    readTime: 18,
    publishedAt: "2024-01-20",
    tags: ["SvelteKit", "Architecture", "Scalability", "Web Development"],
    coverImage: "https://picsum.photos/seed/post2/400/300",
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
      avatar: "https://picsum.photos/seed/avatar3/100/100",
      role: "React Core Team Alumni",
    },
    category: "React",
    readTime: 10,
    publishedAt: "2024-01-18",
    tags: ["React", "Server Components", "Next.js", "Performance"],
    coverImage: "https://picsum.photos/seed/post3/400/300",
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
      avatar: "https://picsum.photos/seed/avatar1/100/100",
      role: "CSS Specialist",
    },
    category: "CSS",
    readTime: 8,
    publishedAt: "2024-01-16",
    tags: ["CSS", "Web Design", "Frontend", "Modern CSS"],
    coverImage: "https://picsum.photos/seed/post4/400/300",
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
