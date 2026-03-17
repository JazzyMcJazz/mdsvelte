import { describe, it, expect, afterEach } from 'vitest';
import remarkGfm from 'remark-gfm';
import { IncrementalParser } from '$lib/incremental.js';
import { MdProcessor } from '$lib/processor.js';

afterEach(() => {
	MdProcessor.setGlobalPlugins({});
});

describe('IncrementalParser', () => {
	describe('basic parsing', () => {
		it('parses a simple paragraph', () => {
			const parser = new IncrementalParser();
			const root = parser.update('Hello world');
			expect(root.type).toBe('root');
			expect(root.children).toHaveLength(1);
			expect(root.children[0].type).toBe('paragraph');
		});

		it('returns empty root for empty input', () => {
			const parser = new IncrementalParser();
			const root = parser.update('');
			expect(root.type).toBe('root');
			expect(root.children).toHaveLength(0);
		});

		it('parses multiple blocks', () => {
			const parser = new IncrementalParser();
			const root = parser.update('# Heading\n\nParagraph\n\n- item 1\n- item 2');
			expect(root.children).toHaveLength(3);
			expect(root.children[0].type).toBe('heading');
			expect(root.children[1].type).toBe('paragraph');
			expect(root.children[2].type).toBe('list');
		});
	});

	describe('incremental updates', () => {
		it('produces correct AST after incremental appends', () => {
			const parser = new IncrementalParser();

			let root = parser.update('# Hello');
			expect(root.children).toHaveLength(1);
			expect(root.children[0].type).toBe('heading');

			root = parser.update('# Hello\n\nWorld');
			expect(root.children).toHaveLength(2);
			expect(root.children[0].type).toBe('heading');
			expect(root.children[1].type).toBe('paragraph');

			root = parser.update('# Hello\n\nWorld\n\n## Another heading');
			expect(root.children).toHaveLength(3);
			expect(root.children[0].type).toBe('heading');
			expect(root.children[1].type).toBe('paragraph');
			expect(root.children[2].type).toBe('heading');
		});

		it('reuses cached block references for finalized blocks', () => {
			const parser = new IncrementalParser();

			// First update: heading + paragraph (2 blocks, neither finalized yet)
			parser.update('# Hello\n\nWorld');

			// Second update: add a third block — now the heading is finalized
			const root2 = parser.update('# Hello\n\nWorld\n\n## Third');

			// Third update: add a fourth block — now heading and paragraph are finalized
			const root3 = parser.update('# Hello\n\nWorld\n\n## Third\n\nFourth');

			// The heading block should be the same reference (cached)
			expect(root3.children[0]).toBe(root2.children[0]);
		});

		it('does not reuse the active (last) block', () => {
			const parser = new IncrementalParser();

			const root1 = parser.update('# Hello\n\nWorld');
			const lastBlock1 = root1.children[root1.children.length - 1];

			const root2 = parser.update('# Hello\n\nWorld, more text');
			const lastBlock2 = root2.children[root2.children.length - 1];

			// The paragraph grew, so it should NOT be the same reference
			expect(lastBlock2).not.toBe(lastBlock1);
		});
	});

	describe('block boundary detection', () => {
		it('handles fenced code blocks with internal blank lines', () => {
			const parser = new IncrementalParser();
			const md = '# Title\n\n```\nline 1\n\nline 2\n\nline 3\n```\n\nParagraph';
			const root = parser.update(md);
			expect(root.children).toHaveLength(3);
			expect(root.children[0].type).toBe('heading');
			expect(root.children[1].type).toBe('code');
			expect(root.children[2].type).toBe('paragraph');
		});

		it('handles fenced code blocks with tilde markers', () => {
			const parser = new IncrementalParser();
			const md = '~~~\ncode\n\nmore code\n~~~\n\nAfter';
			const root = parser.update(md);
			expect(root.children).toHaveLength(2);
			expect(root.children[0].type).toBe('code');
			expect(root.children[1].type).toBe('paragraph');
		});

		it('handles ATX headings as block boundaries', () => {
			const parser = new IncrementalParser();
			const root = parser.update('# H1\n\n## H2\n\n### H3');
			expect(root.children).toHaveLength(3);
			expect(root.children.every((c) => c.type === 'heading')).toBe(true);
		});

		it('handles thematic breaks', () => {
			const parser = new IncrementalParser();
			const root = parser.update('Before\n\n---\n\nAfter');
			expect(root.children).toHaveLength(3);
			expect(root.children[0].type).toBe('paragraph');
			expect(root.children[1].type).toBe('thematicBreak');
			expect(root.children[2].type).toBe('paragraph');
		});

		it('handles lists', () => {
			const parser = new IncrementalParser();
			const root = parser.update('Intro\n\n- item 1\n- item 2\n- item 3\n\nOutro');
			expect(root.children).toHaveLength(3);
			expect(root.children[0].type).toBe('paragraph');
			expect(root.children[1].type).toBe('list');
			expect(root.children[2].type).toBe('paragraph');
		});

		it('handles blockquotes', () => {
			const parser = new IncrementalParser();
			const root = parser.update('Before\n\n> quoted\n> text\n\nAfter');
			expect(root.children).toHaveLength(3);
			expect(root.children[0].type).toBe('paragraph');
			expect(root.children[1].type).toBe('blockquote');
			expect(root.children[2].type).toBe('paragraph');
		});
	});

	describe('streaming simulation', () => {
		it('handles token-by-token paragraph building', () => {
			const parser = new IncrementalParser();
			const tokens = ['H', 'el', 'lo', ' ', 'wo', 'rld'];
			let source = '';
			let root;

			for (const token of tokens) {
				source += token;
				root = parser.update(source);
			}

			expect(root!.children).toHaveLength(1);
			expect(root!.children[0].type).toBe('paragraph');
		});

		it('handles streaming a heading then paragraph', () => {
			const parser = new IncrementalParser();
			const chunks = ['# ', 'Head', 'ing', '\n\n', 'Para', 'graph'];
			let source = '';
			let root;

			for (const chunk of chunks) {
				source += chunk;
				root = parser.update(source);
			}

			expect(root!.children).toHaveLength(2);
			expect(root!.children[0].type).toBe('heading');
			expect(root!.children[1].type).toBe('paragraph');
		});

		it('handles streaming a code block', () => {
			const parser = new IncrementalParser();
			const chunks = ['```', 'js\n', 'const x', ' = 1;\n', '```', '\n\nDone'];
			let source = '';
			let root;

			for (const chunk of chunks) {
				source += chunk;
				root = parser.update(source);
			}

			expect(root!.children).toHaveLength(2);
			expect(root!.children[0].type).toBe('code');
			expect(root!.children[1].type).toBe('paragraph');
		});
	});

	describe('reset and source replacement', () => {
		it('resets on non-append source change', () => {
			const parser = new IncrementalParser();

			parser.update('# Hello\n\nWorld\n\nThird block');
			const root = parser.update('Completely different text');

			expect(root.children).toHaveLength(1);
			expect(root.children[0].type).toBe('paragraph');
		});

		it('explicit reset clears state', () => {
			const parser = new IncrementalParser();

			parser.update('# Hello\n\nWorld');
			parser.reset();

			const root = parser.update('New content');
			expect(root.children).toHaveLength(1);
			expect(root.children[0].type).toBe('paragraph');
		});
	});

	describe('cross-reference invalidation', () => {
		it('resolves footnote references when definition arrives after reference', () => {
			MdProcessor.setGlobalPlugins({ remarkPlugins: [remarkGfm] });
			const parser = new IncrementalParser();

			// Stream content with a footnote reference first
			let source = 'Here is a footnote[^1].\n\n';
			parser.update(source);

			// Add more blocks so the first one gets cached
			source += 'Some other paragraph.\n\n';
			parser.update(source);

			source += 'Yet another paragraph.\n\n';
			parser.update(source);

			// Now the definition arrives
			source += '[^1]: This is the footnote content.';
			const root = parser.update(source);

			// The tree should contain both footnoteReference and footnoteDefinition
			const hasFootnoteRef = JSON.stringify(root).includes('"type":"footnoteReference"');
			const hasFootnoteDef = root.children.some((c) => c.type === 'footnoteDefinition');

			expect(hasFootnoteDef).toBe(true);
			expect(hasFootnoteRef).toBe(true);
		});

		it('handles footnote definition appearing mid-stream', () => {
			MdProcessor.setGlobalPlugins({ remarkPlugins: [remarkGfm] });
			const parser = new IncrementalParser();

			// Build up incrementally with chunks
			const chunks = [
				'Text with ref[^note].',
				'\n\nAnother paragraph.',
				'\n\nThird paragraph.',
				'\n\n[^note]: The definition.'
			];

			let source = '';
			let root;
			for (const chunk of chunks) {
				source += chunk;
				root = parser.update(source);
			}

			const hasFootnoteRef = JSON.stringify(root).includes('"type":"footnoteReference"');
			const hasFootnoteDef = root!.children.some((c) => c.type === 'footnoteDefinition');

			expect(hasFootnoteDef).toBe(true);
			expect(hasFootnoteRef).toBe(true);
		});
	});

	describe('equivalence with full parse', () => {
		it('produces structurally equivalent AST to full parse', () => {
			const parser = new IncrementalParser();
			const md = [
				'# Title',
				'',
				'A paragraph with **bold** and *italic*.',
				'',
				'```js',
				'const x = 1;',
				'```',
				'',
				'- item 1',
				'- item 2',
				'',
				'> blockquote',
				'',
				'---',
				'',
				'Another paragraph.'
			].join('\n');

			// Simulate streaming: build up the source token by token
			let source = '';
			let incrementalRoot;
			for (const char of md) {
				source += char;
				incrementalRoot = parser.update(source);
			}

			// Full parse of the same content
			const fullRoot = MdProcessor.parse(md);
			MdProcessor.run(fullRoot);

			// Compare structure (types and counts)
			expect(incrementalRoot!.children.length).toBe(fullRoot.children.length);
			for (let i = 0; i < fullRoot.children.length; i++) {
				expect(incrementalRoot!.children[i].type).toBe(fullRoot.children[i].type);
			}
		});
	});
});
