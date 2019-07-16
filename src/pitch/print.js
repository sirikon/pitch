const c = require('ansi-colors');

function pad(length, char) {
	const result = [];
	for (var i = 0; i < length; i++) {
		result.push(char);
	}
	return result.join('');
}

const space = (length) => pad(length, ' ');
const hLine = (length) => pad(length, '─');

function getTextWidth(text) {
	let maxWidth = 0;
	const lines = text.split('\n');
	for (var i = 0; i < lines.length; i++) {
		const length = lines[i].length;
		if (length > maxWidth) {
			maxWidth = length;
		}
	}
	return maxWidth;
}

function trimText(text) {
	return text.trim();
}

function error(text) {
	const trimmedText = trimText(text);
	const lines = trimmedText.split('\n');
	const textWidth = getTextWidth(trimmedText);

	console.log(`${c.redBright('┌')}${c.redBright(hLine(textWidth + 2))}${c.redBright('┐')}`);
	for (var i = 0; i < lines.length; i++) {
		const line = lines[i];
		console.log(`${c.redBright('│')} ${line}${space(textWidth - line.length)} ${c.redBright('│')}`);
	}
	console.log(`${c.redBright('└')}${c.redBright(hLine(textWidth + 2))}${c.redBright('┘')}`);
}

module.exports = {
	error,
};
