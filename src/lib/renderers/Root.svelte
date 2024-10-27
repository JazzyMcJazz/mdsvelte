<script lang="ts">
	interface Props {
		node: import('mdast').Root;
		children?: import('svelte').Snippet;
	}

	let { node, children }: Props = $props();

	// A no-op function to keep the export in use
	(() => node)();
</script>

{@render children?.()}
