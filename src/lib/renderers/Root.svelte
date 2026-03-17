<script lang="ts">
	interface Props {
		node: import('mdast').Root;
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

{@render children?.()}
