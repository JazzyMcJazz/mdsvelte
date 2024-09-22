<script lang="ts">
	import type { AlignType } from 'mdast';

	export let header = false;
	export let align: AlignType | null | undefined;
</script>

{#if header}
	<th {align}><slot></slot></th>
{:else}
	<td {align}><slot></slot></td>
{/if}
