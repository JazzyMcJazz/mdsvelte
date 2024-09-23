<script lang="ts">
	import { References } from '$lib/references.js';
	import type { Definition } from 'mdast';
	export let node: Definition;

	References.set(node);
</script>
