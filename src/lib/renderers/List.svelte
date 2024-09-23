<script lang="ts">
	import type { List } from 'mdast';
	export let node: List;
</script>

{#if node.ordered}
	<ol start={node.start}><slot></slot></ol>
{:else}
	<ul><slot></slot></ul>
{/if}
