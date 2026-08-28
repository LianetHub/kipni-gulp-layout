function initReviews() {
	const slider = document.querySelector("[data-reviews-slider]");
	if (!slider || typeof Swiper === "undefined") return;

	const pagination = document.querySelector("[data-reviews-pagination]");
	const prevEl = document.querySelector("[data-reviews-prev]");
	const nextEl = document.querySelector("[data-reviews-next]");

	const swiper = new Swiper(slider, {
		slidesPerView: 1,
		spaceBetween: 16,
		speed: 500,
		pagination: pagination
			? {
					el: pagination,
					clickable: true,
				}
			: undefined,
		navigation: {
			prevEl: prevEl || undefined,
			nextEl: nextEl || undefined,
		},
		breakpoints: {
			768: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
			1200: {
				slidesPerView: 3,
				spaceBetween: 20,
			},
		},
	});

	document.querySelectorAll("[data-review-expand]").forEach((button) => {
		button.addEventListener("click", () => {
			const card = button.closest("[data-review-card]");
			if (!card) return;
			const expanded = card.classList.toggle("is-expanded");
			const label = button.querySelector("[data-review-expand-label]");
			if (label) {
				label.textContent = expanded ? "Свернуть отзыв" : "Раскрыть отзыв";
			}
		});
	});

	return swiper;
}

initReviews();
