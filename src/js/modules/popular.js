function initPopular() {
	const slider = document.querySelector("[data-popular-slider]");
	if (!slider || typeof Swiper === "undefined") return;

	const nextEl = document.querySelector("[data-popular-next]");

	return new Swiper(slider, {
		slidesPerView: "auto",
		spaceBetween: 11,
		speed: 500,
		navigation: nextEl
			? {
					nextEl,
				}
			: undefined,
		breakpoints: {
			768: {
				spaceBetween: 20,
			},
			1200: {
				spaceBetween: 21,
			},
		},
	});
}

initPopular();
