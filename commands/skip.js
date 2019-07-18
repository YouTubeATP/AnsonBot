const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "skip",
	usage: "skip",
	description: "Votes to skip the playing song.\nSong automatically skips if half or more people voted to skip.",
	run: async (bot, message, args, shared) => {
    
    message.delete().catch(O_o=>{});
        const voiceChannel = message.member.voiceChannel;
        const botVoiceConnection = message.guild.voiceConnection;
        
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!')
    
        if (!serverQueue) return message.channel.send("Nothing is playing right now!")
      
    if (voiceChannel !== botVoiceConnection.channel) return message.channel.send('You need to be in my voice channel to execute this command!')

        for (var x = 0; x < playerVoted.length; x++) {
            if(sender === playerVoted[x]){
            return message.reply(` you think you run the place? You can\'t vote twice!`)
        }
        }
        voted++;
        playerVoted.push(sender);
        if(voteSkipPass === 0){
            voiceChannel.members.forEach(function() {
             voteSkipPass++;
            })
        }
        var voteSkipPass1 = voteSkipPass - 1;
        var voteSkip = Math.floor(voteSkipPass1/2);
        if(voteSkip === 0) voteSkip = 1;
        if(voted >= voteSkip){
        await message.channel.send('Vote skip has passed!')
            serverQueue.connection.dispatcher.end();
        voted = 0;
        voteSkipPass = 0;
        playerVoted = [];
        } else {
            await message.channel.send(voted + '\/' + voteSkip + ' players voted to skip!')
        }
        return undefined;
    
	}
}