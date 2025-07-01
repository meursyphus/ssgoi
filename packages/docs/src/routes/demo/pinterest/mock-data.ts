export interface PinterestItem {
  id: string;
  title: string;
  description: string;
  content: string; // Added detailed content
  image: string;
  aspectRatio: string;
  category: string;
  saves: number;
  author: {
    name: string;
    avatar: string;
    followers: number;
    bio: string;
  };
  tags: string[];
  createdAt: string;
  ingredients?: string[]; // For food category
  materials?: string[]; // For DIY category
  steps?: string[]; // For tutorials
  relatedPins?: string[]; // Related pin IDs
}

// Using picsum.photos with specific IDs for consistent images
const imageIds = [
  20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  30, 31, 32, 33, 34
].map(a => a - 10);

const categories = ['Design', 'Art', 'Photography', 'Fashion', 'Food', 'Travel', 'DIY', 'Home'];

const aspectRatios = ['2 / 2', '3 / 5', '2 / 4', '3 / 4', '2 / 5', '3 / 6', '2 / 3', '3 / 5'];

const pinContents = {
  'Design': [
    {
      title: 'Minimalist Living Room Design',
      content: 'Transform your living space with these minimalist design principles. Less is more when it comes to creating a peaceful, clutter-free environment.',
      steps: [
        'Choose a neutral color palette',
        'Select furniture with clean lines',
        'Maximize natural light',
        'Add plants for organic elements',
        'Keep surfaces clutter-free'
      ]
    },
    {
      title: 'Modern UI Design Trends 2024',
      content: 'Stay ahead of the curve with these cutting-edge UI design trends. From glassmorphism to 3D elements, discover what\'s shaping digital experiences.',
      steps: [
        'Implement dark mode options',
        'Use micro-interactions',
        'Apply glassmorphism effects',
        'Create immersive 3D elements',
        'Design for accessibility'
      ]
    }
  ],
  'Art': [
    {
      title: 'Abstract Watercolor Techniques',
      content: 'Master the art of abstract watercolor painting with these professional techniques. Create stunning pieces that capture emotion through color and flow.',
      materials: ['Watercolor paper', 'Quality brushes', 'Watercolor paints', 'Masking fluid', 'Salt for texture'],
      steps: [
        'Prepare your paper with water',
        'Apply wet-on-wet technique',
        'Layer colors while wet',
        'Add salt for texture',
        'Let it dry naturally'
      ]
    }
  ],
  'Photography': [
    {
      title: 'Golden Hour Portrait Tips',
      content: 'Capture stunning portraits during the magical golden hour. Learn how to use natural light to create warm, glowing photographs.',
      steps: [
        'Scout locations beforehand',
        'Use backlighting creatively',
        'Shoot in RAW format',
        'Use reflectors to fill shadows',
        'Experiment with lens flare'
      ]
    }
  ],
  'Fashion': [
    {
      title: 'Capsule Wardrobe Essentials',
      content: 'Build a versatile wardrobe with these timeless pieces. Mix and match to create countless outfits with minimal items.',
      materials: ['White t-shirt', 'Black blazer', 'Blue jeans', 'Little black dress', 'White sneakers', 'Leather jacket']
    }
  ],
  'Food': [
    {
      title: 'One-Pot Mediterranean Pasta',
      content: 'A delicious and healthy dinner ready in 30 minutes. This Mediterranean-inspired dish is packed with flavor and nutrients.',
      ingredients: ['Olive oil', 'Garlic', 'Cherry tomatoes', 'Spinach', 'Feta cheese', 'Pasta', 'Olives', 'Basil'],
      steps: [
        'Sauté garlic in olive oil',
        'Add tomatoes and cook until burst',
        'Add pasta and vegetable broth',
        'Simmer until pasta is cooked',
        'Stir in spinach and feta'
      ]
    }
  ],
  'Travel': [
    {
      title: 'Hidden Gems of Kyoto',
      content: 'Discover the lesser-known temples and gardens of Kyoto. Escape the crowds and experience authentic Japanese culture.',
      steps: [
        'Visit early morning or late afternoon',
        'Explore Philosopher\'s Path',
        'Find hidden temple gardens',
        'Try local street food',
        'Stay in traditional ryokan'
      ]
    }
  ],
  'DIY': [
    {
      title: 'Macrame Wall Hanging',
      content: 'Create a boho-chic macrame wall hanging for your home. This beginner-friendly project adds texture and warmth to any space.',
      materials: ['Macrame cord', 'Wooden dowel', 'Scissors', 'Measuring tape', 'Comb'],
      steps: [
        'Cut cord to required lengths',
        'Attach cords to dowel',
        'Create square knots pattern',
        'Add fringe at bottom',
        'Trim and comb out ends'
      ]
    }
  ],
  'Home': [
    {
      title: 'Small Space Organization Hacks',
      content: 'Maximize every inch of your small space with these clever organization solutions. Transform clutter into calm.',
      steps: [
        'Use vertical wall space',
        'Invest in multi-functional furniture',
        'Create zones for activities',
        'Use clear storage containers',
        'Implement daily tidying routine'
      ]
    }
  ]
};

