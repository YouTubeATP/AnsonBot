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
    
        var cancelled;
        
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
    
    for (var x = 0; x < shared.playerVoted.length; x++) {
            if (message.guild.id === shared.playerVoted[x]) {
              return;
        }
        }
      
    if (searchString.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)){
      
          shared.playlist = true
      
          return message.reply("directly playing a playlist is currently not supported.")
      
        } else {
          
            shared.playlist = false
          
            try {
              
                var video;
                    
                try {
                  video = await shared.youtube1.getVideo(searchString)
                } catch(error) {
                  video = await shared.youtube2.getVideo(searchString)
                }
                
                return handleVideo(video, message, voiceChannel);
                
            } catch(error) {
                try {
                    let index = 0;
                    var videos;
                  
                    try {
                        videos = await shared.youtube1.searchVideos(searchString, 10);
                    } catch (error) {
                        videos = await shared.youtube2.searchVideos(searchString, 10); 
                    }
                  
                    if (videos.length === 0) {
                        console.log(error)
                        var noresult = new Discord.RichEmbed()
                            .setColor("RED")
                            .setAuthor(message.author.tag, message.author.avatarURL)
                            .setThumbnail(message.guild.iconURL)
                            .setTitle("No results could be found.")
                            .setDescription(`Check if you've inputted your search string correctly.`)
                            .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
    
                        return message.channel.send(noresult).then(() => message.delete(10000))
                    }
                  
                    var vindex;
                  
                    let bicon = bot.user.displayAvatarURL
                    let videosEmbed = new Discord.RichEmbed()
                    .setColor(0x00bdf2)
                    .setTitle("Music Selection")
                    .setAuthor(message.author.tag, message.author.avatarURL)
                    .setThumbnail(message.guild.iconURL)
                    .addField("Provide a valid integer (1-10) to make a selection. \nClick " + bot.emojis.get("588269975798808588").toString() + " to cancel.", videos.map(video2 => `**${++index} -** ${video2.title.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<')
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
        .replace(/&#39;/g, "'")
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
                      
                        message.channel.fetchMessage(mid).then(m => m.delete());
                        shared.activeMusicSelection.splice(message.guild.id)
                      
                        if (vindex === "time") {
                          
                          var timeout = new Discord.RichEmbed()
                            .setColor("RED")
                            .setAuthor(message.author.tag, message.author.avatarURL)
                            .setThumbnail(message.guild.iconURL)
                            .setTitle("Music selection cancelled!")
                            .setDescription("Your music selection menu timed out. To maintain quality preformance, all music selection menus expire after 60 seconds.")
                            .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
    
                          return message.channel.send(timeout);
                          
                        } else if (vindex === "cancel") {
                          
                          var cancelmsg = new Discord.RichEmbed()
                            .setColor("RED")
                            .setAuthor(message.author.tag, message.author.avatarURL)
                            .setThumbnail(message.guild.iconURL)
                            .setTitle("Music selection cancelled!")
                            .setDescription("You have manually cancelled your music selection menu.")
                            .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
    
                          return message.channel.send(cancelmsg);
                          
                        } else {
                          
                          const videoIndex = parseInt(vindex);
                          
                          var video;
                          try {
                            video = await shared.youtube1.getVideoByID(videos[videoIndex - 1].id);
                            console.log("Music || API #1")
                          } catch (error) {
                            video = await shared.youtube2.getVideoByID(videos[videoIndex - 1].id);
                            console.log("Music || API #2")
                          }
                          
                        return handleVideo(video, message, voiceChannel);
                          
                        }
                      
                    }
                    
                    let videosChoice = new RC.Menu(
                                  videosEmbed,
                                  [
                                      { emoji: '588269975798808588',
                                          run: (user, message) => {
                                              vindex = "cancel"
                                              cancelled = true
                                              return detectSelection();
                                                  }
                                      },
                                  ],
                                  {
                                        owner: message.member.id
                                  }
                            )
                  
                    shared.handler.addMenus(videosChoice)
                  
                    var mid;
                      
                      message.channel.sendMenu(videosChoice).then(m => mid = m.id)
                      shared.activeMusicSelection.push(message.guild.id)
                  
			            try {
				              var response = await message.channel.awaitMessages(m => m.content >= 1 && m.content <= 10 && !m.content.includes("-") && !m.content.includes(".") && !m.content.includes(",") && !m.content.includes(" ") && message.author.id === m.author.id, {
					                max: 1,
					                time: 60000,
					                errors: ['time']
				            });
                      vindex = parseInt(response.first().content, 10);
                      message.channel.fetchMessage(response.first().id).then(m => m.delete)
			            } catch (err) {
                      if (cancelled) return cancelled = false
                      vindex = "time"
      }
                  return detectSelection();
                  
                } catch(err) {
                    console.log(error)
                    var searchError = new Discord.RichEmbed()
                        .setColor("RED")
                        .setAuthor(message.author.tag, message.author.avatarURL)
                        .setThumbnail(message.guild.iconURL)
                        .setTitle("An error occured whilst searching for your music!")
                        .setDescription(error)
                        .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
    
                    return message.channel.send(searchError)
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
        .replace(/&#39;/g, "'")
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
        var nosong = new Discord.RichEmbed()
          .setColor(0x00bdf2)
          .setAuthor(message.author.tag, message.author.avatarURL)
          .setThumbnail(message.guild.iconURL)
          .setTitle("Music Concluded")
          .setDescription(`All queued songs in \`${message.guild.name}\` have been played, and I have left the voice channel.`)
          .setFooter("MusEmbed™ | Clean Embeds, Crisp Music", bot.user.avatarURL)
    
        return serverQueue.textChannel.send(nosong);
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