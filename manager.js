const Discord = require('discord.js');
const bot = new Discord.Client();
const Manager = new Discord.ShardingManager('./index.js');
Manager.spawn(2);

const http = require('http');
const express = require('express');
const app = express();

app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});

app.use(express.static('public'))

const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
  setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 10000);
})