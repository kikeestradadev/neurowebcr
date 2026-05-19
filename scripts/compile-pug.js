const pug = require('pug');
const fs = require('fs');
const path = require('path');

const input = path.join(__dirname, '../src/pug/pages/index.pug');
const basedir = path.join(__dirname, '../src/pug');
const publicDir = path.join(__dirname, '../public');
const localesDir = path.join(__dirname, '../src/locales');

const LOCALES = [
	{ code: 'es', outDir: publicDir, assetBase: './' },
	{ code: 'en', outDir: path.join(publicDir, 'en'), assetBase: '../' },
];

const loadLocale = (code) => {
	const file = path.join(localesDir, `${code}.json`);
	return JSON.parse(fs.readFileSync(file, 'utf8'));
};

for (const { code, outDir, assetBase } of LOCALES) {
	const langHrefEs = code === 'es' ? './' : '../';
	const langHrefEn = code === 'es' ? './en/' : './';
	const t = loadLocale(code);
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
		portfolioItems,
	});

	fs.mkdirSync(outDir, { recursive: true });
	const output = path.join(outDir, 'index.html');
	fs.writeFileSync(output, html);
	console.log(`Pug [${code}] → ${output} (${html.length} bytes)`);
}
