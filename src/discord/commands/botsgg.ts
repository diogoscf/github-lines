import * as DiscordBot from "discord.js";
import { Command } from "@sapphire/framework";

export class BotsggCommand extends Command {
  constructor(client) {
    super(client, {
      name: "botsgg",
      description: "Link to the bot's discord.bots.gg page"
    });
  }

  // eslint-disable-next-line class-methods-use-this
  messageRun(msg): Promise<DiscordBot.Message> {
    return msg.channel.send("We appreciate it! :heart: https://discord.bots.gg/bots/708282735227174922");
  }
}
