<script lang="ts">
	import type { Strong } from 'mdast';
	export let node: Strong;

	// A no-op function to keep the export in use
	(() => node)();
</script>

<strong><slot></slot></strong>
