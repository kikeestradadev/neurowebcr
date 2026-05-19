(function () {
	const STORAGE_KEY = 'nw-theme';
	const THEMES = ['light', 'dark'];
	const ASSET_PREFIXES = ['/images/', './images/', '../images/', '/public/images/'];

	const getPreferredTheme = () => {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (THEMES.includes(stored)) return stored;
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	};

	const getThemeToggles = () =>
		document.querySelectorAll('[data-theme-toggle]');

	const applyTheme = (theme) => {
		const next = THEMES.includes(theme) ? theme : 'light';
		document.documentElement.setAttribute('data-theme', next);
		localStorage.setItem(STORAGE_KEY, next);

		const isDark = next === 'dark';
		getThemeToggles().forEach((toggle) => {
			toggle.setAttribute('aria-pressed', String(isDark));
			toggle.setAttribute('aria-label', isDark ? 'Activar modo claro' : 'Activar modo oscuro');
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

	const initTheme = () => {
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
	};

	const initMobileMenu = () => {
		const toggle = document.getElementById('menu-toggle');
		const nav = document.getElementById('mobile-nav');
		if (!toggle || !nav) return;

		const links = nav.querySelectorAll('a');
		const openLabel = toggle.dataset.labelOpen || toggle.getAttribute('aria-label') || 'Open menu';
		const closeLabel = toggle.dataset.labelClose || 'Close menu';

		const setMenuOpen = (open) => {
			nav.classList.toggle('is-open', open);
			toggle.classList.toggle('is-active', open);
			toggle.setAttribute('aria-expanded', String(open));
			toggle.setAttribute('aria-label', open ? closeLabel : openLabel);
			document.body.classList.toggle('mobile-nav-open', open);

			if (open) {
				nav.removeAttribute('hidden');
			} else {
				nav.setAttribute('hidden', '');
			}
		};

		const closeMenu = () => setMenuOpen(false);

		toggle.addEventListener('click', () => {
			setMenuOpen(!nav.classList.contains('is-open'));
		});

		links.forEach((link) => link.addEventListener('click', closeMenu));

		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && nav.classList.contains('is-open')) {
				closeMenu();
				toggle.focus();
			}
		});

		window.matchMedia('(min-width: 960px)').addEventListener('change', (e) => {
			if (e.matches) closeMenu();
		});
	};

	const initPortfolioSwiper = () => {
		const group = document.querySelector('.portfolio-swiper-group');
		const el = group?.querySelector('.portfolio-swiper');
		const pagination = group?.querySelector('.portfolio-swiper__pagination');
		const prev = el?.querySelector('.swiper-button-prev');
		const next = el?.querySelector('.swiper-button-next');

		if (!el || !pagination || !prev || !next || typeof Swiper === 'undefined') return;

		new Swiper(el, {
			slidesPerView: 'auto',
			spaceBetween: 24,
			loop: true,
			grabCursor: true,
			autoplay: {
				delay: 5000,
				disableOnInteraction: false,
				pauseOnMouseEnter: true,
			},
			pagination: {
				el: pagination,
				clickable: true,
			},
			navigation: {
				nextEl: next,
				prevEl: prev,
			},
		});
	};

	const getAssetPath = (src) => {
		if (!src) return '';
		const normalized = src.split('?')[0].split('#')[0];
		const marker = '/images/';
		const idx = normalized.lastIndexOf(marker);
		return idx === -1 ? '' : normalized.slice(idx + 1);
	};

	const buildAssetCandidates = (assetPath) => {
		if (!assetPath) return [];
		return ASSET_PREFIXES.map((prefix) => prefix + assetPath.replace(/^images\//, ''));
	};

	const initAssetFallbacks = () => {
		const tryNext = (el, attrName) => {
			const original = el.getAttribute(attrName) || '';
			const originalAbs = (() => {
				try {
					return new URL(original, window.location.href).pathname;
				} catch (_e) {
					return '';
				}
			})();
			const assetPath = getAssetPath(originalAbs || original);
			const candidates = buildAssetCandidates(assetPath).filter((candidate) => candidate !== original);
			if (!candidates.length) return;

			el.dataset.assetCandidates = JSON.stringify(candidates);
			el.dataset.assetCandidateIndex = '0';

			el.addEventListener('error', () => {
				const list = JSON.parse(el.dataset.assetCandidates || '[]');
				const index = Number(el.dataset.assetCandidateIndex || '0');
				if (index >= list.length) return;
				el.dataset.assetCandidateIndex = String(index + 1);
				el.setAttribute(attrName, list[index]);
			});
		};

		document.querySelectorAll('img[src*="images/"]').forEach((img) => tryNext(img, 'src'));
		document
			.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]')
			.forEach((link) => tryNext(link, 'href'));
	};

	initAssetFallbacks();
	initTheme();
	initMobileMenu();
	initPortfolioSwiper();
})();