const authorBios = [
  'Interior designer and lifestyle blogger sharing daily inspiration',
  'Professional photographer capturing life\'s beautiful moments',
  'DIY enthusiast helping you create your dream home on a budget',
  'Food lover exploring cuisines from around the world',
  'Fashion stylist curating looks for every occasion'
];

export const pinterestItems: PinterestItem[] = imageIds.map((imageId, index) => {
  const category = categories[index % categories.length];
  const categoryContents = pinContents[category as keyof typeof pinContents] || [];
  const contentData = categoryContents[index % categoryContents.length] || categoryContents[0] || {
    title: `${category} Inspiration`,
    content: `Discover amazing ${category.toLowerCase()} ideas and tips.`
  };
  
  // Calculate dimensions based on aspect ratio
  const width = 400;
  const aspectRatioParts = aspectRatios[index % aspectRatios.length].split(' / ');
  const height = Math.round(width * parseInt(aspectRatioParts[1]) / parseInt(aspectRatioParts[0]));
  
  return {
    id: `pin-${index + 1}`,
    description: `Discover amazing ideas and inspiration for your next project. This pin showcases beautiful ${category.toLowerCase()} concepts.`,
    image: `https://picsum.photos/id/${imageId}/${width}/${height}`,
    aspectRatio: aspectRatios[index % aspectRatios.length],
    category,
    saves: Math.floor(Math.random() * 5000) + 100,
    author: {
      name: ['Emma Wilson', 'Alex Chen', 'Sarah Kim', 'Mike Davis', 'Lisa Park'][index % 5],
      avatar: `https://i.pravatar.cc/150?img=${index + 1}`,
      followers: Math.floor(Math.random() * 10000) + 1000,
      bio: authorBios[index % authorBios.length]
    },
    tags: getRandomTags(category),
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    ...contentData
  };
});

function getRandomTags(category: string): string[] {
  const tagsByCategory: Record<string, string[]> = {
    'Design': ['minimal', 'modern', 'creative', 'inspiration', 'ui', 'ux'],
    'Art': ['painting', 'digital', 'illustration', 'abstract', 'contemporary'],
    'Photography': ['portrait', 'landscape', 'street', 'nature', 'black-white'],
    'Fashion': ['style', 'outfit', 'trend', 'vintage', 'streetwear'],
    'Food': ['recipe', 'healthy', 'dessert', 'vegan', 'cooking'],
    'Travel': ['adventure', 'wanderlust', 'destination', 'explore', 'vacation'],
    'DIY': ['craft', 'handmade', 'tutorial', 'upcycle', 'home-decor'],
    'Home': ['interior', 'decor', 'organization', 'cozy', 'renovation']
  };

  const tags = tagsByCategory[category] || ['inspiration', 'ideas', 'creative'];
  return tags.sort(() => Math.random() - 0.5).slice(0, 3);
}

export function getPinterestItem(id: string): PinterestItem | undefined {
  return pinterestItems.find(item => item.id === id);
}

export function getRelatedPins(currentId: string, limit: number = 6): PinterestItem[] {
  const currentPin = getPinterestItem(currentId);
  if (!currentPin) return [];

  // Find pins in the same category first
  const sameCategoryPins = pinterestItems
    .filter(item => item.id !== currentId && item.category === currentPin.category);
  
  const otherPins = pinterestItems
    .filter(item => item.id !== currentId && item.category !== currentPin.category)
    .sort(() => Math.random() - 0.5);

  return [...sameCategoryPins, ...otherPins].slice(0, limit);
}

export function getPinsByCategory(category: string): PinterestItem[] {
  return pinterestItems.filter(item => item.category === category);
}