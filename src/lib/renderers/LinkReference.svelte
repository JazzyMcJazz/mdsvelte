<script lang="ts">
	import type { Definition } from 'mdast';
	import { getContext } from 'svelte';

	interface Props {
		node: import('mdast').LinkReference;
		children?: import('svelte').Snippet;
	}

	let { node, children }: Props = $props();

	const refs = getContext<{ get: (id: string) => Definition | undefined }>('mdsvelte-references');
	let data = $derived(refs.get(node.identifier));
</script>

<a href={data?.url} title={data?.title}>{@render children?.()}</a>
