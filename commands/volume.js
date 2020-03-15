const Discord = require("discord.js"),
  { Util } = require("discord.js"),
  ytdl = require("ytdl-core"),
  opus = require("node-opus"),
  YouTube = require("simple-youtube-api"),
  RC = require("reaction-core");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = {
  name: "volume",
  usage: "volume [integral value 0-10]",
  description:
    "Changes volume to the provided number. Shows current volume if arguments are not provided.",
  category: "Music",
  run: async (client, message, args, shared) => {
    const number = message.content.slice(shared.prefix.length + 7).trim();

    const queue = shared.queue;
    const serverQueue = queue.get(message.guild.id);

    let voiceChannel, botVoiceConnection;
    if (message.member.voice) voiceChannel = message.member.voice.channel;
    if (message.guild.voice)
      botVoiceConnection = message.guild.voice.connection;

    if (!voiceChannel)
      return message.channel.send(
        "You need to be in a voice channel to execute this command!"
      );

    if (!serverQueue) return await message.channel.send("Nothing is playing!");

    if (voiceChannel !== botVoiceConnection.channel)
      return message.channel.send(
        "You need to be in my voice channel to execute this command!"
      );

    if (
      !number ||
      number.includes("-") ||
      number.includes(".") ||
      number.includes(",") ||
      number.includes(" ")
    ) {
      var currentvol = new Discord.MessageEmbed()
        .setColor(0x00bdf2)
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle(`The current volume level is \`${serverQueue.volume}\`.`)
        .setDescription(
          `To change the volume, please provide a valid integer between \`0\` and \`10\` when using this command.`
        )
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp();
      return await message.channel.send(currentvol);
    }

    if (number >= 0 && number <= 10) {
      serverQueue.connection.dispatcher.setVolumeLogarithmic(
        parseInt(number) / 10
      );
      serverQueue.volume = parseInt(number);
      var vol = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle("Volume level changed!")
        .setDescription(`Volume level \`${number}\` has been set.`)
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp();
      return await message.channel.send(vol);
    }

    var currentvol = new Discord.MessageEmbed()
      .setColor(0x00bdf2)
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setThumbnail(client.user.displayAvatarURL())
      .setTitle(`The current volume level is \`${serverQueue.volume}\`.`)
      .setDescription(
        `To change the volume, please provide a valid integer between \`0\` and \`10\` when using this command.`
      )
      .setFooter(client.user.username, client.user.avatarURL())
      .setTimestamp();
    return await message.channel.send(currentvol);
  }
};
