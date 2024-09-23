<script lang="ts">
	import type { Paragraph } from 'mdast';
	export let node: Paragraph;

	// A no-op function to keep the export in use
	(() => node)();
</script>

<p><slot></slot></p>
