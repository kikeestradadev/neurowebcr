const STORAGE_KEY = 'nw-theme';
const THEMES = ['light', 'dark'];

const getPreferredTheme = () => {
	if (typeof window === 'undefined') return 'light';
	const stored = localStorage.getItem(STORAGE_KEY);
	if (THEMES.includes(stored)) return stored;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getThemeToggles = () => document.querySelectorAll('[data-theme-toggle]');

const applyTheme = (theme) => {
	const next = THEMES.includes(theme) ? theme : 'light';
	document.documentElement.setAttribute('data-theme', next);
	localStorage.setItem(STORAGE_KEY, next);

	const isDark = next === 'dark';
	getThemeToggles().forEach((toggle) => {
		toggle.setAttribute('aria-pressed', String(isDark));
		toggle.setAttribute(
			'aria-label',
			isDark ? 'Activar modo claro' : 'Activar modo oscuro',
		);
		toggle.setAttribute('title', isDark ? 'Modo claro' : 'Modo oscuro');
	});
};

const withTransition = (fn) => {
	document.documentElement.classList.add('theme-transition');
	fn();
	window.setTimeout(() => {
		document.documentElement.classList.remove('theme-transition');
	}, 300);
};

const themeModule = () => {
	applyTheme(getPreferredTheme());

	const toggles = getThemeToggles();
	if (!toggles.length) return;

	toggles.forEach((toggle) => {
		toggle.addEventListener('click', () => {
			const current = document.documentElement.getAttribute('data-theme') || 'light';
			const next = current === 'dark' ? 'light' : 'dark';
			withTransition(() => applyTheme(next));
		});
	});

	window
		.matchMedia('(prefers-color-scheme: dark)')
		.addEventListener('change', (event) => {
			if (localStorage.getItem(STORAGE_KEY)) return;
			withTransition(() => applyTheme(event.matches ? 'dark' : 'light'));
		});
};

/** For inline script in <head> (prevent incorrect theme flash) */
export const themeInitScript = `!(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','light')}})();`;

export default themeModule;
