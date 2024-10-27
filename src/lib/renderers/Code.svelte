<script lang="ts">
	interface Props {
		node: import('mdast').Code;
		children?: import('svelte').Snippet;
	}

	let { node }: Props = $props();
</script>

<pre><code>{node.value}</code></pre>
