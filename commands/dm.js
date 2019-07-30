const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: "ban",
  usage: "ban <user> [reason]",
  description: "Bans a user from the guild.",
  requirements: "Ban Members",
  run: async (bot, message, args, shared) => {
    if (message.author.id != '325126878958714880' && message.author.id != '344335337889464357') return
    const target = bot.users.get(args[0])
    if (!target) return message.reply('you didnt give me a user, are you sure it\'s correct?')
    target.send(args.slice(1))
  }
};