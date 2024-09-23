<script lang="ts">
	import type { Table } from 'mdast';
	export let node: Table;

	// A no-op function to keep the export in use
	(() => node)();
</script>

<table><slot></slot></table>
