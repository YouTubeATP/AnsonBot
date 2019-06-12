const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');
const Enmap = require('enmap')

module.exports = {
  name: "showconf",
  usage: "showconf",
  description: "Shows the server's configurations.",
  aliases: ["showconfig"],
  run: async (bot, message, args, shared) => {

    const defaultSettings = {   
        prefix: "em/",    
        censor: "off"
    }
    
    const guildConf = bot.settings.ensure(message.guild.id, defaultSettings)
    
    var embed = new Discord.RichEmbed()
      .setColor(0x00bdf2)
      .setTitle("Server Configurations")
      .setDescription("The following are this server's current configurations.")
      .addField("Prefix", guildConf.prefix, true)
      .addField("Censor", guildConf.censor, true)
      .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
    
    message.channel.send(embed)
      .then(message.delete())
      .catch(e => {
        // shared.printError(message, e, `I couldn't fetch this server's configurations!`, true)
      })
    
  }
}