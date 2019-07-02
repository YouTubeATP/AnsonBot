const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require("./config.json");
const fs = require('fs');
const moment = require('moment'); // the moment package. to make this work u need to run "npm install moment --save 
const http = require ('http');
const express = require ('express');
const app = express();
const server = http.createServer(app);
const prefix = 'em/' // The text before commands
const ms = require("ms"); // npm install ms -s
const ytdl = require("ytdl-core");
const opus = require("node-opus");
const YouTube = require("simple-youtube-api");
const Enmap = require('enmap');
const mutedSet = new Set();
const queue = new Map();
const youtube = new YouTube(config.youtube)

const RC = require('reaction-core')
const handler = new RC.Handler()

bot.on("ready", () =>  {bot.user.setStatus('available')});

bot.on('messageReactionAdd', (messageReaction, user) => handler.handle(messageReaction, user));

bot.on('message', async message => {
  
  return;
  
});

module.exports.connection = message.guild.voiceConnection

bot.login('NTYwNzkwNTczMzY4MjEzNTA0.XRsktQ.9_P9SXXkOVba4h6dbQWrl59rIBI');