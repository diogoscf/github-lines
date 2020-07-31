import * as fetch from "node-fetch";
import { isFilled } from "ts-is-present"; // https://github.com/microsoft/TypeScript/issues/16069

import { LineData, IMessageData } from "./types_core";

export class Core {
  readonly GITHUB_TOKEN: string | undefined;

  readonly authHeaders: { [key: string]: string };

  constructor(token: string | undefined) {
    this.GITHUB_TOKEN = token;

    this.authHeaders = {};
    if (this.GITHUB_TOKEN) {
      this.authHeaders.Authorization = `token ${this.GITHUB_TOKEN}`;
    }
  }

  static formatIndent(str: string): string {
    const lines = str.replace(/\t/g, "    ").split("\n"); // replaces tabs with 4 spaces
    const ignored: Array<number> = []; // list of blank lines
    let minSpaces = Infinity; // the smallest amount of spaces in any line
    const newLines: Array<string> = []; // array of the returned lines
    lines.forEach((line, idx) => {
      const leadingSpaces = line.search(/\S/);
      if (leadingSpaces === -1) {
        ignored.push(idx);
      } else if (leadingSpaces < minSpaces) {
        minSpaces = leadingSpaces;
      }
    });

    lines.forEach((line, idx) => {
      if (ignored.includes(idx)) {
        newLines.push(line);
      } else {
        newLines.push(line.substring(minSpaces));
      }
    });

    return newLines.join("\n");
  }

  /**
   * Handles a match for lines
   * @param {Array} match The match list (as returned by a regex)
   * @param {String} type The webiste the match was detected in
   * @returns {?Array} an array with the message to return and the number of lines (null if failed)
   */
  async handleMatch(match: Array<string>, type: string): Promise<LineData | null> {
    let lines;
    let filename = match[3];
    if (type === "GitHub") {
      const resp = await fetch(`https://raw.githubusercontent.com/${match[1]}/${match[2]}/${filename}`);
      if (!resp.ok) {
        return null; // TODO: fallback to API
      }
      const text = await resp.text();
      lines = text.split("\n");
    } else if (type === "GitLab") {
      const resp = await fetch(`https://gitlab.com/${match[1]}/-/raw/${match[2]}/${filename}`);
      if (!resp.ok) {
        return null; // TODO: fallback to API
      }
      const text = await resp.text();
      lines = text.split("\n");
    } else if (type === "Gist") {
      filename = filename.replace(/-([^-]*)$/, ".$1");
      let text;
      if (match[2].length) {
        const resp = await fetch(`https://gist.githubusercontent.com/${match[1]}/raw/${match[2]}/${filename}`);
        if (!resp.ok) {
          return null; // TODO: fallback to API
        }
        text = await resp.text();
      } else {
        const resp = await fetch(`https://api.github.com/gists/${match[1].split("/")[1]}`, {
          method: "GET",
          headers: this.authHeaders
        });
        if (!resp.ok) {
          return null;
        }
        const json = await resp.json();
        text = json.files[filename]?.content;
        if (!text) {
          // if the gist exists but not the file
          return null;
        }
      }
      lines = text.split("\n");
    } else {
      console.log("Wrong type sent to handleMatch!");
      return null;
    }

    let toDisplay;
    let lineLength;
    if (!match[5].length || match[4] === match[5]) {
      if (parseInt(match[4], 10) > lines.length || parseInt(match[4], 10) === 0) return null;
      toDisplay = lines[parseInt(match[4], 10) - 1].trim().replace(/``/g, "`\u200b`"); // escape backticks
      lineLength = 1;
    } else {
      let start = parseInt(match[4], 10);
      let end = parseInt(match[5], 10);
      if (end < start) [start, end] = [end, start];
      if (end > lines.length) end = lines.length;
      if (start === 0) start = 1;
      lineLength = end - start + 1;
      toDisplay = Core.formatIndent(lines.slice(start - 1, end).join("\n")).replace(/``/g, "`\u200b`"); // escape backticks
    }

    // file extension for syntax highlighting
    let extension = (filename.includes(".") ? filename.split(".") : [""]).pop(); // .pop returns the last element
    if (!extension || extension.match(/[^0-9a-z]/i)) extension = ""; // alphanumeric extensions only

    // const message = `\`\`\`${toDisplay.search(/\S/) !== -1 ? extension : " "}\n${toDisplay}\n\`\`\``;
    return new LineData(lineLength, extension, toDisplay);
  }

  async handleMessage(msg: string): Promise<IMessageData> {
    const returned: Array<Promise<LineData | null>> = [];

    const githubMatch = msg.matchAll(
      /https?:\/\/github\.com\/([a-zA-Z0-9-_]+\/[A-Za-z0-9_.-]+)\/blob\/(.+?)\/(.+?)#L(\d+)[-~]?L?(\d*)/g
    );
    if (githubMatch) {
      for (const match of githubMatch) {
        returned.push(this.handleMatch(match, "GitHub"));
      }
    }

    const gitlabMatch = msg.matchAll(
      /https?:\/\/gitlab\.com\/([a-zA-Z0-9-_]+\/[A-Za-z0-9_.-]+)\/-\/blob\/(.+?)\/(.+?)#L(\d+)-?(\d*)/g
    );
    if (gitlabMatch) {
      for (const match of gitlabMatch) {
        returned.push(this.handleMatch(match, "GitLab"));
      }
    }

    const gistMatch = msg.matchAll(
      /https?:\/\/gist\.github\.com\/([a-zA-Z0-9-_]+\/[0-9a-zA-Z]+)\/?([0-9a-z]*)\/*#file-(.+?)-L(\d+)[-~]?L?(\d*)/g
    );
    if (gistMatch) {
      for (const match of gistMatch) {
        returned.push(this.handleMatch(match, "Gist"));
      }
    }

    const unfiltered = await Promise.all(returned);
    const filtered = unfiltered.filter(isFilled);

    let totalLines = 0;
    filtered.forEach((el) => {
      totalLines += el.lineLength;
    });
    return {
      msgList: filtered,
      totalLines
    };
  }
}
