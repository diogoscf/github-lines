/**
 * Telegram Bot. It takes advantage of the functions defined in core.ts.
 */

import * as TelegramBot from "node-telegram-bot-api";
import { Core } from "../core/core";
import { TelegramConfig } from "./types_telegram";

export class GHLTelegramBot extends TelegramBot {
  readonly core: Core;

  readonly config: TelegramConfig;

  constructor(core: Core, config: TelegramConfig) {
    super(config.TELEGRAM_TOKEN, { polling: true });
    this.core = core;
    this.config = config;
  }

  /**
   * Start listening to Telegram webhook.
   */
  start(): void {
    // The essence of this bot, scan all messages
    this.on("message", async (msg) => {
      if (!msg.text) {
        console.log("Message doesn't contain text, returned. (msg.text === undefined)");
        return;
      }

      const [botMsg] = await this.handleMessage(msg);
      if (botMsg) {
        await this.sendMessage(msg.chat.id, botMsg, { parse_mode: "Markdown" });
      }
    });

    // Perform some initial setup when added to a group
    this.on("new_chat_members", async (msg) => {
      msg.new_chat_members?.forEach(async (user) => {
        const botData = await this.getMe();
        if (user.id === botData.id) {
          this.sendMessage(msg.chat.id, "Thanks for adding me to your group! ❤️", {
            parse_mode: "HTML"
          });

          this.sendMessage(
            msg.chat.id,
            "GitHub Lines runs automatically, without need for commands or configuration! " +
              "Just send a GitHub (or GitLab) link that mentions one or more lines and the bot will automatically respond.\n\n" +
              "There are a few commands you can use, although they are not necessary for the bot to work. To get a list, type `/help`\n\n" +
              "If you want to support us, just convince your friends to add the bot to their group chat!\n\n" +
              "Have fun!"
          );
        }
      });
    });

    console.log("Started Telegram bot.");
  }

  /**
   * This is Telegram-level handleMessage(). It calls core-level handleMesasge() and then
   * performs necessary formatting and validation.
   * @param msg Telegram message object
   */
  async handleMessage(msg: TelegramBot.Message): Promise<(string | null)[]> {
    if (!msg.text) {
      return ["Something strange happened - the message is empty!"];
    }

    const { msgList, totalLines } = await this.core.handleMessage(msg.text);

    if (totalLines > 50) {
      return ["Sorry, but to prevent spam, we limit the number of lines displayed at 50"];
    }

    const messages = msgList.map(
      (ld) => `\`\`\`${ld.toDisplay.search(/\S/) !== -1 ? ld.extension : " "}\n${ld.toDisplay}\n\`\`\``
    );

    const botMsg = messages.join("\n") || null;

    if (botMsg && botMsg.length >= 2000) {
      return ["Sorry but there is a 2000 character limit on Discord, so we were unable to display the desired snippet"];
    }

    return [botMsg];
  }
}
