<script lang="ts">
	import type { FootnoteReference } from 'mdast';
	import { MdProcessor } from '../processor';

	// eslint-disable-next-line svelte/valid-compile
	export let identifier: string;
	// eslint-disable-next-line svelte/valid-compile
	export let label: string | null | undefined;
	export let node: FootnoteReference;

	$: html = MdProcessor.stringify(MdProcessor.run({ type: 'root', children: [node] }));
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html html}
