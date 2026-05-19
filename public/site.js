(function () {
	const STORAGE_KEY = 'nw-theme';
	const THEMES = ['light', 'dark'];

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
		const el = document.querySelector('.portfolio-swiper');
		if (!el || typeof Swiper === 'undefined') return;

		new Swiper(el, {
			slidesPerView: 1,
			spaceBetween: 24,
			loop: true,
			grabCursor: true,
			autoplay: {
				delay: 5000,
				disableOnInteraction: false,
				pauseOnMouseEnter: true,
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			breakpoints: {
				640: { slidesPerView: 1.15 },
				960: { slidesPerView: 2 },
				1280: { slidesPerView: 2.2 },
			},
		});
	};

	initTheme();
	initMobileMenu();
	initPortfolioSwiper();
})();
