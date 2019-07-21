const index = require('app/index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "volume",
	usage: "volume",
	description: "Changes volume to the provided number. Shows current volume if arguments are not provided.",
	run: async (bot, message, args, shared) => {
    
        const number = message.content.slice(shared.prefix.length + 7).trim()
    
        const queue = shared.queue;
        const serverQueue = queue.get(message.guild.id);
    
        message.delete().catch(O_o=>{});
        
        const voiceChannel = message.member.voiceChannel;
        const botVoiceConnection = message.guild.voiceConnection;
        
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!')
        
        if (!serverQueue) return await message.channel.send("Nothing is playing!");
        
        if (voiceChannel !== botVoiceConnection.channel) return message.channel.send('You need to be in my voice channel to execute this command!')
      
        if ( !number || number.includes("-") || number.includes(".") || number.includes(",") || number.includes(" ") ) {
          
          var currentvol = new Discord.RichEmbed()
              .setColor(0x00bdf2)
              .setAuthor(message.author.tag, message.author.avatarURL)
              .setThumbnail(bot.user.displayAvatarURL)
              .setTitle(`The current volume level is \`${serverQueue.volume}\`.`)
              .setDescription(`To change the volume, please provide a valid integer between \`0\` and \`10\` when using this command.`)
              .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
          return await message.channel.send(currentvol)
          
        }
    
        if ( number >= 0 && number <= 10 ) {
            serverQueue.connection.dispatcher.setVolumeLogarithmic(parseInt(number) / 10)
            serverQueue.volume = parseInt(number);
            var vol = new Discord.RichEmbed()
              .setColor("GREEN")
              .setAuthor(message.author.tag, message.author.avatarURL)
              .setThumbnail(bot.user.displayAvatarURL)
              .setTitle("Volume level changed!")
              .setDescription(`Volume level \`${number}\` has been set.`)
              .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
            return await message.channel.send(vol)
        }
    
        var currentvol = new Discord.RichEmbed()
              .setColor(0x00bdf2)
              .setAuthor(message.author.tag, message.author.avatarURL)
              .setThumbnail(bot.user.displayAvatarURL)
              .setTitle(`The current volume level is \`${serverQueue.volume}\`.`)
              .setDescription(`To change the volume, please provide a valid integer between \`0\` and \`10\` when using this command.`)
              .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
        return await message.channel.send(currentvol)
    
	}
}