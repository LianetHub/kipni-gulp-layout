function initVacancyFileInputs() {
	document.querySelectorAll("[data-vacancy-file]").forEach((input) => {
		const label = input
			.closest(".vacancy-modal__file")
			?.querySelector("[data-vacancy-file-label]");
		if (!label) return;

		const defaultText = label.textContent.trim();

		input.addEventListener("change", () => {
			const file = input.files && input.files[0];
			label.textContent = file ? file.name : defaultText;
		});
	});
}

function initVacancyForms() {
	document.querySelectorAll(".vacancy-modal__form").forEach((form) => {
		form.addEventListener("submit", (event) => {
			event.preventDefault();
		});
	});
}

function initVacancyFancybox() {
	if (typeof Fancybox === "undefined") return;

	Fancybox.bind("[data-fancybox][data-src^='#modal-']", {
		type: "inline",
		autoFocus: true,
		placeFocusBack: true,
		dragToClose: false,
		closeButton: false,
		backdropClick: "close",
	});
}

initVacancyFileInputs();
initVacancyForms();
initVacancyFancybox();
