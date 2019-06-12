const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "suggest",
	usage: "suggest <suggestion>",
	description: "Submits a suggestion to our support server.",
  permissions: 8,
	run: async (bot, message, args, shared) => {
    
            const embedMessage = args.join(" ");
    
            for (i=0;i<bannedwords.length;i++) {
            if (message.content.toLowerCase().includes(shared.bannedwords[i])) {
                message.delete().catch(O_o=>{});
                return message.reply("chill! Suggestions must be made in a calm and collected manner.")
            } else if (embedMessage.length < 20) {
              message.delete().catch(O_o=>{});
              message.channel.send({embed: {
            color: 0x00bdf2,
            title: "Suggestion too short!",
            description: "Your suggestion must consist of 20 characters or more.",
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ | Clean Embeds, Crisp Music"
            }
          }});
          return;
            } else if (!message.content.toLowerCase().includes(shared.bannedwords[i])) {
        const senderID = args.join(" ");
        message.delete().catch(O_o=>{});
        message.channel.send({embed: {
            color: 0x00bdf2,
            title: "Suggestion submitted!",
            description: "Your suggestion will be reviewed in short time. If your suggestion is accepted, you will be credited in <@414440610418786314>'s changelog.",
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ | Clean Embeds, Crisp Music"
            }
        }});
          return bot.channels.get(`585814273020788736`).send({embed: {
            color: 0x00bdf2,
            title: "Suggestion",
            author: {
                name: `${message.author.username}#${message.author.discriminator}`,
                icon_url: message.author.avatarURL
            },
            description:(embedMessage),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ | Clean Embeds, Crisp Music"
            }
  }});
    }}

    }
	}