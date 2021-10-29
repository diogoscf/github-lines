import * as DiscordBot from "discord.js";
import { Command } from "@sapphire/framework";
import { PieceContext } from "@sapphire/pieces";

export class HelpCommand extends Command {
  constructor(client: PieceContext) {
    super(client, {
      name: "help",
      description: "Displays a help message",
      requiredClientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"]
    });
  }

  // eslint-disable-next-line class-methods-use-this
  messageRun(msg: DiscordBot.Message): Promise<DiscordBot.Message> {
    const helpEmbed = new DiscordBot.MessageEmbed()
      .setTitle("Help Info")
      .setDescription(
        "GitHub Lines runs automatically, without need for configuration! Here are some commands you can use"
      )
      // .setThumbnail("IMAGE HERE")
      .addFields(
        {
          name: "`;about` or `;stats`",
          value: "Info about the bot",
          inline: false
        },
        {
          name: "`;invite`, `;vote` or `;topgg`",
          value: "Link to the bot's top.gg page",
          inline: false
        },
        {
          name: "`;botsgg`",
          value: "Link to the bot's discord.bots.gg page",
          inline: false
        },
        {
          name: "`;help`",
          value: "Displays this message",
          inline: false
        },
        {
          name: "`;github` or `;source`",
          value: "Link GitHub source",
          inline: false
        },
        {
          name: "`;ping`",
          value: "Check bot latency",
          inline: false
        }
      );

    return msg.channel.send({ embeds: [helpEmbed] });
  }
}
