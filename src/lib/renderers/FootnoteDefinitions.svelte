<script lang="ts">
	import type { FootnoteDefinition } from 'mdast';

	export let nodes: FootnoteDefinition[];
</script>

<section data-footnotes class="footnotes">
	<h3 id="footnote-label" style="margin-top: 40px">Footnotes</h3>
	<ol>
		{#each nodes as node}
			<li id="user-content-fn-{node.identifier}">
				{#if node.children[0]?.type === 'paragraph' && node.children[0]?.children[0]?.type === 'text'}
					<p>
						{node.children[0].children[0].value}
						<a
							href="#user-content-fnref-{node.identifier}"
							data-footnote-backref
							aria-label="Back to reference {node.identifier}"
							aria-describedby="footnote-label"
							class="data-footnote-backref">↩</a
						>
					</p>
				{/if}
			</li>
		{/each}
	</ol>
</section>
