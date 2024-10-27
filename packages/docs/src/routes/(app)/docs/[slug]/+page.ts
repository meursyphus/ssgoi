import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
		const post = await import(`../../../../posts/${params.slug}.md`)

		return {
			content: post.default,
			pageMetaTags: {
				title: `${post.metadata.title} - SSGOI Documentation`,
				description: post.metadata.description,
				openGraph: {
					type: 'article',
					title: post.metadata.title,
					description: post.metadata.description,
				},
				twitter: {
					title: post.metadata.title,
					description: post.metadata.description,
				},
			},
		}
	} catch (e) {
		error(404, `Could not find ${params.slug}`)
	}
};
