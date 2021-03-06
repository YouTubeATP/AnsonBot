const Discord = require("discord.js"),
  { Util } = require("discord.js"),
  ytdl = require("ytdl-core"),
  opus = require("node-opus"),
  YouTube = require("simple-youtube-api");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = {
  name: "pause",
  usage: "pause",
  description: "Pauses the current song.",
  category: "Music",
  run: async (client, message, args, shared) => {
    const queue = shared.queue,
      serverQueue = queue.get(message.guild.id);

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

    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause();

      var embed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setThumbnail(message.guild.iconURL())
        .setTitle("Music paused!")
        .setDescription(
          `Use the command \`${shared.customPrefix}resume\` to resume playing.`
        )
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp();

      return message.channel.send(embed);
    } else if (serverQueue && !serverQueue.playing) {
      var embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setThumbnail(message.guild.iconURL())
        .setTitle("Music alread paused!")
        .setDescription(
          `Use the command \`${shared.customPrefix}resume\` to resume playing.`
        )
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp();

      return message.channel.send(embed);
    } else return message.channel.send("Nothing is playing!");
  }
};
