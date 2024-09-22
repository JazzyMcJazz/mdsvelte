<script lang="ts">
	import type { Root, RootContent } from 'mdast';
	import type { Renderers } from './options.js';

	export let node: Root | RootContent;
	export let renderers: Renderers;
</script>

{#if node.type in renderers && renderers[node.type]}
	<!-- Table -->
	{#if node.type === 'table'}
		<svelte:component this={renderers.table}>
			<!-- TableHead -->
			<svelte:component this={renderers.tableHead}>
				<svelte:component this={renderers.tableRow}>
					{#each node.children[0].children ?? [] as cell, i}
						<svelte:component
							this={renderers.tableCell}
							header={true}
							align={node.align ? node.align[i] : 'center'}
						>
							{#each cell.children as content}
								<svelte:self node={content} {renderers} />
							{/each}
						</svelte:component>
					{/each}
				</svelte:component>
			</svelte:component>

			<!-- TableBody -->
			<svelte:component this={renderers.tableBody}>
				{#each node.children.slice(1) ?? [] as row}
					<svelte:component this={renderers.tableRow}>
						{#each row.children ?? [] as cell, i}
							<svelte:component
								this={renderers.tableCell}
								align={node.align ? node.align[i] : 'center'}
							>
								{#each cell.children as content}
									<svelte:self node={content} {renderers} />
								{/each}
							</svelte:component>
						{/each}
					</svelte:component>
				{/each}
			</svelte:component>
		</svelte:component>

		<!-- List -->
	{:else if node.type === 'list'}
		<svelte:component this={renderers.list} ordered={node.ordered ?? false} start={node.start}>
			{#each node.children as item}
				<svelte:component
					this={node.ordered
						? renderers.orderedListItem || renderers.listItem
						: renderers.unorderedListItem || renderers.listItem}
				>
					{#each item.children as content}
						<svelte:self node={content} {renderers} />
					{/each}
				</svelte:component>
			{/each}
		</svelte:component>

		<!-- Code -->
	{:else if node.type === 'code'}
		<svelte:component this={renderers.code} lang={node.lang} text={node.value} {node} />

		<!-- Image -->
	{:else if node.type === 'image'}
		<svelte:component
			this={renderers.image}
			href={node.url}
			title={node.title}
			alt={node.alt}
			data={node.data}
		/>

		<!-- InlineCode -->
	{:else if node.type === 'inlineCode'}
		<svelte:component this={renderers.inlineCode} text={node.value} {node} />

		<!-- Heading -->
	{:else if node.type === 'heading'}
		<svelte:component this={renderers.heading} depth={node.depth}>
			{#each node.children as child}
				<svelte:self node={child} {renderers} />
			{/each}
		</svelte:component>

		<!-- Html -->
	{:else if node.type === 'html'}
		<svelte:component this={renderers.html} text={node.value} />

		<!-- Link -->
	{:else if node.type === 'link'}
		<svelte:component this={renderers.link} href={node.url} title={node.title}>
			{#each node.children as child}
				<svelte:self node={child} {renderers} />
			{/each}
		</svelte:component>

		<!-- Math -->
	{:else if node.type === 'math'}
		<svelte:component this={renderers.math} text={node.value} {node} />

		<!-- Inline Math -->
	{:else if node.type === 'inlineMath'}
		<svelte:component this={renderers.inlineMath} text={node.value} {node} />

		<!-- FootnoteReference -->
	{:else if node.type === 'footnoteReference'}
		<svelte:component
			this={renderers.footnoteReference}
			identifier={node.identifier}
			label={node.label}
			{node}
		/>
	{:else if node.type === 'text'}
		<svelte:component this={renderers.text} text={node.value}>
			{node.value}
		</svelte:component>

		<!-- TableCell (This should should be handled earlier, but is here for typescript reasons) -->
	{:else if node.type === 'tableCell'}
		<svelte:component this={renderers.tableCell} align={'center'}>
			{#each node.children as child}
				<svelte:self node={child} {renderers} />
			{/each}
		</svelte:component>

		<!-- Other -->
	{:else if node.type !== 'footnoteDefinition' && node.type in renderers}
		<svelte:component this={renderers[node.type]}>
			{#if 'children' in node}
				{#each node.children as child}
					<svelte:self node={child} {renderers} />
				{/each}
			{:else if 'value' in node}
				{node.value}
			{/if}
		</svelte:component>
	{/if}
{:else if 'children' in node}
	{#each node.children as child}
		<svelte:self node={child} {renderers} />
	{/each}
{/if}
