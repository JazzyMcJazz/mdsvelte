<script lang="ts">
	interface Props {
		node: import('mdast').Image;
		children?: import('svelte').Snippet;
	}

	let { node }: Props = $props();
</script>

<img src={node.url} title={node.title} alt={node.alt} />
