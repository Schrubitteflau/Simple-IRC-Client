import * as Commands from "./Commands";
import { IRCLineParser } from "./IRCLineParser";

const COMMAND_TYPE_CLASS =
{
    "NICK": Commands.IRCNickCommand,
    "USER": Commands.IRCUserCommand,
    "JOIN": Commands.IRCJoinCommand,
    "PRIVMSG": Commands.IRCPrivmsgCommand
} as const;

export class UnknownCommandError extends Error {}

export type CommandType = keyof typeof COMMAND_TYPE_CLASS;
type CommandClass = typeof COMMAND_TYPE_CLASS[CommandType];

function isValidCommand(toCheck: string): toCheck is CommandType
{
    return COMMAND_TYPE_CLASS.hasOwnProperty(toCheck);
}

/*function getCommandClass(command: CommandType): CommandClass
{
    return (COMMAND_TYPE_CLASS[command]);
}*/

export interface ICommand
{
    readonly prefix?: string;
    readonly type: CommandType;
}

// Doesn't work :(
// is(type: CommandType): this is typeof COMMAND_TYPE_CLASS[typeof type]
// Can't find a way to use dynamically the types defined in COMMAND_TYPE_CLASS
// Not good because we need to know the child classes from the parent (IRCCommand), so this make
// circular dependencies because child classes must import the parent
// A better way would be to write is() definition from each child class, until we don't have to
// import Commands in this parent class anymore
// --> bad design
export declare interface IRCCommand
{
    is(type: "NICK"): this is Commands.IRCNickCommand,
    is(type: "USER"): this is Commands.IRCUserCommand,
    is(type: "JOIN"): this is Commands.IRCJoinCommand,
    is(type: "PRIVMSG"): this is Commands.IRCPrivmsgCommand
}

export abstract class IRCCommand implements ICommand
{
    public readonly prefix?: string;
    public readonly type: CommandType;

    protected constructor(type: CommandType)
    {
        this.type = type;
    }

    /* Not cool, because we don't reuse COMMAND_TYPE_CLASS object so getCommandClass() isn't that useful */
    public static instanciate(parser: IRCLineParser): IRCCommand
    {
        if (isValidCommand(parser.command))
        {
            switch (parser.command)
            {
                case "NICK":
                    return new Commands.IRCNickCommand({ nickname: parser.getArgument(0) });
                case "JOIN":
                    return new Commands.IRCJoinCommand({ channel: parser.getArgument(0) });
                case "USER":
                    return new Commands.IRCUserCommand({
                        nickname: parser.getArgument(0),
                        hostname: parser.getArgument(1),
                        servername: parser.getArgument(2),
                        realName: parser.getArgument(3)
                    })
                case "PRIVMSG":
                    return new Commands.IRCPrivmsgCommand({
                        nickname: parser.getArgument(0),
                        message: parser.getArgument(1)
                    });
            }
        }

        throw new UnknownCommandError(`Unknown command : ${parser.command}`);
    }

    public getTextValue(): string
    {
        return `${this.type} ${this.getArgumentsTextValue()}\r\n`;
    }

    protected abstract getArgumentsTextValue(): string;

    public is(type: CommandType): this is CommandClass
    {
        return (this.type === type);
    }
}