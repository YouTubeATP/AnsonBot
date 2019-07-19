const index = require('../index.js');
const fs = require('fs');
const Discord = require('discord.js');
const { Util } = require('discord.js');
const ytdl = require("ytdl-core");
const opus = require("node-opus");
const YouTube = require("simple-youtube-api");
const RC = require('reaction-core')

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
        
        if (!permissions.has('CONNECT')) {
      
          return bot.fetchUser(message.member).then((user) => {
          user.send({embed: {
            color: 0x00bdf2,
            title: "I do not have sufficient permissions!",
            description:(`I cannot connect to voice channels in the guild \`${message.guild.name}\`! Please notify a server administrator.`),
            footer: {
              icon_url: bot.user.avatarURL,
              text: "MusEmbed™ | Clean Embeds, Crisp Music"
            }
          }})}).then(message.delete());
    
        };
    
        if (!permissions.has('SPEAK')) {
      
          return bot.fetchUser(message.member).then((user) => {
          user.send({embed: {
            color: 0x00bdf2,
            title: "I do not have sufficient permissions!",
            description:(`I cannot speak in voice channels in the guild \`${message.guild.name}\`! Please notify a server administrator.`),
            footer: {
              icon_url: bot.user.avatarURL,
              text: "MusEmbed™ | Clean Embeds, Crisp Music"
            }
          }})}).then(message.delete());
    
        };
    
        if (!message.guild.me.hasPermission("ADD_REACTIONS")) {
      
          return bot.fetchUser(message.member).then((user) => {
          user.send({embed: {
            color: 0x00bdf2,
            title: "I do not have sufficient permissions!",
            description:(`I cannot add reactions to messages in the guild \`${message.guild.name}\`! Please notify a server administrator.`),
            footer: {
              icon_url: bot.user.avatarURL,
              text: "MusEmbed™ | Clean Embeds, Crisp Music"
            }
          }})}).then(message.delete());
    
        };
        
    if (!searchString) return message.reply('please provide a search term, url or playlist link!')
    if (shared.stopping) shared.stopping = false;
      
    if (searchString.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)){
      
          shared.playlist = true
      
          return message.reply("directly playing a playlist is currently not supported.")
      
        } else {
          
            shared.playlist = false
          
            try {
              
                var video = await shared.youtube.getVideo(searchString)
                return handleVideo(video, message, voiceChannel);
                
            } catch(error) {
                try {
                    let index = 0;
                    var videos = await shared.youtube.searchVideos(searchString, 10);
                    var vindex = 0;
                    let bicon = bot.user.displayAvatarURL
                    let videosEmbed = new Discord.RichEmbed()
                    .setTitle("Song Selection")
                    .setColor(0x00bdf2)
                    .setAuthor(message.author.tag, message.author.avatarURL)
                    .setThumbnail(message.guild.iconURL)
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
                        var video = await shared.youtube.getVideoByID(videos[videoIndex - 1].id);
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
                  
                    shared.handler.addMenus(videosChoice)
                      
                      await message.channel.send("Please select the number corresponding to your video! Wait for all the options to load before choosing.")
                        .then(() => message.channel.sendMenu(videosChoice))
                  
                } catch(err) {
                    console.log(err)
                    return await message.channel.send("No results could be found.")
                }
            }
        }
    
    async function handleVideo(video, message, voiceChannel, playlist = false){
    const serverQueue = queue.get(message.guild.id)
    const song = {
                id: video.id,
                title: Util.escapeMarkdown(video.title.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<')
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
				.replace(/&nbsp;/g, ' ')),
                thumbnail: video.thumbnails.default.url,
                url: `https://www.youtube.com/watch?v=${video.id}`,
                channel: video.channel.title,
                durationm: video.duration.minutes,
                durations: video.duration.seconds,
                durationh: video.duration.hours,
                durationd: video.duration.days,
                requested: message.author.id,
                guild: message.guild,
                publishedAt: video.publishedAt,
            }
        
    if (!serverQueue) {
    var queueConstruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      guild: message.guild,
      connection: null,
      songs: [],
      volume: 10,
      playing: true,
      loop: "off"
    };
    queue.set(message.guild.id, queueConstruct);

        queueConstruct.songs.push(song);
      
        if (playlist) return message.channel.send("Playlist added to queue.")
      
        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(error)
            queue.delete(message.guild.id)
            return message.channel.send({embed: {
            color: 0x00bdf2,
            description:("An error occured!"),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "MusEmbed™ | Clean Embeds, Crisp Music"
            }
  }})
        }
    } else {
        serverQueue.songs.push(song);
      
        if (playlist) return message.channel.send("Playlist added to queue.")
        
        let bicon = bot.user.displayAvatarURL
        let queueemb = new Discord.RichEmbed()
          .setColor(0x00bdf2)
          .setTitle(`Song added to queue!`)
          .setAuthor(song.guild.name, song.guild.iconURL)
          .setDescription(`Something is already playing, so I've added your song to the end of the current queue. \n　`)
          .setThumbnail(song.thumbnail)
          .addField("Requested Song", `[${song.title}](${song.url})`)
          .addField("Uploaded by", song.channel, true)
          .addField("Requested by", `<@${song.requested}>`, true)
          .addField("Time of Publication", `${song.publishedAt}`, true)
          .addField("Duration", `\`${song.durationd}\` Days, \`${song.durationh}\` Hours, \`${song.durationm}\` Minutes and \`${song.durations}\` Seconds`, true)
          .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bicon)
        return message.channel.send (queueemb)
    }
    return undefined;
}

