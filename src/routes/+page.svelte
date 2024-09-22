<script lang="ts">
	import { MdProcessor, MdSvelte } from '$lib/index.js';
	import rehypeHighlight from 'rehype-highlight';
	import rehypeKatex from 'rehype-katex';
	import remarkMath from 'remark-math';
	import remarkGfm from 'remark-gfm';

	MdProcessor.addPlugins([remarkGfm, remarkMath, rehypeKatex, rehypeHighlight]);

	const sources: string[] = [
		// Headers
		'# Header 1',
		'## Header 2',
		'### Header 3',
		'#### Header 4',
		'##### Header 5',
		'###### Header 6',
		// Blockquote
		'> Blockquote',
		// Delete
		'~~Strikethrough~~',
		// Emphasis
		'*Italic*',
		// Strong
		'**Bold**',
		// Emphasis and Strong
		'***Italic and Bold***',
		// Thematic break
		'---',
		// Hhtml
		'<div>Hello, World!</div>',
		// Image
		'![Alt text](https://picsum.photos/seed/picsum/200/300)',
		// Inline Code
		'`console.log("Hello, World!");`',
		// Link
		'[Link](https://example.com)',
		// List
		'- Item 1\n- Item 2\n- Item 3',
		'1. Item 1\n2. Item 2\n3. Item 3',
		// Paragraph
		'Hello, World!',
		// Paragraphs with breaks
		'Hello, World!\n\nHello, World!',
		// Table
		'| Header 1 | Header 2 | Header 3 |\n| --- | --- | --- |\n| Row 1 | Row 1 | Row 1 |\n| Row 2 | Row 2 | Row 2 |',
		// Code
		'```javascript\nconsole.log("Hello, World!");\n```',
		// Math
		'Hello\n$$\nx = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\n$$\nWorld!',
		// Inline Math
		'Hello $e=mc^2$ World!',
		// Footnote Reference and Definition
		'Reference[^1]\n\n<span class="height-1000"></span>\n\n[^1]: Footnote'
	];
</script>

{#each sources as source}
	<MdSvelte {source} />
{/each}

<style>
	:global(span[aria-hidden='true']) {
		display: none;
	}
	:global(.height-1000) {
		display: block;
		height: 1000px;
	}
</style>
