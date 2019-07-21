const index = require('app/index.js');
const fs = require('fs');
const Discord = require('discord.js');

var i;

module.exports = {
	name: "skip",
	usage: "skip",
  aliases: ["voteskip"],
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
            if (sender === shared.playerVoted[x]) {
              return voteSkipFailMessage()
        }
        }
    
        shared.voted++;
        shared.playerVoted.push(sender);
        if (shared.voteSkipPass === 0) {
            voiceChannel.members.forEach(function() {
             shared.voteSkipPass++;
            })
        }
    
        var voteSkipPass1 = shared.voteSkipPass - 1;
        var voteSkip = Math.round(voteSkipPass1/2);
        if (voteSkip === 0) voteSkip = 1;
        
        if (shared.voted >= voteSkip) {
          var skip = new Discord.RichEmbed()
          .setColor("GREEN")
          .setAuthor(message.author.tag, message.author.avatarURL)
          .setThumbnail(bot.user.displayAvatarURL)
          .setTitle("Your vote has been logged!")
          .setDescription(`The vote to skip the currently playing song has been passed, so it will be stopped.`)
          .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
          
        await message.channel.send(skip)
            serverQueue.connection.dispatcher.end();
        shared.voted = 0;
        shared.voteSkipPass = 0;
        shared.playerVoted = [];
        } else {
            var voteSkip = new Discord.RichEmbed()
            .setColor("GREEN")
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setThumbnail(bot.user.displayAvatarURL)
            .setTitle("Your vote has been logged!")
            .setDescription(shared.voted + '\/' + voteSkip + ' players voted to skip!')
            .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
          
            await message.channel.send(voteSkip)
        }
    
        function voteSkipFailMessage() {
          var voteSkipPass1 = shared.voteSkipPass - 1;
          var voteSkip = Math.round(voteSkipPass1/2);
          if (voteSkip === 0) voteSkip = 1;
          var voteSkipFail = new Discord.RichEmbed()
              .setColor("RED")
              .setAuthor(message.author.tag, message.author.avatarURL)
              .setThumbnail(bot.user.displayAvatarURL)
              .setTitle("You've already voted to skip this song!")
              .setDescription(shared.voted + '\/' + voteSkip + ' players voted to skip!')
              .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
          
            return message.channel.send(voteSkipFail)
        }
    
        return undefined;
    
	}
}