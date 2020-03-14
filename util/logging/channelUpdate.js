const Discord = require("discord.js"),
  db = require("quick.db");

const guildData = new db.table("GUILDDATA");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = client => {
  client.on("channelUpdate", async (oldChannel, newChannel) => {
    let logChannelID = guildData.get(`${newChannel.guild.id}.botlog`);
    let logChannel = client.channels.cache.get(logChannelID);
    if (!logChannel) return;

    if (oldChannel.name != newChannel.name)
      return logChannel.send(
        new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setTitle("Channel Name Updated")
          .setThumbnail(newChannel.guild.iconURL)
          .addField(
            "Channel",
            newChannel.type == "text" ||
              newChannel.type == "news" ||
              newChannel.type == "store"
              ? `${newChannel} (#${newChannel.name})`
              : newChannel.type == "voice"
              ? `${newChannel.name}`
              : `${newChannel.name}`
          )
          .addField("Before", `${oldChannel.name}`, true)
          .addField("After", `${newChannel.name}`, true)
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp()
      );

    if (newChannel.type == "text" && oldChannel.topic != newChannel.topic)
      return logChannel.send(
        new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setTitle("Text Channel Topic Updated")
          .setThumbnail(newChannel.guild.iconURL)
          .addField("Channel", `${newChannel} (#${newChannel.name})`)
          .addField("Before", `${oldChannel.topic}`, true)
          .addField("After", `${newChannel.topic}`, true)
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp()
      );

    if (newChannel.type == "text" && oldChannel.nsfw != newChannel.nsfw)
      return logChannel.send(
        new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setTitle("Text Channel NSFW Updated")
          .setThumbnail(newChannel.guild.iconURL)
          .addField("Channel", `${newChannel} (#${newChannel.name})`)
          .addField("Before", `${oldChannel.nsfw ? "Yes" : "No"}`, true)
          .addField("After", `${newChannel.nsfw ? "Yes" : "No"}`, true)
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp()
      );

    if (
      newChannel.type == "text" &&
      oldChannel.rateLimitPerUser != newChannel.rateLimitPerUser
    )
      return logChannel.send(
        new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setTitle("Text Channel Slowmode Updated")
          .setThumbnail(newChannel.guild.iconURL)
          .addField("Channel", `${newChannel} (#${newChannel.name})`)
          .addField("Before", `${oldChannel.rateLimitPerUser} seconds`, true)
          .addField("After", `${newChannel.rateLimitPerUser} seconds`, true)
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp()
      );

    if (newChannel.type == "voice" && oldChannel.bitrate != newChannel.bitrate)
      return logChannel.send(
        new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setTitle("Voice Channel Bitrate Updated")
          .setThumbnail(newChannel.guild.iconURL)
          .addField("Channel", `${newChannel.name}`)
          .addField("Before", `${oldChannel.bitrate} kbps`, true)
          .addField("After", `${newChannel.bitrate} kbps`, true)
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp()
      );

    if (
      newChannel.type == "voice" &&
      oldChannel.userLimit != newChannel.userLimit
    )
      return logChannel.send(
        new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setTitle("Voice Channel User Limit Updated")
          .setThumbnail(newChannel.guild.iconURL)
          .addField("Channel", `${newChannel.name}`)
          .addField("Before", `${oldChannel.userLimit} users`, true)
          .addField("After", `${newChannel.userLimit} users`, true)
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp()
      );
  });
};
