const Discord = require('discord.js');
const config = require("./config.json");
const bot = new Discord.Client();
const child_process = require('child_process')
const http = require ('http');
const httpProxy = require('http-proxy');
const express = require ('express');
const app = express();

const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./index.js', { token: config.token });
manager.spawn();
manager.on('launch', shard => console.log(`MusEmbed™ shard ${shard.id} initiated. Commands can now be used.`));

app.use(express.static('public'));

app.get("/", function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
  console.log(Date.now() + " Ping Received");
});

const listener = app.listen(process.env.PORT, function() {
  setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 225000);
});

const DBL = require("dblapi.js");
const dbl = new DBL(config.dbltoken, { webhookAuth: 'NaKh26100225', webhookServer: listener }, bot);

dbl.webhook.on('ready', hook => {
  console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});

dbl.webhook.on('vote', vote => {
  console.log(`Vote Received`);
  bot.channels.get(`585811949963444244`).send({embed: {
    color: 0x00bdf2,
    title: "Vote Received",
    description: `<@${vote.user}> just voted for <@414440610418786314>! We really appreciate it. Vote [here](https://vote.musembed.tk) every 12 hours. Voting perks are coming soon!`,
    footer: {
        icon_url: bot.user.avatarURL,
        text: "MusEmbed™ | Affiliated with Paraborg Discord Bots"
    }
  }});
  bot.fetchUser(vote.user).then((user) => {
    user.send({embed: {
      color: 0x00bdf2,
      title: "Thanks for voting!",
      description:(`Vote again in 12 hours [here](https://vote.musembed.tk/). Perks for voting are coming soon!`),
      footer: {
          icon_url: bot.user.avatarURL,
          text: "MusEmbed™ | Affiliated with Paraborg Discord Bots"
      }
  }})});
      return;
});
  
bot.login(config.token);