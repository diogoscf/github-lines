const { Command } = require("discord.js-commando");

module.exports = class TopggCommand extends Command {
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
  run(msg) {
    return msg.channel.send("We appreciate votes :heart: https://top.gg/bot/708282735227174922");
  }
};
