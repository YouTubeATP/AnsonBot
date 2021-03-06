const Discord = require("discord.js"),
  db = require("quick.db");

const guildData = new db.table("GUILDDATA");

const config = require("/app/util/config"),
  fn = require("/app/util/fn");

module.exports = client => {
  client.on("roleUpdate", async (oldRole, newRole) => {
    let logChannelID = guildData.get(`${newRole.guild.id}.botlog`);
    let logChannel = client.channels.cache.get(logChannelID);
    if (!logChannel) return;

    if (oldRole.name !== newRole.name)
      return logChannel.send(
        new Discord.MessageEmbed()
          .setColor(config.embedColor)
          .setTitle("Role Name Updated")
          .setThumbnail(newRole.guild.iconURL())
          .addField("Role", `${newRole} (${newRole.name})`)
          .addField("Before", `${oldRole.name}`, true)
          .addField("After", `${newRole.name}`, true)
          .setFooter(client.user.username, client.user.avatarURL())
          .setTimestamp()
      );

    if (oldRole.color !== newRole.color)
      return logChannel.send(
        new Discord.MessageEmbed()
          .setColor(config.embedColor)
          .setTitle("Role Color Updated")
          .setThumbnail(newRole.guild.iconURL())
          .addField("Role", `${newRole} (${newRole.name})`)
          .addField("Before", `${oldRole.hexColor}`, true)
          .addField("After", `${newRole.hexColor}`, true)
          .setFooter(client.user.username, client.user.avatarURL())
          .setTimestamp()
      );

    if (oldRole.mentionable !== newRole.mentionable) {
      if (newRole.mentionable)
        return logChannel.send(
          new Discord.MessageEmbed()
            .setColor(config.embedColor)
            .setTitle("Role Mentionable")
            .setThumbnail(newRole.guild.iconURL())
            .addField("Role", `${newRole} (${newRole.name})`)
            .setFooter(client.user.username, client.user.avatarURL())
            .setTimestamp()
        );
      else
        return logChannel.send(
          new Discord.MessageEmbed()
            .setColor(config.embedColor)
            .setTitle("Role Unmentionable")
            .setThumbnail(newRole.guild.iconURL())
            .addField("Role", `${newRole} (${newRole.name})`)
            .setFooter(client.user.username, client.user.avatarURL())
            .setTimestamp()
        );
    }
  });
};
