import { IRCLineParser } from "./IRCLineParser";

// Enum which will be completed by subclasses of IRCCommand
export enum AllowedCommands { }

// Transforms keys of AllowedCommands into a string literal type like "JOIN" | "USER"
type CommandType = keyof typeof AllowedCommands;

// Custom error class
export class UnknownCommandError extends Error {}

export interface ICommand
{
    readonly prefix?: string;
    readonly type: CommandType;
}

export interface ICommandArguments
{
    readonly prefix?: string;
}

// Get all the specific constructors for IRCCommand subclasses
export interface ICommandConfigTypes { }
type SpecificCommandConstructor = ICommandConfigTypes[keyof ICommandConfigTypes];

export abstract class IRCCommand implements ICommand
{
    public readonly prefix?: string;
    public readonly type: CommandType;

    // Map which register all the subclasses of IRCCommand
    // The key is a string and not a CommandType, because we potentially accepts every string value,
    // This Map is used to check if a string is a valid registered command type, and the key values
    // when insertion are restricted to CommandType by Register() method
    private static RegisteredCommandTypes: Map<string, SpecificCommandConstructor> = new Map<string, SpecificCommandConstructor>();

    public static Register(type: CommandType, constructor: SpecificCommandConstructor): void
    {
        IRCCommand.RegisteredCommandTypes.set(type, constructor);
    }

    protected constructor(type: CommandType)
    {
        this.type = type;
    }

    public static instanciate(parser: IRCLineParser): IRCCommand
    {
        const constructor = IRCCommand.RegisteredCommandTypes.get(parser.command);

        // The constructor exists so the command is know and associated with a class
        if (constructor)
        {
            return new constructor(parser);
        }

        throw new UnknownCommandError(`Unknown command : ${parser.command}`);
    }

    public getTextValue(): string
    {
        return `${this.type} ${this.getArgumentsTextValue()}\r\n`;
    }

    public is(type: CommandType): boolean
    {
        return (this.type === type);
    }

    protected abstract getArgumentsTextValue(): string;
}