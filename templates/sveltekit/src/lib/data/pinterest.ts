export interface PinterestItem {
	id: string;
	title: string;
	description: string;
	content: string;
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
	ingredients?: string[];
	materials?: string[];
	steps?: string[];
}

const localImageData = [
	{ id: 10, width: 400, height: 400 },
	{ id: 11, width: 400, height: 667 },
	{ id: 12, width: 400, height: 800 },
	{ id: 13, width: 400, height: 533 },
	{ id: 14, width: 400, height: 1000 },
	{ id: 15, width: 400, height: 800 },
	{ id: 16, width: 400, height: 600 },
	{ id: 17, width: 400, height: 667 },
	{ id: 18, width: 400, height: 400 },
	{ id: 19, width: 400, height: 667 },
	{ id: 20, width: 400, height: 800 },
	{ id: 21, width: 400, height: 533 },
	{ id: 22, width: 400, height: 1000 },
	{ id: 23, width: 400, height: 800 },
	{ id: 24, width: 400, height: 600 }
];

const categories = ['Design', 'Art', 'Photography', 'Fashion', 'Food', 'Travel', 'DIY', 'Home'];

const aspectRatios = [
	'2 / 2',
	'3 / 5',
	'2 / 4',
	'3 / 4',
	'2 / 5',
	'3 / 6',
	'2 / 3',
	'3 / 5'
];

const pinContents: Record<
	string,
	{
		title: string;
		content: string;
		steps?: string[];
		ingredients?: string[];
		materials?: string[];
	}
> = {
	Design: {
		title: 'Minimalist Living Room Design',
		content:
			'Transform your living space with these minimalist design principles. Less is more when it comes to creating a peaceful, clutter-free environment.',
		steps: [
			'Choose a neutral color palette',
			'Select furniture with clean lines',
			'Maximize natural light',
			'Add plants for organic elements',
			'Keep surfaces clutter-free'
		]
	},
	Art: {
		title: 'Abstract Watercolor Techniques',
		content: 'Master the art of abstract watercolor painting with these professional techniques.',
		materials: ['Watercolor paper', 'Quality brushes', 'Watercolor paints', 'Masking fluid', 'Salt for texture'],
		steps: [
			'Prepare your paper with water',
			'Apply wet-on-wet technique',
			'Layer colors while wet',
			'Add salt for texture',
			'Let it dry naturally'
		]
	},
	Photography: {
		title: 'Golden Hour Portrait Tips',
		content: 'Capture stunning portraits during the magical golden hour. Learn how to use natural light.',
		steps: [
			'Scout locations beforehand',
			'Use backlighting creatively',
			'Shoot in RAW format',
			'Use reflectors to fill shadows',
			'Experiment with lens flare'
		]
	},
	Fashion: {
		title: 'Capsule Wardrobe Essentials',
		content:
			'Build a versatile wardrobe with these timeless pieces. Mix and match to create countless outfits.',
		materials: ['White t-shirt', 'Black blazer', 'Blue jeans', 'Little black dress', 'White sneakers', 'Leather jacket']
	},
	Food: {
		title: 'One-Pot Mediterranean Pasta',
		content:
			'A delicious and healthy dinner ready in 30 minutes. Mediterranean-inspired dish packed with flavor.',
		ingredients: ['Olive oil', 'Garlic', 'Cherry tomatoes', 'Spinach', 'Feta cheese', 'Pasta', 'Olives', 'Basil'],
		steps: [
			'Sauté garlic in olive oil',
			'Add tomatoes and cook until burst',
			'Add pasta and vegetable broth',
			'Simmer until pasta is cooked',
			'Stir in spinach and feta'
		]
	},
	Travel: {
		title: 'Hidden Gems of Kyoto',
		content:
			'Discover the lesser-known temples and gardens of Kyoto. Escape the crowds and experience authentic Japanese culture.',
		steps: [
			'Visit early morning or late afternoon',
			"Explore Philosopher's Path",
			'Find hidden temple gardens',
			'Try local street food',
			'Stay in traditional ryokan'
		]
	},
	DIY: {
		title: 'Macrame Wall Hanging',
		content:
			'Create a boho-chic macrame wall hanging for your home. This beginner-friendly project adds texture and warmth.',
		materials: ['Macrame cord', 'Wooden dowel', 'Scissors', 'Measuring tape', 'Comb'],
		steps: [
			'Cut cord to required lengths',
			'Attach cords to dowel',
			'Create square knots pattern',
			'Add fringe at bottom',
			'Trim and comb out ends'
		]
	},
	Home: {
		title: 'Small Space Organization Hacks',
		content: 'Maximize every inch of your small space with these clever organization solutions.',
		steps: [
			'Use vertical wall space',
			'Invest in multi-functional furniture',
			'Create zones for activities',
			'Use clear storage containers',
			'Implement daily tidying routine'
		]
	}
};

