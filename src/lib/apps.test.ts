import { describe, expect, it } from 'vitest';
import { arrange, keyOf, search, SELF } from './apps';

const app = (packageName: string, label: string) => ({ packageName, activityName: `${packageName}.Main`, label, icon: '' });

describe('arrange', () => {
	it('puts Facile apps first, sorts by label and hides the launcher', () => {
		const { facile, other } = arrange([
			app('org.lineageos.etar', 'Calendar'),
			app('studio.facile.sablier', 'Sablier'),
			app(SELF, 'Flux'),
			app('studio.facile.bulle', 'Bulle'),
			app('org.lineageos.aperture', 'Camera')
		]);
		expect(facile.map((a) => a.label)).toEqual(['Bulle', 'Sablier']);
		expect(other.map((a) => a.label)).toEqual(['Calendar', 'Camera']);
	});
});

describe('search', () => {
	const apps = [app('a', 'Paramètres'), app('b', 'Caméra'), app('c', 'Agenda')];

	it('matches without case or accents', () => {
		expect(search(apps, 'PARAMET').map((a) => a.label)).toEqual(['Paramètres']);
		expect(search(apps, 'camera').map((a) => a.label)).toEqual(['Caméra']);
	});

	it('returns every app for a blank query', () => {
		expect(search(apps, '  ')).toHaveLength(3);
	});
});

describe('keyOf', () => {
	it('tells apart two launcher activities of one package', () => {
		const first = { packageName: 'p', activityName: 'p.A', label: 'A', icon: '' };
		const second = { ...first, activityName: 'p.B' };
		expect(keyOf(first)).not.toBe(keyOf(second));
	});
});
