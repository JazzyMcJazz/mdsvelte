<script lang="ts">
	interface Props {
		node: import('mdast').TableRow;
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<tr>{@render children?.()}</tr>
