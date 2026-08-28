function initCatalogCats() {
	const slider = document.querySelector("[data-catalog-cats]");
	if (!slider || typeof Swiper === "undefined") return;

	const nextEl = document.querySelector("[data-catalog-cats-next]");

	return new Swiper(slider, {
		slidesPerView: "auto",
		spaceBetween: 12,
		speed: 500,
		navigation: nextEl
			? {
					nextEl,
				}
			: undefined,
		breakpoints: {
			768: {
				spaceBetween: 16,
			},
			1200: {
				spaceBetween: 18,
			},
		},
	});
}

function initCatalogFilters() {
	const form = document.querySelector("[data-catalog-filters]");
	if (!form) return;

	const chips = form.querySelectorAll("[data-catalog-chip]");
	const resetBtn = form.querySelector("[data-catalog-filters-reset]");

	chips.forEach((chip) => {
		chip.addEventListener("click", () => {
			const isActive = chip.classList.toggle("is-active");
			chip.setAttribute("aria-pressed", isActive ? "true" : "false");
		});
	});

	if (resetBtn) {
		resetBtn.addEventListener("click", () => {
			chips.forEach((chip) => {
				chip.classList.remove("is-active");
				chip.setAttribute("aria-pressed", "false");
			});
		});
	}

	form.addEventListener("submit", (event) => {
		event.preventDefault();
	});
}

initCatalogCats();
initCatalogFilters();
