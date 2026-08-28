"use strict";

/* webp */
function isWebp() {
	function testWebP(callback) {
		const webP = new Image();
		webP.onload = webP.onerror = function () {
			callback(webP.height === 2);
		};
		webP.src =
			"data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	}

	testWebP(function (support) {
		if (support === true) {
			document.querySelector("body").classList.add("webp");
		} else {
			document.querySelector("body").classList.add("no-webp");
		}
	});
}

/* header */
const BANNER_STORAGE_KEY = "kipni-banner-hidden";
const BANNER_CLOSE_MS = 460;

const headerState = {
	header: null,
	banner: null,
	catalogBtn: null,
	catalogPanel: null,
	buyBtn: null,
	buyPanel: null,
	burger: null,
	mobilePanel: null,
	searchMobile: null,
	searchPanel: null,
	searchInputMobile: null,
};

function setHeaderHeight() {
	if (!headerState.header) return;
	const height = Math.ceil(headerState.header.getBoundingClientRect().height);
	document.documentElement.style.setProperty("--header-height", `${height}px`);
}

function finishBannerHide() {
	if (!headerState.header) return;

	headerState.header.classList.add("is-banner-hidden");
	if (headerState.banner) {
		headerState.banner.hidden = true;
		headerState.banner.classList.remove("is-closing");
	}
	try {
		sessionStorage.setItem(BANNER_STORAGE_KEY, "1");
	} catch {
		/* ignore */
	}
	setHeaderHeight();
}

function hideBanner() {
	const { header, banner } = headerState;
	if (!banner || !header || header.classList.contains("is-banner-hidden") || banner.classList.contains("is-closing")) {
		return;
	}

	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		finishBannerHide();
		return;
	}

	banner.classList.add("is-closing");

	const onTransitionEnd = (event) => {
		if (event.target !== banner || event.propertyName !== "max-height") return;
		banner.removeEventListener("transitionend", onTransitionEnd);
		finishBannerHide();
	};

	banner.addEventListener("transitionend", onTransitionEnd);
	window.setTimeout(() => {
		if (!header.classList.contains("is-banner-hidden")) {
			banner.removeEventListener("transitionend", onTransitionEnd);
			finishBannerHide();
		}
	}, BANNER_CLOSE_MS);
}

function closeCatalog() {
	if (!headerState.catalogPanel || !headerState.catalogBtn) return;
	headerState.catalogPanel.hidden = true;
	headerState.catalogBtn.setAttribute("aria-expanded", "false");
}

function closeBuy() {
	if (!headerState.buyPanel || !headerState.buyBtn) return;
	headerState.buyPanel.hidden = true;
	headerState.buyBtn.setAttribute("aria-expanded", "false");
}

function closeMobile() {
	if (!headerState.mobilePanel || !headerState.burger || !headerState.header) return;
	headerState.mobilePanel.hidden = true;
	headerState.burger.setAttribute("aria-expanded", "false");
	headerState.burger.setAttribute("aria-label", "Открыть меню");
	headerState.header.classList.remove("is-mobile-open");
	document.body.classList.remove("is-locked");
}

function closeDesktopMenus() {
	closeCatalog();
	closeBuy();
}

function openCatalog() {
	closeBuy();
	closeMobile();
	if (!headerState.catalogPanel || !headerState.catalogBtn) return;
	headerState.catalogPanel.hidden = false;
	headerState.catalogBtn.setAttribute("aria-expanded", "true");
}

function openBuy() {
	closeCatalog();
	closeMobile();
	if (!headerState.buyPanel || !headerState.buyBtn) return;
	headerState.buyPanel.hidden = false;
	headerState.buyBtn.setAttribute("aria-expanded", "true");
}

function openMobile() {
	closeDesktopMenus();
	if (!headerState.mobilePanel || !headerState.burger || !headerState.header) return;
	headerState.mobilePanel.hidden = false;
	headerState.burger.setAttribute("aria-expanded", "true");
	headerState.burger.setAttribute("aria-label", "Закрыть меню");
	headerState.header.classList.add("is-mobile-open");
	document.body.classList.add("is-locked");
}

function toggleCatalog() {
	if (!headerState.catalogBtn) return;
	const isOpen = headerState.catalogBtn.getAttribute("aria-expanded") === "true";
	if (isOpen) closeCatalog();
	else openCatalog();
}

function toggleBuy() {
	if (!headerState.buyBtn) return;
	const isOpen = headerState.buyBtn.getAttribute("aria-expanded") === "true";
	if (isOpen) closeBuy();
	else openBuy();
}

