<!-- 
	@component
	
	A component that parses markdown source into an AST and renders it using a custom renderer.

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
	/>
	```
-->
<script lang="ts">
	import type { Root } from 'mdast';
	import Parser from './Parser.svelte';
	import { MdProcessor } from './processor.js';
	import { defaultRenderers, type Renderers } from './options.js';

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
	}

	let { source, renderers = {}, onparse = () => {} }: Props = $props();

	let node = $derived.by(() => {
		const mdast = MdProcessor.parse(source);
		MdProcessor.run(mdast); // Run plugins
		return mdast;
	});

	let definitions = $derived(node.children.filter((node) => node.type === 'definition'));

	let combinedRenderers = $derived({ ...defaultRenderers, ...renderers }) as Renderers;

	$effect(() => onparse(node));
</script>

{#each definitions as definition}
	<combinedRenderers.definition node={definition} />
{/each}

<Parser {node} renderers={combinedRenderers} />
