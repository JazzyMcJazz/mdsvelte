<script lang="ts">
	import type { Emphasis } from 'mdast';
	export let node: Emphasis;

	// A no-op function to keep the export in use
	(() => node)();
</script>

<em><slot></slot></em>
