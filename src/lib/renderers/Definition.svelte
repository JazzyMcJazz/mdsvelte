<script lang="ts">
	import { References } from '$lib/references.js';

	interface Props {
		node: import('mdast').Definition;
		children?: import('svelte').Snippet;
	}

	let { node }: Props = $props();

	References.set(node);
</script>
