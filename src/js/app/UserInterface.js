import Storage from "./Storage";

export class UserInterface {
	constructor() {
		this.productsElement = document.querySelector(".products__items");
		this.cartElement = document.querySelector(".cart");
		this.cartOverlayElement = document.querySelector(".cart__overlay");
		this.cartItemsElement = document.querySelector(".cart__items");

		this.cart = [];
		this.buttons = [];
	}

	displayProducts(items) {
		let productElement = "";

		items.forEach((item) => {
			const { id, image, title, cate, price } = item;

			productElement += `
				<div class="products__items-item prod-card">
					<div class="products__image prod-card__image">
						<img src=${image} alt="product" />
						<div class="products__overlay prod-card__overlay site--center">
							<button class="products__add-cart prod-card__add-cart" data-id=${id}>
								add to cart
							</button>
						</div>
					</div>
					<section class="products__body prod-card__body">
						<section class="products__text prod-card__text">
							<h3 class="products__title prod-card__title">${title}</h3>
							<p class="products__cate prod-card__cate">${cate}</p>
						</section>
						<h3 class="products__price prod-card__price">$${price}</h3>
					</section>
				</div>
			`;
		});

		this.productsElement.innerHTML = productElement;
	}

	updateCartValues(cartItems) {
		const cartTempElement = document.querySelector(".navbar-cart__temp");
		const cartTotalElement = document.querySelector(".cart__total-price");

		let cartQuantity = 0;
		let cartTotal = 0;

		cartItems.forEach((item) => {
			const { price, quantity } = item;

			cartQuantity += quantity;
			cartTotal += price * quantity;
		});

		cartTempElement.textContent = `CART( ${cartQuantity} )`;
		cartTotalElement.textContent = `$${parseFloat(cartTotal).toFixed(2)}`;
	}

	addToCartBtnActions() {
		this.buttons.push(...document.querySelectorAll(".products__add-cart"));

		this.buttons.forEach((button) => {
			let hasButtonInCart = this.cart.find(
				(item) => item.id == button.dataset.id
			);

			if (hasButtonInCart) {
				button.textContent = "Browse Cart";
				button.disabled = true;
			}
		});

		this.productsElement.addEventListener("click", (e) => {
			const target = e.target;

			if (target.classList.contains("products__add-cart")) {
				target.textContent = "Browse Cart";
				target.disabled = true;

				const id = target.dataset.id;
				const singleItem = { ...Storage.getProduct(id), quantity: 1 };

				this.cart = [...this.cart, singleItem];

				this.updateCartValues(this.cart);

				this.addProductsToCart(singleItem);

				Storage.saveCartItems(this.cart);

				this.showCart();
			}
		});
	}

	addProductsToCart(item) {
		const { id, image, title, price, quantity } = item;

		const cartItemElement = `
			<div class="cart__item site--flex cart-card">
				<div class="cart__info site--flex cart-card__info">
					<div class="cart__image cart-card__image">
						<img src=${image} alt="product" />
					</div>
					<section class="cart__texts cart-card__texts">
						<h5 class="cart__title cart-card__title">${title}</h5>
						<h5 class="cart__price cart-card__price">${price}</h5>
						<p class="cart__remove cart-card__remove" data-id=${id}>remove</p>
					</section>
				</div>
				<div class="cart__count cart-card__count">
					<div
						class="
							cart__count-plus
							cart-card__count-icon cart-card__count-plus
						"
						data-id=${id}
					>
						<img src="images/chevron-up-icon.svg" alt="+" class="item__plus" />
					</div>
					<p class="cart__count-number cart-card__count-number">${quantity}</p>
					<div
						class="
							cart__count-minus
							cart-card__count-icon cart-card__count-minus
						"
						data-id=${id}
					>
						<img src="images/chevron-down-icon.svg" alt="-" class="item__minus" />
					</div>
				</div>
			</div>
		`;

		this.cartItemsElement.innerHTML += cartItemElement;
	}

	showCart() {
		this.cartOverlayElement.classList.add("show--overlay");
		this.cartElement.classList.add("show--cart");
	}

	hideCart() {
		this.cartOverlayElement.classList.remove("show--overlay");
		this.cartElement.classList.remove("show--cart");
	}

	cartSetting() {
		const navCartElement = document.querySelector(".navbar__cart");
		const cartCloseElement = document.querySelector(".cart__close");

		this.cart = Storage.getCart();
		this.updateCartValues(this.cart);

		this.cart.forEach((item) => this.addProductsToCart(item));

		navCartElement.addEventListener("click", this.showCart.bind(this));
		cartCloseElement.addEventListener("click", this.hideCart.bind(this));
	}

	setQuantity({ target, calc, element }) {
		const id = target.parentElement.dataset.id;
		const item = this.cart.find((item) => item.id === id);

		switch (calc) {
			case "+":
				item.quantity += 1;
				break;

			case "-":
				item.quantity -= 1;
				break;
		}

		target["parentElement"][element]["textContent"] = item.quantity;

		this.updateCartValues(this.cart);
		Storage.saveCartItems(this.cart);

		if (item.quantity <= 0) {
			target.closest(".cart__item").remove();
			this.removeItem(id);
		}
	}

	cartLogic() {
		const clearCartElement = document.querySelector(".cart__clear");
		clearCartElement.addEventListener("click", this.clearCart.bind(this));

		this.cartElement.addEventListener("click", (e) => {
			const target = e.target;

			if (target.classList.contains("cart__remove")) {
				const id = target.dataset.id;

				target.closest(".cart__item").remove();
				this.removeItem(id);
			} else if (target.classList.contains("item__plus")) {
				this.setQuantity({ target, calc: "+", element: "nextElementSibling" });
			} else if (target.classList.contains("item__minus")) {
				this.setQuantity({
					target,
					calc: "-",
					element: "previousElementSibling",
				});
			}
		});
	}

	clearCart() {
		let itemsId = this.cart.map((item) => item.id);
		itemsId.forEach((id) => this.removeItem(id));

		this.cartItemsElement.innerHTML = [
			...this.cartItemsElement.children,
		].splice(0 - 1);
		this.cartItemsElement.textContent = null;
	}

	removeItem(id) {
		this.cart = this.cart.filter((item) => item.id !== id);
		Storage.saveCartItems(this.cart);
		this.updateCartValues(this.cart);

		let button = this.resetButton(id);
		button.textContent = "add to cart";
		button.disabled = false;

		this.hideCart();
	}

	resetButton(id) {
		return this.buttons.find((button) => button.dataset.id === id);
	}
}
