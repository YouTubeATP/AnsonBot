const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "purge",
	usage: "purge <number>",
	description: "Deletes a number of messages in a channel.",
	run: async (bot, message, args, shared) => {
    
    const number = message.content.slice(shared.prefix.length + 6).trim()
    
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
      
      return message.channel.send({embed: {
      color: 0x00bdf2,
      title: "I do not have sufficient permissions!",
      description:(`I cannot manage messages in this guild, so I cannot carry out this command.`),
      footer: {
          icon_url: bot.user.avatarURL,
          text: "MusEmbed™ | Clean Embeds, Crisp Music"
      }
  }}).then(message.delete())
      
    };
    
    if (message.member.hasPermission("MANAGE_MESSAGES") || message.member.hasPermission("ADMINISTRATOR")) {
      
      try {
        let messagesClear = args.join(" ")
        if (!args) return message.reply("please provide the number of messages you want purged.").then(message.delete())
        if ( !isNaN(messagesClear) || args.includes(".") || args.includes(",") || args.includes(" ") ) return message.reply("please provide a valid integer as the number of messages you want purged.")
        if ( parseInt(messagesClear) >= 1 ) message.channel.bulkDelete( parseInt(messagesClear) + Math.round(1) )
        
        var purgeEmbed = new Discord.RichEmbed()
        .setColor("GREEN")
        .setTitle("Messages purged!")
        .setDescription(`Successfully purged \`${Math.round(messagesClear)}\` messages in this channel.`)
        .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
        
        return message.channel.send(purgeEmbed).then(m => m.delete(5000));
      } catch (error) {
        return message.reply("please provide the number of messages you want purged.").then(message.delete())
      }
    }
    
        message.reply("you don't have sufficient permissions!").then(message.delete());
        return;
    
	}
}