const c = require('ansi-colors');

function getArgs() {
	return process.argv.splice(2, process.argv.length-1);
}

function parseArgs(args) {
	const result = {
		command: 'help',
		flags: {}
	};
	let lastFlag = null;
	args.forEach((arg) => {

		if (arg.indexOf('--') === 0) {
			var argName = arg.slice(2, arg.length);
			result.flags[argName] = true;
			lastFlag = argName;
			return;
		}

		if (arg.indexOf('-') === 0) {
			var argNameList = arg.slice(1, arg.length);
			for(var i = 0; i < argNameList.length; i++) {
				var name = argNameList[i];
				result.flags[name] = true;
				lastFlag = name;
			}
			return;
		}

		if (lastFlag === null) {
			result.command = arg;
			return;
		}

		result.flags[lastFlag] = arg;
	});

	return result;
}

function printHelp(app) {
	const leftSpacing = ' ';
	console.log(`\n${leftSpacing}${c.bold(app.name)} ${c.magenta.bold(app.version)}`);
	console.log(`${leftSpacing}${c.grey('Usage: pitch [command] <arguments...>')}`);
	console.log();
	Object.keys(app.commands).forEach((commandName) => {
		var command = app.commands[commandName];
		console.log(`${leftSpacing}  ${c.bold.cyan(commandName)} - ${command.description}`);
		if (command.flags) {
			Object.keys(command.flags).forEach((flagName) => {
				var flag = command.flags[flagName];
				console.log(`${leftSpacing}    ${c.blue.bold('--' + flagName)} - ${flag.description} ${flag.default !== undefined ? c.grey('[' + flag.default + ']') : ''}`);
			});
		}
	});
	console.log();
}

function executeAppWithArguments(app, args) {
	if (args.command === 'help') {
		printHelp(app);
	} else {
		const availableCommands = Object.keys(app.commands);
		if (availableCommands.indexOf(args.command) >= 0) {
			const flags = {};
			const commandDef = app.commands[args.command];
			if (commandDef.flags) {
				Object.keys(commandDef.flags).forEach((flag) => {
					flags[flag] = commandDef.flags[flag].default;
					if (args.flags[flag]) {
						flags[flag] = args.flags[flag];
					}
				});
				commandDef.action(flags);
			} else {
				commandDef.action();
			}
		} else {
			console.log(`Command '${args.command}' doesn't exist.`);
			console.log(`Run \`${c.bold('pitch')} ${c.bold.cyan('help')}\` for more info.`);
		}
	}
}

function run(app) {
	const parsedArgs = parseArgs(getArgs());
	executeAppWithArguments(app, parsedArgs);
}

module.exports = {
	run,
	executeAppWithArguments,
	parseArgs
};
