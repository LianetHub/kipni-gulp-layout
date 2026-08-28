const BANNER_STORAGE_KEY = "kipni-banner-hidden";

function initHeader() {
	const header = document.querySelector("[data-header]");
	if (!header) return;

	const banner = header.querySelector("[data-header-banner]");
	const bannerClose = header.querySelector("[data-header-banner-close]");
	const catalogBtn = header.querySelector("[data-header-catalog-btn]");
	const catalogPanel = header.querySelector("[data-header-catalog]");
	const buyBtn = header.querySelector("[data-header-buy-btn]");
	const buyPanel = header.querySelector("[data-header-buy]");
	const burger = header.querySelector("[data-header-burger]");
	const mobilePanel = header.querySelector("[data-header-mobile]");
	const searchMobile = header.querySelector("[data-header-search-mobile]");
	const searchPanel = header.querySelector("[data-header-search-panel]");
	const searchInputMobile = header.querySelector("#header-search-input-mobile");

	const setHeaderHeight = () => {
		const height = Math.ceil(header.getBoundingClientRect().height);
		document.documentElement.style.setProperty("--header-height", `${height}px`);
	};

	const hideBanner = () => {
		header.classList.add("is-banner-hidden");
		if (banner) banner.hidden = true;
		try {
			sessionStorage.setItem(BANNER_STORAGE_KEY, "1");
		} catch {
			/* ignore */
		}
		setHeaderHeight();
	};

	try {
		if (sessionStorage.getItem(BANNER_STORAGE_KEY) === "1") {
			header.classList.add("is-banner-hidden");
			if (banner) banner.hidden = true;
		}
	} catch {
		/* ignore */
	}

	if (bannerClose) {
		bannerClose.addEventListener("click", hideBanner);
	}

	const closeCatalog = () => {
		if (!catalogPanel || !catalogBtn) return;
		catalogPanel.hidden = true;
		catalogBtn.setAttribute("aria-expanded", "false");
	};

	const closeBuy = () => {
		if (!buyPanel || !buyBtn) return;
		buyPanel.hidden = true;
		buyBtn.setAttribute("aria-expanded", "false");
	};

	const closeMobile = () => {
		if (!mobilePanel || !burger) return;
		mobilePanel.hidden = true;
		burger.setAttribute("aria-expanded", "false");
		burger.setAttribute("aria-label", "Открыть меню");
		header.classList.remove("is-mobile-open");
		document.body.classList.remove("is-locked");
	};

	const closeDesktopMenus = () => {
		closeCatalog();
		closeBuy();
	};

	const openCatalog = () => {
		closeBuy();
		closeMobile();
		if (!catalogPanel || !catalogBtn) return;
		catalogPanel.hidden = false;
		catalogBtn.setAttribute("aria-expanded", "true");
	};

	const openBuy = () => {
		closeCatalog();
		closeMobile();
		if (!buyPanel || !buyBtn) return;
		buyPanel.hidden = false;
		buyBtn.setAttribute("aria-expanded", "true");
	};

	const openMobile = () => {
		closeDesktopMenus();
		if (!mobilePanel || !burger) return;
		mobilePanel.hidden = false;
		burger.setAttribute("aria-expanded", "true");
		burger.setAttribute("aria-label", "Закрыть меню");
		header.classList.add("is-mobile-open");
		document.body.classList.add("is-locked");
	};

	if (catalogBtn && catalogPanel) {
		catalogBtn.addEventListener("click", () => {
			const isOpen = catalogBtn.getAttribute("aria-expanded") === "true";
			if (isOpen) closeCatalog();
			else openCatalog();
		});
	}

	if (buyBtn && buyPanel) {
		buyBtn.addEventListener("click", () => {
			const isOpen = buyBtn.getAttribute("aria-expanded") === "true";
			if (isOpen) closeBuy();
			else openBuy();
		});
	}

	if (burger && mobilePanel) {
		burger.addEventListener("click", () => {
			const isOpen = burger.getAttribute("aria-expanded") === "true";
			if (isOpen) closeMobile();
			else openMobile();
		});
	}

	if (searchMobile && searchPanel) {
		searchMobile.addEventListener("click", () => {
			closeMobile();
			const isOpen = searchMobile.getAttribute("aria-expanded") === "true";
			if (isOpen) {
				searchPanel.hidden = true;
				searchMobile.setAttribute("aria-expanded", "false");
			} else {
				searchPanel.hidden = false;
				searchMobile.setAttribute("aria-expanded", "true");
				if (searchInputMobile) searchInputMobile.focus();
			}
			setHeaderHeight();
		});
	}

	header.querySelectorAll("[data-header-accordion]").forEach((accordion) => {
		const btn = accordion.querySelector("[data-header-accordion-btn]");
		if (!btn) return;

		btn.addEventListener("click", () => {
			const isOpen = accordion.classList.toggle("is-open");
			btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
		});
	});

	document.addEventListener("keydown", (event) => {
		if (event.key !== "Escape") return;
		closeDesktopMenus();
		closeMobile();
	});

	document.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof Node)) return;
		if (!header.contains(target)) {
			closeDesktopMenus();
			return;
		}

		if (
			catalogPanel &&
			!catalogPanel.hidden &&
			!catalogPanel.contains(target) &&
			catalogBtn &&
			!catalogBtn.contains(target)
		) {
			closeCatalog();
		}

		if (
			buyPanel &&
			!buyPanel.hidden &&
			!buyPanel.contains(target) &&
			buyBtn &&
			!buyBtn.contains(target)
		) {
			closeBuy();
		}
	});

	const mq = window.matchMedia(`(min-width: 767.98px)`);
	const onBreakpoint = () => {
		if (mq.matches) {
			closeMobile();
			if (searchPanel) {
				searchPanel.hidden = true;
				if (searchMobile) searchMobile.setAttribute("aria-expanded", "false");
			}
		} else {
			closeDesktopMenus();
		}
		setHeaderHeight();
	};

	if (typeof mq.addEventListener === "function") {
		mq.addEventListener("change", onBreakpoint);
	} else if (typeof mq.addListener === "function") {
		mq.addListener(onBreakpoint);
	}

	if (typeof ResizeObserver !== "undefined") {
		const observer = new ResizeObserver(() => setHeaderHeight());
		observer.observe(header);
	} else {
		window.addEventListener("resize", setHeaderHeight);
	}

	setHeaderHeight();
}

initHeader();
