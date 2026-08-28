export function initArticle() {
	const root = document.querySelector("[data-article]");
	if (!root) return;

	const likeBtn = root.querySelector("[data-article-like]");
	if (likeBtn) {
		likeBtn.addEventListener("click", () => {
			const pressed = likeBtn.getAttribute("aria-pressed") === "true";
			likeBtn.setAttribute("aria-pressed", String(!pressed));
			likeBtn.classList.toggle("is-active", !pressed);
		});
	}

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
		}
	);

	sections.forEach(({ section }) => observer.observe(section));
}
