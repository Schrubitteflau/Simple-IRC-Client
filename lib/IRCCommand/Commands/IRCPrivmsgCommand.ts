import { IRCCommand } from "../IRCCommand";

interface IPrivmsgCommandArguments
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
}

export class IRCPrivmsgCommand extends IRCCommand implements IPrivmsgCommandArguments
{
    public readonly nickname: string;
    public readonly message: string;

    public constructor(config: IPrivmsgCommandArguments)
    {
        super("PRIVMSG");

        this.nickname = config.nickname;
        this.message = config.message;
    }

    protected getArgumentsTextValue(): string
    {
        return `${this.nickname} ${this.message}`;
    }
}

IRCCommand.Register("PRIVMSG", IRCPrivmsgCommand);