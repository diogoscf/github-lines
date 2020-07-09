require("dotenv").config();

const fetch = require("node-fetch");

const DiscordBot = require("discord.js-commando");
const {
  DISCORD_TOKEN,
  TOPGG,
  PRISMA_TOKEN,
  GITHUB_TOKEN
} = process.env;
const bot = new DiscordBot.Client({
  owner: "404599570090164224", // diogoscf#7418
  commandPrefix: ";",
  nonCommandEditable: false
});

const path = require("path");

bot.registry
  .registerGroup("commands", "all commands")
  .registerDefaultTypes()
  .registerDefaultGroups()
  .registerDefaultCommands({
    help: false, // custom help command
    prefix: false, // no db for now
    ping: false, // custom ping command
    eval: false, // duh
    unknownCommand: false, // bots that do this are trash
    commandState: false // again, no db
  })
  .registerCommandsIn(path.resolve(__dirname, "commands"));

bot.login(DISCORD_TOKEN);

const DBL = require("dblapi.js"); // discord bot list API (top.gg)
if (TOPGG) {
  const dbl = new DBL(TOPGG, bot); // eslint-disable-line no-unused-vars
}

const Prismalytics = require("prismajs"); // prismalytics.herokuapp.com
let analytics = null;
if (PRISMA_TOKEN) {
  analytics = new Prismalytics(PRISMA_TOKEN);
}

const authHeaders = {};
if (GITHUB_TOKEN) {
  authHeaders.Authorization = `token ${GITHUB_TOKEN}`;
}

/**
 * Formats the indentation of a string
 * Any leading space common to all lines is removed
 * @param {String} str Unformatted string
 * @returns {String} Formatted string
 */
