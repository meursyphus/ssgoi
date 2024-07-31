import type { Post } from '$lib/types';
import type { LayoutServerLoad } from './$types';

export async function load({ fetch }) {
	const response = await fetch('/api/posts')
	const posts: Post[] = await response.json()
	return { posts }
}
