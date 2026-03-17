<script lang="ts">
	import type { Renderers } from './options.js';
	import type { Root, RootContent } from 'mdast';
	import Parser from './Parser.svelte';

	interface Props {
		node: Root | RootContent;
		renderers: Renderers;
	}

	let { node, renderers }: Props = $props();
</script>

{#if node.type in renderers}
	{#if node.type === 'root'}
		<renderers.root {node}>
			{#each node.children as child, i (i)}
				<Parser node={child} {renderers} />
			{/each}
		</renderers.root>

		<!-- Table -->
	{:else if node.type === 'table'}
		<renderers.table {node}>
			<!-- TableHead -->
			<renderers.tableHead {node}>
				<renderers.tableRow node={node.children[0]}>
					{#each node.children[0].children ?? [] as cell, i (i)}
						<renderers.tableCell
							node={cell}
							header={true}
							align={node.align ? node.align[i] : undefined}
						>
							{#each cell.children as content, j (j)}
								<Parser node={content} {renderers} />
							{/each}
						</renderers.tableCell>
					{/each}
				</renderers.tableRow>
			</renderers.tableHead>

			<!-- TableBody -->
			<renderers.tableBody {node}>
				{#each node.children.slice(1) ?? [] as row, i (i)}
					<renderers.tableRow node={row}>
						{#each row.children ?? [] as cell, j (j)}
							<renderers.tableCell node={cell} align={node.align ? node.align[j] : undefined}>
								{#each cell.children as content, k (k)}
									<Parser node={content} {renderers} />
								{/each}
							</renderers.tableCell>
						{/each}
					</renderers.tableRow>
				{/each}
			</renderers.tableBody>
		</renderers.table>

		<!-- List -->
	{:else if node.type === 'list'}
		<renderers.list {node}>
			{#each node.children as item, i (i)}
				{@const SvelteComponent = node.ordered
					? renderers.orderedListItem || renderers.listItem
					: renderers.unorderedListItem || renderers.listItem}
				<SvelteComponent node={item}>
					{#each item.children as content, j (j)}
						<Parser node={content} {renderers} />
					{/each}
				</SvelteComponent>
			{/each}
		</renderers.list>

		<!-- Other -->
	{:else if 'children' in node}
		{@const NodeWithChildren = renderers[node.type]}
		<NodeWithChildren {node}>
			{#each node.children as child, i (i)}
				<Parser node={child} {renderers} />
			{/each}
		</NodeWithChildren>
	{:else}
		{@const SvelteComponent_2 = renderers[node.type]}
		<SvelteComponent_2 {node} />
	{/if}

	<!-- Types with no renderer -->
{:else}
	{(() => {
		console.warn(`[mdsvelte] No renderer found for node type: "${node.type}"`);
		return '';
	})()}
	{#if 'children' in node}
		{#each node.children as child, i (i)}
			<Parser node={child} {renderers} />
		{/each}
	{:else if 'value' in node}
		{node.value}
	{/if}
{/if}
