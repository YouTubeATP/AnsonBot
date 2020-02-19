// bot initiation with sharding

const Discord = require("discord.js");
const bot = new Discord.Client();
const child_process = require("child_process");
const http = require("http");
const express = require("express");
const app = express();

const { ShardingManager } = require("discord.js");

const manager = new ShardingManager("./index.js", {
  token: process.env.DISCORD_BOT_TOKEN
});
manager.spawn();
manager.on("launch", shard =>
  console.log(
    `Shard ${shard.id} initiated.`
  )
);

app.use(express.static("public"));

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
  console.log(Date.now() + " Ping Received");
});

const listener = app.listen(process.env.PORT, function() {
  setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
  }, 225000);
});
