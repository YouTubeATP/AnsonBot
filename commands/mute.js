const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "mute",
	usage: "mute [user] ([reason])",
	description: "Mutes a user in the guild.",
	run: async (bot, message, args, shared) => {
      
    if (message.isMemberMentioned(bot.user)) {
      message.delete().catch(O_o=>{});
      return message.reply (`this command is only available when using this server's prefix, \`${index.prefix}.\``)
    }
      
    var reason = args.slice(1).join(" ")
    
    if (!message.member.hasPermission("MANAGE_MESSAGES") || !message.member.hasPermission("ADMINISTRATOR")) {
      
      return message.reply("you don't have sufficient permissions!")
        .then(message.delete())
        .catch(console.error)
        
    }
    
    var mem = message.mentions.members.first();
    
    if (!mem) {
      var embed = new Discord.RichEmbed()
        .setColor("0x00bdf2")
        .setTitle("Please mention the user you want me to mute.")
        .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)
      
      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
    }
    
    if (mem.hasPermission("MANAGE_MESSAGES") || mem.hasPermission("ADMINISTRATOR")) {
      // actually mutes should require kick perms
      var embed = new Discord.RichEmbed()
        .setColor("0x00bdf2")
        .setTitle("This is a moderator, so I can't actually mute him.")
        .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)
      
      return message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
    }
    
    var muteRole = message.guild.roles.find(r => r.name.toLowerCase().startsWith("mute"))
    
    function mute(message, mem, muteRole, reason) {
      mem.addRole(muteRole, reason).then(() => {
        var embed = new Discord.RichEmbed()
          .setColor("0x00bdf2")
          .setAuthor(`${mem.user.tag} has been successfully muted!`, mem.user.avatarURL)
          .addField(`Muted by ${mem.user.tag}`)
          .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)
        
        if (reason) embed.addField("Reason", reason)

        return message.channel.send(embed)
          .then(message.delete())
          .catch(console.error)
        
      }).catch(e => {
        var embed = new Discord.RichEmbed()
          .setColor("0x00bdf2")
          .setTitle(`I could not mute ${mem.user.tag}.`)
          .addField("Error:", e)
          .setFooter("MusEmbed | Clean Embeds, Crisp Music", bot.user.avatarURL)

        return message.channel.send(embed)
          .then(message.delete())
          .catch(console.error)
      })
    }
    
    if (muteRole && !mem.roles.has(muteRole)) {
      mute(message, mem, muteRole, reason)
    } else if (mem.roles.has(muteRole)) {
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
      
    }
	}
}