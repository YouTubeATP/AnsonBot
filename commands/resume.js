const Discord = require("discord.js"),
  { Util } = require("discord.js"),
  ytdl = require("ytdl-core"),
  opus = require("node-opus"),
  YouTube = require("simple-youtube-api"),
  RC = require("reaction-core");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = {
  name: "resume",
  usage: "resume",
  description: "Resumes a paused song.",
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

    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      var embed = new Discord.RichEmbed()
        .setColor("GREEN")
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setThumbnail(message.guild.iconURL)
        .setTitle("Music resumed!")
        .setDescription(
          `Use the command \`${shared.prefix}pause\` to pause the music.`
        )
        .setFooter(client.user.username, client.user.avatarURL)
        .setTimestamp();

      return message.channel.send(embed);
    }
    return message.channel.send(
      `Something is currently playing! Use ${shared.prefix}pause to pause the music.`
    );
  }
};
