const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "resume",
	usage: "resume",
	description: "Resumes a paused song.",
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
        
    if (!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!')
    
    if (!serverQueue) return message.channel.send("Nothing is playing right now!")
      
    if (voiceChannel !== botVoiceConnection.channel) return message.channel.send('You need to be in my voice channel to execute this command!')
    
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send('Music resumed.');
		}
		return message.channel.send(`Something is currently playing! Use ${guildConf.prefix}pause to pause the music.`);
    
	}
}