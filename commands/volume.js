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
    
        var vol = parseInt(args)
    
        message.delete().catch(O_o=>{});
        
        const voiceChannel = message.member.voiceChannel;
        const botVoiceConnection = message.guild.voiceConnection;
        
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!')
        
        if (!serverQueue) return await message.channel.send("Nothing is playing!");
        
        if (voiceChannel !== botVoiceConnection.channel) return message.channel.send('You need to be in my voice channel to execute this command!')
      
        if (isNaN(args)) return await message.channel.send(`The current volume is \`${serverQueue.volume}\`. To change the volume, please provide a valid integer between \`0\` and \`10\`.`)
    
    if ( parseInt(args) >= 1 && parseInt(args) <= 10 ) {
      
        serverQueue.connection.dispatcher.setVolumeLogarithmic(parseInt(args) / 10)
        serverQueue.volume = parseInt(args);
        return await message.channel.send(`Volume has been set to \`${parseInt(args)}\`.`);
      
    }
    
    return message.channel.send(`The current volume is \`${serverQueue.volume}\`. To change the volume, please provide a valid integer between \`0\` and \`10\`.`)
    
	}
}