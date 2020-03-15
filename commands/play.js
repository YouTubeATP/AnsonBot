const Discord = require("discord.js"),
  { Util } = require("discord.js"),
  ytdl = require("ytdl-core"),
  opus = require("node-opus"),
  YouTube = require("simple-youtube-api"),
  RC = require("reaction-core");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = {
  name: "play",
  usage: "play <song name/url>",
  description: "Searches for the song you requested.",
  category: "Music",
  run: async (client, message, args, shared) => {
    const queue = shared.queue;
    const serverQueue = queue.get(message.guild.id);
    const searchString = message.content.slice(shared.prefix.length + 5).trim();

    message.delete().catch(O_o => {});

    let voiceChannel, botVoiceConnection;
    if (message.member.voice) voiceChannel = message.member.voice.channel;
    if (message.guild.voice)
      botVoiceConnection = message.guild.voice.connection;

    let cancelled;

    if (!voiceChannel)
      return message.channel.send(
        "You need to be in a voice channel to execute this command!"
      );

    const permissions = voiceChannel.permissionsFor(client.user);

    if (!permissions.has("CONNECT")) {
      return client.users
        .fetch(message.member)
        .then(user => {
          user.send({
            embed: {
              color: config.embedColor,
              title: "I do not have sufficient permissions!",
              description: `I cannot connect to voice channels in the guild \`${message.guild.name}\`! Please notify a server administrator.`,
              timestamp: new Date(),
              footer: {
                icon_url: client.user.avatarURL(),
                text: client.user.username
              }
            }
          });
        })
        .then(message.delete());
    }

    if (!permissions.has("SPEAK")) {
      return client.users
        .fetch(message.member)
        .then(user => {
          user.send({
            embed: {
              color: config.embedColor,
              title: "I do not have sufficient permissions!",
              description: `I cannot speak in voice channels in the guild \`${message.guild.name}\`! Please notify a server administrator.`,
              timestamp: new Date(),
              footer: {
                icon_url: client.user.avatarURL(),
                text: client.user.username
              }
            }
          });
        })
        .then(message.delete());
    }

    if (!message.guild.me.hasPermission("ADD_REACTIONS")) {
      return client.users
        .fetch(message.member)
        .then(user => {
          user.send({
            embed: {
              color: config.embedColor,
              title: "I do not have sufficient permissions!",
              description: `I cannot add reactions to messages in the guild \`${message.guild.name}\`! Please notify a server administrator.`,
              timestamp: new Date(),
              footer: {
                icon_url: client.user.avatarURL(),
                text: client.user.username
              }
            }
          });
        })
        .then(message.delete());
    }

    if (!searchString)
      return message.reply(
        "please provide a search term, url or playlist link!"
      );
    if (shared.stopping) shared.stopping = false;

    for (var x = 0; x < shared.activeMusicSelection.length; x++) {
      if (message.author.id === shared.activeMusicSelection[x]) {
        var alreadySelection = new Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag, message.author.avatarURL())
          .setThumbnail(client.user.displayAvatarURL())
          .setTitle("You can't use this command right now!")
          .setDescription(
            "You've already opened a music selection menu! Either make a selection, manually cancel it or wait for it to expire before trying again."
          )
          .setFooter(client.user.username, client.user.avatarURL())
          .setTimestamp();

        return message.channel
          .send(alreadySelection)
          .then(m => m.delete(10000));
      }
    }

    if (
      searchString.match(
        /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/
      )
    ) {
      var nope = new Discord.MessageEmbed()
        .setColor("RED")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle("You can't play a playlist right now!")
        .setDescription(
          "We're finding the most efficient way to support this in the future. For now, however, sorry for the inconvenience caused."
        )
        .setFooter(client.user.username, client.user.avatarURL());

      return message.channel.send(nope).then(m => m.delete(10000));
    } else if (
      searchString.match(
        /^https?:\/\/(www.youtube.com|youtube.com)\/watch(.*)$/
      )
    ) {
      let video;

      try {
        video = await shared.youtube1.getVideo(searchString);
      } catch (error) {
        video = await shared.youtube2.getVideo(searchString);
      }

      return handleVideo(video, message, voiceChannel);
    } else {
      try {
        let index = 0;
        let videos;

        try {
          videos = await shared.youtube1.searchVideos(searchString, 10);
        } catch (error) {
          videos = await shared.youtube2.searchVideos(searchString, 10);
        }

        if (videos.length === 0) {
          var noresult = new Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor(message.author.tag, message.author.avatarURL())
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle("No results could be found.")
            .setDescription(
              `Check if you've inputted your search string correctly.`
            )
            .setFooter(client.user.username, client.user.avatarURL())
            .setTimestamp();

          return message.channel.send(noresult).then(m => m.delete(10000));
        }

        console.log(videos);

        const searchResult = videos.map(
          video2 =>
            `**${++index}.** ${video2.title
              .replace(/&amp;/g, "&")
              .replace(/&gt;/g, ">")
              .replace(/&lt;/g, "<")
              .replace(/&quot;/g, '"')
              .replace(/&OElig;/g, "Œ")
              .replace(/&oelig;/g, "œ")
              .replace(/&Scaron;/g, "Š")
              .replace(/&scaron;/g, "š")
              .replace(/&Yuml;/g, "Ÿ")
              .replace(/&circ;/g, "ˆ")
              .replace(/&tilde;/g, "˜")
              .replace(/&ndash;/g, "–")
              .replace(/&mdash;/g, "—")
              .replace(/&lsquo;/g, "‘")
              .replace(/&rsquo;/g, "’")
              .replace(/&#39;/g, "'")
              .replace(/&#96;/g, "`")
              .replace(/&#124;/g, "|")
              .replace(/&sbquo;/g, "‚")
              .replace(/&ldquo;/g, "“")
              .replace(/&rdquo;/g, "”")
              .replace(/&bdquo;/g, "„")
              .replace(/&dagger;/g, "†")
              .replace(/&Dagger;/g, "‡")
              .replace(/&permil;/g, "‰")
              .replace(/&lsaquo;/g, "‹")
              .replace(/&rsaquo;/g, "›")
              .replace(/&euro;/g, "€")
              .replace(/&copy;/g, "©")
              .replace(/&trade;/g, "™")
              .replace(/&reg;/g, "®")
              .replace(/&nbsp;/g, " ")}`
        );

        let vindex;

        let bicon = client.user.displayAvatarURL();
        let videosEmbed = new Discord.MessageEmbed()
          .setColor(config.embedColor)
          .setTitle("Music Selection")
          .setAuthor(message.author.tag, message.author.avatarURL())
          .setThumbnail(client.user.displayAvatarURL())
          .addField(
            "Provide a valid integer (1-10) to make a selection. \nClick " +
              client.emojis.cache.get("662296249717751869").toString() +
              " to cancel.",
            searchResult
          )
          .setFooter(client.user.username, bicon)
          .setTimestamp();

        async function detectSelection() {
          message.channel.messages.fetch(mid).then(m => m.delete());
          for (var x = 0; x < shared.activeMusicSelection.length; x++) {
            if (shared.activeMusicSelection[x] === message.author.id) {
              shared.activeMusicSelection.splice(x, 1);
            }
          }

          if (vindex === "time") {
            let timeout = new Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor(message.author.tag, message.author.avatarURL())
              .setThumbnail(client.user.displayAvatarURL())
              .setTitle("Music selection cancelled!")
              .setDescription(
                "Your music selection menu timed out. To maintain quality performance, all music selection menus expire after 60 seconds."
              )
              .setFooter(client.user.username, client.user.avatarURL())
              .setTimestamp();

            return message.channel.send(timeout).then(m => m.delete(10000));
          } else if (vindex === "cancel") {
            let cancelmsg = new Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor(message.author.tag, message.author.avatarURL())
              .setThumbnail(client.user.displayAvatarURL())
              .setTitle("Music selection cancelled!")
              .setDescription(
                "You have manually cancelled your music selection menu."
              )
              .setFooter(client.user.username, client.user.avatarURL())
              .setTimestamp();

            return message.channel.send(cancelmsg).then(m => m.delete(10000));
          } else {
            const videoIndex = parseInt(vindex);

            let video;
            try {
              video = await shared.youtube1.getVideoByID(
                videos[videoIndex - 1].id
              );
              console.log("Music || API #1");
            } catch (error) {
              video = await shared.youtube2.getVideoByID(
                videos[videoIndex - 1].id
              );
              console.log("Music || API #2");
            }

            return handleVideo(video, message, voiceChannel);
          }
        }

        let mid;

        await message.channel.send(videosEmbed).then(async m => {
          mid = m.id;
          m.react("662296249717751869");
          let reaction = await m
            .awaitReactions(
              (reaction, user) =>
                user.id == m.author.id &&
                ["662296249717751869"].includes(reaction.emoji.id),
              { time: 60 * 1000, max: 1, errors: ["time"] }
            )
            .catch(err => console.log(err));
          reaction = reaction.first();
          if (reaction.emoji.id === "662296249717751869") {
            cancelled = true;
            vindex = "cancel";
          }
        });
        shared.activeMusicSelection.push(message.author.id);

        try {
          let response = await message.channel.awaitMessages(
            m =>
              m.content >= 1 &&
              m.content <= 10 &&
              !m.content.includes("-") &&
              !m.content.includes(".") &&
              !m.content.includes(",") &&
              !m.content.includes(" ") &&
              message.author.id === m.author.id,
            {
              max: 1,
              time: 60000,
              errors: ["time"]
            }
          );
          if (cancelled) return (cancelled = false);
          vindex = parseInt(response.first().content, 10);
          message.channel.messages
            .fetch(response.first().id)
            .then(m => m.delete());
        } catch (err) {
          if (cancelled) return (cancelled = false);
          vindex = "time";
        }
        return detectSelection();
      } catch (err) {
        console.log(err);
        var searchError = new Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag, message.author.avatarURL())
          .setThumbnail(client.user.displayAvatarURL())
          .setTitle("An error occured whilst searching for your music!")
          .setDescription(err)
          .setFooter(client.user.username, client.user.avatarURL())
          .setTimestamp();

        return message.channel.send(searchError).then(m => m.delete(10000));
      }
    }

    async function handleVideo(video, message, voiceChannel, playlist = false) {
      const serverQueue = queue.get(message.guild.id);
      const song = {
        id: video.id,
        title: Util.escapeMarkdown(
          video.title
            .replace(/&amp;/g, "&")
            .replace(/&gt;/g, ">")
            .replace(/&lt;/g, "<")
            .replace(/&quot;/g, '"')
            .replace(/&OElig;/g, "Œ")
            .replace(/&oelig;/g, "œ")
            .replace(/&Scaron;/g, "Š")
            .replace(/&scaron;/g, "š")
            .replace(/&Yuml;/g, "Ÿ")
            .replace(/&circ;/g, "ˆ")
            .replace(/&tilde;/g, "˜")
            .replace(/&ndash;/g, "–")
            .replace(/&mdash;/g, "—")
            .replace(/&lsquo;/g, "‘")
            .replace(/&rsquo;/g, "’")
            .replace(/&#39;/g, "'")
            .replace(/&#96;/g, "`")
            .replace(/&#124;/g, "|")
            .replace(/&sbquo;/g, "‚")
            .replace(/&ldquo;/g, "“")
            .replace(/&rdquo;/g, "”")
            .replace(/&bdquo;/g, "„")
            .replace(/&dagger;/g, "†")
            .replace(/&Dagger;/g, "‡")
            .replace(/&permil;/g, "‰")
            .replace(/&lsaquo;/g, "‹")
            .replace(/&rsaquo;/g, "›")
            .replace(/&euro;/g, "€")
            .replace(/&copy;/g, "©")
            .replace(/&trade;/g, "™")
            .replace(/&reg;/g, "®")
            .replace(/&nbsp;/g, " ")
        ),
        thumbnail: video.thumbnails.default.url,
        url: `https://www.youtube.com/watch?v=${video.id}`,
        channel: video.channel.title,
        durationm: video.duration.minutes,
        durations: video.duration.seconds,
        durationh: video.duration.hours,
        durationd: video.duration.days,
        requested: message.author.id,
        guild: message.guild,
        publishedAt: video.publishedAt
      };

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

        try {
          var connection = await voiceChannel.join();
          queueConstruct.connection = connection;
          play(message.guild, queueConstruct.songs[0]);
        } catch (error) {
          console.error(error);
          queue.delete(message.guild.id);
          return message.channel.send({
            embed: {
              color: config.embedColor,
              description: "An error occured!",
              timestamp: new Date(),
              footer: {
                icon_url: client.user.avatarURL(),
                text: client.user.username
              }
            }
          });
        }
      } else {
        serverQueue.songs.push(song);
        if (playlist) return undefined;

        let bicon = client.user.displayAvatarURL();
        let queueemb = new Discord.MessageEmbed()
          .setColor(config.embedColor)
          .setTitle(`Song added to queue!`)
          .setAuthor(song.guild.name, song.guild.iconURL())
          .setDescription(
            `Something is already playing, so I've added your song to the end of the current queue. \n　`
          )
          .setThumbnail(song.thumbnail)
          .addField("Requested Song", `[${song.title}](${song.url})`)
          .addField("Uploaded by", song.channel, true)
          .addField("Requested by", `<@${song.requested}>`, true)
          .addField("Time of Publication", `${song.publishedAt}`, true)
          .addField(
            "Duration",
            `\`${song.durationd}\` Days, \`${song.durationh}\` Hours, \`${song.durationm}\` Minutes and \`${song.durations}\` Seconds`,
            true
          )
          .setFooter(client.user.username, bicon)
          .setTimestamp();
        return message.channel.send(queueemb);
      }
      return undefined;
    }

    function np(serverQueue) {
      let song = serverQueue.songs[0];
      let bicon = client.user.displayAvatarURL();
      let embed = new Discord.MessageEmbed()
        .setColor(config.embedColor)
        .setAuthor(song.guild.name, song.guild.iconURL())
        .setTitle(`Now Playing`)
        .setDescription(`[${song.title}](${song.url})`)
        .setThumbnail(song.thumbnail)
        .addField("Uploaded by", song.channel, true)
        .addField("Requested by", `<@${song.requested}>`, true)
        .addField("Time of Publication", `${song.publishedAt}`, true)
        .addField(
          "Duration",
          `\`${song.durationd}\` Days, \`${song.durationh}\` Hours, \`${song.durationm}\` Minutes and \`${song.durations}\` Seconds`,
          true
        )
        .setFooter(client.user.username, bicon)
        .setTimestamp();

      serverQueue.textChannel.send(embed);
    }

    function play(guild, song) {
      const serverQueue = queue.get(guild.id);
      if (shared.stopping) {
        queue.delete(guild.id);
        return;
      }

      if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        var nosong = new Discord.MessageEmbed()
          .setColor(config.embedColor)
          .setAuthor(message.author.tag, message.author.avatarURL())
          .setThumbnail(message.guild.iconURL())
          .setTitle("Music Concluded")
          .setDescription(
            `All queued songs in \`${message.guild.name}\` have been played, and I have left the voice channel.`
          )
          .setFooter(client.user.username, client.user.avatarURL())
          .setTimestamp();

        return serverQueue.textChannel.send(nosong);
      }

      const dispatcher = serverQueue.connection
        .play(ytdl(song.url), { bitrate: 512000 /* 512kbps */ })
        .on("finish", reason => {
          if (reason === "Stream is not generating quickly enough.") {
            console.log("Song ended.");
          } else console.log(reason);

          if (!serverQueue.songs) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            shared.voted = 0;
            shared.voteSkipPass = 0;
            shared.playerVoted = [];
            return undefined;
          }

          if (serverQueue.loop === "off") serverQueue.songs.shift();
          if (serverQueue.loop === "all")
            serverQueue.songs.push(serverQueue.songs.shift());

          shared.voted = 0;
          shared.voteSkipPass = 0;
          shared.playerVoted = [];
          play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
      dispatcher.setVolumeLogarithmic(serverQueue.volume / 10);
      if (song) {
        np(serverQueue);
      }
    }

    function sortObject() {
      var arr = [];
      for (var prop in shared.userData) {
        if (shared.userData.hasOwnProperty(prop)) {
          arr.push({
            key: prop,
            value: shared.userData[prop].money
          });
        }
      }
      arr.sort(function(a, b) {
        return b.value - a.value;
      });
      return arr;
    }
  }
};
