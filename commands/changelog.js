const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "changelog",
	usage: "changelog <message>",
	description: "Evaluate JavaScript code!",
  requirements: "**Bot Administrator**",
	run: async (bot, message, args, shared) => {
    const msg = message, client = bot
    
    if (message.author.id != "336389636878368770" && message.author.id != "344335337889464357") return;

		var version = args[0]
    var content = message.content.slice(shared.prefix.length + 10 + args[0].length).trim()
    
    var embed = new Discord.RichEmbed()
      .setTitle(`Cha
    
	}
}