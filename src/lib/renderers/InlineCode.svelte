<script lang="ts">
	interface Props {
		node: import('mdast').InlineCode;
		children?: import('svelte').Snippet;
	}

	let { node }: Props = $props();
</script>

<code>{node.value}</code>
