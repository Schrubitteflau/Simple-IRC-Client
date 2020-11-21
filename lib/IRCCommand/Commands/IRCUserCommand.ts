import { IRCCommand } from "../IRCCommand";

interface IUserCommandArguments
{
    readonly nickname: string;
    readonly hostname: string;
    readonly servername: string;
    readonly realName: string;
}

export class IRCUserCommand extends IRCCommand implements IUserCommandArguments
{
    public readonly nickname: string;
    public readonly hostname: string;
    public readonly servername: string;
    public readonly realName: string;

    public constructor(config: IUserCommandArguments)
    {
        super("USER");

        ({
            nickname: this.nickname,
            hostname: this.hostname,
            servername: this.servername,
            realName: this.realName
        } = config);
    }

    protected getArgumentsTextValue(): string
    {
        return `${this.nickname} ${this.hostname} ${this.servername} ${this.realName}`;
    }
}