function toggleMobile() {
	if (!headerState.burger) return;
	const isOpen = headerState.burger.getAttribute("aria-expanded") === "true";
	if (isOpen) closeMobile();
	else openMobile();
}

function toggleSearchMobile() {
	if (!headerState.searchMobile || !headerState.searchPanel) return;

	closeMobile();
	const isOpen = headerState.searchMobile.getAttribute("aria-expanded") === "true";
	if (isOpen) {
		headerState.searchPanel.hidden = true;
		headerState.searchMobile.setAttribute("aria-expanded", "false");
	} else {
		headerState.searchPanel.hidden = false;
		headerState.searchMobile.setAttribute("aria-expanded", "true");
		headerState.searchInputMobile?.focus();
	}
	setHeaderHeight();
}

function toggleHeaderAccordion(btn) {
	const accordion = btn.closest("[data-header-accordion]");
	if (!accordion) return;
	const isOpen = accordion.classList.toggle("is-open");
	btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

function handleHeaderOutsideClick(target) {
	const { header, catalogPanel, catalogBtn, buyPanel, buyBtn } = headerState;
	if (!header) return;

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

	if (buyPanel && !buyPanel.hidden && !buyPanel.contains(target) && buyBtn && !buyBtn.contains(target)) {
		closeBuy();
	}
}

function initHeader() {
	const header = document.querySelector("[data-header]");
	if (!header) return;

	headerState.header = header;
	headerState.banner = header.querySelector("[data-header-banner]");
	headerState.catalogBtn = header.querySelector("[data-header-catalog-btn]");
	headerState.catalogPanel = header.querySelector("[data-header-catalog]");
	headerState.buyBtn = header.querySelector("[data-header-buy-btn]");
	headerState.buyPanel = header.querySelector("[data-header-buy]");
	headerState.burger = header.querySelector("[data-header-burger]");
	headerState.mobilePanel = header.querySelector("[data-header-mobile]");
	headerState.searchMobile = header.querySelector("[data-header-search-mobile]");
	headerState.searchPanel = header.querySelector("[data-header-search-panel]");
	headerState.searchInputMobile = header.querySelector("#header-search-input-mobile");

	try {
		if (sessionStorage.getItem(BANNER_STORAGE_KEY) === "1") {
			header.classList.add("is-banner-hidden");
			if (headerState.banner) headerState.banner.hidden = true;
		}
	} catch {
		/* ignore */
	}

	const mq = window.matchMedia("(min-width: 767.98px)");
	const onBreakpoint = () => {
		if (mq.matches) {
			closeMobile();
			if (headerState.searchPanel) {
				headerState.searchPanel.hidden = true;
				headerState.searchMobile?.setAttribute("aria-expanded", "false");
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

/* hero */
function initHero() {
	const slider = document.querySelector("[data-hero-slider]");
	if (!slider || typeof Swiper === "undefined") return;

	const pagination = document.querySelector("[data-hero-pagination]");

	return new Swiper(slider, {
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
}

function syncPaginationTheme(instance) {
	const hero = instance.el.closest(".hero");
	if (!hero) return;

	const activeSlide = instance.el.querySelector(".swiper-slide-active");
	const isDark = activeSlide?.classList.contains("hero-slide--dark");
	hero.classList.toggle("is-dark-slide", Boolean(isDark));
}

/* partners slider */
function initPartnersSliders() {
	if (typeof Swiper === "undefined") return;

	document.querySelectorAll("[data-partners-slider]").forEach((slider) => {
		const wrap = slider.closest(".buy-partners__slider-wrap");
		const nextEl = wrap?.querySelector("[data-partners-next]");

		new Swiper(slider, {
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
	});
}

/* popular */
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

/* reviews */
function initReviews() {
	const slider = document.querySelector("[data-reviews-slider]");
	if (!slider || typeof Swiper === "undefined") return;

	const pagination = document.querySelector("[data-reviews-pagination]");
	const prevEl = document.querySelector("[data-reviews-prev]");
	const nextEl = document.querySelector("[data-reviews-next]");

	return new Swiper(slider, {
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
}

function toggleReviewExpand(button) {
	const card = button.closest("[data-review-card]");
	if (!card) return;

	const expanded = card.classList.toggle("is-expanded");
	const label = button.querySelector("[data-review-expand-label]");
	if (label) {
		label.textContent = expanded ? "Свернуть отзыв" : "Раскрыть отзыв";
	}
}

function toggleFaqItem(btn) {
	const item = btn.closest("[data-faq-item]");
	const panel = item?.querySelector("[data-faq-panel]");
	if (!item || !panel) return;

	const isOpen = item.classList.toggle("is-open");
	btn.setAttribute("aria-expanded", String(isOpen));
	if (isOpen) {
		panel.removeAttribute("hidden");
	} else {
		panel.setAttribute("hidden", "");
	}
}

/* vacancies */
function initVacancyFileInputs() {
	document.querySelectorAll("[data-vacancy-file]").forEach((input) => {
		const label = input.closest(".vacancy-modal__file")?.querySelector("[data-vacancy-file-label]");
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

/* catalog */
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
	document.querySelectorAll("[data-catalog-filters]").forEach((form) => {
		form.addEventListener("submit", (event) => {
			event.preventDefault();
		});
	});
}

function toggleCatalogChip(chip) {
	const isActive = chip.classList.toggle("is-active");
	chip.setAttribute("aria-pressed", isActive ? "true" : "false");
}

function resetCatalogFilters(btn) {
	const form = btn.closest("[data-catalog-filters]");
	if (!form) return;

	form.querySelectorAll("[data-catalog-chip]").forEach((chip) => {
		chip.classList.remove("is-active");
		chip.setAttribute("aria-pressed", "false");
	});
}

/* custom select */
function closeCustomSelect(root) {
	const trigger = root.querySelector("[data-custom-select-trigger]");
	const list = root.querySelector("[data-custom-select-list]");

	root.classList.remove("is-open");
	trigger?.setAttribute("aria-expanded", "false");
	if (list) list.hidden = true;
}

function openCustomSelect(root) {
	document.querySelectorAll("[data-custom-select]").forEach((item) => {
		if (item !== root) closeCustomSelect(item);
	});

	const trigger = root.querySelector("[data-custom-select-trigger]");
	const list = root.querySelector("[data-custom-select-list]");

	root.classList.add("is-open");
	trigger?.setAttribute("aria-expanded", "true");
	if (list) {
		list.hidden = false;
		list.querySelector(".custom-select__option.is-selected")?.focus();
	}
}

function syncCustomSelectValue(root, value) {
	const native = root.querySelector(".custom-select__native");
	const list = root.querySelector("[data-custom-select-list]");
	const valueEl = root.querySelector("[data-custom-select-value]");
	const placeholder = valueEl?.dataset.placeholder || "";

	if (!native || !list) return;

	native.value = value;

	list.querySelectorAll(".custom-select__option").forEach((option) => {
		const isSelected = option.dataset.value === value;
		option.classList.toggle("is-selected", isSelected);
		option.setAttribute("aria-selected", isSelected ? "true" : "false");
	});

	const selectedOption = list.querySelector(`.custom-select__option[data-value="${value}"]`);
	if (valueEl) {
		valueEl.textContent = selectedOption?.textContent?.trim() || placeholder;
	}

	native.dispatchEvent(new Event("change", { bubbles: true }));
}

function setupCustomSelect(root) {
	const native = root.querySelector(".custom-select__native");
	const valueEl = root.querySelector("[data-custom-select-value]");
	if (!native || !valueEl) return;

	if (!valueEl.dataset.placeholder) {
		valueEl.dataset.placeholder = valueEl.textContent.trim();
	}

	const selectedNativeOption = native.options[native.selectedIndex];
	if (selectedNativeOption) {
		valueEl.textContent = selectedNativeOption.textContent.trim();
	}
}

function initCustomSelects() {
	document.querySelectorAll("[data-custom-select]").forEach(setupCustomSelect);
}

function handleCustomSelectKeyboard(event) {
	const list = event.target.closest("[data-custom-select-list]");
	if (!list) return;

	const root = list.closest("[data-custom-select]");
	const trigger = root?.querySelector("[data-custom-select-trigger]");
	if (!root || !trigger) return;

	const options = [...list.querySelectorAll(".custom-select__option")];
	const currentIndex = options.indexOf(document.activeElement);

	if (event.key === "ArrowDown") {
		event.preventDefault();
		const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
		options[nextIndex]?.focus();
	}

	if (event.key === "ArrowUp") {
		event.preventDefault();
		const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
		options[prevIndex]?.focus();
	}

	if (event.key === "Home") {
		event.preventDefault();
		options[0]?.focus();
	}

	if (event.key === "End") {
		event.preventDefault();
		options[options.length - 1]?.focus();
	}

	if (event.key === "Enter" || event.key === " ") {
		event.preventDefault();
		const option = document.activeElement;
		if (option?.classList.contains("custom-select__option")) {
			syncCustomSelectValue(root, option.dataset.value);
			closeCustomSelect(root);
			trigger.focus();
		}
	}

	if (event.key === "Escape") {
		event.preventDefault();
		closeCustomSelect(root);
		trigger.focus();
	}
}

/* product */
function toggleProductCardFavorite(btn) {
	const next = btn.getAttribute("aria-pressed") !== "true";

	btn.classList.toggle("is-active", next);
	btn.setAttribute("aria-pressed", next ? "true" : "false");
	btn.setAttribute("aria-label", next ? "Убрать из избранного" : "Добавить в избранное");
}

function activateProductTab(root, name) {
	const tabButtons = root.querySelectorAll("[data-product-tab]");
	const panels = root.querySelectorAll("[data-product-panel]");

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
}

function handleProductThumbClick(thumb) {
	const root = thumb.closest("[data-product]");
	if (!root) return;

	const src = thumb.getAttribute("data-src");
	const mainImage = root.querySelector("[data-product-main]");
	const zoomLink = root.querySelector("[data-product-zoom]");
	if (!src || !mainImage) return;

	mainImage.setAttribute("src", src);
	if (zoomLink) {
		zoomLink.setAttribute("href", src);
	}

	root.querySelectorAll("[data-product-thumb]").forEach((item) => {
		const isActive = item === thumb;
		item.classList.toggle("is-active", isActive);
		if (isActive) {
			item.setAttribute("aria-current", "true");
		} else {
			item.removeAttribute("aria-current");
		}
	});
}

function handleProductVolumeClick(chip) {
	const root = chip.closest("[data-product]");
	if (!root) return;

	root.querySelectorAll("[data-product-volume]").forEach((item) => {
		const isActive = item === chip;
		item.classList.toggle("is-active", isActive);
		item.setAttribute("aria-pressed", isActive ? "true" : "false");
	});
}

function toggleProductFavorite(btn) {
	const next = btn.getAttribute("aria-pressed") !== "true";
	btn.classList.toggle("is-active", next);
	btn.setAttribute("aria-pressed", next ? "true" : "false");
}

function handleProductTabKeydown(event, btn) {
	const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
	if (!keys.includes(event.key)) return;

	const root = btn.closest("[data-product]");
	if (!root) return;

	event.preventDefault();
	const tabButtons = [...root.querySelectorAll("[data-product-tab]")];
	const index = tabButtons.indexOf(btn);
	let nextIndex = index;

	if (event.key === "ArrowRight") {
		nextIndex = (index + 1) % tabButtons.length;
	} else if (event.key === "ArrowLeft") {
		nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
	} else if (event.key === "Home") {
		nextIndex = 0;
	} else if (event.key === "End") {
		nextIndex = tabButtons.length - 1;
	}

	const nextBtn = tabButtons[nextIndex];
	const name = nextBtn.getAttribute("data-product-tab");
	if (name) {
		activateProductTab(root, name);
		nextBtn.focus();
	}
}

/* article */
function toggleArticleLike(btn) {
	const pressed = btn.getAttribute("aria-pressed") === "true";
	btn.setAttribute("aria-pressed", String(!pressed));
	btn.classList.toggle("is-active", !pressed);
}

function initArticle() {
	const root = document.querySelector("[data-article]");
	if (!root) return;

	const toc = root.querySelector("[data-article-toc]");
	const links = toc ? [...toc.querySelectorAll("[data-article-toc-link]")] : [];
	const sections = links
		.map((link) => {
			const id = link.getAttribute("href")?.slice(1);
			const section = id ? document.getElementById(id) : null;
			return section ? { link, section } : null;
		})
		.filter(Boolean);

	if (!sections.length) return;

	const setActive = (activeLink) => {
		links.forEach((link) => {
			link.classList.toggle("is-active", link === activeLink);
		});
	};

	const observer = new IntersectionObserver(
		(entries) => {
			const visible = entries
				.filter((entry) => entry.isIntersecting)
				.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

			if (!visible) return;

			const match = sections.find(({ section }) => section === visible.target);
			if (match) setActive(match.link);
		},
		{
			rootMargin: "-20% 0px -55% 0px",
			threshold: [0, 0.25, 0.5, 1],
		},
	);

	sections.forEach(({ section }) => observer.observe(section));
}

/* ask widget */
function initAskWidget() {
	const widget = document.querySelector("[data-ask-widget]");
	if (!widget) return;

	const ASK_WIDGET_DELAY_MS = 3000;

	const showWidget = () => {
		widget.classList.add("is-visible");
		widget.setAttribute("aria-hidden", "false");
	};

	const scheduleShow = () => {
		window.setTimeout(showWidget, ASK_WIDGET_DELAY_MS);
	};

	if (document.readyState === "complete") {
		scheduleShow();
		return;
	}

	window.addEventListener("load", scheduleShow, { once: true });
}

/* document click delegation */
function initDocumentClick() {
	document.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;

		if (target.closest("[data-header-banner-close]")) {
			hideBanner();
			return;
		}

		if (target.closest("[data-header-catalog-btn]")) {
			toggleCatalog();
			return;
		}

		if (target.closest("[data-header-buy-btn]")) {
			toggleBuy();
			return;
		}

		if (target.closest("[data-header-burger]")) {
			toggleMobile();
			return;
		}

		if (target.closest("[data-header-search-mobile]")) {
			toggleSearchMobile();
			return;
		}

		const accordionBtn = target.closest("[data-header-accordion-btn]");
		if (accordionBtn) {
			toggleHeaderAccordion(accordionBtn);
			return;
		}

		const reviewExpand = target.closest("[data-review-expand]");
		if (reviewExpand) {
			toggleReviewExpand(reviewExpand);
			return;
		}

		const faqBtn = target.closest("[data-faq-btn]");
		if (faqBtn) {
			toggleFaqItem(faqBtn);
			return;
		}

		const catalogChip = target.closest("[data-catalog-chip]");
		if (catalogChip) {
			toggleCatalogChip(catalogChip);
			return;
		}

		if (target.closest("[data-catalog-filters-reset]")) {
			resetCatalogFilters(target.closest("[data-catalog-filters-reset]"));
			return;
		}

		const selectOption = target.closest(".custom-select__option");
		if (selectOption) {
			const root = selectOption.closest("[data-custom-select]");
			const trigger = root?.querySelector("[data-custom-select-trigger]");
			if (root && selectOption.dataset.value) {
				syncCustomSelectValue(root, selectOption.dataset.value);
				closeCustomSelect(root);
				trigger?.focus();
			}
			return;
		}

		const selectTrigger = target.closest("[data-custom-select-trigger]");
		if (selectTrigger) {
			const root = selectTrigger.closest("[data-custom-select]");
			if (root) {
				if (root.classList.contains("is-open")) closeCustomSelect(root);
				else openCustomSelect(root);
			}
			return;
		}

		const productCardFavorite = target.closest("[data-product-card-favorite]");
		if (productCardFavorite) {
			toggleProductCardFavorite(productCardFavorite);
			return;
		}

		const productThumb = target.closest("[data-product-thumb]");
		if (productThumb) {
			handleProductThumbClick(productThumb);
			return;
		}

		const productVolume = target.closest("[data-product-volume]");
		if (productVolume) {
			handleProductVolumeClick(productVolume);
			return;
		}

		const productFavorite = target.closest("[data-product-favorite]");
		if (productFavorite) {
			toggleProductFavorite(productFavorite);
			return;
		}

		const productTab = target.closest("[data-product-tab]");
		if (productTab) {
			const root = productTab.closest("[data-product]");
			const name = productTab.getAttribute("data-product-tab");
			if (root && name) activateProductTab(root, name);
			return;
		}

		const articleLike = target.closest("[data-article-like]");
		if (articleLike) {
			toggleArticleLike(articleLike);
			return;
		}

		document.querySelectorAll("[data-custom-select].is-open").forEach((root) => {
			if (!root.contains(target)) closeCustomSelect(root);
		});

		handleHeaderOutsideClick(target);
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			closeDesktopMenus();
			closeMobile();
			document.querySelectorAll("[data-custom-select].is-open").forEach((root) => {
				closeCustomSelect(root);
			});
		}

		const productTab = event.target.closest?.("[data-product-tab]");
		if (productTab) {
			handleProductTabKeydown(event, productTab);
		}

		handleCustomSelectKeyboard(event);
	});
}

/* init */
isWebp();
initHeader();
initHero();
initPartnersSliders();
initPopular();
initReviews();
initVacancyFileInputs();
initVacancyForms();
initVacancyFancybox();
initCatalogCats();
initCatalogFilters();
initCustomSelects();
initArticle();
initAskWidget();
initDocumentClick();

if (typeof Fancybox !== "undefined") {
	Fancybox.bind("[data-fancybox]:not([data-src^='#modal-'])");
}
