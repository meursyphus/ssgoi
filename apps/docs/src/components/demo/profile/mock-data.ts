export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: {
    url: string;
    aspectRatio: string;
  };
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

// Using Unsplash images with different aspect ratios for masonry effect
const postImages = [
  {
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
    aspectRatio: "2/3",
  },
  {
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop",
    aspectRatio: "1/1",
  },
  {
    url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=500&fit=crop",
    aspectRatio: "4/5",
  },
  {
    url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=450&fit=crop",
    aspectRatio: "8/9",
  },
  {
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=550&fit=crop",
    aspectRatio: "4/5.5",
  },
  {
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=350&fit=crop",
    aspectRatio: "8/7",
  },
  {
    url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=480&fit=crop",
    aspectRatio: "5/6",
  },
  {
    url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&h=420&fit=crop",
    aspectRatio: "20/21",
  },
  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=520&fit=crop",
    aspectRatio: "10/13",
  },
  {
    url: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&h=380&fit=crop",
    aspectRatio: "20/19",
  },
  {
    url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=460&fit=crop",
    aspectRatio: "20/23",
  },
  {
    url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=500&fit=crop",
    aspectRatio: "4/5",
  },
  {
    url: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=400&h=600&fit=crop",
    aspectRatio: "2/3",
  },
  {
    url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=350&fit=crop",
    aspectRatio: "8/7",
  },
  {
    url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=520&fit=crop",
    aspectRatio: "10/13",
  },
  {
    url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=450&fit=crop",
    aspectRatio: "8/9",
  },
  {
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=580&fit=crop",
    aspectRatio: "20/29",
  },
  {
    url: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&h=400&fit=crop",
    aspectRatio: "1/1",
  },
];

export const profile: Profile = {
  id: "user-1",
  name: "Alex Chen",
  username: "@alexchen",
  bio: "Creative developer & designer. Building beautiful digital experiences. Coffee enthusiast ☕",
  avatar: "/demo/profiles/avatar-7.jpg",
  coverImage: "/demo/profiles/45-800x240.jpg",
  followers: 12543,
  following: 892,
  posts: 18,
  verified: true,
  joinedAt: "2021-03-15",
  location: "San Francisco, CA",
  website: "https://alexchen.dev",
  socials: {
    twitter: "alexchen",
    instagram: "alex.chen",
    github: "alexchen-dev",
  },
};

