export class IRCLineParser
{
    // Array used to parse the line
    private readonly parts: string[];

    public readonly prefix: string | null;
    public readonly command: string;
    public readonly arguments: string[];

    public constructor(text: string)
    {
        // First, we cut the string at the first "\r\n" found
        const line: string = text.split("\r\n")[0];
        // Split the line into distinct parts
        this.parts = this.split(line);

        this.prefix = this.getPrefix();
        this.command = this.getCommand();
        this.arguments = this.getArguments();
    }

    private hasPrefix(): boolean
    {
        return (this.prefix !== null);
    }

    /* Split the line into an array of string, and manage the parts which begins by ":" in order to
    make easy the future processing */
    private split(line: string): string[]
    {
        const parts: string[] = line.split(" ");
        const finalParts: string[] = [];

        for (let i = 0; i < parts.length; i++)
        {
            const part = parts[i];

            // The first element (prefix or command) is "alone" : we don't merge, event if it begins by ":"
            if (i === 0)
            {
                finalParts.push(part);
            }
            else
            {
                // We merge all the remaining parts into a single string
                if (part.startsWith(":"))
                {
                    const merged: string = parts.slice(i).join(" ");
                    finalParts.push(merged);
                    break;
                }
                else
                {
                    finalParts.push(part);
                }
            }
        }

        return finalParts;
    }

    private getPrefix(): string | null
    {
        if (this.parts[0].startsWith(":"))
        {
            return this.parts[0];
        }
        return null;
    }

    private getCommand(): string
    {
        if (this.hasPrefix())
        {
            return this.parts[1];
        }
        return this.parts[0];
    }

    private getArguments(): string[]
    {
        if (this.hasPrefix())
        {
            return this.parts.slice(2);
        }
        return this.parts.slice(1);
    }

    public getArgument(index: number)
    {
        return this.arguments[index];
    }
}