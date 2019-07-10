const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: "links",
  usage: "links",
  description: "Shows all of MusEmbed's links",
  aliases: ["link", "vote", "invite", "support", "status"],
  run: async (bot, message, args, shared) => {
    
    var embed = new Discord.RichEmbed()
      .setColor(0x00bdf2)
      .setTitle("Links")
      .setDescription("[MusEmbed's Website](https://www.musembed.tk) \n[Vote for MusEmbed](https://vote.musembed.tk) \n[Join MusEmbed Support](https://invite.gg/musembed) \n[Invite MusEmbed](https://invite.musembed.tk) \n[MusEmbed's Status](https://status.musembed.tk)")
      .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
    
    return message.channel.send(embed)
      .then(message.delete())
      .catch(e => {
        shared.printError(message, e, `I couldn't fetch you the links!`)
      })
      
  }
}