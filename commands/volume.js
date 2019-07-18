const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "volume",
	usage: "volume",
	description: "Changes volume to the provided number. Shows current volume if arguments are not provided.",
	run: async (bot, message, args, shared) => {
    
        const queue = shared.queue;
        const serverQueue = queue.get(message.guild.id);
    
        message.delete().catch(O_o=>{});
        
        const voiceChannel = message.member.voiceChannel;
        const botVoiceConnection = message.guild.voiceConnection;
        
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!')
        
        if (!serverQueue) return await message.channel.send("Nothing is playing!");
        
        if (voiceChannel !== botVoiceConnection.channel) return message.channel.send('You need to be in my voice channel to execute this command!')
      
        if(!args) return await message.channel.send(`The current volume is **${serverQueue.volume}**`)
    if ( args === "0" || args === "1" || args === "2" || args === "3" || args === "4" || args === "5" || args === "6" || args === "7" || args === "8" || args === "9" || args === "10" ) {
      
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args / 10)
        serverQueue.volume = args;
        return await message.channel.send(`I set the volume to: **${args}**`);
    }
      
      return await message.reply('please choose an integer between 0 and 10!');
    
	}
}