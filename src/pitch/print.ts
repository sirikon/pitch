import * as c from 'ansi-colors';

function pad(length: number, char: string) {
	const result = [];
	for (let i = 0; i < length; i++) {
		result.push(char);
	}
	return result.join('');
}

const space = (length: number) => pad(length, ' ');
const hLine = (length: number) => pad(length, '─');

function getTextWidth(text: string) {
	let maxWidth = 0;
	const lines = text.split('\n');
	for (const line of lines) {
		const length = line.length;
		if (length > maxWidth) {
			maxWidth = length;
		}
	}
	return maxWidth;
}

function trimText(text: string) {
	return text.trim();
}

export function error(text: string) {
	const trimmedText = trimText(text);
	const lines = trimmedText.split('\n');
	const textWidth = getTextWidth(trimmedText);

	console.log(`${c.redBright('┌')}${c.redBright(hLine(textWidth + 2))}${c.redBright('┐')}`);
	for (const line of lines) {
		console.log(`${c.redBright('│')} ${line}${space(textWidth - line.length)} ${c.redBright('│')}`);
	}
	console.log(`${c.redBright('└')}${c.redBright(hLine(textWidth + 2))}${c.redBright('┘')}`);
}
