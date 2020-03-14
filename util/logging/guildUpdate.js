const Discord = require("discord.js"),
  db = require("quick.db");

const guildData = new db.table("GUILDDATA");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = client => {
  client.on("guildUpdate", async (oldGuild, newGuild) => {
    let logChannelID = guildData.get(`${newGuild.id}.botlog`);
    let logChannel = client.channels.cache.get(logChannelID);
    if (!logChannel) return;

    if (oldGuild.afkChannelID != newGuild.afkChannelID)
      return logChannel.send(
        new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setAuthor("Server AFK Channel Updated", newGuild.iconURL)
          .setThumbnail(newGuild.iconURL)
          .addField("Before", `${oldGuild.afkChannel}`, true)
          .addField("After", `${newGuild.afkChannel}`, true)
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp()
      );

    if (oldGuild.afkTimeout != newGuild.afkTimeout)
      return logChannel.send(
        new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setAuthor("Server AFK Timeout Updated", newGuild.iconURL)
          .setThumbnail(newGuild.iconURL)
          .addField("Before", `${oldGuild.afkTimeout / 60} minutes`, true)
          .addField("After", `${newGuild.afkTimeout / 60} minutes`, true)
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp()
      );

    if (oldGuild.iconURL != newGuild.iconURL)
      return logChannel.send(
        new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setAuthor("Server Icon Updated")
          .setThumbnail(newGuild.iconURL)
          .addField("Before", `[Link](${oldGuild.iconURL})`, true)
          .addField("After", `[Link](${newGuild.iconURL})`, true)
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp()
      );

    if (oldGuild.name != newGuild.name)
      return logChannel.send(
        new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setAuthor("Server Name Updated")
          .setThumbnail(newGuild.iconURL)
          .addField("Before", `${oldGuild.name}`, true)
          .addField("After", `${newGuild.name}`, true)
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp()
      );

    if (oldGuild.ownerID != newGuild.ownerID)
      return logChannel.send(
        new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setAuthor("Server Owner Updated")
          .setThumbnail(newGuild.iconURL)
          .addField(
            "Before",
            `${oldGuild.owner} (${oldGuild.owner.user.tag})`
          )
          .addField(
            "After",
            `${newGuild.owner} (${newGuild.owner.user.tag})`
          )
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp()
      );

    if (oldGuild.splashURL != newGuild.splashURL)
      return logChannel.send(
        new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setTitle("Server Splash Background Updated")
          .setThumbnail(newGuild.iconURL)
          .addField("Before", `[Link](${oldGuild.splashURL})`, true)
          .addField("After", `[Link](${newGuild.splashURL})`, true)
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp()
      );

    if (oldGuild.systemChannelID != newGuild.systemChannelID)
      return logChannel.send(
        new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setTitle("System Channel Updated")
          .setThumbnail(newGuild.iconURL)
          .addField("Before", `${oldGuild.systemChannel}`, true)
          .addField("After", `${newGuild.systemChannel}`, true)
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp()
      );
  });
};
