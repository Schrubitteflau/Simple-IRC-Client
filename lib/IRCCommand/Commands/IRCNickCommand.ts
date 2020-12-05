import { IRCCommand, ICommandArguments } from "../IRCCommand";

interface INickCommandArguments extends ICommandArguments
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
    
    // Add the config type
    interface ICommandConfigTypes
    {
        INickCommandArguments: new (config: INickCommandArguments) => IRCNickCommand
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