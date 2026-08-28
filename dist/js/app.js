"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // header
    const BANNER_STORAGE_KEY = "kipni-banner-hidden";
    const BANNER_CLOSE_MS = 460;
    const HEADER_DESKTOP_MQ = "(min-width: 1199.98px)";

    const FAQ_ITEM = ".about-faq__item, .contacts-faq__item, .delivery-faq__item, .vacancy-card";
    const FAQ_BTN = ".about-faq__question, .contacts-faq__question, .delivery-faq__question, .vacancy-card__header";
    const FAQ_PANEL = ".about-faq__answer, .contacts-faq__answer, .delivery-faq__answer, .vacancy-card__body";

    let header = null;
    let banner = null;
    let catalogBtn = null;
    let catalogPanel = null;
    let buyBtn = null;
    let buyPanel = null;
    let burger = null;
    let menuPanel = null;
    let searchMobile = null;
    let searchPanel = null;
    let searchInputMobile = null;

    function isDesktopHeader() {
        return window.matchMedia(HEADER_DESKTOP_MQ).matches;
    }

    function setHeaderHeight() {
        if (!header) return;
        const height = Math.ceil(header.getBoundingClientRect().height);
        document.documentElement.style.setProperty("--header-height", `${height}px`);
    }

    function finishBannerHide() {
        if (!header) return;

        header.classList.add("is-banner-hidden");
        if (banner) {
            banner.hidden = true;
            banner.classList.remove("is-closing");
        }
        try {
            sessionStorage.setItem(BANNER_STORAGE_KEY, "1");
        } catch {
            /* ignore */
        }
        setHeaderHeight();
    }

    function hideBanner() {
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
        if (!catalogBtn) return;
        catalogBtn.setAttribute("aria-expanded", "false");

        if (isDesktopHeader()) {
            catalogBtn.closest(".header__catalog-wrap")?.classList.remove("is-open");
        }
    }

    function closeBuy() {
        if (!buyPanel || !buyBtn) return;
        buyPanel.hidden = true;
        buyBtn.setAttribute("aria-expanded", "false");
    }

    function closeMobile() {
        if (!menuPanel || !burger || !header) return;

        if (isDesktopHeader()) {
            menuPanel.hidden = false;
            return;
        }

        menuPanel.hidden = true;
        burger.setAttribute("aria-expanded", "false");
        burger.setAttribute("aria-label", "Открыть меню");
        header.classList.remove("is-mobile-open");
        document.body.classList.remove("is-locked");
    }

    function closeDesktopMenus() {
        closeCatalog();
        closeBuy();
    }

    function openCatalog() {
        closeBuy();
        if (!catalogBtn) return;
        catalogBtn.setAttribute("aria-expanded", "true");

        if (!isDesktopHeader()) {
            catalogBtn.closest(".header__catalog-wrap")?.classList.add("is-open");
        }
    }

    function openBuy() {
        closeCatalog();
        closeMobile();
        if (!buyPanel || !buyBtn) return;
        buyPanel.hidden = false;
        buyBtn.setAttribute("aria-expanded", "true");
    }

    function openMobile() {
        closeDesktopMenus();
        if (!menuPanel || !burger || !header) return;
        menuPanel.hidden = false;
        burger.setAttribute("aria-expanded", "true");
        burger.setAttribute("aria-label", "Закрыть меню");
        header.classList.add("is-mobile-open");
        document.body.classList.add("is-locked");
    }

    function toggleCatalog() {
        if (!catalogBtn) return;

        if (isDesktopHeader()) {
            const isOpen = catalogBtn.getAttribute("aria-expanded") === "true";
            if (isOpen) closeCatalog();
            else openCatalog();
            return;
        }

        toggleHeaderAccordion(catalogBtn);
    }

    function toggleBuy() {
        if (!buyBtn) return;
        const isOpen = buyBtn.getAttribute("aria-expanded") === "true";
        if (isOpen) closeBuy();
        else openBuy();
    }

    function toggleMobile() {
        if (!burger) return;
        const isOpen = burger.getAttribute("aria-expanded") === "true";
        if (isOpen) closeMobile();
        else openMobile();
    }

    function toggleSearchMobile() {
        if (!searchMobile || !searchPanel) return;

        closeMobile();
        const isOpen = searchMobile.getAttribute("aria-expanded") === "true";
        if (isOpen) {
            searchPanel.hidden = true;
            searchMobile.setAttribute("aria-expanded", "false");
        } else {
            searchPanel.hidden = false;
            searchMobile.setAttribute("aria-expanded", "true");
            searchInputMobile?.focus();
        }
        setHeaderHeight();
    }

    function toggleHeaderAccordion(btn) {
        const accordion = btn.closest(".header__menu-accordion");
        if (!accordion) return;
        const isOpen = accordion.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }

    function syncMobileHeaderAccordions() {
        if (isDesktopHeader() || !header) return;

        header.querySelectorAll(".header__menu-accordion.is-open").forEach((accordion) => {
            const toggle = accordion.querySelector(".header__menu-row--toggle, .header__catalog-btn");
            toggle?.setAttribute("aria-expanded", "true");
        });
    }

    function handleHeaderOutsideClick(target) {
        if (!header) return;

        if (!header.contains(target)) {
            closeDesktopMenus();
            return;
        }

        if (
            isDesktopHeader() &&
            catalogPanel &&
            catalogBtn?.getAttribute("aria-expanded") === "true" &&
            !catalogPanel.contains(target) &&
            !catalogBtn.contains(target)
        ) {
            closeCatalog();
        }

        if (buyPanel && !buyPanel.hidden && !buyPanel.contains(target) && buyBtn && !buyBtn.contains(target)) {
            closeBuy();
        }
    }

    header = document.querySelector(".header");
    if (header) {
        banner = header.querySelector(".header-banner");
        catalogBtn = header.querySelector(".header__catalog-btn");
        catalogPanel = header.querySelector(".header-catalog");
        buyBtn = header.querySelector(".header-buy-btn");
        buyPanel = header.querySelector(".header-buy");
        burger = header.querySelector(".header__burger");
        menuPanel = header.querySelector(".header__menu");
        searchMobile = header.querySelector(".header__search-mobile");
        searchPanel = header.querySelector(".header__search-mobile-panel");
        searchInputMobile = header.querySelector("#header-search-input-mobile");

        try {
            if (sessionStorage.getItem(BANNER_STORAGE_KEY) === "1") {
                header.classList.add("is-banner-hidden");
                if (banner) banner.hidden = true;
            }
        } catch {
            /* ignore */
        }

        const mq = window.matchMedia(HEADER_DESKTOP_MQ);
        const onBreakpoint = () => {
            if (mq.matches) {
                menuPanel.hidden = false;
                closeDesktopMenus();
                closeMobile();
                if (searchPanel) {
                    searchPanel.hidden = true;
                    searchMobile?.setAttribute("aria-expanded", "false");
                }
            } else {
                closeDesktopMenus();
                syncMobileHeaderAccordions();
                if (burger?.getAttribute("aria-expanded") !== "true") {
                    menuPanel.hidden = true;
                }
            }
            setHeaderHeight();
        };

        onBreakpoint();

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


    // sliders
    function syncPaginationTheme(instance) {
        const hero = instance.el.closest(".hero");
        if (!hero) return;

        const activeSlide = instance.el.querySelector(".swiper-slide-active");
        const isDark = activeSlide?.classList.contains("hero-slide--dark");
        hero.classList.toggle("is-dark-slide", Boolean(isDark));
    }

    if (typeof Swiper !== "undefined") {
        if (document.querySelector(".hero__slider")) {
            const heroSlider = document.querySelector(".hero__slider");
            const heroPagination = heroSlider.closest(".hero")?.querySelector(".hero__pagination");

            new Swiper(heroSlider, {
                slidesPerView: 1,
                speed: 600,
                loop: true,
                effect: "fade",
                fadeEffect: {
                    crossFade: true,
                },
                pagination: heroPagination
                    ? {
                        el: heroPagination,
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

        if (document.querySelectorAll(".buy-partners__slider").length > 0) {
            document.querySelectorAll(".buy-partners__slider").forEach((slider) => {
                const wrap = slider.closest(".buy-partners__slider-wrap");
                const nextEl = wrap?.querySelector(".buy-partners__next");

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

        if (document.querySelector(".popular__slider")) {
            const popularSlider = document.querySelector(".popular__slider");
            const popularNext = popularSlider.closest(".popular__slider-container")?.querySelector(".popular__next");

            new Swiper(popularSlider, {
                slidesPerView: "auto",
                spaceBetween: 11,
                speed: 500,
                navigation: popularNext
                    ? {
                        nextEl: popularNext,
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

        if (document.querySelector(".reviews__slider")) {
            const reviewsSlider = document.querySelector(".reviews__slider");
            const reviewsWrap = reviewsSlider.closest(".reviews__slider-wrap");
            const reviewsPagination = reviewsWrap?.querySelector(".reviews__pagination");
            const reviewsPrev = reviewsWrap?.querySelector(".reviews__prev");
            const reviewsNext = reviewsWrap?.querySelector(".reviews__next");

            new Swiper(reviewsSlider, {
                slidesPerView: 1,
                spaceBetween: 16,
                speed: 500,
                pagination: reviewsPagination
                    ? {
                        el: reviewsPagination,
                        clickable: true,
                    }
                    : undefined,
                navigation: {
                    prevEl: reviewsPrev || undefined,
                    nextEl: reviewsNext || undefined,
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

        if (document.querySelector(".catalog-cats__slider")) {
            const catalogCatsSlider = document.querySelector(".catalog-cats__slider");
            const catalogCatsNext = catalogCatsSlider.closest(".catalog-cats__container")?.querySelector(".catalog-cats__next");

            new Swiper(catalogCatsSlider, {
                slidesPerView: "auto",
                spaceBetween: 12,
                speed: 500,
                navigation: catalogCatsNext
                    ? {
                        nextEl: catalogCatsNext,
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
    }


    // catalog filters
    if (document.querySelectorAll(".catalog-filters").length > 0) {
        document.querySelectorAll(".catalog-filters").forEach((form) => {
            form.addEventListener("submit", (event) => {
                event.preventDefault();
            });
        });
    }


    // custom select
    const customSelectPlaceholders = new WeakMap();

    function closeCustomSelect(root) {
        const trigger = root.querySelector(".custom-select__trigger");
        const list = root.querySelector(".custom-select__list");

        root.classList.remove("is-open");
        trigger?.setAttribute("aria-expanded", "false");
        if (list) list.hidden = true;
    }

    function openCustomSelect(root) {
        document.querySelectorAll(".custom-select").forEach((item) => {
            if (item !== root) closeCustomSelect(item);
        });

        const trigger = root.querySelector(".custom-select__trigger");
        const list = root.querySelector(".custom-select__list");

        root.classList.add("is-open");
        trigger?.setAttribute("aria-expanded", "true");
        if (list) {
            list.hidden = false;
            list.querySelector(".custom-select__option.is-selected")?.focus();
        }
    }

    function syncCustomSelectValue(root, value) {
        const native = root.querySelector(".custom-select__native");
        const list = root.querySelector(".custom-select__list");
        const valueEl = root.querySelector(".custom-select__value");
        const placeholder = customSelectPlaceholders.get(root) || "";

        if (!native || !list) return;

        native.value = value;

        list.querySelectorAll(".custom-select__option").forEach((option) => {
            const isSelected = option.getAttribute("value") === value;
            option.classList.toggle("is-selected", isSelected);
            option.setAttribute("aria-selected", isSelected ? "true" : "false");
        });

        const selectedOption = list.querySelector(`.custom-select__option[value="${value}"]`);
        if (valueEl) {
            valueEl.textContent = selectedOption?.textContent?.trim() || placeholder;
        }

        native.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function setupCustomSelect(root) {
        const native = root.querySelector(".custom-select__native");
        const valueEl = root.querySelector(".custom-select__value");
        if (!native || !valueEl) return;

        if (!customSelectPlaceholders.has(root)) {
            customSelectPlaceholders.set(root, valueEl.textContent.trim());
        }

        const selectedNativeOption = native.options[native.selectedIndex];
        if (selectedNativeOption) {
            valueEl.textContent = selectedNativeOption.textContent.trim();
        }
    }

    if (document.querySelectorAll(".custom-select").length > 0) {
        document.querySelectorAll(".custom-select").forEach(setupCustomSelect);
    }


    // vacancy
    if (document.querySelectorAll(".vacancy-modal__file-input").length > 0) {
        document.querySelectorAll(".vacancy-modal__file-input").forEach((input) => {
            const label = input.closest(".vacancy-modal__file")?.querySelector(".vacancy-modal__file-text");
            if (!label) return;

            const defaultText = label.textContent.trim();

            input.addEventListener("change", () => {
                const file = input.files && input.files[0];
                label.textContent = file ? file.name : defaultText;
            });
        });
    }

    if (document.querySelectorAll(".vacancy-modal__form").length > 0) {
        document.querySelectorAll(".vacancy-modal__form").forEach((form) => {
            form.addEventListener("submit", (event) => {
                event.preventDefault();
            });
        });
    }


    // article
    if (document.querySelector(".article")) {
        const articleRoot = document.querySelector(".article");
        const toc = articleRoot.querySelector(".article-toc");
        const links = toc ? [...toc.querySelectorAll(".article-toc__link")] : [];
        const sections = links
            .map((link) => {
                const id = link.getAttribute("href")?.slice(1);
                const section = id ? document.getElementById(id) : null;
                return section ? { link, section } : null;
            })
            .filter(Boolean);

        if (sections.length > 0) {
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
    }


    // ask widget
    if (document.querySelector(".ask-widget")) {
        const widget = document.querySelector(".ask-widget");
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
        } else {
            window.addEventListener("load", scheduleShow, { once: true });
        }
    }


    // helpers
    function toggleReviewExpand(button) {
        const card = button.closest(".review-card");
        if (!card) return;

        const expanded = card.classList.toggle("is-expanded");
        const label = button.querySelector(".review-card__expand-label");
        if (label) {
            label.textContent = expanded ? "Свернуть отзыв" : "Раскрыть отзыв";
        }
    }

    function toggleFaqItem(btn) {
        const item = btn.closest(FAQ_ITEM);
        const panel = item?.querySelector(FAQ_PANEL);
        if (!item || !panel) return;

        const isOpen = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(isOpen));
        if (isOpen) {
            panel.removeAttribute("hidden");
        } else {
            panel.setAttribute("hidden", "");
        }
    }

    function toggleCatalogChip(chip) {
        const isActive = chip.classList.toggle("is-active");
        chip.setAttribute("aria-pressed", isActive ? "true" : "false");
    }

    function resetCatalogFilters(btn) {
        const form = btn.closest(".catalog-filters");
        if (!form) return;

        form.querySelectorAll(".catalog-chip").forEach((chip) => {
            chip.classList.remove("is-active");
            chip.setAttribute("aria-pressed", "false");
        });
    }

    function getProductTabName(btn) {
        const panelId = btn.getAttribute("aria-controls");
        return panelId?.replace("product-panel-", "") || "";
    }

    function getProductPanelName(panel) {
        return panel.id?.replace("product-panel-", "") || "";
    }

    function toggleProductCardFavorite(btn) {
        const next = btn.getAttribute("aria-pressed") !== "true";

        btn.classList.toggle("is-active", next);
        btn.setAttribute("aria-pressed", next ? "true" : "false");
        btn.setAttribute("aria-label", next ? "Убрать из избранного" : "Добавить в избранное");
    }

    function activateProductTab(root, name) {
        const tabButtons = root.querySelectorAll(".product-tabs__btn");
        const panels = root.querySelectorAll(".product-tabs__panel");

        tabButtons.forEach((btn) => {
            const isActive = getProductTabName(btn) === name;
            btn.classList.toggle("is-active", isActive);
            btn.setAttribute("aria-selected", isActive ? "true" : "false");
            btn.tabIndex = isActive ? 0 : -1;
        });

        panels.forEach((panel) => {
            const isActive = getProductPanelName(panel) === name;
            panel.classList.toggle("is-active", isActive);
            if (isActive) {
                panel.removeAttribute("hidden");
            } else {
                panel.setAttribute("hidden", "");
            }
        });
    }

    function handleProductThumbClick(thumb) {
        const root = thumb.closest(".product");
        if (!root) return;

        const src = thumb.querySelector("img")?.getAttribute("src");
        const mainImage = root.querySelector(".product-gallery__image");
        const zoomLink = root.querySelector(".product-gallery__zoom");
        if (!src || !mainImage) return;

        mainImage.setAttribute("src", src);
        if (zoomLink) {
            zoomLink.setAttribute("href", src);
        }

        root.querySelectorAll(".product-gallery__thumb").forEach((item) => {
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
        const root = chip.closest(".product");
        if (!root) return;

        root.querySelectorAll(".product-info__chip").forEach((item) => {
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

    function toggleArticleLike(btn) {
        const pressed = btn.getAttribute("aria-pressed") === "true";
        btn.setAttribute("aria-pressed", String(!pressed));
        btn.classList.toggle("is-active", !pressed);
    }

    function handleProductTabKeydown(event, btn) {
        const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
        if (!keys.includes(event.key)) return;

        const root = btn.closest(".product");
        if (!root) return;

        event.preventDefault();
        const tabButtons = [...root.querySelectorAll(".product-tabs__btn")];
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
        const name = getProductTabName(nextBtn);
        if (name) {
            activateProductTab(root, name);
            nextBtn.focus();
        }
    }

    function handleCustomSelectKeyboard(event) {
        const list = event.target.closest(".custom-select__list");
        if (!list) return;

        const root = list.closest(".custom-select");
        const trigger = root?.querySelector(".custom-select__trigger");
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
                const value = option.getAttribute("value");
                if (value) {
                    syncCustomSelectValue(root, value);
                    closeCustomSelect(root);
                    trigger.focus();
                }
            }
        }

        if (event.key === "Escape") {
            event.preventDefault();
            closeCustomSelect(root);
            trigger.focus();
        }
    }


    // click handlers
    document.addEventListener("click", (e) => {
        const target = e.target;
        if (!(target instanceof Element)) return;

        if (target.closest(".header-banner__close")) {
            hideBanner();
        }

        if (target.closest(".header__catalog-btn")) {
            toggleCatalog();
        }

        if (target.closest(".header-buy-btn")) {
            toggleBuy();
        }

        if (target.closest(".header__burger")) {
            toggleMobile();
        }

        if (target.closest(".header__search-mobile")) {
            toggleSearchMobile();
        }

        const accordionBtn = target.closest(".header__menu-row--toggle");
        if (accordionBtn && !target.closest(".header__catalog-btn")) {
            toggleHeaderAccordion(accordionBtn);
        }

        const reviewExpand = target.closest(".review-card__expand");
        if (reviewExpand) {
            toggleReviewExpand(reviewExpand);
        }

        const faqBtn = target.closest(FAQ_BTN);
        if (faqBtn) {
            toggleFaqItem(faqBtn);
        }

        const catalogChip = target.closest(".catalog-chip");
        if (catalogChip) {
            toggleCatalogChip(catalogChip);
        }

        const catalogFiltersReset = target.closest(".catalog-filters__reset");
        if (catalogFiltersReset) {
            resetCatalogFilters(catalogFiltersReset);
        }

        const selectOption = target.closest(".custom-select__option");
        if (selectOption) {
            const root = selectOption.closest(".custom-select");
            const trigger = root?.querySelector(".custom-select__trigger");
            const value = selectOption.getAttribute("value");
            if (root && value) {
                syncCustomSelectValue(root, value);
                closeCustomSelect(root);
                trigger?.focus();
            }
        }

        const selectTrigger = target.closest(".custom-select__trigger");
        if (selectTrigger) {
            const root = selectTrigger.closest(".custom-select");
            if (root) {
                if (root.classList.contains("is-open")) closeCustomSelect(root);
                else openCustomSelect(root);
            }
        }

        const productCardFavorite = target.closest(".product-card__favorite");
        if (productCardFavorite) {
            toggleProductCardFavorite(productCardFavorite);
        }

        const productThumb = target.closest(".product-gallery__thumb");
        if (productThumb) {
            handleProductThumbClick(productThumb);
        }

        const productVolume = target.closest(".product-info__chip");
        if (productVolume) {
            handleProductVolumeClick(productVolume);
        }

        const productFavorite = target.closest(".product-info__favorite");
        if (productFavorite) {
            toggleProductFavorite(productFavorite);
        }

        const productTab = target.closest(".product-tabs__btn");
        if (productTab) {
            const root = productTab.closest(".product");
            const name = getProductTabName(productTab);
            if (root && name) activateProductTab(root, name);
        }

        const articleLike = target.closest(".article__like");
        if (articleLike) {
            toggleArticleLike(articleLike);
        }

        document.querySelectorAll(".custom-select.is-open").forEach((root) => {
            if (!root.contains(target)) closeCustomSelect(root);
        });

        handleHeaderOutsideClick(target);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeDesktopMenus();
            closeMobile();
            document.querySelectorAll(".custom-select.is-open").forEach((root) => {
                closeCustomSelect(root);
            });
        }

        const productTab = e.target.closest?.(".product-tabs__btn");
        if (productTab) {
            handleProductTabKeydown(e, productTab);
        }

        handleCustomSelectKeyboard(e);
    });


});


if (typeof Fancybox !== "undefined") {
    Fancybox.bind("[data-fancybox]", {
        autoFocus: true,
        placeFocusBack: true,
        backdropClick: "close",
        dragToClose: (fancybox) => fancybox.getSlide()?.type !== "inline",
    });
}
