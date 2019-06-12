const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');
const Enmap = require('enmap')

module.exports = {
  name: "showconf",
  usage: "showconf",
  description: "Shows the server's configurations.",
  aliases: ["showconfig"],
  run: async (bot, message, args, shared) => {

    const defaultSettings = {   
        prefix: "em/",    
        censor: "off"
    };
    
    message.delete().catch(O_o=>{});
    const guildConf = bot.settings.ensure(message.guild.id, defaultSettings);
    message.channel.send({embed: {
        color: 0x00bdf2,
        title: "Server Configurations",
        description:("The following are this server's current configurations: \n\nPrefix: \`" + guildConf.prefix + "\`\nCensor: \`" + guildConf.censor + "\`"),
        footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ | Clean Embeds, Crisp Music"
            }
    }})
    
  }
}