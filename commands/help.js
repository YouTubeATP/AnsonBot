const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');
const Enmap = require('enmap');

module.exports = {
	name: "help",
	usage: "help [command]",
	description: "Shows help message.",
	run: async (bot, message, args, shared) => {
    
    const commands = bot.commands
    
    const defaultSettings = {   
        prefix: "em/",    
        censor: "off"
    }
    
    const guildConf = bot.settings.ensure(message.guild.id, defaultSettings)
    
    if (args.length == 0) {
      
      var embed = new Discord.RichEmbed()
        .setColor(0x00bdf2)
        .setTitle("MusEmbed™'s' Help Message")
        .addField("Prefix", `The prefix for this server is \`${guildConf.prefix}\`. You may also mention me (<@414440610418786314>) as a prefix. `)
        .addField("Description", "This is a bot that can help you easily create embeds in your server. We also have music playing functionality.")
        .addField("General Commands", "`help`: Shows this help message.\n`botinfo`: Retrieves information about the bot.\n`serverinfo`: Retrieves information about the server.\n`ping`: Shows latency of the bot and the API.\n`links`: Shows all our links.\n`suggestion`: Submits a suggestion to MusEmbed's support server.")
        .addField("Embed Commands", "`embed`: Embeds your message.\n`rawembed`: Embeds your message without showing your name.")
        .addField("Music Commands", "`play`: Searches for the song you requested.\n`pause`: Pauses the current song.\n`resume`: Resumes a paused song.\n`skip`: Votes to skip the playing song.\n`np`: Shows the name of the currently playing song.\n`volume`: Shows or changes volume to the provided number.\n`queue`: Shows the current queue of songs.\n`loop`: Toggles loop.\n`stop`: Stops all music.")
        .addField("Moderation Commands", "`kick`: Kicks a user from the guild.\n`ban`: Bans a user from the guild.\n`purge`: Deletes a number of messages in a channel.\n`mute`: Mutes a user in the guild.\n`unmute`: Unmutes a user in the guild.")
        .addField("Server Configuration Commands", "`showconf`: Shows the configurations of the server.\n`setconf`: Sets new value for the server's configuration.")
        .addField("Detailed Help", `\nYou can do \`${guildConf.prefix}help [command]\` to get detailed information on how to use the specified command.`)
        .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
      
      message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
      
    } else if (args.length == 1) {
      
      const name = args[0].toLowerCase();
      
      if ((name == "eval" || name == "changelog" || name == "restart" || name == "reload" || name == "reboot") && message.author.id != "336389636878368770" && message.author.id != "344335337889464357") return;
      
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

			if (!command) {
				return message.reply('that\'s not a valid command!');
			}

			var embed = new Discord.RichEmbed()
        .setColor(0x42b3f4)
        .setAuthor(`${guildConf.prefix}${command.name}`, bot.user.avatarURL)
        .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)

			if (command.aliases) embed.addField(`Aliases`, "`" + command.aliases.join('`, `') + "`")
			if (command.description) embed.addField(`Description`, command.description)
			if (command.usage) embed.addField(`Usage`,`\`${command.usage}\``)
			if (command.requirements) embed.addField(`Requirements`,`${command.requirements}`)

			message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
      
    } else {
      shared.printError(message, "Too many arguments", "You inputted too many arguments!")
    }
    
    
	}
}