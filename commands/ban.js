const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: "ban",
  usage: "ban <user> [reason]",
  description: "Ban users!",
  run: async (bot, message, args, shared) => {
    
    var reason = args.slice(1).join(" ")
    
    if (!message.member.hasPermission("BAN_MEMBERS")) {
      
      return message.reply("you don't have sufficient permissions!")
        .then(message.delete())
        .catch(console.error)
        
    }
    
    var mem = message.mentions.members.first();
    
    if (!mem) {
      var embed = new Discord.RichEmbed()
        .setColor("0x00bdf2")
        .setTitle("Please mention the user you want me to ban.")
        .setFooter("Bicentenator | A Ying Wa Parody", bot.user.avatarURL)
      
      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
    }
    
    if (mem.hasPermission("BAN_MEMBERS") || mem.hasPermission("KICK_MEMBERS")) {
      
      var embed = new Discord.RichEmbed()
        .setColor("0x00bdf2")
        .setTitle("This is a moderator, so I can't actually ban him.")
        .setFooter("Bicentenator | A Ying Wa Parody", bot.user.avatarURL)
      
      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
    }
    
    mem.ban(reason).then(() => {
      var embed = new Discord.RichEmbed()
        .setColor("0x00bdf2")
        .setAuthor(`${mem.user.tag} has been successfully banned!`, mem.user.avatarURL)
        .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)

      if (reason) embed.addField("Reason", reason)

      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)

    }).catch(e => {
      var embed = new Discord.RichEmbed()
        .setColor("0x00bdf2")
        .setTitle(`Hmm... I can't seem to ban ${mem.user.tag}!`)
        .addField("Error message", e)
        .setFooter("Bicentenator | A Ying Wa Parody", bot.user.avatarURL)

      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
    })
    
  }
}