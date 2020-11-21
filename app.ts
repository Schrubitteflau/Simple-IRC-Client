import { IRCCommand, IRCClient, IRCPrivmsgCommand, IRCLineParser } from "./lib";

const irc: IRCClient = new IRCClient({
    port: 6667,
    host: "irc.root-me.org"
});

irc.on("error", (err: Error) =>
{
    console.log(`ERROR : ${err.message}`);
})

.on("dataLine", (line: string) =>
{
    console.log(`RECEIVED DATA LINE (${line.length}) : ${line}`);
})

.on("commandSent", (command: IRCCommand) =>
{
    console.log(`COMMAND SENT : ${command.getTextValue()}`);
})

.on("commandError", (command: IRCCommand, err: Error) =>
{
    console.log(`ERROR WHILE SENDING COMMAND : ${err.message}`);
})

.on("privateMessage", (command: IRCPrivmsgCommand) =>
{
    console.log(command.message);
})

.on("unknownCommand", (parser: IRCLineParser) =>
{
    if (parser.command === "MODE")
    {
        irc.privateMessage("candy", "!ep2");
    }
})

.connect()

.nick("challenger")

.user("challenger", "no", "no", "Real Name")

.join("#root-me_challenge");