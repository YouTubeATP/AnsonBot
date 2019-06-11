const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: "unmute",
  usage: "unmute <user> [reason]",
  description: "ADMIN ONLY: Say out messages in embeds, without your names!",
  run: async (bot, message, args, sha0x00bdf2) => {
    
    if (!message.member.hasPermission("KICK_MEMBERS")) {
      
      return message.reply("you don't have sufficient permissions!")
        .then(message.delete())
        .catch(console.error)
        
    }
    
    var mem = message.mentions.members.first();
    
    if (!mem) {
      var embed = new Discord.RichEmbed()
        .setColor("0x00bdf2")
        .setTitle("Hmm... Who am I supposed to mute?")
        .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)
      
      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
    }
    
    var muteRole = message.guild.roles.find(r => r.name.toLowerCase().startsWith("mute"))
    
    function unmute(message, mem, muteRole) {
      mem.removeRole(muteRole).then(() => {
        var embed = new Discord.RichEmbed()
          .setColor("0x00bdf2")
          .setAuthor(`${mem.user.tag} has been successfully unmuted!`, mem.user.avatarURL)
          .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)

        return message.channel.send(embed)
          .then(message.delete())
          .catch(console.error)
        
      }).catch(e => {
        var embed = new Discord.RichEmbed()
          .setColor("0x00bdf2")
          .setTitle(`Hmm... I can't seem to unmute ${mem.user.tag}!`)
          .addField("Error message", e)
          .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)

        return message.channel.send(embed)
          .then(message.delete())
          .catch(console.error)
      })
    }
    
    if (muteRole && mem.roles.has(muteRole)) {
      unmute(message, mem, muteRole)
    } else if (!mem.roles.has(muteRole)) {
      var embed = new Discord.RichEmbed()
        .setColor("0x00bdf2")
        .setTitle(`How do I unmute someone who is not muted?`)
        .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)

      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
    } else {
      var embed = new Discord.RichEmbed()
        .setColor("0x00bdf2")
        .setTitle(`There isn't even a Mute role yet!`)
        .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)

      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
    }
  }
}