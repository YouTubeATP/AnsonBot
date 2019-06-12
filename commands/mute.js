const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "mute",
	usage: "mute <user> [reason]",
	description: "Mutes a user in the guild.",
	run: async (bot, message, args, shared) => {
      
    var reason = args.slice(1).join(" ")
    
    console.log(1)
    
    if (!message.member.hasPermission("MANAGE_MESSAGES") || !message.member.hasPermission("ADMINISTRATOR")) {
      
      return message.reply("you don't have sufficient permissions!")
        .then(message.delete())
        .catch(console.error)
        
    }
    
    console.log(2)
    
    var mem = message.mentions.members.first();
    
    console.log(3)
    
    if (!mem) {
      var embed = new Discord.RichEmbed()
        .setColor(0x00bdf2)
        .setTitle("Please mention the user you want me to mute.")
        .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)
      
      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
    }
    
    console.log(4)
    
    if (mem.hasPermission("MANAGE_MESSAGES") || mem.hasPermission("ADMINISTRATOR")) {
      // actually mutes should require kick perms
      var embed = new Discord.RichEmbed()
        .setColor(0x00bdf2)
        .setTitle("This is a moderator, so I can't actually mute him.")
        .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)
      
      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
    }
    
    console.log(5)
    
    function mute(message, mem, muteRole, reason) {
      mem.addRole(muteRole, reason).then(() => {
        var embed = new Discord.RichEmbed()
          .setColor(0x00bdf2)
          .setAuthor(`${mem.user.tag} has been successfully muted!`, mem.user.avatarURL)
          .addField("Muted by", `${message.author.tag}`)
          .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)
        
        if (reason) embed.addField("Reason", reason)

        return message.channel.send(embed)
          .then(message.delete())
          .catch(console.error)
        
      })
      .catch(e => {
        shared.printError(message, e, `I could not mute ${mem.user.tag}!`)
      })
    }
    
    console.log(6)
    
    var muteRole = await message.guild.roles.find(r => r.name.toLowerCase().startsWith("mute"))
    console.log(mem.roles.has(muteRole))
    var hasMuteRole = await mem.roles.has(muteRole)
    console.log(6.2)
    
    console.log(7)
    
    if (muteRole && !hasMuteRole) {
      
      mute(message, mem, muteRole, reason)
      
      console.log(8)
      
    } else if (hasMuteRole) {
      var embed = new Discord.RichEmbed()
        .setColor("0x00bdf2")
        .setTitle(`${mem.user.tag} is already muted!`)
        .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)

      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
    } else {
      message.guild.createRole({name: 'Muted', color: 0xa8a8a8}, `I was told to mute someone when there is no mute role!`)
        .then((role) => {
          var embed = new Discord.RichEmbed()
            .setColor("0x00bdf2")
            .setDescription(`Since a mute role was not present, I went ahead and made one for you.`)
            .addField("Role", `<@&${role.id}>`)
            .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)

          message.channel.send(embed)
        
          mute(message, mem, role, reason)
        })
        .catch(e => {
          shared.printError(message, e, `I could not mute ${mem.user.tag} because there is no mute role and I could not make one.`)
        })
      
    }
	}
}