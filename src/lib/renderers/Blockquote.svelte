<script lang="ts">
	interface Props {
		node: import('mdast').Blockquote;
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<blockquote>{@render children?.()}</blockquote>
