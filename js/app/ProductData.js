const client = contentful.createClient({
	/*
    This is the space ID.
    A space is like a project folder in Contentful terms
  */
	space: "ulqakrizaaqv",
	/*
    This is the access token for this space.
    Normally you get both ID and the token in the Contentful web app
  */
	accessToken: "JEjFrPMnbYgbxHbWLaeupciQ-LwyOnFrKMxT2UtkITw",
});

export class ProductData {
	async getData() {
		try {
			const response = await client.getEntries({
				content_type: "accessoriesStore",
			});

			// const response = await fetch("data.json");
			// const data = await response.json();
			// let items = data.items;

			let items = response.items;

			items = items.map((item) => {
				const { title, cate, price } = item.fields;
				const { id } = item.sys;
				const image = item.fields.image.fields.file.url;

				return { id, image, title, cate, price };
			});

			return items;
		} catch (err) {
			throw new Error(err.message);
		}
	}
}
