<script lang="ts">
	import type { Image } from 'mdast';
	export let node: Image;
</script>

<img src={node.url} title={node.title} alt={node.alt} />
