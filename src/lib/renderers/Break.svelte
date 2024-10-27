<script lang="ts">
	interface Props {
		node: import('mdast').Break;
		children?: import('svelte').Snippet;
	}

	let { node }: Props = $props();

	// A no-op function to keep the export in use
	(() => node)();
</script>

<br />
