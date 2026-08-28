function initPartnersSliders() {
	if (typeof Swiper === "undefined") return;

	const sliders = document.querySelectorAll("[data-partners-slider]");

	sliders.forEach((slider) => {
		const wrap = slider.closest(".buy-partners__slider-wrap");
		const nextEl = wrap?.querySelector("[data-partners-next]");

		const swiper = new Swiper(slider, {
			slidesPerView: 1.4,
			spaceBetween: 12,
			speed: 500,
			watchOverflow: true,
			navigation: nextEl
				? {
						nextEl,
					}
				: undefined,
			breakpoints: {
				576: {
					slidesPerView: 2.2,
					spaceBetween: 16,
				},
				768: {
					slidesPerView: 3.2,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 4.5,
					spaceBetween: 20,
				},
				1200: {
					slidesPerView: 5.5,
					spaceBetween: 20,
				},
			},
			on: {
				init(instance) {
					instance.el.classList.add("is-swiper-ready");
				},
			},
		});

		return swiper;
	});
}

initPartnersSliders();
