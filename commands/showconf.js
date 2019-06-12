const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: "showconf",
  usage: "showconf",
  description: "Shows the server's configurations.",
  aliases: ["showconfig"],
  run: async (bot, message, shared) => {
    
    function showConf(message) {
    
    message.delete().catch(O_o=>{});
    message.channel.send({embed: {
        color: 0x00bdf2,
        title: "Server Configurations",
        description:("The following are this server's current configurations: \n\nPrefix: \`" + shared.prefix + "\`\nCensor: \`" + shared.censor + "\`"),
        footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ | Clean Embeds, Crisp Music"
            }
    }});
    
    }
    
    showConf(message)
    
  }
}