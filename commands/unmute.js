const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: "unmute",
  usage: "unmute [user] <reason>",
  description: "Unmutes a user in the guild.",
  run: async (bot, message, args, shared) => {
    
    if (!message.member.hasPermission("MANAGE_MESSAGES") || !message.member.hasPermission("ADMINISTRATOR")) {
      
      return message.reply("you don't have sufficient permissions!")
        .then(message.delete())
        .catch(console.error)
        
    }
    
    var mem = message.mentions.members.first();
    
    if (!mem) {
      var embed = new Discord.RichEmbed()
        .setColor("0x00bdf2")
        .setTitle("Please mention the user you want me to unmute.")
        .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)
      
      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
    }
    
    var muteRole = message.guild.roles.find(r => r.name === "Muted")
    var hasMuteRole = mem.roles.find(r => r.name === "Muted")
    
    function unmute(message, mem, muteRole, reason) {
      mem.removeRole(muteRole).then(() => {
        var embed = new Discord.RichEmbed()
          .setColor("0x00bdf2")
          .setAuthor(`${mem.user.tag} has been successfully unmuted!`, mem.user.avatarURL)
          .addField(`Unmuted by`, `${message.member.user.tag}`)
          .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)
        
            if (reason) embed.addField("Reason", reason)

        return message.channel.send(embed)
          .then(message.delete())
          .catch(console.error)
        
      }).catch(e => {
        var embed = new Discord.RichEmbed()
          .setColor("0x00bdf2")
          .setTitle(`I could not unmute ${mem.user.tag}.`)
          .addField("Error message", e)
          .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)

        return message.channel.send(embed)
          .then(message.delete())
          .catch(console.error)
      })
    }
    
    if (muteRole && hasMuteRole) {
      
      unmute(message, mem, muteRole)
      
    } else if (!muteRole) {
    
      var embed = new Discord.RichEmbed()
        .setColor("0x00bdf2")
        .setTitle(`There isn't even a role for people who're muted yet, duh!`)
        .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)

      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
    
    } else if (!hasMuteRole) {
      
      var embed = new Discord.RichEmbed()
        .setColor("0x00bdf2")
        .setTitle(`I can't exactly unmute someone who's not muted, duh!`)
        .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)

      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
      
    }
  }
}