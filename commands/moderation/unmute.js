const index = require('app/index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: "unmute",
  usage: "unmute <user> [reason]",
  description: "Unmutes a user in the guild.",
  requirements: "Kick Members",
  run: async (bot, message, args, shared) => {
    
    if (!message.member.hasPermission("MANAGE_ROLES")) {
      
      return message.reply("you don't have sufficient permissions!")
        .then(message.delete())
        .catch(console.error)
        
    };
    
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
      
      message.delete();
      return message.channel.send({embed: {
      color: 0x00bdf2,
      title: "I do not have sufficient permissions!",
      description:(`I cannot manage roles in this guild, so I cannot carry out this command.`),
      footer: {
          icon_url: bot.user.avatarURL,
          text: "MusEmbed™ | Affiliated with Paraborg Discord Bots"
      }
  }})
      
    };
    
    var mem = message.mentions.members.first()
    
    if (!mem) {
      var embed = new Discord.RichEmbed()
        .setColor(0x00bdf2)
        .setTitle("Please mention the user you want me to unmute.")
        .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
      
      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
    }
    
    var muteRole = await message.guild.roles.find(r => r.name.toLowerCase().startsWith("mute"))
    var hasMuteRole = await mem.roles.has(muteRole.id)
    
    if (muteRole && hasMuteRole) {
      
      mem.removeRole(muteRole).then(() => {
        var embed = new Discord.RichEmbed()
          .setColor(0x00bdf2)
          .setAuthor(`${mem.user.tag} has been successfully unmuted!`, mem.user.avatarURL)
          .addField(`Unmuted by`, `${message.member.user.tag}`)
          .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)

        return message.channel.send(embed)
          .then(message.delete())
          .catch(console.error)
      }).catch(e => {
        shared.printError(message, e, `I could not unmute ${mem.user.tag}!`)
      })
      
    } else if (!muteRole) {
    
      var embed = new Discord.RichEmbed()
        .setColor(0x00bdf2)
        .setTitle(`There isn't even a role for people who're muted yet, duh!`)
        .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)

      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
    
    } else if (!hasMuteRole) {
      
      var embed = new Discord.RichEmbed()
        .setColor("0x00bdf2")
        .setTitle(`I can't exactly unmute someone who's not muted, duh!`)
        .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)

      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
      
    }
  }
}