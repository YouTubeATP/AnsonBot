const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "restart",
	usage: "eval <code>",
	description: "Evaluate JavaScript code!",
  requirements: "**Bot Administrator**",
	run: async (bot, message, args, shared) => {
    
    let reembed = new Discord.RichEmbed()
      .setTitle("Reloading commands and functions...")
      .setColor(0xe86ae8)
    message.channel.send(reembed).then(() => {
      process.exit(2)
    })
  }

}