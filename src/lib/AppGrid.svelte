<script lang="ts">
	import { launch, type InstalledApp } from './apps';

	let { title, apps }: { title: string; apps: InstalledApp[] } = $props();
</script>

<section class="flex flex-col gap-3">
	<h2 class="text-fc-sm font-medium text-fc-fg-muted">{title}</h2>
	<ul class="grid grid-cols-4 gap-4">
		{#each apps as app (app.packageName)}
			<li>
				<button
					type="button"
					class="flex min-h-11 w-full flex-col items-center gap-2 rounded-fc-md p-2 hover:bg-fc-surface focus-visible:outline-2 focus-visible:outline-fc-ring"
					onclick={() => launch(app.packageName)}
				>
					<img src={app.icon} alt="" class="size-12" />
					<span class="w-full truncate text-center text-fc-xs text-fc-fg">{app.label}</span>
				</button>
			</li>
		{/each}
	</ul>
</section>
