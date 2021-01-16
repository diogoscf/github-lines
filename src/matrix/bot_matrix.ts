/**
 * Matrix Bot. It takes advantage of the functions defined in core.ts.
 */

import {
  MatrixClient,
  SimpleFsStorageProvider,
  AutojoinRoomsMixin,
  LogLevel,
  RichReply,
  RichConsoleLogger,
  LogService
} from "matrix-bot-sdk";
import { Core } from "../core/core";
import { LineData } from "../core/types_core";
import { MatrixConfig } from "./types_matrix";

// make the logs a bit prettier.
LogService.setLogger(new RichConsoleLogger());
LogService.setLevel(LogLevel.ERROR);

const storage = new SimpleFsStorageProvider("github_lines-matrix.json");

export class GHLMatrixBot extends MatrixClient {
  readonly core: Core;

  readonly config: MatrixConfig;

  constructor(core: Core, config: MatrixConfig) {
    super(config.MATRIX_TOKEN, config.MATRIX_HOMESERVER, storage);
    this.core = core;
    this.config = config;
  }

  /**
   * Start listening to Matrix Room events
   */
  init(): void {
    // The essence of this bot, scan all messages
    AutojoinRoomsMixin.setupOnClient(this);

    this.on("room.message", async (roomId: string, event: any) => {
      // Don't handle events that don't have contents (they were probably redacted)
      if (!event.content) return;

      // Don't handle non-text events
      if (event.content.msgtype !== "m.text") return;

      // filter out events sent by the bot itself.
      if (event.sender === (await this.getUserId())) return;

      const [botMsg] = await this.handleMessage(event);

      if (botMsg) {
        await this.sendHtmlText(roomId, botMsg);
      }
    });

    console.log("Started Matrix bot.");
  }

  /**
   * This is Matrix-level handleMessage(). It calls core-level handleMessage() and then
   * performs necessary formatting and validation.
   * @param event any
   */
  async handleMessage(event: any): Promise<(string | null)[]> {
    if (!event.content.body) {
      return ["Something strange happened - the message is empty!"];
    }

    const { msgList, totalLines } = await this.core.handleMessage(event.content.body);

    if (totalLines > 50) {
      return ["Sorry, but to prevent spam, we limit the number of lines displayed at 50"];
    }

    const messages = msgList.map((ld: LineData) => {
      const language = ld.toDisplay.search(/\S/) !== -1 ? `class="language-${ld.extension}"` : " ";
      return `<pre><code ${language}>${ld.toDisplay}</code></pre>`;
    });

    const botMsg = messages.join("\n") || null;

    return [botMsg];
  }

  async handleInvite(event: any, targetRoomId: string): Promise<void> {
    // Perform some initial setup when added to a group

    await this.sendHtmlText(targetRoomId, "Thanks for adding me to your group! ❤️");

    await this.sendText(
      targetRoomId,
      "GitHub Lines runs automatically, without need for commands or configuration! " +
        "Just send a GitHub (or GitLab) link that mentions one or more lines and the bot will automatically respond.\n\n" +
        "If you want to support us, just convince your friends to add the bot to their group chat!\n\n" +
        "Have fun!"
    );

    // let the user who invited the bot know that the invite completed
    // successfully
    await this.sendText(event.sender, `Invite to ${targetRoomId} was successful.`);
  }
}
