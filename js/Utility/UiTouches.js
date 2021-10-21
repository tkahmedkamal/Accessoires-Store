export const parallaxScroll = () => {
	window.addEventListener("scroll", function (e) {
		let height = window.scrollY;
		let items = document.querySelectorAll(".products__items-item");

		items.forEach((item, index) => {
			item.style.transform = `translateY(${(0.5 + height * index) / 2 / 20}px)`;
		});
	});
};

export const cursor = () => {
	const cartOverlayElement = document.querySelector(".cart__overlay");
	const cartElement = document.querySelector(".cart");
	const body = document.querySelector("body");

	["mouseover", "click"].forEach((ev) => {
		if (ev === "mouseover") {
			cartOverlayElement.addEventListener(ev, (e) => {
				e.target.classList.contains("show--overlay")
					? (body.style.cursor = "url('images/cursor.cur'), auto")
					: (body.style.cursor = "auto");
			});
		} else {
			cartOverlayElement.addEventListener(ev, (e) => {
				if (e.target.classList.contains("cart__overlay")) {
					e.target.classList.remove("show--overlay");
					cartElement.classList.remove("show--cart");
					body.style.cursor = "auto";
				}
			});
		}
	});
};
