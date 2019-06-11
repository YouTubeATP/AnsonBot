const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: "kick",
  usage: "kick <user> [reason]",
  description: "Kick users!",
  run: async (bot, message, args, shared) => {
    
    var reason = args.slice(1).join(" ")
    
    if (!message.member.hasPermission("KICK_MEMBERS")) {
      
      return message.reply("you don't have sufficient permissions!")
        .then(message.delete())
        .catch(console.error)
        
    }
    
    var mem = message.mentions.members.first();
    
    if (!mem) {
      var embed = new Discord.RichEmbed()
        .setColor("0x00bdf2")
        .setTitle("Hmm... Who am I supposed to kick?")
        .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)
      
      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
    }
    
    if (mem.hasPermission("BAN_MEMBERS") || mem.hasPermission("KICK_MEMBERS")) {
      
      var embed = new Discord.RichEmbed()
        .setColor("0x00bdf2")
        .setTitle("Hmm... You are not supposed to kick another moderator!")
        .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)
      
      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
    }
    
    mem.kick(reason).then(() => {
      var embed = new Discord.RichEmbed()
        .setColor("0x00bdf2")
        .setAuthor(`${mem.user.tag} has been successfully kicked!`, mem.user.avatarURL)
        .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)

      if (reason) embed.addField("Reason", reason)

      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)

    }).catch(e => {
      var embed = new Discord.RichEmbed()
        .setColor("0x00bdf2")
        .setTitle(`Hmm... I can't seem to mute ${mem.user.tag}!`)
        .addField("Error message", e)
        .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)

      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
    })
    
  }
}