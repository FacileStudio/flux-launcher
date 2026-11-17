import adapterStatic from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapterStatic({ pages: 'build', assets: 'build', fallback: 'index.html' }),
		prerender: { entries: [] }
	},
	vitePlugin: {
		dynamicCompileOptions: ({ filename }) =>
			filename.includes('node_modules') ? undefined : { runes: true }
	}
};

export default config;
