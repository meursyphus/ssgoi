export interface ProfilePost {
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
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    aspectRatio: '2/3',
  },
  {
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop',
    aspectRatio: '1/1',
  },
  {
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=500&fit=crop',
    aspectRatio: '4/5',
  },
  {
    url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=450&fit=crop',
    aspectRatio: '8/9',
  },
  {
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=550&fit=crop',
    aspectRatio: '4/5.5',
  },
  {
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=350&fit=crop',
    aspectRatio: '8/7',
  },
  {
    url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=480&fit=crop',
    aspectRatio: '5/6',
  },
  {
    url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&h=420&fit=crop',
    aspectRatio: '20/21',
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=520&fit=crop',
    aspectRatio: '10/13',
  },
  {
    url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&h=380&fit=crop',
    aspectRatio: '20/19',
  },
  {
    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=460&fit=crop',
    aspectRatio: '20/23',
  },
  {
    url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=500&fit=crop',
    aspectRatio: '4/5',
  },
  {
    url: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=400&h=600&fit=crop',
    aspectRatio: '2/3',
  },
  {
    url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=350&fit=crop',
    aspectRatio: '8/7',
  },
  {
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=520&fit=crop',
    aspectRatio: '10/13',
  },
  {
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=450&fit=crop',
    aspectRatio: '8/9',
  },
  {
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=580&fit=crop',
    aspectRatio: '20/29',
  },
  {
    url: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&h=400&fit=crop',
    aspectRatio: '1/1',
  },
];

export const profile: Profile = {
  id: 'user-1',
  name: 'Alex Chen',
  username: '@alexchen',
  bio: 'Creative developer & designer. Building beautiful digital experiences. Coffee enthusiast.',
  avatar: '/demo/profiles/avatar-7.jpg',
  coverImage: '/demo/profiles/45-800x240.jpg',
  followers: 12543,
  following: 892,
  posts: 18,
  verified: true,
  joinedAt: '2021-03-15',
  location: 'San Francisco, CA',
  website: 'https://alexchen.dev',
  socials: {
    twitter: 'alexchen',
    instagram: 'alex.chen',
    github: 'alexchen-dev',
  },
};

const postTitles = [
  'Building Smooth Page Transitions in Modern Web Apps',
  'The Art of Minimalist Design',
  'Performance Optimization Tips for React Apps',
  'Creating Accessible Color Palettes',
  'The Future of Web Development',
  'Mastering CSS Grid Layout',
  'Exploring Mountain Landscapes',
  'Modern UI Design Patterns',
  'Coastal Photography Tips',
  'Typography in Web Design',
  "Nature's Color Palette",
  'Responsive Design Best Practices',
  'Forest Photography Adventures',
  'Animation in Web Design',
  'Sunset Photography Techniques',
  'Dark Mode Design',
  'Alpine Photography Guide',
  'Minimalist Photography',
];

const categories = ['Development', 'Design', 'Photography', 'Technology'];

const readTimeValues = [5, 8, 6, 10, 7, 4, 9, 5, 8, 6];
const likesValues = [234, 456, 567, 345, 789, 432, 892, 623, 1234, 745, 934, 512, 1098, 678, 1456, 823, 1267, 945];
const commentsValues = [45, 67, 89, 56, 134, 78, 112, 89, 156, 92, 124, 67, 145, 94, 189, 107, 163, 128];
const sharesValues = [89, 123, 234, 178, 456, 210, 345, 234, 478, 287, 356, 198, 423, 267, 534, 312, 489, 378];

export const profilePosts: ProfilePost[] = postImages.map((img, index) => ({
  id: `post-${index + 1}`,
  title: postTitles[index],
  excerpt: `A brief description of ${postTitles[index].toLowerCase()}.`,
  content: `Detailed content about ${postTitles[index].toLowerCase()}.`,
  coverImage: img,
  category: categories[index % categories.length],
  readTime: readTimeValues[index % readTimeValues.length],
  publishedAt: "2024-01-15T00:00:00.000Z",
  likes: likesValues[index % likesValues.length],
  comments: commentsValues[index % commentsValues.length],
  shares: sharesValues[index % sharesValues.length],
}));

export function useProfilePost(id: string) {
  return profilePosts.find((post) => post.id === id);
}

export function useAllProfilePosts() {
  return profilePosts;
}

export function useProfile() {
  return profile;
}

export function useRelatedProfilePosts(currentId: string, limit: number = 3) {
  const currentPost = useProfilePost(currentId);
  if (!currentPost) return [];

  const sameCategoryPosts = profilePosts.filter(
    (p) => p.id !== currentId && p.category === currentPost.category
  );

  const otherPosts = profilePosts
    .filter((p) => p.id !== currentId && p.category !== currentPost.category);

  return [...sameCategoryPosts, ...otherPosts].slice(0, limit);
}
