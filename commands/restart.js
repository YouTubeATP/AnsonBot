const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "restart",
	usage: "restart",
  aliases: ["reload", "reboot"],
	description: "Restarts the bot's process.",
  requirements: "**Bot Administrator**",
	run: async (bot, message, args, shared) => {
    
    if (message.author.id != "336389636878368770" && message.author.id != "344335337889464357") return;
    
    let reembed = new Discord.RichEmbed()
      .setTitle('MusEmbed™ is now rebooting.')
      .setDescription("You have initiated a reboot of MusEmbed™. Please wait patiently until it is completed.")
      .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
      .setColor(0x00bdf2)
    message.channel.send(reembed).then(() => {
      process.exit(2)
    })
  }

}