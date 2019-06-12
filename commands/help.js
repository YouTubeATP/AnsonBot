const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "help",
	usage: "help [command]",
	description: "Get help information!",
	run: async (bot, message, args, shared) => {
    
    if (args.length == 0) {
      
      var embed = new Discord.RichEmbed()
        .setColor(0x00bdf2)
        .setTitle("MusEmbed™'s Help Message")
        .addField("Prefix", `The prefix for this server is \`${shared.prefix}\`. You may also mention me <@414440610418786314> as a prefix. `)
        .addField("Description", "This is a bot that can help you easily create embeds in your server. We also have music playing functionality.")
        .addField("General Commands", "`help`: Shows this help message.\n`botinfo`: Retrieves information about the bot.\n`serverinfo`: Retrieves information about the server.\n`ping`: Shows latency of the bot and the API.\n`links`: Shows all our links.\n`suggestion`: Submits a suggestion to MusEmbed's support server.")
        .addField("Embed Commands", "`embed`: Embeds your message.\n`rawembed`: Embeds your message without showing your name.")
      .addField("Music Commands", "`play`: Searches for the song you requested.\n`pause`: Pauses the current song.\n`resume`: Resumes a paused song.\n`skip`: Votes to skip the playing song. Song automatically skips if half/over half of people vote to skip.\n
np: Shows the name of the currently playing song. 
volume ([number]): Changes volume to the provided number. Shows current volume if arguments are not provided. 
queue: Shows the current queue of songs. 
loop: Toggles loop to single when used once. Toggles to all when used twice. Toggles off when used thrice. 
stop: Moderator-only command. Resets the queue and stops music. Also forces bot to leave the voice channel.")
      
      
      
      message.delete().catch(O_o=>{});
        message.channel.send({embed: {
            color: 0x00bdf2,
            title: "MusEmbed's Help Message",
            fields: [
                    {
                        name: "Prefix",
                        value: ("The prefix for this server is \`" + shared.prefix + "\`. You may also mention me as a prefix.\n")
                    },
                    {
                        name: "Description",
                        value: "This is a bot that can help you easily create embeds in your server. We also have music playing functionality. \n"
                    },
                    {
                        name: "General Commands",
                        value: "\`help\`: Shows this help message. \n\`botinfo\`: Retrieves information about the bot. \n\`serverinfo\`: Retrieves information about the server. \n\`ping\`: Shows latency of the bot and the API. \n\`links\`: Shows all our links. \n\`suggest [suggestion]\`: Submits a suggestion to MusEmbed's support server. Suggestion must consist of 20 characters or more. \n"
                    },
                    {
                        name: "Embed Commands",
                        value: "\`embed [(hex code]) [message]\`: Embeds your message. \n\`rawembed ([hex code]) [message]\`: Administrator-only command that embeds your message without your name. \n"
                    },
                    {
                        name: "Music Commands",
                        value: "\`play [name of music]\`: Searches for the song you requested. \n\`pause\`: Pauses the current song. \n\`resume\`: Resumes a paused song. \n\`skip\`: Votes to skip the playing song. Song automatically skips if half/over half of people vote to skip. \n\`np\`: Shows the name of the currently playing song. \n\`volume ([number])\`: Changes volume to the provided number. Shows current volume if arguments are not provided. \n\`queue\`: Shows the current queue of songs. \n\`loop\`: Toggles loop to \`single\` when used once. Toggles to \`all\` when used twice. Toggles \`off\` when used thrice. \n\`stop\`: Moderator-only command. Resets the queue and stops music. Also forces bot to leave the voice channel."
                    },
                    {
                        name: "Moderation Commands",
                        value: "\`kick [user]\`: Kicks a user from the guild. \n\`ban [user]\`: Bans a user from the guild. \n\`purge [number]\`: Deletes a number of messages in a channel. \n\`mute [user]\`: Mutes a user in the guild. A 'Muted' role must first be set up for this to work. \n\`unmute [user]\`: Unmutes a user in the guild. A 'Muted' role must first be set up for this to work. \n"
                    },
                    {
                        name: "Server Configurations",
                        value: "\`showconf\`: Shows the configurations for your server. \n\`setconf [item] [new value]\`: Administrator-only command. Sets a new value for your server's configuration. For this command, \`em/\` is a permanent prefix. \n(Available configurations: \`prefix (new prefix)\`, \`censor (on/off)\`) \n" 
                    },
                ],
        footer: {
                    icon_url: bot.user.avatarURL,
                    text: "MusEmbed™ | Clean Embeds, Crisp Music"
                }
  }})
}
    
    
	}
}