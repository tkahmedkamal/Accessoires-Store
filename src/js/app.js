import "regenerator-runtime/runtime";

import { ProductData } from "./app/ProductData";
import { UserInterface } from "./app/UserInterface";
import Storage from "./app/Storage";
import { cursor, parallaxScroll } from "./Utility/UiTouches";
import "../sass/app.scss";

class App {
	static init() {
		const productData = new ProductData();
		const userInterface = new UserInterface();

		userInterface.cartSetting();
		parallaxScroll();
		cursor();

		productData
			.getData()
			.then((data) => {
				userInterface.displayProducts(data);
				Storage.saveProductsData(data);
			})
			.then(() => {
				userInterface.addToCartBtnActions();
				userInterface.cartLogic();
			});
	}
}

App.init();
