import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'studio.facile.flux.launcher',
	appName: 'Flux',
	webDir: 'build',
	android: { allowMixedContent: false },
	server: { androidScheme: 'https' },
	plugins: {
		SystemBars: { insetsHandling: 'native', style: 'DEFAULT' }
	}
};

export default config;
