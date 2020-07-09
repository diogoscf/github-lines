const {
  Command
} = require("discord.js-commando");
const DiscordBot = require("discord.js");

module.exports = class AboutCommand extends Command {
  constructor(client) {
    super(client, {
      name: "about",
      aliases: ["stats"],
      memberName: "about",
      group: "commands",
      description: "Info about the bot",
      throttling: {
        usages: 1,
        duration: 15
      }
    });
  }

  static convertMS(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = (seconds % 60).toString();
    let hours = Math.floor(minutes / 60);
    minutes = (minutes % 60).toString();
    const days = Math.floor(hours / 24);
    hours = (hours % 24).toString();

    if (hours.length === 1) hours = `0${hours}`;
    if (minutes.length === 1) minutes = `0${minutes}`;
    if (seconds.length === 1) seconds = `0${seconds}`;

    let dayStr = "";
    if (days > 1) {
      dayStr = `${days} days, `;
    } else if (days === 1) {
      dayStr = "1 day, ";
    }

    return `${dayStr}${hours}:${minutes}:${seconds}`;
  }

  // eslint-disable-next-line class-methods-use-this
  async run(msg) {
    const botApp = await msg.client.fetchApplication();
    let userCount = 0;
    msg.client.guilds.cache.forEach((guild) => {
      userCount += guild.memberCount;
    });
    const aboutEmbed = new DiscordBot.MessageEmbed()
      .setTitle("About GitHub Lines")
      .setDescription("GitHub Lines is a bot that displays one or more lines when mentioned in a GitHub (or GitLab) link")
      // .setThumbnail("IMAGE HERE")
      .addFields({
        name: "Guild Count",
        value: msg.client.guilds.cache.size,
        inline: true
      }, {
        name: "User Count",
        value: userCount,
        inline: true
      }, {
        name: "Uptime",
        value: AboutCommand.convertMS(msg.client.uptime),
        inline: true
      }, {
        name: "Latency",
        value: `${msg.client.ws.ping}ms`,
        inline: true
      }, {
        name: "Owner",
        value: botApp.owner.tag,
        inline: true
      })
      .setFooter("Made by diogoscf#7418", "https://cdn.discordapp.com/avatars/404599570090164224/04b80f9e7dd9933daedb6cbf504ef29c.webp");

    return msg.channel.send(aboutEmbed);
  }
};
