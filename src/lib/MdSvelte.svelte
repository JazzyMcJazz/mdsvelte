<script lang="ts">
	import Parser from './Parser.svelte';
	import { MdProcessor } from './processor.js';
	import { defaultRenderers, type Renderers } from './options.js';

	interface Props {
		source: string;
		renderers?: Partial<Renderers>;
	}

	let { source, renderers = {} }: Props = $props();

	let node = $derived(MdProcessor.parse(source));

	let definitions = $derived(node.children.filter((node) => node.type === 'definition'));

	let combinedRenderers = $derived({ ...defaultRenderers, ...renderers }) as Renderers;
</script>

{#each definitions as definition}
	<combinedRenderers.definition node={definition} />
{/each}

<Parser {node} renderers={combinedRenderers} />
