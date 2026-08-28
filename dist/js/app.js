"use strict";

import { isWebp } from "./modules/webp.js";
import "./modules/header.js";
import "./modules/hero.js";
import "./modules/partners-slider.js";
import "./modules/popular.js";
import "./modules/reviews.js";
import "./modules/faq.js";
import "./modules/vacancies.js";
import "./modules/catalog.js";
import "./modules/product.js";
import { initArticle } from "./modules/article.js";

isWebp();
initArticle();

if (typeof Fancybox !== "undefined") {
	Fancybox.bind("[data-fancybox]:not([data-src^='#modal-'])");
}
