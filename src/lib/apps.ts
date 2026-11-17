import { Capacitor, registerPlugin } from '@capacitor/core';

export interface InstalledApp {
	packageName: string;
	activityName: string;
	label: string;
	icon: string;
}

interface AppsPlugin {
	list(): Promise<{ apps: InstalledApp[] }>;
	launch(options: { packageName: string; activityName: string }): Promise<void>;
	openSettings(options: { packageName: string }): Promise<void>;
}

const Apps = registerPlugin<AppsPlugin>('Apps');

export const SELF = 'studio.facile.flux.launcher';
const FACILE_PREFIX = 'studio.facile.';

const fold = (text: string) =>
	text
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase();

/** Splits installed apps into Facile apps and the rest, each sorted by label, without the launcher itself. */
export function arrange(apps: InstalledApp[]): { facile: InstalledApp[]; other: InstalledApp[] } {
	const byLabel = (a: InstalledApp, b: InstalledApp) => a.label.localeCompare(b.label);
	const visible = apps.filter((app) => app.packageName !== SELF);
	return {
		facile: visible.filter((app) => app.packageName.startsWith(FACILE_PREFIX)).sort(byLabel),
		other: visible.filter((app) => !app.packageName.startsWith(FACILE_PREFIX)).sort(byLabel)
	};
}

/** Keeps the apps whose label contains the query, ignoring case and accents. */
export function search(apps: InstalledApp[], query: string): InstalledApp[] {
	const needle = fold(query.trim());
	if (!needle) return apps;
	return apps.filter((app) => fold(app.label).includes(needle));
}

/** Lists launchable apps from the device, or none outside Android. */
export async function listApps(): Promise<InstalledApp[]> {
	if (!Capacitor.isNativePlatform()) return [];
	const { apps } = await Apps.list();
	return apps;
}

/** Opens the given launcher activity of an installed app. */
export function launch(app: InstalledApp): Promise<void> {
	return Apps.launch({ packageName: app.packageName, activityName: app.activityName });
}

/** A key that stays unique when one package has several launcher activities. */
export const keyOf = (app: InstalledApp) => `${app.packageName}/${app.activityName}`;

const CACHE_KEY = 'flux.launcher.apps';

/** Returns the app list saved by the last refresh, so the grid shows at once. */
export function cachedApps(): InstalledApp[] {
	try {
		const saved = JSON.parse(localStorage.getItem(CACHE_KEY) ?? '[]');
		return Array.isArray(saved) ? saved.filter((app) => app?.packageName && app?.activityName) : [];
	} catch {
		return [];
	}
}

/** Saves the app list for the next start. */
export function cacheApps(apps: InstalledApp[]): void {
	try {
		localStorage.setItem(CACHE_KEY, JSON.stringify(apps));
	} catch {
		return;
	}
}

/** Opens the system App info screen, where the user can uninstall or change permissions. */
export function openSettings(packageName: string): Promise<void> {
	return Apps.openSettings({ packageName });
}
