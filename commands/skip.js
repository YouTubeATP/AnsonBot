const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

var i;

module.exports = {
	name: "skip",
	usage: "skip",
	description: "Votes to skip the playing song.\nSong automatically skips if half or more people voted to skip.",
	run: async (bot, message, args, shared) => {
    
    let sender = message.author;
    
    const queue = shared.queue;
    const serverQueue = queue.get(message.guild.id);
    
    message.delete().catch(O_o=>{});
        const voiceChannel = message.member.voiceChannel;
        const botVoiceConnection = message.guild.voiceConnection;
        
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!')
    
        if (!serverQueue) return message.channel.send("Nothing is playing right now!")
      
    if (voiceChannel !== botVoiceConnection.channel) return message.channel.send('You need to be in my voice channel to execute this command!')

        for (var x = 0; x < shared.playerVoted.length; x++) {
            if (sender === shared.playerVoted[x]){
            return message.reply(` you think you run the place? You can\'t vote twice!`)
        }
        }
        shared.voted++;
        shared.playerVoted.push(sender);
        if(shared.voteSkipPass === 0){
            voiceChannel.members.forEach(function() {
             shared.voteSkipPass++;
            })
        }
        var voteSkipPass1 = shared.voteSkipPass - 1;
        var voteSkip = Math.round(voteSkipPass1/2);
        if(voteSkip === 0) voteSkip = 1;
        if(shared.voted >= voteSkip){
        await message.channel.send('Vote skip has passed!')
            serverQueue.connection.dispatcher.end();
        shared.voted = 0;
        shared.voteSkipPass = 0;
        shared.playerVoted = [];
        } else {
            await message.channel.send(shared.voted + '\/' + voteSkip + ' players voted to skip!')
        }
        return undefined;
    
	}
}