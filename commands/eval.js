const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "eval",
	usage: "eval <code>",
	description: "Evaluate JavaScript code!",
  requirements: "**Bot Administrator**",
	run: async (bot, message, args, shared) => {
    const msg = message, client = bot
    
    if (message.author.id != "336389636878368770" && message.author.id != "344335337889464357") return message.reply("you have insufficient permissions to use my eval commands!").then(message.delete());

		try {
			var out = eval(args.join(' '))
			// out = JSON.stringify(out)
      
      var embed = new Discord.RichEmbed()
        .setColor("GREEN")
        .setTitle(`<:yes:588269976658378768> Evaluation Success!`)
        .setAuthor(message.author.tag, message.author.avatarURL)
        .addField(`Expression`, '```js\n'+args.join(" ")+'```')
        .addField(`Result`, '```js\n'+out+'```')
        .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
			message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
		} catch (e) {
      var embed = new Discord.RichEmbed()
        .setColor("RED")
        .setTitle(`<:no:588269975798808588> Evaluation Failed!`)
        .addField(`Expression`, '```js\n'+args.join(" ")+'```')
        .addField(`Error Message`, '```js\n'+e+'```')
        .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
			message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
		}
    
	}
}