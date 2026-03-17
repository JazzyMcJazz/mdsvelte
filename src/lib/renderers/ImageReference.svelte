<script lang="ts">
	import type { Definition } from 'mdast';
	import { getContext } from 'svelte';

	interface Props {
		node: import('mdast').ImageReference;
		children?: import('svelte').Snippet;
	}

	let { node }: Props = $props();

	const refs = getContext<{ get: (id: string) => Definition | undefined }>('mdsvelte-references');
	let data = $derived(refs.get(node.identifier));
</script>

<img src={data?.url} title={data?.title} alt={node.alt} />
