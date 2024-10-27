<script lang="ts">
	interface Props {
		node: import('mdast').List;
		children?: import('svelte').Snippet;
	}

	let { node, children }: Props = $props();
</script>

{#if node.ordered}
	<ol start={node.start}>{@render children?.()}</ol>
{:else}
	<ul>{@render children?.()}</ul>
{/if}
