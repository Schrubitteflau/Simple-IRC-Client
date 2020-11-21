import { IRCCommand } from "../IRCCommand";

interface INickCommandArguments
{
    readonly nickname: string;
}

export class IRCNickCommand extends IRCCommand implements INickCommandArguments
{
    public readonly nickname: string;

    public constructor(config: INickCommandArguments)
    {
        super("NICK");

        ({
            nickname: this.nickname
        } = config);
    }

    protected getArgumentsTextValue(): string
    {
        return this.nickname;
    }
}