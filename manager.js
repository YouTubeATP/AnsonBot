// Initiating MusEmbed™ with Sharding

const Discord = require('discord.js');
const config = require("./config.json");
const bot = new Discord.Client();
const child_process = require('child_process')
const http = require ('http');
const express = require ('express');
const app = express();

const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./index.js', { token: config.token });
manager.spawn();
manager.on('launch', shard => console.log(`Musical Pal initiated. Commands can now be used.`));

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
  
bot.login(config.token);