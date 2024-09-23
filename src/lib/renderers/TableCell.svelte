<script lang="ts">
	import type { TableCell } from 'mdast';
	export const node: TableCell = {} as TableCell;
	export let header = false;
	export let align: 'left' | 'center' | 'right' | 'justify' | 'char' | null | undefined;
</script>

{#if header}
	<th {align}><slot></slot></th>
{:else}
	<td {align}><slot></slot></td>
{/if}
