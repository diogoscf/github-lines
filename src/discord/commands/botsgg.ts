import * as DiscordBot from "discord.js";
import { RLCommand } from "../types_discord";

export class BotsggCommand extends RLCommand {
  constructor(client) {
    super(client, {
      name: "botsgg",
      memberName: "botsgg",
      group: "commands",
      description: "Link to the bot's discord.bots.gg page",
      throttling: {
        usages: 1,
        duration: 15
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  run(msg): Promise<DiscordBot.Message> {
    return msg.channel.send("We appreciate it! :heart: https://discord.bots.gg/bots/708282735227174922");
  }
}
