export interface IApp {
	name: string;
	version: string;
	commands: { [key: string]: ICommandDefinition };
}

export interface ICommandDefinition {
	description: string;
	flags?: { [key: string]: IFlagDefinition };
	action: (options: IFlags) => void;
}

export interface IFlagDefinition {
	description: string;
	default?: string;
}

export interface IFlags { [key: string]: string | boolean; }
export interface ICommand {
	name: string;
	flags: IFlags;
}
