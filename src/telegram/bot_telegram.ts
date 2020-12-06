/**
 * Telegram Bot. It takes advantage of the functions defined in core.ts.
 */

import * as TelegramBot from "node-telegram-bot-api";
import { Core } from "../core/core";
import { TelegramConfig } from "./types_telegram";

export class GHLTelegramBot extends TelegramBot {
  readonly core: Core;

  readonly config: TelegramConfig;

  readonly analytics: Prismalytics;

  constructor(core: Core, config: TelegramConfig) {
    super(config.TELEGRAM_TOKEN, { polling: true });
    this.core = core;
    this.telegramConfig = config;
  }

  /**
   * Start listening to Telegram webhook.
   */
  start(): void {
    // The essence of this bot, scan all messages
    this.on("message", async (msg) => {
      if (msg.text === undefined) {
        console.log("Message doesn't contain text, returned. (msg.text === undefined)");
        return;
      }

      if (msg.chat.type === "private") {
        console.log("Message was sent in a private chat, returned. (msg.chat.type === private)");
        this.sendMessage(msg.chat.id, "Sorry, I work only in groups.");
        return;
      }

      console.log("TODO: finish parsing messages - replicate discord functionality");
      // the line above is console.log() so ESLint doesn't get angry about return
    });

    // Perform some initial setup when added to a group
    this.on("new_chat_members", async (msg) => {
      msg.new_chat_members?.forEach(async (user) => {
        const botData = await this.getMe();
        if (user.id === botData.id) {
          const chatId = `msg.chat.id: ${msg.chat.id}, msg.chat.title: ${msg.chat.title}`;

          this.sendMessage(
            msg.chat.id,
            `Hello! Since now, you are only allowed to speak ${this.core.config.REQUIRED_LANG}. ${chatId}`,
            {
              parse_mode: "HTML"
            }
          );
        }
      });
    });

    console.log("Started Telegram bot.");
  }
}
