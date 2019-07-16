import { IApp, ICommand, IFlags } from './models';
import { printCommandDoesNotExist } from './print';

function getArgs(): string[] {
	return process.argv.splice(2, process.argv.length - 1);
}

export function parseArgs(args: string[]): ICommand {
	const result: ICommand = {
		name: 'help',
		flags: {},
	};

	let lastFlag: string | null = null;
	args.forEach((arg) => {

		if (arg.indexOf('--') === 0) {
			const argName = arg.slice(2, arg.length);
			result.flags[argName] = true;
			lastFlag = argName;
			return;
		}

		if (arg.indexOf('-') === 0) {
			const argNameList = arg.slice(1, arg.length);
			for (const name of argNameList) {
				result.flags[name] = true;
				lastFlag = name;
			}
			return;
		}

		if (lastFlag === null) {
			result.name = arg;
			return;
		}

		result.flags[lastFlag] = arg;
	});

	return result;
}

export function executeAppWithArguments(app: IApp, command: ICommand) {
	if (!commandExists(app, command)) {
		printCommandDoesNotExist(command);
		return;
	}

	const flags: IFlags = {};
	const commandDef = app.commands[command.name];
	const definedFlags = commandDef.flags || {};

	Object.keys(definedFlags).forEach((key) => {
		flags[key] = command.flags[key] || definedFlags[key].default;
	});

	commandDef.action(flags);
}

function commandExists(app: IApp, command: ICommand): boolean {
	const availableCommands = Object.keys(app.commands);
	return availableCommands.indexOf(command.name) === -1;
}

export function run(app: IApp) {
	const parsedArgs = parseArgs(getArgs());
	executeAppWithArguments(app, parsedArgs);
}
