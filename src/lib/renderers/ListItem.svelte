<script lang="ts">
	import type { ListItem } from 'mdast';
	export let node: ListItem;

	// A no-op function to keep the export in use
	(() => node)();
</script>

<li><slot></slot></li>
