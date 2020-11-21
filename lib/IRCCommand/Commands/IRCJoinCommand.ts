import { IRCCommand } from "../IRCCommand";

interface IJoinCommandArguments
{
    readonly channel: string;
}

export class IRCJoinCommand extends IRCCommand implements IJoinCommandArguments
{
    public readonly channel: string;

    public constructor(config: IJoinCommandArguments)
    {
        super("JOIN");

        ({
            channel: this.channel
        } = config);
    }

    protected getArgumentsTextValue(): string
    {
        return this.channel;
    }
}