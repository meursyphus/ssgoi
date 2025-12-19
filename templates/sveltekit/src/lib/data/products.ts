export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	originalPrice?: number;
	image: string;
	category: string;
	rating: number;
	reviews: number;
	inStock: boolean;
	badge?: 'new' | 'sale' | 'bestseller';
	features: string[];
	images: string[];
}

const productImages = [
	'/demo/products/1-400x400.jpg',
	'/demo/products/119-400x400.jpg',
	'/demo/products/96-400x400.jpg',
	'/demo/products/214-400x400.jpg',
	'/demo/products/21-400x400.jpg',
	'/demo/products/225-400x400.jpg',
	'/demo/products/160-400x400.jpg',
	'/demo/products/139-400x400.jpg',
	'/demo/products/250-400x400.jpg',
	'/demo/products/431-400x400.jpg',
	'/demo/products/256-400x400.jpg',
	'/demo/products/292-400x400.jpg'
];

export const products: Product[] = [
	{
		id: 'prod-1',
		name: 'Premium Wireless Headphones',
		description: 'Experience crystal-clear audio with our latest noise-cancelling technology.',
		price: 299.99,
		originalPrice: 399.99,
		image: productImages[0],
		category: 'Electronics',
		rating: 4.8,
		reviews: 1234,
		inStock: true,
		badge: 'sale',
		features: [
			'Active Noise Cancellation',
			'30-hour battery life',
			'Premium comfort fit',
			'Hi-Res Audio'
		],
		images: [productImages[0]]
	},
	{
		id: 'prod-2',
		name: 'Minimalist Leather Backpack',
		description: 'Handcrafted from premium leather, this backpack combines style with functionality.',
		price: 189.0,
		image: productImages[1],
		category: 'Fashion',
		rating: 4.9,
		reviews: 567,
		inStock: true,
		badge: 'new',
		features: ['Genuine leather', 'Laptop compartment', 'Water-resistant', 'Lifetime warranty'],
		images: [productImages[1]]
	},
	{
		id: 'prod-3',
		name: 'Smart Home Hub Pro',
		description:
			'Control your entire home with one device. Compatible with all major smart home brands.',
		price: 149.99,
		image: productImages[2],
		category: 'Electronics',
		rating: 4.6,
		reviews: 892,
		inStock: true,
		badge: 'bestseller',
		features: ['Voice control', 'App integration', 'Energy monitoring', 'Easy setup'],
		images: [productImages[2]]
	},
	{
		id: 'prod-4',
		name: 'Organic Face Serum',
		description: 'Revitalize your skin with our all-natural, cruelty-free face serum.',
		price: 78.0,
		originalPrice: 98.0,
		image: productImages[3],
		category: 'Beauty',
		rating: 4.7,
		reviews: 2103,
		inStock: true,
		badge: 'sale',
		features: [
			'100% Organic',
			'Vitamin C & E',
			'Anti-aging formula',
			'Suitable for all skin types'
		],
		images: [productImages[3]]
	},
	{
		id: 'prod-5',
		name: 'Professional Yoga Mat',
		description: 'Extra-thick, non-slip yoga mat designed for comfort and stability.',
		price: 68.0,
		image: productImages[4],
		category: 'Sports',
		rating: 4.9,
		reviews: 445,
		inStock: true,
		features: ['6mm thickness', 'Non-slip surface', 'Eco-friendly material', 'Carrying strap included'],
		images: [productImages[4]]
	},
	{
		id: 'prod-6',
		name: 'Ceramic Coffee Set',
		description: 'Handmade ceramic coffee set that brings elegance to your morning routine.',
		price: 124.99,
		image: productImages[5],
		category: 'Home',
		rating: 4.8,
		reviews: 334,
		inStock: false,
		badge: 'new',
		features: ['Handcrafted', 'Set of 4 cups', 'Dishwasher safe', 'Gift box included'],
		images: [productImages[5]]
	},
	{
		id: 'prod-7',
		name: 'Wireless Charging Station',
		description:
			'Charge all your devices simultaneously with this sleek 3-in-1 charging station.',
		price: 89.99,
		image: productImages[6],
		category: 'Electronics',
		rating: 4.5,
		reviews: 1567,
		inStock: true,
		features: ['Fast charging', '3 devices at once', 'LED indicators', 'Overcharge protection'],
		images: [productImages[6]]
	},
	{
		id: 'prod-8',
		name: 'Sustainable Water Bottle',
		description: 'Stay hydrated in style with our eco-friendly, insulated water bottle.',
		price: 34.99,
		image: productImages[7],
		category: 'Sports',
		rating: 4.7,
		reviews: 789,
		inStock: true,
		badge: 'bestseller',
		features: ['24-hour cold', '12-hour hot', 'BPA-free', 'Leak-proof lid'],
		images: [productImages[7]]
	},
	{
		id: 'prod-9',
		name: 'Designer Sunglasses',
		description: 'Protect your eyes with style. UV400 protection meets timeless design.',
		price: 156.0,
		originalPrice: 195.0,
		image: productImages[8],
		category: 'Fashion',
		rating: 4.6,
		reviews: 234,
		inStock: true,
		badge: 'sale',
		features: ['UV400 protection', 'Polarized lenses', 'Lightweight frame', 'Includes case'],
		images: [productImages[8]]
	},
	{
		id: 'prod-10',
		name: 'Essential Oil Diffuser',
		description:
			'Transform your space with aromatherapy. Features mood lighting and timer settings.',
		price: 45.99,
		image: productImages[9],
		category: 'Home',
		rating: 4.8,
		reviews: 1890,
		inStock: true,
		features: ['7 LED colors', 'Auto shut-off', 'Whisper quiet', '300ml capacity'],
		images: [productImages[9]]
	},
	{
		id: 'prod-11',
		name: 'Fitness Tracker Pro',
		description: 'Track your health and fitness goals with our advanced activity monitor.',
		price: 199.99,
		image: productImages[10],
		category: 'Electronics',
		rating: 4.7,
		reviews: 3421,
		inStock: true,
		badge: 'bestseller',
		features: ['Heart rate monitor', 'Sleep tracking', 'Water resistant', '7-day battery'],
		images: [productImages[10]]
	},
	{
		id: 'prod-12',
		name: 'Luxury Candle Set',
		description:
			'Hand-poured soy candles with premium fragrances to create the perfect ambiance.',
		price: 58.0,
		image: productImages[11],
		category: 'Home',
		rating: 4.9,
		reviews: 567,
		inStock: true,
		badge: 'new',
		features: ['100% soy wax', '3 unique scents', '40-hour burn time', 'Reusable glass jars'],
		images: [productImages[11]]
	}
];

export function getProductsByCategory(category: string): Product[] {
	if (category === 'all') return products;
	return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}
