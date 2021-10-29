import * as DiscordBot from "discord.js";
import { Command } from "@sapphire/framework";
import { PieceContext } from "@sapphire/pieces";

export class SourceCommand extends Command {
  constructor(client: PieceContext) {
    super(client, {
      name: "source",
      aliases: ["github"],
      description: "Link GitHub source"
    });
  }

  // eslint-disable-next-line class-methods-use-this
  messageRun(msg: DiscordBot.Message): Promise<DiscordBot.Message> {
    return msg.channel.send("Stars are appreciated :heart: https://github.com/diogoscf/github-lines");
  }
}
