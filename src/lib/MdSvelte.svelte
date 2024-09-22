<script lang="ts">
	import Parser from './Parser.svelte';
	import { MdProcessor } from './processor.js';
	import { defaultRenderers, type Renderers } from './options.js';

	export let source: string;
	export let renderers: Partial<Renderers> = {};

	$: rootNode = MdProcessor.parse(source);

	$: footnotes = rootNode.children.filter((node) => node.type === 'footnoteDefinition');

	$: combinedRenderers = { ...defaultRenderers, ...renderers };
</script>

<Parser node={rootNode} renderers={combinedRenderers} />

{#if footnotes.length}
	<svelte:component this={combinedRenderers.footnoteDefinition} nodes={footnotes} />
{/if}
