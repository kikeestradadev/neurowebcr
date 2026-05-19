const pug = require('pug');
const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const input = path.join(__dirname, '../src/pug/pages/index.pug');
const basedir = path.join(__dirname, '../src/pug');
const publicDir = path.join(__dirname, '../public');
const localesDir = path.join(__dirname, '../src/locales');
const siteUrl = (process.env.SITE_URL || pkg.homepage || 'https://neurowebcr.com').replace(/\/+$/, '');

const LOCALES = [
	{ code: 'es', outDir: publicDir, assetBase: './' },
	{ code: 'en', outDir: path.join(publicDir, 'en'), assetBase: '../' },
];

const loadLocale = (code) => {
	const file = path.join(localesDir, `${code}.json`);
	return JSON.parse(fs.readFileSync(file, 'utf8'));
};

const compileAll = () => {
	for (const { code, outDir, assetBase } of LOCALES) {
		const langHrefEs = code === 'es' ? './' : '../';
		const langHrefEn = code === 'es' ? './en/' : './';
		const t = loadLocale(code);
		const currentPath = code === 'es' ? '/' : '/en/';
		const currentUrl = `${siteUrl}${currentPath}`;
		const esUrl = `${siteUrl}/`;
		const enUrl = `${siteUrl}/en/`;
		const ogImage = `${siteUrl}/images/logo_b_h.png`;
		const ogLocale = code === 'es' ? 'es_CR' : 'en_US';
		const ogLocaleAlternate = code === 'es' ? 'en_US' : 'es_CR';
		const portfolioItems = t.portfolio.items.map((item) => ({
			...item,
			image: assetBase + item.image,
		}));

		const html = pug.renderFile(input, {
			pretty: true,
			basedir,
			locale: code,
			t,
			assetBase,
			langHrefEs,
			langHrefEn,
			seoCurrentUrl: currentUrl,
			seoEsUrl: esUrl,
			seoEnUrl: enUrl,
			seoOgImage: ogImage,
			seoOgLocale: ogLocale,
			seoOgLocaleAlternate: ogLocaleAlternate,
			seoSiteUrl: siteUrl,
			portfolioItems,
		});

		fs.mkdirSync(outDir, { recursive: true });
		const output = path.join(outDir, 'index.html');
		fs.writeFileSync(output, html);
		console.log(`Pug [${code}] → ${output} (${html.length} bytes, ${portfolioItems.length} portfolio items)`);
	}
};

compileAll();

if (process.argv.includes('--watch')) {
	console.log('Watching src/locales/*.json and src/pug/pages/index.pug…');
	let timer;
	const schedule = () => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			try {
				compileAll();
			} catch (err) {
				console.error(err.message);
			}
		}, 150);
	};

	fs.watch(localesDir, schedule);
	fs.watch(input, schedule);
}
