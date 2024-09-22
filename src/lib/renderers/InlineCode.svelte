<script lang="ts">
	import type { InlineCode } from 'mdast';
	import { MdProcessor } from '../processor';

	// eslint-disable-next-line svelte/valid-compile
	export let text: string;
	export let node: InlineCode;

	$: html = MdProcessor.stringify(MdProcessor.run({ type: 'root', children: [node] }));
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html html}
