import { sveltekit } from '@sveltejs/kit/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit(), svelteTesting()],
	test: {
		environment: 'jsdom',
		projects: [
			{
				extends: true,
				test: {
					name: 'client',
					environment: 'jsdom',
					include: ['tests/**/*.test.ts'],
					exclude: ['tests/**/*.ssr.test.ts']
				}
			},
			{
				plugins: [svelte()],
				resolve: {
					alias: { $lib: new URL('./src/lib', import.meta.url).pathname }
				},
				test: {
					name: 'ssr',
					environment: 'node',
					include: ['tests/**/*.ssr.test.ts']
				}
			}
		]
	}
});
