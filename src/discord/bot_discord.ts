/**
 * Discord Bot. It takes advantage of the functions defined in core.ts.
 */

import * as DiscordCommandBot from "discord.js-commando";
import * as DiscordBot from "discord.js";

import * as Prismalytics from "prismajs";
import * as Dbl from "dblapi.js";
import * as path from "path";
import { DiscordConfig } from "./types_discord";
import { Core } from "../core/core";

export class GHLDiscordBot extends DiscordCommandBot.Client {
  readonly core: Core;

  readonly config: DiscordConfig;

  readonly analytics: Prismalytics;

  constructor(core: Core, config: DiscordConfig) {
    super({
      owner: config.owner,
      commandPrefix: config.commandPrefix,
      nonCommandEditable: config.nonCommandEditable
    });

    this.core = core;
    this.config = config;

    if (this.config.PRISMA_TOKEN) {
      this.analytics = new Prismalytics(this.config.PRISMA_TOKEN);
    }

    if (this.config.TOPGG) {
      const dbl = new Dbl(this.config.TOPGG, this); // eslint-disable-line no-unused-vars, @typescript-eslint/no-unused-vars
    }

    this.login(this.config.DISCORD_TOKEN)
      .then(() => this.setupCommands())
      .catch(console.error);
  }

  /**
   * Starts listening to new messages.
   */
  start(): void {
    // Handles all messages and checks whether they contain a resolvable link
    this.on("message", async (msg) => {
      if (msg.author.bot) {
        return;
      }

      const [botMsg, toDelete] = await this.handleMessage(msg);
      if (botMsg) {
        const sentmsg = await msg.channel.send(botMsg);

        if (toDelete) {
          sentmsg.delete({ timeout: 5000 }).catch(() => null); // error ignored - someone else deleted
        } else if (!sentmsg.guild || sentmsg.guild.me?.permissionsIn(sentmsg.channel).has("ADD_REACTIONS")) {
          const botReaction = await sentmsg.react("🗑️");

          const filter = (reaction, user): boolean => reaction.emoji.name === "🗑️" && user.id === msg.author.id;
          const collector = sentmsg.createReactionCollector(filter, { time: 15000 });
          collector.on("collect", () => sentmsg.delete());
          collector.on("end", () => botReaction.remove());
        }
      }
    });

    this.on("ready", () => {
      this?.user?.setActivity("for GitHub links", {
        type: "WATCHING"
      });
    });

    this.on("commandRun", (a, b, msg) => {
      if (this.analytics) this.analytics.send(msg);
    });

    this.on("guildCreate", (guild) => {
      console.log(`Joined new server ${guild.name}`);

      const joinEmbed = new DiscordBot.MessageEmbed()
        .setTitle("Thanks for adding me to your server! :heart:")
        .setDescription(
          "GitHub Lines runs automatically, without need for commands or configuration! " +
            "Just send a GitHub (or GitLab) link that mentions one or more lines and the bot will automatically respond.\n\n" +
            "There are a few commands you can use, although they are not necessary for the bot to work. To get a list, type `;help`\n\n" +
            "If you want to support us, just convince your friends to add the bot to their server!\n\n" +
            "Have fun!"
        );

      // If there is a system channel set (and the bot has perms there), send message there
      // Otherwise, send it to #general if it exists, or to the first text channel
      if (guild.systemChannel && guild.me?.permissionsIn(guild.systemChannel).has("SEND_MESSAGES")) {
        guild.systemChannel.send(joinEmbed);
        return;
      }

      const textChannels = guild.channels.cache
        .array()
        .filter((c): c is DiscordBot.TextChannel => c instanceof DiscordBot.TextChannel);
      let channel = textChannels.find((c) => c.name === "general" && guild.me?.permissionsIn(c).has("SEND_MESSAGES"));
      if (!channel) channel = textChannels.find((c) => guild.me?.permissionsIn(c).has("SEND_MESSAGES"));

      channel?.send(joinEmbed);
    });

    console.log("Started Discord bot.");
  }

  private setupCommands(): void {
    this.registry
      .registerDefaultTypes()
      .registerDefaultGroups()
      .registerDefaultCommands({
        help: false, // custom help command
        prefix: false, // no db for now
        ping: false, // custom ping command
        unknownCommand: false, // bots that do this are trash
        commandState: false // again, no db
      })
      .registerCommandsIn({
        filter: /^([^.].*)\.(js|ts)$/,
        dirname: path.join(__dirname, "commands")
      });
  }

  async handleMessage(msg: DiscordBot.Message): Promise<(null | string | boolean)[]> {
    const { msgList, totalLines } = await this.core.handleMessage(msg.content);

    if (totalLines > 50) {
      return ["Sorry, but to prevent spam, we limit the number of lines displayed at 50", true];
    }

    const messages = msgList.map(
      (el) => `\`\`\`${el.toDisplay.search(/\S/) !== -1 ? el.extension : " "}\n${el.toDisplay}\n\`\`\``
    );

    const botMsg = messages.join("\n") || null;

    if (botMsg && botMsg.length >= 2000) {
      return [
        "Sorry but there is a 2000 character limit on Discord, so we were unable to display the desired snippet",
        true
      ];
    }

    if (botMsg) {
      if (msg.pinnable) {
        // can always supress embed if pinnable
        // it can take a few ms before the supress can be registered
        setTimeout(() => msg.suppressEmbeds(true).catch(console.error), 100);
      }

      if (this.analytics) {
        const bogusMsg = msg;
        bogusMsg.content = ";link"; // this is retarded, waiting for prismalytics to support command-less messages
        this.analytics.send(bogusMsg);
      }
    }

    return [botMsg, false];
  }
}
