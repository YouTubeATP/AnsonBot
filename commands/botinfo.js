const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');
const Enmap = require('enmap')

module.exports = {
  name: "botinfo",
  usage: "botinfo",
  description: "Shows information about the bot.",
  run: async (bot, message, shared) => {

    const defaultSettings = {
        prefix: "em/",    
        censor: "off"
    };
    
    message.delete().catch(O_o=>{});
    const guildConf = bot.settings.ensure(message.guild.id, defaultSettings);
    
    return bot.shard.broadcastEval('this.guilds.size')
      .then(results => {
        let bicon = bot.user.displayAvatarURL
        const used = process.memoryUsage().heapUsed / 1024 / 1024
        let embed = new Discord.RichEmbed()
          .setTitle("Bot Information")
          .setColor(0x00bdf2)
          .setThumbnail(bicon)
          .addField("Name", bot.user.username, true)
          .addField("Prefix for this Server", "\`" + guildConf.prefix + "\`", true)
          .addField("Developer", "<@344335337889464357>", true)
          .addField("Time of Birth", bot.user.createdAt)
          .addField("Library", "discord.js", true)
          .addField("Servers", `${results.reduce((prev, val) => prev + val, 0)}`, true)
          .addField("Memory Used", `${Math.round(used * 100) / 100}MB`, true)
          .addField("ID", bot.user.id)
          .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bicon)

        message.channel.send(embed)
    
    })
    
  }
}