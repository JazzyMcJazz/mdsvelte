import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import MdSvelte from '$lib/MdSvelte.svelte';

describe('MdSvelte SSR', () => {
	it('renders markdown to HTML on the server', () => {
		const { body } = render(MdSvelte, { props: { source: '# Hello\n\nWorld' } });
		expect(body).toContain('Hello');
		expect(body).toContain('World');
	});

	it('renders inline formatting in SSR', () => {
		const { body } = render(MdSvelte, {
			props: { source: '**bold** and *italic*' }
		});
		expect(body).toContain('<strong>');
		expect(body).toContain('<em>');
	});

	it('renders links in SSR', () => {
		const { body } = render(MdSvelte, {
			props: { source: '[click](https://example.com)' }
		});
		expect(body).toContain('href="https://example.com"');
		expect(body).toContain('click');
	});

	it('renders code blocks in SSR', () => {
		const { body } = render(MdSvelte, {
			props: { source: '```\ncode here\n```' }
		});
		expect(body).toContain('<pre>');
		expect(body).toContain('code here');
	});

	it('renders empty source in SSR without errors', () => {
		const { body } = render(MdSvelte, { props: { source: '' } });
		expect(body).toBeDefined();
	});
});
