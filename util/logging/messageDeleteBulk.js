const Discord = require("discord.js"),
  db = require("quick.db");

const guildData = new db.table("GUILDDATA");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = client => {
  client.on("messageDeleteBulk", async messages => {
    let logChannelID = guildData.get(`${messages.first().guild.id}.botlog`);
    let logChannel = client.channels.cache.get(logChannelID);
    if (!logChannel) return;

    logChannel.send(
      new Discord.MessageEmbed()
        .setColor(config.embedColor)
        .setTitle("Messages Bulk Deleted")
        .setThumbnail(messages.first().guild.iconURL())
        .setDescription(
          `${messages.size} messages bulk deleted in ${
            messages.first().channel
          }.`
        )
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp()
    );
  });
};
