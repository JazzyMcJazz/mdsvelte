<script lang="ts">
	import type { Delete } from 'mdast';
	export let node: Delete;

	// A no-op function to keep the export in use
	(() => node)();
</script>

<del><slot></slot></del>
