const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');
const Enmap = require('enmap')

module.exports = {
  name: "serverinfo",
  usage: "serverinfo",
  description: "Shows information about the server this command is used in.",
  aliases: ["guildinfo"],
  run: async (bot, message, shared) => {
    
    function serverinfo(bot, message, shared) {

    const defaultSettings = {
        prefix: "em/",    
        censor: "off"
    };
    
    message.delete().catch(O_o=>{});
    const guildConf = bot.settings.ensure(message.guild.id, defaultSettings);
    
        let bicon = bot.user.displayAvatarURL
        let sicon = message.guild.iconURL
        
        let serverembed = new Discord.RichEmbed()
        .setTitle("Server Information")
        .setColor(0x00bdf2)
        .setThumbnail(sicon)
        .addField("Name", message.guild.name, true)
        .addField("Owner", message.guild.owner, true)
        .addField("Region", message.guild.region ,true)
        .addField("Time of Birth", message.guild.createdAt)
        .addField("Members", message.guild.memberCount, true)
        .addField("Humans", message.guild.members.filter(member => !member.user.bot).size, true)
        .addField("Bots", `${Math.round(message.guild.memberCount - message.guild.members.filter(member => !member.user.bot).size)}`, true)
        .addField("ID", message.guild.id)
        .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bicon)

        return message.channel.send(serverembed)
    
  }
}