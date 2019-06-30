const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: "kick",
  usage: "kick <user> [reason]",
  description: "Kicks a user from the guild.",
  requirements: "Kick Members",
  run: async (bot, message, args, shared) => {
    
    var reason = args.slice(1).join(" ")
    
    if (!message.member.hasPermission("KICK_MEMBERS")) {
      
      return message.reply("you don't have sufficient permissions!")
        .then(message.delete())
        .catch(console.error)
        
    };
    
    if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
      
      message.delete;
      return message.channel.send({embed: {
      color: 0x00bdf2,
      title: "I do not have sufficient permissions!",
      description:(`I cannot kick members in this guild, so I cannot carry out this command.`),
      footer: {
          icon_url: bot.user.avatarURL,
          text: "MusEmbed™ | Affiliated with Paraborg Discord Bots"
      }
  }})
      
    };
    
    var mem = message.mentions.members.first();
    
    if (!mem) {
      var embed = new Discord.RichEmbed()
        .setColor(0x00bdf2)
        .setTitle("Hmm... Who am I supposed to kick?")
        .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)
      
      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
    }
    
    if (mem.hasPermission("MANAGE_MESSAGES") || mem.hasPermission("BAN_MEMBERS") || mem.hasPermission("KICK_MEMBERS") || mem.hasPermission("ADMINISTRATOR")) {
      
      var embed = new Discord.RichEmbed()
        .setColor(0x00bdf2)
        .setTitle("Hmm... You are not supposed to kick another moderator!")
        .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)
      
      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
    }
    
    mem.kick(reason).then(() => {
      var embed = new Discord.RichEmbed()
        .setColor(0x00bdf2)
        .setAuthor(`${mem.user.tag} has been successfully kicked!`, mem.user.avatarURL)
        .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)

      if (reason) embed.addField("Reason", reason)

      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)

    }).catch(e => {
      shared.printError(message, e, `I couldn't kick ${mem.user.tag}!`)
    })
    
  }
}