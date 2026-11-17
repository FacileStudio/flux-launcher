<script lang="ts">
	import { App } from '@capacitor/app';
	import { Capacitor } from '@capacitor/core';
	import { EmptyState, Input } from '@facile/muse';
	import AppGrid from '$lib/AppGrid.svelte';
	import Clock from '$lib/Clock.svelte';
	import { arrange, cacheApps, cachedApps, listApps, search, type InstalledApp } from '$lib/apps';

	let apps = $state<InstalledApp[]>(cachedApps());
	let query = $state('');
	const groups = $derived(arrange(search(apps, query)));

	async function refresh() {
		const found = await listApps();
		apps = found;
		cacheApps(found);
	}

	$effect(() => {
		refresh();
		if (!Capacitor.isNativePlatform()) return;
		const resume = App.addListener('resume', () => {
			query = '';
			refresh();
		});
		const back = App.addListener('backButton', () => (query = ''));
		return () => {
			resume.then((handle) => handle.remove());
			back.then((handle) => handle.remove());
		};
	});
</script>

<main class="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-6 bg-fc-page px-2 pt-10 pb-8">
	<Clock />
	<Input
		type="search"
		bind:value={query}
		placeholder="Search apps"
		aria-label="Search apps"
		autocomplete="off"
		class="border-0 bg-fc-surface"
	/>
	{#if apps.length === 0}
		<EmptyState title="No apps found" description="Flux lists your apps when it runs on Android." />
	{:else}
		{#if groups.facile.length > 0}
			<AppGrid title="Facile" apps={groups.facile} />
		{/if}
		{#if groups.other.length > 0}
			<AppGrid title="Apps" apps={groups.other} />
		{/if}
		{#if groups.facile.length + groups.other.length === 0}
			<EmptyState title="No match" description="No app name contains “{query}”." />
		{/if}
	{/if}
</main>
