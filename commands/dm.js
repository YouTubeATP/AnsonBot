const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');
const { owners } = require('../config.json');

module.exports = {
  name: "dm",
  usage: "dm <userID> <message>",
  description: "Sends a user a message.",
  requirements: "Ban Members",
  run: async (bot, message, args, shared) => {
    if (!args[0] || !args[1]) return message.reply(" provide a user and message to send!");
    if (!owners.includes(message.author.id)) return message.reply(' you aren\'t one of my developers!');
    
    const target = bot.users.get(args[0]) || message.mentions.users.first();
    if (!target) return message.reply(' you didnt give me a user, are you sure it\'s correct?');
    target.send(args.slice(1).join(' '));
    message.delete()
    message.reply(' message has been sent ;('); // looks better with space. ok :)
  }
}; 