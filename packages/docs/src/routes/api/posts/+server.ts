import { json } from '@sveltejs/kit'
import type { Post } from '$lib/types'

type DocStructure = Record<string, number>;

const ssogiDocsOrder: DocStructure = {
  "Getting Started": 1,
  "Advanced": 2,
  "Reference": 3,
  "Community": 4
};

async function getPosts() {
	let posts: Post[] = []

	const paths = await import.meta.glob('/src/posts/*.md', { eager: true })

	for (const path in paths) {
		const file = paths[path]
		const slug = path.split('/').at(-1)?.replace('.md', '')

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>
			const post = { ...metadata, slug } satisfies Post
			posts.push(post)
		}
	}

	posts = posts.sort((a, b) => {
		// 먼저 group으로 정렬
		const groupOrderA = ssogiDocsOrder[a.group] || Number.MAX_SAFE_INTEGER;
		const groupOrderB = ssogiDocsOrder[b.group] || Number.MAX_SAFE_INTEGER;
		
		if (groupOrderA !== groupOrderB) {
			return groupOrderA - groupOrderB;
		}
		
		// group이 같은 경우 order로 정렬
		return a.order - b.order;
	})

	return posts
}

export async function GET() {
	const posts = await getPosts()
	return json(posts)
}