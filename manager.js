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