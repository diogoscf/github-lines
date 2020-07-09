const { Command } = require("discord.js-commando");

module.exports = class SourceCommand extends Command {
  constructor(client) {
    super(client, {
      name: "source",
      memberName: "source",
      aliases: ["github"],
      group: "commands",
      description: "Link GitHub source",
      throttling: {
        usages: 1,
        duration: 15
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  run(msg) {
    return msg.channel.send("Stars are appreciated :heart: https://github.com/diogoscf/github-lines");
  }
};
