const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: "ping",
  usage: "ping",
  description: "Pings the bot and shows its latency.",
  run: async (bot, message, args, shared) => {
    
    const m = await message.channel.send("Pinging...");
        const pingMessage = (`Bot latency is ${m.createdTimestamp - message.createdTimestamp}ms. API latency is ${Math.round(bot.ping)}ms.`);
        message.delete().catch(O_o=>{});
        message.channel.bulkDelete(1)
        message.channel.send({embed: {
            color: 0x00bdf2,
            title: "Ping Received",
            description:(pingMessage),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ | Clean Embeds, Crisp Music"
            }
  }})
    
  }
}