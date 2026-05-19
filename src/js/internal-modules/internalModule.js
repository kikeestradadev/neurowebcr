const internalModule = () => {
	initPortfolioSwiper();
};

let portfolioSwiper = null;

const initPortfolioSwiper = () => {
	const group = document.querySelector('.portfolio-swiper-group');
	const el = group?.querySelector('.portfolio-swiper');
	const pagination = group?.querySelector('.portfolio-swiper__pagination');
	const prev = el?.querySelector('.swiper-button-prev');
	const next = el?.querySelector('.swiper-button-next');

	if (!el || !pagination || !prev || !next || typeof Swiper === 'undefined') return;

	portfolioSwiper = new Swiper(el, {
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

export default internalModule;
