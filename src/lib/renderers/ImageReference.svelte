<script lang="ts">
	import { References } from '$lib/references.js';
	interface Props {
		node: import('mdast').ImageReference;
		children?: import('svelte').Snippet;
	}

	let { node }: Props = $props();

	const data = References.get(node.identifier);
</script>

<img src={data?.url} title={data?.title} alt={node.alt} />
