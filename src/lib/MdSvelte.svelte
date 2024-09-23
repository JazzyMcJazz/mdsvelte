<script lang="ts">
	import Parser from './Parser.svelte';
	import { MdProcessor } from './processor.js';
	import { defaultRenderers, type Renderers } from './options.js';

	export let source: string;
	export let renderers: Partial<Renderers> = {};

	$: node = MdProcessor.parse(source);

	$: definitions = node.children.filter((node) => node.type === 'definition');

	$: combinedRenderers = { ...defaultRenderers, ...renderers };
</script>

{#each definitions as definition}
	<svelte:component this={combinedRenderers.definition} node={definition} />
{/each}

<Parser {node} renderers={combinedRenderers} />
