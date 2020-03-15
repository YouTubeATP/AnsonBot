const Discord = require("discord.js"),
  { Util } = require("discord.js"),
  ytdl = require("ytdl-core"),
  opus = require("node-opus"),
  YouTube = require("simple-youtube-api"),
  RC = require("reaction-core");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = {
  name: "loop",
  usage: "loop",
  description:
    "Toggles to `single` when used once.\nToggles to `all` when used twice.\nToggles to `off` when used thrice.",
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

    if (serverQueue.loop === "off") {
      serverQueue.loop = "single";
      var single = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle("Loop mode toggled!")
        .setDescription(
          "Loop for the current queue has been toggled to `single`. Use this command again to toggle loop to `all`."
        )
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp();
      return message.channel.send(single);
    } else if (serverQueue.loop === "single") {
      serverQueue.loop = "all";
      var all = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle("Loop mode toggled!")
        .setDescription(
          "Loop for the current queue has been toggled to `all`. Use this command again to disable loop."
        )
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp();
      return message.channel.send(all);
    }
    serverQueue.loop = "off";
    var off = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setThumbnail(client.user.displayAvatarURL())
      .setTitle("Loop mode toggled!")
      .setDescription(
        "Loop for the current queue has been toggled `off`. Use this command again to toggle loop to `single`."
      )
      .setFooter(client.user.username, client.user.avatarURL())
      .setTimestamp();
    return message.channel.send(off);
  }
};
