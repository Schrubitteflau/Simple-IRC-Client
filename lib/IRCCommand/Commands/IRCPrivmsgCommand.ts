import { IRCCommand } from "../IRCCommand";

interface IPrivmsgCommandArguments
{
    readonly nickname: string;
    readonly message: string;
}

export class IRCPrivmsgCommand extends IRCCommand implements IPrivmsgCommandArguments
{
    public readonly nickname: string;
    public readonly message: string;

    public constructor(config: IPrivmsgCommandArguments)
    {
        super("PRIVMSG");

        ({
            nickname: this.nickname,
            message: this.message
        } = config);
    }

    protected getArgumentsTextValue(): string
    {
        return `${this.nickname} ${this.message}`;
    }
}