const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: "play",
	usage: "play <song name/url>",
	description: "Searches for the song you requested.",
	run: async (bot, message, args, shared) => {
    
        const queue = shared.queue;
        const serverQueue = queue.get(message.guild.id);
        const searchString = message.content.slice(shared.prefix.length + 5).trim()
        
        message.delete().catch(O_o=>{});
        
        const voiceChannel = message.member.voiceChannel;
        const botVoiceConnection = message.guild.voiceConnection;
        
        if(!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!')
      
        const permissions = voiceChannel.permissionsFor(bot.user)
        if(!permissions.has('CONNECT')) return message.channel.send('I can\'t connect to your channel, duh! How do you expect me to play you music?')
        if(!permissions.has('SPEAK')) return message.channel.send('I can\'t speak here, duh! How do you expect me to play you music?')
        
    if (!searchString) return message.reply('please provide a search term, url or playlist link!')
    if (shared.stopping) shared.stopping = false;
      
    if (searchString.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)){
      
          shared.playlist = true
      
          return message.reply("directly playing a playlist is currently not supported.")
      
        } else {
          
            shared.playlist = false
          
            try {
              
                var video = await youtube.getVideo(searchString)
                return handleVideo(video, message, voiceChannel);
                
            } catch(error) {
                try {
                    let index = 0;
                    var videos = await youtube.searchVideos(searchString, 10);
                    var vindex = 0;
                    let bicon = bot.user.displayAvatarURL
                    let videosEmbed = new Discord.RichEmbed()
                    .setTitle("Song Selection")
                    .setColor(0x00bdf2)
                    .addField("Songs:", videos.map(video2 => `**${++index} -** ${video2.title.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<')
				.replace(/&quot;/g, '"')
				.replace(/&OElig;/g, 'Œ')
				.replace(/&oelig;/g, 'œ')
				.replace(/&Scaron;/g, 'Š')
				.replace(/&scaron;/g, 'š')
				.replace(/&Yuml;/g, 'Ÿ')
				.replace(/&circ;/g, 'ˆ')
				.replace(/&tilde;/g, '˜')
				.replace(/&ndash;/g, '–')
				.replace(/&mdash;/g, '—')
				.replace(/&lsquo;/g, '‘')
				.replace(/&rsquo;/g, '’')
				.replace(/&sbquo;/g, '‚')
				.replace(/&ldquo;/g, '“')
				.replace(/&rdquo;/g, '”')
				.replace(/&bdquo;/g, '„')
				.replace(/&dagger;/g, '†')
				.replace(/&Dagger;/g, '‡')
				.replace(/&permil;/g, '‰')
				.replace(/&lsaquo;/g, '‹')
				.replace(/&rsaquo;/g, '›')
				.replace(/&euro;/g, '€')
				.replace(/&copy;/g, '©')
				.replace(/&trade;/g, '™')
				.replace(/&reg;/g, '®')
				.replace(/&nbsp;/g, ' ')}`))
                    .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bicon)
                    
                    async function detectSelection() {
                        const videoIndex = parseInt(vindex);
                        var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                        return handleVideo(video, message, voiceChannel);
                    }
                    
                    let videosChoice = new RC.Menu(
                                  videosEmbed,
                                  [
                                      { emoji: '1⃣',
                                          run: (user, message) => {
                                              vindex = 1
                                              detectSelection()
                                              message.delete()
                                                  }
                                      },
                                      { emoji: '2⃣',
                                          run: (user, message) => {
                                              vindex = 2
                                              detectSelection()
                                              message.delete()
                                                  }
                                      },
                                      { emoji: '3⃣',
                                          run: (user, message) => {
                                              vindex = 3
                                              detectSelection()
                                              message.delete()
                                                  }
                                      },
                                      { emoji: '4⃣',
                                          run: (user, message) => {
                                              vindex = 4
                                              detectSelection()
                                              message.delete()
                                                  }
                                      },
                                      { emoji: '5⃣',
                                          run: (user, message) => {
                                              vindex = 5
                                              detectSelection()
                                              message.delete()
                                                  }
                                      },
                                      { emoji: '6⃣',
                                          run: (user, message) => {
                                              vindex = 6
                                              detectSelection()
                                              message.delete()
                                                  }
                                      },
                                      { emoji: '7⃣',
                                          run: (user, message) => {
                                              vindex = 7
                                              detectSelection()
                                              message.delete()
                                                  }
                                      },
                                      { emoji: '8⃣',
                                          run: (user, message) => {
                                              vindex = 8
                                              detectSelection()
                                              message.delete()
                                                  }
                                      },
                                      { emoji: '9⃣',
                                          run: (user, message) => {
                                              vindex = 9
                                              detectSelection()
                                              message.delete()
                                                  }
                                      },
                                      { emoji: '🔟',
                                          run: (user, message) => {
                                              vindex = 10
                                              detectSelection()
                                              message.delete()
                                                  }
                                      },
                                      { emoji: '❌',
                                          run: (user, message) => {
                                              message.channel.send('Selection canceled.')
                                              return message.delete()
                                                  }
                                      },
                                  ],
                                  {
                                        owner: message.member.id
                                  }
                            )
                  
                    handler.addMenus(videosChoice)
                      
                      await message.channel.send("Please select the number corresponding to your video! Wait for all the options to load before choosing.")
                        .then(() => message.channel.sendMenu(videosChoice))
                  
                } catch(err) {
                    console.log(err)
                    return await message.channel.send("No results could be found.")
                }
            }
        }
    
	}
}