import { IRCCommand, ICommandArguments } from "../IRCCommand";
import { IRCLineParser } from "../IRCLineParser";

interface IUserCommandArguments extends ICommandArguments
{
    readonly nickname: string;
    readonly hostname: string;
    readonly servername: string;
    readonly realName: string;
}

// Module augmentation
declare module "../IRCCommand"
{
    // Complete this enum declaration
    enum AllowedCommands { USER = "USER" }

    interface IRCCommand
    {
        // Add specific type to this method
        is(type: "USER"): this is IRCUserCommand
    }

    // Add the config type
    interface ICommandConfigTypes
    {
        IUserCommandArguments: new (config: IUserCommandArguments | IRCLineParser) => IRCUserCommand
    }
}

export class IRCUserCommand extends IRCCommand implements IUserCommandArguments
{
    public readonly nickname: string;
    public readonly hostname: string;
    public readonly servername: string;
    public readonly realName: string;

    public constructor(config: IUserCommandArguments | IRCLineParser)
    {
        super("USER");

        if (config instanceof IRCLineParser)
        {
            this.nickname = config.getArgument(0);
            this.hostname = config.getArgument(1);
            this.servername = config.getArgument(2);
            this.realName = config.getArgument(3);
        }
        else
        {
            this.nickname = config.nickname;
            this.hostname = config.hostname;
            this.servername = config.servername;
            this.realName = config.realName;
        }
    }

    protected getArgumentsTextValue(): string
    {
        return `${this.nickname} ${this.hostname} ${this.servername} ${this.realName}`;
    }
}

IRCCommand.Register("USER", IRCUserCommand);