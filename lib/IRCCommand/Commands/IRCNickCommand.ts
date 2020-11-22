import { IRCCommand } from "../IRCCommand";

interface INickCommandArguments
{
    readonly nickname: string;
}

// Module augmentation
declare module "../IRCCommand"
{
    // Complete this enum declaration
    enum AllowedCommands { NICK = "NICK" }

    interface IRCCommand
    {
        // Add specific type to this method
        is(type: "NICK"): this is IRCNickCommand
    }
}

export class IRCNickCommand extends IRCCommand implements INickCommandArguments
{
    public readonly nickname: string;

    public constructor(config: INickCommandArguments)
    {
        super("NICK");

        this.nickname = config.nickname;
    }

    protected getArgumentsTextValue(): string
    {
        return this.nickname;
    }
}

IRCCommand.Register("NICK", IRCNickCommand);