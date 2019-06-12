const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: "links",
  usage: "links",
  description: "Shows all of MusEmbed's links",
  aliases: ["vote", "invite", "support"],
  run: async (bot, message, shared) => {
    
    message.delete().catch(O_o=>{});
        message.channel.send({embed: {
            color: 0x00bdf2,
            title: "Links",
            description: ("[MusEmbed's Website](https://www.musembed.tk) \n[Vote for MusEmbed](https://vote.musembed.tk) \n[Join MusEmbed Support](https://invite.gg/musembed) \n[Invite MusEmbed](https://invite.musembed.tk) \n[MusEmbed's Uptime](https://uptime.musembed.tk)"),
            footer: {
                        icon_url: bot.user.avatarURL,
                        text: "MusEmbed™ | Clean Embeds, Crisp Music"
                    }
  }})
      
  }
}