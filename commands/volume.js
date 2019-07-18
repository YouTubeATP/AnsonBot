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
      
        if(!args) return await message.channel.send(`The current volume is **${serverQueue.volume}**`)
    if ( vol === "0" || vol === "1" || vol === "2" || vol === "3" || vol === "4" || vol === "5" || vol === "6" || vol === "7" || vol === "8" || vol === "9" || args === "10" ) {
      
        serverQueue.connection.dispatcher.setVolumeLogarithmic(vol / 10)
        serverQueue.volume = vol;
        return await message.channel.send(`I set the volume to: **${vol}**`);
    }
      
      return await message.reply('please choose an integer between 0 and 10!');
    
	}
}