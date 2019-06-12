const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "rawembed",
	usage: "rawembed <color> [message]",
	description: "Say out messages in embeds, without your name!",
  permissions: 8,
	run: async (bot, message, args, shared) => {
    
    if (!message.member.hasPermission(8)) {
      
      return message.reply("you don't have sufficient permissions!")
        .then(message.delete())
        .catch(console.error)
        
    }
    
    function submitSuggestion(message, args) {
    var firstWord = args.shift()
    var content = args.join(" ")
    
      var embed = new Discord.RichEmbed()
        .setDescription(`${firstWord} ${content}`)
        .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
      message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
    }

      for (i = 0; i < shared.bannedwords.length; i++) {
        if (message.content.toLowerCase().includes(shared.bannedwords[i])) {
          message.delete().catch(O_o=>{});
          message.reply("please refrain from using such contemptable words.");
          return;
        }
      }

      submitSuggestion(message, args)

    }
	}

if (msg.split(" ")[0] === prefix + "suggest" || message.isMemberMentioned(bot.user) && msg.includes("suggest")) {
    if (message.isMemberMentioned(bot.user)) {
      message.delete().catch(O_o=>{});
      return message.reply (`this command is only available when using this server's prefix, \`${prefix}.\``)
    }
        const embedMessage = args.join(" ");
        if (censors === "on") {
            for (i=0;i<bannedwords.length;i++) {
            if (message.content.toLowerCase().includes(bannedwords[i])) {
                message.delete().catch(O_o=>{});
                return message.reply("please refrain from using such contemptable words.")
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
            } else if (!message.content.toLowerCase().includes(bannedwords[i])) {
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
          bot.channels.get(`585814273020788736`).send({embed: {
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
      return;
    }}
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
            } else {
        const embedMessage = args.join(" ");
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
        bot.fetchUser(config.ownerID).then((user) => {
          user.send({embed: {
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
  }})});
          return;
        }};