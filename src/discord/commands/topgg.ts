import { Command } from "discord.js-commando";
import * as DiscordBot from "discord.js";

export class TopggCommand extends Command {
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
