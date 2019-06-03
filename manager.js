const Discord = require('discord.js');
const config = require("./config.json");
const bot = new Discord.Client();
const child_process = require('child_process')
const http = require ('http');
const httpProxy = require('http-proxy');
const express = require ('express');
const app = express();
const server = http.createServer(app);

const Manager = new Discord.ShardingManager('./index.js');
Manager.spawn(1);

httpProxy.createProxyServer({target:'http://localhost:9000'}).listen(process.env.PORT)

app.get('/', (req, res) => {
     console.log(Date.now() + " Ping Received");
      res.sendStatus(200);
});

app.listen(9000);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);