import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, output } from '@angular/core';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  readTime: number;
  date: string;
  content: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'drill-1',
    title: 'Building Modern Web Applications with Next.js 14',
    excerpt:
      "Explore the latest features and best practices for creating performant web apps with Next.js 14's new app router.",
    coverImage:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
    author: {
      name: 'Alex Johnson',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    },
    category: 'Development',
    readTime: 8,
    date: '2024-01-15',
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
    id: 'drill-2',
    title: 'Understanding Spring-based Animations in Web',
    excerpt:
      'Learn how physics-based animations create more natural and delightful user experiences.',
    coverImage:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop',
    author: {
      name: 'Sarah Chen',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    category: 'Animation',
    readTime: 6,
    date: '2024-01-12',
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
    id: 'drill-3',
    title: 'The Future of Page Transitions on the Web',
    excerpt:
      'How modern libraries are bringing native app-like transitions to web applications.',
    coverImage:
      'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600&fit=crop',
    author: {
      name: 'Mike Davis',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    category: 'UX Design',
    readTime: 10,
    date: '2024-01-10',
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
    id: 'drill-4',
    title: 'Mastering TypeScript Generics',
    excerpt:
      'A comprehensive guide to understanding and using TypeScript generics effectively.',
    coverImage:
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop',
    author: {
      name: 'Emily Rodriguez',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    category: 'TypeScript',
    readTime: 12,
    date: '2024-01-08',
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
    id: 'drill-5',
    title: 'Performance Optimization Techniques for React',
    excerpt:
      'Best practices and strategies to optimize React application performance.',
    coverImage:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    author: {
      name: 'James Wilson',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    category: 'React',
    readTime: 9,
    date: '2024-01-05',
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
    id: 'drill-6',
    title: 'CSS Grid vs Flexbox: When to Use Which',
    excerpt:
      'A detailed comparison of CSS Grid and Flexbox to help you choose the right layout tool.',
    coverImage:
      'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=600&fit=crop',
    author: {
      name: 'Lisa Park',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    },
    category: 'CSS',
    readTime: 7,
    date: '2024-01-03',
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

@Component({
  selector: 'app-drill-posts-list',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-6',
  },
  template: `
    <!-- Header -->
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-white mb-2">Blog Posts</h1>
      <p class="text-gray-400">
        Experience the drill transition effect when navigating between posts
      </p>
    </div>

    <!-- Posts Grid -->
    <div class="max-w-4xl mx-auto space-y-4">
      @for (post of blogPosts; track post.id) {
        <article
          class="bg-gray-800 rounded-lg p-4 transition-all duration-300 hover:bg-gray-750 hover:shadow-lg hover:translate-x-1 cursor-pointer"
          (click)="navigate.emit('/posts/' + post.id)"
        >
          <div class="flex gap-4">
            <!-- Cover Image -->
            <div class="flex-shrink-0">
              <img
                [src]="post.coverImage"
                [alt]="post.title"
                class="w-24 h-24 object-cover rounded-lg"
              />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-2">
                <span
                  class="text-xs text-teal-400 font-medium uppercase tracking-wider"
                >
                  {{ post.category }}
                </span>
                <span class="text-xs text-gray-500">{{ post.date }}</span>
              </div>

              <h2 class="text-xl font-semibold text-white mb-2 line-clamp-1">
                {{ post.title }}
              </h2>

              <p class="text-gray-400 text-sm mb-3 line-clamp-2">
                {{ post.excerpt }}
              </p>

              <!-- Meta Info -->
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-2">
                  <img
                    [src]="post.author.avatar"
                    [alt]="post.author.name"
                    class="w-5 h-5 rounded-full"
                  />
                  <span class="text-xs text-gray-300">
                    {{ post.author.name }}
                  </span>
                </div>
                <span class="text-xs text-gray-600">•</span>
                <span class="text-xs text-gray-500">
                  {{ post.readTime }} min read
                </span>
              </div>
            </div>
          </div>
        </article>
      }
    </div>
  `,
})
export class DrillPostsListComponent {
  navigate = output<string>();
  readonly blogPosts = BLOG_POSTS;
}
