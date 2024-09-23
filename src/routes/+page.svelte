<script lang="ts">
	import { MdSvelte } from '$lib/index.js';

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
		// Image Reference
		`![Alt text][image]

[image]: https://picsum.photos/seed/picsum/200/300 "Image Reference"`,
		// Inline Code
		'`console.log("Hello, World!");`',
		// Link
		'[Link](https://example.com)',
		// Link Reference
		`[Link][example]

[example]: https://example.com "Link Reference"`,
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
		'```javascript\nconst message = "Hello, World!"\nconsole.log(message);\n```'
	];
</script>

{#each sources as source}
	<MdSvelte {source} />
{/each}

<style>
	:global(body) {
		background-color: black;
		color: white;
	}

	:global(span[aria-hidden='true']) {
		display: none;
	}
	:global(.height-1000) {
		display: block;
		height: 1000px;
	}
</style>
