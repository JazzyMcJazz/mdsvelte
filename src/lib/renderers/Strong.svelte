<script lang="ts">
	interface Props {
		node: import('mdast').Strong;
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<strong>{@render children?.()}</strong>
