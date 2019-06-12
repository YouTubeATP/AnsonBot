const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "eval",
	usage: "eval <code>",
	description: "Evaluate JavaScript code!",
	run: async (bot, msg, args, shared) => {
    
    if (msg.author.id != "336389636878368770" && !msg.author.id == "344335337889464357") return;

		try {
			var out = eval(args.join(' '))
			out = JSON.stringify(out)
      
      var embed = new Discord.RichEmbed
        .setAuthor(msg.author.tag, msg.author.avatarURL)
        .addField(`Evaluation Success!`, '```'+out+'```')
        .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
			msg.channel.send(embed)
		} catch (e) {
			e = JSON.stringify(e)
      
      var embed = new Discord.RichEmbed
        .setAuthor(msg.author.tag, msg.author.avatarURL)
        .addField(`Evaluation Failed!`, '```'+e+'```')
        .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
			msg.channel.send(embed)
		}
    
	}
}