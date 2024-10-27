<script lang="ts">
	interface Props {
		node: import('mdast').Link;
		children?: import('svelte').Snippet;
	}

	let { node, children }: Props = $props();
</script>

<a href={node.url} title={node.title}>{@render children?.()}</a>
