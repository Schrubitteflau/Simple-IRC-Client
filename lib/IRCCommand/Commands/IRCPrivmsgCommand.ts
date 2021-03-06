import { IRCCommand, ICommandArguments } from "../IRCCommand";
import { IRCLineParser } from "../IRCLineParser";

interface IPrivmsgCommandArguments extends ICommandArguments
{
    readonly nickname: string;
    readonly message: string;
}

// Module augmentation
declare module "../IRCCommand"
{
    // Complete this enum declaration
    enum AllowedCommands { PRIVMSG = "PRIVMSG" }

    interface IRCCommand
    {
        // Add specific type to this method
        is(type: "PRIVMSG"): this is IRCPrivmsgCommand
    }

    // Add the config type
    interface ICommandConfigTypes
    {
        IPrivmsgCommandArguments: new (config: IPrivmsgCommandArguments | IRCLineParser) => IRCPrivmsgCommand
    }
}

export class IRCPrivmsgCommand extends IRCCommand implements IPrivmsgCommandArguments
{
    public readonly nickname: string;
    public readonly message: string;

    public constructor(config: IPrivmsgCommandArguments | IRCLineParser)
    {
        super("PRIVMSG");

        if (config instanceof IRCLineParser)
        {
            this.nickname = config.getArgument(0);
            this.message = config.getArgument(1)
        }
        else
        {
            this.nickname = config.nickname;
            this.message = config.message;
        }
    }

    protected getArgumentsTextValue(): string
    {
        return `${this.nickname} ${this.message}`;
    }
}

IRCCommand.Register("PRIVMSG", IRCPrivmsgCommand);