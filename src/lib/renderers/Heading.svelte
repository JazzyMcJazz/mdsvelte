<script lang="ts">
	import type { Heading } from 'mdast';
	export let node: Heading;
</script>

{#if node.depth === 1}
	<h1><slot></slot></h1>
{:else if node.depth === 2}
	<h2><slot></slot></h2>
{:else if node.depth === 3}
	<h3><slot></slot></h3>
{:else if node.depth === 4}
	<h4><slot></slot></h4>
{:else if node.depth === 5}
	<h5><slot></slot></h5>
{:else if node.depth === 6}
	<h6><slot></slot></h6>
{/if}
