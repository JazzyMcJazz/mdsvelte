<script lang="ts">
	import katex from 'katex';

	interface Props {
		node: { type: 'math'; value: string; meta?: string | null };
	}

	let { node }: Props = $props();
	let html = $derived(katex.renderToString(node.value, { displayMode: true, throwOnError: false }));
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<div class="math-block">{@html html}</div>
