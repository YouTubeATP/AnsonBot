const Discord = require("discord.js"),
  { Util } = require("discord.js"),
  ytdl = require("ytdl-core"),
  opus = require("node-opus"),
  YouTube = require("simple-youtube-api");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

let i;

module.exports = {
  name: "skip",
  usage: "skip",
  aliases: ["voteskip"],
  description:
    "Votes to skip the playing song.\nSong automatically skips if half or more people voted to skip.",
  category: "Music",
  run: async (client, message, args, shared) => {
    let sender = message.author;

    const queue = shared.queue;
    const serverQueue = queue.get(message.guild.id);

    message.delete().catch(O_o => {});

    let voiceChannel, botVoiceConnection;
    if (message.member.voice) voiceChannel = message.member.voice.channel;
    if (message.guild.voice)
      botVoiceConnection = message.guild.voice.connection;

    if (!voiceChannel)
      return message.channel.send(
        "You need to be in a voice channel to execute this command!"
      );

    if (!serverQueue)
      return message.channel.send("Nothing is playing right now!");

    if (voiceChannel !== botVoiceConnection.channel)
      return message.channel.send(
        "You need to be in my voice channel to execute this command!"
      );

    for (var x = 0; x < shared.playerVoted.length; x++) {
      if (sender === shared.playerVoted[x]) {
        return voteSkipFailMessage();
      }
    }

    shared.voted++;
    shared.playerVoted.push(sender);
    if (shared.voteSkipPass === 0) {
      voiceChannel.members.forEach(function() {
        shared.voteSkipPass++;
      });
    }

    var voteSkipPass1 = shared.voteSkipPass - 1;
    var voteSkip = Math.round(voteSkipPass1 / 2);
    if (voteSkip === 0) voteSkip = 1;

    if (shared.voted >= voteSkip) {
      var skip = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle("Your vote has been logged!")
        .setDescription(
          `The vote to skip the currently playing song has been passed, so it will be stopped.`
        )
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp();

      await message.channel.send(skip);
      serverQueue.connection.dispatcher.end();
      shared.voted = 0;
      shared.voteSkipPass = 0;
      shared.playerVoted = [];
    } else {
      var voteSkip = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle("Your vote has been logged!")
        .setDescription(
          shared.voted + "/" + voteSkip + " players voted to skip!"
        )
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp();

      await message.channel.send(voteSkip);
    }

    function voteSkipFailMessage() {
      var voteSkipPass1 = shared.voteSkipPass - 1;
      var voteSkip = Math.round(voteSkipPass1 / 2);
      if (voteSkip === 0) voteSkip = 1;
      var voteSkipFail = new Discord.MessageEmbed()
        .setColor("RED")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle("You've already voted to skip this song!")
        .setDescription(
          shared.voted + "/" + voteSkip + " players voted to skip!"
        )
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp();

      return message.channel.send(voteSkipFail);
    }

    return undefined;
  }
};
