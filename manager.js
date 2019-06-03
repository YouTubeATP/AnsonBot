const Discord = require('discord.js');
const config = require("./config.json");
const bot = new Discord.Client();
const http = require ('http');
const httpProxy = require('http-proxy');
const express = require ('express');
const app = express();
const server = http.createServer(app);

const Manager = new Discord.ShardingManager('./index.js');
Manager.spawn(1);

httpProxy.createProxyServer({target:'http://localhost:9000'}).listen(3000);

http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(9000);