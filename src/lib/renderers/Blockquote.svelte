<script lang="ts">
	import type { Blockquote } from 'mdast';
	export let node: Blockquote;

	// A no-op function to keep the export in use
	(() => node)();
</script>

<blockquote><slot></slot></blockquote>