function np(serverQueue) {

      let song = serverQueue.songs[0]
      let bicon = bot.user.displayAvatarURL
      let embed = new Discord.RichEmbed()
      .setColor(0x00bdf2)
      .setAuthor(song.guild.name, song.guild.iconURL)
      .setTitle(`Now Playing`)
      .setDescription(`[${song.title}](${song.url})`)
      .setThumbnail(song.thumbnail)
      .addField("Uploaded by", song.channel, true)
      .addField("Requested by", `<@${song.requested}>`, true)
      .addField("Time of Publication", `${song.publishedAt}`, true)
      .addField("Duration", `\`${song.durationd}\` Days, \`${song.durationh}\` Hours, \`${song.durationm}\` Minutes and \`${song.durations}\` Seconds`, true)
      .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bicon)
      
      serverQueue.textChannel.send(embed)
}

function play(guild, song){
    const serverQueue = queue.get(guild.id)
    if (shared.stopping) {
       queue.delete(guild.id);
       return;
    }
    
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return undefined;
    }
  
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url), {bitrate: 512000 /* 512kbps */})
        .on('end', reason => {
			    if (reason === 'Stream is not generating quickly enough.') {
            console.log('Song ended.');
          } else console.log(reason);
        
          if(!serverQueue.songs) {
                serverQueue.voiceChannel.leave();
                queue.delete(guild.id);
                shared.voted = 0;
            shared.voteSkipPass = 0;
            shared.playerVoted = [];
                return undefined;
          }
        
          if (serverQueue.loop === "off") serverQueue.songs.shift();
          if (serverQueue.loop === "all") serverQueue.songs.push(serverQueue.songs.shift());
          
        shared.voted = 0;
        shared.voteSkipPass = 0;
        shared.playerVoted = [];
                play(guild, serverQueue.songs[0]);
            })
        .on('error', error => console.error(error));
      dispatcher.setVolumeLogarithmic(serverQueue.volume / 10);
      if (song) {
        np(serverQueue)
    }
}

function sortObject() {
    var arr = [];
    for (var prop in shared.userData) {
        if (shared.userData.hasOwnProperty(prop)) {
            arr.push({
            'key': prop,
            'value': shared.userData[prop].money
            });
        }
    }
    arr.sort(function(a, b) { return b.value - a.value; });
    return arr;
}
    
	}
}