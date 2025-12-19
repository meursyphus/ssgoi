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
  readTime: number;
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
  bio: "Creative developer & designer. Building beautiful digital experiences. Coffee enthusiast.",
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
      "Learn how to create buttery-smooth page transitions that delight users.",
    content: `Page transitions have become an essential part of modern web applications.`,
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
    excerpt: "Exploring the principles of minimalism in digital design.",
    content: `Minimalism isn't just about using less - it's about using only what's necessary.`,
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
    excerpt: "Practical techniques to make your React applications blazing fast.",
    content: `Performance is crucial for user experience.`,
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
    excerpt: "How to design color schemes that work for everyone.",
    content: `Accessibility should be at the forefront of every design decision.`,
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
    excerpt: "Exploring emerging trends and technologies.",
    content: `The web development landscape is constantly evolving.`,
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
    content: `CSS Grid has revolutionized web layout.`,
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
    content: `Mountain photography requires patience and skill.`,
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
    content: `From card layouts to navigation patterns.`,
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
    content: `The coast offers endless opportunities for photography.`,
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
    content: `Typography is one of the most important aspects of web design.`,
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
    content: `Nature provides the most beautiful color combinations.`,
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
    content: `Responsive design is no longer optional.`,
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
    content: `Forests present unique challenges for photographers.`,
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
    content: `Subtle animations can guide users and make interfaces feel alive.`,
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
    content: `Sunset photography is about more than just pointing and shooting.`,
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
    content: `Dark mode is more than inverting colors.`,
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
    content: `Mountain photography at high altitudes presents unique challenges.`,
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
    content: `Minimalist photography focuses on simplicity and negative space.`,
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

  const sameCategoryPosts = posts.filter(
    (p) => p.id !== currentId && p.category === currentPost.category
  );

  const otherPosts = posts.filter(
    (p) => p.id !== currentId && p.category !== currentPost.category
  );

  return [...sameCategoryPosts, ...otherPosts].slice(0, limit);
}

export function getProfile(): Profile {
  return profile;
}
