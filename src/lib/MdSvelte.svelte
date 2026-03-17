<!--
	@component

	A component that parses markdown source into an AST and renders it using a custom renderer.
	Supports incremental parsing with throttling for efficient LLM streaming.

	Example usage:

	```svelte
	<script>
		import { MdSvelte, type Root } from '@jazzymcjazz/mdsvelte';
		import CustomHeading from './CustomHeading.svelte';

		const markdown = '# Hello, World!';

		const customRenderers = {
			heading: CustomHeading,
		};

		const onparse = (node: Root) => {
			console.log(node);
		};
	</script>

	<MdSvelte
		source={markdown}
		renderers={customRenderers}
		onparse={onparse}
		throttleMs={30}
	/>
	```
-->
<script lang="ts">
	import type { Root, Definition } from 'mdast';
	import type { PluggableList } from 'unified';
	import type { Options as RemarkRehypeOptions } from 'remark-rehype';
	import { setContext, untrack } from 'svelte';
	import Parser from './Parser.svelte';
	import { IncrementalParser } from './incremental.js';
	import { MdProcessor } from './processor.js';
	import { defaultRenderers, type Renderers } from './options.js';
	import { createReferences } from './references.js';

	interface Props {
		/**
		 * The markdown source to parse.
		 */
		source: string;
		/**
		 * Custom renderers for specific node types.
		 */
		renderers?: Partial<Renderers>;
		/**
		 * Callback that is called after the markdown source is parsed into an AST.
		 * @param node The root node of the parsed AST.
		 */
		onparse?: (node: Root) => void;
		/**
		 * Throttle interval in milliseconds for debouncing rapid source updates (e.g., LLM streaming).
		 * Set to 0 to disable throttling. Default: 0 (no throttling).
		 */
		throttleMs?: number;
		/**
		 * Instance-level remark plugins. When provided, overrides global plugins for this instance.
		 */
		remarkPlugins?: PluggableList;
		/**
		 * Instance-level rehype plugins. When provided, overrides global plugins for this instance.
		 */
		rehypePlugins?: PluggableList;
		/**
		 * Instance-level remark-rehype options. When provided, overrides global options for this instance.
		 */
		remarkRehypeOptions?: RemarkRehypeOptions;
	}

	let {
		source,
		renderers = {},
		onparse,
		throttleMs = 0,
		remarkPlugins,
		rehypePlugins,
		remarkRehypeOptions
	}: Props = $props();

	const parser = untrack(() => {
		const hasInstancePlugins = remarkPlugins || rehypePlugins || remarkRehypeOptions;
		const processor = hasInstancePlugins
			? MdProcessor.createInstance({ remarkPlugins, rehypePlugins, remarkRehypeOptions })
			: undefined;
		return new IncrementalParser(processor);
	});

	let throttledSource = $state('');
	let lastFlush = 0;
	let trailingTimer: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		const src = source;
		if (throttleMs <= 0) {
			throttledSource = src;
			return;
		}

		const now = Date.now();
		const elapsed = now - lastFlush;

		// Clear any pending trailing update
		if (trailingTimer !== null) clearTimeout(trailingTimer);

		if (elapsed >= throttleMs) {
			// Enough time has passed — flush immediately (leading edge)
			throttledSource = src;
			lastFlush = now;
		}

		// Always schedule a trailing update to capture the final value
		trailingTimer = setTimeout(() => {
			trailingTimer = null;
			throttledSource = src;
			lastFlush = Date.now();
		}, throttleMs);

		return () => {
			if (trailingTimer !== null) clearTimeout(trailingTimer);
		};
	});

	// Use throttledSource when throttling is active, source directly otherwise.
	// In SSR, $effect doesn't run, so we fall back to source directly.
	let effectiveSource = $derived(throttleMs > 0 ? throttledSource : source);

	let node = $derived.by(() => {
		return parser.update(effectiveSource);
	});

	let definitions = $derived(
		node.children.filter((child): child is Definition => child.type === 'definition')
	);

	let refs = $derived(createReferences(definitions));

	setContext('mdsvelte-references', {
		get: (id: string) => refs.get(id)
	});

	let combinedRenderers = $derived({ ...defaultRenderers, ...renderers }) as Renderers;

	$effect(() => {
		const n = node;
		untrack(() => {
			if (onparse) onparse(n);
		});
	});
</script>

<Parser {node} renderers={combinedRenderers} />
