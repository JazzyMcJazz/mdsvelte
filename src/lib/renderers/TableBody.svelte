<script lang="ts">
	interface Props {
		node: import('mdast').Table;
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<tbody>{@render children?.()}</tbody>
