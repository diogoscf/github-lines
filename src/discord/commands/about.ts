import * as DiscordBot from "discord.js";
import { Command } from "@sapphire/framework";
import { PieceContext } from "@sapphire/pieces";

export class AboutCommand extends Command {
  constructor(client: PieceContext) {
    super(client, {
      name: "about",
      aliases: ["stats"],
      description: "Info about the bot",
      requiredClientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"]
    });
  }

  static convertMS(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    let secondStr = (seconds % 60).toString();
    const hours = Math.floor(minutes / 60);
    let minuteStr = (minutes % 60).toString();
    const days = Math.floor(hours / 24);
    let hourStr = (hours % 24).toString();

    if (hourStr.length === 1) hourStr = `0${hourStr}`;
    if (minuteStr.length === 1) minuteStr = `0${minuteStr}`;
    if (secondStr.length === 1) secondStr = `0${secondStr}`;

    let dayStr = "";
    if (days > 1) {
      dayStr = `${days} days, `;
    } else if (days === 1) {
      dayStr = "1 day, ";
    }

    return `${dayStr}${hourStr}:${minuteStr}:${secondStr}`;
  }

  // eslint-disable-next-line class-methods-use-this
  async messageRun(msg: DiscordBot.Message): Promise<DiscordBot.Message> {
    let userCount = 0;
    msg.client.guilds.cache.forEach((guild) => {
      userCount += guild.memberCount;
    });
    const uptime = msg.client.uptime ? AboutCommand.convertMS(msg.client.uptime) : "N/A";
    const aboutEmbed = new DiscordBot.MessageEmbed()
      .setTitle("About GitHub Lines")
      .setDescription(
        "GitHub Lines is a bot that displays one or more lines when mentioned in a GitHub (or GitLab) link"
      )
      // .setThumbnail("IMAGE HERE")
      .addFields(
        {
          name: "Guild Count",
          value: msg.client.guilds.cache.size.toString(),
          inline: true
        },
        {
          name: "User Count",
          value: userCount.toString(),
          inline: true
        },
        {
          name: "Uptime",
          value: uptime,
          inline: true
        },
        {
          name: "Latency",
          value: `${msg.client.ws.ping}ms`,
          inline: true
        },
        {
          name: "Owner",
          value: "diogoscf#2167",
          inline: true
        }
      )
      .setFooter(
        "Made by diogoscf#2167",
        "https://cdn.discordapp.com/avatars/817789370022101053/e698846c56b5b751c10cf9569fec2a02.webp"
      );

    return msg.channel.send({ embeds: [aboutEmbed] });
  }
}
