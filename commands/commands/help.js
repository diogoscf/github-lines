const { Command } = require("discord.js-commando");
const DiscordBot = require("discord.js");

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      memberName: "help",
      group: "commands",
      description: "Displays a help message",
      throttling: {
        usages: 1,
        duration: 15
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  run(msg) {
    const helpEmbed = new DiscordBot.MessageEmbed()
      .setTitle("Help Info")
      .setDescription("GitHub Lines runs automatically, without need for configuration! Here are some commands you can use")
      // .setThumbnail("IMAGE HERE")
      .addFields({
        name: "`;about` or `;stats`",
        value: "Info about the bot",
        inline: false
      }, {
        name: "`;invite`, `;vote` or `;topgg`",
        value: "Link to the bot's top.gg page",
        inline: false
      }, {
        name: "`;botsgg`",
        value: "Link to the bot's discord.bots.gg page",
        inline: false
      }, {
        name: "`;help`",
        value: "Displays this message",
        inline: false
      }, {
        name: "`;github` or `;source`",
        value: "Link GitHub source",
        inline: false
      }, {
        name: "`;ping`",
        value: "Check bot latency",
        inline: false
      });

    return msg.channel.send(helpEmbed);
  }
};
