import * as DiscordBot from "discord.js";
import { RLCommand } from "../types_discord";

export class AboutCommand extends RLCommand {
  constructor(client) {
    super(client, {
      name: "about",
      aliases: ["stats"],
      memberName: "about",
      group: "commands",
      description: "Info about the bot",
      clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
      throttling: {
        usages: 1,
        duration: 15
      }
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
  async run(msg): Promise<DiscordBot.Message> {
    const botApp = await msg.client.fetchApplication();
    let userCount = 0;
    msg.client.guilds.cache.forEach((guild) => {
      userCount += guild.memberCount;
    });
    const aboutEmbed = new DiscordBot.MessageEmbed()
      .setTitle("About GitHub Lines")
      .setDescription(
        "GitHub Lines is a bot that displays one or more lines when mentioned in a GitHub (or GitLab) link"
      )
      // .setThumbnail("IMAGE HERE")
      .addFields(
        {
          name: "Guild Count",
          value: msg.client.guilds.cache.size,
          inline: true
        },
        {
          name: "User Count",
          value: userCount,
          inline: true
        },
        {
          name: "Uptime",
          value: AboutCommand.convertMS(msg.client.uptime),
          inline: true
        },
        {
          name: "Latency",
          value: `${msg.client.ws.ping}ms`,
          inline: true
        },
        {
          name: "Owner",
          value: botApp.owner.tag,
          inline: true
        }
      )
      .setFooter(
        "Made by diogoscf#7418",
        "https://cdn.discordapp.com/avatars/404599570090164224/04b80f9e7dd9933daedb6cbf504ef29c.webp"
      );

    return msg.channel.send(aboutEmbed);
  }
}
