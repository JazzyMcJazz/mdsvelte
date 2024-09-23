<script lang="ts">
	import type { ImageReference } from 'mdast';
	import { References } from '$lib/references.js';
	export let node: ImageReference;

	const data = References.get(node.identifier);
</script>

<img src={data?.url} title={data?.title} alt={node.alt} />
