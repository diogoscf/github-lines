import * as DiscordBot from "discord.js";
import { Command } from "@sapphire/framework";

export class TopggCommand extends Command {
  constructor(client: Command.LoaderContext) {
    super(client, {
      name: "topgg",
      aliases: ["invite", "vote"],
      description: "Link to the bot's top.gg page"
    });
  }

  // eslint-disable-next-line class-methods-use-this
  messageRun(msg: DiscordBot.Message): Promise<DiscordBot.Message> {
    return msg.channel.send("We appreciate votes :heart: https://top.gg/bot/708282735227174922");
  }
}
