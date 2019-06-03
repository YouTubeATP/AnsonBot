const Discord = require('discord.js');
const config = require("./config.json");
const bot = new Discord.Client();
const http = require ('http');
const express = require ('express');
const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
     console.log(Date.now() + " Ping Received");
      res.sendStatus(200);
});

app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);