const Discord = require('discord.js');
const bot = new Discord.Client();
const Manager = new Discord.ShardingManager('./index.js');
Manager.spawn(1);

const http = require('http');
const express = require('express');
const app = express();

app.use(express.static('public'));

app.get("/", function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
  console.log(Date.now() + " Ping Received");
});

const listener = app.listen(process.env.PORT, function() {
  setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
})