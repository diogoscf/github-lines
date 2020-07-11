import * as DiscordBot from "discord.js";
import { RLCommand } from "../types_discord";

export class SourceCommand extends RLCommand {
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
