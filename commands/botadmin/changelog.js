const index = require('app/index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "changelog",
	usage: "changelog <version> <updates>",
	description: "Send changelog message.",
  requirements: "**Bot Administrator**",
	run: async (bot, message, args, shared) => {
    const msg = message, client = bot
    
    if (message.author.id != "336389636878368770" && message.author.id != "344335337889464357") return;

		var version = args[0]
    var content = message.content.slice(shared.prefix.length + 10 + args[0].length).trim()
    
    var embed = new Discord.RichEmbed()
      .setTitle(`Changelog for MusEmbed™ V${version}`)
      .setDescription(content)
      .setColor(0x00bdf2)
      .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
    
    message.channel.send(embed)
      .then(message.delete())
      .catch(console.error)
    
	}
}