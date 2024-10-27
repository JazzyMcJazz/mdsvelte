<script lang="ts">
	interface Props {
		node: import('mdast').Yaml;
		children?: import('svelte').Snippet;
	}

	let { node }: Props = $props();
</script>

{node.value}
