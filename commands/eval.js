const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "eval",
	usage: "eval <code>",
	description: "Evaluate JavaScript code!",
	run: async (bot, message, args, shared) => {
    
    if (message.author.id != "336389636878368770" && !message.author.id == "344335337889464357") return;

		try {
			var out = eval(args.join(' '))
			// out = JSON.stringify(out)
      
      var embed = new Discord.RichEmbed()
        .setColor("GREEN")
        .setAuthor(message.author.tag, message.author.avatarURL)
        .addField(`Evaluation Success!`, '```js\n'+out+'```')
        .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
			message.channel.send(embed)
		} catch (e) {
      var embed = new Discord.RichEmbed()
        .setColor("RED")
        .setAuthor(message.author.tag, message.author.avatarURL)
        .addField(`Evaluation Failed!`, '```js\n'+e+'```')
        .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
			message.channel.send(embed)
		}
    
	}
}