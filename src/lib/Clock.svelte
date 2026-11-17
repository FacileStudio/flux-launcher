<script lang="ts">
	let now = $state(new Date());

	const time = $derived(new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(now));
	const date = $derived(
		new Intl.DateTimeFormat(undefined, { weekday: 'long', day: 'numeric', month: 'long' }).format(now)
	);

	$effect(() => {
		const timer = setInterval(() => (now = new Date()), 1000);
		return () => clearInterval(timer);
	});
</script>

<header class="flex flex-col gap-1 px-2">
	<p class="font-fc-title text-fc-3xl font-bold tracking-tight text-fc-fg tabular-nums">{time}</p>
	<p class="text-fc-sm text-fc-fg-muted first-letter:uppercase">{date}</p>
</header>
