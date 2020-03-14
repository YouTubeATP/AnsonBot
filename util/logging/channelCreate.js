const Discord = require("discord.js"),
  db = require("quick.db");

const guildData = new db.table("GUILDDATA");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = client => {
  client.on("channelCreate", async channel => {
    if (!channel.guild) return;
    let logChannelID = guildData.get(`${channel.guild.id}.botlog`);
    let logChannel = client.channels.cache.get(logChannelID);
    if (!logChannel) return;

    logChannel.send(
      new Discord.RichEmbed()
        .setColor(config.embedColor)
        .setThumbnail(channel.guild.iconURL)
        .setTitle(
          channel.type == "text" ||
            channel.type == "news" ||
            channel.type == "store" ||
            channel.type == "voice"
            ? "Channel Created"
            : "Category Created"
        )
        .addField(
          channel.type == "text" ||
            channel.type == "news" ||
            channel.type == "store"
            ? "Text Channel"
            : channel.type == "voice"
            ? "Voice Channel"
            : "Category",
          channel.type == "text" ||
            channel.type == "news" ||
            channel.type == "store"
            ? `${channel} (${channel.name})`
            : channel.type == "voice"
            ? `${channel.name}`
            : `${channel.name}`
        )
        .addField("ID", channel.id)
        .addField("Created", fn.time(channel.createdTimestamp))
        .setFooter(client.user.username, client.user.avatarURL)
        .setTimestamp()
    );
  });
};
