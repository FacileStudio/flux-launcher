<script lang="ts">
	import { keyOf, launch, openSettings, type InstalledApp } from './apps';

	let { title, apps }: { title: string; apps: InstalledApp[] } = $props();

	function details(event: MouseEvent, packageName: string) {
		event.preventDefault();
		openSettings(packageName);
	}
</script>

<section class="flex flex-col gap-3" aria-label={title}>
	<h2 class="px-2 text-fc-sm font-medium text-fc-fg-muted">{title}</h2>
	<ul class="grid grid-cols-4 gap-y-2">
		{#each apps as app (keyOf(app))}
			<li>
				<button
					type="button"
					class="flex min-h-11 w-full flex-col items-center gap-2 rounded-fc-md p-2 select-none hover:bg-fc-surface focus-visible:outline-2 focus-visible:outline-fc-ring active:bg-fc-surface"
					onclick={() => launch(app)}
					oncontextmenu={(event) => details(event, app.packageName)}
				>
					<img src={app.icon} alt="" class="size-12" draggable="false" />
					<span class="w-full truncate text-center text-fc-xs text-fc-fg">{app.label}</span>
				</button>
			</li>
		{/each}
	</ul>
</section>
