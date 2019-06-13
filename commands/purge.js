const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "purge",
	usage: "purge <number>",
	description: "Deletes a number of messages in a channel.",
	run: async (bot, message, args, shared) => {
    
    if (!message.member.hasPermission("MANAGE_MESSAGES") || !message.member.hasPermission("ADMINISTRATOR")) {
        message.delete().catch(O_o=>{});
        message.reply("you don't have sufficient permissions!");
        return;
    }
    
    let messagesClear = args.join(" ")
    message.channel.bulkDelete(parseInt(messagesClear) + parseInt(1));
    
	}
}