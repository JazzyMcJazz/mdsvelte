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
	import type { Root, Definition } from 'mdast';
	import { setContext } from 'svelte';
	import Parser from './Parser.svelte';
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
	}

	let { source, renderers = {}, onparse }: Props = $props();

	let node = $derived.by(() => {
		const mdast = MdProcessor.parse(source);
		MdProcessor.run(mdast); // Run plugins
		return mdast;
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
		if (onparse) onparse(node);
	});
</script>

<Parser {node} renderers={combinedRenderers} />
