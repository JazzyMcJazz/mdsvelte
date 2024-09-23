<script lang="ts">
	import type { InlineCode } from 'mdast';
	export let node: InlineCode;
</script>

<code>{node.value}</code>
