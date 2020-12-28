import { IRCCommand, ICommandArguments } from "../IRCCommand";
import { IRCLineParser } from "../IRCLineParser";

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
        INickCommandArguments: new (config: INickCommandArguments | IRCLineParser) => IRCNickCommand
    }
}

export class IRCNickCommand extends IRCCommand implements INickCommandArguments
{
    public readonly nickname: string;

    public constructor(config: INickCommandArguments | IRCLineParser)
    {
        super("NICK");

        if (config instanceof IRCLineParser)
        {
            this.nickname = config.getArgument(0);
        }
        else
        {
            this.nickname = config.nickname;
        }
    }

    protected getArgumentsTextValue(): string
    {
        return this.nickname;
    }
}

IRCCommand.Register("NICK", IRCNickCommand);