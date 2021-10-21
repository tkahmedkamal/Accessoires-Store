import { ProductData } from "./app/ProductData.js";
import { UserInterface } from "./app/UserInterface.js";
import Storage from "./app/Storage.js";
import { cursor, parallaxScroll } from "./Utility/UiTouches.js";
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
