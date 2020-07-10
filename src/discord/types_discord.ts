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

  constructor(dstoken: string, ptoken: string | undefined, topgg: string | undefined) {
    this.DISCORD_TOKEN = dstoken;
    this.PRISMA_TOKEN = ptoken;
    this.TOPGG = topgg;
    this.owner = "404599570090164224"; // diogoscf#7418
    this.commandPrefix = ";";
    this.nonCommandEditable = false;
  }
}
