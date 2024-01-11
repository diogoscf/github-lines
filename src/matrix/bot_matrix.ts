/**
 * Matrix Bot. It takes advantage of the functions defined in coreLogic.ts.
 */

import {
  MatrixClient,
  SimpleFsStorageProvider,
  AutojoinRoomsMixin,
  LogLevel,
  RichConsoleLogger,
  LogService
} from "matrix-bot-sdk";
import { CoreLogic } from "../core/coreLogic";
import { LineData } from "../core/types_core";
import { MatrixConfig } from "./types_matrix";

// make the logs a bit prettier.
LogService.setLogger(new RichConsoleLogger());
LogService.setLevel(LogLevel.ERROR);

const storage = new SimpleFsStorageProvider("github_lines-matrix.json");

export class GHLMatrixBot extends MatrixClient {
  readonly coreLogic: CoreLogic;

  readonly config: MatrixConfig;

  constructor(coreLogic: CoreLogic, config: MatrixConfig) {
    super(config.MATRIX_TOKEN, config.MATRIX_HOMESERVER, storage);
    this.coreLogic = coreLogic;
    this.config = config;
  }

  /**
   * Start listening to Matrix Room events
   */
  init(): void {
    // The essence of this bot, scan all messages
    AutojoinRoomsMixin.setupOnClient(this);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // Handle invites
    this.on("room.join", async (roomId: string) => {
      await this.handleInvite(roomId);
    });

    console.log("Started Matrix bot.");
  }

  /**
   * This is Matrix-level handleMessage(). It calls coreLogic-level handleMessage() and then
   * performs necessary formatting and validation.
   * @param event any
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handleMessage(event: any): Promise<(string | null)[]> {
    if (!event.content.body) {
      return ["Something strange happened - the message is empty!"];
    }

    const { msgList, totalLines } = await this.coreLogic.handleMessage(event.content.body);

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

  async handleInvite(targetRoomId: string): Promise<void> {
    // Perform some initial setup when added to a group

    await this.sendHtmlText(targetRoomId, "Thanks for adding me to your group! ❤️");

    await this.sendText(
      targetRoomId,
      "GitHub Lines runs automatically, without need for commands or configuration! " +
        "Just send a GitHub (or GitLab) link that mentions one or more lines and the bot will automatically respond.\n\n" +
        "If you want to support us, just convince your friends to add the bot to their group chat!\n\n" +
        "Have fun!"
    );
  }
}
