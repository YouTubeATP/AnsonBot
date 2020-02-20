const Discord = require("discord.js"),
  { Util } = require("discord.js"),
  ytdl = require("ytdl-core"),
  opus = require("node-opus"),
  YouTube = require("simple-youtube-api"),
  RC = require("reaction-core");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = {
  name: "stop",
  usage: "stop",
  aliases: ["forceskip", "forcestop"],
  description:
    "Resets the queue and stops music.\nAlso forces bot to leave the voice channel.",
  category: "Music",
  guildPerms: ["MOVE_MEMBERS"],
  run: async (client, message, args, shared) => {
    const queue = shared.queue;
    const serverQueue = queue.get(message.guild.id);

    message.delete().catch(O_o => {});
    const voiceChannel = message.member.voiceChannel;
    const botVoiceConnection = message.guild.voiceConnection;

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

    if (!message.member.hasPermission("MOVE_MEMBERS"))
      return await message.reply("you don't have sufficient permissions!");

    shared.stopping = true;
    serverQueue.voiceChannel.leave();

    var stop = new Discord.RichEmbed()
      .setColor(config.embedColor)
      .setAuthor(message.author.tag, message.author.avatarURL)
      .setThumbnail(message.guild.iconURL)
      .setTitle("Music Terminated")
      .setDescription(
        `The queue for \`${message.guild.name}\` has been deleted, and I have left the voice channel.`
      )
      .setFooter(client.user.username, client.user.avatarURL)
      .setTimestamp();

    return message.channel.send(stop);
  }
};
