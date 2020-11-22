import { IRCCommand, ICommandArguments } from "../IRCCommand";

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
}

export class IRCJoinCommand extends IRCCommand implements IJoinCommandArguments
{
    public readonly channel: string;

    public constructor(config: IJoinCommandArguments)
    {
        super("JOIN");

        this.channel = config.channel;
    }

    protected getArgumentsTextValue(): string
    {
        return this.channel;
    }
}

IRCCommand.Register("JOIN", IRCJoinCommand);