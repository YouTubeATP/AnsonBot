const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: "ping",
  usage: "ping",
  description: "Pings the bot and shows its latency.",
  aliases: ["showconfig"],
  run: async (bot, message, shared) => {
    
    function showConf(bot, message, shared) {
    
    message.delete().catch(O_o=>{});
        let configProps = Object.keys(shared.guildConf).map(prop => {
        return `${prop}  :  ${shared.guildConf[prop]}\n`;
    });
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
    
    showConf(bot, message, shared)
    
  }
}