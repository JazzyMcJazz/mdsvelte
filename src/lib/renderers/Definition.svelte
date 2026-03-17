<script lang="ts">
	interface Props {
		node: import('mdast').Definition;
		children?: import('svelte').Snippet;
	}

	// eslint-disable-next-line no-empty-pattern
	let {}: Props = $props();
</script>
