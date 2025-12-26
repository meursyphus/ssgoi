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

// Using picsum.photos for images
const postImages = [
  { url: "https://picsum.photos/seed/prof0/400/600", aspectRatio: "2/3" },
  { url: "https://picsum.photos/seed/prof1/400/400", aspectRatio: "1/1" },
  { url: "https://picsum.photos/seed/prof2/400/500", aspectRatio: "4/5" },
  { url: "https://picsum.photos/seed/prof3/400/450", aspectRatio: "8/9" },
  { url: "https://picsum.photos/seed/prof4/400/550", aspectRatio: "4/5.5" },
  { url: "https://picsum.photos/seed/prof5/400/350", aspectRatio: "8/7" },
  { url: "https://picsum.photos/seed/prof6/400/480", aspectRatio: "5/6" },
  { url: "https://picsum.photos/seed/prof7/400/420", aspectRatio: "20/21" },
  { url: "https://picsum.photos/seed/prof8/400/520", aspectRatio: "10/13" },
  { url: "https://picsum.photos/seed/prof9/400/380", aspectRatio: "20/19" },
  { url: "https://picsum.photos/seed/prof10/400/460", aspectRatio: "20/23" },
  { url: "https://picsum.photos/seed/prof11/400/500", aspectRatio: "4/5" },
];

export const profile: Profile = {
  id: "user-1",
  name: "Alex Chen",
  username: "@alexchen",
  bio: "Creative developer & designer. Building beautiful digital experiences. Coffee enthusiast.",
  avatar: "https://picsum.photos/seed/profav/100/100",
  coverImage: "https://picsum.photos/seed/profcover/800/240",
  followers: 12543,
  following: 892,
  posts: 12,
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
