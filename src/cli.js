const colors = require('colors');

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
    console.log(`\n${leftSpacing}${colors.bold(app.name)} ${colors.magenta(colors.bold(app.version))}`);
    console.log(`${leftSpacing}${colors.grey('Usage: pitch [command] <arguments...>')}`);
    console.log();
    Object.keys(app.commands).forEach((commandName) => {
        var command = app.commands[commandName];
        console.log(`${leftSpacing}  ${colors.bold(colors.cyan(commandName))} - ${command.description}`);
        if (command.flags) {
            Object.keys(command.flags).forEach((flagName) => {
                var flag = command.flags[flagName];
                console.log(`${leftSpacing}    ${colors.blue(colors.bold('--' + flagName))} - ${flag.description} ${colors.grey('[' + flag.default + ']')}`);
            });
        }
    });
    console.log();
}

function runApp(app) {
    const parsedArgs = parseArgs(getArgs());
    if (parsedArgs.command === 'help') {
        printHelp(app);
    } else {
        const availableCommands = Object.keys(app.commands);
        if (availableCommands.indexOf(parsedArgs.command) >= 0) {
            const flags = {};
            const commandDef = app.commands[parsedArgs.command];
            if (commandDef.flags) {
                Object.keys(commandDef.flags).forEach((flag) => {
                    flags[flag] = commandDef.flags[flag].default;
                    if (parsedArgs.flags[flag]) {
                        flags[flag] = parsedArgs.flags[flag];
                    }
                });
                commandDef.action(flags);
            } else {
                commandDef.action();
            }
        } else {
            console.log(`Command '${parsedArgs.command}' doesn't exist.`);
            console.log(`Run \`${colors.bold('pitch')} ${colors.bold(colors.cyan('help'))}\` for more info.`);
        }
    }
}

module.exports = {
    runApp,
    parseArgs
};
