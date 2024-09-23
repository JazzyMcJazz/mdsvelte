<script lang="ts">
	import type { Link } from 'mdast';
	export let node: Link;
</script>

<a href={node.url} title={node.title}><slot></slot></a>
