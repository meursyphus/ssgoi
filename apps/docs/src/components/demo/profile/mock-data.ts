export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  readTime: number; // in minutes
  publishedAt: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface Profile {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar: string;
  coverImage: string;
  followers: number;
  following: number;
  posts: number;
  verified: boolean;
  joinedAt: string;
  location: string;
  website: string;
  socials: {
    twitter?: string;
    instagram?: string;
    github?: string;
  };
}

// Using local images
const postImageIds = [
  35, 36, 37, 38, 39,
  40, 41, 42, 43, 44
];

export const profile: Profile = {
  id: 'user-1',
  name: 'Alex Chen',
  username: '@alexchen',
  bio: 'Creative developer & designer. Building beautiful digital experiences. Coffee enthusiast ☕',
  avatar: '/demo/profiles/avatar-7.jpg',
  coverImage: '/demo/profiles/45-800x240.jpg',
  followers: 12543,
  following: 892,
  posts: 156,
  verified: true,
  joinedAt: '2021-03-15',
  location: 'San Francisco, CA',
  website: 'https://alexchen.dev',
  socials: {
    twitter: 'alexchen',
    instagram: 'alex.chen',
    github: 'alexchen-dev'
  }
};

export const posts: Post[] = [
  {
    id: 'post-1',
    title: 'Building Smooth Page Transitions in Modern Web Apps',
    excerpt: 'Learn how to create buttery-smooth page transitions that delight users and enhance the overall experience.',
    content: `Page transitions have become an essential part of modern web applications. They not only make navigation feel smoother but also help users understand the spatial relationships between different pages.

In this post, we'll explore various techniques for implementing page transitions, from simple CSS animations to more complex JavaScript-based solutions. We'll also discuss performance considerations and best practices.

## Why Page Transitions Matter

Page transitions serve several important purposes:
- They provide visual continuity between states
- They give users time to process changes
- They add personality to your application
- They can guide user attention

## Implementation Strategies

There are several ways to implement page transitions, each with its own advantages...`,
    coverImage: `/demo/profiles/${postImageIds[0]}-400x240.jpg`,
    category: 'Development',
    readTime: 8,
    publishedAt: '2024-01-28',
    likes: 234,
    comments: 45,
    shares: 89
  },
  {
    id: 'post-2',
    title: 'The Art of Minimalist Design',
    excerpt: 'Exploring the principles of minimalism and how to apply them effectively in digital design.',
    content: `Minimalism isn't just about using less - it's about using only what's necessary to create the best possible user experience.

## Core Principles

1. **Clarity over cleverness**: Every element should have a clear purpose
2. **White space is your friend**: Give your design room to breathe
3. **Typography matters**: Choose fonts that enhance readability
4. **Color with purpose**: Use color to guide, not distract

When done right, minimalist design creates interfaces that are both beautiful and functional...`,
    coverImage: `/demo/profiles/${postImageIds[1]}-400x240.jpg`,
    category: 'Design',
    readTime: 6,
    publishedAt: '2024-01-25',
    likes: 456,
    comments: 67,
    shares: 123
  },
  {
    id: 'post-3',
    title: 'Performance Optimization Tips for React Apps',
    excerpt: 'Practical techniques to make your React applications blazing fast.',
    content: `Performance is crucial for user experience. Here are proven strategies to optimize your React applications.

## Key Optimization Techniques

### 1. Code Splitting
Break your bundle into smaller chunks that load on demand.

### 2. Memoization
Use React.memo, useMemo, and useCallback wisely to prevent unnecessary re-renders.

### 3. Virtual Scrolling
For long lists, render only visible items to improve performance.

### 4. Image Optimization
Lazy load images and use appropriate formats and sizes...`,
    coverImage: `/demo/profiles/${postImageIds[2]}-400x240.jpg`,
    category: 'Development',
    readTime: 10,
    publishedAt: '2024-01-22',
    likes: 567,
    comments: 89,
    shares: 234
  },
  {
    id: 'post-4',
    title: 'Creating Accessible Color Palettes',
    excerpt: 'How to design color schemes that work for everyone, including users with visual impairments.',
    content: `Accessibility should be at the forefront of every design decision. When it comes to color, this means ensuring sufficient contrast and considering various forms of color blindness.

## Understanding WCAG Guidelines

The Web Content Accessibility Guidelines (WCAG) provide specific contrast ratios:
- Normal text: 4.5:1
- Large text: 3:1
- UI components: 3:1

## Tools for Testing

Several tools can help you create accessible color palettes...`,
    coverImage: `/demo/profiles/${postImageIds[3]}-400x240.jpg`,
    category: 'Design',
    readTime: 7,
    publishedAt: '2024-01-19',
    likes: 345,
    comments: 56,
    shares: 178
  },
  {
    id: 'post-5',
    title: 'The Future of Web Development',
    excerpt: 'Exploring emerging trends and technologies shaping the future of web development.',
    content: `The web development landscape is constantly evolving. Let's look at the trends that will shape the future of our industry.

## Key Trends to Watch

### 1. AI-Powered Development
AI assistants are becoming increasingly sophisticated, helping developers write better code faster.

### 2. Edge Computing
Moving computation closer to users for better performance and reduced latency.

### 3. WebAssembly
Opening new possibilities for high-performance web applications.

### 4. Progressive Web Apps
Blurring the line between web and native applications...`,
    coverImage: `/demo/profiles/${postImageIds[4]}-400x240.jpg`,
    category: 'Technology',
    readTime: 12,
    publishedAt: '2024-01-16',
    likes: 789,
    comments: 134,
    shares: 456
  },
  {
    id: 'post-6',
    title: 'Mastering CSS Grid Layout',
    excerpt: 'A comprehensive guide to creating complex layouts with CSS Grid.',
    content: `CSS Grid has revolutionized web layout. It provides a two-dimensional layout system that makes complex designs simple to implement.

## Grid Fundamentals

Grid allows you to work with both rows and columns simultaneously, giving you unprecedented control over your layouts.

## Practical Examples

Let's explore common layout patterns and how to implement them with Grid...`,
    coverImage: `/demo/profiles/${postImageIds[5]}-400x240.jpg`,
    category: 'Development',
    readTime: 9,
    publishedAt: '2024-01-13',
    likes: 432,
    comments: 78,
    shares: 210
  }
];

export function getPost(id: string): Post | undefined {
  return posts.find(post => post.id === id);
}

export function getPostsByCategory(category: string): Post[] {
  return posts.filter(post => post.category === category);
}

export function getRelatedPosts(currentId: string, limit: number = 3): Post[] {
  const currentPost = getPost(currentId);
  if (!currentPost) return [];

  // Prioritize same category
  const sameCategoryPosts = posts
    .filter(p => p.id !== currentId && p.category === currentPost.category);
  
  const otherPosts = posts
    .filter(p => p.id !== currentId && p.category !== currentPost.category)
    .sort(() => Math.random() - 0.5);

  return [...sameCategoryPosts, ...otherPosts].slice(0, limit);
}

export function getProfile(): Profile {
  return profile;
}