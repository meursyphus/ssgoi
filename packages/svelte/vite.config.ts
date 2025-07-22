import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		rollupOptions: {
			external: (id) => {
				// Don't externalize @ssgoi/core - bundle it
				if (id === '@ssgoi/core' || id.startsWith('@ssgoi/core/')) {
					return false;
				}
				// Externalize other dependencies
				return id.startsWith('svelte') || id.startsWith('@sveltejs');
			}
		}
	}
});
