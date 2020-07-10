import { Command } from "discord.js-commando";
import * as DiscordBot from "discord.js";

export class SourceCommand extends Command {
  constructor(client) {
    super(client, {
      name: "source",
      memberName: "source",
      aliases: ["github"],
      group: "commands",
      description: "Link GitHub source",
      throttling: {
        usages: 1,
        duration: 15
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  run(msg): Promise<DiscordBot.Message> {
    return msg.channel.send("Stars are appreciated :heart: https://github.com/diogoscf/github-lines");
  }
}
