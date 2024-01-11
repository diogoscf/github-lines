import * as DiscordBot from "discord.js";
import { Command } from "@sapphire/framework";

export class AboutCommand extends Command {
  constructor(client: Command.LoaderContext) {
    super(client, {
      name: "about",
      aliases: ["stats"],
      description: "Info about the bot",
      requiredClientPermissions: ["SendMessages", "EmbedLinks"]
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
    const aboutEmbed = new DiscordBot.EmbedBuilder()
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
          value: "diogoscf",
          inline: true
        }
      )
      .setFooter({
        text: "Made by diogoscf",
        iconURL: "https://cdn.discordapp.com/avatars/404599570090164224/b12c8c307ebd79beee56ec228e62b2ce.webp"
      });

    return msg.channel.send({ embeds: [aboutEmbed] });
  }
}
