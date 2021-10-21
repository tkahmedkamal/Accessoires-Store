export default class {
	static saveProductsData(items) {
		localStorage.setItem("products", JSON.stringify(items));
	}

	static getProduct(id) {
		let items = JSON.parse(localStorage.getItem("products"));

		return items.find((item) => item.id === id);
	}

	static saveCartItems(items) {
		localStorage.setItem("cart", JSON.stringify(items));
	}

	static getCart() {
		return localStorage.getItem("cart")
			? JSON.parse(localStorage.getItem("cart"))
			: [];
	}
}