function formatIndent(str) {
  const lines = str.replace(/\t/g, "    ").split("\n"); // replaces tabs with 4 spaces
  const ignored = []; // list of blank lines
  let minSpaces = Infinity; // the smallest amount of spaces in any line
  const newLines = []; // array of the returned lines
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
 * @param {DiscordBot.Message} msg The message with the detected match
 * @param {Array} match The match list (as returned by a regex)
 * @param {String} type The webiste the match was detected in
 * @returns {?Array} an array with the message to return and the number of lines (null if failed)
 */
async function handleMatch(msg, match, type) {
  let lines;
  if (type === "GitHub") {
    const resp = await fetch(`https://raw.githubusercontent.com/${match[1]}/${match[2]}/${match[3]}`);
    if (!resp.ok) {
      return null; // TODO: fallback to API
    }
    const text = await resp.text();
    lines = text.split("\n");
  } else if (type === "GitLab") {
    const resp = await fetch(`https://gitlab.com/${match[1]}/-/raw/${match[2]}/${match[3]}`);
    if (!resp.ok) {
      return null; // TODO: fallback to API
    }
    const text = await resp.text();
    lines = text.split("\n");
  } else if (type === "Gist") {
    match[3] = match[3].replace(/-([^-]*)$/, ".$1"); // eslint-disable-line no-param-reassign
    let text;
    if (match[2].length) {
      const resp = await fetch(`https://gist.githubusercontent.com/${match[1]}/raw/${match[2]}/${match[3]}`);
      if (!resp.ok) {
        return null; // TODO: fallback to API
      }
      text = await resp.text();
    } else {
      const resp = await fetch(`https://api.github.com/gists/${match[1].split("/")[1]}`, {
        method: "GET",
        headers: authHeaders
      });
      if (!resp.ok) {
        return null;
      }
      const json = await resp.json();
      text = json.files[match[3]].content;
    }
    lines = text.split("\n");
  } else {
    console.log("Wrong type sent to handleMatch");
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
    lineLength = end - start;
    toDisplay = formatIndent(lines.slice(start - 1, end).join("\n")).replace(/``/g, "`\u200b`"); // escape backticks
  }

  // file extension for syntax highlighting
  let extension = (match[3].includes(".") ? match[3].split(".") : [""]).pop(); // .pop returns the last element
  if (extension.match(/[^0-9a-z]/i) || !extension) extension = ""; // discord only allows alphanumeric extensions

  const message = `\`\`\`${toDisplay.search(/\S/) !== -1 ? extension : " "}\n${toDisplay}\n\`\`\``;
  return [message, lineLength];
}

/**
 * Master function
 * Handles any message recieved by the bot
 * @param {DiscordBot.Message} msg The received message
 * @return {?String} message to be sent (null if no message is to be sent)
 */
async function handleMessage(msg) {
  const returned = [];
  let totalLines = 0;

  const githubMatch = msg.content.matchAll(/https?:\/\/github\.com\/([a-zA-Z0-9-_]+\/[A-Za-z0-9_.-]+)\/blob\/(.+?)\/(.+?)#L(\d+)[-~]?L?(\d*)/g);
  if (githubMatch) {
    for (const match of githubMatch) {
      returned.push(handleMatch(msg, match, "GitHub"));
    }
  }

  const gitlabMatch = msg.content.matchAll(/https?:\/\/gitlab\.com\/([a-zA-Z0-9-_]+\/[A-Za-z0-9_.-]+)\/-\/blob\/(.+?)\/(.+?)#L(\d+)-?(\d*)/g);
  if (gitlabMatch) {
    for (const match of gitlabMatch) {
      returned.push(handleMatch(msg, match, "GitLab"));
    }
  }

  const gistMatch = msg.content.matchAll(/https?:\/\/gist\.github\.com\/([a-zA-Z0-9-_]+\/[0-9a-zA-Z]+)\/?([0-9a-z]*)\/*#file-(.+?)-L(\d+)[-~]?L?(\d*)/g);
  if (gistMatch) {
    for (const match of gistMatch) {
      returned.push(handleMatch(msg, match, "Gist"));
    }
  }

  let msgList = await Promise.all(returned);
  msgList = msgList.filter((el) => el).map((el) => {
    totalLines += el[1];
    return el[0];
  });

  if (totalLines > 50) {
    return "Sorry, but to prevent spam, we limit the number of lines displayed at 50";
  }

  const botMsg = msgList.join("\n") || null;

  if (botMsg && botMsg.length >= 2000) {
    return "Sorry but there is a 2000 character limit on Discord, so we were unable to display the desired snippet";
  }
  if (botMsg) {
    msg.suppressEmbeds(true).catch(() => {});
    // make sure to suppress the embed
    setTimeout(() => msg.suppressEmbeds(true).catch(() => {}), 2000);

    if (analytics) {
      const bogusMsg = msg;
      bogusMsg.content = ";link"; // this is retarded, waiting for prismalytics to support command-less messages
      analytics.send(bogusMsg);
    }
  }

  return botMsg;
}

bot.on("ready", () => {
  bot.user.setActivity("for GitHub links", {
    type: "WATCHING"
  });
});

bot.on("message", async (msg) => {
  if (msg.author.bot) {
    return;
  }
  const botMsg = await handleMessage(msg);
  if (botMsg) {
    msg.channel.send(botMsg);
  }
});

bot.on("commandRun", (a, b, msg) => {
  if (analytics) analytics.send(msg);
});

bot.on("guildCreate", (guild) => {
  const joinEmbed = new DiscordBot.MessageEmbed()
    .setTitle("Thanks for adding me to your server! :heart:")
    .setDescription(
      "GitHub Lines runs automatically, without need for commands or configuration! " +
      "Just send a GitHub (or GitLab) link that mentions one or more lines and the bot will automatically respond.\n\n" +
      "There are a few commands you can use, although they are not necessary for the bot to work. To get a list, type `;help`\n\n" +
      "If you want to support us, just convince your friends to add the bot to their server!\n\n" +
      "Have fun!"
    );

  // If there is a system channel set, send message there
  // Otherwise, send it in the first available channel
  // SUGGESTION: look for a "general" channel before fallback
  if (guild.systemChannel && guild.me.permissionsIn(guild.systemChannel).has("SEND_MESSAGES")) {
    guild.systemChannel.send(joinEmbed);
    return;
  }

  let channel;
  guild.channels.cache.forEach((c) => {
    if (c[1].type === "text") {
      [channel] = c;
      return null;
    }
    return null;
  });
  channel.send(joinEmbed);
});

// exports for testing
exports.handleMessage = handleMessage;
exports.bot = bot;
