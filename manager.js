const Discord = require('discord.js');
const bot = new Discord.Client();
const Manager = new Discord.ShardingManager('./index.js');
Manager.spawn(1);