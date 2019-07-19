const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "loop",
	usage: "loop",
	description: "Toggles to `single` when used once.\nToggles to `all` when used twice.\nToggles to `off` when used thrice.",
	run: async (bot, message, args, shared) => {
    
    const queue = shared.queue;
    const serverQueue = queue.get(message.guild.id);
    
    const defaultSettings = {   
        prefix: "em/",    
        censor: "off"
    }
    
    const guildConf = bot.settings.ensure(message.guild.id, defaultSettings)
    
    message.delete().catch(O_o=>{});
          
          const voiceChannel = message.member.voiceChannel;
          const botVoiceConnection = message.guild.voiceConnection;
        
          if(!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!')
    
          if (!serverQueue) return message.channel.send("Nothing is playing right now!")
      
          if (voiceChannel !== botVoiceConnection.channel) return message.channel.send('You need to be in my voice channel to execute this command!')
      
          if (serverQueue.loop === "off") {
            serverQueue.loop = "single"
              return message.channel.send ("Loop for the current queue has been toggled to `single`. Use this command again to toggle loop to `all`.");
          } else if (serverQueue.loop === "single") {
            serverQueue.loop = "all"
          return message.channel.send ("Loop for the current queue has been toggled `all`. Use this command again to disable loop.");
    }
          serverQueue.loop = "off"
          return message.channel.send ("Loop for the current queue has been toggled `off`. Use this command again to toggle loop to `single`.");
    
	}
}