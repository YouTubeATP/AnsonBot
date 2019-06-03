const Discord = require('discord.js');
const config = require("./config.json");
const bot = new Discord.Client();
const child_process = require('child_process')
const http = require ('http');
const httpProxy = require('http-proxy');
const express = require ('express');
const app = express();

const Manager = new Discord.ShardingManager('./index.js');
Manager.spawn(1);

var proxy = httpProxy.createProxyServer({});
var server = http.createServer(function(req, res) {
  proxy.web(req, res, { target: 'http://127.0.0.1:9000', forward: 'http://127.0.0.1:5000' });
});

console.log(`Listening on port ${process.env.PORT}`)
server.listen(process.env.PORT);

app.get('/', (req, res) => {
     console.log(Date.now() + " Ping Received");
      res.sendStatus(200);
});

app.listen(9000);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const DBL = require("dblapi.js");
const dbl = new DBL(config.dbltoken, { webhookPort: 5000, webhookAuth: 'NaKh26100225', webhookPath: '/dblwebhook' }, bot);

dbl.webhook.on('ready', hook => {
  console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});

dbl.webhook.on('vote', vote => {
  console.log(`@${vote.user} just voted for <@414440610418786314>! Thanks a lot, we really appreciate it.`);
  bot.channels.get(`584591025616715786`).send({embed: {
            color: 0x00bdf2,
            title: "Vote Received",
            description: `@${vote.user} just voted for <@414440610418786314>! Thanks a lot, we really appreciate it.`,
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ | Affiliated with Paraborg Discord Bots"
            }
  }});
});

bot.login(config.token);