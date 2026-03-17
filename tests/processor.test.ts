import { describe, it, expect, afterEach } from 'vitest';
import { MdProcessor } from '$lib/processor.js';

afterEach(() => {
	// Reset global plugins between tests
	MdProcessor.setGlobalPlugins({});
});

describe('MdProcessor.parse', () => {
	it('parses a paragraph into MDAST', () => {
		const root = MdProcessor.parse('Hello world');
		expect(root.type).toBe('root');
		expect(root.children).toHaveLength(1);
		expect(root.children[0].type).toBe('paragraph');
	});

	it('parses headings', () => {
		const root = MdProcessor.parse('# H1\n## H2\n### H3');
		const headings = root.children.filter((c) => c.type === 'heading');
		expect(headings).toHaveLength(3);
		expect(headings[0]).toMatchObject({ type: 'heading', depth: 1 });
		expect(headings[1]).toMatchObject({ type: 'heading', depth: 2 });
		expect(headings[2]).toMatchObject({ type: 'heading', depth: 3 });
	});

	it('parses code blocks', () => {
		const root = MdProcessor.parse('```js\nconst x = 1;\n```');
		expect(root.children[0]).toMatchObject({
			type: 'code',
			lang: 'js',
			value: 'const x = 1;'
		});
	});

	it('parses lists', () => {
		const root = MdProcessor.parse('- a\n- b\n- c');
		expect(root.children[0]).toMatchObject({ type: 'list', ordered: false });
	});

	it('parses tables as paragraphs without GFM plugin', () => {
		// Tables are a GFM extension; without remark-gfm, they parse as paragraphs
		const md = '| A | B |\n|---|---|\n| 1 | 2 |';
		const root = MdProcessor.parse(md);
		expect(root.children[0].type).toBe('paragraph');
	});

	it('parses definitions', () => {
		const root = MdProcessor.parse('[example]: https://example.com "Example"');
		expect(root.children[0]).toMatchObject({
			type: 'definition',
			identifier: 'example',
			url: 'https://example.com',
			title: 'Example'
		});
	});

	it('returns empty root for empty input', () => {
		const root = MdProcessor.parse('');
		expect(root.type).toBe('root');
		expect(root.children).toHaveLength(0);
	});
});

describe('MdProcessor.process', () => {
	it('converts markdown to HTML', () => {
		const html = MdProcessor.process('**bold**');
		expect(html).toContain('<strong>bold</strong>');
	});

	it('converts headings to HTML', () => {
		const html = MdProcessor.process('# Title');
		expect(html).toContain('<h1>Title</h1>');
	});
});

describe('MdProcessor.setGlobalPlugins', () => {
	it('integrates remark plugins', () => {
		// A simple remark plugin that uppercases all text nodes
		const uppercasePlugin = () => (tree: import('mdast').Root) => {
			const visit = (node: import('mdast').Root | import('mdast').RootContent) => {
				if (node.type === 'text') {
					node.value = node.value.toUpperCase();
				}
				if ('children' in node) {
					node.children.forEach(visit);
				}
			};
			visit(tree);
		};

		MdProcessor.setGlobalPlugins({ remarkPlugins: [uppercasePlugin] });
		const html = MdProcessor.process('hello world');
		expect(html).toContain('HELLO WORLD');
	});
});
