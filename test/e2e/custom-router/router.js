const auto = false;

const custom = () => {
	return {
		'cosa.html': { target: 'index.ejs', params: { title: 'Routing is working.' } }
	};
};

module.exports = { auto, custom };
