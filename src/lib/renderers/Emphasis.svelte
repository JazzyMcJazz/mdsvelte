<script lang="ts">
	interface Props {
		node: import('mdast').Emphasis;
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<em>{@render children?.()}</em>
