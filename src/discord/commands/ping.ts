import * as DiscordBot from "discord.js";
import { Command } from "@sapphire/framework";
import { PieceContext } from "@sapphire/pieces";

export class PingCommand extends Command {
  constructor(client: PieceContext) {
    super(client, {
      name: "ping",
      description: "Check bot latency"
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async messageRun(msg: DiscordBot.Message): Promise<DiscordBot.Message> {
    const pingMsg = await msg.channel.send("Ping?");
    return pingMsg.edit(
      `Pong! Latency is ${pingMsg.createdTimestamp - msg.createdTimestamp}ms. API Latency is ${msg.client.ws.ping}ms`
    );
  }
}
