import * as DiscordBot from "discord.js";
import { Command } from "@sapphire/framework";

export class TopggCommand extends Command {
  constructor(client) {
    super(client, {
      name: "topgg",
      aliases: ["invite", "vote"],
      description: "Link to the bot's top.gg page"
    });
  }

  // eslint-disable-next-line class-methods-use-this
  messageRun(msg): Promise<DiscordBot.Message> {
    return msg.reply("We appreciate votes :heart: https://top.gg/bot/708282735227174922");
  }
}
