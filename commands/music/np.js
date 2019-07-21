const index = require('app/index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "np",
	usage: "np",
  aliases: ["nowplaying"],
	description: "Shows the name of the currently playing song.",
	run: async (bot, message, args, shared) => {
    
      const queue = shared.queue;
      const serverQueue = queue.get(message.guild.id);  
    
      const voiceChannel = message.member.voiceChannel;
      const botVoiceConnection = message.guild.voiceConnection;
        
      if (!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!').then(message.delete())
    
      if (!serverQueue) return message.channel.send("Nothing is playing right now!").then(message.delete())
      
      if (voiceChannel !== botVoiceConnection.channel) return message.channel.send('You need to be in my voice channel to execute this command!').then(message.delete)

      let song = serverQueue.songs[0]
      let bicon = bot.user.displayAvatarURL
      let embed = new Discord.RichEmbed()
      .setColor(0x00bdf2)
      .setAuthor(message.guild.name, message.guild.iconURL)
      .setTitle(`Now Playing: \n　`)
      .setDescription(`[${song.title}](${song.url})`)
      .setThumbnail(song.thumbnail)
      .addField("Uploaded by", song.channel, true)
      .addField("Requested by", `<@${song.requested}>`, true)
      .addField("Time of Publication", `${song.publishedAt}`, true)
      .addField("Duration", `\`${song.durationd}\` Days, \`${song.durationh}\` Hours, \`${song.durationm}\` Minutes and \`${song.durations}\` Seconds`, true)
      .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bicon)
      return message.channel.send(embed).then(message.delete())
    
	}
}