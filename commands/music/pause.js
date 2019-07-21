const index = require('app/index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "pause",
	usage: "pause",
	description: "Pauses the current song.",
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
      
		  if (serverQueue && serverQueue.playing) {
        
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
        
      var embed = new Discord.RichEmbed()
        .setColor("GREEN")
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setThumbnail(message.guild.iconURL)
        .setTitle("Music paused!")
        .setDescription(`Use the command \`${guildConf.prefix}resume\` to resume playing.`)
      .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
    
      return message.channel.send(embed)

		}
		return message.channel.send('Nothing is playing!');
    
	}
}