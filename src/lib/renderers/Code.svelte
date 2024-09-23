<script lang="ts">
	import type { Code } from 'mdast';
	export let node: Code;
</script>

<pre><code>{node.value}</code></pre>
