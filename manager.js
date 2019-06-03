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
  proxy.web(req, res, { target: 'http://127.0.0.1:9000' });
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

