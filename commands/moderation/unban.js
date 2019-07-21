const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: "unban",
  usage: "unban <user id> [reason]",
  description: "Unbans a banned user in the guild.",
  requirements: "Ban Members",
  run: async (bot, message, args, shared) => {
    
    var reason = args.slice(1).join(" ")
    
    if (!message.member.hasPermission("BAN_MEMBERS")) {
      
      return message.reply("you don't have sufficient permissions!")
        .then(message.delete())
        .catch(console.error)
        
    };
    
    if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
      
      message.delete();
      return message.channel.send({embed: {
      color: 0x00bdf2,
      title: "I do not have sufficient permissions!",
      description:(`I cannot ban or unban members in this guild, so I cannot carry out this command.`),
      footer: {
          icon_url: bot.user.avatarURL,
          text: "MusEmbed™ | Clean Embeds, Crisp Music"
      }
  }})
      
    };
    
    var mem = message.content.slice(shared.prefix.length + 6).trim()
    
    if (!mem) {
      var embed = new Discord.RichEmbed()
        .setColor(0x00bdf2)
        .setTitle("Hmm... Who am I supposed to unban?")
        .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
      
      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
    }
    
    message.guild.unban(mem).then(() => {
      var embed = new Discord.RichEmbed()
        .setColor(0x00bdf2)
        .setDescription(`<@${mem}> has been successfully unbanned!`)
        .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)

      if (reason) embed.addField("Reason", reason)

      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)

    }).catch(e => {
      shared.printError(message, e, `I couldn't unban this user! Check if the value you provided was a valid user ID.`)
    })
    
  }
}