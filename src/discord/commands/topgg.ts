import * as DiscordBot from "discord.js";
import { RLCommand } from "../types_discord";

export class TopggCommand extends RLCommand {
  constructor(client) {
    super(client, {
      name: "topgg",
      memberName: "topgg",
      aliases: ["invite", "vote"],
      group: "commands",
      description: "Link to the bot's top.gg page",
      throttling: {
        usages: 1,
        duration: 15
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  run(msg): Promise<DiscordBot.Message> {
    return msg.channel.send("We appreciate votes :heart: https://top.gg/bot/708282735227174922");
  }
}
