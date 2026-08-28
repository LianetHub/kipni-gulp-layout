document.querySelectorAll("[data-product]").forEach((root) => {
	const mainImage = root.querySelector("[data-product-main]");
	const zoomLink = root.querySelector("[data-product-zoom]");
	const thumbs = root.querySelectorAll("[data-product-thumb]");
	const volumeChips = root.querySelectorAll("[data-product-volume]");
	const favoriteBtn = root.querySelector("[data-product-favorite]");
	const tabsRoot = root.querySelector("[data-product-tabs]");
	const tabButtons = tabsRoot ? tabsRoot.querySelectorAll("[data-product-tab]") : [];
	const panels = tabsRoot ? tabsRoot.querySelectorAll("[data-product-panel]") : [];

	thumbs.forEach((thumb) => {
		thumb.addEventListener("click", () => {
			const src = thumb.getAttribute("data-src");
			if (!src || !mainImage) return;

			mainImage.setAttribute("src", src);
			if (zoomLink) {
				zoomLink.setAttribute("href", src);
			}

			thumbs.forEach((item) => {
				const isActive = item === thumb;
				item.classList.toggle("is-active", isActive);
				if (isActive) {
					item.setAttribute("aria-current", "true");
				} else {
					item.removeAttribute("aria-current");
				}
			});
		});
	});

	volumeChips.forEach((chip) => {
		chip.addEventListener("click", () => {
			volumeChips.forEach((item) => {
				const isActive = item === chip;
				item.classList.toggle("is-active", isActive);
				item.setAttribute("aria-pressed", isActive ? "true" : "false");
			});
		});
	});

	if (favoriteBtn) {
		favoriteBtn.addEventListener("click", () => {
			const next = favoriteBtn.getAttribute("aria-pressed") !== "true";
			favoriteBtn.classList.toggle("is-active", next);
			favoriteBtn.setAttribute("aria-pressed", next ? "true" : "false");
		});
	}

	const activateTab = (name) => {
		tabButtons.forEach((btn) => {
			const isActive = btn.getAttribute("data-product-tab") === name;
			btn.classList.toggle("is-active", isActive);
			btn.setAttribute("aria-selected", isActive ? "true" : "false");
			btn.tabIndex = isActive ? 0 : -1;
		});

		panels.forEach((panel) => {
			const isActive = panel.getAttribute("data-product-panel") === name;
			panel.classList.toggle("is-active", isActive);
			if (isActive) {
				panel.removeAttribute("hidden");
			} else {
				panel.setAttribute("hidden", "");
			}
		});
	};

	tabButtons.forEach((btn) => {
		btn.addEventListener("click", () => {
			const name = btn.getAttribute("data-product-tab");
			if (name) activateTab(name);
		});

		btn.addEventListener("keydown", (event) => {
			const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
			if (!keys.includes(event.key)) return;

			event.preventDefault();
			const list = Array.from(tabButtons);
			const index = list.indexOf(btn);
			let nextIndex = index;

			if (event.key === "ArrowRight") {
				nextIndex = (index + 1) % list.length;
			} else if (event.key === "ArrowLeft") {
				nextIndex = (index - 1 + list.length) % list.length;
			} else if (event.key === "Home") {
				nextIndex = 0;
			} else if (event.key === "End") {
				nextIndex = list.length - 1;
			}

			const nextBtn = list[nextIndex];
			const name = nextBtn.getAttribute("data-product-tab");
			if (name) {
				activateTab(name);
				nextBtn.focus();
			}
		});
	});
});
