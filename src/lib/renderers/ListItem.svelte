<script lang="ts">
	interface Props {
		node: import('mdast').ListItem;
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<li>{@render children?.()}</li>
