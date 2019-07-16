module.exports = {
	auto: {
		exclude: '_src'
	},
	custom: (data) => {
		var result = {};

		data.products.forEach((product) => {
			result['products/' + product.id + '/index.html'] = { target: '_src/views/product.ejs', params: { product } };
		});

		return result;
	}
};
