<script lang="ts">
	interface Props {
		node: import('mdast').Html;
		children?: import('svelte').Snippet;
	}

	let { node }: Props = $props();
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html node.value}
