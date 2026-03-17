# MdSvelte

A markdown parser that renders into Svelte components. Inspired by [svelte-markdown](https://www.npmjs.com/package/svelte-markdown), but uses [remark-parse](https://www.npmjs.com/package/remark-parse) under the hood instead of marked.

Features incremental parsing with block-level caching for efficient LLM streaming.

## Installation

```sh
npm i @jazzymcjazz/mdsvelte
```

## Requirements

Svelte 5 is required (as of version 0.3.0).

## Usage

### Basic

```svelte
<script>
	import { MdSvelte } from '@jazzymcjazz/mdsvelte';

	const source = `
# Some Header

Some paragraph

- List item
- List item with nested list items
  1. Item
  2. Item`;
</script>

<MdSvelte {source} />
```

### Custom Renderers

```svelte
<script>
	import { MdSvelte } from '@jazzymcjazz/mdsvelte';
	import MyCustomCodeComponent from '$lib/MyCustomCodeComponent.svelte';

	const source = '...';
</script>

<MdSvelte
	{source}
	renderers={{
		code: MyCustomCodeComponent
	}}
/>
```

Custom renderers receive a `node` prop (the MDAST node) and an optional `children` snippet for container nodes. You can add renderers for any node type, including those added by plugins (e.g., `math` and `inlineMath` from remark-math).

### Onparse Callback

Access the parsed AST via the `onparse` callback, which fires after each parse:

```svelte
<script>
	import { MdSvelte, type Root } from '@jazzymcjazz/mdsvelte';

	const source = '...';

	function onparse(node: Root) {
		console.log(node);
	}
</script>

<MdSvelte {source} {onparse} />
```

### Streaming / LLM Output

For streaming use cases (e.g., rendering LLM output token-by-token), use the `throttleMs` prop to batch rapid source updates. The incremental parser caches finalized blocks and only re-parses the active tail, reducing complexity from O(n²) to O(n).

```svelte
<script>
	import { MdSvelte } from '@jazzymcjazz/mdsvelte';

	let source = $state('');

	async function streamFromLLM() {
		for await (const token of llmStream) {
			source += token;
		}
	}
</script>

<MdSvelte {source} throttleMs={30} />
```

- `throttleMs` (default: `0`) — minimum interval in milliseconds between parses. Set to `0` to disable throttling. A value of `30` means ~33 parses/sec max.
- The throttle uses leading + trailing edges: the first change flushes immediately, subsequent changes are batched, and the final value is always captured.
- Without `throttleMs`, behavior is identical to a non-streaming setup.

### Plugins

You can use any remark/rehype plugins that work with unified. Remark plugins are added before `remark-rehype`, rehype plugins after:

```
unified → remarkParse → [remarkPlugins] → remarkRehype → [rehypePlugins] → rehypeStringify
```

#### Per-Instance Plugins

Pass plugins directly to individual `MdSvelte` instances:

```svelte
<script>
	import { MdSvelte } from '@jazzymcjazz/mdsvelte';
	import remarkGfm from 'remark-gfm';
	import remarkMath from 'remark-math';

	const source = '...';
</script>

<MdSvelte {source} remarkPlugins={[remarkGfm, remarkMath]} />
```

When any plugin prop is provided (even an empty array), the instance uses its own processor, ignoring global plugins.

#### Global Plugins

Use `MdProcessor.setGlobalPlugins` to configure plugins shared by all instances that don't have their own plugin props:

```svelte
<script>
	import { MdSvelte, MdProcessor } from '@jazzymcjazz/mdsvelte';
	import remarkGfm from 'remark-gfm';
	import remarkMath from 'remark-math';

	MdProcessor.setGlobalPlugins({
		remarkPlugins: [remarkGfm, remarkMath],
		remarkRehypeOptions: {}
	});

	const source = '...';
</script>

<MdSvelte {source} />
```

Note: MdSvelte renders MDAST nodes directly via Svelte components, not the rehype/HAST output. This means rehype plugins that transform HTML (like rehype-katex or rehype-highlight) won't affect rendering. Instead, use custom renderers for plugin-added node types. For example, to render math with KaTeX:

```svelte
<!-- MathBlock.svelte -->
<script>
	import katex from 'katex';
	let { node } = $props();
	let html = $derived(katex.renderToString(node.value, { displayMode: true, throwOnError: false }));
</script>

<div>{@html html}</div>
```

```svelte
<MdSvelte {source} renderers={{ math: MathBlock, inlineMath: MathInline }} />
```

## Props

| Prop                  | Type                   | Default  | Description                          |
| --------------------- | ---------------------- | -------- | ------------------------------------ |
| `source`              | `string`               | required | Markdown source text                 |
| `renderers`           | `Partial<Renderers>`   | `{}`     | Custom renderers for node types      |
| `onparse`             | `(node: Root) => void` | —        | Callback after each parse            |
| `throttleMs`          | `number`               | `0`      | Throttle interval for streaming (ms) |
| `remarkPlugins`       | `PluggableList`        | —        | Instance-level remark plugins        |
| `rehypePlugins`       | `PluggableList`        | —        | Instance-level rehype plugins        |
| `remarkRehypeOptions` | `RemarkRehypeOptions`  | —        | Instance-level remark-rehype options |

## Note

This is an early release. Expect breaking changes with each release until v1.0.
