const Discord = require('discord.js');
const config = require("./config.json");
const bot = new Discord.Client();
const DBL = require("dblapi.js");
const http = require ('http');
const express = require ('express');
const app = express();

const server = http.createServer(app);
const dbl = new DBL(config.dbltoken, { webhookPort: process.env.PORT, webhookAuth: 'NaKh26100225', webhookPath: '/dblwebhook', webhookserver: server }, bot);

const Manager = new Discord.ShardingManager('./index.js');
Manager.spawn(1);

app.get('/', (req, res) => {
      // ...
});

dbl.on('posted', () => {
  console.log('Server count posted!');
});

dbl.on('error', e => {
 console.log(`Oops! ${e}`);
});

dbl.webhook.on('ready', hook => {
  console.log(`Webhook running at https://${hook.hostname}:${hook.port}${hook.path}`);
});

dbl.webhook.on('vote', vote => {
  console.log(`User with ID ${vote.user} just voted!`);
  bot.channels.get(`584591025616715786`).send({embed: {
            color: 0x00bdf2,
            title: "Vote Received",
            description: `@${vote.user} has just voted for us [here](https://vote.musembed.tk/). Thanks a lot!`,
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ | Affiliated with Paraborg Discord Bots"
            }
  }});
});

bot.login(config.token);