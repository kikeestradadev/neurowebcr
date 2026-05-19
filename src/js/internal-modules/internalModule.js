const internalModule = () => {
	initPortfolioSwiper();
};

let portfolioSwiper = null;

const initPortfolioSwiper = () => {
	const el = document.querySelector('.portfolio-swiper');
	if (!el || typeof Swiper === 'undefined') return;

	portfolioSwiper = new Swiper(el, {
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

export default internalModule;
