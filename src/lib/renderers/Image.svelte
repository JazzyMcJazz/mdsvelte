<script lang="ts">
	import type { ImageData } from 'mdast';

	export let href = '';
	export let title: string | null | undefined;
	export let alt: string | null | undefined;
	// eslint-disable-next-line svelte/valid-compile
	export let data: ImageData | undefined;
</script>

<img src={href} {title} {alt} />
