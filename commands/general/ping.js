const index = require('app/index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: "ping",
  usage: "ping",
  aliases: ["pong"],
  description: "Pings the bot and shows its latency.",
  run: async (bot, message, args, shared) => {
    
    message.channel.send("Pinging...").then(m => {
      var pingMessage = (`Bot latency is ${m.createdTimestamp - message.createdTimestamp}ms. API latency is ${Math.round(bot.ping)}ms.`)
      
      var embed = new Discord.RichEmbed()
        .setColor("GREEN")
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setThumbnail(message.guild.iconURL)
        .setTitle("Ping Received!")
        .setDescription(pingMessage)
        .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
      
      message.channel.send(embed)
        .then(() => {
          message.delete()
          m.delete()
        })
        .catch(console.error)
      
    })
      
  }
}