export const posts: Post[] = [
  {
    id: "post-1",
    title: "Building Smooth Page Transitions in Modern Web Apps",
    excerpt:
      "Learn how to create buttery-smooth page transitions that delight users and enhance the overall experience.",
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
    coverImage: postImages[0],
    category: "Development",
    readTime: 8,
    publishedAt: "2024-01-28",
    likes: 234,
    comments: 45,
    shares: 89,
  },
  {
    id: "post-2",
    title: "The Art of Minimalist Design",
    excerpt:
      "Exploring the principles of minimalism and how to apply them effectively in digital design.",
    content: `Minimalism isn't just about using less - it's about using only what's necessary to create the best possible user experience.

## Core Principles

1. **Clarity over cleverness**: Every element should have a clear purpose
2. **White space is your friend**: Give your design room to breathe
3. **Typography matters**: Choose fonts that enhance readability
4. **Color with purpose**: Use color to guide, not distract

When done right, minimalist design creates interfaces that are both beautiful and functional...`,
    coverImage: postImages[1],
    category: "Design", 
    readTime: 6,
    publishedAt: "2024-01-25",
    likes: 456,
    comments: 67,
    shares: 123,
  },
  {
    id: "post-3",
    title: "Performance Optimization Tips for React Apps",
    excerpt:
      "Practical techniques to make your React applications blazing fast.",
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
    coverImage: postImages[2],
    category: "Development",
    readTime: 10,
    publishedAt: "2024-01-22",
    likes: 567,
    comments: 89,
    shares: 234,
  },
  {
    id: "post-4",
    title: "Creating Accessible Color Palettes",
    excerpt:
      "How to design color schemes that work for everyone, including users with visual impairments.",
    content: `Accessibility should be at the forefront of every design decision. When it comes to color, this means ensuring sufficient contrast and considering various forms of color blindness.

## Understanding WCAG Guidelines

The Web Content Accessibility Guidelines (WCAG) provide specific contrast ratios:
- Normal text: 4.5:1
- Large text: 3:1
- UI components: 3:1

## Tools for Testing

Several tools can help you create accessible color palettes...`,
    coverImage: postImages[3],
    category: "Design",
    readTime: 7,
    publishedAt: "2024-01-19",
    likes: 345,
    comments: 56,
    shares: 178,
  },
  {
    id: "post-5",
    title: "The Future of Web Development",
    excerpt:
      "Exploring emerging trends and technologies shaping the future of web development.",
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
    coverImage: postImages[4],
    category: "Technology",
    readTime: 12,
    publishedAt: "2024-01-16",
    likes: 789,
    comments: 134,
    shares: 456,
  },
  {
    id: "post-6",
    title: "Mastering CSS Grid Layout",
    excerpt: "A comprehensive guide to creating complex layouts with CSS Grid.",
    content: `CSS Grid has revolutionized web layout. It provides a two-dimensional layout system that makes complex designs simple to implement.

## Grid Fundamentals

Grid allows you to work with both rows and columns simultaneously, giving you unprecedented control over your layouts.

## Practical Examples

Let's explore common layout patterns and how to implement them with Grid...`,
    coverImage: postImages[5],
    category: "Development",
    readTime: 9,
    publishedAt: "2024-01-13",
    likes: 432,
    comments: 78,
    shares: 210,
  },
  {
    id: "post-7",
    title: "Exploring Mountain Landscapes",
    excerpt: "Capturing the beauty of nature through photography.",
    content: `Mountain photography requires patience, skill, and the right timing. The golden hour provides the most dramatic lighting for landscape shots.`,
    coverImage: postImages[6],
    category: "Photography",
    readTime: 5,
    publishedAt: "2024-01-10",
    likes: 892,
    comments: 112,
    shares: 345,
  },
  {
    id: "post-8",
    title: "Modern UI Design Patterns",
    excerpt: "Essential design patterns every designer should know.",
    content: `From card layouts to navigation patterns, understanding common UI design patterns helps create intuitive user experiences.`,
    coverImage: postImages[7],  
    category: "Design",
    readTime: 7,
    publishedAt: "2024-01-08",
    likes: 623,
    comments: 89,
    shares: 234,
  },
  {
    id: "post-9",
    title: "Coastal Photography Tips",
    excerpt: "How to capture stunning seascape photographs.",
    content: `The coast offers endless opportunities for photography. Learn how to work with waves, tides, and light to create memorable images.`,
    coverImage: postImages[8],
    category: "Photography",
    readTime: 6,
    publishedAt: "2024-01-05",
    likes: 1234,
    comments: 156,
    shares: 478,
  },
  {
    id: "post-10",
    title: "Typography in Web Design",
    excerpt: "Choosing and using fonts effectively.",
    content: `Typography is one of the most important aspects of web design. It affects readability, hierarchy, and overall user experience.`,
    coverImage: postImages[9],
    category: "Design",
    readTime: 8,
    publishedAt: "2024-01-03",
    likes: 745,
    comments: 92,
    shares: 287,
  },
  {
    id: "post-11",
    title: "Nature's Color Palette",
    excerpt: "Finding inspiration in the natural world.",
    content: `Nature provides the most beautiful color combinations. Observe and learn from the world around you.`,
    coverImage: postImages[10],
    category: "Photography",
    readTime: 4,
    publishedAt: "2024-01-01",
    likes: 934,
    comments: 124,
    shares: 356,
  },
  {
    id: "post-12",
    title: "Responsive Design Best Practices",
    excerpt: "Creating websites that work on all devices.",
    content: `Responsive design is no longer optional. Learn the best practices for creating websites that adapt to any screen size.`,
    coverImage: postImages[11],
    category: "Development",
    readTime: 9,
    publishedAt: "2023-12-28",
    likes: 512,
    comments: 67,
    shares: 198,
  },
  {
    id: "post-13",  
    title: "Forest Photography Adventures",
    excerpt: "Exploring the mysteries of woodland photography.",
    content: `Forests present unique challenges for photographers. Low light, dense foliage, and changing conditions require adaptability.`,
    coverImage: postImages[12],
    category: "Photography",
    readTime: 6,
    publishedAt: "2023-12-25",
    likes: 1098,
    comments: 145,
    shares: 423,
  },
  {
    id: "post-14",
    title: "Animation in Web Design",
    excerpt: "Using motion to enhance user experience.",
    content: `Subtle animations can guide users, provide feedback, and make interfaces feel more alive. Learn when and how to use them effectively.`,
    coverImage: postImages[13],
    category: "Design",
    readTime: 7,
    publishedAt: "2023-12-22",
    likes: 678,
    comments: 94,
    shares: 267,
  },
  {
    id: "post-15",
    title: "Sunset Photography Techniques",
    excerpt: "Capturing the magic of golden hour.",
    content: `Sunset photography is about more than just pointing and shooting. Learn to work with changing light and create stunning silhouettes.`,
    coverImage: postImages[14],
    category: "Photography",
    readTime: 5,
    publishedAt: "2023-12-20",
    likes: 1456,
    comments: 189,
    shares: 534,
  },
  {
    id: "post-16",
    title: "Dark Mode Design",
    excerpt: "Creating beautiful dark mode interfaces.",
    content: `Dark mode is more than inverting colors. Learn how to design interfaces that look great in both light and dark themes.`,
    coverImage: postImages[15],
    category: "Design",
    readTime: 6,
    publishedAt: "2023-12-18",
    likes: 823,
    comments: 107,
    shares: 312,
  },
  {
    id: "post-17",
    title: "Alpine Photography Guide",
    excerpt: "Photographing high altitude landscapes.",
    content: `Mountain photography at high altitudes presents unique challenges. Prepare properly and capture breathtaking views.`,
    coverImage: postImages[16],
    category: "Photography",
    readTime: 8,
    publishedAt: "2023-12-15",
    likes: 1267,
    comments: 163,
    shares: 489,
  },
  {
    id: "post-18",
    title: "Minimalist Photography",
    excerpt: "Less is more in visual storytelling.",
    content: `Minimalist photography focuses on simplicity, negative space, and essential elements to create powerful images.`,
    coverImage: postImages[17],
    category: "Photography",
    readTime: 5,
    publishedAt: "2023-12-12",
    likes: 945,
    comments: 128,
    shares: 378,
  },
];

export function getPost(id: string): Post | undefined {
  return posts.find((post) => post.id === id);
}

export function getPostsByCategory(category: string): Post[] {
  return posts.filter((post) => post.category === category);
}

export function getRelatedPosts(currentId: string, limit: number = 3): Post[] {
  const currentPost = getPost(currentId);
  if (!currentPost) return [];

  // Prioritize same category
  const sameCategoryPosts = posts.filter(
    (p) => p.id !== currentId && p.category === currentPost.category,
  );

  const otherPosts = posts
    .filter((p) => p.id !== currentId && p.category !== currentPost.category)
    .sort(() => Math.random() - 0.5);

  return [...sameCategoryPosts, ...otherPosts].slice(0, limit);
}

export function getProfile(): Profile {
  return profile;
}
