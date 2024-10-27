<script lang="ts">
	interface Props {
		node: import('mdast').Table;
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<thead>{@render children?.()}</thead>
