/**
 * Telegram-specific configuration.
 */
export class TelegramConfig {
  readonly TELEGRAM_TOKEN: string;

  constructor(token: string) {
    this.TELEGRAM_TOKEN = token;

    // console.log(`Created TelegramConfig object. TOKEN: ${TOKEN}`)
  }
}
