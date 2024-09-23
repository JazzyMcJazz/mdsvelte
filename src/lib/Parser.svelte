<script>
	export let node;
	export let renderers;
</script>

{#if node.type in renderers}
	<!-- Table -->
	{#if node.type === 'table'}
		<svelte:component this={renderers.table} {node}>
			<!-- TableHead -->
			<svelte:component this={renderers.tableHead}>
				<svelte:component this={renderers.tableRow} node={node.children[0]}>
					{#each node.children[0].children ?? [] as cell, i}
						<svelte:component
							this={renderers.tableCell}
							header={true}
							align={node.align ? node.align[i] : undefined}
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
					<svelte:component this={renderers.tableRow} node={row}>
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
		<svelte:component this={renderers.list} {node}>
			{#each node.children as item}
				<svelte:component
					this={node.ordered
						? renderers.orderedListItem || renderers.listItem
						: renderers.unorderedListItem || renderers.listItem}
					node={item}
				>
					{#each item.children as content}
						<svelte:self node={content} {renderers} />
					{/each}
				</svelte:component>
			{/each}
		</svelte:component>

		<!-- Other -->
	{:else if 'children' in node}
		<svelte:component this={renderers[node.type]} {node}>
			{#each node.children as child}
				<svelte:self node={child} {renderers} />
			{/each}
		</svelte:component>
	{:else}
		<svelte:component this={renderers[node.type]} {node} />
	{/if}

	<!-- Types with no renderer -->
{:else if 'children' in node}
	{#each node.children as child}
		<svelte:self node={child} {renderers} />
	{/each}
{:else if 'value' in node}
	{node.value}
{/if}
