export type Categories = 'sveltekit' | 'svelte'

export type Post = {
	title: string
	slug: string
	description: string
	order: number
	group: string
}