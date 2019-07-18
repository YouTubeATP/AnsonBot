const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "purge",
	usage: "purge <number>",
	description: "Deletes a number of messages in a channel.",
	run: async (bot, message, args, shared) => {
    
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
      
      message.delete;
      return message.channel.send({embed: {
      color: 0x00bdf2,
      title: "I do not have sufficient permissions!",
      description:(`I cannot manage messages in this guild, so I cannot carry out this command.`),
      footer: {
          icon_url: bot.user.avatarURL,
          text: "MusEmbed™ | Clean Embeds, Crisp Music"
      }
  }})
      
    };
    
    if (message.member.hasPermission("MANAGE_MESSAGES") || message.member.hasPermission("ADMINISTRATOR")) {
        let messagesClear = args.join(" ")
        if (!args || messagesClear !== parseInt(messagesClear)) return message.reply ("please provide a valid number of messages for me to purge!")
        return message.channel.bulkDelete(parseInt(messagesClear) + parseInt(1));
    }
    
        message.delete().catch(O_o=>{});
        message.reply("you don't have sufficient permissions!");
        return;
    
	}
}