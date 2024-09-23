<script lang="ts">
	import { References } from '$lib/references.js';
	import type { LinkReference } from 'mdast';
	export let node: LinkReference;

	const data = References.get(node.identifier);
</script>

<a href={data?.url} title={data?.title}><slot></slot></a>
