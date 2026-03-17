<script lang="ts">
	interface Props {
		node: import('mdast').Paragraph;
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<p>{@render children?.()}</p>
