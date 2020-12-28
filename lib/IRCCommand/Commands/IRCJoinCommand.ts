import { IRCCommand, ICommandArguments } from "../IRCCommand";
import { IRCLineParser } from "../IRCLineParser";

interface IJoinCommandArguments extends ICommandArguments
{
    readonly channel: string;
}

// Module augmentation
declare module "../IRCCommand"
{
    // Complete this enum declaration
    enum AllowedCommands { JOIN = "JOIN" }

    interface IRCCommand
    {
        // Add specific type to this method
        is(type: "JOIN"): this is IRCJoinCommand
    }

    // Add the config type
    interface ICommandConfigTypes
    {
        IJoinCommandArguments: new (config: IJoinCommandArguments | IRCLineParser) => IRCJoinCommand
    }
}

export class IRCJoinCommand extends IRCCommand implements IJoinCommandArguments
{
    public readonly channel: string;

    public constructor(config: IJoinCommandArguments | IRCLineParser)
    {
        super("JOIN");

        if (config instanceof IRCLineParser)
        {
            this.channel = config.getArgument(0);
        }
        else
        {
            this.channel = config.channel;
        }
    }

    protected getArgumentsTextValue(): string
    {
        return this.channel;
    }
}

IRCCommand.Register("JOIN", IRCJoinCommand);