import { Capacitor, registerPlugin } from '@capacitor/core';

export interface InstalledApp {
	packageName: string;
	label: string;
	icon: string;
}

interface AppsPlugin {
	list(): Promise<{ apps: InstalledApp[] }>;
	launch(options: { packageName: string }): Promise<void>;
}

const Apps = registerPlugin<AppsPlugin>('Apps');

export const SELF = 'studio.facile.flux.launcher';
const FACILE_PREFIX = 'studio.facile.';

/** Splits installed apps into Facile apps and the rest, each sorted by label, without the launcher itself. */
export function arrange(apps: InstalledApp[]): { facile: InstalledApp[]; other: InstalledApp[] } {
	const byLabel = (a: InstalledApp, b: InstalledApp) => a.label.localeCompare(b.label);
	const visible = apps.filter((app) => app.packageName !== SELF);
	return {
		facile: visible.filter((app) => app.packageName.startsWith(FACILE_PREFIX)).sort(byLabel),
		other: visible.filter((app) => !app.packageName.startsWith(FACILE_PREFIX)).sort(byLabel)
	};
}

/** Lists launchable apps from the device, or none outside Android. */
export async function listApps(): Promise<InstalledApp[]> {
	if (!Capacitor.isNativePlatform()) return [];
	const { apps } = await Apps.list();
	return apps;
}

/** Opens an installed app by its package name. */
export function launch(packageName: string): Promise<void> {
	return Apps.launch({ packageName });
}
