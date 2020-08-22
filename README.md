[![inviteme](https://img.shields.io/static/v1?style=flat&logo=discord&logoColor=FFF&label=&message=invite%20me&color=7289DA)](https://top.gg/bot/708282735227174922)
[![Up Status](https://top.gg/api/widget/status/708282735227174922.svg)](https://top.gg/bot/708282735227174922)
[![Servers](https://top.gg/api/widget/servers/708282735227174922.svg)](https://top.gg/bot/708282735227174922)
[![TravisCI](https://travis-ci.com/diogoscf/github-lines.svg?branch=master)](https://travis-ci.com/diogoscf/github-lines)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/baf4e71f649147189e973c38fd5cd425)](https://app.codacy.com/manual/diogoscf/github-lines?utm_source=github.com&utm_medium=referral&utm_content=diogoscf/github-lines&utm_campaign=Badge_Grade_Dashboard)

# GitHub Lines

GitHub Lines is a minimal and non-intrusive Discord bot that displays one or more lines when mentioned in a GitHub (or GitLab) link.
It also supports syntax highlighting!

Example:

![Github Lines Example](https://github.com/diogoscf/github-lines/raw/master/assets/github-lines-example.PNG)

You can add the bot to your server by clicking [this link](https://discord.com/api/oauth2/authorize?client_id=708282735227174922&permissions=26688&scope=bot)

## Commands

GitHub Lines has a few commands that you can use, although no commands are necessary to display the lines. The prefix for the commands is ";"

 1. `;help` - Returns a list of commands
 2. `;about` or `;stats` - Returns some info about the bot
 3. `;invite`, `;vote` or `;topgg` - Returns the link for the bot's top.gg page, from where you can invite the bot to your server
 4. `;botsgg` - Returns the link for the bot's discord.bots.gg page, from where you can invite the bot to your server
 5. `;ping` - Returns the bot's latency
 6. `;github` or `;source` - Returns the bot's source GitHub repo

## Running your own

To run the bot yourself, follow these simple steps:

 1. Clone the repo (`git clone https://github.com/diogoscf/github-lines.git`)
 2. Copy `.env.example` into `.env` and paste your Discord bot token (obtain one [here](https://discord.com/developers/applications/)) after `DISCORD_TOKEN=`
 3. Run `npm install`
 4. Run `npm start`

If you wish to, you may also specify a [top.gg](https://top.gg/) token (after `TOPGG=`in the `.env` file), and/or a [Prismalytics](https://prismalytics.herokuapp.com) token (after `PRISMA_TOKEN=`in the `.env` file). You can also specify a GitHub OAuth token (after `GITHUB_TOKEN=`in the `.env` file) to avoid rate limits when accessing the API.

## Contributing

We'd happily accept any contributions to this project. Open an issue if you have any ideas, or open a PR if you want to contribute directly

### Contributors

- Diogo S.C. Fernandes [@diogoscf](https://github.com/diogoscf/) - Creator
- Aadi Bajpai [@aadibajpai](https://github.com/aadibajpai/) - Idea for the bot
