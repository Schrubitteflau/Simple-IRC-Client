import { Socket } from "net";
import { EventEmitter } from "events";

import { IRCCommand, IRCNickCommand, IRCUserCommand, IRCLineParser, UnknownCommandError, IRCPrivmsgCommand, IRCJoinCommand } from "./IRCCommand";

// Will merge the declared methods and types of parameters with IRCManager implementation below
export declare interface IRCClient
{
    on(event: "error", listener: (error: Error) => void): this;
    on(event: "close", listener: (hadError: boolean) => void): this;
    on(event: "dataLine", listener: (line: string) => void): this;
    on(event: "commandSent", listener: (command: IRCCommand) => void): this;
    on(event: "commandError", listener: (command: IRCCommand, error: Error) => void): this;
    on(event: "unknownCommand", listener: (parser: IRCLineParser) => void): this;
    on(event: "privateMessage", listener: (command: IRCPrivmsgCommand) => void): this;

    emit(event: "error", error: Error): any;
    emit(event: "close", hadError: boolean): this;
    emit(event: "dataLine", line: string): this;
    emit(event: "commandSent", command: IRCCommand): this;
    emit(event: "commandError", command: IRCCommand, error: Error): this;
    emit(event: "unknownCommand", parser: IRCLineParser): this;
    emit(event: "privateMessage", command: IRCPrivmsgCommand): this;
}

export type ConnectConfig =
{
    port: number,
    host: string
};

export class IRCClient extends EventEmitter
{
    private readonly config: ConnectConfig;
    private readonly socket: Socket;

    public constructor(config: ConnectConfig)
    {
        super();

        this.config = config;
        this.socket = new Socket();
    }

    public connect(): this
    {
        this.socket.connect(this.config.port, this.config.host, () =>
        {
            console.log("Connexion établie...");
        });

        this.socket.on("error", (error: Error) =>
        {
            this.emit("error", error);
        })

        .on("data", (data: Buffer) =>
        {
            this.handleData(data);
        })

        .on("close", (hadError: boolean) =>
        {
            this.emit("close", hadError);
            console.log(`Fermeture de la connexion ${hadError ? "avec" : "sans"} erreur`);
        });

        return this;
    }

    private handleData(data: Buffer): void
    {
        const dataText: string = data.toString("utf-8");
        const lines: string[] = dataText.split("\r\n");

        for (const line of lines)
        {
            this.handleLine(line);
        }
    }

    private handleLine(line: string): void
    {
        if (line.length > 0)
        {
            const parser: IRCLineParser = new IRCLineParser(line);

            this.emit("dataLine", line);

            try
            {
                const command: IRCCommand = IRCCommand.instanciate(parser);

                if (command.is("PRIVMSG"))
                {
                    this.emit("privateMessage", command);
                }
            }
            catch (error)
            {
                if (error instanceof UnknownCommandError)
                {
                    this.emit("unknownCommand", parser);
                }
            }
        }
    }

    public sendCommand(command: IRCCommand): this
    {
        const commandText: string = command.getTextValue();

        this.socket.write(commandText, "utf-8", (error?: Error) =>
        {
            if (error)
            {
                this.emit("commandError", command, error);
            }
            else
            {
                this.emit("commandSent", command);
            }
        });

        return this;
    }

    public nick(nickname: string): this
    {
        return this.sendCommand(new IRCNickCommand({ nickname }));
    }

    public user(nickname: string, hostname: string, servername: string, realName: string): this
    {
        return this.sendCommand(new IRCUserCommand({ nickname, hostname, servername, realName }));
    }

    public join(channel: string): this
    {
        return this.sendCommand(new IRCJoinCommand({ channel }));
    }

    public privateMessage(nickname: string, message: string): this
    {
        return this.sendCommand(new IRCPrivmsgCommand({ nickname, message }));
    }
}