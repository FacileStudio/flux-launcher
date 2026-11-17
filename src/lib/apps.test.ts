import { describe, expect, it } from 'vitest';
import { arrange, SELF } from './apps';

const app = (packageName: string, label: string) => ({ packageName, label, icon: '' });

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
