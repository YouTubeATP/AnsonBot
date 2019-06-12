const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: "ping",
  usage: "ping",
  description: "Pings the bot and shows its latency.",
  run: async (bot, message, shared) => {
    
    function ping(message) {
    console.log(1)
    message.channel.send("Pinging...").then(m => {
      var pingMessage = (`Bot latency is ${m.createdTimestamp - message.createdTimestamp}ms. API latency is ${Math.round(bot.ping)}ms.`)
      
      var embed = new Discord.RichEmbed()
        .setColor(0x00bdf2)
        .setTitle("Ping Received")
        .setDescription(pingMessage)
        .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
      
      message.channel.bulkDelete(parseInt(1));
      message.channel.send(embed)
        .then(message.delete())
        .catch(console.error)
      
    })
      
    }
    
      ping(message)
      
  }
}