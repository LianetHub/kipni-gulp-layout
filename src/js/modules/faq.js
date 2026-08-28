function initFaq() {
	document.querySelectorAll("[data-faq]").forEach((root) => {
		root.querySelectorAll("[data-faq-item]").forEach((item) => {
			const btn = item.querySelector("[data-faq-btn]");
			const panel = item.querySelector("[data-faq-panel]");
			if (!btn || !panel) return;

			btn.addEventListener("click", () => {
				const isOpen = item.classList.toggle("is-open");
				btn.setAttribute("aria-expanded", String(isOpen));
				if (isOpen) {
					panel.removeAttribute("hidden");
				} else {
					panel.setAttribute("hidden", "");
				}
			});
		});
	});
}

initFaq();
