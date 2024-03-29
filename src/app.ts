import * as dotenv from "dotenv";
dotenv.config();

import { CoreLogic } from "./core/coreLogic";
import * as matrix from "./matrix/bot_matrix";
import * as telegram from "./telegram/bot_telegram";
import * as discord from "./discord/bot_discord";
import { MatrixConfig } from "./matrix/types_matrix";
import { TelegramConfig } from "./telegram/types_telegram";
import { DiscordConfig } from "./discord/types_discord";

const { DISCORD_TOKEN, TELEGRAM_TOKEN, TOPGG, GITHUB_TOKEN, MATRIX_TOKEN, MATRIX_HOMESERVER } = process.env;

async function main(): Promise<void> {
  const coreLogic = new CoreLogic(GITHUB_TOKEN);

  const discordRunning = process.argv.includes("--discord");
  const telegramRunning = process.argv.includes("--telegram");
  const matrixRunning = process.argv.includes("--matrix");

  if (discordRunning) {
    if (DISCORD_TOKEN != null) {
      const discordBot = new discord.GHLDiscordBot(coreLogic, new DiscordConfig(DISCORD_TOKEN, TOPGG));
      discordBot.start();
    } else {
      console.error("DISCORD_TOKEN is null/undefined");
    }
  }

  if (telegramRunning) {
    if (TELEGRAM_TOKEN != null) {
      const telegramBot = new telegram.GHLTelegramBot(coreLogic, new TelegramConfig(TELEGRAM_TOKEN));
      telegramBot.start();
    } else {
      console.error("TELEGRAM_TOKEN is null/undefined!");
    }
  }

  if (matrixRunning) {
    if (MATRIX_TOKEN != null && MATRIX_HOMESERVER != null) {
      const matrixBot = new matrix.GHLMatrixBot(coreLogic, new MatrixConfig(MATRIX_HOMESERVER, MATRIX_TOKEN));
      matrixBot.init();
      matrixBot.start();
    } else {
      console.error("MATRIX_TOKEN or MATRIX_HOMESERVER is null/undefined!");
    }
  }

  if (!discordRunning && !telegramRunning && !matrixRunning) {
    console.error("You must run the bot for at least one platform!");
  }
}

main().catch(console.error);
