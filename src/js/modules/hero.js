function initHero() {
	const slider = document.querySelector("[data-hero-slider]");
	if (!slider || typeof Swiper === "undefined") return;

	const pagination = document.querySelector("[data-hero-pagination]");

	const swiper = new Swiper(slider, {
		slidesPerView: 1,
		speed: 600,
		loop: true,
		effect: "fade",
		fadeEffect: {
			crossFade: true,
		},
		pagination: pagination
			? {
					el: pagination,
					clickable: true,
				}
			: undefined,
		on: {
			init(instance) {
				instance.el.classList.add("is-swiper-ready");
				syncPaginationTheme(instance);
			},
			slideChange(instance) {
				syncPaginationTheme(instance);
			},
		},
	});

	return swiper;
}

function syncPaginationTheme(instance) {
	const hero = instance.el.closest(".hero");
	if (!hero) return;

	const activeSlide = instance.el.querySelector(".swiper-slide-active");
	const isDark = activeSlide?.classList.contains("hero-slide--dark");
	hero.classList.toggle("is-dark-slide", Boolean(isDark));
}

initHero();
