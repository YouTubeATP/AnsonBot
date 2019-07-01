const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');
const Enmap = require('enmap')

module.exports = {
  name: "botinfo",
  usage: "botinfo",
  aliases: ["status", "botstatus"],
  description: "Shows information about the bot.",
  run: async (bot, message, args, shared) => {

    const defaultSettings = {
        prefix: "em/",    
        censor: "off"
    }
    
    const guildConf = bot.settings.ensure(message.guild.id, defaultSettings)
    
    const promises = [
	      bot.shard.broadcastEval('this.guilds.size'),
	      bot.shard.broadcastEval('this.guilds.reduce((prev, guild) => prev + guild.memberCount, 0)'),
];
    return Promise.all(promises)
    .then(results => {
      
        const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
		    const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);
      
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
          .addField("Servers", `${totalGuilds}`, true)
          .addField("Users", `${totalMembers}`, true)
          .addField("Memory Used", `${Math.round(used * 100) / 100}MB`, true)
          .addField("Library", "discord.js", true)
          .addField("ID", bot.user.id)
          .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bicon)

        message.channel.send(embed)
          .then(message.delete())
          .catch(e => {
            shared.printError(message, e, `I couldn't fetch the bot's info!`)
          })
      })
    
  }
}