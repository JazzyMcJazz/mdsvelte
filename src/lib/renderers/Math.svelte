<script lang="ts">
	import type { Math } from 'mdast-util-math';
	import { MdProcessor } from '../processor';

	// eslint-disable-next-line svelte/valid-compile
	export let text: string;
	export let node: Math;

	$: html = MdProcessor.stringify(MdProcessor.run({ type: 'root', children: [node] }));
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html html}
