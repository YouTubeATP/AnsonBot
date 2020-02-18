const Discord = require("discord.js"),
  { Util } = require("discord.js"),
  ytdl = require("ytdl-core"),
  opus = require("node-opus"),
  YouTube = require("simple-youtube-api"),
  RC = require("reaction-core");

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

    let bicon = client.user.displayAvatarURL;
    let song = serverQueue.songs[0];

    var queueValue;

    if (
      !Array.isArray(serverQueue.songs.slice(1)) ||
      !serverQueue.songs.slice(1).length
    )
      queueValue = `There are no queued songs right now! To add another song to the queue, use the command \`${shared.prefix}play <song name/url>\` and make a selection.`;
    else
      queueValue = serverQueue.songs.slice(1).map(
        s =>
          `• [${s.title
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
            .replace(/&nbsp;/g, " ")}](${s.url})`
      );

    let queueEmbed = new Discord.RichEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL)
      .setTitle(`Current Queue in Server: \`${message.guild.name}\``)
      .setColor(0x00bdf2)
      .setThumbnail(message.guild.iconURL)
      .setDescription(`**Loop:** \`${serverQueue.loop}\``)
      .addField("Now Playing", `[${song.title}](${song.url})`)
      .addField("Queued Songs", queueValue)
      .setFooter(client.user.username, bicon)
      .setTimestamp();
    return await message.channel.send(queueEmbed);
  }
};
