import { IRCCommand, ICommandArguments } from "../IRCCommand";

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
        IUserCommandArguments: new (config: IUserCommandArguments) => IRCUserCommand
    }
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

        this.nickname = config.nickname;
        this.hostname = config.hostname;
        this.servername = config.servername;
        this.realName = config.realName;
    }

    protected getArgumentsTextValue(): string
    {
        return `${this.nickname} ${this.hostname} ${this.servername} ${this.realName}`;
    }
}

IRCCommand.Register("USER", IRCUserCommand);