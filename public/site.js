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

		const links = nav.querySelectorAll('a, button[data-open-lead-modal]');
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

	const fireGAEvent = (eventName, params) => {
		if (typeof window.gtag !== 'function') return;
		window.gtag('event', eventName, params || {});
	};

	const resolveTrackingEndpoints = () => {
		const pathname = window.location.pathname || '/';
		const marker = '/public/';
		const index = pathname.indexOf(marker);
		const candidates = [];

		if (index !== -1) {
			const base = pathname.slice(0, index + marker.length);
			candidates.push(`${window.location.origin}${base}api/track_contact.php`);
		}

		candidates.push(`${window.location.origin}/public/api/track_contact.php`);
		candidates.push(`${window.location.origin}/api/track_contact.php`);

		return Array.from(new Set(candidates));
	};

	const sendContactLead = (params) => {
		if (!params || !params.lead_type) return;

		const payload = {
			lead_type: params.lead_type,
			cta_text: params.cta_text || '',
			link_url: params.link_url || '',
			page_lang: params.page_lang || '',
			page_path: params.page_path || '',
			referrer_url: document.referrer || '',
		};

		const body = JSON.stringify(payload);
		const urls = resolveTrackingEndpoints();

		if (typeof window.fetch !== 'function') return;

		const tryIndex = (index) => {
			if (index >= urls.length) return;
			fetch(urls[index], {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body,
				keepalive: true,
			})
				.then((response) => {
					if (!response.ok) {
						tryIndex(index + 1);
					}
				})
				.catch(() => {
					tryIndex(index + 1);
				});
		};

		if (urls.length) {
			tryIndex(0);
		}
	};

	const resolveLeadSubmissionEndpoints = () => {
		const pathname = window.location.pathname || '/';
		const marker = '/public/';
		const index = pathname.indexOf(marker);
		const candidates = [];

		if (index !== -1) {
			const base = pathname.slice(0, index + marker.length);
			candidates.push(`${window.location.origin}${base}api/submit_lead.php`);
		}

		candidates.push(`${window.location.origin}/public/api/submit_lead.php`);
		candidates.push(`${window.location.origin}/api/submit_lead.php`);

		return Array.from(new Set(candidates));
	};

	const submitLeadPayload = (payload) => {
		const body = JSON.stringify(payload);
		const urls = resolveLeadSubmissionEndpoints();

		if (typeof window.fetch !== 'function' || !urls.length) {
			return Promise.reject(new Error('fetch unavailable'));
		}

		const tryIndex = (index) => {
			if (index >= urls.length) return Promise.reject(new Error('all endpoints failed'));
			return fetch(urls[index], {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body,
			})
				.then((response) => {
					if (!response.ok) {
						return tryIndex(index + 1);
					}
					return response.json();
				})
				.catch(() => tryIndex(index + 1));
		};

		return tryIndex(0);
	};

	const initLeadModals = () => {
		const openButtons = document.querySelectorAll('[data-open-lead-modal]');
		if (!openButtons.length) return;

		const locale = document.documentElement.lang === 'en' ? 'en' : 'es';
		const copy = {
			es: {
				send: 'Enviar',
				sending: 'Enviando...',
				success: 'Gracias. Tu consulta fue enviada correctamente.',
				error: 'No pudimos enviar tu consulta. Intenta de nuevo.',
				popupPhone: 'Listo. Selecciona uno de los números para llamar ahora.',
				waNamePrefix: 'Mi nombre es',
				waServicePrefix: 'Servicio de interés',
				mailSubjectPrefix: 'Consulta desde web',
				mailFieldName: 'Nombre',
				mailFieldService: 'Servicio de interés',
				mailFieldPhone: 'Teléfono',
				mailFieldEmail: 'Correo',
				mailFieldMessage: 'Mensaje',
				popupBlockedWhatsapp: 'Habilita popups para abrir WhatsApp en una nueva pestaña.',
				popupBlockedEmail: 'Habilita popups para abrir tu cliente de correo en una nueva pestaña.',
			},
			en: {
				send: 'Send',
				sending: 'Sending...',
				success: 'Thanks. Your inquiry was sent successfully.',
				error: "We couldn't send your inquiry. Please try again.",
				popupPhone: 'Done. Choose one of the numbers to call now.',
				waNamePrefix: 'My name is',
				waServicePrefix: 'Service of interest',
				mailSubjectPrefix: 'Website inquiry',
				mailFieldName: 'Name',
				mailFieldService: 'Service of interest',
				mailFieldPhone: 'Phone',
				mailFieldEmail: 'Email',
				mailFieldMessage: 'Message',
				popupBlockedWhatsapp: 'Enable popups to open WhatsApp in a new tab.',
				popupBlockedEmail: 'Enable popups to open your email client in a new tab.',
			},
		}[locale];

		const openModal = (channel) => {
			const modal = document.getElementById(`lead-modal-${channel}`);
			if (!modal) return;
			const form = modal.querySelector(`.lead-form[data-lead-form="${channel}"]`);
			const callOptions = modal.querySelector(`[data-call-options="${channel}"]`);
			const feedback = modal.querySelector(`[data-lead-feedback="${channel}"]`);
			if (form) form.classList.remove('hidden');
			if (callOptions) callOptions.classList.add('hidden');
			if (feedback) feedback.textContent = '';
			modal.classList.remove('hidden');
			modal.setAttribute('aria-hidden', 'false');
			document.body.classList.add('mobile-nav-open');
		};

		const openInBlank = (url) => {
			if (!url) return;
			const win = window.open(url, '_blank', 'noopener,noreferrer');
			if (!win) {
				return false;
			}
			return true;
		};

		const closeModal = (channel) => {
			const modal = document.getElementById(`lead-modal-${channel}`);
			if (!modal) return;
			modal.classList.add('hidden');
			modal.setAttribute('aria-hidden', 'true');
			document.body.classList.remove('mobile-nav-open');
		};

		openButtons.forEach((button) => {
			button.addEventListener('click', () => openModal(button.dataset.openLeadModal));
		});

		document.querySelectorAll('[data-close-lead-modal]').forEach((button) => {
			button.addEventListener('click', () => closeModal(button.dataset.closeLeadModal));
		});

		document.querySelectorAll('.lead-form').forEach((form) => {
			form.addEventListener('submit', (event) => {
				event.preventDefault();
				const channel = form.dataset.leadForm;
				const feedback = document.querySelector(`[data-lead-feedback="${channel}"]`);
				const submit = document.querySelector(`[data-lead-submit="${channel}"]`);
				const callOptions = document.querySelector(`[data-call-options="${channel}"]`);
				if (!channel || !feedback || !submit) return;

				if (!form.reportValidity()) return;

				submit.disabled = true;
				submit.textContent = copy.sending;
				feedback.textContent = '';

				const data = new FormData(form);
				const payload = {
					lead_type: channel,
					full_name: String(data.get('full_name') || '').trim(),
					service_interest: String(data.get('service_interest') || '').trim(),
					whatsapp_number: String(data.get('whatsapp_number') || '').trim(),
					phone: String(data.get('phone') || '').trim(),
					email: String(data.get('email') || '').trim(),
					message: String(data.get('message') || '').trim(),
					page_lang: document.documentElement.lang || 'es',
					page_path: window.location.pathname || '/',
				};

				submitLeadPayload(payload)
					.then((result) => {
						if (!result || !result.ok) throw new Error('invalid response');
						sendContactLead({
							lead_type: channel,
							cta_text: `modal_${channel}`,
							link_url: window.location.href,
							page_lang: payload.page_lang,
							page_path: payload.page_path,
						});
						feedback.textContent = copy.success;
						if (channel === 'phone') {
							form.classList.add('hidden');
							if (callOptions) callOptions.classList.remove('hidden');
							feedback.textContent = copy.popupPhone;
							return;
						}
						form.reset();
						window.setTimeout(() => {
							closeModal(channel);
							if (channel === 'whatsapp') {
								const target = document.querySelector('[data-open-lead-modal="whatsapp"]');
								const fallback = document.querySelector('a[href*="wa.me/"]');
								let destination = '';
								if (target && target.dataset && target.dataset.whatsappUrl) {
									destination = target.dataset.whatsappUrl;
								} else if (fallback && fallback.href) {
									destination = fallback.href;
								}

								if (destination) {
									try {
										const url = new URL(destination, window.location.origin);
										const defaultText = String(url.searchParams.get('text') || '').trim();
										const userName = String(payload.full_name || '').trim();
										const serviceInterest = String(payload.service_interest || '').trim();
										const userMessage = String(payload.message || '').trim();
										const nameChunk = userName ? `${copy.waNamePrefix} ${userName}, ` : '';
										const serviceChunk = serviceInterest ? `${copy.waServicePrefix}: ${serviceInterest}. ` : '';
										const composedMessage = `${defaultText} ${nameChunk}${serviceChunk}${userMessage}`.trim();
										if (composedMessage) {
											url.searchParams.set('text', composedMessage);
										}
										const opened = openInBlank(url.toString());
										if (!opened) {
											feedback.textContent = copy.popupBlockedWhatsapp;
										}
									} catch (_e) {
										const opened = openInBlank(destination);
										if (!opened) {
											feedback.textContent = copy.popupBlockedWhatsapp;
										}
									}
								}
							} else if (channel === 'email') {
								const trigger = document.querySelector('[data-open-lead-modal="email"]');
								const baseMailto = trigger?.dataset?.emailUrl || 'mailto:hello@neurowebcr.com';
								const subject = encodeURIComponent(`${copy.mailSubjectPrefix} - ${payload.full_name || ''}`.trim());
								const bodyText = `${copy.mailFieldName}: ${payload.full_name || ''}\n${copy.mailFieldService}: ${payload.service_interest || ''}\n${copy.mailFieldPhone}: ${payload.phone || ''}\n${copy.mailFieldEmail}: ${payload.email || ''}\n\n${copy.mailFieldMessage}:\n${payload.message || ''}`;
								const body = encodeURIComponent(bodyText);
								const sep = baseMailto.includes('?') ? '&' : '?';
								const opened = openInBlank(`${baseMailto}${sep}subject=${subject}&body=${body}`);
								if (!opened) {
									feedback.textContent = copy.popupBlockedEmail;
								}
							}
						}, 900);
					})
					.catch(() => {
						feedback.textContent = copy.error;
					})
					.finally(() => {
						submit.disabled = false;
						submit.textContent = copy.send;
					});
			});
		});

		document.querySelectorAll('[data-lead-request-contact="phone"]').forEach((button) => {
			button.addEventListener('click', () => {
				const form = document.querySelector('.lead-form[data-lead-form="phone"]');
				const feedback = document.querySelector('[data-lead-feedback="phone"]');
				if (!form || !feedback) return;
				if (!form.reportValidity()) return;

				const data = new FormData(form);
				const payload = {
					lead_type: 'phone',
					full_name: String(data.get('full_name') || '').trim(),
					service_interest: String(data.get('service_interest') || '').trim(),
					phone: String(data.get('phone') || '').trim(),
					message: 'Deseo ser contactado',
					page_lang: document.documentElement.lang || 'es',
					page_path: window.location.pathname || '/',
				};

				button.disabled = true;
				submitLeadPayload(payload)
					.then((result) => {
						if (!result || !result.ok) throw new Error('invalid response');
						sendContactLead({
							lead_type: 'phone',
							cta_text: 'modal_phone_request_contact',
							link_url: window.location.href,
							page_lang: payload.page_lang,
							page_path: payload.page_path,
						});
						feedback.textContent = copy.success;
						form.reset();
						window.setTimeout(() => closeModal('phone'), 900);
					})
					.catch(() => {
						feedback.textContent = copy.error;
					})
					.finally(() => {
						button.disabled = false;
					});
			});
		});

		document.querySelectorAll('[data-copy-phone]').forEach((button) => {
			button.addEventListener('click', async () => {
				const value = button.dataset.copyPhone || '';
				if (!value) return;
				try {
					if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
						await navigator.clipboard.writeText(value);
					} else {
						const tmp = document.createElement('textarea');
						tmp.value = value;
						document.body.appendChild(tmp);
						tmp.select();
						document.execCommand('copy');
						document.body.removeChild(tmp);
					}
					const originalTitle = button.getAttribute('title') || '';
					button.setAttribute('title', 'Copiado');
					sendContactLead({
						lead_type: 'phone',
						cta_text: 'phone_copy',
						link_url: `copy:${value}`,
						page_lang: document.documentElement.lang || 'es',
						page_path: window.location.pathname || '/',
					});
					window.alert(locale === 'en' ? 'Number copied.' : 'Número copiado.');
					window.setTimeout(() => button.setAttribute('title', originalTitle), 1200);
				} catch (_e) {
					window.alert(locale === 'en' ? 'Could not copy the number.' : 'No se pudo copiar el número.');
				}
			});
		});

		document.querySelectorAll('.lead-call-options__link[href^="tel:"]').forEach((link) => {
			link.addEventListener('click', () => {
				sendContactLead({
					lead_type: 'phone',
					cta_text: 'phone_call_click',
					link_url: link.getAttribute('href') || '',
					page_lang: document.documentElement.lang || 'es',
					page_path: window.location.pathname || '/',
				});
			});
		});
	};

	const textFromNode = (node) => (node?.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120);

	const initFunnelTracking = () => {
		const pageLang = document.documentElement.lang || 'es';
		const pagePath = window.location.pathname;

		const trackClick = (selector, eventName, buildParams) => {
			document.querySelectorAll(selector).forEach((el) => {
				el.addEventListener('click', () => {
					const params = typeof buildParams === 'function' ? buildParams(el) : {};
					const merged = {
						page_lang: pageLang,
						page_path: pagePath,
						...params,
					};

					fireGAEvent(eventName, merged);

					if (eventName === 'generate_lead') {
						sendContactLead(merged);
					}
				});
			});
		};

		trackClick('.nav-link, .mobile-nav-link', 'navigation_click', (el) => ({
			link_text: textFromNode(el),
			link_target: el.getAttribute('href') || '',
		}));

		trackClick('a[href*="wa.me"]', 'generate_lead', (el) => ({
			lead_type: 'whatsapp',
			cta_text: textFromNode(el) || 'whatsapp',
			link_url: el.href || '',
		}));

		trackClick('a[href^="mailto:"]', 'generate_lead', (el) => ({
			lead_type: 'email',
			cta_text: textFromNode(el) || 'email',
			link_url: el.href || '',
		}));

		trackClick('.portfolio-card--link', 'select_content', (el) => {
			const title = textFromNode(el.querySelector('h3'));
			const category = textFromNode(el.querySelector('p'));
			return {
				content_type: 'portfolio_project',
				item_name: title || 'project',
				item_category: category || '',
				link_url: el.href || '',
			};
		});

		const sections = document.querySelectorAll('section[id]');
		if ('IntersectionObserver' in window && sections.length) {
			const seen = new Set();
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (!entry.isIntersecting) return;
						const id = entry.target.id;
						if (!id || seen.has(id)) return;
						seen.add(id);
						fireGAEvent('view_section', {
							page_lang: pageLang,
							page_path: pagePath,
							section_id: id,
						});
					});
				},
				{ threshold: 0.5 }
			);
			sections.forEach((section) => observer.observe(section));
		}
	};

	initAssetFallbacks();
	initTheme();
	initMobileMenu();
	initPortfolioSwiper();
	initFunnelTracking();
	initLeadModals();
})();
