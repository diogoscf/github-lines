process.env.NTBA_FIX_319 = 1;
require("dotenv").config();

const fetch = require("node-fetch");
const ogscraper = require("open-graph-scraper");

const DiscordBot = require("discord.js");
const { TOKEN } = process.env;
const bot = new DiscordBot.Client();
bot.login(TOKEN);

bot.on("message", async (msg) => {

  // prevent replying to own messages
  if (msg.author.id == bot.user.id) {
    return;
  };

  const githubMatch = msg.content.match(/https?:\/\/github.com\/([a-zA-Z0-9-_]+\/[A-Za-z0-9_.-]+)\/blob\/(.+)\.(\w+)#L(\d+)-?L?(\d*)/i);
  if (!githubMatch) return;

  const resp = await fetch(`https://raw.githubusercontent.com/${githubMatch[1]}/${githubMatch[2]}.${githubMatch[3]}`);
  const text = await resp.text();
  const lines = text.split("\n");
  let toDisplay;
  console.log(githubMatch)
  if (!githubMatch[5].length) {
    toDisplay = lines[parseInt(githubMatch[4], 10) - 1].trim();
  } else {
    toDisplay = lines.slice(parseInt(githubMatch[4], 10) - 1, parseInt(githubMatch[5], 10)).join("\n");
  };

  const ogData = await ogscraper({
    url: githubMatch[0]
  })

  msg.suppressEmbeds();
  msg.channel.send(`\`\`\`${githubMatch[3]}\n${toDisplay}\`\`\``);

})
