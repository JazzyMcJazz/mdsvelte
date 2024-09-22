<script lang="ts">
	import type { Code } from 'mdast';
	import { MdProcessor } from '../processor';

	// eslint-disable-next-line svelte/valid-compile
	export let lang: string | null | undefined;
	// eslint-disable-next-line svelte/valid-compile
	export let text: string;
	export let node: Code;

	$: html = MdProcessor.stringify(MdProcessor.run({ type: 'root', children: [node] }));
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html html}
