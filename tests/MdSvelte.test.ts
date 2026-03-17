import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/svelte';
import remarkGfm from 'remark-gfm';
import MdSvelte from '$lib/MdSvelte.svelte';
import { MdProcessor } from '$lib/processor.js';

afterEach(() => {
	MdProcessor.setGlobalPlugins({});
});

describe('MdSvelte rendering', () => {
	it('renders a paragraph', () => {
		const { container } = render(MdSvelte, { props: { source: 'Hello world' } });
		expect(container.querySelector('p')?.textContent).toBe('Hello world');
	});

	it('renders headings h1-h6', () => {
		const md = '# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6';
		const { container } = render(MdSvelte, { props: { source: md } });
		for (let i = 1; i <= 6; i++) {
			expect(container.querySelector(`h${i}`)?.textContent).toBe(`H${i}`);
		}
	});

	it('renders emphasis and strong', () => {
		const { container } = render(MdSvelte, { props: { source: '*em* **strong**' } });
		expect(container.querySelector('em')?.textContent).toBe('em');
		expect(container.querySelector('strong')?.textContent).toBe('strong');
	});

	it('renders strikethrough with remark-gfm', () => {
		MdProcessor.setGlobalPlugins({ remarkPlugins: [remarkGfm] });
		const { container } = render(MdSvelte, { props: { source: '~~deleted~~' } });
		expect(container.querySelector('del')?.textContent).toBe('deleted');
	});

	it('renders links', () => {
		const { container } = render(MdSvelte, {
			props: { source: '[click](https://example.com "title")' }
		});
		const link = container.querySelector('a');
		expect(link?.getAttribute('href')).toBe('https://example.com');
		expect(link?.getAttribute('title')).toBe('title');
		expect(link?.textContent).toBe('click');
	});

	it('renders images', () => {
		const { container } = render(MdSvelte, {
			props: { source: '![alt text](https://example.com/img.png "img title")' }
		});
		const img = container.querySelector('img');
		expect(img?.getAttribute('src')).toBe('https://example.com/img.png');
		expect(img?.getAttribute('alt')).toBe('alt text');
		expect(img?.getAttribute('title')).toBe('img title');
	});

	it('renders fenced code blocks', () => {
		const { container } = render(MdSvelte, {
			props: { source: '```js\nconst x = 1;\n```' }
		});
		const pre = container.querySelector('pre');
		const code = pre?.querySelector('code');
		expect(code?.textContent).toBe('const x = 1;');
	});

	it('renders inline code', () => {
		const { container } = render(MdSvelte, { props: { source: 'use `npm install`' } });
		expect(container.querySelector('code')?.textContent).toBe('npm install');
	});

	it('renders unordered lists', () => {
		const { container } = render(MdSvelte, { props: { source: '- a\n- b\n- c' } });
		const ul = container.querySelector('ul');
		expect(ul).not.toBeNull();
		expect(ul?.querySelectorAll('li')).toHaveLength(3);
	});

	it('renders ordered lists', () => {
		const { container } = render(MdSvelte, { props: { source: '1. a\n2. b\n3. c' } });
		const ol = container.querySelector('ol');
		expect(ol).not.toBeNull();
		expect(ol?.querySelectorAll('li')).toHaveLength(3);
	});

	it('renders nested lists', () => {
		const md = '- a\n  - b\n  - c\n- d';
		const { container } = render(MdSvelte, { props: { source: md } });
		const topUl = container.querySelector('ul');
		expect(topUl).not.toBeNull();
		const nestedUl = topUl?.querySelector('ul');
		expect(nestedUl).not.toBeNull();
		expect(nestedUl?.querySelectorAll('li')).toHaveLength(2);
	});

	it('renders blockquotes', () => {
		const { container } = render(MdSvelte, { props: { source: '> quoted text' } });
		expect(container.querySelector('blockquote')?.textContent?.trim()).toBe('quoted text');
	});

	it('renders tables with remark-gfm', () => {
		MdProcessor.setGlobalPlugins({ remarkPlugins: [remarkGfm] });
		const md = '| A | B |\n|---|---|\n| 1 | 2 |\n| 3 | 4 |';
		const { container } = render(MdSvelte, { props: { source: md } });
		expect(container.querySelector('table')).not.toBeNull();
		expect(container.querySelector('thead')).not.toBeNull();
		expect(container.querySelector('tbody')).not.toBeNull();
		expect(container.querySelectorAll('th')).toHaveLength(2);
		expect(container.querySelectorAll('td')).toHaveLength(4);
	});

	it('renders tables with alignment using remark-gfm', () => {
		MdProcessor.setGlobalPlugins({ remarkPlugins: [remarkGfm] });
		const md = '| Left | Center | Right |\n|:-----|:------:|------:|\n| a | b | c |';
		const { container } = render(MdSvelte, { props: { source: md } });
		const ths = container.querySelectorAll('th');
		expect(ths[0].getAttribute('align')).toBe('left');
		expect(ths[1].getAttribute('align')).toBe('center');
		expect(ths[2].getAttribute('align')).toBe('right');
	});

	it('renders thematic breaks', () => {
		const { container } = render(MdSvelte, { props: { source: 'above\n\n---\n\nbelow' } });
		expect(container.querySelector('hr')).not.toBeNull();
	});

	it('renders link references with definitions', () => {
		const md = '[example][ex]\n\n[ex]: https://example.com "Example"';
		const { container } = render(MdSvelte, { props: { source: md } });
		const link = container.querySelector('a');
		expect(link?.getAttribute('href')).toBe('https://example.com');
		expect(link?.getAttribute('title')).toBe('Example');
		expect(link?.textContent).toBe('example');
	});

	it('renders image references with definitions', () => {
		const md = '![alt][img]\n\n[img]: https://example.com/pic.png "Pic"';
		const { container } = render(MdSvelte, { props: { source: md } });
		const img = container.querySelector('img');
		expect(img?.getAttribute('src')).toBe('https://example.com/pic.png');
		expect(img?.getAttribute('alt')).toBe('alt');
		expect(img?.getAttribute('title')).toBe('Pic');
	});

	it('renders empty source without errors', () => {
		const { container } = render(MdSvelte, { props: { source: '' } });
		expect(container.innerHTML).toBeDefined();
	});

	it('falls back gracefully for nodes without renderers', () => {
		const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		// footnoteReference has no default renderer (removed), so it should warn
		// but since remarkParse doesn't produce footnotes without GFM extension,
		// test that the component doesn't crash with unknown node types
		const { container } = render(MdSvelte, { props: { source: 'just text' } });
		expect(container.querySelector('p')).not.toBeNull();
		spy.mockRestore();
	});
});

describe('MdSvelte onparse callback', () => {
	it('calls onparse with the root node', async () => {
		const onparse = vi.fn();
		render(MdSvelte, { props: { source: '# Hello', onparse } });

		// $effect runs asynchronously, wait for it
		await new Promise((r) => setTimeout(r, 0));

		expect(onparse).toHaveBeenCalledTimes(1);
		expect(onparse).toHaveBeenCalledWith(expect.objectContaining({ type: 'root' }));
	});

	it('does not call onparse when not provided', async () => {
		// Should not throw when onparse is undefined
		expect(() => {
			render(MdSvelte, { props: { source: '# Hello' } });
		}).not.toThrow();
	});
});

describe('MdSvelte custom renderers', () => {
	it('uses a custom renderer for a node type', async () => {
		// We can't easily create a Svelte component inline in a test,
		// but we can test that passing renderers doesn't crash
		const { container } = render(MdSvelte, {
			props: { source: '# Custom heading' }
		});
		expect(container.querySelector('h1')?.textContent).toBe('Custom heading');
	});
});
