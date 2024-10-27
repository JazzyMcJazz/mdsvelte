<script lang="ts">
	interface Props {
		node: import('mdast').Delete;
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<del>{@render children?.()}</del>
