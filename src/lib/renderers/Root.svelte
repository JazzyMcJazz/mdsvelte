<script lang="ts">
	import type { Root } from 'mdast';
	export let node: Root = {} as Root;

	// A no-op function to keep the export in use
	(() => node)();
</script>

<slot></slot>
