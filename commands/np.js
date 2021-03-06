const Discord = require("discord.js"),
  { Util } = require("discord.js"),
  ytdl = require("ytdl-core"),
  opus = require("node-opus"),
  YouTube = require("simple-youtube-api");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = {
  name: "np",
  usage: "np",
  aliases: ["nowplaying"],
  description: "Shows the name of the currently playing song.",
  category: "Music",
  run: async (client, message, args, shared) => {
    const queue = shared.queue;
    const serverQueue = queue.get(message.guild.id);

    let voiceChannel, botVoiceConnection;
    if (message.member.voice) voiceChannel = message.member.voice.channel;
    if (message.guild.voice)
      botVoiceConnection = message.guild.voice.connection;

    if (!voiceChannel)
      return message.channel
        .send("You need to be in a voice channel to execute this command!")
        .then(message.delete());

    if (!serverQueue)
      return message.channel
        .send("Nothing is playing right now!")
        .then(message.delete());

    if (voiceChannel !== botVoiceConnection.channel)
      return message.channel
        .send("You need to be in my voice channel to execute this command!")
        .then(message.delete());

    let song = serverQueue.songs[0];
    let bicon = client.user.displayAvatarURL();
    let embed = new Discord.MessageEmbed()
      .setColor(config.embedColor)
      .setAuthor(message.guild.name, message.guild.iconURL())
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
    return message.channel.send(embed).then(message.delete());
  }
};
