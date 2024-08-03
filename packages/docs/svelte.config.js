import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex , escapeSvelte } from 'mdsvex';
import { getSingletonHighlighter } from 'shiki'
import remarkUnwrapImages from 'remark-unwrap-images'
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const highlighter = await getSingletonHighlighter({
				themes: ['poimandres'],
				langs: ['javascript', 'typescript', 'bash', 'svelte']
			})
			await highlighter.loadLanguage('javascript', 'typescript', 'svelte', 'bash', )
			const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme: 'poimandres' }))
			return `{@html \`${html}\` }`
		}
	},
	remarkPlugins: [remarkUnwrapImages, [remarkToc, { tight: true }]],
	rehypePlugins: [rehypeSlug]
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter()
	}
};

export default config;