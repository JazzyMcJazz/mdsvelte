<script lang="ts">
	interface Props {
		node: import('mdast').ListItem;
		children?: import('svelte').Snippet;
	}

	let { node, children }: Props = $props();

	// A no-op function to keep the export in use
	(() => node)();
</script>

<li>{@render children?.()}</li>
