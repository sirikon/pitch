const events = [];
let enabled = false;
let start = null;
let end = null;

function enable() {
	enabled = true;
	start = Date.now();
}

function track(action, file) {
	if (!enabled) { return; }
	events.push({ action, file });
}

function display() {
	end = Date.now();

	const runTime = (end - start) + 'ms';

	console.log('Run time: ' + runTime);

	const index = {};

	events.forEach((event) => {
		const key = `${event.action}_${event.file}`;
		if (index[key] === undefined) {
			index[key] = {
				action: event.action,
				file: event.file,
				count: 0,
			};
		}
		index[key].count++;
	});

	console.log('\nEvents:');

	Object.keys(index)
		.map((key) => index[key])
		.sort((a, b) => a.count < b.count)
		.forEach((event) => console.log(`${event.count} [${event.action}] ${event.file}`));
}

module.exports = {
	enable,
	track,
	display,
};
