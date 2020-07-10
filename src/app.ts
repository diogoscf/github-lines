import * as dotenv from "dotenv";
dotenv.config();

import { Core } from "./core/core";
import * as discord from "./discord/bot_discord";
import { DiscordConfig } from "./discord/types_discord";

const { DISCORD_TOKEN, TOPGG, PRISMA_TOKEN, GITHUB_TOKEN } = process.env;

async function main(): Promise<void> {
  const core = new Core(GITHUB_TOKEN);

  const discordRunning = process.argv.includes("--discord");

  if (discordRunning) {
    if (DISCORD_TOKEN != null) {
      const discordBot = new discord.GHLDiscordBot(core, new DiscordConfig(DISCORD_TOKEN, PRISMA_TOKEN, TOPGG));
      discordBot.start();
    } else {
      console.error("DISCORD_TOKEN is null/undefined");
    }
  }

  if (!discordRunning) {
    console.error("You must run bot for at least one platform!");
  }
}

main().catch(console.error);
