<script lang="ts">
	import type { TableRow } from 'mdast';
	export let node: TableRow;

	// A no-op function to keep the export in use
	(() => node)();
</script>

<tr><slot></slot></tr>
