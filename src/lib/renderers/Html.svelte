<script lang="ts">
	import type { Html } from 'mdast';
	export let node: Html;
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html node.value}
