import { faker } from '@faker-js/faker';

const fakerSeed = 123;
faker.seed(fakerSeed);

export class Post {
	id: string;
	#coverImage: string;
	name: string;
	content?: string;
	description: string;
	author: string;
	date: string;
	tags: string[];
	readTime: number;

	constructor(data: Omit<Post, 'coverImage' | 'profileImage'>) {
		this.id = data.id;
		this.#coverImage = faker.image.url();
		this.name = data.name;
		this.content = data.content;
		this.description = data.description;
		this.author = data.author;
		this.date = data.date;
		this.tags = data.tags;
		this.readTime = data.readTime;
	}

	get coverImage(): string {
		return this.#coverImage;
	}

	set coverImage(value: string) {
		this.#coverImage = value;
	}
}

export const POSTS = [
	new Post({
		id: 'fade',
		name: 'Fade',
		description:
			'Use the built-in functions to make your site more dynamic and engaging. With a few lines of code, you can add smooth transitions to your site.',
		tags: ['Build-in', 'Transitions', 'Fade'],
		date: '2023-09-01',
		readTime: 1,
		author: 'SSGOI'
	}),
	new Post({
		id: 'scroll',
		name: 'Scroll',
		description: 'Smooth scroll-based transitions for directional page changes.',
		tags: ['Build-in', 'Transitions', 'Scroll'],
		date: '2023-09-01',
		readTime: 1,
		author: 'SSGOI'
	}),
	new Post({
		id: 'ripple',
		name: 'Ripple',
		description: 'Creates a circular reveal/hide effect, like a ripple in water.',
		tags: ['Build-in', 'Transitions', 'Ripple'],
		date: '2023-09-01',
		readTime: 1,
		author: 'SSGOI'
	}),
	new Post({
		id: 'pinterest',
		name: 'Pinterest',
		description:
			'Perfect for image gallery transitions with elements that match between pages. Works in pairs using data-pinterest-key attributes.',
		tags: ['Build-in', 'Transitions', 'Pinterest'],
		date: '2023-09-01',
		readTime: 1,
		author: 'SSGOI'
	}),
	new Post({
		id: 'hero',
		name: 'Hero',
		description:
			'Smooth transitions between related elements across pages using data-hero-key attributes.',
		tags: ['Build-in', 'Transitions', 'Hero'],
		date: '2023-09-01',
		readTime: 1,
		author: 'SSGOI'
	})
];
