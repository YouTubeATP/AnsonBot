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

app.use(express.static('public'));

app.get("/", function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
  console.log(Date.now() + " Ping Received");
});

const listener = app.listen(process.env.PORT, function() {
  setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 225000);
})

const DBL = require("dblapi.js");
const dbl = new DBL(config.dbltoken, { webhookAuth: 'NaKh26100225', webhookServer: listener }, bot);

dbl.webhook.on('ready', hook => {
  console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});

dbl.webhook.on('vote', vote => {
  console.log(`<@${vote.user}> just voted for <@414440610418786314>! Thanks a lot, we really appreciate it.`);
  bot.channels.get(`584591025616715786`).send({embed: {
            color: 0x00bdf2,
            title: "Vote Received",
            description: `<@${vote.user}> just voted for <@414440610418786314>! Thanks a lot, we really appreciate it.`,
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ | Affiliated with Paraborg Discord Bots"
            }
  }});
  bot.fetchUser(vote.user).then((user) => {
          user.send({embed: {
            color: 0x00bdf2,
            title: "Thanks for voting!",
            author: {
                name: `${vote.user.username}#${vote.user.discriminator}`,
                icon_url: vote.user.avatarURL
            },
            description:(`Vote again in 12 hours [here](https://vote.musembed.tk/).`),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ | Affiliated with Paraborg Discord Bots"
            }
  }})});
      return;
});
  

bot.login(config.token);