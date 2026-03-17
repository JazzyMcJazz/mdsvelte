<script lang="ts">
	import katex from 'katex';

	interface Props {
		node: { type: 'inlineMath'; value: string };
	}

	let { node }: Props = $props();
	let html = $derived(
		katex.renderToString(node.value, { displayMode: false, throwOnError: false })
	);
</script>

<span class="math-inline">{@html html}</span>
