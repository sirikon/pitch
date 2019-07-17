import * as c from 'ansi-colors';
import { IApp, ICommand } from './models';

export function printHelp(app: IApp) {
	const leftSpacing = ' ';
	println(`\n${leftSpacing}${c.bold(app.name)} ${c.magenta.bold(app.version)}`);
	println(`${leftSpacing}${c.grey('Usage: pitch [command] <arguments...>')}`);
	println();
	Object.keys(app.commands).forEach((commandName) => {
		const command = app.commands[commandName];
		println(`${leftSpacing}  ${c.bold.cyan(commandName)} - ${command.description}`);
		if (command.flags) {
			Object.keys(command.flags).forEach((flagName) => {
				const flag = command.flags[flagName];
				const defaultFlag = flag.default !== undefined ? c.grey('[' + flag.default + ']') : '';
				println(`${leftSpacing}    ${c.blue.bold('--' + flagName)} - ${flag.description} ${defaultFlag}`);
			});
		}
	});
	println();
}

export function printCommandDoesNotExist(command: ICommand) {
	console.log(`Command '${command.command}' doesn't exist.`);
	console.log(`Run \`${c.bold('pitch')} ${c.bold.cyan('help')}\` for more info.`);
}

function println(message?: any) {
	console.log(message);
}
