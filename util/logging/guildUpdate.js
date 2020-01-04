const Discord = require("discord.js"),
  db = require("quick.db");

const guildData = new db.table("GUILDDATA");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = client => {
  client.on("guildUpdate", async (oldGuild, newGuild) => {
    let logChannelID = guildData.get(`${newGuild.id}.botlog`);
    let logChannel = client.channels.get(logChannelID);
    if (!logChannel) return;

    if (oldGuild.afkChannelID != newGuild.afkChannelID)
      return logChannel.send(
        new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setAuthor("Server AFK Channel Updated", newGuild.iconURL)
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
          .addField(
            "Before",
            `${oldGuild.owner} (${oldGuild.owner.user.tag})`,
            true
          )
          .addField(
            "After",
            `${newGuild.owner} (${newGuild.owner.user.tag})`,
            true
          )
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp()
      );

    if (oldGuild.splashURL != newGuild.splashURL)
      return logChannel.send(
        new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setAuthor("Server Splash Updated")
          .addField("Before", `[Link](${oldGuild.splashURL})`, true)
          .addField("After", `[Link](${newGuild.splashURL})`, true)
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp()
      );

    if (oldGuild.systemChannelID != newGuild.systemChannelID)
      return logChannel.send(
        new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setAuthor("Server AFK Channel Updated")
          .addField("Before", `${oldGuild.systemChannel}`, true)
          .addField("After", `${newGuild.systemChannel}`, true)
          .setFooter(client.user.username, client.user.avatarURL)
          .setTimestamp()
      );
  });
};
