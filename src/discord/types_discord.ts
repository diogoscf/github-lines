/**
 * Discord-specific configuration.
 */
export class DiscordConfig {
  readonly DISCORD_TOKEN: string;

  readonly PRISMA_TOKEN: string | undefined;

  readonly TOPGG: string | undefined;

  readonly owner: string;

  readonly commandPrefix: string;

  readonly nonCommandEditable: boolean;

  constructor(dstoken: string, ptoken?: string, topgg?: string) {
    this.DISCORD_TOKEN = dstoken;
    this.PRISMA_TOKEN = ptoken;
    this.TOPGG = topgg;
    this.owner = "404599570090164224"; // diogoscf#7418
    this.commandPrefix = ";";
    this.nonCommandEditable = false;
  }
}

import { Command, CommandoMessage } from "discord.js-commando";
import { Message, PermissionString } from "discord.js";

/**
 * custom class for custom rate-limiting
 */
export class RLCommand extends Command {
  onBlock(
    message: CommandoMessage,
    reason: string,
    data?: { throttle?; remaining?: number; response?: string; missing?: PermissionString[] }
  ): Promise<Message | Message[]> {
    if (reason !== "throttling") return super.onBlock(message, reason, data);

    if (data?.throttle?.usages === this.throttling.usages) {
      data.throttle.usages += 1; // eslint-disable-line no-param-reassign
      return super.onBlock(message, reason, data);
    }

    return message.pinned ? message.pin() : message.unpin(); // because null is not an acceptable return value
  }
}
