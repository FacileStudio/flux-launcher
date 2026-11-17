<script lang="ts">
	import { EmptyState } from '@facile/muse';
	import AppGrid from '$lib/AppGrid.svelte';
	import { arrange, listApps, type InstalledApp } from '$lib/apps';

	let apps = $state<InstalledApp[]>([]);
	const groups = $derived(arrange(apps));

	$effect(() => {
		listApps().then((found) => (apps = found));
	});
</script>

<main class="flex min-h-dvh flex-col gap-8 bg-fc-page px-4 pt-12 pb-8">
	{#if apps.length === 0}
		<EmptyState title="No apps found" description="Flux lists your apps when it runs on Android." />
	{:else}
		{#if groups.facile.length > 0}
			<AppGrid title="Facile" apps={groups.facile} />
		{/if}
		<AppGrid title="Apps" apps={groups.other} />
	{/if}
</main>
