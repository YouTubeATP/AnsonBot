const Discord = require("discord.js"),
  { Util } = require("discord.js"),
  ytdl = require("ytdl-core"),
  opus = require("node-opus"),
  YouTube = require("simple-youtube-api");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = {
  name: "queue",
  usage: "queue",
  description: "Shows the current queue of songs.",
  category: "Music",
  run: async (client, message, args, shared) => {
    const queue = shared.queue,
      serverQueue = queue.get(message.guild.id);

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

    let bicon = client.user.displayAvatarURL();
    let song = serverQueue.songs[0];

    var queueValue;

    if (
      !Array.isArray(serverQueue.songs.slice(1)) ||
      !serverQueue.songs.slice(1).length
    )
      queueValue = `There are no queued songs right now! To add another song to the queue, use the command \`${shared.customPrefix}play <song name/url>\` and make a selection.`;
    else
      queueValue = serverQueue.songs.slice(1).map(
        s =>
          `• [${s.title
            .replace("*", "*" + String.fromCharCode(8203))
            .replace("_", "_" + String.fromCharCode(8203))
            .replace(/&amp;/g, "&" + String.fromCharCode(8203))
            .replace(/&gt;/g, ">" + String.fromCharCode(8203))
            .replace(/&lt;/g, "<" + String.fromCharCode(8203))
            .replace(/&quot;/g, '"' + String.fromCharCode(8203))
            .replace(/&OElig;/g, "Œ" + String.fromCharCode(8203))
            .replace(/&oelig;/g, "œ" + String.fromCharCode(8203))
            .replace(/&Scaron;/g, "Š" + String.fromCharCode(8203))
            .replace(/&scaron;/g, "š" + String.fromCharCode(8203))
            .replace(/&Yuml;/g, "Ÿ" + String.fromCharCode(8203))
            .replace(/&circ;/g, "ˆ" + String.fromCharCode(8203))
            .replace(/&tilde;/g, "˜" + String.fromCharCode(8203))
            .replace(/&ndash;/g, "–" + String.fromCharCode(8203))
            .replace(/&mdash;/g, "—" + String.fromCharCode(8203))
            .replace(/&lsquo;/g, "‘" + String.fromCharCode(8203))
            .replace(/&rsquo;/g, "’" + String.fromCharCode(8203))
            .replace(/&#39;/g, "'" + String.fromCharCode(8203))
            .replace(/&#96;/g, "`" + String.fromCharCode(8203))
            .replace(/&#124;/g, "|" + String.fromCharCode(8203))
            .replace(/&sbquo;/g, "‚" + String.fromCharCode(8203))
            .replace(/&ldquo;/g, "“" + String.fromCharCode(8203))
            .replace(/&rdquo;/g, "”" + String.fromCharCode(8203))
            .replace(/&bdquo;/g, "„" + String.fromCharCode(8203))
            .replace(/&dagger;/g, "†" + String.fromCharCode(8203))
            .replace(/&Dagger;/g, "‡" + String.fromCharCode(8203))
            .replace(/&permil;/g, "‰" + String.fromCharCode(8203))
            .replace(/&lsaquo;/g, "‹" + String.fromCharCode(8203))
            .replace(/&rsaquo;/g, "›" + String.fromCharCode(8203))
            .replace(/&euro;/g, "€" + String.fromCharCode(8203))
            .replace(/&copy;/g, "©" + String.fromCharCode(8203))
            .replace(/&trade;/g, "™" + String.fromCharCode(8203))
            .replace(/&reg;/g, "®" + String.fromCharCode(8203))
            .replace(/&nbsp;/g, " " + String.fromCharCode(8203))
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203))}](${s.url})`
      );

    let queueEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setTitle(`Current Queue in Server: \`${message.guild.name}\``)
      .setColor(config.embedColor)
      .setThumbnail(message.guild.iconURL())
      .setDescription(`**Loop:** \`${serverQueue.loop}\``)
      .addField("Now Playing", `[${song.title}](${song.url})`)
      .addField("Queued Songs", queueValue)
      .setFooter(client.user.username, bicon)
      .setTimestamp();
    return await message.channel.send(queueEmbed).then(message.delete());
  }
};
