const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "embed",
	usage: "embed [color] <message>",
	description: "Embeds your message.",
	run: async (bot, message, args, shared) => {
    
    function sayEmbed(message, args) {
      var color = args.shift()
      var content = message.content.slice(shared.prefix.length + 12).trim()
      var rawcontent = message.content.slice(shared.prefix.length + 5).trim()

      if ( color.length == 6 &&
        ( (color[0] >= "0" && color[0] <= "9") || (color[0] >= "a" && color[0] <= "f") || (color[0] >= "A" && color[0] <= "F") ) &&
        ( (color[1] >= "0" && color[1] <= "9") || (color[1] >= "a" && color[1] <= "f") || (color[1] >= "A" && color[1] <= "F") )&&
        ( (color[2] >= "0" && color[2] <= "9") || (color[2] >= "a" && color[2] <= "f") || (color[2] >= "A" && color[2] <= "F") ) &&
        ( (color[3] >= "0" && color[3] <= "9") || (color[3] >= "a" && color[3] <= "f") || (color[3] >= "A" && color[3] <= "F") ) &&
        ( (color[4] >= "0" && color[4] <= "9") || (color[4] >= "a" && color[4] <= "f") || (color[4] >= "A" && color[4] <= "F") ) &&
        ( (color[5] >= "0" && color[5] <= "9") || (color[5] >= "a" && color[5] <= "f") || (color[5] >= "A" && color[5] <= "F") ) ) {

        color = parseInt(`0x${color}`)
        var embed = new Discord.RichEmbed()
          .setAuthor(message.author.tag, message.author.avatarURL)
          .setColor(color)
          .setDescription(content)
          .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
        message.channel.send(embed)
          .then(message.delete())
          .catch(e => {
            shared.printError(message, e, `I couldn't make your embed!`)
          })

      } else {
        var embed = new Discord.RichEmbed()
          .setAuthor(message.author.tag, message.author.avatarURL)
          .setDescription(rawcontent)
          .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
        message.channel.send(embed)
          .then(message.delete())
          .catch(e => {
            shared.printError(message, e, `I couldn't make your embed!`)
          })
      }
    }


    if (shared.censor === "on") {

      for (i = 0; i < shared.bannedwords.length; i++) {
        if (message.content.toLowerCase().includes(shared.bannedwords[i])) {
          message.delete().catch(O_o=>{});
          message.reply("please refrain from using such contemptable words.");
          return;
        }
      }

      sayEmbed(message, args)

    } else {

      sayEmbed(message, args)

    }
    
	}
}