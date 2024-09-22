<script lang="ts">
	export let ordered: boolean;
	export let start: number | null | undefined;
</script>

{#if ordered}
	<ol {start}><slot></slot></ol>
{:else}
	<ul><slot></slot></ul>
{/if}
