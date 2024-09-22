<script lang="ts">
	export let href: string;
	export let title: string | null | undefined;
</script>

<a {href} {title}><slot></slot></a>
