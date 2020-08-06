const Discord = require("discord.js"),
  { Util } = require("discord.js"),
  ytdl = require("ytdl-core"),
  opus = require("node-opus"),
  YouTube = require("simple-youtube-api");

module.exports = {
  name: "forceskip",
  usage: "forceskip",
  aliases: ["fs"],
  description:
    "Forcibly skips the currently playing song.",
  category: "Music",
  guildPerms: ["MOVE_MEMBERS"],
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

    var skip = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle("Song forcibly skipped!")
        .setDescription(
          `A moderator has decided to forcibly skip the currently playing song.`
        )
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp();

    await message.channel.send(skip);
    serverQueue.connection.dispatcher.end();
    shared.voted = 0;
    shared.voteSkipPass = 0;
    shared.playerVoted = [];

    return undefined;
  }
};
