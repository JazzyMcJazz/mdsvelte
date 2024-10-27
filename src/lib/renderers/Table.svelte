<script lang="ts">
	interface Props {
		node: import('mdast').Table;
		children?: import('svelte').Snippet;
	}

	let { node, children }: Props = $props();

	// A no-op function to keep the export in use
	(() => node)();
</script>

<table>{@render children?.()}</table>
