const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "setconf",
	usage: "setconf <config> <value>",
  aliases: ["setconfig", "set"],
	description: "Ban users!",
	run: async (bot, message, args, shared) => {
    
        function setConf(message, args) {
        if (!message.member.hasPermission("ADMINISTRATOR" || !message.member.id === shared.owner)) {
            message.delete().catch(O_o=>{});
            return message.reply("you do not have the permissions to change the server's configurations.")
        }
        var conf = args.shift()
        var value = args.join(" ")
        if (conf === "censor" && value === "on" || conf === "censor" && value === "off" || conf === "prefix" && !value.includes(" ")) {
            bot.settings.set(message.guild.id, value, conf);
            message.delete().catch(O_o=>{});
            return message.channel.send(`Server ${conf} has been set to: \`${value}\``)
        }
        return message.reply("either this configuration is unavailable, or the value you provided was invalid.")
    }

        if (shared.censors === "on") {
        for (i=0;i<bannedwords.length;i++) {
        if (message.content.toLowerCase().includes(shared.bannedwords[i])) {
            message.delete().catch(O_o=>{});
            message.reply("please refrain from using such contemptable words.");
          return;
          }
        }
    
            setConf(message, args)
      
        } else {
      
            setConf(message, args)
          
        }}}