const authorBios = [
	'Interior designer and lifestyle blogger sharing daily inspiration',
	"Professional photographer capturing life's beautiful moments",
	'DIY enthusiast helping you create your dream home on a budget',
	'Food lover exploring cuisines from around the world',
	'Fashion stylist curating looks for every occasion'
];

const savesValues = [1234, 2456, 3678, 890, 4123, 567, 2890, 1567, 3234, 789, 4567, 1890, 2345, 678, 3456];
const followersValues = [5432, 8765, 3210, 9876, 6543, 4321, 7654, 2109, 8901, 5678, 3456, 7890, 1234, 6789, 4567];

export const pinterestItems: PinterestItem[] = localImageData.map((imageData, index) => {
	const category = categories[index % categories.length];
	const contentData = pinContents[category];

	return {
		id: `pin-${index + 1}`,
		title: contentData.title,
		description: `Discover amazing ideas and inspiration for your next project. This pin showcases beautiful ${category.toLowerCase()} concepts.`,
		content: contentData.content,
		image: `/demo/pinterest/${imageData.id}-${imageData.width}x${imageData.height}.jpg`,
		aspectRatio: aspectRatios[index % aspectRatios.length],
		category,
		saves: savesValues[index % savesValues.length],
		author: {
			name: ['Emma Wilson', 'Alex Chen', 'Sarah Kim', 'Mike Davis', 'Lisa Park'][index % 5],
			avatar: `/demo/pinterest/avatar-${(index % 5) + 1}.jpg`,
			followers: followersValues[index % followersValues.length],
			bio: authorBios[index % authorBios.length]
		},
		tags: getTags(category),
		createdAt: '2024-01-15T00:00:00.000Z',
		...(contentData.ingredients && { ingredients: contentData.ingredients }),
		...(contentData.materials && { materials: contentData.materials }),
		...(contentData.steps && { steps: contentData.steps })
	};
});

function getTags(category: string): string[] {
	const tagsByCategory: Record<string, string[]> = {
		Design: ['minimal', 'modern', 'creative', 'inspiration', 'ui', 'ux'],
		Art: ['painting', 'digital', 'illustration', 'abstract', 'contemporary'],
		Photography: ['portrait', 'landscape', 'street', 'nature', 'black-white'],
		Fashion: ['style', 'outfit', 'trend', 'vintage', 'streetwear'],
		Food: ['recipe', 'healthy', 'dessert', 'vegan', 'cooking'],
		Travel: ['adventure', 'wanderlust', 'destination', 'explore', 'vacation'],
		DIY: ['craft', 'handmade', 'tutorial', 'upcycle', 'home-decor'],
		Home: ['interior', 'decor', 'organization', 'cozy', 'renovation']
	};

	const tags = tagsByCategory[category] || ['inspiration', 'ideas', 'creative'];
	return tags.slice(0, 3);
}

export function getPinterestItem(id: string): PinterestItem | undefined {
	return pinterestItems.find((item) => item.id === id);
}

export function getRelatedPins(currentId: string, limit: number = 6): PinterestItem[] {
	const currentPin = getPinterestItem(currentId);
	if (!currentPin) return [];

	const sameCategoryPins = pinterestItems.filter(
		(item) => item.id !== currentId && item.category === currentPin.category
	);

	const otherPins = pinterestItems.filter(
		(item) => item.id !== currentId && item.category !== currentPin.category
	);

	return [...sameCategoryPins, ...otherPins].slice(0, limit);
}
