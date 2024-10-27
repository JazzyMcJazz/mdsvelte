<script lang="ts">
	import { References } from '$lib/references.js';

	interface Props {
		node: import('mdast').LinkReference;
		children?: import('svelte').Snippet;
	}

	let { node, children }: Props = $props();

	const data = References.get(node.identifier);
</script>

<a href={data?.url} title={data?.title}>{@render children?.()}</a>
