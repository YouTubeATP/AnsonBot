const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "stop",
	usage: "stop",
	description: "Resets the queue and stops music.\nAlso forces bot to leave the voice channel.",
  requirements: "Move Members",
	run: async (bot, message, args, shared) => {
    
    const queue = shared.queue;
    const serverQueue = queue.get(message.guild.id);
    
    message.delete().catch(O_o=>{});
        const voiceChannel = message.member.voiceChannel;
        const botVoiceConnection = message.guild.voiceConnection;
          
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!')
    
        if (!serverQueue) return message.channel.send("Nothing is playing right now!")
      
        if (voiceChannel !== botVoiceConnection.channel) return message.channel.send('You need to be in my voice channel to execute this command!')
    
        if (!message.member.hasPermission("MOVE_MEMBERS")) return await message.reply("you don't have sufficient permissions!")
    shared.stopping = true;
    serverQueue.voiceChannel.leave();
    
    var stop = new Discord.RichEmbed()
          .setColor("00bdf2")
          .setTitle("Music playing successfully terminated.")
          .setDescription("Music playing successfully terminated.")
          .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
    
        return serverQueue.textChannel.send(stop);
    
	}
}