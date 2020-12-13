import * as dotenv from "dotenv";
dotenv.config();

import { Core } from "./core/core";
import * as telegram from "./telegram/bot_telegram";
import * as discord from "./discord/bot_discord";
import { TelegramConfig } from "./telegram/types_telegram";
import { DiscordConfig } from "./discord/types_discord";

const { DISCORD_TOKEN, TELEGRAM_TOKEN, TOPGG, PRISMA_TOKEN, GITHUB_TOKEN } = process.env;

async function main(): Promise<void> {
  const core = new Core(GITHUB_TOKEN);

  const discordRunning = process.argv.includes("--discord");
  const telegramRunning = process.argv.includes("--telegram");

  if (discordRunning) {
    if (DISCORD_TOKEN != null) {
      const discordBot = new discord.GHLDiscordBot(core, new DiscordConfig(DISCORD_TOKEN, PRISMA_TOKEN, TOPGG));
      discordBot.start();
    } else {
      console.error("DISCORD_TOKEN is null/undefined");
    }
  }

  if (telegramRunning) {
    if (TELEGRAM_TOKEN != null) {
      const telegramBot = new telegram.GHLTelegramBot(core, new TelegramConfig(TELEGRAM_TOKEN));
      telegramBot.start();
    } else {
      console.error("TELEGRAM_TOKEN is null/undefined!");
    }
  }

  if (!discordRunning && !telegramRunning) {
    console.error("You must run the bot for at least one platform!");
  }
}

main().catch(console.error);
