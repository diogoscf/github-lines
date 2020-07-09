const { Command } = require("discord.js-commando");

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      memberName: "ping",
      group: "commands",
      description: "Check bot latency",
      throttling: {
        usages: 1,
        duration: 15
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async run(msg) {
    const pingMsg = await msg.channel.send("Ping?");
    return pingMsg.edit(`Pong! Latency is ${pingMsg.createdTimestamp - msg.createdTimestamp}ms. API Latency is ${msg.client.ws.ping}ms`);
  }
};
