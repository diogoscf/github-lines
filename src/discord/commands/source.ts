import * as DiscordBot from "discord.js";
import { Command } from "@sapphire/framework";

export class SourceCommand extends Command {
  constructor(client) {
    super(client, {
      name: "source",
      aliases: ["github"],
      description: "Link GitHub source"
    });
  }

  // eslint-disable-next-line class-methods-use-this
  messageRun(msg): Promise<DiscordBot.Message> {
    return msg.channel.send("Stars are appreciated :heart: https://github.com/diogoscf/github-lines");
  }
}
